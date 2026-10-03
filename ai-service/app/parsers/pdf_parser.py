import io
from pypdf import PdfReader

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """Extract raw text from PDF bytes."""
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        extracted_text = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                extracted_text.append(text)
        return "\n".join(extracted_text)
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")

def detect_sections(text: str) -> list[str]:
    """Detect standard resume sections in extracted text."""
    known_sections = [
        "SUMMARY", "OBJECTIVE", "WORK EXPERIENCE", "EXPERIENCE", "EMPLOYMENT HISTORY",
        "EDUCATION", "SKILLS", "TECHNICAL SKILLS", "PROJECTS", "CERTIFICATIONS",
        "PUBLICATIONS", "VOLUNTEER", "LANGUAGES", "ACHIEVEMENTS"
    ]
    found = []
    text_upper = text.upper()
    for section in known_sections:
        if section in text_upper:
            found.append(section)
    return found
