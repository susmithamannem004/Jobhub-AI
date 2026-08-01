import app from './src/app.js';
import { config } from './src/config/index.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 JobHub AI REST Server running on http://localhost:${PORT}`);
  console.log(`⚡ AI Mode: ${config.openaiApiKey ? 'OpenAI GPT-4o' : 'Rule-Based Heuristic Matcher'}`);
});
