import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import apiRoutes from './routes/api.js';
import { getDb } from './config/db.js';
import { seedDatabase } from './services/seedService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Router
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Katha Yatra Backend API',
    timestamp: new Date().toISOString()
  });
});

// Production client serving
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve(process.cwd(), '../client/dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Start server and initialize DB
async function bootstrap() {
  try {
    await getDb();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 Katha Yatra Server running at http://localhost:${PORT}`);
      console.log(`📚 Cultural & Civilizational Gamified Learning Platform`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start Katha Yatra server:', error);
    process.exit(1);
  }
}

bootstrap();
