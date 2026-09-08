# 🛡️ VIGIL — Hackathon Day Master Deployment & Pitch Guide
**Track 03: Security & AI-Powered SOC | Elastic Indian Bank Hackathon**
**Live URLs**: 
- **Frontend Cockpit**: `https://frontend-one-navy-24.vercel.app`
- **Backend API**: `https://vigil-backend-k511.onrender.com`
- **Swagger Docs**: `https://vigil-backend-k511.onrender.com/docs`
- **GitHub Repository**: `https://github.com/zaidinabeel/vigil-elastic-soc`
- **Elastic Cloud Region**: `ap-south-1` (AWS Mumbai, India) | ES v9.5.3

---

## 📑 TABLE OF CONTENTS
1. [Fresh 0-to-1 Deployment Runbook (Know Before You Build)](#1-fresh-0-to-1-deployment-runbook)
2. [End-to-End 6-Step Investigation Pipeline Explained](#2-end-to-end-6-step-investigation-pipeline)
3. [The 5 Real-World Banking Attack Scenarios Explained](#3-the-5-real-world-banking-attack-scenarios)
4. [Component Architecture & Technical Deep-Dive](#4-component-architecture--technical-deep-dive)
5. [3-Minute Hackathon Demo Script & Judge Q&A Guide](#5-3-minute-hackathon-demo-script--judge-qa)

---

## 1. FRESH 0-TO-1 DEPLOYMENT RUNBOOK
*(Step-by-step setup as per the "Know Before You Build" guidelines)*

### System Requirements
- **Python**: 3.10 or higher
- **Node.js**: 18.x or 20.x
- **Elastic Cloud**: Elasticsearch v9.5.3 or 8.11+ cluster (or local instance)

---

### Step 1: Clone & Configure Environment
```bash
git clone https://github.com/zaidinabeel/vigil-elastic-soc.git
cd vigil-elastic-soc
```

Create `backend/.env` with your Elastic Cloud credentials:
```ini
# backend/.env
ELASTIC_CLOUD_ID=342d4ae4b3c34f17b141a42be3274185:YXAtc291dGgtMS5hd3MuZWxhc3RpYy1jbG91ZC5jb20kMTRhYjg4...
ELASTIC_API_KEY=V1NqT0w1TUJvS1h...
USE_LIVE_ELASTIC=true
AWS_REGION=ap-south-1
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
```

---

### Step 2: Install Dependencies
```bash
# 1. Install Backend Dependencies
pip install -r backend/requirements.txt

# 2. Install Frontend Dependencies
cd frontend
npm install
cd ..
```

---

### Step 3: Initialize Elastic Indices & Bank Mock DB
This script automatically connects to your Elastic Cloud deployment, creates 4 ECS-compliant data streams, and seeds customer accounts:
```bash
# 1. Setup Elasticsearch Indices & ECS Mappings
python3 backend/elastic/setup_cluster.py

# 2. Seed Mock Core Banking Database (SQLite)
python3 backend/data/mock_bank_db.py

# 3. Ingest Attack Scenarios & Background Telemetry Stream
python3 backend/data/telemetry_generator.py
```

---

### Step 4: Import Kibana Dashboards (Optional)
Push pre-configured Kibana Lens, Dashboards, and ES|QL search views:
```bash
python3 kibana/push_kibana_objects.py
```
*(Or import `kibana/vigil_kibana_dashboards.ndjson` directly in Kibana -> Stack Management -> Saved Objects)*

---

### Step 5: Start Local Full-Stack Cockpit (1-Click)
```bash
chmod +x start_live_demo.sh
./start_live_demo.sh
```
* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:8000`
* **Swagger Explorer**: `http://localhost:8000/docs`

---

## 2. END-TO-END 6-STEP INVESTIGATION PIPELINE
*(How VIGIL investigates alerts deterministically without hallucinations)*

```
[ Alert Zero Trigger ]
        │
        ▼
[ Step 1: RBI Materiality Check ]  ──▶ Calculates regulatory severity & 6-Hour SLA Clock
        │
        ▼
[ Step 2: Autonomous ES|QL Hunt ]  ──▶ Stage 1 Detection + Stage 2 Blast Radius Pivot
        │
        ▼
[ Step 3: ₹ Exposure Calculation ] ──▶ Correlates with CBS for Direct Rupee Exposure
        │
        ▼
[ Step 4: Human Containment Gate ] ──▶ Requires SOC Analyst Digital Signature to execute
        │
        ▼
[ Step 5: CERT-In Annexure-1 ]     ──▶ Auto-populates official statutory PDF report
        │
        ▼
[ Step 6: SHA-256 Ledger Append ]  ──▶ Cryptographically seals audit trail in Merkle block
```

### Detailed Breakdown of Each Step:

| Step | Tool Name | What Happens | Why It Matters to Regulators & Banks |
| :--- | :--- | :--- | :--- |
| **Step 1** | `rbi.materiality.check` | Analyzes incident attributes against **RBI Cyber Security Framework Sec 4.2** and CERT-In directions. Evaluates whether the threshold exceeds statutory criteria. | Automatically starts the **6-Hour Mandated Clock** for CERT-In reporting. Prevents non-compliance fines up to ₹1 Crore. |
| **Step 2** | `generate_esql` | Executes a **Two-Stage ES\|QL Threat Hunt** against Elastic Cloud:<br>• **Stage 1 (Threat Detection)**: Evaluates high-velocity anomalous patterns without hardcoded IPs.<br>• **Stage 2 (Lateral Pivot)**: Isolates the blast radius, compromised service accounts, and target entities. | Blazing-fast in-memory aggregation via Elasticsearch ES\|QL without heavy joins or multi-query roundtrips. |
| **Step 3** | `bank.exposure.lookup` | Queries Core Banking (CBS) and UPI ledger records to calculate **Direct Rupee Value at Risk**, Corporate vs HNI accounts exposed, and branch impacts. | C-suite & CISO decision-makers need exact financial risk, not just abstract technical alert scores. |
| **Step 4** | `containment.hitl.gate` | Enforces a **Human-in-the-Loop (HITL)** barrier. Suggests 3 tactical actions (Firewall drop, Bearer token revocation, Outbound queue hold) requiring 1-click SOC digital signature. | AI cannot disrupt live core banking operations without explicit human analyst oversight (eliminates false-positive operational outages). |
| **Step 5** | `certin.report.draft` | Auto-drafts a complete **CERT-In Annexure-1 Statutory Incident Reporting Form** under Section 70B of the IT Act 2000 in under 5 minutes. | Replaces 4+ hours of manual report drafting under severe regulatory pressure. |
| **Step 6** | `evidence.ledger.append` | Generates a tamper-evident **SHA-256 Merkle Block Hash** linking all forensic artifacts, ES\|QL results, analyst sign-off, and CERT-In form. | Complies with WORM (Write Once Read Many) storage standards for indisputable regulatory audit defense. |

---

## 3. THE 5 REAL-WORLD BANKING ATTACK SCENARIOS

### Scenario 1: API Abuse & UPI Mule Ring Drain (Material Breach)
- **The Attack**: Attackers compromise an OAuth2 Bearer token of an automated payment gateway (`svc_payment_gw`), initiate 14 rapid UPI drains totaling ₹64 Lakhs into mule VPAs.
- **ES|QL Detection**:
  ```esql
  FROM logs-banking-*
  | WHERE bank.channel == "UPI_GATEWAY" AND bank.aml_risk_score > 85.0
  | STATS total_drained = sum(bank.amount_inr), tx_count = count() 
    BY source.ip, user.name, bank.batch_id
  ```
- **Business Impact**: ₹64,00,000 at risk across 18 accounts (3 Corporate, 15 HNI).
- **Resolution**: Token invalidated, firewall null-routed `198.51.100.44`, NPCI batch frozen.

---

### Scenario 2: Core Banking Switch Configuration Drift (Critical Breach)
- **The Attack**: Unauthorized configuration change on the ATM Switch ISO 8583 authorization protocol raises per-transaction cash limits from ₹25,000 to ₹10,00,000.
- **ES|QL Detection**:
  ```esql
  FROM logs-audit-*
  | WHERE event.action == "SWITCH_LIMIT_OVERRIDE" 
    AND bank.new_limit_inr > 500000.00
  | KEEP @timestamp, user.name, bank.switch_id, bank.new_limit_inr, source.ip
  ```
- **Business Impact**: ₹1,75,00,000 exposed across off-us ATM dispense networks.
- **Resolution**: Port quarantined to sinkhole VLAN, HSM MAC keys rotated, forced synchronous core validation.

---

### Scenario 3: Privileged Admin Session Hijacking (Pass-the-Hash)
- **The Attack**: Adversary steals Kerberos Golden Ticket / NTLM hash of core banking admin `admin_rsharma` to pivot laterally into the RTGS Inter-Bank Clearing Server.
- **ES|QL Detection**:
  ```esql
  FROM logs-auth-*
  | WHERE winlog.event_id == 4624 AND winlog.logon_type == 9
  | STATS lateral_attempts = count() BY source.ip, user.name, destination.ip
  ```
- **Business Impact**: ₹8,50,00,000 high-value corporate treasury exposure.
- **Resolution**: Active Directory Kerberos KRBTGT password rotated twice, RTGS clearing queue suspended.

---

### Scenario 4: Insider Collusion & Rogue Sweep (Medium Severity)
- **The Attack**: Internal loan processing officer `officer_kvijay` disables velocity limit controls to disburse unauthorized overdraft amounts into personal mule accounts.
- **ES|QL Detection**:
  ```esql
  FROM logs-banking-*
  | WHERE bank.channel == "CBS_LOAN" AND bank.aml_risk_score >= 90.0
  | STATS rogue_volume = sum(bank.amount_inr) BY user.name, destination.account_id
  ```
- **Business Impact**: ₹3,20,000 direct overdraft risk.
- **Resolution**: CBS credentials revoked, debit freezes placed on 12 mule accounts.

---

### Scenario 5: Benign Month-End Batch Reconciliation (False Positive)
- **The Attack / Event**: Monthly core banking interest accrual scheduler fires 250,000 batch transactions at midnight. Alert Zero fires due to spike in transaction volume.
- **ES|QL Detection**:
  ```esql
  FROM logs-banking-*
  | WHERE bank.batch_id LIKE "MONTHLY-*"
  | STATS routine_volume = count(), avg_aml_risk = avg(bank.aml_risk_score) 
    BY bank.batch_id
  ```
- **Evaluation**: AML risk is negligible (score 2.1). Pre-approved in maintenance calendar.
- **Resolution**: **Auto-Suppressed as Benign False Positive**. Avoids analyst fatigue and unwarranted regulatory alarm.

---

## 4. COMPONENT ARCHITECTURE & TECHNICAL DEEP-DIVE

### Architecture Diagram
```
┌────────────────────────────────────────────────────────────────────────┐
│                        VIGIL FRONTEND COCKPIT                          │
│     (React 18 + TypeScript + Vite + Tailwind + Client-Side PDF)        │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTP REST / JSON
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      FASTAPI AGENTIC ORCHESTRATOR                      │
│   • 6-Step Workflow Engine   • Sarvam AI Indic Translator              │
│   • Zero-Dependency PDF      • SHA-256 Merkle Ledger                   │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌──────────────────────────────────────┐ ┌───────────────────────────────┐
│       ELASTICSEARCH & ES|QL          │ │      MOCK CBS DATABASE        │
│ • Elastic Cloud (AWS ap-south-1)     │ │ • SQLite Core Accounts Engine │
│ • ECS 8.11 Banking Data Streams      │ │ • ₹ Account Balances & Liens  │
│ • Dual-Stage In-Memory Queries       │ │ • Customer Exposure Profiles  │
└──────────────────────────────────────┘ └───────────────────────────────┘
```

### Component Details:
1. **Frontend Cockpit (`frontend/`)**:
   - Built with React 18, Vite, Lucide Icons, and Tailwind CSS.
   - Fully interactive 6-step investigation stepper, attack topology graph, forensic timeline, blast radius table, live simulated noise stream, and ES|QL natural language copilot.
   - Embedded client-side PDF binary generator ensures 100% reliable PDF exports under all network conditions.

2. **Backend API Service (`backend/`)**:
   - Python FastAPI server providing deterministic workflow execution, live ES|QL querying against Elastic Cloud, Sarvam AI translation, and SHA-256 cryptographic verification.

3. **Elastic Cloud Deployment**:
   - Hosted in Mumbai (`ap-south-1`), Elasticsearch v9.5.3.
   - Indices: `logs-banking-*`, `logs-auth-*`, `logs-network-*`, `logs-audit-*`.
   - Utilizes ES|QL for high-performance data processing pipelines.

4. **Sarvam AI Indic Engine**:
   - Translates incident alerts and tactical response plans into **Hindi, Marathi, Tamil, Telugu, and Bengali** so regional branch officers can execute containment immediately without language barriers.

5. **SHA-256 Cryptographic Ledger**:
   - Builds an immutable block chain where Block N contains `hash(Block N-1 + payload + timestamp + digital_signature)`.
   - Simulates AWS S3 Object Lock (WORM) storage for audit defensibility.

---

## 5. 3-MINUTE HACKATHON DEMO SCRIPT & JUDGE Q&A

### The 3-Minute Live Demo Walkthrough:

- **Minute 1: The Problem & Alert Zero (0:00 - 1:00)**
  - Select **Scenario 1 (API Abuse & Mule Ring Drain)**.
  - Show the **6-Hour Statutory SLA Countdown Timer** running in the top bar.
  - Explain: *"Indian banks are mandated by the RBI and CERT-In to report material security breaches within 6 hours. Today, Tier-1 analysts spend 4+ hours manually running log queries and drafting reports. VIGIL automates this entire pipeline in under 5 minutes."*

- **Minute 2: Autonomous ES|QL Hunting & ₹ Risk Exposure (1:00 - 2:00)**
  - Click **Step 2 (ES|QL)**: Highlight the two stages (Stage 1 Automated Threat Hunt without hardcoded IPs + Stage 2 Lateral Blast Radius Pivot).
  - Click **Step 3 (Financial Exposure)**: Show the **₹64,00,000** direct financial risk and affected corporate accounts from the Core Banking System.

- **Minute 3: Containment, CERT-In PDF, and Audit Ledger (2:00 - 3:00)**
  - Click **Step 4 (HITL Gate)** -> Click **"1-Click Authorize & Execute Containment"**.
  - Click **Step 5 (CERT-In)** -> Click **"Export PDF"** to demonstrate the instant official Annexure-1 PDF generation.
  - Click **Step 6 (Ledger)**: Show the SHA-256 Merkle chain block seal.
  - Switch to **Sarvam Indic Tab**: Show the Hindi/Tamil branch briefing.
  - Conclude: *"VIGIL saves Indian banks hours of triage time, protects crores in customer deposits, and ensures 100% regulatory compliance."*

---

### Judge Q&A Cheat Sheet:

**Q1: Why use ES|QL instead of standard Lucene / KQL queries?**
> **Answer**: *"ES|QL allows us to build pipelined analytical transformations directly inside Elasticsearch memory. With ES|QL, we perform filtering, statistical aggregation (`sum`, `count`), and enrichments in a single query execution without pulling raw logs into the application layer."*

**Q2: How does VIGIL prevent AI hallucinations in a regulated banking environment?**
> **Answer**: *"VIGIL uses an Agentic Deterministic Orchestrator pattern. The 6-step investigation logic, ES|QL queries, and compliance formulas are deterministic and grounded in Elastic telemetry and banking records. AI models are strictly used for natural language translation and query assistance."*

**Q3: How does VIGIL differentiate between true attacks and month-end maintenance spikes?**
> **Answer**: *"Scenario 5 demonstrates our automated false positive suppression. When high volume is detected, VIGIL queries the CBS schedule and computes the average AML risk score. If the risk is low and matches a pre-approved batch, VIGIL auto-closes the alert, eliminating SOC alert fatigue."*

**Q4: Is the PDF export and evidence ledger legally defensible?**
> **Answer**: *"Yes. The PDF strictly complies with the CERT-In Annexure-1 format under Section 70B of the IT Act. The SHA-256 Merkle ledger creates a cryptographic hash chain of all evidence and digital signatures, compatible with AWS S3 Object Lock (WORM storage)."*

---
**VIGIL — Vigilant Intelligence & Governance for Incident Logistics**
*Built for the Elastic AI Hackathon 2026*
