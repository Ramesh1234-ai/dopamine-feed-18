
import express from "express";
import { data } from "../models/Profile.js";
import { calculateTeamScore } from "../services/scoringEngine.js";

const router =express.Router();
router.post("/analyze", async (req, res) => {
  try {
    if (!req.body.ids || !Array.isArray(req.body.ids) || req.body.ids.length === 0) {
      return res.status(400).json({ error: "Valid array of profile IDs required" });
    }

    const profiles = await data.find({ _id: { $in: req.body.ids } });
    
    if (profiles.length === 0) {
      return res.status(404).json({ error: "No profiles found" });
    }

    const score = calculateTeamScore(profiles);

    res.json({
      team_score: score,
      strengths: ["High rating"],
      weaknesses: ["Improve diversity"],
      suggestions: ["Add more categories"]
    });
  } catch (error) {
    console.error("Team analysis error:", error);
    res.status(500).json({ error: "Failed to analyze team" });
  }
});

export default router;
