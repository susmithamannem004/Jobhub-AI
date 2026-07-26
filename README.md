# 🚀 JobHub AI - Smart Job Matching & Career Assistant Platform

JobHub AI is a full-stack, AI-powered career assistant and job platform built with **React 18 + Vite**, **Express.js**, **Tailwind CSS**, **Axios**, and a **JSON File Database Engine**. It features real-time candidate resume matching, AI cover letter generation, and a Kanban application pipeline tracker.

---

## ✨ Key Features

- 🎯 **Job Discovery & Multi-Field Filtering**: Search tech roles by keyword, location, salary, and employment type.
- ⚡ **Dual AI Skill Match Engine**:
  - Uses **OpenAI GPT-4o** when an `OPENAI_API_KEY` is present.
  - Automatically falls back to an offline **TF-IDF Keyword Heuristic Engine** (100% reliable without external API keys).
- ✍️ **1-Click AI Cover Letter Generator**: Produce custom cover letters with download and copy capabilities.
- 📊 **Kanban Application Tracker**: Track applied positions across pipeline stages (*Saved*, *Applied*, *Interviewing*, *Offer*, *Rejected*).
- 💾 **Lightweight JSON Storage Engine**: No database setup required! Operates via thread-safe `fs/promises` reading and writing to structured JSON seed files.
- ☁️ **Vercel Serverless Ready**: Integrated `vercel.json` for unified monorepo deployment.
- 🛠️ **GitHub Actions CI/CD**: Automatic build verification workflow included in `.github/workflows/ci-cd.yml`.

---

## 📁 Repository Architecture

```
JobHub-AI/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions build & test workflow
├── server/                    # Node.js + Express REST API
│   ├── api/
│   │   └── index.js           # Serverless Vercel function entry point
│   ├── src/
│   │   ├── config/            # Environment configuration
│   │   ├── data/              # JSON database files (jobs.json, applications.json)
│   │   ├── db/                # jsonStore helper module
│   │   ├── services/          # Dual AI engine logic (TF-IDF + OpenAI fallback)
│   │   ├── controllers/       # Job, AI, Application REST controllers
│   │   ├── routes/            # REST API endpoints
│   │   └── app.js             # Express app declaration
│   ├── index.js               # Local server listener (Port 5000)
│   └── package.json
├── client/                    # React 18 + Vite SPA Frontend
│   ├── src/
│   │   ├── api/               # Axios API client services
│   │   ├── components/        # UI components (Navbar, JobCard, ScoreMeter, KanbanBoard)
│   │   ├── context/           # AppContext state provider
│   │   ├── pages/             # HomePage, JobsPage, AIMatcherPage, TrackerPage
│   │   ├── index.css          # Tailwind directives & glassmorphism theme
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── vercel.json                # Vercel deployment configuration
└── README.md
```

---

## 🛠️ Quick Start Guide

### 1. Install Dependencies

```bash
# Install root, server, and client packages
npm run install:all
```

### 2. Run Local Development Servers

```bash
# Terminal 1: Start Express Backend API (Port 5000)
npm run dev:server

# Terminal 2: Start React + Vite Frontend (Port 3000)
npm run dev:client
```

Open `http://localhost:3000` in your browser!

---

## 🔌 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/jobs` | `GET` | Get filtered job listings (`?q=react&location=remote&type=full-time`) |
| `/api/jobs/:id` | `GET` | Get specific job details |
| `/api/jobs` | `POST` | Post a new job opportunity |
| `/api/ai/match` | `POST` | Calculate resume fit score & missing skills |
| `/api/ai/cover-letter` | `POST` | Generate tailored cover letter |
| `/api/applications` | `GET` | List tracked candidate applications |
| `/api/applications` | `POST` | Save job to candidate tracker |
| `/api/applications/:id` | `PUT` | Update status/notes for application |
| `/api/applications/:id` | `DELETE` | Remove application from tracker |

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Vercel automatically detects `vercel.json` and configures the `/api` Express serverless function alongside the React static frontend.
