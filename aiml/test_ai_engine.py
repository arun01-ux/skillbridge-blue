
import unittest
from ai_engine import extract_skills, match_jobs, create_learning_roadmap


class TestAIEngine(unittest.TestCase):

    def test_extract_skills(self):
        skills = extract_skills(
            "I know Python, SQL and Excel."
        )
        self.assertEqual(
            skills,
            ["excel", "python", "sql"]
        )

    def test_job_matching(self):
        resume = "I know Python and SQL."

        jobs = [
            {
                "id": "1",
                "title": "Data Analyst",
                "company": "Demo Company",
                "requiredSkills": ["python", "sql", "excel"],
                "preferredSkills": ["power bi"],
                "description": "Analyse business data."
            }
        ]

        results = match_jobs(resume, jobs)

        self.assertEqual(len(results), 1)
        self.assertIn("python", results[0]["matchedSkills"])
        self.assertIn("excel", results[0]["missingSkills"])
        self.assertGreaterEqual(results[0]["matchScore"], 0)
        self.assertLessEqual(results[0]["matchScore"], 100)

    def test_learning_roadmap(self):
        roadmap = create_learning_roadmap(["sql", "power bi"])
        self.assertEqual(len(roadmap), 2)


if __name__ == "__main__":
    unittest.main()
