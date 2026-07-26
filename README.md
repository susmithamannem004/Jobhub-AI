# 🚀 JobHub AI

[![CI/CD Pipeline](https://github.com/susmithamannem004/JobHub-AI/actions/workflows/ci-cd.yml/badge.svg?branch=main)](https://github.com/susmithamannem004/JobHub-AI/actions/workflows/ci-cd.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-jobhub--ai--kohl.vercel.app-brightgreen?logo=vercel)](https://jobhub-ai-kohl.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-susmithamannem004%2FJobhub--AI-black?logo=github)](https://github.com/susmithamannem004/Jobhub-AI)

## Overview

JobHub AI is a polished career platform for developers built with a modern React frontend and Express backend. It helps users discover job opportunities, evaluate fit with AI, generate tailored cover letters, and manage application progress with a workflow-focused tracker.

## What it does

- Search and filter job listings by title, location, employment type, and salary
- Match resumes to opportunities using a hybrid AI engine
- Generate personalized cover letters on demand
- Track applications across stages with a Kanban-style board
- Post new jobs and maintain listings using a lightweight JSON-backed datastore
- Deploy seamlessly as a monorepo on Vercel

## Core Features

- **AI-driven fit scoring** using GPT-4o when available, with a robust TF-IDF fallback
- **Dynamic job discovery** with keyword, location, and role-type filtering
- **Cover letter generation** for faster candidate outreach
- **Application tracking** from Saved to Offer
- **Responsive UI** designed for modern desktop and mobile workflows
- **Serverless deployment ready** with Vercel and GitHub Actions

## Technology Stack

- Frontend: **React 18**, **Vite**, **Tailwind CSS**, **React Router v6**
- Backend: **Node.js**, **Express**, **Axios**
- AI: **OpenAI GPT-4o** integration plus local TF-IDF fallback
- Deployment: **Vercel serverless monorepo**
- CI/CD: **GitHub Actions**

## Repository Structure

```text
JobHub-AI/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # GitHub Actions pipeline
├── server/                        # Node.js + Express API
│   ├── api/                       # Vercel serverless entry point
│   ├── src/                       # Backend application code
│   ├── data/                      # Seed job/application data
│   ├── db/                        # JSON storage helper
│   ├── services/                  # AI and business logic
│   ├── controllers/               # API controllers
│   ├── routes/                    # API route definitions
│   └── package.json
├── client/                        # React + Vite frontend
│   ├── src/                       # Application source files
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── vercel.json                    # Vercel monorepo config
├── PROJECT_STATUS.md              # Project summary and implementation notes
└── README.md                      # Project documentation
```

## Local Development

### Install dependencies

```bash
git clone https://github.com/susmithamannem004/Jobhub-AI.git
cd JobHub-AI
npm run install:all
```

### Run the app

```bash
npm run dev:server
npm run dev:client
```

Open **http://localhost:3000** in your browser.

### Optional: Enable OpenAI

Create a `.env` file inside `server/`:

```env
OPENAI_API_KEY=your_openai_api_key
```

If no API key is provided, the application uses the offline TF-IDF matcher automatically.

## API Endpoints

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/jobs` | Fetch job listings |
| `GET` | `/api/jobs/:id` | Get a job by ID |
| `POST` | `/api/jobs` | Create a job listing |
| `POST` | `/api/ai/match` | Evaluate resume fit |
| `POST` | `/api/ai/cover-letter` | Generate cover letter text |
| `GET` | `/api/applications` | List saved applications |
| `POST` | `/api/applications` | Save an application |
| `PUT` | `/api/applications/:id` | Update application details |
| `DELETE` | `/api/applications/:id` | Delete an application |

## Deployment

This repository is configured for Vercel deployment with `vercel.json` and supports a monorepo layout. The GitHub Actions workflow validates both client and server builds and deploys updates automatically from the `main` branch.

## Live Demo

[https://jobhub-ai-kohl.vercel.app](https://jobhub-ai-kohl.vercel.app)

## Additional resources

For architecture details and project status, see `PROJECT_STATUS.md`.
