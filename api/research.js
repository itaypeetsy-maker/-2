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
          contents: [{ 
            parts: [{ 
              text: `Act as a research assistant. User query: "${query}".
              Return a JSON object (and ONLY JSON) with this structure (Hebrew):
              {
                "summary": "Short explanation about the topic (2 sentences)",
                "webLinks": [
                  {"title": "Website Title 1", "url": "https://google.com/search?q=${query}+1", "description": "Short description"},
                  {"title": "Website Title 2", "url": "https://google.com/search?q=${query}+2", "description": "Short description"},
                  {"title": "Website Title 3", "url": "https://google.com/search?q=${query}+3", "description": "Short description"}
                ],
                "youtubeLinks": [
                  {"title": "Video Title 1", "url": "https://www.youtube.com/results?search_query=${query}", "description": "Watch video"},
                  {"title": "Video Title 2", "url": "https://www.youtube.com/results?search_query=${query}", "description": "Watch video"},
                  {"title": "Video Title 3", "url": "https://www.youtube.com/results?search_query=${query}", "description": "Watch video"}
                ]
              }
              Make sure the content is real and helpful.` 
            }] 
          }],
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    const data = await response.json();
    if (!data.candidates) throw new Error('AI Error');
    
    const content = JSON.parse(data.candidates[0].content.parts[0].text);
    res.status(200).json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
