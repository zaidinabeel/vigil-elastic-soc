"""
Comprehensive Multi-Page Vector PDF Generator for VIGIL Developer & Engineering Blueprint.
Renders a 4-page, beautifully styled technical handbook with vector graphics, code blocks, tables, and roadmaps.
"""
import os

class PDFCanvas:
    def __init__(self, page_width=595.28, page_height=841.89): # A4 in points
        self.w = page_width
        self.h = page_height
        self.pages = []
        self.current_stream = []
        self.current_page = 0
        self.margin_x = 34.0
        self.margin_top = 34.0
        self.margin_bottom = 34.0
        self.content_w = self.w - 2 * self.margin_x
        self.y = self.h - self.margin_top
        self.new_page()

    def new_page(self):
        if self.current_page > 0:
            self._draw_header_footer()
            self.pages.append("".join(self.current_stream))
            self.current_stream = []
        self.current_page += 1
        self.y = self.h - self.margin_top

    def _draw_header_footer(self):
        if self.current_page > 1:
            self.current_stream.append(f"""
q
0.6 0.65 0.75 rg
BT
/F1 7 Tf
{self.margin_x} {self.h - 20} Td
(VIGIL: Comprehensive Developer & Engineering Blueprint | Track 03: Security & AI-Powered SOC) Tj
ET
0.88 0.91 0.94 RG 0.5 w
{self.margin_x} {self.h - 24} m {self.w - self.margin_x} {self.h - 24} l S
Q
""")
        self.current_stream.append(f"""
q
0.88 0.91 0.94 RG 0.5 w
{self.margin_x} 24 m {self.w - self.margin_x} 24 l S
0.6 0.65 0.75 rg
BT
/F1 7 Tf
{self.margin_x} 14 Td
(Confidential & Proprietary - Forge the Future Hackathon 2026 | Elastic Technologies & AWS) Tj
{self.w - self.margin_x - 30} 14 Td
(Page {self.current_page}) Tj
ET
Q
""")

    def ensure_space(self, height):
        if self.y - height < self.margin_bottom:
            self.new_page()

    def draw_banner(self, title, subtitle):
        banner_h = 58.0
        self.ensure_space(banner_h + 8)
        self.current_stream.append(f"""
q
0.06 0.09 0.16 rg
{self.margin_x} {self.y - banner_h} {self.content_w} {banner_h} re f
0.01 0.52 0.78 RG 1.5 w
{self.margin_x} {self.y - banner_h} {self.content_w} {banner_h} re S
Q
""")
        # Badges
        self.current_stream.append(f"""
q
0.12 0.16 0.24 rg
{self.margin_x + 10} {self.y - 17} 102 11 re f
{self.margin_x + 118} {self.y - 17} 72 11 re f
{self.margin_x + 195} {self.y - 17} 60 11 re f
0.22 0.74 0.97 rg
BT
/F2 5.5 Tf
{self.margin_x + 14} {self.y - 13.5} Td
(ELASTIC SEARCH AI) Tj
ET
0.06 0.73 0.51 rg
BT
/F2 5.5 Tf
{self.margin_x + 122} {self.y - 13.5} Td
(AWS BEDROCK) Tj
ET
0.66 0.33 0.97 rg
BT
/F2 5.5 Tf
{self.margin_x + 199} {self.y - 13.5} Td
(SARVAM AI) Tj
ET
Q
""")
        # Title text
        self.current_stream.append(f"""
q
1 1 1 rg
BT
/F2 13.5 Tf
{self.margin_x + 10} {self.y - 34} Td
({self._escape(title)}) Tj
ET
0.58 0.64 0.72 rg
BT
/F1 7.2 Tf
{self.margin_x + 10} {self.y - 47} Td
({self._escape(subtitle)}) Tj
ET
Q
""")
        self.y -= (banner_h + 8)

    def draw_h2(self, text):
        self.ensure_space(22)
        self.current_stream.append(f"""
q
0.01 0.52 0.78 rg
{self.margin_x} {self.y - 10} 3 10 re f
0.06 0.09 0.16 rg
BT
/F2 9.5 Tf
{self.margin_x + 7} {self.y - 9} Td
({self._escape(text)}) Tj
ET
Q
""")
        self.y -= 14

    def draw_paragraph(self, text, font="F1", size=7.5, color=(0.2, 0.25, 0.33), indent=0):
        words = text.split(' ')
        lines = []
        current_line = []
        max_chars = int((self.content_w - indent) / (size * 0.50))

        for w in words:
            if len(" ".join(current_line + [w])) <= max_chars:
                current_line.append(w)
            else:
                lines.append(" ".join(current_line))
                current_line = [w]
        if current_line:
            lines.append(" ".join(current_line))

        self.ensure_space(len(lines) * (size * 1.25) + 2)
        r, g, b = color
        for line in lines:
            self.current_stream.append(f"""
q
{r} {g} {b} rg
BT
/{font} {size} Tf
{self.margin_x + indent} {self.y - size} Td
({self._escape(line)}) Tj
ET
Q
""")
            self.y -= (size * 1.25)
        self.y -= 2

    def draw_bullet(self, title, desc):
        full_text = f"{title}: {desc}" if title else desc
        self.ensure_space(12)
        self.current_stream.append(f"""
q
0.01 0.52 0.78 rg
{self.margin_x + 2} {self.y - 5} 2.5 2.5 re f
Q
""")
        self.draw_paragraph(full_text, font="F1", size=7.2, color=(0.2, 0.25, 0.33), indent=10)

    def draw_code_box(self, code_text, lang="ES|QL"):
        raw_lines = [l.replace('\t', '    ') for l in code_text.strip().split('\n')]
        line_h = 8.5
        box_h = len(raw_lines) * line_h + 14.0
        self.ensure_space(box_h + 5)

        self.current_stream.append(f"""
q
0.06 0.09 0.16 rg
{self.margin_x} {self.y - box_h} {self.content_w} {box_h} re f
0.12 0.16 0.24 RG 0.8 w
{self.margin_x} {self.y - box_h} {self.content_w} {box_h} re S
0.12 0.16 0.24 rg
{self.margin_x} {self.y - 11} {self.content_w} 11 re f
0.58 0.64 0.72 rg
BT
/F2 5.5 Tf
{self.margin_x + 6} {self.y - 8} Td
({self._escape(lang.upper())}) Tj
ET
Q
""")
        cur_y = self.y - 18
        for line in raw_lines:
            self.current_stream.append(f"""
q
0.88 0.91 0.94 rg
BT
/F3 6.5 Tf
{self.margin_x + 8} {cur_y} Td
({self._escape(line)}) Tj
ET
Q
""")
            cur_y -= line_h
        self.y -= (box_h + 5)

    def draw_table(self, headers, rows, col_widths):
        col_px = [self.content_w * w for w in col_widths]
        row_h = 12.5
        total_h = (len(rows) + 1) * row_h
        self.ensure_space(total_h + 6)

        self.current_stream.append(f"""
q
0.95 0.96 0.98 rg
{self.margin_x} {self.y - row_h} {self.content_w} {row_h} re f
0.88 0.91 0.94 RG 0.6 w
{self.margin_x} {self.y - total_h} {self.content_w} {total_h} re S
Q
""")
        cur_x = self.margin_x
        for i, h in enumerate(headers):
            self.current_stream.append(f"""
q
0.06 0.09 0.16 rg
BT
/F2 6.8 Tf
{cur_x + 4} {self.y - 9} Td
({self._escape(h)}) Tj
ET
Q
""")
            cur_x += col_px[i]

        cur_y = self.y - row_h
        for r_idx, row in enumerate(rows):
            if r_idx % 2 == 1:
                self.current_stream.append(f"""
q
0.98 0.99 1.0 rg
{self.margin_x} {cur_y - row_h} {self.content_w} {row_h} re f
Q
""")
            cur_x = self.margin_x
            for i, c in enumerate(row):
                self.current_stream.append(f"""
q
0.2 0.25 0.33 rg
BT
/F1 6.5 Tf
{cur_x + 4} {cur_y - 9} Td
({self._escape(str(c))}) Tj
ET
Q
""")
                cur_x += col_px[i]
            cur_y -= row_h

        self.y -= (total_h + 6)

    def draw_scenario_box(self, title, tag, exp, rbi, desc):
        box_h = 42.0
        self.ensure_space(box_h + 5)
        self.current_stream.append(f"""
q
0.98 0.99 1.0 rg
{self.margin_x} {self.y - box_h} {self.content_w} {box_h} re f
0.85 0.90 0.95 RG 0.8 w
{self.margin_x} {self.y - box_h} {self.content_w} {box_h} re S
0.01 0.52 0.78 rg
BT
/F2 7.2 Tf
{self.margin_x + 6} {self.y - 10} Td
({self._escape(title)}) Tj
ET
0.9 0.2 0.2 rg
BT
/F2 6 Tf
{self.margin_x + 280} {self.y - 10} Td
({self._escape(tag)} | Exp: {self._escape(exp)} | RBI: {self._escape(rbi)}) Tj
ET
0.25 0.30 0.38 rg
BT
/F1 6.8 Tf
{self.margin_x + 6} {self.y - 21} Td
({self._escape(desc[:115])}) Tj
{self.margin_x + 6} {self.y - 30} Td
({self._escape(desc[115:230])}) Tj
ET
Q
""")
        self.y -= (box_h + 5)

    def _escape(self, text):
        return (text.replace('\\', '\\\\')
                    .replace('(', '\\(')
                    .replace(')', '\\)')
                    .replace('\r', ''))

    def compile_pdf(self, output_path):
        self._draw_header_footer()
        self.pages.append("".join(self.current_stream))

        objects = []
        objects.append("<< /Type /Catalog /Pages 2 0 R >>")
        page_refs = " ".join([f"{3 + i*2} 0 R" for i in range(len(self.pages))])
        objects.append(f"<< /Type /Pages /Kids [{page_refs}] /Count {len(self.pages)} >>")
        
        for i, page_stream in enumerate(self.pages):
            page_obj_idx = 3 + i * 2
            content_obj_idx = page_obj_idx + 1
            page_obj = f"""<< /Type /Page /Parent 2 0 R
/MediaBox [0 0 {self.w} {self.h}]
/Resources <<
  /Font <<
    /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
    /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
    /F3 << /Type /Font /Subtype /Type1 /BaseFont /Courier >>
  >>
>>
/Contents {content_obj_idx} 0 R >>"""
            objects.append(page_obj)
            stream_len = len(page_stream.encode('utf-8'))
            content_obj = f"<< /Length {stream_len} >>\nstream\n{page_stream}\nendstream"
            objects.append(content_obj)

        with open(output_path, "wb") as f:
            f.write(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
            offsets = []
            for idx, obj in enumerate(objects):
                offsets.append(f.tell())
                f.write(f"{idx + 1} 0 obj\n{obj}\nendobj\n".encode('utf-8'))
            xref_pos = f.tell()
            f.write(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode('utf-8'))
            for off in offsets:
                f.write(f"{off:010d} 00000 n \n".encode('utf-8'))
            f.write(f"""trailer
<< /Size {len(objects) + 1}
   /Root 1 0 R
>>
startxref
{xref_pos}
%%EOF
""".encode('utf-8'))
        print(f"🎉 Generated {len(self.pages)}-page PDF at {output_path}")

def build_full_guide_pdf():
    pdf = PDFCanvas()
    
    # =========================================================================
    # PAGE 1: Executive Summary, Architecture & ECS Schema
    # =========================================================================
    pdf.draw_banner("VIGIL: Developer & Engineering Blueprint", "Technical Implementation Blueprint for AI Tier-1 SOC Analyst for Indian BFSI")
    
    pdf.draw_h2("1. Executive Summary & Core Architectural Tenets")
    pdf.draw_paragraph("Under CERT-In Directions (April 2022) and the RBI Cyber Security Framework, Indian banks must detect, investigate, contain, and report material cyber incidents within a mandatory 6-hour regulatory window. VIGIL bridges Alert Zero (triage) to Filing Zero (compliance) by converting Attack Discovery narratives into rupee-quantified business risk, drafting CERT-In Annexure-1 reports in under 10 minutes, and sealing evidence into an immutable SHA-256 hash-chained ledger.")
    
    pdf.draw_h2("2. System Architecture & Component Interaction Flow")
    arch_ascii = """[1. Ingestion (ECS)]        --> [2. Elastic Search AI Core] --> [3. Vigil 6-Step Orchestrator]
- UPI/IMPS Gateway Logs           - Unified ECS v8.11+ Index          - Step 1: Materiality Classifier
- Core Banking CRM Accounts       - Elastic ML Anomaly Baseline       - Step 2: ES|QL Evidence Query
- Elastic Defend Endpoint         - Attack Discovery Triage Agent     - Step 3: INR Financial Exposure
- NetFlow & CERT-In CIAD          - Piped ES|QL Query Engine          - Step 4: Containment (HITL Gate)
                                                                      - Step 5: CERT-In Form & Sarvam
                                                                      - Step 6: SHA-256 Ledger Sealing"""
    pdf.draw_code_box(arch_ascii, "Architecture Pipeline")
    
    pdf.draw_h2("3. Telemetry & ECS Schema Specification (BFSI Extensions)")
    pdf.draw_paragraph("All banking and cyber telemetry conforms to Elastic Common Schema (ECS v8.11+), augmented with custom BFSI fields under 'bank.*':")
    
    headers_ecs = ["ECS Field", "Type", "Example Value", "Description"]
    rows_ecs = [
        ["@timestamp", "date", "2026-09-02T19:24:00.120Z", "Event occurrence timestamp (ISO 8601)"],
        ["event.category", "keyword", "network, authentication, financial", "High-level event classification"],
        ["source.ip", "ip", "198.51.100.44", "Source IP of the transacting client / attacker"],
        ["user.name", "keyword", "svc_payment_gw", "Authenticated identity or service account"],
        ["bank.account_id", "keyword", "ACC-CORP-9921448", "Core banking primary account identifier"],
        ["bank.customer_tier", "keyword", "Corporate / HNI / Retail", "Account priority & regulatory weighting tier"],
        ["bank.upi_vpa", "keyword", "merchant.bulk@yesbank", "UPI Virtual Payment Address of transacting party"],
        ["bank.amount_inr", "float", "18240000.00", "Rupee value of transaction or settlement batch"],
        ["bank.aml_risk_score", "float", "92.5", "Real-time AML velocity & anomaly score (0-100)"]
    ]
    pdf.draw_table(headers_ecs, rows_ecs, [0.18, 0.08, 0.30, 0.44])

    # =========================================================================
    # PAGE 2: Attack Scenarios & ES|QL Query Catalogue
    # =========================================================================
    pdf.new_page()
    
    pdf.draw_h2("4. Five Ground-Truth Attack Scenarios (30-Day Evaluation Corpus)")
    
    pdf.draw_scenario_box(
        "Scenario 1: Privileged Token Theft & Bulk UPI Payout",
        "CRITICAL", "Rs. 1,82,40,000", "MANDATORY",
        "Adversary compromises API Gateway -> Steals OAuth2 bearer token for svc_payment_gw -> Injects unauthorized corporate payroll batch BATCH-8821 targeting 18 rogue VPAs across 4 Corporate and 14 HNI accounts."
    )
    pdf.draw_scenario_box(
        "Scenario 2: Distributed NetBanking Credential Stuffing",
        "HIGH", "Rs. 42,50,000", "MANDATORY",
        "Tor/VPN botnet executes 4,200 req/min credential stuffing attack against /api/v2/netbanking/login -> Compromises 28 corporate salary accounts -> Initiates high-velocity illicit IMPS exfiltration."
    )
    pdf.draw_scenario_box(
        "Scenario 3: ATM Switch ISO 8583 Response Code Manipulation",
        "CRITICAL", "Rs. 3,40,000", "MANDATORY",
        "Lateral movement in branch network -> ARP poisoning on ATM switch router -> Modifies ISO 8583 response codes from 51 (Insufficient Funds) to 00 (Approved) for 12 regional ATM terminals."
    )
    pdf.draw_scenario_box(
        "Scenario 4: Rogue Branch Insider KYC Tampering",
        "HIGH", "Rs. 28,00,000", "MANDATORY",
        "Branch loan officer terminal used off-hours -> Modifies KYC verification flag on 12 unapproved loan applications -> Triggers automated personal loan disbursal pipeline."
    )
    pdf.draw_scenario_box(
        "Scenario 5: Benign Month-End Batch Rebalancing",
        "BENIGN", "Rs. 0 (Auto-Filtered)", "NOT REQUIRED",
        "Scheduled monthly corporate interest calculation batch generates high CPU load and 50k ledger transactions at 02:00 AM -> Accurately correlated with maintenance calendar and auto-suppressed (60% FP Reduction)."
    )

    pdf.draw_h2("5. ES|QL Forensic Query Catalogue")
    pdf.draw_paragraph("Vigil leverages modern ES|QL piped queries for sub-second evidence retrieval and blast radius quantification:")

    esql_code1 = """FROM logs-*
| WHERE source.ip == "198.51.100.44"
| KEEP @timestamp, event.category, user.name, bank.upi_vpa, bank.amount_inr, http.response.status_code
| SORT @timestamp asc
| LIMIT 100"""
    pdf.draw_code_box(esql_code1, "Query 1: Attacker IP Blast Radius across Auth & UPI")

    esql_code2 = """FROM logs-banking-*
| WHERE event.type == "transaction" AND bank.batch_id == "BATCH-20260902-8821"
| STATS total_amount_inr = sum(bank.amount_inr), tx_count = count(), avg_aml = avg(bank.aml_risk_score) BY bank.customer_tier
| SORT total_amount_inr desc"""
    pdf.draw_code_box(esql_code2, "Query 2: Financial Risk Aggregation by Customer Tier")

    # =========================================================================
    # PAGE 3: 6-Step Workflow Deep Dive & REST API Spec
    # =========================================================================
    pdf.new_page()

    pdf.draw_h2("6. The 6-Step Deterministic Agentic Workflow Deep Dive")
    pdf.draw_bullet("Step 1 (Materiality & RBI Thresholds)", "Evaluates Attack Discovery narrative against RBI Master Direction thresholds (fund diversion > Rs. 5 Lakhs, core banking outage > 15m). Emits materiality flag and 6-hour regulatory countdown.")
    pdf.draw_bullet("Step 2 (ES|QL Grounded Evidence)", "Executes piped queries across auth, network, and banking logs. Extracts exact indicators of compromise (IoCs), compromised credentials, and raw ECS document IDs.")
    pdf.draw_bullet("Step 3 (INR Business Risk Exposure)", "bank.exposure.lookup tool queries Core Banking CRM: computes Direct Loss (Rs. 1.82 Crore) + Customer Blast Radius (14 HNI, 4 Corp) + RBI Regulatory Penalty Risk (Rs. 1.00 Crore).")
    pdf.draw_bullet("Step 4 (Containment & HITL Approval)", "Recommends actionable containment (Revoke OAuth2 token #8821, null-route IP, freeze UPI batch). Renders 1-click Human-in-the-Loop authorization gate before executing.")
    pdf.draw_bullet("Step 5 (CERT-In Annexure-1 Report)", "certin.report.draft formats official 8-point statutory report (Incident chronology, impacted systems, remedial actions). Sarvam AI translates executive brief into 22 Indic languages.")
    pdf.draw_bullet("Step 6 (Cryptographic Evidence Sealing)", "evidence.ledger.append SHA-256 hash-chains all telemetry, LLM reasoning, queries, and approvals into S3 Object Lock (WORM) storage with AWS KMS signing.")

    pdf.draw_h2("7. Complete REST API & WebSocket Specification")
    
    headers_api = ["Method", "Endpoint", "Functionality", "Payload Summary"]
    rows_api = [
        ["GET", "/api/incidents", "List validated attack narratives", "Returns active incidents with severity & INR exposure"],
        ["GET", "/api/incidents/{id}", "Get full incident state & workflow", "Returns active step, queries, timeline, and exposure card"],
        ["POST", "/api/incidents/{id}/step/{n}", "Execute specific workflow step", "Executes Step 1 to 6 with LLM reasoning & tools"],
        ["POST", "/api/hitl/approve", "Human analyst containment approval", "Payload: { incident_id, analyst_id, decision: APPROVE }"],
        ["POST", "/api/esql/execute", "Run custom ES|QL piped query", "Payload: { query: 'FROM logs-* | ...' } -> Returns rows"],
        ["GET", "/api/reports/certin/{id}/pdf", "Download official CERT-In PDF", "Returns formatted application/pdf statutory report"],
        ["POST", "/api/translate/indic", "Translate brief via Sarvam AI", "Payload: { text, target_lang: 'hi' } -> Indic text"],
        ["GET", "/api/ledger/verify", "Verify cryptographic hash chain", "Returns: { valid: true, total_blocks: 104, chain_intact: true }"],
        ["WS", "/ws/live-stream", "Real-time incident & countdown stream", "Emits WebSocket events on alert arrival & timer ticks"]
    ]
    pdf.draw_table(headers_api, rows_api, [0.10, 0.28, 0.32, 0.30])

    # =========================================================================
    # PAGE 4: SOC UI Wireframe, Setup Guide & Milestones
    # =========================================================================
    pdf.new_page()

    pdf.draw_h2("8. Frontend SOC Cockpit UI & Component Architecture")
    pdf.draw_paragraph("The analyst console provides a real-time dark-themed cyber defense cockpit designed for BFSI security operations:")
    
    fe_headers = ["Component", "Key Functionality", "Tech Stack"]
    fe_rows = [
        ["Header & Countdown", "Live 6-Hour Regulatory Clock countdown timer & Alert Zero status badge", "React, Lucide Icons"],
        ["Incident Stream", "Validated Attack Discovery narratives with FP suppression indicator", "Framer Motion, SSE"],
        ["INR Exposure Card", "Real-time counter of direct financial risk & HNI/Corporate blast radius", "Tailwind CSS, Cards"],
        ["Workflow Stepper", "Interactive 6-step timeline with reasoning logs & ES|QL viewer", "React Stepper"],
        ["HITL Approval Modal", "1-Click authorization of token revocation and payment batch freeze", "Modal Dialog"],
        ["CERT-In Report Viewer", "Official Annexure-1 form renderer with 1-click PDF download & Indic toggle", "ReportLab, Sarvam API"]
    ]
    pdf.draw_table(fe_headers, fe_rows, [0.22, 0.54, 0.24])

    pdf.draw_h2("9. Developer Setup & Dual-Mode Execution")
    setup_code = """# 1. Backend Setup (Python 3.11)
cd backend && python3.11 -m venv venv && source venv/bin/activate
pip install fastapi uvicorn pydantic reportlab cryptography httpx
python main.py  # Launches at http://localhost:8000 (Swagger docs at /docs)

# 2. Frontend Setup (Node 22 / Vite)
cd frontend && npm install && npm run dev  # Launches UI at http://localhost:5173"""
    pdf.draw_code_box(setup_code, "Setup Commands (Dual-Mode: Zero Cloud Keys Required)")

    pdf.draw_h2("10. Team Task Allocation & Hackathon Milestones")
    roadmap_headers = ["Phase", "Focus Area", "Key Deliverables", "Owner"]
    roadmap_rows = [
        ["Milestone 1", "Data & Elastic Core", "30-Day ECS banking corpus + ES|QL query catalogue", "Lead Elastic Architect"],
        ["Milestone 2", "Backend & Workflow", "6-Step FastAPI orchestrator + bank.exposure.lookup", "Backend / Bedrock Lead"],
        ["Milestone 3", "Frontend & UX", "Dark-themed SOC Cockpit UI + 6-hour countdown timer", "Frontend / UX Lead"],
        ["Milestone 4", "Compliance & AI", "CERT-In PDF exporter + Sarvam Indic + SHA-256 Ledger", "Compliance / AI Lead"],
        ["Milestone 5", "Grand Finale Demo", "End-to-end 90-sec live attack simulation & pitch rehearsal", "Entire Team"]
    ]
    pdf.draw_table(roadmap_headers, roadmap_rows, [0.15, 0.22, 0.43, 0.20])

    pdf.compile_pdf("/Users/nabeelzaidi/Downloads/elastic_hackathon/docs/VIGIL_Developer_Guide.pdf")

if __name__ == "__main__":
    build_full_guide_pdf()
