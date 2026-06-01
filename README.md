# CineAI 🎬

An AI-powered movie and series chatbot. Built with React + Vite, secured via a Cloudflare Worker proxy, deployed to Cloudflare Pages.

## Architecture

```
User Browser
    │
    ▼
React App (Cloudflare Pages)
    │  POST /api/chat  (no API key in browser)
    ▼
Cloudflare Worker  ◄── GEMINI_API_KEY stored as secret here
    │
    ▼
Google Gemini API
```

The Gemini API key **never reaches the browser**. It lives only in Cloudflare Worker secrets.

---

## Local Development

### 1. Install dependencies

```bash
# Install frontend deps
cd frontend && npm install

# Install worker deps
cd ../worker && npm install
```

### 2. Set the Gemini API key for local dev

```bash
cd worker
# Creates a local .dev.vars file (gitignored)
echo 'GEMINI_API_KEY=your_key_here' > .dev.vars
```

Get your key from: https://aistudio.google.com → Get API Key

### 3. Run both together (two terminals)

**Terminal 1 — Worker:**
```bash
cd worker && npx wrangler dev
# Runs on http://localhost:8787
```

**Terminal 2 — Frontend:**
```bash
cd frontend && npm run dev
# Runs on http://localhost:5173
# Vite proxy forwards /api → http://localhost:8787
```

Open http://localhost:5173

---

## Deployment

### Step 1 — Deploy the Worker

```bash
cd worker

# Login to Cloudflare
npx wrangler login

# Deploy the worker
npx wrangler deploy

# Store your Gemini key as a secret (you'll be prompted to paste it)
npx wrangler secret put GEMINI_API_KEY
```

Note your Worker URL, e.g. `https://cineai-worker.yourname.workers.dev`

### Step 2 — Update CORS in the Worker

Edit `worker/src/index.js`, add your Pages URL to `ALLOWED_ORIGINS`:

```js
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://cineai.pages.dev',         // ← add your Pages URL
  'https://yourcustomdomain.com',     // ← add if using custom domain
]
```

Redeploy: `npx wrangler deploy`

### Step 3 — Update the Pages redirect

Edit `frontend/_redirects`, replace the worker URL:

```
[[redirects]]
  from = "/api/*"
  to = "https://cineai-worker.yourname.workers.dev/api/:splat"
  status = 200
  force = true
```

### Step 4 — Deploy the Frontend to Cloudflare Pages

**Option A — Via Git (recommended):**
1. Push this repo to GitHub
2. Go to dash.cloudflare.com → Workers & Pages → Create → Pages → Connect Git
3. Select your repo
4. Build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Build output directory: `frontend/dist`
5. Deploy

**Option B — Manual:**
```bash
cd frontend && npm run build
npx wrangler pages deploy dist --project-name=cineai
```

---

## Security Checklist

- [x] Gemini API key stored as Cloudflare Worker secret (never in frontend)
- [x] CORS restricted to your domain only
- [x] Input validation on message format and length
- [x] Conversation length capped at 100 messages
- [x] Gemini errors sanitized before reaching client
- [x] Safety settings enabled on Gemini responses
- [ ] Rate limiting — enable in Cloudflare Dashboard → Workers → Rate Limiting

---

## Adding Rate Limiting (Recommended before going public)

In the Cloudflare Dashboard:
1. Go to your Worker → Settings → Rate Limiting
2. Add a rule: 20 requests per minute per IP
3. This prevents API abuse and protects your free tier

---

## Project Structure

```
cineai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Welcome.jsx
│   │   │   ├── Message.jsx
│   │   │   └── InputBar.jsx
│   │   ├── hooks/
│   │   │   └── useChat.js
│   │   ├── lib/
│   │   │   └── api.js          ← calls /api/chat (no key here)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── _redirects              ← routes /api to worker
└── worker/
    ├── src/
    │   └── index.js            ← API key lives here (secret)
    └── wrangler.toml
```
