import re
from typing import Dict, Any, List
from app.nlp.skill_extractor import extract_skills_from_text, categorize_missing_skills

def calculate_ats_score(resume_text: str) -> Dict[str, Any]:
    """Calculate ATS score based on structural formatting standards."""
    feedback = []
    score = 100

    # 1. Length check
    words = len(resume_text.split())
    if words < 150:
        score -= 20
        feedback.append("Resume content is too short (< 150 words). Expand your bullet points.")
    elif words > 1200:
        score -= 10
        feedback.append("Resume is lengthy (> 1200 words). Aim for a concise 1-2 page layout.")
    else:
        feedback.append("Optimal document word count range.")

    # 2. Key section headings check
    text_upper = resume_text.upper()
    essential_sections = ["EXPERIENCE", "EDUCATION", "SKILLS"]
    missing_sections = [sec for sec in essential_sections if sec not in text_upper]
    if missing_sections:
        score -= (len(missing_sections) * 15)
        feedback.append(f"Missing standard section headings: {', '.join(missing_sections)}.")
    else:
        feedback.append("Contains standard ATS-recognized section headers.")

    # 3. Measurable metrics check (percentages, numbers, dollar amounts)
    metrics = re.findall(r'\b\d+%\b|\$\d+|\b\d+\+\b|\b\d+x\b', resume_text)
    if len(metrics) < 3:
        score -= 15
        feedback.append("Low quantifiable impact. Add metrics (%, $, scale, team size).")
    else:
        feedback.append(f"Good usage of quantifiable metrics ({len(metrics)} data points detected).")

    # 4. Action verbs check
    action_verbs = ["developed", "built", "implemented", "designed", "architected", "managed", "led", "optimized", "increased", "reduced"]
    found_verbs = [verb for verb in action_verbs if verb in resume_text.lower()]
    if len(found_verbs) < 4:
        score -= 10
        feedback.append("Include more strong action verbs (e.g., Architected, Optimized, Spearheaded).")

    return {
        "ats_score": max(0, min(100, float(score))),
        "feedback": feedback
    }

def calculate_job_match(resume_text: str, job_description: str) -> Dict[str, Any]:
    """
    Transparent Job Matching Engine.
    Calculates Skill Match %, Experience Match %, ATS score %, and overall weighted score.
    """
    resume_skills = extract_skills_from_text(resume_text)
    job_skills = extract_skills_from_text(job_description)

    # 1. Skill Match Score
    if not job_skills:
        # Fallback if job description has unusual wording
        skill_score = 70.0
        matched_skills = resume_skills[:5]
        missing_skills = []
    else:
        matched_set = set(resume_skills).intersection(set(job_skills))
        missing_set = set(job_skills) - set(resume_skills)

        matched_skills = sorted(list(matched_set))
        missing_skills = sorted(list(missing_set))
        
        skill_score = round((len(matched_skills) / len(job_skills)) * 100, 1)

    categorized_missing = categorize_missing_skills(missing_skills, job_description)

    # 2. Experience Level Alignment Score
    exp_keywords = ["senior", "lead", "principal", "junior", "mid-level", "manager", "director"]
    job_exp = [kw for kw in exp_keywords if kw in job_description.lower()]
    resume_exp = [kw for kw in exp_keywords if kw in resume_text.lower()]
    
    if not job_exp or any(exp in resume_exp for exp in job_exp):
        experience_score = 85.0
    else:
        experience_score = 65.0

    # 3. ATS Structural Score
    ats_res = calculate_ats_score(resume_text)
    ats_score = ats_res["ats_score"]

    # 4. Overall Weighted Score (60% Skills, 20% Experience, 20% ATS)
    overall_match_score = round((skill_score * 0.60) + (experience_score * 0.20) + (ats_score * 0.20), 1)

    # Strengths & Weaknesses synthesis
    strengths = []
    weaknesses = []

    if len(matched_skills) >= 3:
        strengths.append(f"Strong match in core tech stack: {', '.join(matched_skills[:4])}.")
    if ats_score >= 80:
        strengths.append("High ATS readability with standard headers and clean structure.")
    if len(resume_skills) > 8:
        strengths.append(f"Diverse technical portfolio across {len(resume_skills)} domain skills.")

    if categorized_missing["critical"]:
        weaknesses.append(f"Missing critical required skills: {', '.join(categorized_missing['critical'][:3])}.")
    if skill_score < 60:
        weaknesses.append(f"Skill match is below recommended threshold ({skill_score}%).")
    if "Low quantifiable impact" in " ".join(ats_res["feedback"]):
        weaknesses.append("Bullets lack quantifiable business outcomes and data metrics.")

    if not strengths:
        strengths.append("Foundational technical experience aligned with job context.")
    if not weaknesses:
        weaknesses.append("Minor polish needed on specific domain keywords.")

    return {
        "match_score": overall_match_score,
        "score_breakdown": {
            "skill_match_score": skill_score,
            "experience_score": experience_score,
            "ats_score": ats_score,
            "overall_match_score": overall_match_score
        },
        "skills": {
            "matched_skills": matched_skills,
            "missing_skills": categorized_missing,
            "resume_skills": resume_skills,
            "job_skills": job_skills
        },
        "strengths": strengths,
        "weaknesses": weaknesses,
        "ats_feedback": ats_res["feedback"]
    }
