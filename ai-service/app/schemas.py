from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class ExtractTextRequest(BaseModel):
    file_content: Optional[str] = None

class ExtractTextResponse(BaseModel):
    success: bool
    text: str
    word_count: int
    char_count: int
    sections_found: List[str]

class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str
    job_title: Optional[str] = "Target Role"

class ScoreBreakdown(BaseModel):
    skill_match_score: float = Field(..., description="0-100 score for matching skills")
    experience_score: float = Field(..., description="0-100 score for experience level match")
    ats_score: float = Field(..., description="0-100 score for ATS readability")
    overall_match_score: float = Field(..., description="Overall calculated match score")

class MissingSkillCategory(BaseModel):
    critical: List[str] = []
    recommended: List[str] = []
    optional: List[str] = []

class SkillAnalysis(BaseModel):
    matched_skills: List[str] = []
    missing_skills: MissingSkillCategory
    resume_skills: List[str] = []
    job_skills: List[str] = []

class ImprovementSuggestion(BaseModel):
    category: str
    finding: str
    recommendation: str
    impact: str  # High, Medium, Low

class AnalysisResponse(BaseModel):
    success: bool
    job_title: str
    match_score: float
    score_breakdown: ScoreBreakdown
    skills: SkillAnalysis
    strengths: List[str]
    weaknesses: List[str]
    ats_feedback: List[str]
    suggestions: List[ImprovementSuggestion]

class ImproveResumeRequest(BaseModel):
    resume_text: str
    job_description: str
    target_role: Optional[str] = "Target Role"

class BulletImprovement(BaseModel):
    original: str
    improved: str
    star_breakdown: Dict[str, str]
    key_addition: str

class SectionRewrite(BaseModel):
    section_name: str
    current_feedback: str
    suggested_content: str

class ImproveResumeResponse(BaseModel):
    success: bool
    tailored_summary: str
    bullet_improvements: List[BulletImprovement]
    section_rewrites: List[SectionRewrite]
    action_verbs_to_add: List[str]

class InterviewQuestion(BaseModel):
    id: int
    category: str  # Technical, Behavioral, Situational, Gaps
    question: str
    purpose: str
    sample_answer: str
    key_points_to_mention: List[str]
    difficulty: str  # Easy, Medium, Hard

class InterviewPrepRequest(BaseModel):
    resume_text: str
    job_description: str
    job_title: Optional[str] = "Target Role"

class InterviewPrepResponse(BaseModel):
    success: bool
    job_title: str
    questions: List[InterviewQuestion]
