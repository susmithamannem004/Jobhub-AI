# 📊 JobHub AI — Complete Project Status & Architecture Report

> **Candidate**: Susmitha Mannem  
> **Position**: Software Developer (Onsite — Hyderabad, India)  
> **Date**: July 2026  
>
> | Link | URL |
> |---|---|
> | 🌐 **Live Demo** | [https://jobhub-ai-kohl.vercel.app](https://jobhub-ai-kohl.vercel.app) |
> | 🐙 **GitHub Repository** | [https://github.com/susmithamannem004/Jobhub-AI](https://github.com/susmithamannem004/Jobhub-AI) |
> | ⚙️ **CI/CD Pipeline** | [GitHub Actions Workflow](https://github.com/susmithamannem004/Jobhub-AI/blob/main/.github/workflows/ci-cd.yml) |

---

## ✅ Assessment Compliance Matrix

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 1 | **Build web app with business value using AI** | ✅ Achieved | Full-stack job board + dual AI engine (TF-IDF + GPT-4o), cover letter generator, Kanban tracker |
| 2 | **Push code to Git** | ✅ Achieved | All 52+ files committed and pushed to `main` on [susmithamannem004/Jobhub-AI](https://github.com/susmithamannem004/Jobhub-AI) |
| 3 | **Write CI/CD pipeline using AI on Git** | ✅ Achieved | GitHub Actions workflow — builds client, validates server, deploys to Vercel on every push to `main` |
| 4 | **Deploy to Vercel via CI/CD** | ✅ Achieved | Auto-deployed via `amondnet/vercel-action@v25` on merge to `main` → [jobhub-ai-kohl.vercel.app](https://jobhub-ai-kohl.vercel.app) |
| 5 | **Write documentation using AI** | ✅ Achieved | Full `README.md` (architecture, API ref, CI/CD guide) + this `PROJECT_STATUS.md` |
| 6 | **Send to reviewers** | 🟢 Ready | All links available for submission |

---

## 🏗️ Technology Stack

### Frontend (Client)

| Layer | Technology |
|---|---|
| Framework | React 18 with Vite 5 |
| Styling | Tailwind CSS + custom Glassmorphism dark theme |
| Icons | Lucide React |
| HTTP Client | Axios (auto base-URL for local + Vercel) |
| State | React Context API (`AppContext`) |
| Routing | React Router v6 |

### Backend (Server)

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| Database | Lightweight JSON File Engine (`fs/promises`) |
| AI Engine | Dual-layer: TF-IDF offline + OpenAI GPT-4o |
| Serverless | Vercel Functions via `server/api/index.js` |

### DevOps & Infrastructure

| Component | Technology |
|---|---|
| Version Control | Git + GitHub |
| CI/CD | GitHub Actions (`.github/workflows/ci-cd.yml`) |
| Hosting | Vercel Serverless Platform |
| Deployment Config | `vercel.json` (monorepo unified routing) |

---

## 📁 Full Repository Structure

```
JobHub-AI/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                  # GitHub Actions CI/CD pipeline
├── server/                            # Express.js REST API Backend
│   ├── api/
│   │   └── index.js                   # Vercel serverless function entry point
│   ├── src/
│   │   ├── config/                    # App environment configuration
│   │   ├── data/
│   │   │   ├── jobs.json              # Seed job listings database
│   │   │   └── applications.json     # Tracked applications database
│   │   ├── db/
│   │   │   └── jsonStore.js           # Thread-safe JSON read/write helper
│   │   ├── services/
│   │   │   └── aiService.js           # Dual AI engine (TF-IDF + OpenAI)
│   │   ├── controllers/
│   │   │   ├── jobController.js       # Job CRUD logic
│   │   │   ├── aiController.js        # Resume match + cover letter logic
│   │   │   └── appController.js       # Application tracker logic
│   │   ├── routes/
│   │   │   ├── jobRoutes.js           # /api/jobs routes
│   │   │   ├── aiRoutes.js            # /api/ai routes
│   │   │   └── appRoutes.js           # /api/applications routes
│   │   └── app.js                     # Express app declaration + middleware
│   ├── index.js                       # Local dev server (Port 5000)
│   └── package.json
├── client/                            # React 18 + Vite SPA
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js              # Axios base client config
│   │   │   ├── jobsApi.js             # Job listing API calls
│   │   │   ├── aiApi.js               # AI match + cover letter calls
│   │   │   └── appsApi.js             # Application tracker API calls
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx         # Sticky header with nav + GitHub/Live Demo links
│   │   │   │   ├── Footer.jsx         # Footer with GitHub + Live Demo links
│   │   │   │   ├── Modal.jsx          # Reusable modal wrapper
│   │   │   │   └── Badge.jsx          # Status badge component
│   │   │   ├── jobs/
│   │   │   │   ├── JobCard.jsx        # Job listing card
│   │   │   │   ├── JobFilter.jsx      # Multi-field search filter bar
│   │   │   │   ├── JobDetailModal.jsx # Full job detail overlay
│   │   │   │   └── PostJobModal.jsx   # Employer job posting form
│   │   │   ├── ai/
│   │   │   │   ├── ResumeMatcher.jsx  # Resume text input + match score display
│   │   │   │   ├── CoverLetterGen.jsx # Cover letter output + copy/download
│   │   │   │   └── ScoreMeter.jsx     # Animated fit score meter
│   │   │   └── tracker/
│   │   │       ├── KanbanBoard.jsx    # Kanban columns + stats header
│   │   │       └── ApplicationCard.jsx# Application card with status controls
│   │   ├── context/
│   │   │   └── AppContext.jsx         # Global state (jobs, applications, loading)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx           # Landing page with featured jobs
│   │   │   ├── JobsPage.jsx           # Full job board with filters
│   │   │   ├── AIMatcherPage.jsx      # AI resume matcher + cover letter page
│   │   │   └── TrackerPage.jsx        # Kanban application pipeline page
│   │   ├── index.css                  # Tailwind directives + glassmorphism theme
│   │   └── main.jsx                   # React app entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── vercel.json                        # Vercel monorepo routing configuration
├── package.json                       # Root scripts (dev:server, dev:client, install:all)
├── README.md                          # Main documentation
└── PROJECT_STATUS.md                  # This file — full status report
```

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description | Body / Params |
|---|---|---|---|
| `GET` | `/api/health` | Health check + timestamp | — |
| `GET` | `/api/jobs` | Filtered job listings | `?q=&location=&type=&salary=` |
| `GET` | `/api/jobs/:id` | Single job by ID | `id` path param |
| `POST` | `/api/jobs` | Create new job listing | `{ title, company, location, type, salary, description, requirements }` |
| `POST` | `/api/ai/match` | AI resume fit score + missing skills | `{ resumeText, jobDescription, targetSkills }` |
| `POST` | `/api/ai/cover-letter` | Generate custom cover letter | `{ candidateName, jobTitle, company, resumeText }` |
| `GET` | `/api/applications` | List all tracked applications | — |
| `POST` | `/api/applications` | Add new application to tracker | `{ jobTitle, company, status, notes }` |
| `PUT` | `/api/applications/:id` | Update application status/notes | `{ status, notes }` |
| `DELETE` | `/api/applications/:id` | Remove application | `id` path param |

---

## ⚙️ CI/CD Pipeline

**File**: `.github/workflows/ci-cd.yml`  
**Trigger**: Every push or pull request to `main`

### Pipeline Steps

```
Push to main
    │
    ▼
[Job 1: build-and-test]
    ├── Checkout code
    ├── Setup Node.js 20 (with npm cache)
    ├── Install client deps (npm ci)
    ├── Build React client (vite build)
    ├── Install server deps (npm ci)
    └── Validate server syntax (node --check)
    │
    ▼  (only if build-and-test passes)
[Job 2: deploy-to-vercel]
    ├── Checkout code
    └── Deploy to Vercel Production (amondnet/vercel-action@v25 --prod)
```

### Required GitHub Secrets

| Secret Name | How to Get It |
|---|---|
| `VERCEL_TOKEN` | Vercel Dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel Dashboard → Settings → General → Team ID |
| `VERCEL_PROJECT_ID` | Vercel Project → Settings → General → Project ID |

---

## 🚀 Running Locally

```bash
# 1. Clone
git clone https://github.com/susmithamannem004/Jobhub-AI.git
cd Jobhub-AI

# 2. Install all dependencies
npm run install:all

# 3. Start backend (Port 5000)
npm run dev:server

# 4. Start frontend (Port 3000) — in a new terminal
npm run dev:client
```

Visit: **http://localhost:3000**

---

## 🌐 Live Deployment

| Item | Value |
|---|---|
| **Public Live URL** | [https://jobhub-ai-kohl.vercel.app](https://jobhub-ai-kohl.vercel.app) |
| **Platform** | Vercel Serverless |
| **Frontend** | React SPA served from `client/dist` |
| **Backend** | Express via Vercel Functions (`server/api/index.js`) |
| **Auto-Deploy** | Yes — triggers on every push to `main` via GitHub Actions |

---

*Generated by Antigravity AI Assistant — Susmitha Mannem, July 2026.*
