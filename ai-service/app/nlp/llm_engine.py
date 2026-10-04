import os
import json
import requests
from typing import Dict, Any, List
from app.nlp.skill_extractor import extract_skills_from_text

def get_gemini_key() -> str:
    return os.environ.get("GEMINI_API_KEY", "").strip()

def generate_star_bullets_heuristic(resume_text: str, job_description: str) -> List[Dict[str, Any]]:
    """
    Intelligent NLP fallback generator for bullet improvements using STAR method.
    Provides highly practical improvements based on the user's actual bullet text.
    """
    job_skills = extract_skills_from_text(job_description)
    top_skills = job_skills[:3] if job_skills else ["relevant technologies"]

    # Extract sentences/lines from resume that look like bullet points
    lines = [line.strip("-•* ").strip() for line in resume_text.split("\n") if len(line.strip()) > 20]
    sample_bullets = lines[:5] if lines else [
        "Responsible for developing web applications.",
        "Worked with team members to deliver project features."
    ]

    improvements = []
    
    for orig in sample_bullets:
        # Extract the first word (often a verb) to reuse
        words = orig.split()
        first_word = words[0] if words else "Spearheaded"
        action_verb = first_word if first_word.endswith("ed") else first_word + "ed"
        
        # Determine contextual skill to weave in
        skill_to_add = top_skills[len(improvements) % len(top_skills)]
        
        improved = f"{action_verb.capitalize()} { ' '.join(words[1:6]) if len(words)>1 else 'the initiative' } utilizing {skill_to_add}, which resulted in a measurable increase in performance or team efficiency."
        
        improvements.append({
            "original": orig,
            "improved": improved,
            "star_breakdown": {
                "situation": f"The project required executing tasks related to {' '.join(words[1:4]) if len(words)>1 else 'the domain'}.",
                "task": f"You were responsible for applying {skill_to_add} to achieve the goal.",
                "action": f"You {orig.lower()}.",
                "result": "Add a concrete metric here (e.g., 'reduced time by 20%', 'supported 10k users')."
            },
            "key_addition": f"Pivoted from a passive description to an active achievement format. Action item: Insert a real metric to replace the placeholder."
        })

    return improvements

def generate_tailored_summary_heuristic(resume_text: str, job_description: str, target_role: str) -> str:
    """Generate a high-impact executive summary tailored to the target role."""
    job_skills = extract_skills_from_text(job_description)
    top_skills_str = ", ".join(job_skills[:4]) if job_skills else "Full-Stack Development, Cloud Systems, and Agile Delivery"

    return (
        f"Results-driven software professional specializing in {target_role} with proven expertise in {top_skills_str}. "
        f"Adept at building scalable applications, optimizing system performance, and driving cross-functional engineering initiatives. "
        f"Demonstrated track record of delivering clean, maintainable code that directly improves user experience and business velocity."
    )

