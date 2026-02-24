
const router = require("express").Router();
const Profile = require("../models/Profile");
const { calculateTeamScore } = require("../services/scoringEngine");

router.post("/analyze", async (req,res)=>{
  const profiles = await Profile.find({_id: {$in: req.body.ids}});
  const score = calculateTeamScore(profiles);

  res.json({
    team_score: score,
    strengths: ["High rating"],
    weaknesses: ["Improve diversity"],
    suggestions: ["Add more categories"]
  });
});

module.exports = router;
