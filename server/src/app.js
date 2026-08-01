import express from 'express';
import cors from 'cors';
import jobRoutes from './routes/jobRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import appRoutes from './routes/appRoutes.js';
import { config } from './config/index.js';

const app = express();

// Simple API key middleware for mutating endpoints (minimal, opt-in)
function apiKeyAuth(req, res, next) {
  const apiKey = process.env.API_KEY || '';
  // If no API key configured, do not enforce (development-friendly)
  if (!apiKey) return next();

  // Only protect state-changing methods
  const mutating = ['POST', 'PUT', 'DELETE'];
  if (!mutating.includes(req.method)) return next();

  const header = req.headers['x-api-key'] || req.headers['authorization'];
  if (!header) return res.status(401).json({ success: false, message: 'API key required' });
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  if (token !== apiKey) return res.status(403).json({ success: false, message: 'Invalid API key' });
  next();
}

// CORS — allow same-origin (no Origin header = Vercel frontend→API on same domain),
// localhost dev, and any explicitly configured CLIENT_URL.
const corsOptions = {
  origin: (origin, callback) => {
    // No origin = same-origin request (Vercel SSR, curl, server-to-server) — always allow
    if (!origin) return callback(null, true);

    const allowed = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173',
      'http://localhost:5000'
    ];
    if (config.clientUrl) allowed.push(config.clientUrl);

    // Only allow explicitly listed origins (remove broad vercel.app wildcard)
    if (allowed.includes(origin)) {
      return callback(null, true);
    }

    // Return a 403-compatible error (status set on the error object)
    const err = new Error(`CORS: origin ${origin} not allowed`);
    err.status = 403;
    callback(err);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
};

// In-memory rate limiter for AI endpoints (20 req/min per IP)
const aiRateLimitMap = new Map();
function aiRateLimit(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();
  const windowMs = 60_000;
  const max = 20;
  const entry = aiRateLimitMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    aiRateLimitMap.set(ip, { count: 1, start: now });
    return next();
  }
  if (entry.count >= max) {
    return res.status(429).json({ success: false, message: 'Too many requests. Please wait a minute.' });
  }
  entry.count++;
  aiRateLimitMap.set(ip, entry);
  next();
}

// Request logger
function requestLogger(req, _res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(requestLogger);

// Apply API key auth globally (protects mutating HTTP methods)
app.use(apiKeyAuth);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'JobHub AI REST API',
    timestamp: new Date().toISOString(),
    environment: config.env
  });
});

app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRateLimit, aiRoutes);
app.use('/api/applications', appRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: config.env === 'production' ? 'Internal Server Error' : err.message
  });
});

export default app;
