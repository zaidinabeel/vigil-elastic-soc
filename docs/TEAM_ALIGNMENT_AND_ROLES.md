# VIGIL: Team Pitch Script, Roles & Alignment Guide
### *How to run today's team meeting, pitch the idea, and assign clear responsibilities*

---

## 1. Meeting Agenda (30 Minutes Total)

| Time | Agenda Item | Goal |
| :--- | :--- | :--- |
| **00:00 - 05:00** | The Problem: The 6-Hour Regulatory Clock | Get everyone aligned on the real pain point in Indian banking. |
| **05:00 - 15:00** | The Solution & Architecture Walkthrough | Walk through the 6-step workflow, Elastic + AWS + Sarvam stack. |
| **15:00 - 20:00** | Why We Win the Judging Criteria | Show how Vigil directly hits all 5 judging categories (30% Tech, 25% Innovation, etc.). |
| **20:00 - 25:00** | Role Assignments & Work Distribution | Assign ownership of backend, frontend, Elastic data, and compliance. |
| **25:00 - 30:00** | Q&A & Next Immediate Steps | Clarify doubts and set the first milestone. |

---

## 2. Word-for-Word Pitch Script (What to Say to Your Team)

### Part 1: The Hook & The Problem (00:00 - 05:00)
> *"Hey everyone, thanks for joining. Our submission for the Elastic Hackathon 2026—**VIGIL**—has been shortlisted! Today, I want to walk you through the architecture, what makes this a winning project, and how we divide the work so we can build a world-class prototype without stress.*
>
> *First, let's look at the real problem we are solving: In Indian retail banks, SOC teams are flooded with 50,000 alerts every day. But the most dangerous failure point is not missing an alert—it is the **mandatory 6-hour reporting clock** set by CERT-In and the RBI.*
>
> *Under Indian law, if a material cyber incident happens, the bank MUST report it within 6 hours. Today, investigation takes 45 minutes, but compiling the legal report, finding the financial loss, and gathering logs takes 4 to 6 hours. By the time the paperwork is done, the 6-hour window is breached, leading to heavy RBI penalties.*
>
> *Traditional SIEMs tell you: 'Host IP 10.0.4.12 has risk score 85'. That means nothing to a bank CFO, and it doesn't give CERT-In what they need. We are building **VIGIL** to fix this."*

---

### Part 2: The Solution & The 6-Step Workflow (05:00 - 15:00)
> *"VIGIL is an AI Tier-1 SOC Analyst that takes validated attack narratives from Elastic's Attack Discovery and executes a 6-step deterministic workflow:*
>
> 1. ***Classify & Materiality Check**: Evaluates if the incident crosses the RBI threshold (e.g., unauthorized transfer > ₹5 Lakhs, core banking impact).*
> 2. ***Evidence Gathering via ES|QL**: Uses Elasticsearch's new piped query language to pull exact forensic logs across network, auth, and UPI transactions in milliseconds.*
> 3. ***₹ Business Risk Scoring (`bank.exposure.lookup`)**: Our first big differentiator! We convert technical risk into real Rupee-denominated exposure (e.g., ₹1.82 Crore in pending bulk UPI payout across 14 HNI and 4 Corporate accounts).*
> 4. ***Containment Action & Human-in-the-Loop Gate**: Drafts exact containment actions (e.g. revoke API token, null-route IP, freeze batch) and asks the analyst for a 1-click approval.*
> 5. ***CERT-In / RBI Regulatory Report (`certin.report.draft`)**: Automatically generates the official Annexure-1 regulatory filing in PDF and Markdown, with multi-lingual briefs in Hindi, Tamil, etc., powered by Sarvam AI.*
> 6. ***Cryptographic Evidence Ledger (`evidence.ledger.append`)**: Seals every log, query, thought, and approval into a SHA-256 hash-chain backed by AWS S3 WORM storage, making it 100% audit-proof years later.*
>
> *All of this happens in under **10 minutes** instead of 4 hours."*

---

### Part 3: Why This Project Wins (15:00 - 20:00)
> *"Look at the hackathon judging criteria:*
> - * **Technical Implementation (30%)**: Deep Elasticsearch ECS schema, ES|QL queries, and AWS Bedrock reasoning.*
> - * **Innovation (25%)**: Solving the regulatory clock bottleneck and bridging Fraud Desk (UPI) with Security (SOC).*
> - * **Impact (20%)**: Directly built for Indian BFSI enterprise compliance.*
> - * **User Experience (15%)**: Real-time dark-themed SOC Cockpit with live countdown and interactive ES|QL runner.*
> - * **Presentation (10%)**: Crisp live demo of an attack being detected, contained, and filed in 90 seconds.*
>
> *We have mapped every single requirement directly to our architecture."*