def generate_interview_questions_heuristic(resume_text: str, job_description: str, target_role: str) -> List[Dict[str, Any]]:
    """
    Generates 50+ personalized, categorized interview preparation questions.
    """
    job_skills = extract_skills_from_text(job_description)
    core_skills = job_skills[:5] if len(job_skills) >= 5 else ["System Design", "API Development", "Database Optimization", "Cloud Deployment", "Microservices"]

    questions = []
    qid = 1

    # Base templates per category
    templates = {
        "Technical": [
            ("How do you design scalable applications utilizing {skill} and handle high-concurrency bottlenecks?", "Assesses hands-on mastery and architectural decision-making."),
            ("Walk me through your experience implementing {skill} and managing error boundaries.", "Evaluates design practices and resiliency."),
            ("What is the most complex bug you've solved related to {skill}?", "Tests deep technical troubleshooting."),
            ("How do you ensure security best practices when working with {skill}?", "Checks security awareness."),
            ("Explain the internal working of {skill} to someone non-technical.", "Assesses communication of technical concepts.")
        ],
        "General": [
            ("Why are you interested in this {role} position?", "Gauges role alignment and motivation."),
            ("Where do you see your career heading in the next 3-5 years?", "Checks long-term goals."),
            ("What are you most proud of in your career so far?", "Highlights professional achievements."),
            ("What do you consider the most important qualities for a {role}?", "Tests understanding of the role."),
            ("How do you stay updated with industry trends?", "Measures continuous learning.")
        ],
        "Strengths": [
            ("What is your greatest professional strength?", "Self-awareness of core competencies."),
            ("How would your previous manager describe your strongest asset?", "External perspective on strengths."),
            ("Tell me about a time your strength in problem-solving saved a project.", "Validates strength with a real example."),
            ("How does your background uniquely position you for this {role}?", "Connects strengths to the job."),
            ("Which part of the software development lifecycle do you excel at the most?", "Identifies peak performance areas.")
        ],
        "Weaknesses": [
            ("What is your biggest professional weakness?", "Tests self-awareness and honesty."),
            ("Tell me about a time you failed and what you learned.", "Gauges resilience and learning from failure."),
            ("If you could change one thing about your technical skill set, what would it be?", "Identifies areas for improvement."),
            ("Describe a situation where you lacked the necessary {skill} and how you adapted.", "Tests adaptability."),
            ("How do you handle receiving critical feedback on your code?", "Evaluates coachability.")
        ],
        "Behavioral": [
            ("Tell me about a time you had to deliver a critical project under a tight deadline with changing requirements.", "Evaluates adaptability and stress management."),
            ("Describe a time you disagreed with a senior engineer or manager. How did you resolve it?", "Tests conflict resolution."),
            ("Give an example of a time you had to explain a complex technical issue to a non-technical stakeholder.", "Communication skills."),
            ("Tell me about a time you had to learn a new technology on the fly.", "Adaptability and quick learning."),
            ("Describe a situation where you went above and beyond your job requirements.", "Work ethic and initiative.")
        ],
        "Situational": [
            ("How do you handle technical debt when product managers press for fast feature delivery?", "Assesses balancing engineering quality with business deadlines."),
            ("If you discover a critical security vulnerability right before release, what do you do?", "Prioritization and ethics."),
            ("Imagine you are assigned to a project with unclear requirements. How do you proceed?", "Proactivity and requirement gathering."),
            ("Your team is falling behind schedule. How do you ensure the sprint goals are met?", "Leadership and time management."),
            ("How would you handle a colleague who consistently pushes unreviewed code?", "Team dynamics and process enforcement.")
        ]
    }

    # Generate questions by iterating through categories and skills
    for _ in range(2): # Loop twice to ensure we hit 50+ questions easily
        for category, tpl_list in templates.items():
            for tpl, purpose in tpl_list:
                # Cycle through skills for variety
                skill = core_skills[qid % len(core_skills)]
                role = target_role or "Target Position"
                
                q_text = tpl.format(skill=skill.capitalize(), role=role)
                
                questions.append({
                    "id": qid,
                    "category": category,
                    "question": q_text,
                    "purpose": purpose,
                    "sample_answer": f"A strong answer should highlight hands-on experience, specific metrics, and clear communication related to {category} and {skill}. Use the STAR method where appropriate.",
                    "key_points_to_mention": [f"Highlight {skill} experience", "Provide concrete metrics", "Show problem-solving mindset"],
                    "difficulty": "Medium" if category in ["General", "Strengths"] else "Hard"
                })
                qid += 1
                
                if qid > 55: # Ensure we get slightly over 50
                    break
            if qid > 55:
                break

    return questions

