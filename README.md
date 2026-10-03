# CareerFit AI - Production Full-Stack Career Assistant

CareerFit AI is an AI-powered platform that analyzes resumes against target job descriptions, calculates transparent match scores, highlights missing skills, provides bullet-level STAR rewrites, and generates personalized interview preparation Q&A cards.

---

## 🏗️ System Architecture & Team Structure

This project is built using a **decoupled micro-architecture** designed for multi-developer teams to work independently without code conflicts:

```
                    ┌─────────────────────────┐
                    │ React + Vite Frontend   │ (Port 5173 - Dev Team A)
                    └────────────┬────────────┘
                                 │ REST API
                                 ▼
                    ┌─────────────────────────┐
                    │ Express API Gateway     │ (Port 5000 - Dev Team B)
                    └──────┬───────────┬──────┘
                           │           │
                ┌──────────┘           └────────────┐
                ▼                                   ▼
     ┌────────────────────┐              ┌────────────────────┐
     │ MongoDB Atlas      │              │ Python FastAPI     │ (Port 8000 - Dev Team C)
     │ (Users/Resumes/Data│              │ (NLP/LLM Engine)   │
     └────────────────────┘              └────────────────────┘
```

### Team Directory Responsibilities:
1. **`frontend/`**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios, Context API.
2. **`backend/`**: Node.js, Express Gateway, JWT Authentication, Multer File Upload, Mongoose Models.
3. **`ai-service/`**: Python 3.12, FastAPI, `pypdf`, `python-docx`, Skill Extraction, Dual-Engine (Gemini LLM + Heuristic NLP fallback).

---

## 🚀 Quick Start Guide

### Option 1: Docker Compose (Recommended)
```bash
# Clone the repository
cd careerfit-ai

# Start all microservices in containers
docker-compose up --build
```
Access points:
- **Frontend App**: `http://localhost:5173`
- **Express Gateway API**: `http://localhost:5000`
- **FastAPI OpenAPI Docs**: `http://localhost:8000/docs`

---

### Option 2: Independent Local Microservices

#### 1. AI Service (Python FastAPI)
```bash
cd ai-service
python -m venv venv
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Backend Gateway (Node Express)
```bash
cd backend
npm install
npm run dev
```

#### 3. Frontend UI (React Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 AI Engine Architecture

The AI service operates a **Hybrid Dual Engine**:
- **Primary Engine**: Google Gemini API / LLM when `GEMINI_API_KEY` is set.
- **Fallback Engine**: Pure Python NLP, regex pattern matching, and TF-IDF skill dictionary when offline or operating without API keys.

---

## 📌 API Endpoints Overview

### Auth (`/api/auth`)
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Fetch logged-in user profile

### Resumes (`/api/resumes`)
- `POST /api/resumes/upload` - Upload PDF/DOCX file & parse raw text
- `GET /api/resumes` - List user uploaded resumes

### Analysis (`/api/analysis`)
- `POST /api/analysis/run` - Trigger job match analysis & resume rewrite
- `GET /api/analysis/user` - Fetch user's analysis history
- `GET /api/analysis/:id` - Fetch single analysis report

### Interview Prep (`/api/interview`)
- `GET /api/interview/analysis/:analysisId` - Get Q&A flashcards for an analysis
