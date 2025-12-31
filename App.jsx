import React, { useState } from 'react';
import { Search, BookOpen, Video, Globe, Loader2, GraduationCap, ArrowRight, Lightbulb, AlertCircle, ExternalLink } from 'lucide-react';

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError("השרת עסוק כרגע, נסה שוב בעוד כמה שניות.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-right p-4 md:p-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl shadow-lg text-white mb-6">
            <GraduationCap size={44} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">חוקר העתיד</h1>
          <p className="text-slate-500 text-lg">מחקר בטוח וחכם מבוסס בינה מלאכותית</p>
        </header>

        <form onSubmit={handleSearch} className="bg-white rounded-[2.5rem] shadow-xl p-3 mb-10 border border-slate-100 flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="מה תרצו לחקור היום?"
            className="flex-1 py-4 px-8 text-xl rounded-2xl focus:outline-none"
          />
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-10 py-4 rounded-[1.8rem] font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <Search />}
            <span>התחל מחקר</span>
          </button>
        </form>

        {loading && (
          <div className="flex flex-col items-center py-10">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-indigo-600 font-bold">בונה נתיב למידה מאובטח...</p>
          </div>
        )}

        {results && !loading && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Lightbulb className="text-amber-500" /> רמז למחקר:
              </h2>
              <p className="text-lg text-slate-600 italic">"{results.hint}"</p>
            </div>

            <div className="grid gap-4">
              {results.curatedLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-white p-5 rounded-3xl border hover:border-indigo-400 transition-all flex justify-between items-center group">
                  <div className="flex gap-4">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white"><BookOpen /></div>
                    <div>
                      <h4 className="font-bold text-slate-800">{link.title}</h4>
                      <p className="text-slate-500 text-sm">{link.description}</p>
                    </div>
                  </div>
                  <ExternalLink size={20} className="text-slate-300 group-hover:text-indigo-600" />
                </a>
              ))}
            </div>

            <div className="bg-slate-100 p-6 rounded-[2rem]">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Video className="text-red-500" /> סרטונים מומלצים:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.youtubeQueries.map((q, i) => (
                  <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`} target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-xl font-medium hover:text-red-600 transition-colors flex justify-between">
                    <span>{q}</span>
                    <ArrowRight size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
