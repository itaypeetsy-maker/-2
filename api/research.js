export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.GEMINI_API_KEY;
  const { query } = req.body;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Generate a research path in JSON for: ${query}. Use Hebrew. Format: {"hint": "string", "curatedLinks": [{"title": "string", "url": "string", "description": "string"}]}` }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    const content = JSON.parse(data.candidates[0].content.parts[0].text);
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI', details: error.message });
  }
}
