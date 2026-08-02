import app from './src/app.js';
import { config, validateConfig } from './src/config/index.js';
import { info, warn, error as logError } from './src/utils/logger.js';

// Validate configuration and fail fast if necessary
try {
  validateConfig();
} catch (err) {
  logError('Configuration validation failed, exiting', err);
  process.exit(1);
}

const PORT = Number(config.port) || 5000;

const server = app.listen(PORT, () => {
  info(`🚀 JobHub AI REST Server running on http://localhost:${PORT}`);
  info(`⚡ AI Mode: ${config.openaiApiKey ? 'OpenAI GPT-4o' : 'Rule-Based Heuristic Matcher'}`);
});

function shutdown(code = 1) {
  logError('Shutting down server', { code });
  try {
    server.close(() => {
      process.exit(code);
    });
    // Force exit in 5s
    setTimeout(() => process.exit(code), 5000);
  } catch (e) {
    process.exit(code);
  }
}

process.on('uncaughtException', (err) => {
  logError('uncaughtException', err);
  shutdown(1);
});

process.on('unhandledRejection', (reason) => {
  logError('unhandledRejection', reason);
  // attempt graceful shutdown
  shutdown(1);
});
