
import express from "express";
import { data } from "../models/Profile.js";
const router =express.Router();
router.get("/", async (req, res) => {
  try {
    const profiles = await data.find();
    res.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const profile = await data.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});
export default router;
