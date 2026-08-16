# LinkPulse - Modern URL Shortener

A full-featured Next.js URL shortener web application with real-time analytics, link management, custom slugs, QR code generation, and interactive dashboards.

## Local Development

Run from the root directory:

```bash
npm install
npm run dev
```

Or directly inside `frontend/`:

```bash
cd frontend
npm install
npm run dev
```

## Deployment (Vercel, Replit, Render, Netlify)

The project includes root `vercel.json` and `package.json` configurations.

### Option 1: Vercel (Automatic Root Detection)
Simply push/import the repository into Vercel. Vercel will automatically detect `vercel.json` and deploy `frontend/` without additional configuration.

### Option 2: Vercel (Manual Settings if needed)
- **Framework Preset**: `Next.js`
- **Root Directory**: `frontend`
- **Install Command**: `npm install`
- **Build Command**: `npm run build`
