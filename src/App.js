import React, { useState } from "react";
import "./App.css";

const fakeTweetDatabase = {
  "1798456712234567000": "Sabah kahvemi döktüm, sonra otobüsü kaçırdım. Harika başladık!",
  "1798456712234567001": "Bugün hava şahane, dışarı çıkıp yürüyüş yapmak harikaydı.",
  "1798456712234567002": "Yeni sezona başladım ama ilk bölüm baya sarmadı açıkçası.",
  "1798456712234567003": "Kütüphanede sessizce ders çalışmak gerçekten huzur veriyor.",
  "1798456712234567004": "Sınavdan düşük aldım ama önemli olan öğrenmek diyorum kendime.",
  "1798456712234567005": "Kargom yine kaybolmuş. Bu kaçıncı rezalet anlamıyorum!",
  "1798456712234567006": "Kardeşimle Monopoly oynayıp 3 saat kavga ettik. 😂",
  "1798456712234567007": "Bugün hiçbir şey yapmadım ama nedense çok yorgunum.",
  "1798456712234567008": "Evde temizlik yapmak terapi gibi geliyor bazı günler.",
  "1798456712234567009": "Kafam karışık ama yine de umutluyum. Her şey yoluna girecek."
};

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tweetUrl, setTweetUrl] = useState("");

  const extractTweetId = (url) => {
    const match = url.match(/x\.com\/.*\/status\/(\d+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const tweetId = extractTweetId(tweetUrl);
    if (!tweetId) {
      alert("Geçerli bir tweet linki giriniz.");
      setLoading(false);
      return;
    }

    const fakeTweetContent = fakeTweetDatabase[tweetId] || "Bu tweetin içeriği bilinmiyor.";
    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

    if (!API_KEY) {
      alert("Gemini API anahtarı eksik! Lütfen .env dosyasını kontrol edin.");
      setLoading(false);
      return;
    }

    const prompt = `
      Tweet: "${fakeTweetContent}"
      Lütfen aşağıdaki gibi cevap ver:

      Özet: (1 cümlelik sade Türkçe özet)
      Duygu: (yalnızca şu üç kelimeden biri: Olumlu, Olumsuz, Nötr)
    `;

    try {
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await geminiResponse.json();
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!answer) {
        alert("Yanıt alınamadı. Yanıt boş döndü.");
        setLoading(false);
        return;
      }

      const cleanText = answer.replace(/\*/g, "");
      const lines = cleanText.split("\n").map((line) => line.trim());

      let summaryLine = "";
      let sentimentLine = "";

      lines.forEach((line) => {
        if (line.toLowerCase().startsWith("özet")) {
          summaryLine = line.replace(/^özet[:\-]?\s*/i, "");
        } else if (line.toLowerCase().startsWith("duygu")) {
          sentimentLine = line.replace(/^duygu[:\-]?\s*/i, "");
        }
      });

      const username = `@user${tweetId.slice(-4)}`;
      const timestamp = new Date().toLocaleString();

      setAnalysis({
        username,
        content: fakeTweetContent,
        summary: summaryLine || "Belirlenemedi",
        sentiment: sentimentLine || "Belirlenemedi",
        timestamp,
      });

      const params = new URLSearchParams({
        username,
        tweet: fakeTweetContent,
        summary: summaryLine,
        sentiment: sentimentLine,
      });

    const webhookUrl = "YOUR_WEBHOOK_URL_HERE";
    
      await fetch(webhookUrl);
    } catch (error) {
      console.error("API Hatası:", error);
      alert("Bir hata oluştu. Konsolu kontrol et.");
    }

    setLoading(false);
  };

  return (
    <div className="App" style={{ padding: "40px" }}>
      <h1>Tweet Analiz Otomatı</h1>
      <div style={{ marginBottom: "20px" }}>
        <label><strong>Bir sahte tweet seçin:</strong></label><br />
        <select
          value={tweetUrl}
          onChange={(e) => setTweetUrl(e.target.value)}
          style={{ padding: "10px", width: "420px", marginTop: "5px" }}
        >
          <option value="" disabled>Tweet seçin</option>
          {Object.keys(fakeTweetDatabase).map((id) => (
            <option
              key={id}
              value={`https://x.com/testuser/status/${id}`}
            >
              Tweet #{id.slice(-3)} — {fakeTweetDatabase[id].slice(0, 40)}...
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          style={{ width: "400px", padding: "10px" }}
          value={tweetUrl}
          onChange={(e) => setTweetUrl(e.target.value)}
          placeholder="Tweet linkini girin"
          required
        />
        <br />
        <button type="submit" disabled={loading} style={{ marginTop: "10px" }}>
          {loading ? "Analiz ediliyor..." : "Analiz Et"}
        </button>
      </form>

      {analysis && (
        <div className={`analysis-card ${
          analysis.sentiment === "Olumlu" ? "positive" :
          analysis.sentiment === "Olumsuz" ? "negative" :
          analysis.sentiment === "Nötr" ? "neutral" : ""
        }`}>
          <h2>🔍 Analiz Sonucu</h2>
          <p><strong>Kullanıcı Adı:</strong> {analysis.username}</p>
          <p><strong>Tweet:</strong> {analysis.content}</p>
          <p><strong>Özet:</strong> {analysis.summary}</p>
          <p><strong>Duygu:</strong> {analysis.sentiment}</p>
          <p><strong>Tarih:</strong> {analysis.timestamp}</p>
        </div>
      )}
    </div>
  );
}

export default App;
