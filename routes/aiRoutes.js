
import express from "express";
import Job from "../models/Job.js";

const router = express.Router();

// POST /api/ai/match
// Connects Anusha's Python AI/ML engine to the backend.
router.post("/match", async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide resume text."
      });
    }

    // Fetch available jobs from MongoDB
    const jobs = await Job.find({ status: "open" }).lean();
    // Call the Python AI/ML service
    const aiResponse = await fetch(
      `${process.env.AIML_SERVICE_URL}/match`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resumeText,
          jobs
        })
      }
    );

    if (!aiResponse.ok) {
      throw new Error("AI/ML service returned an error.");
    }

    const results = await aiResponse.json();

    return res.json({
      success: true,
      message: "Job matching completed.",
      data: results
    });
  } catch (error) {
    console.error("Match API error:", error.message);

    return res.status(502).json({
      success: false,
      message: "Unable to match jobs. Check whether the AI/ML service is running."
    });
  }
});

// POST /api/ai/mentor
// Uses Gemini to provide career guidance.
router.post("/mentor", async (req, res) => {
  try {
    const { question, skills = [], targetRole = "software professional" } =
      req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "The AI mentor is not configured."
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "You are SkillBridge's career mentor. Give practical, beginner-friendly, honest career advice. Never guarantee jobs or salaries."
            }]
          },
          contents: [{
            role: "user",
            parts: [{
              text: `Target role: ${targetRole}
Current skills: ${skills.join(", ") || "Not provided"}
Question: ${question}`
            }]
          }]
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", result);
      return res.status(502).json({
        success: false,
        message: "The AI mentor could not respond right now."
      });
    }

    const answer = result.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("\n");

    return res.json({
      success: true,
      answer: answer || "No response received. Please try again."
    });
  } catch (error) {
    console.error("Mentor API error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong with the AI mentor."
    });
  }
});

export default router;