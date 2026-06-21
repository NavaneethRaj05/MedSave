# 💊 MedSave — Medicine Price Comparator

> **Built for Indian consumers to fight medicine price exploitation.**

MedSave is a full-stack MERN application that helps Indian consumers compare medicine prices across Jan Aushadhi (PMBJP government generic pharmacies), Apollo, MedPlus, PharmEasy, and local medical shops — exposing overcharging and empowering patients with data and AI.

---

## 🚨 The Problem

Local medical shops routinely sell medicines at full MRP. The same medicine is available:
- **50–90% cheaper** at Jan Aushadhi (government generic pharmacies)
- **15–40% cheaper** at chain pharmacies with loyalty discounts
- Consumers don't know their rights

---

## 🛠 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18, Vite 5, React Router v6 |
| Styling     | Vanilla CSS, Framer Motion        |
| Backend     | Node.js, Express 4                |
| Database    | MongoDB, Mongoose 7               |
| AI Engine   | Anthropic Claude (claude-sonnet)  |
| Barcode     | @zxing/library                    |
| Toasts      | react-hot-toast                   |

---

## 🤖 AI Features

1. **🔬 Generic Substitution Engine** — Claude analyses any branded medicine and returns 4 cheaper generic/Jan Aushadhi alternatives with savings %.
2. **💬 Symptom → Medicine Suggester** — Describe a symptom, get safe OTC medicine suggestions with real prices. Includes medical disclaimer.
3. **📊 Price Trend Explainer (Streaming)** — SSE-based real-time streaming explanation of why a medicine is priced the way it is.
4. **🔔 Smart Price Alerts** — Set a target price; server checks every 6 hours and marks alert when price drops.
5. **📋 Prescription Reader** — Upload a prescription photo; Claude Vision extracts medicine names and dosages.
6. **🤖 MedSave Chatbot** — Floating chat assistant for questions about Jan Aushadhi, generic medicines, and pricing.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017 (or MongoDB Atlas URI)
- Anthropic API key

### 1. Clone & Install

```bash
git clone <repo-url>
cd medsave

# Install root deps
npm install

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure Environment

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medsave
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
NODE_ENV=development
CACHE_TTL_SECONDS=3600
```

### 3. Start Development

```bash
# From root — starts both server (port 5000) and client (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📸 Screenshots

_Coming soon_

---

## 📄 License

MIT — Built with ❤️ for Indian consumers.
