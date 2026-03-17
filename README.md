# ClearCare

> The expert sitting beside every family caregiver.

**63 million Americans** navigate medical paperwork alone — discharge papers, insurance explanations, itemized bills. ClearCare uses **Gemini 2.5 Flash Lite** by Google DeepMind to decode those documents in plain English and fight overbilling in seconds.

---

## Live Demo

Navigate to `/demo` — everything is pre-loaded. No typing required. Three real patient scenarios run in parallel.

---

## Setup (2 minutes)

```bash
git clone https://github.com/YOUR_USERNAME/clearcare.git
cd clearcare
npm install
cp .env.local.example .env.local
# Add your GOOGLE_API_KEY from https://aistudio.google.com/apikey
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_API_KEY` | ✅ Yes | Gemini API key from Google AI Studio |
| `CMS_MARKETPLACE_API_KEY` | Optional | CMS Healthcare.gov API key for live insurance plan data. App works without it using reference data. |
| `GOOGLE_GENAI_USE_VERTEXAI` | Optional | Set to `true` to use ADC/Workload Identity instead of API key |
| `GOOGLE_CLOUD_PROJECT` | Optional | GCP project ID when using Vertex AI ADC |

---

## Deploy to Vercel

```bash
# One-click deploy
vercel deploy

# Set secrets
vercel env add GOOGLE_API_KEY
vercel env add CMS_MARKETPLACE_API_KEY  # optional
```

The `vercel.json` is pre-configured with:
- Function timeout: 60s for analysis routes, 30s for letter/document
- Security headers (HSTS, X-Frame-Options, CSP)
- Environment variable references

---

## Gemini Models

All three model slots use **`gemini-2.5-flash-lite`** — Google DeepMind's fastest reasoning model with multimodal vision and 1M token context.

| Slot | Model ID | Used For |
|---|---|---|
| `reasoning` | `gemini-2.5-flash-lite` | Medical care analysis, bill auditing |
| `vision` | `gemini-2.5-flash-lite` | PDF/image OCR (discharge papers, bills) |
| `fast` | `gemini-2.5-flash-lite` | Dispute letter generation |

---

## Architecture

```
app/
  page.tsx              — Landing page
  care/page.tsx         — Care Companion (4-step flow)
  bill/page.tsx         — Bill Guardian (4-step flow)
  demo/page.tsx         — Live demo (3 parallel scenarios)
  api/
    analyze-care/       — Streaming care analysis (POST)
    analyze-bill/       — Streaming bill analysis (POST)
    generate-letter/    — Dispute letter generation (POST)
    extract-document/   — PDF/image OCR via Gemini vision (POST)
    insurance-plans/    — CMS plan data lookup (GET, cached 6h)
    test/               — API health check (GET)

components/
  CareOutput.tsx        — Care analysis results display
  BillOutput.tsx        — Bill analysis + line items table
  DisputeLetter.tsx     — Generated letter preview + download
  PatientSetup.tsx      — Patient profile form
  InsurancePicker.tsx   — Insurance plan selector with live data
  DocumentUpload.tsx    — Drag-drop + paste document input

lib/
  gemini.ts             — Google GenAI client setup
  prompts.ts            — Gemini system prompts (care, bill, letter)
  medicalKnowledge.ts   — CPT codes, medications, red flag symptoms
  insuranceData.ts      — Insurance plan reference data
  insuranceApi.ts       — CMS Marketplace API integration
  validation.ts         — API input validation helpers
  constants.ts          — Shared constants (durations, limits, keys)
```

---

## Features

### Care Companion
- Decodes hospital discharge summaries into plain English
- Personalized medication warnings (Warfarin, Metformin, Lisinopril, etc.)
- Three-tier symptom watch list: Call 911 / Call Doctor / Monitor at Home
- Doctor questions generated from the specific discharge
- Follow-up action checklist (persisted daily in localStorage)
- Share summary with family via one-click copy

### Bill Guardian
- Line-by-line analysis of itemized medical bills
- CPT code validation against Medicare allowed rates
- Verdicts: Covered / Partially Covered / Overbilled / Needs Itemization
- Illinois patient rights sidebar
- One-click dispute letter generation (certified mail ready)
- Download dispute letter as `.txt`

### Live Demo
- Three pre-loaded patient scenarios (cardiac, oncology, orthopedic)
- Parallel streaming analysis — care + bill simultaneously
- Animated savings counter
- Tabbed results: Overview / Care / Bill / Source Documents

---

## Hackathon Categories

- **Best for Chicago** — Illinois insurer data, Chicago hospital addresses, Illinois patient billing rights statute
- **Most Unexpected** — AI reads your 74-year-old dad's discharge papers and tells you exactly when to call 911
- **Crowd Favorite** — 1 in 4 Americans is an unpaid caregiver right now
- **Ship Ready** — Deployed, validated, streaming, end-to-end working

---

## Built With

- [Next.js 14](https://nextjs.org) App Router + TypeScript
- [Gemini 2.5 Flash Lite](https://deepmind.google/technologies/gemini/) via Google AI SDK
- [Tailwind CSS](https://tailwindcss.com) + Radix UI
- [Vercel](https://vercel.com) for deployment

---

*Google DeepMind Hackathon 2026 — ClearCare — 63M caregivers, finally heard.*
