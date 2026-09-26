import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../config/db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_katha_yatra_2026';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, ageGroup, preferredDomain, avatarUrl } = req.body;
    const db = await getDb();

    // Check existing email or username
    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email.toLowerCase().trim(), username.trim()]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'A user with this email or username already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatar = avatarUrl || 'explorer';

    const insertResult = await db.query(
      `INSERT INTO users (username, email, password_hash, age_group, preferred_domain, points, current_streak, last_login_date, avatar_url)
       VALUES ($1, $2, $3, $4, $5, 50, 1, CURRENT_DATE, $6)
       RETURNING id, username, email, age_group, preferred_domain, points, current_streak, last_login_date, avatar_url, created_at`,
      [username.trim(), email.toLowerCase().trim(), passwordHash, ageGroup, preferredDomain, avatar]
    );

    const user = insertResult.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      message: 'Welcome to Katha Yatra! +50 Explorer Welcome Points awarded!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        age_group: user.age_group,
        preferred_domain: user.preferred_domain,
        points: user.points,
        current_streak: user.current_streak,
        last_login_date: user.last_login_date,
        avatar_url: user.avatar_url,
        created_at: user.created_at
      }
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const db = await getDb();

    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Daily streak and login calculation
    const today = new Date().toISOString().split('T')[0];
    let streak = user.current_streak || 1;
    let points = user.points || 0;
    let streakBonusAwarded = false;

    if (user.last_login_date) {
      const lastLogin = new Date(user.last_login_date).toISOString().split('T')[0];
      const todayDate = new Date(today);
      const lastDate = new Date(lastLogin);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        // Consecutive day!
        streak += 1;
        points += 20;
        streakBonusAwarded = true;
      } else if (diffDays > 1) {
        // Streak broken
        streak = 1;
        points += 20;
        streakBonusAwarded = true;
      }
      // If diffDays === 0 (already logged in today), streak stays the same
    }

    await db.query(
      'UPDATE users SET current_streak = $1, points = $2, last_login_date = CURRENT_DATE WHERE id = $3',
      [streak, points, user.id]
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.json({
      message: streakBonusAwarded
        ? `Welcome back! Streak level ${streak} active! +20 Daily Streak Points awarded!`
        : 'Welcome back to Katha Yatra!',
      token,
      streakBonusAwarded,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        age_group: user.age_group,
        preferred_domain: user.preferred_domain,
        points: points,
        current_streak: streak,
        last_login_date: today,
        avatar_url: user.avatar_url,
        created_at: user.created_at
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to log in. Please try again.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const result = await db.query(
      `SELECT id, username, email, age_group, preferred_domain, points, current_streak, last_login_date, avatar_url, created_at
       FROM users WHERE id = $1`,
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get total unlocked stories count and total levels completed
    const storiesCountRes = await db.query(
      'SELECT COUNT(*) as count FROM unlocked_stories WHERE user_id = $1',
      [req.user!.id]
    );
    const purchasesCountRes = await db.query(
      'SELECT COUNT(*) as count FROM user_purchases WHERE user_id = $1',
      [req.user!.id]
    );
    const gameProgressRes = await db.query(
      'SELECT SUM(levels_completed) as total_levels FROM user_game_progress WHERE user_id = $1',
      [req.user!.id]
    );

    return res.json({
      user,
      stats: {
        unlockedStoriesCount: parseInt(storiesCountRes.rows[0]?.count || '0', 10),
        purchasedVideosCount: parseInt(purchasesCountRes.rows[0]?.count || '0', 10),
        totalLevelsCompleted: parseInt(gameProgressRes.rows[0]?.total_levels || '0', 10)
      }
    });
  } catch (err: any) {
    console.error('GetMe error:', err);
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { avatarUrl, preferredDomain, ageGroup } = req.body;
    const db = await getDb();

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (avatarUrl) {
      updates.push(`avatar_url = $${paramIndex++}`);
      params.push(avatarUrl);
    }
    if (preferredDomain) {
      updates.push(`preferred_domain = $${paramIndex++}`);
      params.push(preferredDomain);
    }
    if (ageGroup) {
      updates.push(`age_group = $${paramIndex++}`);
      params.push(ageGroup);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update.' });
    }

    params.push(req.user!.id);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}
      RETURNING id, username, email, age_group, preferred_domain, points, current_streak, last_login_date, avatar_url, created_at`;

    const result = await db.query(query, params);
    return res.json({ message: 'Profile updated successfully', user: result.rows[0] });
  } catch (err: any) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
};
