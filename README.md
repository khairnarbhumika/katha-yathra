# 🧭 Katha Yatra ("Journey of Stories")
### Cultural & Civilizational Gamified Learning Platform for Kids

**Katha Yatra** is a full-stack, responsive web application designed to transform cultural and historical heritage into an engaging, gamified ecosystem for children aged 6–14+. It bridges ancient epics and civilizational wisdom with modern space exploration and STEM discovery.

---

## 🌟 Key Features

1. **User Authentication & Profiles:**
   - Secure email/password authentication with JWT stored in HTTP-Only cookies and Authorization headers.
   - Child-friendly avatars (Time Explorer, Royal Scholar, Artifact Hunter, Cosmic Stargazer, Epic Guardian, Monument Builder).
   - Age-group filtering (`6-9`, `10-13`, `14+`).
   - Daily streak tracking with flame multiplier (+20 XP daily streak reward).

2. **Civilizational Tracks & Heritage Archive:**
   - **Vedic & Indian Heritage:** Ramayana, Mahabharata, Panchatantra, Indus Valley Harappan engineering.
   - **Ancient Egyptian & African Civilizations:** Pyramids, Hieroglyphs, Pharaohs, Kingdom of Kush.
   - **Greco-Roman & European History:** Archimedes, Antikythera Mechanism, Colosseum, Renaissance Inventions.
   - **Islamic Golden Age & Middle East:** House of Wisdom, Astrolabes, Al-Khwarizmi, Ibn Battuta.
   - **Asian & Silk Road Lore:** Great Wall, Terracotta Army, Jade Road, Ancient Compass.
   - **Biblical & Mesopotamian Heritage:** Babylon, Hanging Gardens, Gilgamesh, Cuneiform Tablets.

3. **Interactive Mini-Games Suite:**
   - **Timeline Runner & Civilization Quiz:** Sprint through epochs, dodge anomalies, collect ancient relics (+50 XP).
   - **Heritage Word Match & Glyph Decoder:** Decipher hieroglyphs, Indus seals, Sanskrit symbols, and astrolabe tools.
   - **Archaeological Monument Builder:** Assemble ancient wonders layer-by-layer with historical architectural annotations.

4. **⚡ Dynamic Twist-Ending Story Engine (Powered by Gemini):**
   - **Core Gamification Milestone:** Reaching every 2nd completed level (`levels_completed % 2 === 0`) automatically triggers the AI story engine.
   - Produces high-stakes cliffhanger twist endings using `@google/genai` (`gemini-2.5-flash`).
   - Integrated Web Speech API narrator ("Listen Aloud").

5. **🚀 Premium STEM & Space Marketplace:**
   - Store where children redeem earned reward points (+50 XP per level) for high-definition video modules:
     - James Webb Space Telescope & Infrared Astronomy
     - Quantum Computing for Young Explorers
     - Mars 2020 Perseverance & Ingenuity Helicopter
     - Ancient Engineering vs Modern Mega-Structures
     - Fusion Energy & Artificial Sun
     - Black Holes & The Event Horizon Telescope

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Framer Motion, Canvas-Confetti, TanStack Query v5.
- **Backend:** Node.js, Express.js (TypeScript), JWT, BcryptJS, Cookie-Parser.
- **AI Integration:** `@google/genai` with `gemini-2.5-flash` model and structured JSON schemas.
- **Database:** PostgreSQL (with `pg` connection pool) + zero-dependency persistent local storage fallback for instant execution.

---

## 🚀 Quick Start

### 1. Run Development Environment
From the project root directory:
```bash
# Install root dependencies
npm install

# Start both backend and frontend concurrently
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

### 2. Environment Variables (`.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/kathayatra
JWT_SECRET=super_secret_jwt_key_katha_yatra_2026
GEMINI_API_KEY=your_google_gemini_api_key_here
```

---

## 🧪 Testing the Complete Gameplay Loop

Run the automated integration test script:
```bash
cd server
npx tsx src/test_flow.ts
```
