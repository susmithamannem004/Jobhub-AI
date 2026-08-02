import { config } from '../config/index.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { warn, error as logError } from '../utils/logger.js';

// Helper: fetch with timeout, basic retry for 429, and robust JSON parsing
async function robustFetch(url, options = {}, { timeout = 8000, retries = 2 } = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  let attempt = 0;
  while (attempt <= retries) {
    attempt += 1;
    try {
      const resp = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      if (!resp.ok) {
        // Retry on 429
        if (resp.status === 429 && attempt <= retries) {
          warn(`OpenAI rate limited (attempt ${attempt})`);
          await new Promise(r => setTimeout(r, 500 * attempt));
          continue;
        }
        const text = await resp.text().catch(() => '');
        const err = new Error(`Upstream API returned ${resp.status}: ${text}`);
        err.status = resp.status;
        throw err;
      }

      const text = await resp.text().catch(() => null);
      if (!text) return null;
      try {
        return JSON.parse(text);
      } catch (parseErr) {
        // Some OpenAI responses may include plain text — return raw text under a wrapper
        return { rawText: text };
      }
    } catch (err) {
      // AbortError means timeout
      if (err.name === 'AbortError') {
        if (attempt <= retries) {
          warn('Fetch aborted due to timeout, retrying', attempt);
          continue;
        }
        throw new Error('Request timed out');
      }
      // Network or other errors: retry a couple times
      if (attempt <= retries) {
        warn('Fetch error, retrying', err.message);
        await new Promise(r => setTimeout(r, 250 * attempt));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Failed to fetch after retries');
}

const TECH_SKILLS_TAXONOMY = [
  'React', 'Node.js', 'Express', 'JavaScript', 'TypeScript', 'Tailwind CSS',
  'HTML5', 'CSS3', 'Vite', 'Redux', 'Axios', 'REST API', 'GraphQL', 'Python',
  'Django', 'FastAPI', 'Java', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'Vercel', 'CI/CD', 'GitHub Actions', 'Git',
  'Unit Testing', 'Jest', 'Cypress', 'Framer Motion', 'System Design', 'Agile'
];

export async function parseResumePdf(buffer) {
  try {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error('Invalid PDF buffer provided.');
    }

    const loadingTask = pdfjsLib.getDocument({ data: buffer, disableWorker: true });
    const pdf = await loadingTask.promise;
    const pageTexts = [];

    for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
      const page = await pdf.getPage(pageIndex);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ').trim();
      if (pageText.length) {
        pageTexts.push(pageText);
      }
    }

    const text = pageTexts.join(' ').replace(/\s+/g, ' ').trim();
    if (text.length < 20) {
      throw new Error('Parsed PDF contains insufficient text.');
    }

    return text;
  } catch (error) {
    logError('parseResumePdf failed', error);
    throw new Error(`Failed to extract text from PDF: ${error?.message || String(error)}`);
  }
}

export async function analyzeResumeFit({ jobTitle = '', jobDescription = '', requirements = [], resumeText = '' }) {
  if (config.openaiApiKey) {
    try {
      const openAiResult = await analyzeWithOpenAI({ jobTitle, jobDescription, requirements, resumeText });
      if (openAiResult) return openAiResult;
    } catch (err) {
      console.warn('OpenAI API call failed, falling back to heuristic engine:', err.message);
    }
  }

  return analyzeWithHeuristic({ jobTitle, jobDescription, requirements, resumeText });
}

export async function generateCoverLetter({ jobTitle = '', company = '', jobDescription = '', candidateName = 'Job Candidate', resumeText = '' }) {
  if (config.openaiApiKey) {
    try {
      const result = await generateCoverLetterOpenAI({ jobTitle, company, jobDescription, candidateName, resumeText });
      if (result) return result;
    } catch (err) {
      console.warn('OpenAI cover letter call failed, falling back to heuristic engine:', err.message);
    }
  }

  return generateCoverLetterHeuristic({ jobTitle, company, jobDescription, candidateName, resumeText });
}

function analyzeWithHeuristic({ jobTitle, jobDescription, requirements, resumeText }) {
  const combinedJobText = `${jobTitle} ${jobDescription} ${requirements.join(' ')}`.toLowerCase();
  const normalizedResume = (resumeText || '').toLowerCase();

  const jobSkills = TECH_SKILLS_TAXONOMY.filter(skill => 
    combinedJobText.includes(skill.toLowerCase())
  );

  const finalJobSkills = jobSkills.length > 0 ? jobSkills : ['React', 'Node.js', 'REST API', 'JavaScript'];

  const matchingSkills = [];
  const missingSkills = [];

  finalJobSkills.forEach(skill => {
    if (normalizedResume.includes(skill.toLowerCase())) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const baseMatch = finalJobSkills.length > 0 ? (matchingSkills.length / finalJobSkills.length) * 100 : 70;
  const lengthBonus = Math.min(15, Math.floor((resumeText.length || 0) / 100));
  const finalScore = Math.min(98, Math.max(35, Math.round(baseMatch * 0.85 + lengthBonus)));

  let summary = `Your background shows a ${finalScore >= 75 ? 'strong' : 'moderate'} match for the ${jobTitle} role.`;
  if (matchingSkills.length > 0) {
    summary += ` You demonstrate solid proficiency in key requirements such as ${matchingSkills.slice(0, 3).join(', ')}.`;
  }
  if (missingSkills.length > 0) {
    summary += ` Highlighting experience with ${missingSkills.slice(0, 2).join(', ')} would further boost your application fit score.`;
  }

  const tips = [
    `Explicitly mention past projects built with ${missingSkills[0] || 'modern web technologies'} in your technical experience bullets.`,
    `Quantify engineering impacts (e.g. 'boosted REST API throughput by 40% with Node.js & caching').`,
    `Align key terminology in your resume summary with terms used in the ${jobTitle} job description.`
  ];

  return {
    matchScore: finalScore,
    matchingSkills,
    missingSkills,
    summary,
    tips,
    engine: 'JobHub Heuristic AI v1.2'
  };
}

function generateCoverLetterHeuristic({ jobTitle, company, candidateName, resumeText }) {
  const extractedSkills = TECH_SKILLS_TAXONOMY.filter(skill => 
    (resumeText || '').toLowerCase().includes(skill.toLowerCase())
  ).slice(0, 4);

  const skillStr = extractedSkills.length > 0 ? extractedSkills.join(', ') : 'React, Node.js, and RESTful architectures';

  const letter = `Dear Hiring Team at ${company || 'your company'},

I am writing to express my enthusiastic interest in the ${jobTitle || 'Software Engineer'} position at ${company || 'your organization'}. With proven experience delivering high-performance full-stack applications, I am eager to contribute to your team's success.

My core skill set includes expertise in ${skillStr}. In my recent project work, I have focused on modular architecture, clean REST API design, responsive UI workflows, and frontend optimization.

I am particularly excited about ${company || 'this role'} because of your commitment to engineering quality and innovation. I am confident that my technical skills, proactive problem-solving, and dedication to crafting high-quality software make me a strong candidate for this role.

Thank you for reviewing my application. I look forward to the possibility of discussing how my experience fits your team's upcoming goals.

Warm regards,
${candidateName || 'Candidate'}
`.trim();

  return {
    coverLetter: letter,
    engine: 'JobHub Smart Cover Generator'
  };
}

async function analyzeWithOpenAI({ jobTitle, jobDescription, requirements, resumeText }) {
  const prompt = `Analyze this candidate resume against the job posting. Return ONLY valid JSON with keys: matchScore (integer 0-100), matchingSkills (array of strings), missingSkills (array of strings), summary (string), tips (array of strings).
Job Title: ${jobTitle}
Requirements: ${requirements.join(', ')}
Description: ${jobDescription}

Candidate Resume:
${resumeText}`;

  const body = JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    // Keep response flexible; we'll parse text if JSON wrapper isn't present
  });

  const data = await robustFetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.openaiApiKey}`
    },
    body
  }, { timeout: 12000, retries: 2 });

  if (!data) throw new Error('Empty response from OpenAI');

  // If the wrapper is present
  if (data.choices && Array.isArray(data.choices) && data.choices[0]) {
    const msg = data.choices[0].message?.content || data.choices[0].text || '';
    // Try structured JSON first
    try {
      const parsed = typeof msg === 'string' ? JSON.parse(msg) : msg;
      return { ...parsed, engine: 'OpenAI GPT-4o-mini' };
    } catch (parseErr) {
      // If we couldn't parse JSON, attempt to extract JSON substring
      const jsonMatch = String(msg).match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return { ...parsed, engine: 'OpenAI GPT-4o-mini' };
        } catch (_) {
          logError('OpenAI returned non-JSON message content');
        }
      }
      throw new Error('OpenAI returned non-JSON response for analyzeWithOpenAI');
    }
  }

  // If openAI returned rawText wrapper
  if (data.rawText) {
    throw new Error('OpenAI returned unexpected response format');
  }
  throw new Error('Unexpected OpenAI response');
}

async function generateCoverLetterOpenAI({ jobTitle, company, jobDescription, candidateName, resumeText }) {
  const prompt = `Write a professional cover letter for "${candidateName}" applying for "${jobTitle}" at "${company}".
  
Job Description:
${jobDescription}

Resume:
${resumeText}`;

  const body = JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }] });

  const data = await robustFetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.openaiApiKey}`
    },
    body
  }, { timeout: 12000, retries: 2 });

  if (!data) throw new Error('Empty response from OpenAI');
  if (!data.choices || !Array.isArray(data.choices) || !data.choices[0]) {
    throw new Error('OpenAI returned unexpected choices format');
  }

  const content = data.choices[0].message?.content || data.choices[0].text || '';
  if (!content) throw new Error('OpenAI returned empty message content');

  return {
    coverLetter: String(content).trim(),
    engine: 'OpenAI GPT-4o-mini'
  };
}