def generate_interview_questions_llm(resume_text: str, job_description: str, target_role: str) -> List[Dict[str, Any]]:
    """
    Main LLM entrypoint for Interview Questions generation with fallback to 50+ heuristic questions.
    """
    api_key = get_gemini_key()
    if not api_key:
        return generate_interview_questions_heuristic(resume_text, job_description, target_role)

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        prompt = f"""
        Act as an expert technical recruiter and hiring manager.
        Target Job: {target_role}
        Job Description: {job_description[:2000]}
        User Resume: {resume_text[:2000]}

        Generate exactly 50 categorized interview questions tailored to the candidate's resume and job description.
        Distribute them across categories: "Technical", "General", "Strengths", "Weaknesses", "Behavioral", "Situational".
        
        Return JSON as a list of objects with keys:
        - "id": integer
        - "category": string
        - "question": string
        - "purpose": string
        - "sample_answer": string
        - "key_points_to_mention": list of strings
        - "difficulty": string ("Easy", "Medium", "Hard")
        """
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json"}
        }
        res = requests.post(url, json=payload, timeout=20)
        if res.status_code == 200:
            data = res.json()
            text_out = data['candidates'][0]['content']['parts'][0]['text']
            parsed_questions = json.loads(text_out)
            if isinstance(parsed_questions, list) and len(parsed_questions) > 10:
                return parsed_questions
    except Exception as e:
        print(f"Gemini LLM call failed or timed out for interview questions: {e}. Falling back to NLP Heuristic Engine.")

    # Fallback
    return generate_interview_questions_heuristic(resume_text, job_description, target_role)

def improve_resume_llm(resume_text: str, job_description: str, target_role: str) -> Dict[str, Any]:
    """
    Main LLM entrypoint for Resume Improver with fallback.
    """
    api_key = get_gemini_key()
    if not api_key:
        return {
            "tailored_summary": generate_tailored_summary_heuristic(resume_text, job_description, target_role),
            "bullet_improvements": generate_star_bullets_heuristic(resume_text, job_description),
            "section_rewrites": [
                {
                    "section_name": "Technical Skills",
                    "current_feedback": "Skills are unorganized.",
                    "suggested_content": "Group skills logically into categories: Languages, Frameworks, Cloud & DevOps, Databases."
                },
                {
                    "section_name": "Professional Summary",
                    "current_feedback": "Summary is generic or missing target job keywords.",
                    "suggested_content": generate_tailored_summary_heuristic(resume_text, job_description, target_role)
                }
            ],
            "action_verbs_to_add": ["Spearheaded", "Architected", "Engineered", "Optimized", "Orchestrated", "Accelerated"]
        }

    # If Gemini API key is present, attempt Gemini REST call
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        prompt = f"""
        Act as an expert career coach and ATS resume strategist.
        Target Job: {target_role}
        Job Description: {job_description[:2000]}
        User Resume: {resume_text[:2000]}

        Generate highly practical and authentic resume improvements.
        CRITICAL RULE: Do NOT hallucinate fake metrics, fake projects, or fake companies. Base all bullet improvements STRICTLY on the actual context and experience described in the user's resume.
        Instead of inventing numbers, structure the improved bullet properly (Action Verb + Context + Result) and use placeholders like [Insert Metric, e.g., % increase] where the user needs to provide the real data.

        Return JSON with keys:
        - "tailored_summary": string
        - "bullet_improvements": list of objects with keys ("original", "improved", "star_breakdown" (object with situation, task, action, result), "key_addition")
        - "section_rewrites": list of objects with keys ("section_name", "current_feedback", "suggested_content")
        - "action_verbs_to_add": list of strings
        """
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json"}
        }
        res = requests.post(url, json=payload, timeout=12)
        if res.status_code == 200:
            data = res.json()
            text_out = data['candidates'][0]['content']['parts'][0]['text']
            return json.loads(text_out)
    except Exception as e:
        print(f"Gemini LLM call failed or timed out: {e}. Falling back to NLP Heuristic Engine.")

    # Fallback if LLM API call fails
    return {
        "tailored_summary": generate_tailored_summary_heuristic(resume_text, job_description, target_role),
        "bullet_improvements": generate_star_bullets_heuristic(resume_text, job_description),
        "section_rewrites": [
            {
                "section_name": "Technical Skills",
                "current_feedback": "Skills are unorganized.",
                "suggested_content": "Group skills logically into categories: Languages, Frameworks, Cloud & DevOps, Databases."
            }
        ],
        "action_verbs_to_add": ["Spearheaded", "Architected", "Engineered", "Optimized"]
    }
