export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { query } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // המפתח יישמר בהגדרות הענן מאוחר יותר

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `הכן נתיב מחקר לימודי בפורמט JSON עבור: ${query}` }] }],
          systemInstruction: { 
            parts: [{ text: "You are an educational researcher. Return ONLY a JSON object with: hint (mysterious Hebrew text), curatedLinks (array of {title, url, description}), and youtubeQueries (array of search terms)." }] 
          },
          generationConfig: { responseMimeType: "application/json", temperature: 0.3 }
        })
      }
    );

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    res.status(200).json(JSON.parse(content));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch research path" });
  }
}