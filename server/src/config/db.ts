import pg from 'pg';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

export interface DbClient {
  query: (sql: string, params?: any[]) => Promise<{ rows: any[]; rowCount: number }>;
  isPostgres: boolean;
}

let dbInstance: DbClient;

// Local JSON file database schema
interface LocalDatabase {
  users: any[];
  user_game_progress: any[];
  unlocked_stories: any[];
  store_items: any[];
  user_purchases: any[];
  sequences: {
    users: number;
    user_game_progress: number;
    unlocked_stories: number;
    store_items: number;
    user_purchases: number;
  };
}

const initDatabase = async (): Promise<DbClient> => {
  const databaseUrl = process.env.DATABASE_URL;

  // 1. Attempt Postgres connection if valid DATABASE_URL is configured
  if (databaseUrl && !databaseUrl.includes('localhost:5432/kathayatra')) {
    try {
      const pool = new pg.Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });

      const res = await pool.query('SELECT NOW()');
      console.log('✅ Connected to PostgreSQL Database successfully at', res.rows[0].now);

      await runPostgresMigrations(pool);

      dbInstance = {
        query: async (text: string, params?: any[]) => {
          const result = await pool.query(text, params);
          return { rows: result.rows, rowCount: result.rowCount || 0 };
        },
        isPostgres: true
      };
      return dbInstance;
    } catch (err: any) {
      console.warn('⚠️ PostgreSQL connection skipped:', err.message, '--> Initializing fast local persistent file storage.');
    }
  }

  // 2. Local zero-dependency persistent JSON storage engine
  const dataDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbFilePath = path.join(dataDir, 'katha_storage.json');
  let memoryDb: LocalDatabase;

  if (fs.existsSync(dbFilePath)) {
    try {
      memoryDb = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
    } catch {
      memoryDb = createFreshDb();
    }
  } else {
    memoryDb = createFreshDb();
    saveDb(dbFilePath, memoryDb);
  }

  console.log(`✅ Using Local Persistent Storage engine at: ${dbFilePath}`);

  dbInstance = {
    query: async (sqlText: string, params: any[] = []) => {
      const cleanSql = sqlText.trim();
      const lower = cleanSql.toLowerCase();

      // Handle SELECT
      if (lower.startsWith('select')) {
        // COUNT(*)
        if (lower.includes('count(*)')) {
          if (lower.includes('from store_items')) {
            return { rows: [{ count: memoryDb.store_items.length.toString() }], rowCount: 1 };
          }
          if (lower.includes('from unlocked_stories')) {
            const userId = params[0];
            const matching = memoryDb.unlocked_stories.filter(s => s.user_id === userId);
            return { rows: [{ count: matching.length.toString() }], rowCount: 1 };
          }
          if (lower.includes('from user_purchases')) {
            const userId = params[0];
            const matching = memoryDb.user_purchases.filter(p => p.user_id === userId);
            return { rows: [{ count: matching.length.toString() }], rowCount: 1 };
          }
        }

        // SUM(levels_completed)
        if (lower.includes('sum(levels_completed)')) {
          const userId = params[0];
          const matching = memoryDb.user_game_progress.filter(p => p.user_id === userId);
          const total = matching.reduce((acc, curr) => acc + (curr.levels_completed || 0), 0);
          return { rows: [{ total_levels: total.toString() }], rowCount: 1 };
        }

        // SELECT FROM users
        if (lower.includes('from users')) {
          if (lower.includes('where email = $1 or username = $2')) {
            const email = params[0];
            const username = params[1];
            const found = memoryDb.users.filter(u => u.email === email || u.username === username);
            return { rows: found, rowCount: found.length };
          }
          if (lower.includes('where email = $1')) {
            const email = params[0];
            const found = memoryDb.users.filter(u => u.email === email);
            return { rows: found, rowCount: found.length };
          }
          if (lower.includes('where id = $1')) {
            const id = params[0];
            const found = memoryDb.users.filter(u => u.id === id);
            return { rows: found, rowCount: found.length };
          }
        }

        // SELECT FROM user_game_progress
        if (lower.includes('from user_game_progress')) {
          const userId = params[0];
          if (lower.includes('and game_id = $2')) {
            const gameId = params[1];
            const found = memoryDb.user_game_progress.filter(p => p.user_id === userId && p.game_id === gameId);
            return { rows: found, rowCount: found.length };
          }
          const found = memoryDb.user_game_progress.filter(p => p.user_id === userId);
          return { rows: found, rowCount: found.length };
        }

        // SELECT FROM unlocked_stories
        if (lower.includes('from unlocked_stories')) {
          const userId = lower.includes('and user_id = $2') ? params[1] : params[0];
          if (lower.includes('where id = $1 and user_id = $2')) {
            const storyId = Number(params[0]);
            const found = memoryDb.unlocked_stories.filter(s => s.id === storyId && s.user_id === userId);
            return { rows: found, rowCount: found.length };
          }
          const found = memoryDb.unlocked_stories
            .filter(s => s.user_id === userId)
            .sort((a, b) => b.id - a.id);
          return { rows: found, rowCount: found.length };
        }

        // SELECT FROM store_items
        if (lower.includes('from store_items')) {
          if (lower.includes('where id = $1')) {
            const id = params[0];
            const found = memoryDb.store_items.filter(i => i.id === id);
            return { rows: found, rowCount: found.length };
          }
          return { rows: memoryDb.store_items, rowCount: memoryDb.store_items.length };
        }

        // SELECT FROM user_purchases
        if (lower.includes('from user_purchases')) {
          const userId = params[0];
          if (lower.includes('and item_id = $2')) {
            const itemId = params[1];
            const found = memoryDb.user_purchases.filter(p => p.user_id === userId && p.item_id === itemId);
            return { rows: found, rowCount: found.length };
          }
          const found = memoryDb.user_purchases.filter(p => p.user_id === userId);
          return { rows: found, rowCount: found.length };
        }
      }

      // Handle INSERT
      if (lower.startsWith('insert into users')) {
        const id = ++memoryDb.sequences.users;
        const newUser = {
          id,
          username: params[0],
          email: params[1],
          password_hash: params[2],
          age_group: params[3],
          preferred_domain: params[4],
          points: 50,
          current_streak: 1,
          last_login_date: new Date().toISOString().split('T')[0],
          avatar_url: params[5] || 'explorer',
          created_at: new Date().toISOString()
        };
        memoryDb.users.push(newUser);
        saveDb(dbFilePath, memoryDb);
        return { rows: [newUser], rowCount: 1 };
      }

      if (lower.startsWith('insert into user_game_progress')) {
        const id = ++memoryDb.sequences.user_game_progress;
        const newProgress = {
          id,
          user_id: params[0],
          game_id: params[1],
          levels_completed: params[2],
          total_score: params[3],
          updated_at: new Date().toISOString()
        };
        memoryDb.user_game_progress.push(newProgress);
        saveDb(dbFilePath, memoryDb);
        return { rows: [newProgress], rowCount: 1 };
      }

      if (lower.startsWith('insert into unlocked_stories')) {
        const id = ++memoryDb.sequences.unlocked_stories;
        const newStory = {
          id,
          user_id: params[0],
          domain: params[1],
          title: params[2],
          chapter_number: params[3],
          content: params[4],
          twist_ending: params[5],
          cliffhanger_question: params[6],
          unlocked_at: new Date().toISOString()
        };
        memoryDb.unlocked_stories.push(newStory);
        saveDb(dbFilePath, memoryDb);
        return { rows: [newStory], rowCount: 1 };
      }

      if (lower.startsWith('insert into store_items')) {
        const id = ++memoryDb.sequences.store_items;
        const newItem = {
          id,
          title: params[0],
          category: params[1],
          description: params[2],
          cost_points: params[3],
          video_url: params[4],
          thumbnail_url: params[5],
          duration_minutes: params[6],
          highlights: params[7]
        };
        memoryDb.store_items.push(newItem);
        saveDb(dbFilePath, memoryDb);
        return { rows: [newItem], rowCount: 1 };
      }

      if (lower.startsWith('insert into user_purchases')) {
        const id = ++memoryDb.sequences.user_purchases;
        const newPurchase = {
          id,
          user_id: params[0],
          item_id: params[1],
          purchased_at: new Date().toISOString()
        };
        memoryDb.user_purchases.push(newPurchase);
        saveDb(dbFilePath, memoryDb);
        return { rows: [newPurchase], rowCount: 1 };
      }

      // Handle UPDATE
      if (lower.startsWith('update users')) {
        if (lower.includes('current_streak = $1, points = $2, last_login_date = current_date where id = $3')) {
          const streak = params[0];
          const points = params[1];
          const id = params[2];
          const u = memoryDb.users.find(x => x.id === id);
          if (u) {
            u.current_streak = streak;
            u.points = points;
            u.last_login_date = new Date().toISOString().split('T')[0];
            saveDb(dbFilePath, memoryDb);
            return { rows: [u], rowCount: 1 };
          }
        }

        if (lower.includes('points = $1 where id = $2')) {
          const points = params[0];
          const id = params[1];
          const u = memoryDb.users.find(x => x.id === id);
          if (u) {
            u.points = points;
            saveDb(dbFilePath, memoryDb);
            return { rows: [u], rowCount: 1 };
          }
        }

        // Profile updates
        const id = params[params.length - 1];
        const u = memoryDb.users.find(x => x.id === id);
        if (u) {
          if (cleanSql.includes('avatar_url =')) {
            u.avatar_url = params[0];
          }
          if (cleanSql.includes('preferred_domain =')) {
            const idx = cleanSql.includes('avatar_url') ? 1 : 0;
            u.preferred_domain = params[idx];
          }
          if (cleanSql.includes('age_group =')) {
            const idx = (cleanSql.includes('avatar_url') ? 1 : 0) + (cleanSql.includes('preferred_domain') ? 1 : 0);
            u.age_group = params[idx];
          }
          saveDb(dbFilePath, memoryDb);
          return { rows: [u], rowCount: 1 };
        }
      }

      if (lower.startsWith('update user_game_progress')) {
        const levels = params[0];
        const score = params[1];
        const id = params[2];
        const p = memoryDb.user_game_progress.find(x => x.id === id);
        if (p) {
          p.levels_completed = levels;
          p.total_score = score;
          p.updated_at = new Date().toISOString();
          saveDb(dbFilePath, memoryDb);
          return { rows: [p], rowCount: 1 };
        }
      }

      return { rows: [], rowCount: 0 };
    },
    isPostgres: false
  };

  return dbInstance;
};

