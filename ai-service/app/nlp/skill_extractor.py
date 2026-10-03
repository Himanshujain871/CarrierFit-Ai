import re
from typing import List, Set
from app.nlp.skill_taxonomy import SKILL_TAXONOMY

def extract_skills_from_text(text: str) -> List[str]:
    """
    Extracts recognized skills from text using the taxonomy dictionary.
    Returns a sorted list of canonical skill names.
    """
    if not text:
        return []

    text_lower = text.lower()
    found_skills: Set[str] = set()

    for canonical_name, aliases in SKILL_TAXONOMY.items():
        for alias in aliases:
            # Use word boundary matching to avoid partial word match issues (e.g., 'go' inside 'good')
            pattern = r'\b' + re.escape(alias) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.add(canonical_name)
                break

    return sorted(list(found_skills))

def categorize_missing_skills(missing_skills: List[str], job_text: str) -> dict:
    """
    Categorize missing skills into Critical, Recommended, and Optional
    based on emphasis in the job description (e.g. 'required', 'must have', 'nice to have').
    """
    job_lower = job_text.lower()
    critical = []
    recommended = []
    optional = []

    for skill in missing_skills:
        aliases = SKILL_TAXONOMY.get(skill, [skill])
        skill_mentioned_count = 0
        is_required_context = False
        is_optional_context = False

        for alias in aliases:
            matches = list(re.finditer(r'\b' + re.escape(alias) + r'\b', job_lower))
            skill_mentioned_count += len(matches)
            for m in matches:
                # Look at surrounding text window (60 chars before)
                start = max(0, m.start() - 60)
                snippet = job_lower[start:m.start()]
                if any(kw in snippet for kw in ["required", "must have", "essential", "minimum", "3+ years", "5+ years", "proficient"]):
                    is_required_context = True
                if any(kw in snippet for kw in ["nice to have", "plus", "bonus", "preferred", "optional"]):
                    is_optional_context = True

        if is_required_context or skill_mentioned_count >= 2:
            critical.append(skill)
        elif is_optional_context:
            optional.append(skill)
        else:
            recommended.append(skill)

    return {
        "critical": critical,
        "recommended": recommended,
        "optional": optional
    }