---

## 3. Team Role Allocation Matrix (Choose Based on Team Size)

### Option A: 4-Member Team Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 👤 MEMBER 1: Elastic & Data Lead                                            │
│ • Builds synthetic ECS dataset (UPI logs, NetBanking, auth logs, firewalls) │
│ • Authors optimized ES|QL queries for forensic correlation & blast radius   │
│ • Implements Elastic client & index mappings (ECS v8.11+)                  │
│ Tech: Elasticsearch, ES|QL, Python                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 👤 MEMBER 2: Agentic Workflow & AWS Backend Lead                            │
│ • Builds the 6-step FastAPI orchestrator & state machine                    │
│ • Integrates AWS Bedrock (Claude) reasoning agent                           │
│ • Implements `bank.exposure.lookup` (₹ financial exposure engine)           │
│ Tech: FastAPI, Python, AWS Bedrock, Boto3, Pydantic                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 👤 MEMBER 3: Frontend & SOC Cockpit Lead                                    │
│ • Builds the modern React + Tailwind SOC Analyst Cockpit                    │
│ • Implements 6-Hour Clock Countdown, ₹ Exposure Card, and ES|QL Runner      │
│ • Implements 1-click Human-in-the-Loop containment approval modal          │
│ Tech: React, Vite, Tailwind CSS, Lucide Icons, Recharts                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 👤 MEMBER 4: Compliance, Ledger & Sarvam AI Lead                            │
│ • Formats official CERT-In Annexure-1 report generator (PDF & Markdown)    │
│ • Integrates Sarvam AI API for Indic translations (Hindi, Tamil, Marathi)   │
│ • Builds SHA-256 hash-chained tamper-evident evidence ledger verifier       │
│ Tech: Sarvam AI, ReportLab, Cryptography, S3 WORM Spec                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Option B: 3-Member Team Structure
- **Member 1 (Backend & Elastic)**: Combines Member 1 + Member 2 (Elastic, ES|QL, FastAPI, Bedrock).
- **Member 2 (Frontend & UX)**: Focuses on the React SOC Cockpit UI and interactive components.
- **Member 3 (Compliance, AI & Ledger)**: Combines Member 4 + Demo coordination (CERT-In reports, Sarvam AI, hash ledger, pitch deck).

### Option C: 5-Member Team Structure
- **Member 5 (Demo, Scenarios & QA Lead)**: Designs the 5 attack scenarios (UPI batch fraud, ATM malware, credential stuffing), tests edge cases, and prepares the live presentation script.

---

## 4. Immediate Next Steps / Milestone Plan

| Phase | Timeline | Deliverable |
| :--- | :--- | :--- |
| **Phase 1** | Today | Review `docs/PITCH_DECK.md` and `docs/DEVELOPMENT_GUIDE.md`; confirm role assignments. |
| **Phase 2** | Day 1–2 | Backend scaffolding + 30-day ECS dataset generation + ES\|QL queries tested. |
| **Phase 3** | Day 2–3 | 6-step agentic pipeline + ₹ exposure calculator + CERT-In report generator. |
| **Phase 4** | Day 3–4 | Frontend SOC Cockpit UI built & connected to backend REST/WebSocket. |
| **Phase 5** | Day 4–5 | End-to-end rehearsal of live attack demo + Sarvam Indic translations + final polish. |

---

## 5. Quick Reference for Q&A in the Meeting

- **Q: Do we need cloud keys right now to start?**
  - **A**: *No, we have a dual-mode setup. The backend includes mock/in-memory ES|QL and Bedrock reasoning so everyone can code and run tests locally immediately.*
- **Q: What if the judges ask why we didn't just use standard SIEM alerts?**
  - **A**: *SIEM alerts don't quantify Rupee loss, don't generate CERT-In Annexure-1 filings, and don't provide hash-chained WORM audit trails. That is our exact value-add.*
- **Q: How does Sarvam AI help?**
  - **A**: *It allows regional branch risk officers and compliance staff in Tier-2/Tier-3 branches to review and sign off on incidents in their regional languages (Hindi, Tamil, etc.).*