function createFreshDb(): LocalDatabase {
  return {
    users: [],
    user_game_progress: [],
    unlocked_stories: [],
    store_items: [],
    user_purchases: [],
    sequences: {
      users: 0,
      user_game_progress: 0,
      unlocked_stories: 0,
      store_items: 0,
      user_purchases: 0
    }
  };
}

function saveDb(filePath: string, db: LocalDatabase) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save persistent storage:', err);
  }
}

async function runPostgresMigrations(pool: pg.Pool) {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      age_group VARCHAR(20) NOT NULL DEFAULT '10-13',
      preferred_domain VARCHAR(100) NOT NULL DEFAULT 'Vedic & Indian Heritage',
      points INTEGER NOT NULL DEFAULT 0,
      current_streak INTEGER NOT NULL DEFAULT 1,
      last_login_date DATE DEFAULT CURRENT_DATE,
      avatar_url VARCHAR(255) DEFAULT 'explorer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_game_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      game_id VARCHAR(100) NOT NULL,
      levels_completed INTEGER NOT NULL DEFAULT 0,
      total_score INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_user_game UNIQUE (user_id, game_id)
    );

    CREATE TABLE IF NOT EXISTS unlocked_stories (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      domain VARCHAR(100) NOT NULL,
      title VARCHAR(255) NOT NULL,
      chapter_number INTEGER NOT NULL,
      content TEXT NOT NULL,
      twist_ending TEXT NOT NULL,
      cliffhanger_question TEXT,
      unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS store_items (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      cost_points INTEGER NOT NULL,
      video_url VARCHAR(255) NOT NULL,
      thumbnail_url VARCHAR(255) NOT NULL,
      duration_minutes INTEGER DEFAULT 8,
      highlights TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS user_purchases (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      item_id INTEGER REFERENCES store_items(id) ON DELETE CASCADE,
      purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_user_item UNIQUE(user_id, item_id)
    );
  `;
  await pool.query(schema);
  console.log('✅ PostgreSQL Schema tables initialized.');
}

export const getDb = async (): Promise<DbClient> => {
  if (!dbInstance) {
    dbInstance = await initDatabase();
  }
  return dbInstance;
};
