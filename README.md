# PRMPT

A single site combining two experiences:

- **Landing (`/`)** — a full-screen, scroll-driven fashion/archive hero for
  the "PRMPT" brand: video hero with a custom cursor, then a black panel
  with a scattered image gallery that scales in/out as you scroll, ending
  in a white outro with a "view" CTA.
- **AI Stylist (`/chat`, `/lookbook`, `/about`)** — a StyleMe-style AI
  fashion assistant: a chat interface backed by the Claude API, a filterable
  lookbook, and an about page.

## Stack

React 19 + TypeScript, Vite 6, Tailwind CSS v4, GSAP-free RAF-driven scroll
animation, Motion (Framer Motion) for entrance transitions, React Router,
and a small Express server that proxies chat requests to the Anthropic API
(so the API key never reaches the browser).

## Getting started

```bash
npm install
cp .env.example .env   # then set ANTHROPIC_API_KEY
npm run server          # starts the chat API on http://localhost:8787
npm run dev              # in another terminal, starts Vite on http://localhost:5173
```

The Vite dev server proxies `/api/*` to the Express server, so the chat
page works out of the box in development.

## Build

```bash
npm run build
npm run preview
```

For production you'll also need to run `server/index.js` (or port its
logic to your own serverless function) alongside the built static files,
with `ANTHROPIC_API_KEY` set in the environment.
