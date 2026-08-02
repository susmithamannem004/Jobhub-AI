import express from 'express';
import cors from 'cors';
import jobRoutes from './routes/jobRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import appRoutes from './routes/appRoutes.js';
import { config } from './config/index.js';
import errorHandler from './middleware/errorHandler.js';
import { info } from './utils/logger.js';
import path from 'path';
import fs from 'fs';

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
    // No origin = same-origin request (Vercel frontend → API on same domain), curl, server-to-server — always allow
    if (!origin) return callback(null, true);

    const allowed = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173',
      'http://localhost:5000'
    ];
    if (config.clientUrl) allowed.push(config.clientUrl);
    if (process.env.URL) allowed.push(process.env.URL);
    if (process.env.VERCEL_URL) allowed.push(`https://${process.env.VERCEL_URL}`);

    // Only allow explicitly listed origins
    if (allowed.includes(origin)) {
      return callback(null, true);
    }

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
// Add a request id and structured request logging
function requestId(req, _res, next) {
  req.requestId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  next();
}

function requestLogger(req, _res, next) {
  info(`${req.method} ${req.originalUrl}`, { requestId: req.requestId });
  next();
}

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(requestId);
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

// Root welcome route to avoid confusing 404s on '/'
app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'JobHub AI REST API',
    routes: ['/api/health', '/api/jobs', '/api/ai/cover-letter', '/api/ai/match', '/api/ai/match-pdf']
  });
});

// Serve client static files (prefer built `dist` if present)
try {
  const clientDir = path.resolve(__dirname, '../../client');
  const distDir = path.join(clientDir, 'dist');
  const serveDir = fs.existsSync(distDir) ? distDir : clientDir;
  app.use(express.static(serveDir));

  // SPA fallback: serve index.html for GET requests not handled by API
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api/')) return next();
    const indexPath = path.join(serveDir, 'index.html');
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    return next();
  });
} catch (err) {
  info('Static client serve skipped:', err.message);
}

// Minimal OpenAPI JSON and Swagger UI viewer (no extra deps)
const openApiSpec = {
  openapi: '3.0.0',
  info: { title: 'JobHub AI API', version: '1.0.0' },
  paths: {
    '/api/health': { get: { summary: 'Health check' } },
    '/api/jobs': { get: { summary: 'List jobs' } },
    '/api/ai/cover-letter': { post: { summary: 'Generate cover letter' } },
    '/api/ai/match': { post: { summary: 'Match resume to job' } },
    '/api/ai/match-pdf': { post: { summary: 'Match resume PDF' } }
  }
};

app.get('/api/docs', (_req, res) => res.json(openApiSpec));

app.get('/api/docs/ui', (_req, res) => {
  res.type('html').send(`<!doctype html><html><head><title>API Docs</title><link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4/swagger-ui.css"></head><body><div id="swagger"></div><script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js"></script><script>window.onload=function(){SwaggerUIBundle({url:'/api/docs',dom_id:'#swagger'});};</script></body></html>`);
});

app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRateLimit, aiRoutes);
app.use('/api/applications', appRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler (centralized)
app.use(errorHandler);

export default app;
