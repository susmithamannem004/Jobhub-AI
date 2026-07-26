import app from './src/app.js';
import { config } from './src/config/index.js';

app.listen(config.port, () => {
  console.log(`🚀 JobHub AI REST Server running on http://localhost:${config.port}`);
  console.log(`⚡ AI Mode: ${config.openaiApiKey ? 'OpenAI GPT-4o' : 'Rule-Based Heuristic Matcher'}`);
});
