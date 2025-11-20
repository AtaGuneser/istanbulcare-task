# Page Builder

Drag & drop tabanlı görsel sayfa oluşturucu. Sidebar'dan elementleri sürükleyip canvas'a bırakarak sayfalar oluşturabilir, elementleri düzenleyebilir ve JSON formatında export edebilirsiniz.

## 🚀 Canlı Demo

[GitHub Repository](https://istanbulcaretask.netlify.app/)

## ✨ Özellikler

- **Drag & Drop**: Sidebar'dan elementleri canvas'a sürükleyip bırakma
- **Element Yönetimi**: Seçme, taşıma, resize, silme, z-index kontrolü
- **Element Tipleri**: Header, Footer, Card, Text Content, Slider
- **Grid Snap**: Grid'e hizalama ile düzenli yerleşim
- **JSON Export**: Oluşturulan sayfayı JSON formatında export etme
- **Responsive**: Canvas genişliğine göre otomatik ayarlama

## 🛠️ Teknolojiler

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Production build
npm run build
```

## 🎯 Kullanım

1. **Element Ekleme**: Sol sidebar'dan bir elementi seçip canvas'a sürükleyin
2. **Element Seçme**: Canvas'taki bir elementi tıklayarak seçin
3. **Taşıma**: Seçili elementi sürükleyerek taşıyın
4. **Resize**: Seçili elementin köşe/kenar handle'larından boyutunu değiştirin
5. **Silme**: Seçili elementte Delete tuşuna basın
6. **Export**: Sağ üstteki "Export JSON" butonuna tıklayın

## 📋 Element Tipleri

| Element      | Varsayılan Boyut | Açıklama                    |
| ------------ | ---------------- | --------------------------- |
| Header       | 100% × 80px      | Sayfa başlığı ve navigasyon |
| Footer       | 100% × 60px      | Alt bilgi alanı             |
| Card         | 300px × 200px    | İçerik kartı                |
| Text Content | 400px × 100px    | Metin içeriği alanı         |
| Slider       | 100% × 400px     | Görsel slider               |

## 📝 JSON Format

Export edilen JSON dosyası şu yapıda:

```json
{
  "project": {
    "name": "Test Builder Layout",
    "version": "1.0"
  },
  "canvas": {
    "width": 1200,
    "height": 800,
    "grid": { "enabled": true, "size": 10, "snap": true }
  },
  "elements": [...]
}
```

## 🧪 Test Senaryoları

- ✅ Element sürükleme ve bırakma
- ✅ Drop zone algılama ve görsel geri bildirim
- ✅ Pozisyon hesaplama ve grid snap
- ✅ Element seçme, taşıma, resize, silme
- ✅ Z-index yönetimi
- ✅ JSON export ve validasyon

## 📄 Lisans

MIT
