export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { query } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `הכן נתיב מחקר לימודי בפורמט JSON עבור הנושא: ${query}. החזר אובייקט עם: hint (משפט פתיחה), ו-curatedLinks (מערך של title, url, description).` }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    const data = await response.json();
    if (data.candidates && data.candidates[0]) {
      const content = JSON.parse(data.candidates[0].content.parts[0].text);
      return res.status(200).json(content);
    }
    throw new Error('AI failed');
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
}
