"""
VIGIL PPTX Presentation Generator
Generates a 16:9 modern presentation in valid Office Open XML PPTX format without external dependencies.
"""
import os
import zipfile
import xml.sax.saxutils as saxutils

def escape_xml(text):
    return saxutils.escape(str(text))

def build_slide_xml(title, subtitle, bullets, boxes=None, metrics=None):
    """
    Constructs a slide XML with dark navy / cyber security theme:
    Background: Dark (#0B1120)
    Primary Text: White (#F8FAFC)
    Accent: Cyan/Blue (#38BDF8)
    Highlight: Amber (#F59E0B) / Emerald (#10B981)
    """
    
    # Text shapes
    sp_xml = ""
    sp_id = 2
    
    # 1. Title shape
    sp_xml += f"""
    <p:sp>
      <p:nvSpPr>
        <p:cNvPr id="{sp_id}" name="Title {sp_id}"/>
        <p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>
        <p:nvPr/>
      </p:nvSpPr>
      <p:spPr>
        <a:xfrm>
          <a:off x="731520" y="457200"/>
          <a:ext cx="10728960" cy="822960"/>
        </a:xfrm>
        <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
        <a:noFill/>
      </p:spPr>
      <p:txBody>
        <a:bodyPr vert="horz" lIns="0" tIns="0" rIns="0" bIns="0"/>
        <a:lstStyle/>
        <a:p>
          <a:r>
            <a:rPr lang="en-US" sz="2800" b="1">
              <a:solidFill><a:srgbClr val="38BDF8"/></a:solidFill>
              <a:latin typeface="Helvetica"/>
            </a:rPr>
            <a:t>{escape_xml(title)}</a:t>
          </a:r>
        </a:p>
        {f'''<a:p>
          <a:r>
            <a:rPr lang="en-US" sz="1400" i="1">
              <a:solidFill><a:srgbClr val="94A3B8"/></a:solidFill>
              <a:latin typeface="Helvetica"/>
            </a:rPr>
            <a:t>{escape_xml(subtitle)}</a:t>
          </a:r>
        </a:p>''' if subtitle else ''}
      </p:txBody>
    </p:sp>
    """
    sp_id += 1

    # 2. Metrics cards (if any)
    if metrics:
        card_w = int(10728960 / len(metrics)) - 100000
        start_x = 731520
        for i, m in enumerate(metrics):
            cur_x = start_x + i * (card_w + 100000)
            val, lbl, color = m
            sp_xml += f"""
            <p:sp>
              <p:nvSpPr>
                <p:cNvPr id="{sp_id}" name="MetricCard {sp_id}"/>
                <p:cNvSpPr/>
                <p:nvPr/>
              </p:nvSpPr>
              <p:spPr>
                <a:xfrm>
                  <a:off x="{cur_x}" y="1400000"/>
                  <a:ext cx="{card_w}" cy="900000"/>
                </a:xfrm>
                <a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 8000"/></a:avLst></a:prstGeom>
                <a:solidFill><a:srgbClr val="1E293B"/></a:solidFill>
                <a:ln w="19050"><a:solidFill><a:srgbClr val="{color}"/></a:solidFill></a:ln>
              </p:spPr>
              <p:txBody>
                <a:bodyPr vert="horz" lIns="100000" tIns="100000" rIns="100000" bIns="100000" anchor="ctr"/>
                <a:lstStyle/>
                <a:p>
                  <a:pPr algn="ctr"/>
                  <a:r>
                    <a:rPr lang="en-US" sz="2400" b="1">
                      <a:solidFill><a:srgbClr val="{color}"/></a:solidFill>
                      <a:latin typeface="Helvetica"/>
                    </a:rPr>
                    <a:t>{escape_xml(val)}</a:t>
                  </a:r>
                </a:p>
                <a:p>
                  <a:pPr algn="ctr"/>
                  <a:r>
                    <a:rPr lang="en-US" sz="1100">
                      <a:solidFill><a:srgbClr val="E2E8F0"/></a:solidFill>
                      <a:latin typeface="Helvetica"/>
                    </a:rPr>
                    <a:t>{escape_xml(lbl)}</a:t>
                  </a:r>
                </a:p>
              </p:txBody>
            </p:sp>
            """
            sp_id += 1

    # 3. Content Boxes / Columns (if any)
    if boxes:
        num_boxes = len(boxes)
        box_w = int(10728960 / num_boxes) - 100000
        start_x = 731520
        y_pos = 2450000 if metrics else 1400000
        box_h = 3900000 if metrics else 4900000
        
        for i, box in enumerate(boxes):
            cur_x = start_x + i * (box_w + 100000)
            box_title, box_items, box_border = box
            
            items_xml = ""
            for item in box_items:
                items_xml += f"""
                <a:p>
                  <a:pPr marL="200000" indent="-200000">
                    <a:buClr><a:srgbClr val="{box_border}"/></a:buClr>
                    <a:buChar char="•"/>
                  </a:pPr>
                  <a:r>
                    <a:rPr lang="en-US" sz="1300">
                      <a:solidFill><a:srgbClr val="F8FAFC"/></a:solidFill>
                      <a:latin typeface="Helvetica"/>
                    </a:rPr>
                    <a:t>{escape_xml(item)}</a:t>
                  </a:r>
                </a:p>
                <a:p><a:pPr><a:spcBef><a:spcPts val="600"/></a:spcBef></a:pPr></a:p>
                """

            sp_xml += f"""
            <p:sp>
              <p:nvSpPr>
                <p:cNvPr id="{sp_id}" name="Card {sp_id}"/>
                <p:cNvSpPr/>
                <p:nvPr/>
              </p:nvSpPr>
              <p:spPr>
                <a:xfrm>
                  <a:off x="{cur_x}" y="{y_pos}"/>
                  <a:ext cx="{box_w}" cy="{box_h}"/>
                </a:xfrm>
                <a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 6000"/></a:avLst></a:prstGeom>
                <a:solidFill><a:srgbClr val="0F172A"/></a:solidFill>
                <a:ln w="19050"><a:solidFill><a:srgbClr val="{box_border}"/></a:solidFill></a:ln>
              </p:spPr>
              <p:txBody>
                <a:bodyPr vert="horz" lIns="200000" tIns="200000" rIns="200000" bIns="200000"/>
                <a:lstStyle/>
                <a:p>
                  <a:r>
                    <a:rPr lang="en-US" sz="1600" b="1">
                      <a:solidFill><a:srgbClr val="{box_border}"/></a:solidFill>
                      <a:latin typeface="Helvetica"/>
                    </a:rPr>
                    <a:t>{escape_xml(box_title)}</a:t>
                  </a:r>
                </a:p>
                <a:p><a:pPr><a:spcBef><a:spcPts val="800"/></a:spcBef></a:pPr></a:p>
                {items_xml}
              </p:txBody>
            </p:sp>
            """
            sp_id += 1

    # 4. Standard bullet points (if boxes not specified)
    elif bullets:
        y_pos = 2450000 if metrics else 1400000
        bullets_xml = ""
        for b in bullets:
            bullets_xml += f"""
            <a:p>
              <a:pPr marL="285750" indent="-285750">
                <a:buClr><a:srgbClr val="38BDF8"/></a:buClr>
                <a:buChar char="▸"/>
              </a:pPr>
              <a:r>
                <a:rPr lang="en-US" sz="1500">
                  <a:solidFill><a:srgbClr val="F1F5F9"/></a:solidFill>
                  <a:latin typeface="Helvetica"/>
                </a:rPr>
                <a:t>{escape_xml(b)}</a:t>
              </a:r>
            </a:p>
            <a:p><a:pPr><a:spcBef><a:spcPts val="1200"/></a:spcBef></a:pPr></a:p>
            """
            
        sp_xml += f"""
        <p:sp>
          <p:nvSpPr>
            <p:cNvPr id="{sp_id}" name="Content {sp_id}"/>
            <p:cNvSpPr/>
            <p:nvPr/>
          </p:nvSpPr>
          <p:spPr>
            <a:xfrm>
              <a:off x="731520" y="{y_pos}"/>
              <a:ext cx="10728960" cy="4800000"/>
            </a:xfrm>
            <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
            <a:noFill/>
          </p:spPr>
          <p:txBody>
            <a:bodyPr vert="horz" lIns="0" tIns="0" rIns="0" bIns="0"/>
            <a:lstStyle/>
            {bullets_xml}
          </p:txBody>
        </p:sp>
        """

    # Assemble complete slide XML
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:bg>
      <p:bgPr>
        <a:solidFill><a:srgbClr val="0B1120"/></a:solidFill>
      </p:bgPr>
    </p:bg>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      {sp_xml}
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>"""

def create_presentation():
    slides_data = [
        # Slide 1: Title
        {
            "title": "🛡️ VIGIL — AI Tier-1 SOC Analyst for Banks",
            "subtitle": "From Alert Zero to a Regulator-Ready Incident File in Under 6 Hours | Forge the Future Hackathon 2026",
            "metrics": [
                ("45 min → 4.2 min", "Mean Investigation Time", "38BDF8"),
                ("4 hrs → 10 min", "CERT-In / RBI Filing", "10B981"),
                ("60% Reduction", "False Positives to Analysts", "F59E0B"),
                ("100% Audit-Proof", "SHA-256 Evidence Ledger", "A855F7")
            ],
            "boxes": [
                ("Theme & Track", ["Track 03: Security & AI-Powered SOC", "Target: Indian BFSI / Banking Enterprise", "Submission ID: 6a81eba4c333388e8191f1e8 (Shortlisted)"], "38BDF8"),
                ("Core Stack", ["Elastic Search AI Platform (ECS + ES|QL + Attack Discovery)", "AWS Bedrock (Claude Reasoning Connector)", "Sarvam AI (22 Indic Languages Multilingual Briefs)"], "10B981"),
                ("The Pitch Hook", ["The failure mode in banking is NOT missing the alert.", "It is understanding the incident but breaching the mandatory 6-hour CERT-In filing deadline.", "Vigil automates compliance & financial risk."], "F59E0B")
            ]
        },
        # Slide 2: Problem
        {
            "title": "1. The Problem: The Clock, Not Just the Queue",
            "subtitle": "Indian commercial banks face 50k+ alerts/day and a strict 6-hour reporting window",
            "metrics": [
                ("50,000+ / day", "Alert Volume in SOC", "EF4444"),
                ("6-Hour Mandate", "CERT-In & RBI Directions", "F59E0B"),
                ("4+ Hours", "Manual Paperwork Time", "EF4444")
            ],
            "boxes": [
                ("Alert Fatigue & Silos", [
                    "SOC analysts spend 45-60 mins per alert correlating disparate logs.",
                    "Traditional SIEMs isolate Fraud Desk (UPI/IMPS) from SOC (firewalls/hosts).",
                    "Overwhelmed analysts miss the forest for the trees."
                ], "EF4444"),
                ("The 6-Hour Regulatory Trap", [
                    "CERT-In Directions (Apr 2022) & RBI Cyber Security Framework.",
                    "Mandatory reporting of material cyber incidents within 6 hours of noticing.",
                    "Failure to file triggers heavy fines and regulatory censure."
                ], "F59E0B"),
                ("The Fatal Failure Mode", [
                    "The attack is understood after 45 minutes of manual investigation.",
                    "Calculating ₹ loss, proving containment & compiling the report takes 5+ hours.",
                    "Result: Incident resolved internally but filed late -> Non-compliant!"
                ], "38BDF8")
            ]
        },
        # Slide 3: What Elastic Does vs What Vigil Builds
        {
            "title": "2. What Elastic Does Natively vs. What Vigil Builds",
            "subtitle": "Building on top of Elastic 2026 Attack Discovery instead of reinventing the wheel",
            "boxes": [
                ("Elastic Platform (Native Base)", [
                    "Elastic Defend & Fleet: Ingests telemetry into unified ECS schema.",
                    "Elastic ML: Detects behavioral baselines & anomalies.",
                    "Attack Discovery: Autonomous triage agent collapsing thousands of alerts into validated attack narratives."
                ], "38BDF8"),
                ("VIGIL (Our Proprietary Delta)", [
                    "1. ₹ Financial Exposure Agent (bank.exposure.lookup) -> Scores money & customers, not just hosts.",
                    "2. CERT-In / RBI Reporting Agent (certin.report.draft) -> Submittable Annexure-1 form in 10 mins.",
                    "3. Cryptographic Ledger (evidence.ledger.append) -> SHA-256 hash-chained WORM audit trail.",
                    "4. Fraud-Security Convergence -> Unified UPI + SOC timeline.",
                    "5. Sarvam AI Indic Reporting -> 22 Indian languages."
                ], "10B981")
            ]
        },
        # Slide 4: System Architecture
        {
            "title": "3. End-to-End System Architecture",
            "subtitle": "Telemetry -> Elastic Search AI -> Vigil 6-Step Orchestrator -> AWS Bedrock / Sarvam -> Outputs",
            "boxes": [
                ("1. Telemetry Ingestion (ECS)", [
                    "UPI / IMPS Gateway logs",
                    "Core Banking CRM & account balances",
                    "Endpoint & Auth (Elastic Defend)",
                    "Firewall NetFlow & CERT-In CIAD"
                ], "38BDF8"),
                ("2. Vigil 6-Step Workflow", [
                    "1. RBI Materiality Classification",
                    "2. ES|QL Grounded Evidence Retrieval",
                    "3. ₹ Financial Blast Radius Scoring",
                    "4. Containment (HITL Approval Gate)",
                    "5. CERT-In Annexure-1 Report Draft",
                    "6. Cryptographic Evidence Sealing"
                ], "10B981"),
                ("3. Cloud & Output Deliverables", [
                    "AWS Bedrock (Claude LLM connector)",
                    "Sarvam AI (22 Indic languages)",
                    "AWS S3 Object Lock + KMS (ap-south-1)",
                    "SOC Cockpit UI with live 6-hr countdown",
                    "Downloadable official CERT-In PDF"
                ], "A855F7")
            ]
        },
        # Slide 5: The 6-Step Agentic Workflow
        {
            "title": "4. The 6-Step Deterministic Agentic Workflow",
            "subtitle": "Grounded, deterministic, and verifiable investigation with zero hallucination",
            "boxes": [
                ("Steps 1 to 3: Detect & Scope", [
                    "Step 1: RBI Materiality Check -> Checks threshold (> ₹5 Lakhs loss, core banking outage).",
                    "Step 2: ES|QL Evidence Retrieval -> Piped queries across auth, network, and UPI logs.",
                    "Step 3: ₹ Business Exposure Lookup -> Computes direct loss, corporate/HNI blast radius."
                ], "38BDF8"),
                ("Steps 4 to 6: Contain & File", [
                    "Step 4: Containment Action (HITL) -> 1-click token revocation & UPI batch freeze.",
                    "Step 5: CERT-In Report Generation -> Official Annexure-1 form + Sarvam Indic brief.",
                    "Step 6: Cryptographic Sealing -> SHA-256 hash-chaining in S3 WORM storage."
                ], "10B981")
            ]
        },
        # Slide 6: Deep Dive - Rupee Risk Quantification
        {
            "title": "5. Rupee (₹) Business Exposure vs. Technical Risk",
            "subtitle": "Translating technical SIEM alerts into actionable board-level financial decisions",
            "metrics": [
                ("₹ 1,82,40,000", "Direct Financial Risk", "EF4444"),
                ("18 Accounts", "Blast Radius (14 HNI, 4 Corp)", "F59E0B"),
                ("₹ 1.00 Crore", "Penalty Exposure Avoided", "10B981")
            ],
            "boxes": [
                ("Traditional SIEM Output", [
                    "Alert: Host srv-db-04 compromised",
                    "User: svc_payment",
                    "Technical Risk Score: 88/100",
                    "Impact: Unknown to CFO / Compliance team"
                ], "94A3B8"),
                ("VIGIL Business Risk Output", [
                    "Direct Financial Loss: ₹ 1.82 Crore pending in Bulk UPI batch.",
                    "Customer Exposure: 4 Corporate payroll accounts + 14 HNI accounts.",
                    "Regulatory Action: Mandated CERT-In filing under RBI Section 4.2.",
                    "Decision: Containment executed before batch settlement completes."
                ], "10B981")
            ]
        },
        # Slide 7: Fraud-Security Convergence & Sarvam Indic AI
        {
            "title": "6. Fraud-Security Convergence & Sarvam Indic AI",
            "subtitle": "Breaking enterprise silos and making incident response accessible across India",
            "boxes": [
                ("Fraud + Security Convergence", [
                    "Breaks the silo between the Bank's Fraud Desk and Cybersecurity SOC.",
                    "Normalizes UPI transaction telemetry and firewall/auth logs into a single ECS index.",
                    "Detects complex attack chains where credential theft directly leads to unauthorized payment batching."
                ], "38BDF8"),
                ("Sarvam AI Regional Enablement", [
                    "Translates incident executive summary into 22 Indian languages.",
                    "Empowers regional branch managers and compliance officers in Tier-2/Tier-3 cities.",
                    "Enables non-English speaking regional authorities to review and sign off on incidents locally."
                ], "F59E0B")
            ]
        },
        # Slide 8: Cryptographic Evidence Ledger
        {
            "title": "7. Tamper-Evident Evidence Ledger (Audit-Ready)",
            "subtitle": "Independent cryptographic audit defensibility years after an incident occurs",
            "boxes": [
                ("SHA-256 Hash Chain Structure", [
                    "Block #101: Initial Alert Narrative (Hash: 0x7a3f...)",
                    "Block #102: ES|QL Queries & Raw ECS Records (Hash: 0x9c41...)",
                    "Block #103: ₹ Risk & Core Banking Context (Hash: 0x1f8e...)",
                    "Block #104: Human Analyst Containment Approval (Hash: 0x3d2b...)",
                    "Block #105: Sealed CERT-In Regulatory Filing (Hash: 0x8e5a...)"
                ], "A855F7"),
                ("Compliance & WORM Storage", [
                    "AWS S3 Object Lock (Write Once Read Many) guarantees data immutability.",
                    "AWS KMS digital signatures verify analyst identity.",
                    "Deployed in ap-south-1 (Mumbai) to strictly meet RBI data-localization laws.",
                    "Provides 100% audit defensibility during annual RBI inspections."
                ], "10B981")
            ]
        },
        # Slide 9: Measurable Business & Compliance Impact
        {
            "title": "8. Measurable Business & Compliance Impact",
            "subtitle": "Transforming the SOC from a cost center into a regulatory shield",
            "metrics": [
                ("90% Faster", "Mean Investigation Time", "38BDF8"),
                ("95% Reduction", "Regulatory Filing Time", "10B981"),
                ("Zero Breaches", "6-Hour Regulatory Violations", "F59E0B"),
                ("100% Visibility", "₹ INR Financial Risk", "A855F7")
            ],
            "boxes": [
                ("Before VIGIL (Manual SOC)", [
                    "Investigation takes 45-60 mins per incident.",
                    "Drafting CERT-In reports takes 4-6 hours.",
                    "Financial risk is unquantified during the incident.",
                    "High risk of missing the 6-hour regulatory window."
                ], "EF4444"),
                ("With VIGIL (AI SOC Analyst)", [
                    "Investigation automated in < 5 mins via ES|QL.",
                    "Official CERT-In Annexure-1 report generated in < 10 mins.",
                    "Exact ₹ exposure calculated in real-time.",
                    "Zero regulatory breaches + tamper-evident audit proof."
                ], "10B981")
            ]
        },
        # Slide 10: Hackathon Strategy & Team Roadmap
        {
            "title": "9. Hackathon Strategy & Team Execution Plan",
            "subtitle": "Maximizing score across all 5 evaluation pillars for the Grand Finale",
            "boxes": [
                ("Judging Criteria Coverage", [
                    "Technical Implementation (30%): Elastic ECS, ES|QL, Bedrock, S3 WORM.",
                    "Innovation (25%): 6-hour regulatory automation & fraud-SOC convergence.",
                    "Impact (20%): Real-world Indian BFSI compliance (CERT-In / RBI).",
                    "User Experience (15%): Real-time dark-themed SOC Cockpit UI.",
                    "Presentation (10%): Live simulated attack resolved in 90 seconds."
                ], "38BDF8"),
                ("Execution Milestones", [
                    "Milestone 1: Backend scaffolding & 30-day ECS dataset generation.",
                    "Milestone 2: 6-Step agentic pipeline & ₹ exposure engine.",
                    "Milestone 3: React SOC Cockpit UI & ES|QL inspector.",
                    "Milestone 4: End-to-end live attack scenario testing & PDF export."
                ], "10B981")
            ]
        }
    ]

    out_dir = "/Users/nabeelzaidi/Downloads/elastic_hackathon"
    pptx_path = os.path.join(out_dir, "VIGIL_Pitch_Deck.pptx")
    
    with zipfile.ZipFile(pptx_path, "w", zipfile.ZIP_DEFLATED) as zf:
        # 1. [Content_Types].xml
        slide_overrides = "".join([f'<Override PartName="/ppt/slides/slide{i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>' for i in range(len(slides_data))])
        zf.writestr("[Content_Types].xml", f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  {slide_overrides}
</Types>""")

        # 2. _rels/.rels
        zf.writestr("_rels/.rels", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>""")

        # 3. ppt/presentation.xml
        sld_id_lst = "".join([f'<p:sldId id="{256+i}" r:id="rId{i+2}"/>' for i in range(len(slides_data))])
        zf.writestr("ppt/presentation.xml", f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
                xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst>
    <p:sldMasterId id="2147483648" r:id="rId1"/>
  </p:sldMasterIdLst>
  <p:sldIdLst>
    {sld_id_lst}
  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>""")

        # 4. ppt/_rels/presentation.xml.rels
        slide_rels = "".join([f'<Relationship Id="rId{i+2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i+1}.xml"/>' for i in range(len(slides_data))])
        zf.writestr("ppt/_rels/presentation.xml.rels", f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
  {slide_rels}
</Relationships>""")

        # 5. ppt/theme/theme1.xml
        zf.writestr("ppt/theme/theme1.xml", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Vigil Dark Theme">
  <a:themeElements>
    <a:clrScheme name="Vigil">
      <a:dk1><a:srgbClr val="0B1120"/></a:dk1>
      <a:lt1><a:srgbClr val="F8FAFC"/></a:lt1>
      <a:dk2><a:srgbClr val="1E293B"/></a:dk2>
      <a:lt2><a:srgbClr val="E2E8F0"/></a:lt2>
      <a:accent1><a:srgbClr val="38BDF8"/></a:accent1>
      <a:accent2><a:srgbClr val="10B981"/></a:accent2>
      <a:accent3><a:srgbClr val="F59E0B"/></a:accent3>
      <a:accent4><a:srgbClr val="EF4444"/></a:accent4>
      <a:accent5><a:srgbClr val="A855F7"/></a:accent5>
      <a:accent6><a:srgbClr val="64748B"/></a:accent6>
      <a:hlink><a:srgbClr val="38BDF8"/></a:hlink>
      <a:folHlink><a:srgbClr val="A855F7"/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="Vigil Fonts">
      <a:majorFont><a:latin typeface="Helvetica"/></a:majorFont>
      <a:minorFont><a:latin typeface="Helvetica"/></a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name="Vigil Format">
      <a:fillStyleLst><a:solidFill><a:srgbClr val="0B1120"/></a:solidFill></a:fillStyleLst>
      <a:lnStyleLst><a:ln w="9525"><a:solidFill><a:srgbClr val="38BDF8"/></a:solidFill></a:ln></a:lnStyleLst>
      <a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>
      <a:bgFillStyleLst><a:solidFill><a:srgbClr val="0B1120"/></a:solidFill></a:bgFillStyleLst>
    </a:fmtScheme>
  </a:themeElements>
</a:theme>""")

        # 6. ppt/slideMasters/slideMaster1.xml
        zf.writestr("ppt/slideMasters/slideMaster1.xml", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
             xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
             xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:bg><p:bgPr><a:solidFill><a:srgbClr val="0B1120"/></a:solidFill></p:bgPr></p:bg>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMap bg1="dk1" tx1="lt1" bg2="dk2" tx2="lt2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst>
    <p:sldLayoutId id="2147483649" r:id="rId1"/>
  </p:sldLayoutIdLst>
</p:sldMaster>""")

        # 7. ppt/slideMasters/_rels/slideMaster1.xml.rels
        zf.writestr("ppt/slideMasters/_rels/slideMaster1.xml.rels", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>""")

        # 8. ppt/slideLayouts/slideLayout1.xml
        zf.writestr("ppt/slideLayouts/slideLayout1.xml", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
             xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
             xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sldLayout>""")

        # 9. ppt/slideLayouts/_rels/slideLayout1.xml.rels
        zf.writestr("ppt/slideLayouts/_rels/slideLayout1.xml.rels", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>""")

        # 10. Slides and Slide Rels
        for i, sdata in enumerate(slides_data):
            slide_xml = build_slide_xml(
                title=sdata.get("title", ""),
                subtitle=sdata.get("subtitle", ""),
                bullets=sdata.get("bullets", None),
                boxes=sdata.get("boxes", None),
                metrics=sdata.get("metrics", None)
            )
            zf.writestr(f"ppt/slides/slide{i+1}.xml", slide_xml)
            
            # Slide rel to layout
            zf.writestr(f"ppt/slides/_rels/slide{i+1}.xml.rels", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>""")

    print(f"✅ Successfully created PowerPoint presentation: {pptx_path} ({len(slides_data)} slides)")

if __name__ == "__main__":
    create_presentation()
