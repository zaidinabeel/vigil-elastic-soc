# 🚀 VIGIL: 100% Free Production Cloud Hosting Guide
### *Deploy the Full Stack (Frontend + Backend + Elastic Cloud) Permanently on the Web for Free*

---

## 🏗️ Free Production Architecture

```
┌──────────────────────────────────────────────┐
│ 1. Frontend: Vercel (Free Global CDN)        │
│    • URL: https://vigil-soc.vercel.app       │
│    • Real-time React + Tailwind SOC Cockpit  │
└──────────────────────┬───────────────────────┘
                       │ HTTPS REST / API Calls
                       ▼
┌──────────────────────────────────────────────┐
│ 2. Backend: Render.com (Free Web Service)    │
│    • URL: https://vigil-backend.onrender.com │
│    • Python 3.11 / FastAPI / Orchestrator    │
└──────────────────────┬───────────────────────┘
                       │ Live ES|QL & Bulk Ingestion
                       ▼
┌──────────────────────────────────────────────┐
│ 3. Database: Elastic Cloud (Free Trial/AWS)  │
│    • Region: ap-south-1 (Mumbai)             │
│    • Elasticsearch v9.5.3 + Live Telemetry   │
└──────────────────────────────────────────────┘
```

---

## STEP 1: Deploy Backend to Render.com (Free Tier) — 2 Minutes

1. Go to [**render.com**](https://render.com) and sign up / log in with your GitHub account (100% Free).
2. Click **New +** $\rightarrow$ **Web Service**:
   - Connect your GitHub repository (or click *Public Git repository* and paste your repo URL).
   - **Name**: `vigil-backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: **Free**
3. Scroll to **Environment Variables** and add:
   - `ELASTIC_CLOUD_ID`: *(Paste your Cloud ID from backend/.env)*
   - `ELASTIC_API_KEY`: *(Paste your API Key from backend/.env)*
   - `USE_LIVE_ELASTIC`: `true`
4. Click **Create Web Service**.
5. Render will build and give you a live URL:
   👉 `https://vigil-backend.onrender.com`

---

## STEP 2: Deploy Frontend to Vercel (Free Tier) — 1 Minute

### Method A: Using the Vercel CLI (Super Fast)
In your local terminal:
```bash
cd /Users/nabeelzaidi/Downloads/elastic_hackathon/frontend
npx vercel
```
- It will ask to log in with GitHub/Email.
- Accept the defaults (Press Enter for all prompts).
- Vercel will build and output your permanent live URL:
  👉 **`https://vigil-soc.vercel.app`**

---

### Method B: Via Vercel Web Dashboard
1. Go to [**vercel.com**](https://vercel.com) and click **Add New... $\rightarrow$ Project**.
2. Import your GitHub repository.
3. In **Root Directory**, click edit and select **`frontend`**.
4. Click **Deploy**.

---

## STEP 3: Connect Frontend to Your Live Render Backend

In `frontend/vite.config.ts`, update the proxy target to your Render URL (or set `VITE_API_URL`):
```ts
server: {
  proxy: {
    '/api': {
      target: 'https://vigil-backend.onrender.com',
      changeOrigin: true
    }
  }
}
```

---

## 🎉 Done! Share Your Permanent Links with Your Team:
- 💻 **Live SOC Cockpit Dashboard**: `https://vigil-soc.vercel.app`
- 📡 **Live Backend Swagger API**: `https://vigil-backend.onrender.com/docs`
- 📊 **Live Kibana Cloud Dashboard**: `https://2e98630873f0435f88a6b02c6587a8ed.ap-south-1.aws.elastic-cloud.com:443/app/dashboards`
