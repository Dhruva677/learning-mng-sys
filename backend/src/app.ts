import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import authRoutes from './modules/auth/auth.routes';
import subjectsRoutes from './modules/subjects/subjects.routes';
import videosRoutes from './modules/videos/videos.routes';
import progressRoutes from './modules/progress/progress.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/progress', progressRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use(errorHandler);

export default app;
