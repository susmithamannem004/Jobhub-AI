import { config } from '../config/index.js';

const TECH_SKILLS_TAXONOMY = [
  'React', 'Node.js', 'Express', 'JavaScript', 'TypeScript', 'Tailwind CSS',
  'HTML5', 'CSS3', 'Vite', 'Redux', 'Axios', 'REST API', 'GraphQL', 'Python',
  'Django', 'FastAPI', 'Java', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'Vercel', 'CI/CD', 'GitHub Actions', 'Git',
  'Unit Testing', 'Jest', 'Cypress', 'Framer Motion', 'System Design', 'Agile'
];

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

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API status ${response.status}`);
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return {
    ...parsed,
    engine: 'OpenAI GPT-4o-mini'
  };
}

async function generateCoverLetterOpenAI({ jobTitle, company, jobDescription, candidateName, resumeText }) {
  const prompt = `Write a professional cover letter for "${candidateName}" applying for "${jobTitle}" at "${company}".
  
Job Description:
${jobDescription}

Resume:
${resumeText}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API status ${response.status}`);
  }

  const data = await response.json();
  return {
    coverLetter: data.choices[0].message.content.trim(),
    engine: 'OpenAI GPT-4o-mini'
  };
}
