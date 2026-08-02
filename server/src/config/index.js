import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  clientUrl: process.env.CLIENT_URL || '',
};

// Validate essential config at startup. Throws on fatal misconfiguration.
export function validateConfig() {
  const errors = [];
  // PORT must be a number
  const port = Number(config.port);
  if (Number.isNaN(port) || port <= 0 || port > 65535) {
    errors.push(`Invalid PORT value: ${config.port}`);
  }

  // NODE_ENV should be one of known values
  const allowedEnvs = ['development', 'production', 'test'];
  if (!allowedEnvs.includes(config.env)) {
    errors.push(`Invalid NODE_ENV value: ${config.env}`);
  }

  // OPENAI key is optional but warn when absent in production
  if (config.env === 'production' && !config.openaiApiKey) {
    errors.push('OPENAI_API_KEY is not set (required in production for AI features)');
  }

  if (errors.length) {
    const err = new Error('Configuration validation failed: ' + errors.join('; '));
    err.details = errors;
    throw err;
  }
}
