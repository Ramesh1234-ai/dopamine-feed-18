const axios = require('axios');

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Invalid response format from Grok");
    }
    
    const roastData = JSON.parse(jsonMatch[0]);
    
    res.status(200).json(roastData);
  } catch (error) {
    console.error("Grok API Error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to generate roast",
      message: error.message 
    });
  }
};
