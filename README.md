# Nakshatra — Vedic AI Astrologer

A purpose-built AI chatbot that delivers personalised Vedic (Jyotish) astrology readings through the persona of an ancient mystical sage.

## What I Built

Nakshatra is a conversational astrology app where users enter their birth details (name, date, time, place) and receive deeply personalised Vedic readings. The bot — named Jyotish — speaks with the voice of an ancient sage, referencing Nakshatras, Dashas, Grahas, and Yogas grounded in the user's actual birth data.

The birth location is geocoded via OpenStreetMap's Nominatim API to extract precise latitude and longitude, which is passed to the model so planetary calculations are grounded in real coordinates rather than hallucinated.

## Why Vedic Astrology

Vedic (Jyotish) astrology is one of the oldest knowledge systems in the world, with a rich, structured framework — 27 Nakshatras, 9 Grahas, 12 Bhavas, Vimshottari Dasha cycles, and dozens of Yogas. This made it ideal for a purpose-built chatbot: the knowledge base is deep, the vocabulary is distinctive, and the persona writes itself.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix)
- **OpenRouter API** (LLM routing)
- **Nominatim / OpenStreetMap** (birth place geocoding)
- **Vercel** (deployment)

## Features

- Onboarding screen collects birth details before the chat begins
- Birth place geocoded to real coordinates for grounded readings
- Streaming responses with a "Consulting the stars…" thinking indicator
- Suggested questions on empty state
- Zodiac sign + Nakshatra badge in the header derived from birth date
- Fully dark cosmic UI — stars, deep navy, gold accents, Cinzel serif headings
- Responsive on mobile and desktop
- Markdown rendering for structured responses

## Running Locally
```bash
git clone https://github.com/yourusername/nakshatra-gpt
cd nakshatra-gpt
npm install
```

Create `.env.local`:
```
OPENROUTER_API_KEY=your_key_here
```
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deployed on Vercel. Add `OPENROUTER_API_KEY` under Project Settings → Environment Variables.

## AI Tools Used

Built with Claude , using iterative prompting to scaffold, debug, and refine. The Loom walkthrough covers how I directed the AI, reviewed outputs, and made decisions throughout the build.
