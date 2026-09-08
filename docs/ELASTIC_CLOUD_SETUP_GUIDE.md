# ☁️ VIGIL: Complete Elastic Cloud Setup & Testing Guide
### *Step-by-Step Guide to Deploying VIGIL on Elastic Cloud Free Trial*

---

## 1. Create Your Free Trial on Elastic Cloud (Takes 2 Minutes)

1. Go to [**cloud.elastic.co/registration**](https://cloud.elastic.co/registration) and sign up for a **14-day free trial** (no credit card required).
2. Click **Create Deployment**:
   - **Name**: `vigil-bfsi-soc`
   - **Cloud Provider**: **Amazon Web Services (AWS)**
   - **Region**: `ap-south-1 (Mumbai)` *(Recommended to match RBI data localization, or any AWS region)*
   - **Architecture**: General Purpose / Default (Elasticsearch + Kibana)
3. Click **Create Deployment** and save the `elastic` superuser password shown on your screen.

---

## 2. Obtain Your Cloud ID & Create an API Key

### A. Copy your Cloud ID:
- On your deployment overview page in the Elastic Cloud console, look for **Cloud ID** (it looks like: `vigil-bfsi-soc:YXAtc291dGgtMS5hd3MuZm91bmQuaW8k...`).
- Click **Copy Cloud ID**.

### B. Create an API Key:
1. Open **Kibana** from your deployment console.
2. In the top search bar, type `API Keys` (or navigate to **Stack Management $\rightarrow$ Security $\rightarrow$ API Keys**).
3. Click **Create API Key**:
   - **Name**: `vigil-backend-key`
   - Leave default permissions (Admin/Superuser).
4. Click **Create API Key** and copy the generated **API Key**.

---

## 3. Configure Your Backend Environment

In your project directory, copy `.env.example` to `.env`:

```bash
cd /Users/nabeelzaidi/Downloads/elastic_hackathon/backend
cp .env.example .env
```

Open `.env` and paste your credentials:
```ini
ELASTIC_CLOUD_ID=your_copied_cloud_id_here
ELASTIC_API_KEY=your_copied_api_key_here
USE_LIVE_ELASTIC=true
```

*(Note: If you want to test before creating a cloud account, you can leave them blank and VIGIL will run in local simulator mode!)*

---

## 4. Run the Cluster Initialization Script

Run the automated setup script to create ECS v8.11+ BFSI mappings and index templates on your Elastic Cloud deployment:

```bash
cd /Users/nabeelzaidi/Downloads/elastic_hackathon
python3.11 backend/elastic/setup_cluster.py
```

**Expected Output:**
```
================================================================================
🛡️  VIGIL: Initializing Elastic Cloud Cluster Setup...
================================================================================
📊 Cluster Name  : vigil-bfsi-soc
🟢 Cluster Status: GREEN
🔌 Connection    : LIVE ELASTIC CLOUD
--------------------------------------------------------------------------------
📦 [1/3] Registering ECS Component Templates...
   ✅ Component Template 'vigil-ecs-base' registered.
   ✅ Component Template 'vigil-banking-extension' registered.

📋 [2/3] Registering Index Templates...
   ✅ Index Template 'vigil-logs-banking' (pattern: logs-banking-*) active.
   ✅ Index Template 'vigil-logs-auth' (pattern: logs-auth-*) active.
   ✅ Index Template 'vigil-logs-network' (pattern: logs-network-*) active.

⚡ [3/3] Verifying ES|QL Query Engine...
   ✅ ES|QL Engine responsive. Query executed successfully.
================================================================================
```

---

## 5. Ingest the 30-Day Ground-Truth Banking Corpus

Push the 30-day realistic ECS dataset and the 5 attack scenarios directly into Elastic Cloud:

```bash
python3.11 backend/data/telemetry_generator.py --ingest
```

**Expected Output:**
```
🚀 Ingesting 384 documents into Elastic Cloud...
🎉 Successfully indexed 384 ECS documents into Elastic Cloud!
✅ Ground-Truth Corpus Ready!
🎯 Active Attack Scenarios: 5
   • [CRITICAL] INC-2026-0902-01: Privileged OAuth2 Token Theft & Bulk UPI Payout (Exp: Rs. 18,240,000.00)
```

---

## 6. Import Pre-Configured Kibana Dashboards (1-Click Import)

1. Open your **Kibana Console**.
2. Go to **Management $\rightarrow$ Stack Management $\rightarrow$ Saved Objects**.
3. Click **Import** in the top right corner.
4. Drag and drop the file:
   `kibana/vigil_kibana_dashboards.ndjson`
5. Click **Import**.

You now have instant access to:
- 📊 **`[VIGIL] BFSI AI SOC Analyst Command Center`** Dashboard
- 💰 **`₹ Rupee Financial Exposure by Customer Tier`** Lens
- ⚡ **`UPI Transaction Velocity & Anomaly Spikes`** Lens
- 🚨 **`Privileged Account Failed Logins Heatmap`**

---

## 7. Launch the Full Application (Backend + Frontend)

### Terminal 1: Launch Backend API Server
```bash
cd /Users/nabeelzaidi/Downloads/elastic_hackathon
python3.11 backend/main.py
```
- API starts at: `http://localhost:8000`
- Interactive Swagger Docs: `http://localhost:8000/docs`

### Terminal 2: Launch React SOC Cockpit Frontend
```bash
cd /Users/nabeelzaidi/Downloads/elastic_hackathon/frontend
npm install
npm run dev
```
- Open your browser at: **`http://localhost:5173`**

---

## 8. Performing the Live Hackathon Demo Walkthrough

1. **Select Scenario 1**: *Privileged OAuth2 Token Theft & Bulk UPI Payout* in the left feed.
2. **Watch the Live Clock**: The **6-Hour Regulatory Clock** counts down the compliance window.
3. **Click "Auto-Run All Steps"**:
   - **Step 1 (Materiality)**: Checks RBI threshold ($> ₹5\text{L}$ direct loss) $\rightarrow$ Flags as Mandatory Filing.
   - **Step 2 (ES\|QL Evidence)**: Queries Elastic Cloud in 8ms and displays compromised user `svc_payment_gw` and IP `198.51.100.44`.
   - **Step 3 (₹ Exposure)**: Calculates **₹ 1,82,40,000** exposure across 4 Corporate and 14 HNI accounts.
   - **Step 4 (Containment Gate)**: Click **"1-Click Authorize & Execute Containment"** to simulate real-time token revocation and batch freezing.
   - **Step 5 (CERT-In Report)**: View the official Annexure-1 statutory report and click **"Export CERT-In PDF"** to download the official filing.
   - **Step 6 (Ledger)**: Inspect the **SHA-256 Hash Chain** in S3 WORM storage for 100% audit defensibility.
4. **Test Live ES\|QL**: Click the **Live ES\|QL Terminal** tab and run custom piped queries directly against your live Elastic Cloud cluster!
5. **Switch Regional Languages**: Click the **Sarvam Indic Brief** tab to view the executive summary in Hindi, Tamil, Telugu, or Marathi.
