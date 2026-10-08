# AarogyaSpeech X

**Hindi Speech Practice & Misarticulation Support Platform for Children** — a national-level hackathon MVP.

> AarogyaSpeech X is an AI-assisted speech-practice and therapy-support platform. It does **not** provide medical
> diagnosis or replace a qualified therapist. All speech analysis in this MVP is **simulated demo output**.

---

## Project Overview

AarogyaSpeech X gives children a play-based Hindi pronunciation practice loop, gives therapists an analytical review
workspace, and gives parents an easy weekly progress summary.

```
Hindi Therapy Material → Child sees Hindi word → Listens → Records voice →
Speech Analysis → Expected vs Observed Phoneme → Progress Update → Personalized Practice Recommendation
```

Example demo analysis: target word **रथ**, expected sound **र**, observed sound **ल** → possible pronunciation
pattern detected (substitution) → needs therapist review.

---

## Features

- **Landing page** with problem statement, how-it-works loop and feature grid
- **Demo login** (no real auth) — Continue as Child / Parent / Therapist / Admin
- **Child dashboard** — greeting `नमस्ते आरव! 👋`, focus sound, streak, level, Recharts progress chart, recommended practice
- **Speech practice** — real microphone recording via `MediaRecorder`, listen (SpeechSynthesis hi-IN), playback, retry, submit
- **Demo AI analysis** — expected vs observed phoneme, error type, confidence, "Needs therapist review" status
- **Phoneme analysis visualization** — expected vs observed table + confusion matrix
- **Hindi therapy materials** — स्वर / व्यंजन / चित्र / शब्द / वाक्य / कहानी / सुनो और बोलो / खेल, tagged by sound, position, difficulty
- **Story therapy** — रिया और लाल रथ with target-word highlighting, listen / read / record / practice
- **Therapy game** — सही चित्र चुनो with session score and stars
- **Personalized recommendation** — rule-based therapy ladder Sound → Syllable → Word → Sentence → Story
- **Parent dashboard** — child progress, weekly practice, progress trend, activity completion, home activity, next session
- **Therapist dashboard** — caseload table, today's schedule, review queue, child detail with Accept / Modify / Reject review
- **Admin dashboard** — platform KPIs, therapy activity, most-practiced sounds, content usage, users, therapists, content, AI models, audit logs
- **Speech Progress Profile** (radar) at `/child/digital-twin` — clearly labelled as a practice profile, not a medical clone

---

## Tech Stack

| Layer      | Choice                                              |
| ---------- | --------------------------------------------------- |
| UI         | React 19 + TypeScript + Vite                        |
| Styling    | Tailwind CSS v4, Baloo 2 + Noto Sans Devanagari     |
| Icons      | lucide-react                                        |
| Charts     | Recharts                                            |
| Routing    | react-router-dom (HashRouter, deep-linkable)        |
| Audio      | MediaRecorder API + SpeechSynthesis (hi-IN)         |
| State      | React Context store (`src/store/AppContext.tsx`)    |
| Data       | Centralised demo data (`src/data/demoData.ts`)      |

No backend, database, Docker, API key or external service is required.

---

## Deployment Guide (GitHub & Vercel)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - AarogyaSpeech X website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Import your GitHub repository.
3. Vercel will automatically detect **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. (Optional) Set Environment Variable for backend API:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-api-url.com` (If backend is deployed on Render/Railway. If omitted, frontend safely operates in offline WebSpeech AI mode).
5. Click **Deploy**. Vercel will build and publish your site!

---

## Run Instructions

```bash
npm install
npm run dev
```

Open the printed local URL. Production build:

```bash
npm run build && npm run preview
```

> Microphone recording requires `localhost` or HTTPS and browser permission. If permission is denied, the app shows a
> friendly retry state instead of failing silently.

---

## Demo Flow (end-to-end)

1. **Landing page** → `Continue as Child` (or `Start Therapy`)
2. **Child dashboard** → `Start Practice`
3. **Practice** → select **रथ** (dropdown or Materials page) → 🔊 Listen → 🎤 Record → ⏹ Stop → ▶ Play Recording
4. `Submit for Analysis` → **"Analyzing speech…"** → **Demo AI Analysis**: expected **र**, observed **ल**, Substitution, 82%, Needs therapist review
5. **Recommended Next Practice** (rule-based) + progress updated
6. Left sidebar → **Switch role → Therapist** → Dashboard → open child → Speech Analysis, Phoneme Errors, Confusion Matrix → **Accept / Modify / Reject** (AI result is preserved separately from therapist review)
7. **Switch role → Parent** → Dashboard shows the updated child progress and recent practice
8. **Switch role → Admin** → platform analytics including live demo-session attempts

---

## AI Demo Limitation

`src/services/speechAnalysisService.ts` exposes `analyzeSpeech(audioBlob)`. In this MVP it returns a **simulated**
result after a short delay (`isDemo: true`). No ML model, no speech API and no cloud inference is used, and nothing in
the product is presented as a diagnosis. Every AI surface is labelled **"Demo AI Analysis"**, and therapist review is
mandatory before any therapy-plan change.

## Future Architecture

```
Mic → MediaRecorder (browser)
      ↓
POST /api/v1/speech/analyze        (FastAPI)
      ↓
Feature extraction → Hindi phoneme recognizer → misarticulation classifier
      ↓
Postgres + pgvector storage · therapist review queue · audit log
      ↓
speechAnalysisService returns the same SpeechAnalysisResult shape
```

Because the frontend only talks to `speechAnalysisService`, swapping the simulated implementation for a real backend
requires no component changes. Therapy materials, progress history and assessments are all typed
(`src/types/index.ts`) so they can be served from the API later.

---

## Notes on Data

All names, scores, confusion matrices and analytics in this repository are **curated demo data** for a 15-minute build.
Content is not clinically validated and must not be used for clinical decision-making.
