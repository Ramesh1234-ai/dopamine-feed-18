
const router = require("express").Router();
const Profile = require("../models/Profile");

router.get("/", async (req,res)=>{
  const profiles = await Profile.find();
  res.json(profiles);
});

module.exports = router;
