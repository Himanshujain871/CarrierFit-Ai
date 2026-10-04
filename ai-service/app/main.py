import os
import io
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import (
    ExtractTextResponse, AnalysisRequest, AnalysisResponse,
    ImproveResumeRequest, ImproveResumeResponse,
    InterviewPrepRequest, InterviewPrepResponse
)
from app.parsers.pdf_parser import extract_text_from_pdf_bytes, detect_sections
from app.parsers.docx_parser import extract_text_from_docx_bytes
from app.nlp.matcher import calculate_job_match
from app.nlp.llm_engine import improve_resume_llm, generate_interview_questions_llm

app = FastAPI(
    title="CareerFit AI Service",
    description="Microservice for NLP/LLM resume parsing, job match score engine, STAR resume improver, and interview question generation.",
    version="1.0.0"
)

# Enable CORS for internal API gateway and frontend local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    gemini_configured = bool(os.environ.get("GEMINI_API_KEY"))
    return {
        "status": "healthy",
        "service": "CareerFit AI Microservice",
        "engine": "Dual LLM + Heuristic NLP Engine",
        "gemini_api_configured": gemini_configured
    }

@app.post("/extract-text", response_model=ExtractTextResponse)
async def extract_text(file: UploadFile = File(...)):
    """Extract raw text and detected sections from uploaded PDF/DOCX file."""
    try:
        content = await file.read()
        filename = file.filename.lower()
        
        if filename.endswith(".pdf"):
            extracted = extract_text_from_pdf_bytes(content)
        elif filename.endswith(".docx") or filename.endswith(".doc"):
            extracted = extract_text_from_docx_bytes(content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF or DOCX file.")

        sections = detect_sections(extracted)
        words = len(extracted.split())

        return ExtractTextResponse(
            success=True,
            text=extracted,
            word_count=words,
            char_count=len(extracted),
            sections_found=sections
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume_job_match(req: AnalysisRequest):
    """
    Perform transparent matching analysis between resume text and target job description.
    Returns overall score, skill breakdown, ATS score, strengths, weaknesses, and improvement advice.
    """
    if not req.resume_text or not req.job_description:
        raise HTTPException(status_code=400, detail="Both resume_text and job_description are required.")

    match_result = calculate_job_match(req.resume_text, req.job_description)

    # Convert suggestion dicts to pydantic list if needed
    suggestions = [
        {
            "category": "Skill Gap",
            "finding": f"Missing critical skills ({', '.join(match_result['skills']['missing_skills']['critical'][:3])}).",
            "recommendation": "Incorporate key project bullets demonstrating experience with these core technologies.",
            "impact": "High"
        },
        {
            "category": "Quantifiable Metrics",
            "finding": "Bullet points need stronger metric verification.",
            "recommendation": "Use percentage improvements, speed gains, or team scale figures.",
            "impact": "High"
        }
    ]

    return AnalysisResponse(
        success=True,
        job_title=req.job_title or "Target Position",
        match_score=match_result["match_score"],
        score_breakdown=match_result["score_breakdown"],
        skills=match_result["skills"],
        strengths=match_result["strengths"],
        weaknesses=match_result["weaknesses"],
        ats_feedback=match_result["ats_feedback"],
        suggestions=suggestions
    )

@app.post("/improve-resume", response_model=ImproveResumeResponse)
async def improve_resume_bullets(req: ImproveResumeRequest):
    """Generate STAR-formatted bullet rewrites, tailored executive summary, and section suggestions."""
    if not req.resume_text or not req.job_description:
        raise HTTPException(status_code=400, detail="Both resume_text and job_description are required.")

    res = improve_resume_llm(req.resume_text, req.job_description, req.target_role or "Target Position")
    return ImproveResumeResponse(
        success=True,
        tailored_summary=res["tailored_summary"],
        bullet_improvements=res["bullet_improvements"],
        section_rewrites=res["section_rewrites"],
        action_verbs_to_add=res["action_verbs_to_add"]
    )

@app.post("/generate-interview-prep", response_model=InterviewPrepResponse)
async def generate_interview_prep(req: InterviewPrepRequest):
    """Generate personalized interview questions, sample answers, and key talking points."""
    if not req.resume_text or not req.job_description:
        raise HTTPException(status_code=400, detail="Both resume_text and job_description are required.")

    questions = generate_interview_questions_llm(req.resume_text, req.job_description, req.job_title or "Target Position")

    return InterviewPrepResponse(
        success=True,
        job_title=req.job_title or "Target Position",
        questions=questions
    )
