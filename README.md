# 🧠 Tweet Analiz Otomatı – Google Sheets Sürümü (main branch)

Bu proje, kullanıcıdan alınan bir Tweet bağlantısının özetini çıkaran ve duygu analizini yapan bir React uygulamasıdır.  

Analiz sonuçları, **Google Gemini API** kullanılarak alınır ve **Google Sheets** tablosuna kaydedilir.


---

## 🚀 Özellikler

- 🔗 Tweet bağlantısından Tweet ID’sini otomatik alır
- 🧠 Google Gemini API ile:  
  - 1 cümlelik sade Türkçe özet çıkarır  
  - Duygu analizini "Olumlu, Olumsuz, Nötr" olarak sınıflandırır  
- 📄 Google Sheets'e Apps Script üzerinden veri gönderimi sağlar  
- 📊 Kullanıcıya analiz sonuçlarını sade bir kart görünümünde gösterir  
- 🎯 Sahte tweet veritabanı ile simülasyon yapılabilir  

---
🔍 Analiz Arayüzü

![Ekran görüntüsü 2025-06-08 135325](https://github.com/user-attachments/assets/85a056a8-825d-42d3-bc03-b4f28ab4d18e)

📄 Google Sheets'e Kayıt Edilen Veri

![Ekran görüntüsü 2025-06-08 135353](https://github.com/user-attachments/assets/f3fceac1-0545-48d3-8145-372ff08f6b24)


## 📁 Proje Yapısı

tweet-analyzer/

├── public/ # HTML ve statik dosyalar

├── src/ # React bileşenleri ve stil dosyaları

│ ├── App.js # Ana uygulama mantığı

│ └── ... # Diğer destekleyici dosyalar

├── .env # API anahtarlarını içeren gizli dosya

├── README.md # Proje dokümantasyonu

├── package.json # Bağımlılık ve script tanımları

└── .gitignore # Git tarafından takip edilmeyen dosyalar



## 🔧 Kurulum ve Çalıştırma


### 1. Projeyi klonla

git clone https://github.com/GokhanYavuzz/Tweet-Analysis.git  

cd Tweet-Analysis  

git checkout main


2. Gerekli paketleri yükle

npm install


3. .env dosyasını oluştur
   
Ana dizinde .env dosyası oluşturup aşağıdaki bilgileri doldur:

REACT_APP_GEMINI_API_KEY=your_gemini_api_key  

REACT_APP_WEBHOOK_URL=https://script.google.com/macros/s/your_webhook_url/exec  


4. Geliştirme sunucusunu başlat

npm start


📝 Webhook Kurulumu (Google Apps Script)

Bu proje, analiz sonuçlarını Google Sheets’e kaydetmek için bir webhook URL’si kullanır.


Adımlar:

Google Sheets’te boş bir tablo oluştur

Menüden Uzantılar → Apps Komut Dosyası seç

Aşağıdaki kodu yapıştır:


function doGet(e) {

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sayfa1");
  
  sheet.appendRow([
  
    e.parameter.username,
    
    e.parameter.tweet,
    
    e.parameter.summary,
    
    e.parameter.sentiment,
    
    new Date().toLocaleString("tr-TR")
    
  ]);

  return ContentService
  
    .createTextOutput(JSON.stringify({ status: 'success' }))
    
    .setMimeType(ContentService.MimeType.JSON)
    
    .setHeaders({
    
      'Access-Control-Allow-Origin': '*',
      
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      
      'Access-Control-Allow-Headers': 'Content-Type'
      
    });
    
}

Web Uygulaması Olarak Dağıt

Tür: Web uygulaması

Çalıştır: Kendi hesabın olarak

Erişim: Herkes

Oluşan Webhook URL’sini .env içindeki REACT_APP_WEBHOOK_URL alanına ekle

🔐 Güvenlik Notu

.env dosyanız .gitignore içinde olmalı

API anahtarlarınızı ve webhook adresinizi asla GitHub’a yüklemeyin

Webhook URL’nizi sadece bu uygulamayla paylaşın

🔄 Diğer Branch'lar

main = Google Sheets + Gemini API 🌐

master =	Airtable + Gemini API 📦

🧑‍💻 Geliştirici

Geliştiren: @GokhanYavuzz

