
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


SKILLS = {
    "python": ["python"],
    "sql": ["sql", "mysql", "postgresql"],
    "excel": ["excel"],
    "power bi": ["power bi"],
    "tableau": ["tableau"],
    "javascript": ["javascript"],
    "html": ["html"],
    "css": ["css"],
    "react": ["react", "react.js"],
    "node.js": ["node.js", "nodejs"],
    "mongodb": ["mongodb"],
    "machine learning": ["machine learning", "scikit-learn"],
    "data analysis": ["data analysis", "data analytics"],
    "git": ["git", "github"],
}


def extract_skills(text):
    text = text.lower()
    found = []

    for skill, aliases in SKILLS.items():
        for alias in aliases:
            pattern = r"(?<!\w)" + re.escape(alias) + r"(?!\w)"
            if re.search(pattern, text):
                found.append(skill)
                break

    return sorted(found)


def similarity(text1, text2):
    if not text1.strip() or not text2.strip():
        return 0.0

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([text1, text2])

    return float(
        cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    )


def match_jobs(resume_text, jobs):
    student_skills = set(extract_skills(resume_text))
    results = []

    for job in jobs:
        required = {
            s.lower() for s in job.get("requiredSkills", [])
        } & set(SKILLS)

        preferred = {
            s.lower() for s in job.get("preferredSkills", [])
        } & set(SKILLS)

        matched = student_skills & required
        matched_preferred = student_skills & preferred
        missing = required - student_skills

        if required:
            skill_score = 100 * len(matched) / len(required)
        elif preferred:
            skill_score = 100 * len(matched_preferred) / len(preferred)
        else:
            skill_score = 0

        job_text = " ".join([
            str(job.get("title", "")),
            str(job.get("description", "")),
            *required,
            *preferred,
        ])

        text_score = similarity(resume_text, job_text) * 100
        final_score = round(0.8 * skill_score + 0.2 * text_score)

        results.append({
            "jobId": str(job.get("_id", job.get("id", ""))),
            "title": job.get("title", "Untitled role"),
            "company": job.get("company", "Not specified"),
            "matchScore": min(100, max(0, final_score)),
            "matchedSkills": sorted(matched | matched_preferred),
            "missingSkills": sorted(missing),
        })

    return sorted(
        results,
        key=lambda item: item["matchScore"],
        reverse=True,
    )


def create_learning_roadmap(missing_skills):
    resources = {
        "python": "Learn Python basics and build small programs.",
        "sql": "Practise SELECT, JOIN, GROUP BY and subqueries.",
        "excel": "Learn formulas, pivot tables and data cleaning.",
        "power bi": "Build dashboards and practise Power Query.",
        "tableau": "Practise charts, filters and dashboards.",
        "javascript": "Learn functions, arrays and DOM manipulation.",
        "html": "Learn semantic HTML and page structure.",
        "css": "Practise Flexbox, Grid and responsive layouts.",
        "react": "Learn components, props, state and hooks.",
        "node.js": "Build REST APIs using Express.",
        "mongodb": "Practise database queries and CRUD operations.",
        "machine learning": "Study model training and evaluation.",
        "data analysis": "Practise cleaning and analysing datasets.",
        "git": "Learn commits, branches and pull requests.",
    }

    return [
        {
            "skill": skill,
            "action": resources.get(
                skill, f"Learn {skill} and build a small project."
            ),
        }
        for skill in sorted(set(missing_skills))
    ]
