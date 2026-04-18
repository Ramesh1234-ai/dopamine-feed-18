import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import  axios  from "axios";
dotenv.config()
const app = express();
app.use(express.json());

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    process.env.VITE_API_URL || 'http://localhost:5173',
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/doom")
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Connection Error:", err));
// Import routes
import uploadRoutes from './routes/Upload.route.js';
import profileRoutes from "./routes/profileRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import preferencesRoutes from "./routes/preferencesRoutes.js";
// Import models
import { data } from "./models/Profile.js";
// ========================
// EXISTING ROUTES
// ========================
app.get("/data", async (req,res)=>{
  const result = await data.find();
  console.log(result);
  res.json(result);
});
app.post("/add", async (req,res)=>{
  const newData = await data.create(req.body);
  res.json(newData);
});

app.get("/search", async (req,res)=>{
  const result = await data.find(req.query);
  res.json(result);
});

app.get("/api/debug/models", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.x.ai/v1/models",
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
        }
      }
    );
    console.log("Available models:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching models:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});
// Grok API endpoint for roast generation
app.post("/api/roast", async (req, res) => {
  try {
    const { stats } = req.body;
    
    if (!stats) {
      return res.status(400).json({ error: "Stats data required" });
    }

    const prompt = `You are a witty, Gen-Z AI roaster. Analyze this user's art gallery preferences and roast them playfully based on their behavior. Keep it funny, sarcastic, and internet humor style.

User Stats:
- Total Saved Artworks: ${stats.totalSaved}
- Top Category/Style: ${stats.topCategory || 'None yet'}
- Variety Score (different categories): ${stats.varietyScore}
- Top Artist: ${stats.topArtist || 'Various'}

Generate EXACTLY 4 roast lines (each under 18 words) about their taste/behavior. Then provide a witty final verdict line.

Format your response as JSON:
{
  "roasts": ["line1", "line2", "line3", "line4"],
  "verdict": "final verdict line"
}

Make it savage but playful, no offensive content. Use modern internet slang and meme references.`;

    const response = await axios.post(
      "https://api.x.ai/v1/chat/completions",
      {
        model: "grok-vision-beta",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Parse the JSON response from Grok
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from Grok");
    }
    
    const roastData = JSON.parse(jsonMatch[0]);
    
    res.json(roastData);
  } catch (error) {
    console.error("Grok API Error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to generate roast",
      message: error.message 
    });
  }
});
// ========================
// API ROUTES
// ========================
app.use("/api/images", uploadRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/preferences", preferencesRoutes);
// ========================
// ERROR HANDLER
// ========================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
