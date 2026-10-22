
from flask import Flask, request, jsonify
from ai_engine import match_jobs, extract_skills, create_learning_roadmap

app = Flask(__name__)


@app.post("/match")
def match():
    data = request.get_json(silent=True) or {}

    resume_text = data.get("resumeText", "")
    jobs = data.get("jobs", [])

    if not isinstance(resume_text, str) or not resume_text.strip():
        return jsonify({"error": "resumeText is required"}), 400

    if not isinstance(jobs, list):
        return jsonify({"error": "jobs must be a list"}), 400

    skills = extract_skills(resume_text)
    matches = match_jobs(resume_text, jobs)

    all_missing = sorted({
        skill
        for result in matches
        for skill in result["missingSkills"]
    })

    return jsonify({
        "extractedSkills": skills,
        "matches": matches,
        "learningRoadmap": create_learning_roadmap(all_missing)
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
