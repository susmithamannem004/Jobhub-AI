import express from 'express';
import cors from 'cors';
import jobRoutes from './routes/jobRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import appRoutes from './routes/appRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'JobHub AI REST API Engine',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/applications', appRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

export default app;
