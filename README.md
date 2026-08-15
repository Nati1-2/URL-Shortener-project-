# URL Shortener Frontend

This project is prepared as a frontend-only Next.js app in `frontend/`.

## Local development

```powershell
cd frontend
npm install
npm run dev
```

## Deploy to Vercel

When importing the repository in Vercel:

- Framework Preset: `Next.js`
- Root Directory: `frontend`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: leave empty/default

Vercel will install dependencies from `frontend/package-lock.json` and build the app with the standard Next.js adapter.
