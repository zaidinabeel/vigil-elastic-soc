import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  FileText, 
  Lock, 
  Globe, 
  Play, 
  Terminal, 
  TrendingUp, 
  UserCheck, 
  Download, 
  Activity, 
  Server, 
  ChevronRight,
  RefreshCw,
  Eye,
  Check,
  Building2,
  Users,
  Layers,
  Sparkles,
  Search,
  Filter,
  Sun,
  Moon,
  Copy,
  ExternalLink,
  ShieldAlert,
  Zap,
  Radio,
  FileCheck,
  CheckCircle,
  HelpCircle,
  Cpu,
  Share2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Network,
  ListTree,
  Pause,
  BadgeAlert,
  ShieldCheck,
  Workflow,
  Send,
  ArrowRight,
  ArrowLeft,
  CornerDownRight,
  Code2,
  CheckSquare,
  X,
  Maximize2,
  SlidersHorizontal,
  Hash,
  Compass,
  LayoutGrid,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";

// Types and Interfaces
interface TopologyNode {
  id: string;
  label: string;
  type: "ATTACKER" | "GATEWAY" | "CORE_SYSTEM" | "TARGET" | "BENIGN_DAEMON";
  ip: string;
  geo: string;
  status: "COMPROMISED" | "BLOCKED" | "ISOLATED" | "ACTIVE" | "BENIGN" | "FROZEN";
  protocol: string;
  mitre_tag: string;
  details: string;
}

interface TimelineEvent {
  offset: string;
  time: string;
  title: string;
  tactic: string;
  source_ip: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "INFO" | "LOW";
  raw_ecs: Record<string, any>;
}

interface AICopilotPrompt {
  question: string;
  esql_query: string;
  explanation: string;
}

interface ScenarioConfig {
  incident_id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "LOW";
  threat_tactic: string;
  mitre_id: string;
  direct_exposure_inr: number;
  is_material: boolean;
  rbi_status: string;
  current_step: number;
  compromised_user: string;
  attacker_ip: string;
  attacker_ips: string[];
  target_assets: string[];
  compromised_credentials: string;
  payload_hash: string;
  payment_channel: string;
  batch_id: string;
  impact_summary: string;
  affected_systems: string[];
  step1: {
    rbi_ref: string;
    certin_category: string;
    threshold_desc: string;
    clock_status: string;
    penalty_at_stake: string;
    reasoning_bullet: string;
  };
  step2: {
    autonomous_detection_title: string;
    autonomous_detection_query: string;
    autonomous_detection_explanation: string;
    forensic_blast_radius_title: string;
    forensic_blast_radius_query: string;
    discovered_entity: string;
    compromised_id: string;
    sample_table: {
      columns: string[];
      rows: any[][];
    };
  };
  step3: {
    corporate_count: number;
    hni_count: number;
    affected_accounts_total: number;
    account_examples: string;
    business_risk_level: string;
    penalty_saved: string;
    core_systems_affected: string;
    accounts_table: {
      account_id: string;
      name: string;
      tier: "Corporate" | "HNI" | "Retail";
      balance_inr: number;
      exposed_inr: number;
      status: "FROZEN_PRESERVED" | "UNDER_REVIEW" | "NORMAL";
      branch: string;
    }[];
  };
  step4: {
    actions: {
      title: string;
      description: string;
      system: string;
      api_payload: Record<string, any>;
    }[];
    containment_success_msg: string;
  };
  step5: {
    affected_systems: string;
    remedial_summary: string;
  };
  step6: {
    block_hash: string;
    prev_hash: string;
    merkle_root: string;
  };
  topology: TopologyNode[];
  timeline: TimelineEvent[];
  copilot_prompts: AICopilotPrompt[];
  indic: Record<string, string>;
}

// 8 Rich Banking Use Cases Configuration
const INITIAL_SCENARIOS: ScenarioConfig[] = [
  {
    incident_id: "INC-2026-0902-01",
    title: "Privileged OAuth2 Token Theft & Unauthorized UPI Bulk Draining",
    severity: "CRITICAL",
    threat_tactic: "Privilege Escalation / Financial Exfiltration",
    mitre_id: "T1078.004",
    direct_exposure_inr: 18240000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 6,
    compromised_user: "svc_payment_gw",
    attacker_ip: "198.51.100.44",
    attacker_ips: [
      "198.51.100.44 (Primary C2 Gateway - Amsterdam, NL)",
      "185.220.101.5 (Tor Exit Node - Frankfurt, DE)",
      "103.251.167.20 (Residential Proxy - Singapore)",
      "194.26.29.112 (Bot Node - Moscow, RU)"
    ],
    target_assets: [
      "10.14.8.102 (api-gw-upi.bank.internal)",
      "10.14.2.45 (auth-oauth2.bank.internal)",
      "10.14.0.10 (cbs-clearing-engine.bank.internal)"
    ],
    compromised_credentials: "OAuth2 Bearer Token for 'svc_payment_gw'",
    payload_hash: "SHA256: 4f98d9e2b4510aa18992cde8710b14ea987b213f9821a89c927f8a12bcde8901",
    payment_channel: "UPI Bulk Gateway / NPCI Inter-Bank Switch",
    batch_id: "BATCH-20260902-8821",
    impact_summary: "Adversary brute-forced staging API Gateway, stole OAuth2 bearer token for svc_payment_gw, and triggered 120 unauthorized bulk UPI payment requests.",
    affected_systems: ["api-gw-upi.bank.internal", "auth-oauth2.bank.internal", "cbs-clearing-engine.bank.internal"],
    step1: {
      rbi_ref: "RBI/2023-24/CSIR/04 - Cyber Security Framework in Banks (Annex-1)",
      certin_category: "CIAD-2022-04 Unauthorized Access to Payment Gateway & Financial Fraud",
      threshold_desc: "Direct financial exposure exceeds RBI ₹1.00 Crore material threshold (Actual: ₹ 1.82 Crore).",
      clock_status: "6-Hour Statutory SLA Active (Filing Completed in 4.2 mins)",
      penalty_at_stake: "₹ 50,00,000 + Executive Regulatory Inquiry",
      reasoning_bullet: "High velocity token exfiltration targeting NPCI batch clearance switch."
    },
    step2: {
      autonomous_detection_title: "ES|QL Query: Stolen OAuth Token Ingress from Anomalous CIDR",
      autonomous_detection_query: `FROM logs-auth-default
| WHERE event.outcome == "success" AND user.name == "svc_payment_gw" AND source.ip == "198.51.100.44"
| STATS count() by user.name, source.ip, destination.ip`,
      autonomous_detection_explanation: "Detected high-privilege service account token utilized from untrusted external Dutch IP address.",
      forensic_blast_radius_title: "ES|QL Query: Rupee Exposure & Target Beneficiary Mapping",
      forensic_blast_radius_query: `FROM logs-banking-default
| WHERE bank.batch_id == "BATCH-20260902-8821"
| STATS sum(bank.amount_inr) as total_rupees, count_distinct(bank.account_id) as affected_accounts by bank.channel`,
      discovered_entity: "198.51.100.44 (Attacker C2)",
      compromised_id: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
      sample_table: {
        columns: ["@timestamp", "source.ip", "user.name", "bank.batch_id", "bank.amount_inr", "event.outcome"],
        rows: [
          ["2026-09-02T17:09:46Z", "198.51.100.44", "svc_payment_gw", "BATCH-20260902-8821", "1,82,40,000.00", "SUCCESS"],
          ["2026-09-02T17:08:12Z", "198.51.100.44", "svc_payment_gw", "AUTH-PROBE-01", "0.00", "SUCCESS"],
          ["2026-09-02T17:05:01Z", "198.51.100.44", "svc_payment_gw", "AUTH-PROBE-00", "0.00", "FAILURE"]
        ]
      }
    },
    step3: {
      corporate_count: 4,
      hni_count: 14,
      affected_accounts_total: 18,
      account_examples: "Tata Consultancy Corporate Salary VPA, Infosys Vendor Pool, 14 HNI Accounts",
      business_risk_level: "CRITICAL REGULATORY EXPOSURE",
      penalty_saved: "₹ 50,00,000 Saved via Timely Containment",
      core_systems_affected: "Core Banking Engine (CBS), NPCI UPI Settlement Queue, IMPS Outbound Gateway",
      accounts_table: [
        { account_id: "ACC-9021841", name: "Apex Corporate Treasury Pool", tier: "Corporate", balance_inr: 85000000.00, exposed_inr: 6500000.00, status: "FROZEN_PRESERVED", branch: "Fort Mumbai (0001)" },
        { account_id: "ACC-8812940", name: "Global Logistics Escrow", tier: "Corporate", balance_inr: 42000000.00, exposed_inr: 4800000.00, status: "FROZEN_PRESERVED", branch: "Nariman Point (0004)" },
        { account_id: "ACC-1092847", name: "Dr. Vikram Singhania (HNI)", tier: "HNI", balance_inr: 18500000.00, exposed_inr: 1200000.00, status: "FROZEN_PRESERVED", branch: "Bandra West (0012)" },
        { account_id: "ACC-3847291", name: "Rajeshwar Infrastructure Ltd", tier: "Corporate", balance_inr: 95000000.00, exposed_inr: 3400000.00, status: "FROZEN_PRESERVED", branch: "Connaught Place (0020)" },
        { account_id: "ACC-5591823", name: "Meera Oberoi Wealth Account", tier: "HNI", balance_inr: 12400000.00, exposed_inr: 2340000.00, status: "FROZEN_PRESERVED", branch: "MG Road Bengaluru (0008)" }
      ]
    },
    step4: {
      actions: [
        { title: "Null-Route Malicious Ingress IP on Edge Firewalls", description: "Injected BGP null-route for 198.51.100.44 into Cloudflare Magic Transit & Edge Cisco ASA.", system: "Perimeter Firewall (palo-alto-gw01)", api_payload: { action: "BLOCK_IP", ip: "198.51.100.44", ttl: "86400s" } },
        { title: "Revoke Leaked OAuth2 Bearer Token in IAM Gateway", description: "Invalidated JWT session signature and rotated shared HMAC secret for service 'svc_payment_gw'.", system: "Identity Gateway (keycloak-auth-prod)", api_payload: { action: "REVOKE_TOKEN", subject: "svc_payment_gw", force_logout: true } },
        { title: "Place NPCI Outbound UPI Batch Queue on Debit Hold", description: "Suspended batch settlement BATCH-20260902-8821 in National Automated Clearing House engine.", system: "Core Settlement Hub (npci-switch-v4)", api_payload: { action: "SUSPEND_BATCH", batch_id: "BATCH-20260902-8821" } },
        { title: "Apply Forensic Debit Freeze on 18 Compromised Target Accounts", description: "Enforced debit lien code 'FRAUD_SUSP_SEC70B' on affected accounts to prevent secondary laundering.", system: "Finacle Core Banking (cbs-prod-cluster)", api_payload: { action: "APPLY_LIEN", code: "FRAUD_SUSP_SEC70B", count: 18 } }
      ],
      containment_success_msg: "All 4 automated containment runbooks executed in 14.2 milliseconds. Zero rupee loss realized."
    },
    step5: {
      affected_systems: "api-gateway.bank.internal (10.0.4.12), npci-switch-v4 (10.0.8.50)",
      remedial_summary: "Leaked credentials invalidated; IP null-routed; settlement batch paused; 18 accounts secured."
    },
    step6: {
      block_hash: "0x8f9c1e4d8a7b6c5e3f2a1d0b9c8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0",
      prev_hash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8",
      merkle_root: "0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff"
    },
    topology: [
      { id: "node-att", label: "External Threat C2", type: "ATTACKER", ip: "198.51.100.44", geo: "Amsterdam, NL", status: "BLOCKED", protocol: "HTTPS/REST", mitre_tag: "T1078.004", details: "Adversary command & control server launching automated token replay scripts." },
      { id: "node-gw", label: "API Gateway (DMZ)", type: "GATEWAY", ip: "10.0.4.12", geo: "Mumbai DC Tier-IV", status: "COMPROMISED", protocol: "mTLS/OAuth2", mitre_tag: "T1190", details: "Public-facing bank API reverse proxy handling incoming UPI callback webhooks." },
      { id: "node-auth", label: "IAM Auth Cluster", type: "CORE_SYSTEM", ip: "10.0.2.45", geo: "Navi Mumbai DC", status: "ISOLATED", protocol: "Kerberos/JWT", mitre_tag: "T1558", details: "Central OAuth2 authorization server managing bank microservice bearer tokens." },
      { id: "node-cbs", label: "Finacle CBS Engine", type: "TARGET", ip: "10.0.8.50", geo: "Mumbai Core DC", status: "FROZEN", protocol: "ISO 8583 / JSON", mitre_tag: "T1565.001", details: "Primary core banking ledger where ₹ 1.82 Crore batch disbursement was attempted." }
    ],
    timeline: [
      { offset: "+00:00", time: "17:05:01 UTC", title: "API Auth Brute Force Ingress", tactic: "Credential Access", source_ip: "198.51.100.44", description: "1,420 rapid authentication attempts against /api/v1/auth/token within 60 seconds.", severity: "HIGH", raw_ecs: { "@timestamp": "2026-09-02T17:05:01Z", "event.category": "authentication", "event.outcome": "failure", "source.ip": "198.51.100.44", "http.request.method": "POST" } },
      { offset: "+00:03", time: "17:08:12 UTC", title: "OAuth2 Bearer Token Compromise", tactic: "Privilege Escalation", source_ip: "198.51.100.44", description: "Valid service token generated for privileged service account 'svc_payment_gw'.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T17:08:12Z", "event.category": "authentication", "event.outcome": "success", "user.name": "svc_payment_gw", "source.ip": "198.51.100.44" } },
      { offset: "+00:04", time: "17:09:46 UTC", title: "Bulk UPI Payout Batch Injected", tactic: "Financial Exfiltration", source_ip: "198.51.100.44", description: "Unauthorized POST to /api/v2/bulk-disburse containing 120 transactions totaling ₹ 1,82,40,000.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T17:09:46Z", "bank.batch_id": "BATCH-20260902-8821", "bank.amount_inr": 18240000.0, "bank.channel": "UPI" } },
      { offset: "+00:05", time: "17:09:48 UTC", title: "VIGIL Autonomous Triage & Containment", tactic: "Defense Response", source_ip: "10.0.1.1", description: "ES|QL Correlator triggered containment gate; Token revoked, IP null-routed, Batch paused.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T17:09:48Z", "event.action": "CONTAINMENT_SUCCESS", "vigil.latency_ms": 14.2 } }
    ],
    copilot_prompts: [
      { question: "Show all successful authentications for svc_payment_gw from non-internal IP addresses", esql_query: `FROM logs-auth-default | WHERE user.name == "svc_payment_gw" AND NOT CIDR_MATCH(source.ip, "10.0.0.0/8") | LIMIT 50`, explanation: "Identifies unauthorized token consumption originating from public internet addresses." },
      { question: "Calculate sum of fraudulent transaction attempts grouped by destination bank branch", esql_query: `FROM logs-banking-default | WHERE bank.batch_id == "BATCH-20260902-8821" | STATS sum(bank.amount_inr) as branch_exposure, count() by bank.branch_code`, explanation: "Quantifies financial blast radius broken down by receiving bank branch codes." },
      { question: "List top 10 target beneficiary accounts with high AML risk score in this batch", esql_query: `FROM logs-banking-default | WHERE bank.aml_risk_score > 85 | SORT bank.amount_inr DESC | LIMIT 10`, explanation: "Surfaces mule accounts created recently with anomalous high-risk AML profiles." }
    ],
    indic: {
      hi: "चेतावनी: अनधिकृत यूपीआई थोक भुगतान प्रयास (₹ 1.82 करोड़) पकड़ा गया। सतर्कता एआई द्वारा टोकन तुरंत रद्द कर दिया गया है और सभी बैंक खाते सुरक्षित कर दिए गए हैं।",
      mr: "सावधान: अनधिकृत यूपीआय व्यवहार (₹ 1.82 कोटी) शोधून काढले गेले आहे. सतर्कता एआय ने टोकन त्वरित रद्द केले असून सर्व बँक खाती सुरक्षित केली आहेत.",
      gu: "ચેતવણી: અનધિકૃત યુપીઆઈ ચૂકવણીનો પ્રયાસ (₹ 1.82 કરોડ) પકડાયો છે. વિજિલ એઆઈએ તરત જ ટોકન રદ કર્યું છે અને ખાતાઓ સુરક્ષિત કર્યા છે.",
      ta: "எச்சரிக்கை: அங்கீகரிக்கப்படாத UPI பரிவர்த்தனை (₹ 1.82 கோடி) கண்டறியப்பட்டது. விஜி ஏஐ டோக்கனை உடனடியாக ரத்து செய்தது.",
      te: "హెచ్చరిక: అనధికారిక UPI చెల్లింపుల ప్రయత్నం (₹ 1.82 కోట్లు) గుర్తించబడింది. విగిల్ ఏఐ టోకెన్‌ను రద్దు చేసి ఖాతాలను రక్షించింది.",
      bn: "সতর্কতা: অননুমোদিত ইউপিআই পেমেন্ট প্রচেষ্টা (₹ ১.৮২ কোটি) ধরা পড়েছে। ভিজিল এআই সমস্ত অ্যাকাউন্ট সুরক্ষিত করেছে।",
      kn: "ಎಚ್ಚರಿಕೆ: ಅನಧಿಕೃತ ಯುಪಿಐ ಪಾವತಿ ಪ್ರಯತ್ನ (₹ 1.82 ಕೋಟಿ) ಪತ್ತೆಯಾಗಿದೆ. ವಿಜಿಲ್ ಎಐ ಟೋಕನ್ ಅನ್ನು ತಕ್ಷಣವೇ ರದ್ದುಗೊಳಿಸಿದೆ.",
      ml: "മുന്നറിയിപ്പ്: അനധികൃത യുപിഐ പേയ്‌മെന്റ് ശ്രമം (₹ 1.82 കോടി) കണ്ടെത്തി. വിഗിൽ എഐ ടോക്കൺ റദ്ദാക്കി.",
      pa: "ਚੇਤਾਵਨੀ: ਅਣਅਧਿਕਾਰਤ ਯੂਪੀਆਈ ਭੁਗਤਾਨ (₹ 1.82 ਕਰੋੜ) ਦਾ ਪਤਾ ਲੱਗਾ ਹੈ। ਵਿਜਿਲ ਏਆਈ ਨੇ ਖਾਤੇ ਸੁਰੱਖਿਅਤ ਕਰ ਲਏ ਹਨ।",
      od: "ଚେତାବନୀ: ଅନଧିକୃତ ୟୁପିଆଇ ପେମେଣ୍ଟ ଉଦ୍ୟମ (₹ 1.82 କୋଟି) ଧରାପଡ଼ିଛି। ଭିଜିଲ ଏଆଇ ଖାତାଗୁଡ଼ିକୁ ସୁରକ୍ଷିତ କରିଛି।"
    }
  },
  {
    incident_id: "INC-2026-0902-02",
    title: "Distributed Botnet Credential Stuffing on NetBanking Portal & IMPS Velocity Abuse",
    severity: "HIGH",
    threat_tactic: "Credential Access / Brute Force",
    mitre_id: "T1110.004",
    direct_exposure_inr: 4250000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 6,
    compromised_user: "multiple_corporate_users",
    attacker_ip: "45.33.32.156",
    attacker_ips: [
      "45.33.32.156 (Botnet Master Controller - Chicago, US)",
      "185.220.101.45 (Tor Anonymizer - Zurich, CH)",
      "103.251.167.88 (Proxy Pool - Tokyo, JP)",
      "194.26.29.50 (Bot Node - Bucharest, RO)"
    ],
    target_assets: [
      "10.14.1.50 (netbanking.bank.co.in)",
      "10.14.1.80 (auth-otp-service.bank.internal)"
    ],
    compromised_credentials: "28 Corporate NetBanking Credentials & Automated IMPS Beneficiaries",
    payload_hash: "SHA256: 7d12f38a9bc04e52811a0dc6721ef582098dca124317a102bcde190a87612f01",
    payment_channel: "NetBanking Web Portal & High-Velocity IMPS Queue",
    batch_id: "IMPS-BURST-9912",
    impact_summary: "Tor exit nodes executed 4,200 req/min credential stuffing against NetBanking login endpoint, compromising 28 salary accounts and attempting rapid IMPS transfers.",
    affected_systems: ["netbanking.bank.co.in", "auth-otp-service.bank.internal"],
    step1: {
      rbi_ref: "RBI Master Direction on Digital Payment Security Controls (Section 4.3)",
      certin_category: "CIAD-2022-08 Identity Theft, Spoofing & Automated Credential Stuffing",
      threshold_desc: "Distributed botnet attack triggering anomalous credential failures across >25 corporate accounts.",
      clock_status: "6-Hour Statutory SLA Active (Filing Completed in 3.8 mins)",
      penalty_at_stake: "₹ 25,00,000 + Supervisory Action",
      reasoning_bullet: "High velocity geo-distributed login attempts with brute-force password replay."
    },
    step2: {
      autonomous_detection_title: "ES|QL Query: Botnet Velocity & Geographic Anomaly Detection",
      autonomous_detection_query: `FROM logs-auth-default
| WHERE event.action == "user_login" AND event.outcome == "failure"
| STATS count() as fail_count by source.ip, source.geo.country_name
| WHERE fail_count > 500`,
      autonomous_detection_explanation: "Identified coordinated credential stuffing from 4 primary foreign egress IP pools.",
      forensic_blast_radius_title: "ES|QL Query: Compromised Corporate Account Identification",
      forensic_blast_radius_query: `FROM logs-banking-default
| WHERE bank.channel == "IMPS" AND bank.batch_id == "IMPS-BURST-9912"
| STATS sum(bank.amount_inr) as total_exposed, count() by user.name`,
      discovered_entity: "45.33.32.156 (Bot Controller)",
      compromised_id: "28 Corporate Salary User Credentials",
      sample_table: {
        columns: ["@timestamp", "source.ip", "geo.country", "fail_velocity", "target_endpoint"],
        rows: [
          ["2026-09-02T18:14:02Z", "45.33.32.156", "United States", "4,200 req/min", "/netbanking/login"],
          ["2026-09-02T18:13:50Z", "185.220.101.45", "Switzerland", "1,850 req/min", "/netbanking/login"],
          ["2026-09-02T18:13:22Z", "103.251.167.88", "Japan", "940 req/min", "/netbanking/login"]
        ]
      }
    },
    step3: {
      corporate_count: 28,
      hni_count: 0,
      affected_accounts_total: 28,
      account_examples: "Infosys Salary Batch #12, Wipro Vendor Accounts",
      business_risk_level: "HIGH REPUTATIONAL & FUNDS RISK",
      penalty_saved: "₹ 25,00,000 Saved via Timely Containment",
      core_systems_affected: "NetBanking Web Tier, OTP SMS Dispatch Engine, IMPS Outbound Gateway",
      accounts_table: [
        { account_id: "ACC-7721890", name: "Anand Rathi Corporate Payroll", tier: "Corporate", balance_inr: 12500000.00, exposed_inr: 1800000.00, status: "FROZEN_PRESERVED", branch: "Pune Main (0040)" },
        { account_id: "ACC-6612941", name: "Kirloskar Vendor Disbursal", tier: "Corporate", balance_inr: 9400000.00, exposed_inr: 1250000.00, status: "FROZEN_PRESERVED", branch: "Cyber City Gurugram (0015)" },
        { account_id: "ACC-5529810", name: "Tech Mahindra Contractor Pool", tier: "Corporate", balance_inr: 8100000.00, exposed_inr: 1200000.00, status: "FROZEN_PRESERVED", branch: "Electronic City Bengaluru (0018)" }
      ]
    },
    step4: {
      actions: [
        { title: "Enforce Cloud WAF Geo-IP & Threat Intelligence Filter", description: "Blocked ASN ranges for Tor relays and anonymized residential proxy networks at Cloud WAF layer.", system: "Cloudflare WAF / AWS WAF", api_payload: { action: "BLOCK_ASN_POOL", asns: [13335, 9009] } },
        { title: "Terminate Active User Sessions & Force OTP Reset", description: "Revoked active web session cookies and locked accounts pending mandatory biometric re-auth.", system: "Customer IAM (ciam-prod)", api_payload: { action: "FORCE_CREDENTIAL_ROTATION", accounts: 28 } },
        { title: "Suspend High-Velocity IMPS Beneficiary Injections", description: "Temporarily blocked newly added IMPS payees with cooling-off period enforcement.", system: "IMPS Engine (imps-fast-switch)", api_payload: { action: "ENFORCE_COOLING_PERIOD", duration: "24h" } }
      ],
      containment_success_msg: "Botnet traffic mitigated at perimeter. 28 customer accounts secured with mandatory OTP rotation."
    },
    step5: {
      affected_systems: "netbanking.bank.co.in (10.14.1.50), auth-otp-service (10.14.1.80)",
      remedial_summary: "WAF IP block enforced; 28 accounts force-reset; IMPS cooling-off period activated."
    },
    step6: {
      block_hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      prev_hash: "0x8f9c1e4d8a7b6c5e3f2a1d0b9c8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0",
      merkle_root: "0xaabbccddeeff00112233445566778899aabbccddeeff00112233445566778899"
    },
    topology: [
      { id: "node-bot1", label: "Botnet Node 1 (US)", type: "ATTACKER", ip: "45.33.32.156", geo: "Chicago, US", status: "BLOCKED", protocol: "HTTPS", mitre_tag: "T1110.004", details: "Distributed credential stuffing node launching rapid POST payloads." },
      { id: "node-bot2", label: "Tor Exit Node (CH)", type: "ATTACKER", ip: "185.220.101.45", geo: "Zurich, CH", status: "BLOCKED", protocol: "HTTPS", mitre_tag: "T1110.004", details: "Anonymized egress proxy attempting automated OTP bypass." },
      { id: "node-netbk", label: "NetBanking Web (DMZ)", type: "GATEWAY", ip: "10.14.1.50", geo: "Mumbai DC Tier-IV", status: "ISOLATED", protocol: "TLS 1.3", mitre_tag: "T1078", details: "Customer online banking portal receiving burst login traffic." },
      { id: "node-imps", label: "IMPS Switch Core", type: "TARGET", ip: "10.14.1.80", geo: "Navi Mumbai DC", status: "FROZEN", protocol: "ISO 8583", mitre_tag: "T1565", details: "Real-time payment switch targeted for immediate fund drain." }
    ],
    timeline: [
      { offset: "+00:00", time: "18:10:00 UTC", title: "Botnet Login Burst Detected", tactic: "Credential Access", source_ip: "45.33.32.156", description: "Sudden spike of 4,200 failed logins across 800 IP addresses in 2 minutes.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T18:10:00Z", "event.category": "authentication", "event.outcome": "failure" } },
      { offset: "+00:02", time: "18:12:15 UTC", title: "Corporate Account Compromise", tactic: "Initial Access", source_ip: "185.220.101.45", description: "28 corporate salary accounts successfully accessed via reused credentials.", severity: "HIGH", raw_ecs: { "@timestamp": "2026-09-02T18:12:15Z", "event.category": "authentication", "event.outcome": "success" } },
      { offset: "+00:03", time: "18:13:50 UTC", title: "Rapid IMPS Beneficiary Addition", tactic: "Exfiltration", source_ip: "103.251.167.88", description: "Automated scripts attempting to inject rogue IMPS payees for quick drain.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T18:13:50Z", "bank.channel": "IMPS", "bank.amount_inr": 4250000.0 } },
      { offset: "+00:04", time: "18:14:02 UTC", title: "VIGIL Autonomous Mitigation", tactic: "Defense Response", source_ip: "10.0.1.1", description: "WAF rate limit applied; 28 accounts locked; IMPS cooldown enforced.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T18:14:02Z", "event.action": "MITIGATION_SUCCESS" } }
    ],
    copilot_prompts: [
      { question: "Find source IPs generating more than 100 failed logins in the last 15 minutes", esql_query: `FROM logs-auth-default | WHERE event.outcome == "failure" | STATS count() as failures by source.ip | WHERE failures > 100 | SORT failures DESC`, explanation: "Surfaces botnet IP nodes participating in distributed credential stuffing." },
      { question: "List all IMPS beneficiaries added within 5 minutes of a successful login", esql_query: `FROM logs-banking-default | WHERE bank.channel == "IMPS" AND bank.action == "ADD_BENEFICIARY" | LIMIT 25`, explanation: "Flags high-velocity automated payee injections indicative of account takeover." }
    ],
    indic: {
      hi: "चेतावनी: नेटबैंकिंग पोर्टल पर बॉटनेट पासवर्ड अटैक पकड़ा गया। 28 कॉर्पोरेट खातों को तुरंत लॉक कर दिया गया है और अनधिकृत निकासी रोक दी गई है।",
      mr: "सावधान: नेटबँकिंग पोर्टलवर बॉटनेट हल्ला शोधला गेला आहे. २८ खाती त्वरित सुरक्षित करण्यात आली आहेत.",
      gu: "ચેતવણી: નેટબેંકિંગ પર બોટનેટ એટેક પકડાયો છે. ૨૮ કોર્પોરેટ ખાતાઓ તુરંત સુરક્ષિત કરવામાં આવ્યા છે.",
      ta: "எச்சரிக்கை: நெட்பேங்கிங் தளத்தில் பாட்நெட் தாக்குதல் கண்டுபிடிக்கப்பட்டது. 28 கணக்குகள் பாதுகாக்கப்பட்டன.",
      te: "హెచ్చరిక: నెట్‌బ్యాంకింగ్‌పై బోట్‌నెట్ దాడి గుర్తించబడింది. 28 ఖాతాలు తక్షణమే రక్షించబడ్డాయి.",
      bn: "সতর্কতা: নেটব্যাঙ্কিং পোর্টালে বটনেট আক্রমণ শনাক্ত করা হয়েছে। ২৮টি অ্যাকাউন্ট সুরক্ষিত করা হয়েছে।",
      kn: "ಎಚ್ಚರಿಕೆ: ನೆಟ್‌ಬ್ಯಾಂಕಿಂಗ್‌ನಲ್ಲಿ ಬಾಟ್‌ನೆಟ್ ದಾಳಿ ಪತ್ತೆಯಾಗಿದೆ. 28 ಖಾತೆಗಳನ್ನು ಸುರಕ್ಷಿತಗೊಳಿಸಲಾಗಿದೆ.",
      ml: "മുന്നറിയിപ്പ്: നെറ്റ്ബാങ്കിംഗിൽ ബോട്ട്നെറ്റ് ആക്രമണം കണ്ടെത്തി. 28 അക്കൗണ്ടുകൾ സുരക്ഷിതമാക്കി.",
      pa: "ਚੇਤਾਵਨੀ: ਨੈੱਟਬੈਂਕਿੰਗ 'ਤੇ ਬੋਟਨੈੱਟ ਹਮਲਾ ਫੜਿਆ ਗਿਆ। 28 ਖਾਤੇ ਸੁਰੱਖਿਅਤ ਕਰ ਲਏ ਗਏ ਹਨ।",
      od: "ଚେତାବନୀ: ନେଟବ୍ୟାଙ୍କିଙ୍ଗରେ ବଟନେଟ ଆକ୍ରମଣ ଧରାପଡ଼ିଛି। ୨୮ଟି ଖାତା ସୁରକ୍ଷିତ କରାଯାଇଛି।"
    }
  },
  {
    incident_id: "INC-2026-0902-03",
    title: "ATM Switch-In-The-Middle ISO 8583 Response Code Manipulation",
    severity: "CRITICAL",
    threat_tactic: "Man-in-the-Middle / Data Manipulation",
    mitre_id: "T1557",
    direct_exposure_inr: 34000000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 6,
    compromised_user: "switch_daemon_vlan8",
    attacker_ip: "10.14.22.88",
    attacker_ips: [
      "10.14.22.88 (Rogue Switch Tap - Mumbai Regional ATM LAN)",
      "198.51.100.77 (Encrypted C2 Relay - Stockholm, SE)",
      "10.14.22.105 (Infected Branch Terminal 3)"
    ],
    target_assets: [
      "10.14.22.1 (atm-switch-core.bank.internal)",
      "10.14.22.50 (hsm-cluster.bank.internal)"
    ],
    compromised_credentials: "ATM Switch Channel Session #8812 & ISO 8583 Response Code Modifier",
    payload_hash: "SHA256: 3c90f2b84e117a02c918a0021cd58e663a82910d8819a12c8b0124fe7891bc04",
    payment_channel: "ATM Switch ISO 8583 Authorization Protocol",
    batch_id: "ATM-SWITCH-CLUSTER-04",
    impact_summary: "Adversary executed ARP poisoning on regional ATM switch router, intercepting ISO 8583 packet streams and forging response code '00' (Approved) for depleted cards.",
    affected_systems: ["atm-switch-core.bank.internal", "hsm-cluster.bank.internal"],
    step1: {
      rbi_ref: "RBI Circular on ATM Security Controls (DBS.CO.CSITE.BC.11/31.01.015/2019-20)",
      certin_category: "CIAD-2022-02 Compromise of Critical Infrastructure & ATM Switching Protocol",
      threshold_desc: "Direct protocol-level manipulation of core ATM switch exceeding ₹3.40 Crore exposure.",
      clock_status: "6-Hour Statutory SLA Active (Filing Completed in 4.5 mins)",
      penalty_at_stake: "₹ 1,00,00,000 + ATM Fleet Suspension",
      reasoning_bullet: "ISO 8583 message modification tampering with authorization response codes."
    },
    step2: {
      autonomous_detection_title: "ES|QL Query: ISO 8583 Response Code Mismatch Anomaly",
      autonomous_detection_query: `FROM logs-banking-default
| WHERE bank.channel == "ATM" AND bank.iso8583_resp_code == "00" AND bank.core_ledger_status == "INSUFFICIENT_FUNDS"
| STATS count() as tampered_txns, sum(bank.amount_inr) as exposure by bank.atm_id`,
      autonomous_detection_explanation: "Detected discrepancies where ATM switch reported approval but core ledger had declined due to zero balance.",
      forensic_blast_radius_title: "ES|QL Query: Rogue Switch Tap & ARP Poisoning Signature",
      forensic_blast_radius_query: `FROM logs-network-default
| WHERE network.protocol == "arp" AND event.action == "duplicate_ip_advertisement"
| STATS count() by source.ip, source.mac`,
      discovered_entity: "10.14.22.88 (Rogue ATM Tap)",
      compromised_id: "ISO 8583 Bit 39 Override Module",
      sample_table: {
        columns: ["@timestamp", "atm.id", "card.last4", "switch.resp", "cbs.status", "amount.inr"],
        rows: [
          ["2026-09-02T19:02:11Z", "ATM-MUM-0412", "9912", "00 (APPROVED)", "DECLINED (05)", "50,000.00"],
          ["2026-09-02T19:02:45Z", "ATM-MUM-0412", "9912", "00 (APPROVED)", "DECLINED (05)", "50,000.00"],
          ["2026-09-02T19:03:10Z", "ATM-MUM-0418", "4410", "00 (APPROVED)", "DECLINED (05)", "50,000.00"]
        ]
      }
    },
    step3: {
      corporate_count: 0,
      hni_count: 12,
      affected_accounts_total: 12,
      account_examples: "12 High-Limit Debit Cards Cloned for ATM Cashout",
      business_risk_level: "CRITICAL DIRECT CASH DISBURSEMENT RISK",
      penalty_saved: "₹ 1,00,00,000 Saved via Timely Containment",
      core_systems_affected: "ATM Base24-eps Switch, Hardware Security Module (HSM), Regional Cash Clearing",
      accounts_table: [
        { account_id: "ACC-4410921", name: "Capt. Arvind Malhotra (Retd)", tier: "HNI", balance_inr: 45000.00, exposed_inr: 2800000.00, status: "FROZEN_PRESERVED", branch: "Colaba Mumbai (0002)" },
        { account_id: "ACC-8821094", name: "Sunita Deshmukh Wealth Card", tier: "HNI", balance_inr: 12000.00, exposed_inr: 3100000.00, status: "FROZEN_PRESERVED", branch: "Vashi Navi Mumbai (0022)" }
      ]
    },
    step4: {
      actions: [
        { title: "Quarantine Rogue Switch Tap into Sinkhole VLAN", description: "Isolated port GigabitEthernet1/0/24 on core switch to terminate ARP spoofing.", system: "Cisco Catalyst Core Switch", api_payload: { action: "PORT_SHUTDOWN", port: "Gi1/0/24" } },
        { title: "Force Synchronous Core Ledger Validation for All ATMs", description: "Disabled Stand-In Processing (STIP) mode; required 100% real-time CBS authorization.", system: "Base24 ATM Controller", api_payload: { action: "DISABLE_STIP_MODE", region: "WEST_MUMBAI" } },
        { title: "Rotate HSM Zone Master Encryption Keys (ZMK)", description: "Generated new cryptoperiod keys on Thales PayShield 10K HSM cluster.", system: "Thales HSM Cluster", api_payload: { action: "ROTATE_ZMK", cluster_id: "HSM-MUM-01" } }
      ],
      containment_success_msg: "ATM switch tap quarantined. Synchronous core ledger validation enforced. Zero cashout loss."
    },
    step5: {
      affected_systems: "atm-switch-core.bank.internal (10.14.22.1), hsm-cluster (10.14.22.50)",
      remedial_summary: "Rogue tap isolated; STIP mode disabled; HSM keys rotated; ATM fleet secured."
    },
    step6: {
      block_hash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
      prev_hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      merkle_root: "0xccddeeff00112233445566778899aabbccddeeff00112233445566778899aabb"
    },
    topology: [
      { id: "node-atm1", label: "Regional ATM Fleet", type: "GATEWAY", ip: "10.14.22.100", geo: "Mumbai Region", status: "ACTIVE", protocol: "ISO 8583", mitre_tag: "T1557", details: "Physical ATM terminals connected to regional switch concentrator." },
      { id: "node-tap", label: "Rogue Switch Tap", type: "ATTACKER", ip: "10.14.22.88", geo: "Local LAN Tap", status: "BLOCKED", protocol: "ARP/Raw Ethernet", mitre_tag: "T1557", details: "Unauthorized hardware appliance executing packet interception." },
      { id: "node-atmsw", label: "ATM Switch Core", type: "CORE_SYSTEM", ip: "10.14.22.1", geo: "Mumbai Core DC", status: "ISOLATED", protocol: "TCP/IP", mitre_tag: "T1565.001", details: "Transaction processing engine converting ATM requests to CBS format." },
      { id: "node-cbsatm", label: "Finacle CBS", type: "TARGET", ip: "10.0.8.50", geo: "Mumbai Core DC", status: "ACTIVE", protocol: "JSON RPC", mitre_tag: "T1565", details: "Core accounting ledger maintaining customer account balances." }
    ],
    timeline: [
      { offset: "+00:00", time: "19:00:10 UTC", title: "ARP Poisoning Injected on ATM VLAN", tactic: "Credential Access", source_ip: "10.14.22.88", description: "Rogue device began spoofing default gateway MAC address on VLAN 22.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:00:10Z", "event.category": "network" } },
      { offset: "+00:02", time: "19:02:11 UTC", title: "ISO 8583 Response Code Tampering", tactic: "Data Manipulation", source_ip: "10.14.22.88", description: "Declined responses (05) altered to Approved (00) before reaching ATM.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:02:11Z", "bank.amount_inr": 34000000.0 } },
      { offset: "+00:03", time: "19:03:30 UTC", title: "VIGIL Core Discrepancy Alert", tactic: "Defense Response", source_ip: "10.0.1.1", description: "ES|QL engine flagged zero-balance cashout anomaly and severed rogue port.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:03:30Z", "event.action": "PORT_SHUTDOWN" } }
    ],
    copilot_prompts: [
      { question: "Find all ATM transactions where switch response was 00 but CBS status was DECLINED", esql_query: `FROM logs-banking-default | WHERE bank.channel == "ATM" AND bank.iso8583_resp_code == "00" AND bank.core_status == "DECLINED" | LIMIT 50`, explanation: "Pinpoints exact MITM packet tampering events across ATM network." }
    ],
    indic: {
      hi: "चेतावनी: एटीएम स्विच में डेटा छेड़छाड़ (₹ 3.40 करोड़) पकड़ी गई। अवैध हार्डवेयर टैप को तुरंत ब्लॉक कर दिया गया है।",
      mr: "सावधान: एटीएम स्विचमधील छेडछाड (₹ 3.40 कोटी) शोधली गेली. संशयास्पद कनेक्शन त्वरित बंद केले आहे.",
      gu: "ચેતવણી: એટીએમ સ્વિચમાં ડેટા ચેડાં (₹ 3.40 કરોડ) પકડાયા છે. શંકાસ્પદ પોર્ટ તાત્કાલિક બ્લોક કરવામાં આવ્યો છે.",
      ta: "எச்சரிக்கை: ஏடிஎம் சுவிட்ச் சேதப்படுத்துதல் கண்டறியப்பட்டது. போர்ட் உடனடியாக துண்டிக்கப்பட்டது.",
      te: "హెచ్చరిక: ఏటీఎం స్విచ్‌లో అక్రమ మార్పులు గుర్తించబడ్డాయి. అనుమానాస్పద పోర్ట్ నిలిపివేయబడింది.",
      bn: "সতর্কতা: এটিএম সুইচে ডেটা ম্যানিপুলেশন ধরা পড়েছে। সন্দেহভাজন পোর্ট অবিলম্বে ব্লক করা হয়েছে।",
      kn: "ಎಚ್ಚರಿಕೆ: ಎಟಿಎಂ ಸ್ವಿಚ್‌ನಲ್ಲಿ ಅಕ್ರಮ ತಿದ್ದುಪಡಿ ಪತ್ತೆಯಾಗಿದೆ. ಪೋರ್ಟ್ ಅನ್ನು ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ.",
      ml: "മുന്നറിയിപ്പ്: എടിഎം സ്വിച്ചിൽ കൃത്രിമം കണ്ടെത്തി. സംശയാസ്പദമായ പോർട്ട് തടഞ്ഞു.",
      pa: "ਚੇਤਾਵਨੀ: ਏਟੀਐਮ ਸਵਿੱਚ ਵਿੱਚ ਛੇੜਛਾੜ ਫੜੀ ਗਈ। ਪੋਰਟ ਨੂੰ ਬੰਦ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
      od: "ଚେତାବନୀ: ଏଟିଏମ ସୁଇଚରେ ଡାଟା ଟ୍ୟାମ୍ପରିଂ ଧରାପଡ଼ିଛି। ପୋର୍ଟ ବନ୍ଦ କରାଯାଇଛି।"
    }
  },
  {
    incident_id: "INC-2026-0902-04",
    title: "Rogue Branch Insider KYC Verification & Auto-Loan Disbursal Tampering",
    severity: "HIGH",
    threat_tactic: "Insider Threat / Privilege Abuse",
    mitre_id: "T1078",
    direct_exposure_inr: 2800000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 6,
    compromised_user: "usr_loan_off_104",
    attacker_ip: "10.88.14.12",
    attacker_ips: [
      "10.88.14.12 (Branch Mumbai-Fort Workstation 4)",
      "10.88.14.1 (Branch LAN Gateway Router)"
    ],
    target_assets: [
      "10.14.3.20 (cbs-loan-origination.bank.internal)",
      "10.14.3.55 (kyc-verification.bank.internal)"
    ],
    compromised_credentials: "emp_9921_bm (Branch Operations Manager Credentials)",
    payload_hash: "SHA256: 8a1b02c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a912b3c4d5e6f7a8b9c0d1e2f3",
    payment_channel: "Core Banking (CBS) Loan Disbursal Engine",
    batch_id: "LOAN-DISBURSE-QUEUE-12",
    impact_summary: "Branch loan officer logged in at 23:45 off-hours, overrode KYC verification requirements on 12 flagged loan applications, and routed payouts to unverified mule accounts.",
    affected_systems: ["cbs-loan-origination.bank.internal", "kyc-verification.bank.internal"],
    step1: {
      rbi_ref: "RBI Master Direction on Know Your Customer (KYC) & Fraud Monitoring",
      certin_category: "CIAD-2022-14 Insider Threat, Unauthorized Modification & KYC Bypass Fraud",
      threshold_desc: "Privileged insider bypass of mandatory AML/KYC checks with off-hours batch disbursal.",
      clock_status: "6-Hour Statutory SLA Active (Filing Completed in 5.1 mins)",
      penalty_at_stake: "₹ 35,00,000 + Internal Vigilance Inquiry",
      reasoning_bullet: "Anomalous late-night access from branch IP modifying high-risk loan records."
    },
    step2: {
      autonomous_detection_title: "ES|QL Query: Off-Hours KYC Override & Disbursal Correlation",
      autonomous_detection_query: `FROM logs-cbs-audit-default
| WHERE user.name == "usr_loan_off_104" AND event.action == "KYC_MANUAL_OVERRIDE" AND event.time_hour >= 23
| STATS count() as overrides by bank.loan_application_id, bank.disbursal_amount_inr`,
      autonomous_detection_explanation: "Correlated late-night employee login with 12 manual KYC overrides bypassing Aadhaar verification.",
      forensic_blast_radius_title: "ES|QL Query: Loan Disbursal Recipient Account Network",
      forensic_blast_radius_query: `FROM logs-banking-default
| WHERE bank.batch_id == "LOAN-DISBURSE-QUEUE-12"
| STATS sum(bank.amount_inr) as total_loan_inr by bank.recipient_account_id`,
      discovered_entity: "usr_loan_off_104 (Branch Officer)",
      compromised_id: "CBS Loan Manager Role (Branch 0041)",
      sample_table: {
        columns: ["@timestamp", "user.name", "loan.app_id", "kyc.status", "disbursal.inr", "branch.ip"],
        rows: [
          ["2026-09-02T23:45:10Z", "usr_loan_off_104", "LN-2026-8812", "OVERRIDDEN", "2,50,000.00", "10.88.14.12"],
          ["2026-09-02T23:46:02Z", "usr_loan_off_104", "LN-2026-8813", "OVERRIDDEN", "2,50,000.00", "10.88.14.12"],
          ["2026-09-02T23:48:44Z", "usr_loan_off_104", "LN-2026-8814", "OVERRIDDEN", "2,00,000.00", "10.88.14.12"]
        ]
      }
    },
    step3: {
      corporate_count: 0,
      hni_count: 12,
      affected_accounts_total: 12,
      account_examples: "12 Fabricated Borrower Accounts in Mumbai-Fort Branch",
      business_risk_level: "HIGH INTERNAL FRAUD & COMPLIANCE RISK",
      penalty_saved: "₹ 35,00,000 Saved via Timely Containment",
      core_systems_affected: "Loan Origination System (LOS), Finacle Core Banking, Aadhaar eKYC Gateway",
      accounts_table: [
        { account_id: "ACC-3319028", name: "Rameshwar Enterprises (Fake Entity)", tier: "HNI", balance_inr: 250000.00, exposed_inr: 250000.00, status: "FROZEN_PRESERVED", branch: "Fort Mumbai (0041)" },
        { account_id: "ACC-3319029", name: "Balaji Auto Agency (Mule Account)", tier: "HNI", balance_inr: 250000.00, exposed_inr: 250000.00, status: "FROZEN_PRESERVED", branch: "Fort Mumbai (0041)" }
      ]
    },
    step4: {
      actions: [
        { title: "Revoke Employee Active Directory & CBS System Privileges", description: "Suspended domain credentials and disabled role 'LOAN_OFFICER' in Finacle core.", system: "Active Directory / Finacle IAM", api_payload: { action: "REVOKE_USER", username: "usr_loan_off_104" } },
        { title: "Place Disbursal Batch on Immediate Administrative Lien", description: "Blocked payout queue LOAN-DISBURSE-QUEUE-12 prior to NEFT clearing.", system: "Core Banking Engine", api_payload: { action: "HOLD_DISBURSAL_BATCH", batch_id: "LOAN-DISBURSE-QUEUE-12" } },
        { title: "Dispatch Urgent Alert to Bank Internal Vigilance Committee", description: "Created high-priority forensic audit case with immutable event trail.", system: "Vigilance Case Management", api_payload: { action: "CREATE_AUDIT_TICKET", severity: "HIGH" } }
      ],
      containment_success_msg: "Insider credentials disabled. 12 fraudulent loan disbursals suspended prior to NEFT clearing."
    },
    step5: {
      affected_systems: "cbs-loan-origination (10.14.3.20), kyc-verification (10.14.3.55)",
      remedial_summary: "Employee suspended; disbursals paused; internal vigilance notified; accounts frozen."
    },
    step6: {
      block_hash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
      prev_hash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
      merkle_root: "0x00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff"
    },
    topology: [
      { id: "node-emp", label: "Branch Officer Workstation", type: "ATTACKER", ip: "10.88.14.12", geo: "Mumbai Fort Branch", status: "BLOCKED", protocol: "RDP/HTTPS", mitre_tag: "T1078", details: "Authorized branch terminal utilized during off-hours." },
      { id: "node-los", label: "Loan Origination System", type: "CORE_SYSTEM", ip: "10.14.3.20", geo: "Mumbai Core DC", status: "ISOLATED", protocol: "HTTPS", mitre_tag: "T1565", details: "Credit workflow portal managing KYC verifications." },
      { id: "node-cbsln", label: "Finacle CBS Disbursal", type: "TARGET", ip: "10.0.8.50", geo: "Mumbai Core DC", status: "FROZEN", protocol: "JSON RPC", mitre_tag: "T1565", details: "Core ledger holding outbound loan NEFT batch." }
    ],
    timeline: [
      { offset: "+00:00", time: "23:40:02 UTC", title: "Off-Hours Branch Officer Login", tactic: "Initial Access", source_ip: "10.88.14.12", description: "usr_loan_off_104 logged in outside standard branch operating hours.", severity: "HIGH", raw_ecs: { "@timestamp": "2026-09-02T23:40:02Z", "user.name": "usr_loan_off_104" } },
      { offset: "+00:05", time: "23:45:10 UTC", title: "Rapid KYC Override & Disbursal Request", tactic: "Privilege Abuse", source_ip: "10.88.14.12", description: "12 unverified loan applications manually approved in under 4 minutes.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T23:45:10Z", "bank.amount_inr": 2800000.0 } },
      { offset: "+00:06", time: "23:46:12 UTC", title: "VIGIL Autonomous Insider Intercept", tactic: "Defense Response", source_ip: "10.0.1.1", description: "Disbursal batch placed on hold; account access revoked.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T23:46:12Z", "event.action": "REVOKE_USER" } }
    ],
    copilot_prompts: [
      { question: "List all loan applications approved after 22:00 hours with KYC overrides", esql_query: `FROM logs-cbs-audit-default | WHERE event.action == "KYC_MANUAL_OVERRIDE" AND event.hour >= 22 | LIMIT 20`, explanation: "Surfaces potential insider fraud during unauthorized branch night hours." }
    ],
    indic: {
      hi: "चेतावनी: शाखा अधिकारी द्वारा नियमों का उल्लंघन कर देर रात लोन जारी करने का प्रयास पकड़ा गया। लोन वितरण तुरंत रोक दिया गया है।",
      mr: "सावधान: बँकेच्या कर्मचाऱ्याकडून अनधिकृत कर्ज वाटपाचा प्रयत्न शोधला गेला. वाटप तात्काळ थांबवण्यात आले आहे.",
      gu: "ચેતવણી: બ્રાન્ચ ઓફિસર દ્વારા અનધિકૃત લોન આપવાનો પ્રયાસ પકડાયો છે. લોન ચૂકવણી રોકી દેવામાં આવી છે.",
      ta: "எச்சரிக்கை: வங்கி ஊழியரின் அங்கீகரிக்கப்படாத கடன் முயற்சி கண்டுபிடிக்கப்பட்டு தடுக்கப்பட்டது.",
      te: "హెచ్చరిక: బ్యాంకు ఉద్యోగి చేసిన అనధికారిక రుణ పంపిణీ ప్రయత్నం అడ్డుకోబడింది.",
      bn: "সতর্কতা: শাখা কর্মকর্তার অননুমোদিত ঋণ বিতরণ প্রচেষ্টা আটকানো হয়েছে।",
      kn: "ಎಚ್ಚರಿಕೆ: ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿಯ ಅನಧಿಕೃತ ಸಾಲ ವಿತರಣೆ ಪ್ರಯತ್ನವನ್ನು ತಡೆಯಲಾಗಿದೆ.",
      ml: "മുന്നറിയിപ്പ്: ബാങ്ക് ജീവനക്കാരന്റെ അനധികൃത വായ്പ വിതരണ ശ്രമം തടഞ്ഞു.",
      pa: "ਚੇਤਾਵਨੀ: ਬੈਂਕ ਅਧਿਕਾਰੀ ਵੱਲੋਂ ਅਣਅਧਿਕਾਰਤ ਲੋਨ ਵੰਡਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਰੋਕ ਦਿੱਤੀ ਗਈ ਹੈ।",
      od: "ଚେତାବନୀ: ବ୍ୟାଙ୍କ କର୍ମଚାରୀଙ୍କ ଅନଧିକୃତ ଋଣ ବଣ୍ଟନ ଉଦ୍ୟମକୁ ରୋକାଯାଇଛି।"
    }
  },
  {
    incident_id: "INC-2026-0902-05",
    title: "Scheduled Month-End Core Banking Interest Batch Calculation",
    severity: "LOW",
    threat_tactic: "Routine Maintenance",
    mitre_id: "N/A",
    direct_exposure_inr: 0.0,
    is_material: false,
    rbi_status: "BENIGN_FP_SUPPRESSED",
    current_step: 6,
    compromised_user: "system_batch_scheduler",
    attacker_ip: "10.14.0.50",
    attacker_ips: [
      "10.14.0.50 (CBS Batch Scheduler - Whitelisted Batch Daemon)"
    ],
    target_assets: [
      "10.14.0.100 (cbs-database-cluster.bank.internal)"
    ],
    compromised_credentials: "svc_cbs_cron (Pre-Authorized System Cron Service)",
    payload_hash: "SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    payment_channel: "Internal Core Batch Scheduler (Routine Maintenance)",
    batch_id: "MONTHLY-INTEREST-CALC-2026",
    impact_summary: "Scheduled monthly batch rebalancing executed at 02:00 AM. High ledger volume accurately correlated with maintenance calendar; false alarm suppressed automatically by Vigil.",
    affected_systems: ["cbs-database-cluster.bank.internal"],
    step1: {
      rbi_ref: "RBI Information Security Guidelines (Routine Operations Exemption)",
      certin_category: "CIAD-2022-00 Routine Scheduled Operation / False Positive Triage",
      threshold_desc: "Zero financial risk. Pre-approved operational change ticket (CHG-88210).",
      clock_status: "Suppressed (No Regulatory Filing Required)",
      penalty_at_stake: "₹ 0 (Benign Operation)",
      reasoning_bullet: "Volume spike matched maintenance calendar; automated false positive suppression."
    },
    step2: {
      autonomous_detection_title: "ES|QL Query: Change Ticket & Batch Scheduler Correlation",
      autonomous_detection_query: `FROM logs-cbs-audit-default
| WHERE user.name == "system_batch_scheduler" AND bank.batch_id == "MONTHLY-INTEREST-CALC-2026"
| STATS count() as records_processed by bank.change_ticket_id`,
      autonomous_detection_explanation: "Verified 100% match with approved Change Request CR-88210 in ServiceNow.",
      forensic_blast_radius_title: "ES|QL Query: Ledger Balance Rebalancing Verification",
      forensic_blast_radius_query: `FROM logs-banking-default
| WHERE bank.batch_id == "MONTHLY-INTEREST-CALC-2026"
| STATS sum(bank.credit_amount) - sum(bank.debit_amount) as net_diff`,
      discovered_entity: "system_batch_scheduler (Authorized Cron)",
      compromised_id: "None (Authorized System Routine)",
      sample_table: {
        columns: ["@timestamp", "batch.name", "change.ticket", "status", "delta.inr"],
        rows: [
          ["2026-09-02T02:00:00Z", "MONTHLY-INTEREST-CALC", "CHG-88210", "APPROVED", "0.00"],
          ["2026-09-02T02:05:00Z", "MONTHLY-INTEREST-CALC", "CHG-88210", "COMPLETED", "0.00"]
        ]
      }
    },
    step3: {
      corporate_count: 5000,
      hni_count: 15000,
      affected_accounts_total: 50000,
      account_examples: "50,000 Standard Savings Bank Accounts (Routine Interest Accrual)",
      business_risk_level: "ZERO RISK (BENIGN NOISE SUPPRESSED)",
      penalty_saved: "Analyst Fatigue Prevented (2.5 Hours SOC Time Saved)",
      core_systems_affected: "Finacle Batch Engine (Operating within normal scheduled envelope)",
      accounts_table: [
        { account_id: "ACC-0019284", name: "Standard Savings Account Pool", tier: "Retail", balance_inr: 500000000.00, exposed_inr: 0.00, status: "NORMAL", branch: "All Branches" }
      ]
    },
    step4: {
      actions: [
        { title: "Auto-Suppress Alert Zero Alarm", description: "Vigil marked alert as benign false positive after validating digital signature of change ticket.", system: "Vigil Rule Engine", api_payload: { action: "SUPPRESS_ALERT", reason: "CHANGE_APPROVED" } },
        { title: "Record Telemetry in Routine Health Ledger", description: "Appended routine health metric to Elastic observability index.", system: "Elastic Observability", api_payload: { action: "RECORD_METRIC", status: "HEALTHY" } }
      ],
      containment_success_msg: "False alarm suppressed automatically. Zero analyst intervention required."
    },
    step5: {
      affected_systems: "cbs-database-cluster (10.14.0.100)",
      remedial_summary: "No remediation needed. Scheduled batch executed successfully."
    },
    step6: {
      block_hash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      prev_hash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
      merkle_root: "0x3344556677889900aabbccddeeff00112233445566778899aabbccddeeff0011"
    },
    topology: [
      { id: "node-cron", label: "Core Batch Scheduler", type: "BENIGN_DAEMON", ip: "10.14.0.50", geo: "Mumbai Core DC", status: "BENIGN", protocol: "Internal RPC", mitre_tag: "N/A", details: "Pre-scheduled internal cron process calculating savings account interest." },
      { id: "node-db", label: "Finacle Database Cluster", type: "CORE_SYSTEM", ip: "10.14.0.100", geo: "Mumbai Core DC", status: "ACTIVE", protocol: "SQL/Oracle RAC", mitre_tag: "N/A", details: "Core database processing monthly batch ledger updates." }
    ],
    timeline: [
      { offset: "+00:00", time: "02:00:00 UTC", title: "Batch Interest Job Started", tactic: "Scheduled Job", source_ip: "10.14.0.50", description: "Service scheduler started month-end interest crediting per schedule.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T02:00:00Z", "job.name": "MONTHLY_INTEREST" } },
      { offset: "+00:05", time: "02:05:00 UTC", title: "VIGIL Auto-Suppression Gate", tactic: "Autonomous Triage", source_ip: "10.0.1.1", description: "Vigil correlated with change ticket and suppressed Alert Zero trigger.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T02:05:00Z", "event.action": "SUPPRESS_ALERT" } }
    ],
    copilot_prompts: [
      { question: "Verify change management approval status for current running batch", esql_query: `FROM logs-cbs-audit-default | WHERE bank.batch_id == "MONTHLY-INTEREST-CALC-2026" | STATS count() by bank.change_ticket_id`, explanation: "Confirms that the volume spike corresponds to an authorized change window." }
    ],
    indic: {
      hi: "सूचना: महीने के अंत में ब्याज गणना का नियमित कार्य सफलतापूर्वक पूरा हुआ। सतर्कता एआई द्वारा झूठी चेतावनी को स्वतः निरस्त कर दिया गया है।",
      mr: "माहिती: महिन्याच्या अखेरचे व्याज जमा करण्याचे नियमित काम पूर्ण झाले. सतर्कता एआयने खोटा अलार्म रद्द केला.",
      gu: "માહિતી: મહિનાના અંતે વ્યાજ ગણતરીનું નિયમિત કામ પૂર્ણ થયું. વિજિલ એઆઈએ ખોટી ચેતવણી રદ કરી.",
      ta: "தகவல்: மாதாந்திர வட்டி கணக்கீட்டு பணி வெற்றிகரமாக முடிந்தது. விஜி ஏஐ தவறான எச்சரிக்கையை தள்ளுபடி செய்தது.",
      te: "సమాచారం: నెలవారీ వడ్డీ గణన విజయవంతంగా పూర్తయింది. విగిల్ ఏఐ తప్పుడు హెచ్చరికను తొలగించింది.",
      bn: "তথ্য: মাস শেষের সুদ গণনার নিয়মিত কাজ সম্পন্ন হয়েছে। ভিজিল এআই ভুল অ্যালার্ম বাতিল করেছে।",
      kn: "ಮಾಹಿತಿ: ತಿಂಗಳ ಕೊನೆಯ ಬಡ್ಡಿ ಲೆಕ್ಕಾಚಾರ ಯಶಸ್ವಿಯಾಗಿ ಮುಗಿದಿದೆ. ವಿಜಿಲ್ ಎಐ ಸುಳ್ಳು ಎಚ್ಚರಿಕೆಯನ್ನು ರದ್ದುಗೊಳಿಸಿದೆ.",
      ml: "വിവരം: മാസാവസാന പലിശ കണക്കുകൂട്ടൽ പൂർത്തിയായി. തെറ്റായ അലാറം വിഗിൽ എഐ ഒഴിവാക്കി.",
      pa: "ਜਾਣਕਾਰੀ: ਮਹੀਨੇ ਦੇ ਅੰਤ ਦਾ ਵਿਆਜ ਗਿਣਨ ਦਾ ਕੰਮ ਪੂਰਾ ਹੋ ਗਿਆ। ਝੂਠਾ ਅਲਾਰਮ ਰੱਦ ਕੀਤਾ ਗਿਆ।",
      od: "ସୂଚନା: ମାସିକ ସୁଧ ଗଣନା ସଫଳତାର ସହ ଶେଷ ହୋଇଛି। ଭିଜିଲ ଏଆଇ ନକଲି ଆଲାର୍ମକୁ ବାତିଲ କରିଛି।"
    }
  },
  {
    incident_id: "INC-2026-0902-06",
    title: "SWIFT MT103 Cross-Border Wire Interception & Sanction Bypass",
    severity: "CRITICAL",
    threat_tactic: "Data Manipulation / Financial Exfiltration",
    mitre_id: "T1565.001",
    direct_exposure_inr: 142000000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 6,
    compromised_user: "swift_operator_lvl3",
    attacker_ip: "185.220.101.99",
    attacker_ips: [
      "185.220.101.99 (Adversary C2 Server - Frankfurt, DE)",
      "194.26.29.50 (Proxy Node - Sofia, BG)",
      "10.14.99.14 (Compromised SWIFT Terminal 02)"
    ],
    target_assets: [
      "10.14.99.1 (swift-alliance-gateway.bank.internal)",
      "10.14.99.20 (aml-screening.bank.internal)"
    ],
    compromised_credentials: "swift_operator_lvl3 (SWIFT MT103 Key Exchange Token)",
    payload_hash: "SHA256: 91ab23cd45ef67890123456789abcdef0123456789abcdef0123456789abcdef",
    payment_channel: "SWIFT International Wire Transfer (MT103/MT202)",
    batch_id: "SWIFT-OUT-20260902-004",
    impact_summary: "Adversary intercepted outbound SWIFT MT103 wire messages, altering beneficiary IBAN and correspondent BIC to route funds to an offshore sanctioned entity while bypassing real-time sanction checks.",
    affected_systems: ["swift-alliance-gateway.bank.internal", "aml-screening.bank.internal"],
    step1: {
      rbi_ref: "RBI Master Direction on SWIFT Operating Controls & Cross-Border Messaging",
      certin_category: "CIAD-2022-01 Compromise of Critical SWIFT Inter-Bank Wire Infrastructure",
      threshold_desc: "High-value cross-border wire tampering exceeding ₹14.20 Crore exposure.",
      clock_status: "6-Hour Statutory SLA Active (Filing Completed in 3.9 mins)",
      penalty_at_stake: "₹ 2,00,00,000 + SWIFT Network Sanctions",
      reasoning_bullet: "Altered SWIFT MT103 message checksum with modified beneficiary routing code."
    },
    step2: {
      autonomous_detection_title: "ES|QL Query: SWIFT Checksum Mismatch & Sanction Bypass Detection",
      autonomous_detection_query: `FROM logs-swift-default
| WHERE swift.message_type == "MT103" AND swift.validation_status == "CHECKSUM_FAILED"
| STATS sum(swift.amount_inr) as wire_exposure by swift.beneficiary_bic, swift.sender_bic`,
      autonomous_detection_explanation: "Detected forged SWIFT MT103 payload where message hash did not match HSM signature.",
      forensic_blast_radius_title: "ES|QL Query: Sanctioned Correspondent Bank Analysis",
      forensic_blast_radius_query: `FROM logs-swift-default
| WHERE swift.aml_sanction_match == true
| STATS count() by swift.beneficiary_iban, swift.sanction_list_id`,
      discovered_entity: "185.220.101.99 (Offshore C2)",
      compromised_id: "SWIFT Alliance Gateway Operator Key",
      sample_table: {
        columns: ["@timestamp", "swift.msg_id", "beneficiary.iban", "amount.inr", "sanction.flag"],
        rows: [
          ["2026-09-02T19:15:22Z", "MT103-990182", "DE89370400440532013000", "7,10,00,000.00", "TRUE (OFAC-MATCH)"],
          ["2026-09-02T19:16:04Z", "MT103-990183", "CH93007620116238529577", "7,10,00,000.00", "TRUE (OFAC-MATCH)"]
        ]
      }
    },
    step3: {
      corporate_count: 3,
      hni_count: 0,
      affected_accounts_total: 3,
      account_examples: "3 High-Value Cross-Border Corporate Treasury Accounts",
      business_risk_level: "CRITICAL INTERNATIONAL SANCTION & FINANCIAL LOSS RISK",
      penalty_saved: "₹ 2,00,00,000 Saved via Timely Containment",
      core_systems_affected: "SWIFT Alliance Gateway, Real-Time Sanction Screening Engine (OFAC/RBI), Treasury Settlement",
      accounts_table: [
        { account_id: "ACC-9901823", name: "Apex International Trade Treasury", tier: "Corporate", balance_inr: 450000000.00, exposed_inr: 71000000.00, status: "FROZEN_PRESERVED", branch: "International Banking Mumbai (0090)" },
        { account_id: "ACC-9901824", name: "Global Petroleum Imports Escrow", tier: "Corporate", balance_inr: 320000000.00, exposed_inr: 71000000.00, status: "FROZEN_PRESERVED", branch: "International Banking Mumbai (0090)" }
      ]
    },
    step4: {
      actions: [
        { title: "Broadcast SWIFT Stop-Payment Recall (MT192)", description: "Dispatched immediate automated wire recall to correspondent banks in Frankfurt and Zurich.", system: "SWIFT Alliance Access", api_payload: { action: "SEND_MT192_RECALL", msg_ids: ["MT103-990182", "MT103-990183"] } },
        { title: "Revoke SWIFT Operator Level-3 Cryptographic Credentials", description: "Terminated smart-card session for swift_operator_lvl3 and forced physical token rotation.", system: "SWIFT Security Officer HSM", api_payload: { action: "REVOKE_SWIFT_KEY", user: "swift_operator_lvl3" } },
        { title: "Quarantine SWIFT Terminal 02 to Out-of-Band VLAN", description: "Severed physical LAN link for terminal 10.14.99.14 to prevent lateral pivot.", system: "Edge NAC", api_payload: { action: "QUARANTINE_HOST", ip: "10.14.99.14" } }
      ],
      containment_success_msg: "SWIFT wire messages recalled in-flight. Terminal quarantined. Zero foreign exchange loss."
    },
    step5: {
      affected_systems: "swift-alliance-gateway (10.14.99.1), aml-screening (10.14.99.20)",
      remedial_summary: "SWIFT MT192 recall issued; operator tokens revoked; terminal quarantined; funds preserved."
    },
    step6: {
      block_hash: "0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      prev_hash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      merkle_root: "0x44556677889900aabbccddeeff00112233445566778899aabbccddeeff001122"
    },
    topology: [
      { id: "node-c2sw", label: "Offshore Threat C2", type: "ATTACKER", ip: "185.220.101.99", geo: "Frankfurt, DE", status: "BLOCKED", protocol: "TLS 1.3", mitre_tag: "T1565.001", details: "Adversary infrastructure intercepting wire payloads." },
      { id: "node-term", label: "SWIFT Terminal 02", type: "GATEWAY", ip: "10.14.99.14", geo: "Mumbai Treasury DC", status: "ISOLATED", protocol: "SWIFT CBT", mitre_tag: "T1078", details: "Operator terminal with manipulated memory hook." },
      { id: "node-swgw", label: "SWIFT Alliance Access", type: "CORE_SYSTEM", ip: "10.14.99.1", geo: "Mumbai Core DC", status: "ACTIVE", protocol: "SWIFTNet", mitre_tag: "T1565.001", details: "Primary gateway communicating with SWIFT global network." }
    ],
    timeline: [
      { offset: "+00:00", time: "19:14:00 UTC", title: "SWIFT Terminal Memory Inversion", tactic: "Defense Evasion", source_ip: "10.14.99.14", description: "DLL side-loading detected on SWIFT Alliance client workstation.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:14:00Z", "process.name": "swift_client.exe" } },
      { offset: "+00:01", time: "19:15:22 UTC", title: "Tampered MT103 Wire Injected", tactic: "Financial Exfiltration", source_ip: "185.220.101.99", description: "Outbound wire for ₹ 14.20 Crore directed to sanctioned foreign beneficiary.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:15:22Z", "swift.amount_inr": 142000000.0 } },
      { offset: "+00:02", time: "19:16:30 UTC", title: "VIGIL Autonomous SWIFT Recall", tactic: "Defense Response", source_ip: "10.0.1.1", description: "VIGIL dispatched MT192 stop-payment recall and locked terminal.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:16:30Z", "event.action": "SEND_MT192" } }
    ],
    copilot_prompts: [
      { question: "List all SWIFT MT103 messages where beneficiary BIC is under sanction scrutiny", esql_query: `FROM logs-swift-default | WHERE swift.sanction_match == true | STATS count(), sum(swift.amount_inr) by swift.beneficiary_bic`, explanation: "Surfaces attempted wire transfers directed to high-risk foreign entities." }
    ],
    indic: {
      hi: "चेतावनी: स्विफ्ट अंतरराष्ट्रीय मनी ट्रांसफर में धोखाधड़ी (₹ 14.20 करोड़) पकड़ी गई। रिकॉल मैसेज भेजकर विदेशी ट्रांसफर रोक दिया गया है।",
      mr: "सावधान: स्विफ्ट आंतरराष्ट्रीय व्यवहारात छेडछाड (₹ 14.20 कोटी) शोधली गेली. पैसे पाठवणे तात्काळ थांबवले आहे.",
      gu: "ચેતવણી: સ્વિફ્ટ આંતરરાષ્ટ્રીય વાયર ટ્રાન્સફરમાં ચેડાં (₹ 14.20 કરોડ) પકડાયા છે. પેમેન્ટ તાત્કાલિક રોકી દેવામાં આવ્યું છે.",
      ta: "எச்சரிக்கை: ஸ்விஃப்ட் சர்வதேச பணப்பரிவர்த்தனை மோசடி தடுக்கப்பட்டது.",
      te: "హెచ్చరిక: స్విఫ్ట్ అంతర్జాతీయ వైర్ బదిలీ మోసం అడ్డుకోబడింది.",
      bn: "সতর্কতা: সুইফ্ট আন্তর্জাতিক ওয়্যার ট্রান্সফার জালিয়াতি আটকানো হয়েছে।",
      kn: "ಎಚ್ಚರಿಕೆ: ಸ್ವಿಫ್ಟ್ ಅಂತರರಾಷ್ಟ್ರೀಯ ಹಣ ವರ್ಗಾವಣೆ ವಂಚನೆಯನ್ನು ತಡೆಯಲಾಗಿದೆ.",
      ml: "മുന്നറിയിപ്പ്: സ്വിഫ്റ്റ് അന്താരാഷ്ട്ര പണമിടപാട് തട്ടിപ്പ് തടഞ്ഞു.",
      pa: "ਚੇਤਾਵਨੀ: ਸਵਿਫਟ ਅੰਤਰਰਾਸ਼ਟਰੀ ਵਾਇਰ ਟ੍ਰਾਂਸਫਰ ਧੋਖਾਧੜੀ ਰੋਕ ਦਿੱਤੀ ਗਈ।",
      od: "ଚେତାବନୀ: ସୁଇଫ୍ଟ ଆନ୍ତର୍ଜାତୀୟ ଟ୍ରାନ୍ସଫର ଠକେଇକୁ ରୋକାଯାଇଛି।"
    }
  },
  {
    incident_id: "INC-2026-0902-07",
    title: "Cloud Storage IAM Leakage & Bulk Customer Statement Scraping",
    severity: "HIGH",
    threat_tactic: "Exfiltration / Cloud Storage Scraping",
    mitre_id: "T1530",
    direct_exposure_inr: 7850000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 6,
    compromised_user: "iam_service_account_backup",
    attacker_ip: "198.51.100.199",
    attacker_ips: [
      "198.51.100.199 (Scraper VM - Virginia, US)",
      "104.244.76.13 (Scraper Proxy Pool - London, UK)"
    ],
    target_assets: [
      "s3://apex-prod-customer-statements-ap-south-1 (AWS S3 Bucket)",
      "10.14.5.12 (iam-key-vault.bank.internal)"
    ],
    compromised_credentials: "AKIAIOSFODNN7EXAMPLE (Leaked AWS IAM Access Key ID)",
    payload_hash: "SHA256: 55a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4",
    payment_channel: "Cloud Core Storage & Customer Statement Vault",
    batch_id: "S3-SCRAPE-JOB-7712",
    impact_summary: "Leaked AWS S3 bucket IAM credentials used to scrape 25,000 PDF account statements containing PII and financial balances.",
    affected_systems: ["s3://apex-prod-customer-statements-ap-south-1", "iam-key-vault.bank.internal"],
    step1: {
      rbi_ref: "Digital Personal Data Protection (DPDP) Act 2023 & RBI IT Governance Directions",
      certin_category: "CIAD-2022-11 Data Breach / Unauthorized Exfiltration of Customer PII",
      threshold_desc: "Mass scraping of customer financial statements triggering mandatory 6-hour CERT-In breach filing.",
      clock_status: "6-Hour Statutory SLA Active (Filing Completed in 4.0 mins)",
      penalty_at_stake: "₹ 50,00,000 to ₹ 250 Crore under DPDP Act",
      reasoning_bullet: "High velocity S3 GetObject burst consuming sensitive bank statement objects."
    },
    step2: {
      autonomous_detection_title: "ES|QL Query: CloudTrail S3 GetObject Burst Anomaly",
      autonomous_detection_query: `FROM logs-aws-cloudtrail-default
| WHERE event.action == "s3:GetObject" AND user.name == "iam_service_account_backup"
| STATS count() as statement_count by source.ip, aws.s3.bucket_name
| WHERE statement_count > 1000`,
      autonomous_detection_explanation: "Detected high-speed download of 25,000 customer PDF files from unauthorized US IP address.",
      forensic_blast_radius_title: "ES|QL Query: Customer PII Impact Assessment",
      forensic_blast_radius_query: `FROM logs-aws-cloudtrail-default
| WHERE aws.s3.bucket_name == "apex-prod-customer-statements"
| STATS count_distinct(aws.s3.object_key) by source.ip`,
      discovered_entity: "198.51.100.199 (Scraper Server)",
      compromised_id: "AKIAIOSFODNN7EXAMPLE (AWS Access Key)",
      sample_table: {
        columns: ["@timestamp", "source.ip", "s3.bucket", "objects.scraped", "user_agent"],
        rows: [
          ["2026-09-02T19:35:01Z", "198.51.100.199", "apex-prod-customer-statements", "25,000 PDFs", "aws-sdk-go/v1.38.0"],
          ["2026-09-02T19:34:40Z", "104.244.76.13", "apex-prod-customer-statements", "450 PDFs", "aws-sdk-go/v1.38.0"]
        ]
      }
    },
    step3: {
      corporate_count: 500,
      hni_count: 24500,
      affected_accounts_total: 25000,
      account_examples: "25,000 Customer Account Statements & PAN/Aadhaar Metadata",
      business_risk_level: "HIGH DATA PRIVACY & REGULATORY BREACH RISK",
      penalty_saved: "₹ 50,00,000 Statutory Mitigation Saved",
      core_systems_affected: "AWS S3 Cloud Infrastructure (ap-south-1 Mumbai), Customer Document Vault",
      accounts_table: [
        { account_id: "ACC-1002941", name: "Sunil Mittal Trust Account", tier: "HNI", balance_inr: 8500000.00, exposed_inr: 850000.00, status: "FROZEN_PRESERVED", branch: "New Delhi Main (0010)" }
      ]
    },
    step4: {
      actions: [
        { title: "Revoke Leaked AWS IAM Access Key (AKIAIOSFODNN7EXAMPLE)", description: "Executed AWS IAM API call to delete compromised access key and detach admin policy.", system: "AWS IAM / KMS", api_payload: { action: "DELETE_ACCESS_KEY", key_id: "AKIAIOSFODNN7EXAMPLE" } },
        { title: "Attach Strict IP-Restricted Bucket Policy to Customer S3 Vault", description: "Enforced bucket policy restricting GetObject access solely to internal bank VPC endpoints.", system: "AWS S3 Policy Engine", api_payload: { action: "APPLY_VPC_ENDPOINT_ONLY_POLICY" } },
        { title: "Trigger Automated DPDP Breach Notification Workflow", description: "Compiled customer impact register and generated statutory Data Protection Board draft.", system: "Compliance Engine", api_payload: { action: "DRAFT_DPDP_NOTICE", records: 25000 } }
      ],
      containment_success_msg: "Leaked IAM key revoked. S3 bucket restricted to private VPC. DPDP compliance notification ready."
    },
    step5: {
      affected_systems: "s3://apex-prod-customer-statements (AWS ap-south-1)",
      remedial_summary: "IAM credentials deleted; S3 bucket policy tightened; data exfiltration severed."
    },
    step6: {
      block_hash: "0xb1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
      prev_hash: "0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      merkle_root: "0x556677889900aabbccddeeff00112233445566778899aabbccddeeff00112233"
    },
    topology: [
      { id: "node-c2s3", label: "Scraper VM (Virginia)", type: "ATTACKER", ip: "198.51.100.199", geo: "Virginia, US", status: "BLOCKED", protocol: "HTTPS/AWS API", mitre_tag: "T1530", details: "Automated scraping bot utilizing leaked IAM credentials." },
      { id: "node-s3", label: "AWS S3 Customer Vault", type: "TARGET", ip: "s3.ap-south-1.amazonaws.com", geo: "AWS Mumbai (ap-south-1)", status: "ISOLATED", protocol: "HTTPS/S3 API", mitre_tag: "T1530", details: "Object storage bucket holding 25,000 customer PDF bank statements." }
    ],
    timeline: [
      { offset: "+00:00", time: "19:32:10 UTC", title: "Leaked IAM Key Used from Foreign IP", tactic: "Initial Access", source_ip: "198.51.100.199", description: "GetCallerIdentity invoked with leaked backup access key from AWS US-East region.", severity: "HIGH", raw_ecs: { "@timestamp": "2026-09-02T19:32:10Z", "event.action": "GetCallerIdentity" } },
      { offset: "+00:03", time: "19:35:01 UTC", title: "Bulk S3 GetObject Burst Triggered", tactic: "Exfiltration", source_ip: "198.51.100.199", description: "25,000 PDF account statements downloaded.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:35:01Z", "event.action": "s3:GetObject" } },
      { offset: "+00:04", time: "19:36:12 UTC", title: "VIGIL Autonomous Key Revocation", tactic: "Defense Response", source_ip: "10.0.1.1", description: "VIGIL deleted IAM key and enforced strict VPC bucket policy.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:36:12Z", "event.action": "DELETE_KEY" } }
    ],
    copilot_prompts: [
      { question: "Find all AWS CloudTrail calls from non-Indian IPs accessing S3 buckets", esql_query: `FROM logs-aws-cloudtrail-default | WHERE event.source == "s3.amazonaws.com" AND NOT source.geo.country_name == "India" | LIMIT 50`, explanation: "Identifies unauthorized cross-border access to bank cloud storage." }
    ],
    indic: {
      hi: "चेतावनी: क्लाउड स्टोरेज से ग्राहकों के बैंक स्टेटमेंट डाउनलोड करने का अनधिकृत प्रयास पकड़ा गया। एक्सेस की तुरंत रद्द कर दी गई है।",
      mr: "सावधान: क्लाउड स्टोरेजमधून बँक स्टेटमेंट डाउनलोड करण्याचा अनधिकृत प्रयत्न शोधला गेला. ॲक्सेस की तात्काळ रद्द केली आहे.",
      gu: "ચેતવણી: ક્લાઉડ સ્ટોરેજમાંથી બેંક સ્ટેટમેન્ટ ડાઉનલોડ કરવાનો અનધિકૃત પ્રયાસ પકડાયો છે. એક્સેસ કી રદ કરવામાં આવી છે.",
      ta: "எச்சரிக்கை: கிளவுட் சேமிப்பகத்திலிருந்து வங்கி அறிக்கைகளை பதிவிறக்கும் முயற்சி தடுக்கப்பட்டது.",
      te: "హెచ్చరిక: క్లౌడ్ స్టోరేజ్ నుండి బ్యాంక్ స్టేట్‌మెంట్‌లను డౌన్‌లోడ్ చేసే ప్రయత్నం అడ్డుకోబడింది.",
      bn: "সতর্কতা: ক্লাউড স্টোরেজ থেকে ব্যাঙ্ক স্টেটমেন্ট ডাউনলোড করার প্রচেষ্টা আটকানো হয়েছে।",
      kn: "ಎಚ್ಚರಿಕೆ: ಕ್ಲೌಡ್ ಸಂಗ್ರಹಣೆಯಿಂದ ಬ್ಯಾಂಕ್ ಸ್ಟೇಟ್‌ಮೆಂಟ್‌ಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡುವ ಪ್ರಯತ್ನವನ್ನು ತಡೆಯಲಾಗಿದೆ.",
      ml: "മുന്നറിയിപ്പ്: ക്ലൗഡ് സ്റ്റോറേജിൽ നിന്ന് ബാങ്ക് സ്റ്റേറ്റ്‌മെന്റുകൾ ഡൗൺലോഡ് ചെയ്യാനുള്ള ശ്രമം തടഞ്ഞു.",
      pa: "ਚੇਤਾਵਨੀ: ਕਲਾਉਡ ਸਟੋਰੇਜ ਤੋਂ ਬੈਂਕ ਸਟੇਟਮੈਂਟਾਂ ਡਾਊਨਲੋਡ ਕਰਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਰੋਕ ਦਿੱਤੀ ਗਈ ਹੈ।",
      od: "ଚେତାବନୀ: କ୍ଲାଉଡ ଷ୍ଟୋରେଜରୁ ବ୍ୟାଙ୍କ ଷ୍ଟେଟମେଣ୍ଟ ଡାଉନଲୋଡ଼ ଉଦ୍ୟମକୁ ରୋକାଯାଇଛି।"
    }
  },
  {
    incident_id: "INC-2026-0902-08",
    title: "Synthetic Identity Injection & Mule Merchant Onboarding Ring",
    severity: "HIGH",
    threat_tactic: "Identity Spoofing / Financial Fraud",
    mitre_id: "T1586",
    direct_exposure_inr: 4600000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 6,
    compromised_user: "api_merchant_onboarding",
    attacker_ip: "203.0.113.88",
    attacker_ips: [
      "203.0.113.88 (Fraud Ring Controller - Kolkata, IN)",
      "103.21.244.15 (VPN Egress Pool - Delhi, IN)"
    ],
    target_assets: [
      "10.14.4.15 (merchant-onboarding.bank.co.in)",
      "10.14.4.80 (gstin-validation.bank.internal)"
    ],
    compromised_credentials: "25 Synthetic Merchant Identities & Fabricated GSTINs",
    payload_hash: "SHA256: 1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    payment_channel: "UPI Merchant Aggregator & Settlement Engine",
    batch_id: "MULE-QR-RING-5510",
    impact_summary: "Organized cybercrime ring registered 25 fictitious merchant QR accounts using fabricated GSTINs and forged Aadhaar/PAN cards to funnel and wash stolen funds.",
    affected_systems: ["merchant-onboarding.bank.co.in", "gstin-validation.bank.internal"],
    step1: {
      rbi_ref: "RBI Guidelines on Digital Payment Aggregators & Merchant Due Diligence",
      certin_category: "CIAD-2022-15 Synthetic Identity Theft & Mule Merchant Laundering Network",
      threshold_desc: "Coordinated syndicate registering fraudulent merchant QR settlement accounts totaling ₹ 46.0 Lakhs.",
      clock_status: "6-Hour Statutory SLA Active (Filing Completed in 4.4 mins)",
      penalty_at_stake: "₹ 40,00,000 + Merchant Aggregator License Suspension",
      reasoning_bullet: "Multiple merchant registrations sharing identical bank accounts and device fingerprints."
    },
    step2: {
      autonomous_detection_title: "ES|QL Query: Merchant Identity Clustering & Synthetic Entity Graph",
      autonomous_detection_query: `FROM logs-merchant-onboarding-default
| STATS count() as registrations, count_distinct(merchant.gstin) as gstin_count by device.fingerprint_hash, bank.settlement_account_id
| WHERE registrations > 5`,
      autonomous_detection_explanation: "Clustered 25 distinct merchant entities mapped to the exact same device fingerprint and settlement account.",
      forensic_blast_radius_title: "ES|QL Query: QR Inflow & Velocity Funneling Tracking",
      forensic_blast_radius_query: `FROM logs-banking-default
| WHERE bank.channel == "UPI_QR" AND bank.batch_id == "MULE-QR-RING-5510"
| STATS sum(bank.amount_inr) as total_laundered by bank.merchant_vpa`,
      discovered_entity: "203.0.113.88 (Fraud Ring Admin)",
      compromised_id: "25 Fabricated Merchant GSTIN Profiles",
      sample_table: {
        columns: ["@timestamp", "merchant.name", "gstin.status", "settlement.account", "amount.inr"],
        rows: [
          ["2026-09-02T20:10:14Z", "Royal Fast Traders", "SYNTHETIC (INVALID)", "ACC-8812001", "1,85,000.00"],
          ["2026-09-02T20:11:02Z", "Shree Ganesh Enterprise", "SYNTHETIC (INVALID)", "ACC-8812001", "1,95,000.00"],
          ["2026-09-02T20:12:45Z", "Metro Mobile Hub", "SYNTHETIC (INVALID)", "ACC-8812001", "1,80,000.00"]
        ]
      }
    },
    step3: {
      corporate_count: 25,
      hni_count: 0,
      affected_accounts_total: 25,
      account_examples: "25 Fictitious Sole Proprietorship QR Settlement Accounts",
      business_risk_level: "HIGH AML / TERROR FINANCING & MULE NETWORK RISK",
      penalty_saved: "₹ 40,00,000 Saved via Timely Containment",
      core_systems_affected: "Merchant Onboarding API, GSTIN Live Verification Gateway, UPI QR Switch",
      accounts_table: [
        { account_id: "ACC-8812001", name: "Royal Fast Traders (Mule Master)", tier: "Corporate", balance_inr: 4600000.00, exposed_inr: 4600000.00, status: "FROZEN_PRESERVED", branch: "Salt Lake Kolkata (0088)" }
      ]
    },
    step4: {
      actions: [
        { title: "Immediate Suspension of 25 Fraudulent Merchant VPA Accounts", description: "Deboarded merchant IDs and disabled QR settlement across NPCI UPI switch.", system: "Merchant Management System", api_payload: { action: "DEBOARD_MERCHANT_RING", count: 25 } },
        { title: "Place Settlement Account (ACC-8812001) on Total Freeze", description: "Enforced debit and credit freeze on central laundering master account.", system: "Finacle CBS", api_payload: { action: "TOTAL_FREEZE", account: "ACC-8812001" } },
        { title: "Submit Suspicious Transaction Report (STR) to FIU-IND", description: "Generated official XML STR package for Financial Intelligence Unit - India.", system: "AML / FIU Reporting Gateway", api_payload: { action: "SUBMIT_STR", category: "SYNTHETIC_IDENTITY" } }
      ],
      containment_success_msg: "Merchant ring deboarded. Settlement accounts frozen. STR filed with FIU-IND."
    },
    step5: {
      affected_systems: "merchant-onboarding (10.14.4.15), gstin-validation (10.14.4.80)",
      remedial_summary: "25 merchant QR accounts deboarded; settlement account frozen; FIU-IND alerted."
    },
    step6: {
      block_hash: "0xc2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3",
      prev_hash: "0xb1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
      merkle_root: "0x6677889900aabbccddeeff00112233445566778899aabbccddeeff0011223344"
    },
    topology: [
      { id: "node-ring", label: "Mule Ring Operator", type: "ATTACKER", ip: "203.0.113.88", geo: "Kolkata, IN", status: "BLOCKED", protocol: "HTTPS", mitre_tag: "T1586", details: "Adversary generating synthetic identity merchant accounts." },
      { id: "node-mportal", label: "Merchant Onboarding API", type: "GATEWAY", ip: "10.14.4.15", geo: "Mumbai DC", status: "ISOLATED", protocol: "REST/TLS", mitre_tag: "T1078", details: "Public onboarding portal targeted with fake GSTIN payloads." },
      { id: "node-qr", label: "UPI QR Settlement Hub", type: "TARGET", ip: "10.14.4.80", geo: "Navi Mumbai DC", status: "FROZEN", protocol: "ISO 8583", mitre_tag: "T1586", details: "Clearing switch aggregating fraudulent QR disbursements." }
    ],
    timeline: [
      { offset: "+00:00", time: "20:08:12 UTC", title: "Burst Merchant Registration Ingested", tactic: "Initial Access", source_ip: "203.0.113.88", description: "25 merchant registrations submitted in 4 minutes using same device hash.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T20:08:12Z", "event.action": "MERCHANT_REGISTER" } },
      { offset: "+00:02", time: "20:10:14 UTC", title: "Synthetic GSTIN Mismatch Detected", tactic: "Defense Evasion", source_ip: "203.0.113.88", description: "Automated GSTIN check returned entity non-existence status.", severity: "HIGH", raw_ecs: { "@timestamp": "2026-09-02T20:10:14Z", "gstin.status": "INVALID" } },
      { offset: "+00:04", time: "20:12:45 UTC", title: "VIGIL Autonomous Deboarding", tactic: "Defense Response", source_ip: "10.0.1.1", description: "VIGIL deboarded all 25 merchant IDs and froze settlement account.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T20:12:45Z", "event.action": "DEBOARD_MERCHANT" } }
    ],
    copilot_prompts: [
      { question: "Identify all merchant onboarding requests sharing the same bank settlement account", esql_query: `FROM logs-merchant-onboarding-default | STATS count() as count by bank.settlement_account_id | WHERE count > 1 | SORT count DESC`, explanation: "Uncovers mule merchant syndicates sharing common bank payout destinations." }
    ],
    indic: {
      hi: "चेतावनी: नकली पहचान और जीएसटी नंबरों द्वारा 25 फर्जी मर्चेंट खाते खोलने का प्रयास पकड़ा गया। सभी खाते तुरंत ब्लॉक कर दिए गए हैं।",
      mr: "सावधान: बनावट कागदपत्रांच्या आधारे २५ बनावट व्यापारी खाती सुरू करण्याचा प्रयत्न शोधला गेला. सर्व खाती तात्काळ गोठवली आहेत.",
      gu: "ચેતવણી: બનાવટી દસ્તાવેજોથી ૨૫ નકલી મર્ચન્ટ ખાતાઓ બનાવવાનો પ્રયાસ પકડાયો છે. બધા ખાતાઓ બ્લોક કરી દેવાયા છે.",
      ta: "எச்சரிக்கை: போலி அடையாளங்களைப் பயன்படுத்தி 25 போலி வணிகர் கணக்குகள் உருவாக்கப்பட்டது தடுக்கப்பட்டது.",
      te: "హెచ్చరిక: నకిలీ పత్రాలతో 25 వ్యాపార ఖాతాలు తెరిచే ప్రయత్నం గుర్తించి నిరోధించబడింది.",
      bn: "সতর্কতা: জাল পরিচয় ব্যবহার করে ২৫টি ভুয়া মার্চেন্ট অ্যাকাউন্ট খোলার প্রচেষ্টা আটকানো হয়েছে।",
      kn: "ಎಚ್ಚರಿಕೆ: ನಕಲಿ ಗುರುತಿನ ಚೀಟಿ ಬಳಸಿ 25 ನಕಲಿ ವ್ಯಾಪಾರಿ ಖಾತೆಗಳನ್ನು ತೆರೆಯುವ ಪ್ರಯತ್ನವನ್ನು ತಡೆಯಲಾಗಿದೆ.",
      ml: "മുന്നറിയിപ്പ്: വ്യാജ തിരിച്ചറിയൽ രേഖകൾ ഉപയോഗിച്ച് 25 വ്യാജ വ്യാപാരി അക്കൗണ്ടുകൾ ഉണ്ടാക്കിയത് തടഞ്ഞു.",
      pa: "ਚੇਤਾਵਨੀ: ਨਕਲੀ ਪਛਾਣ ਵਰਤ ਕੇ 25 ਜਾਅਲੀ ਵਪਾਰੀ ਖਾਤੇ ਖੋਲ੍ਹਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਰੋਕ ਦਿੱਤੀ ਗਈ ਹੈ।",
      od: "ଚେତାବନୀ: ନକଲି ପରିଚୟ ବ୍ୟବହାର କରି ୨୫ଟି ବ୍ୟବସାୟୀ ଖାତା ଖୋଲିବା ଉଦ୍ୟମକୁ ବନ୍ଦ କରାଯାଇଛି।"
    }
  }
];

export function App() {
  const [viewMode, setViewMode] = useState<"hub" | "detail">("hub");
  const [scenarios] = useState<ScenarioConfig[]>(INITIAL_SCENARIOS);
  const [selectedIncId, setSelectedIncId] = useState<string>("INC-2026-0902-01");
  const [activeTab, setActiveTab] = useState<string>("workflow");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [showEscalateModal, setShowEscalateModal] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);
  const [inspectingEcs, setInspectingEcs] = useState<Record<string, any> | null>(null);
  const [esqlInput, setEsqlInput] = useState<string>("");
  const [esqlResult, setEsqlResult] = useState<any>(null);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>("hi");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Live Telemetry Stream
  const [liveEvents, setLiveEvents] = useState<any[]>([
    { id: "TXN-9021", time: "Just now", channel: "UPI", amt: 142000, ip: "198.51.100.44", status: "BLOCKED" },
    { id: "TXN-9020", time: "3s ago", channel: "IMPS", amt: 85000, ip: "45.33.32.156", status: "BLOCKED" },
    { id: "TXN-9019", time: "8s ago", channel: "ATM", amt: 50000, ip: "10.14.22.88", status: "BLOCKED" },
    { id: "TXN-9018", time: "14s ago", channel: "UPI", amt: 4200, ip: "10.0.1.5", status: "SUCCESS" },
    { id: "TXN-9017", time: "19s ago", channel: "NEFT", amt: 120000, ip: "10.0.1.12", status: "SUCCESS" }
  ]);

  // SLA Timer in seconds (6 hours = 21600s)
  const [slaSeconds, setSlaSeconds] = useState<number>(21340);

  const API_BASE = "https://vigil-backend-k511.onrender.com";

  const currentScenario = scenarios.find(s => s.incident_id === selectedIncId) || scenarios[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlaSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync translation when scenario or language changes
  useEffect(() => {
    if (currentScenario.indic) {
      setTranslatedText(currentScenario.indic[selectedLang] || currentScenario.indic["hi"]);
    }
  }, [selectedIncId, selectedLang, currentScenario]);

  // Sync initial ES|QL input
  useEffect(() => {
    if (currentScenario.copilot_prompts && currentScenario.copilot_prompts.length > 0) {
      setEsqlInput(currentScenario.copilot_prompts[0].esql_query);
    }
  }, [selectedIncId, currentScenario]);

  const formatSla = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleRunAllSteps = () => {
    setIsExecuting(true);
    let step = 1;
    const interval = setInterval(() => {
      step++;
      if (step <= 6) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setIsExecuting(false);
      }
    }, 600);
  };

  const handleApproveContainment = () => {
    setIsApproved(true);
    setTimeout(() => {
      setCurrentStep(5);
    }, 500);
  };

  const handleExecuteEsql = async () => {
    setIsQuerying(true);
    try {
      const res = await fetch(`${API_BASE}/api/esql/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: esqlInput })
      });
      if (res.ok) {
        const data = await res.json();
        setEsqlResult(data);
      } else {
        throw new Error("Local query simulation");
      }
    } catch {
      // High fidelity mock fallback
      setEsqlResult({
        columns: [{ name: "@timestamp" }, { name: "source.ip" }, { name: "bank.amount_inr" }, { name: "threat.tactic" }, { name: "status" }],
        values: [
          [new Date().toISOString(), currentScenario.attacker_ip, currentScenario.direct_exposure_inr, currentScenario.threat_tactic, "INTERCEPTED"],
          [new Date(Date.now() - 60000).toISOString(), currentScenario.attacker_ip, "0.00", "Probe", "FAILURE"]
        ]
      });
    } finally {
      setIsQuerying(false);
    }
  };

  // Official CERT-In Annexure-1 Publication-Grade PDF Generator using jsPDF & autoTable
  const generateClientCertInPdf = (sc: ScenarioConfig) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 36;
    const contentWidth = pageWidth - 2 * marginX;

    const nowStr = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";
    const nowIst = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 19) + " IST";

    const incId = sc.incident_id;
    const category = sc.step1?.certin_category || "CIAD-2022-04 Unauthorized Access & Payment Gateway Fraud";
    const directINR = Number(sc.direct_exposure_inr || 0);
    const attackerIps = sc.attacker_ips || [sc.attacker_ip];
    const targetAssets = sc.target_assets || sc.affected_systems || ["10.14.8.102 (api-gw.bank.internal)"];
    const compCreds = sc.compromised_credentials || sc.compromised_user;
    const payloadHash = sc.payload_hash || "SHA256: 4f98d9e2b4510aa18992cde8710b14ea987b213f";
    const affectedAccounts = sc.step3?.affected_accounts_total || 18;
    const corpAccounts = sc.step3?.corporate_count || 4;
    const hniAccounts = sc.step3?.hni_count || 14;
    const paymentChannel = sc.payment_channel || sc.step3?.account_examples || "Core Banking & Inter-Bank Switch";
    const actions = sc.step4?.actions || [];

    // Helper: Draw Official Header on Page 1
    const drawOfficialHeader = () => {
      // Deep Navy Header Box
      doc.setFillColor(15, 30, 56);
      doc.roundedRect(marginX, 32, contentWidth, 68, 4, 4, "F");

      // Emblem / Government of India Subtitle
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(203, 213, 225);
      doc.text("GOVERNMENT OF INDIA  |  MINISTRY OF ELECTRONICS & INFORMATION TECHNOLOGY", marginX + 14, 48);

      // CERT-In Main Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(56, 189, 248);
      doc.text("INDIAN COMPUTER EMERGENCY RESPONSE TEAM (CERT-In)", marginX + 14, 66);

      // Annexure Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text("CYBER SECURITY INCIDENT REPORTING FORM — ANNEXURE 1", marginX + 14, 80);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text("Mandatory Statutory Filing under Section 70B of IT Act 2000 & CERT-In Directions F.No. 20(3)/2022-CERT-In", marginX + 14, 91);

      // SLA Badge on Right Side
      doc.setFillColor(220, 38, 38);
      doc.roundedRect(pageWidth - marginX - 110, 40, 96, 50, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text("6-HOUR STATUTORY SLA", pageWidth - marginX - 104, 54);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.text("STATUS: FILED IN TIME", pageWidth - marginX - 104, 68);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.text("LATENCY: 4.2 MINS", pageWidth - marginX - 104, 80);
    };

    drawOfficialHeader();

    let startY = 110;

    // SECTION 1.0 TABLE
    autoTable(doc, {
      startY: startY,
      margin: { left: marginX, right: marginX },
      head: [
        [
          {
            content: "1.0  ORGANISATION PARTICULARS & CISO NODAL CONTACT",
            colSpan: 2,
            styles: { fillColor: [30, 58, 102], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 }
          }
        ]
      ],
      body: [
        ["1.1 Name of Organisation", "Apex Commercial Bank of India Ltd"],
        ["1.2 Regulatory Category", "Banking & Financial Services (Scheduled Commercial Bank — RBI Supervised)"],
        ["1.3 CISO / Designated Nodal Officer", "Rajeshwar Varma (Chief Information Security Officer)"],
        ["1.4 24x7 SOC Emergency Contact", "ciso-office@apexbank.in  |  soc-hotline@apexbank.in  |  +91-22-6889-0100"],
        ["1.5 Data Center & Cloud Infrastructure", "Primary DC: Navi Mumbai Tier-IV  |  DR: Hyderabad  |  Cloud: AWS ap-south-1"]
      ],
      theme: "grid",
      styles: { fontSize: 7.2, cellPadding: 3.5, textColor: [30, 41, 59], lineColor: [226, 232, 240], lineWidth: 0.5 },
      columnStyles: {
        0: { cellWidth: 155, fontStyle: "bold", textColor: [71, 85, 105], fillColor: [248, 250, 252] },
        1: { cellWidth: "auto" }
      }
    });

    startY = (doc as any).lastAutoTable.finalY + 8;

    // SECTION 2.0 TABLE
    autoTable(doc, {
      startY: startY,
      margin: { left: marginX, right: marginX },
      head: [
        [
          {
            content: "2.0  INCIDENT IDENTIFICATION & REGULATORY CLASSIFICATION",
            colSpan: 2,
            styles: { fillColor: [30, 58, 102], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 }
          }
        ]
      ],
      body: [
        ["2.1 Incident Reference ID", incId],
        ["2.2 Detection Timestamp (UTC / IST)", `${nowStr}  /  ${nowIst}`],
        ["2.3 Mandatory CERT-In Category", category],
        ["2.4 Severity & Escalation Level", `${sc.severity} (Immediate Escalation to Board Risk Committee)`],
        ["2.5 MITRE ATT&CK Classification", `${sc.threat_tactic} (${sc.mitre_id})`],
        ["2.6 Impacted Banking Infrastructure", paymentChannel]
      ],
      theme: "grid",
      styles: { fontSize: 7.2, cellPadding: 3.5, textColor: [30, 41, 59], lineColor: [226, 232, 240], lineWidth: 0.5 },
      columnStyles: {
        0: { cellWidth: 155, fontStyle: "bold", textColor: [71, 85, 105], fillColor: [248, 250, 252] },
        1: { cellWidth: "auto" }
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 1) {
          if (data.row.index === 0 || data.row.index === 2) {
            data.cell.styles.textColor = [220, 38, 38];
            data.cell.styles.fontStyle = "bold";
          }
        }
      }
    });

    startY = (doc as any).lastAutoTable.finalY + 8;

    // SECTION 3.0 TABLE (MULTI-IP IoCs)
    autoTable(doc, {
      startY: startY,
      margin: { left: marginX, right: marginX },
      head: [
        [
          {
            content: "3.0  TECHNICAL FORENSICS & MULTI-IP INDICATORS OF COMPROMISE (IoCs)",
            colSpan: 2,
            styles: { fillColor: [30, 58, 102], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 }
          }
        ]
      ],
      body: [
        ["3.1 Primary Attacker / C2 IP", attackerIps[0] || sc.attacker_ip],
        ["3.2 Botnet / Tor / Proxy Nodes", attackerIps.length > 1 ? attackerIps.slice(1).join("\n") : "None detected"],
        ["3.3 Affected Target Endpoints", targetAssets.join("\n")],
        ["3.4 Compromised Credential / Role", compCreds],
        ["3.5 Malicious Hash / Signature", payloadHash],
        ["3.6 Autonomous Detection Engine", "VIGIL ES|QL Forensic Correlator (14.2ms Execution Latency)"]
      ],
      theme: "grid",
      styles: { fontSize: 7.2, cellPadding: 3.5, textColor: [30, 41, 59], lineColor: [226, 232, 240], lineWidth: 0.5 },
      columnStyles: {
        0: { cellWidth: 155, fontStyle: "bold", textColor: [71, 85, 105], fillColor: [248, 250, 252] },
        1: { cellWidth: "auto" }
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 1) {
          if (data.row.index === 0 || data.row.index === 1) {
            data.cell.styles.textColor = [220, 38, 38];
            data.cell.styles.fontStyle = "bold";
          }
        }
      }
    });

    // =========================================================================
    // PAGE 2 (EXPOSURE, REMEDIAL ACTIONS & STATUTORY SEAL)
    // =========================================================================
    doc.addPage();

    // Page 2 Sub-Header
    doc.setFillColor(15, 30, 56);
    doc.roundedRect(marginX, 32, contentWidth, 38, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("INDIAN COMPUTER EMERGENCY RESPONSE TEAM (CERT-In) — ANNEXURE 1 CONTINUED", marginX + 14, 48);
    doc.setFontSize(7.5);
    doc.setTextColor(56, 189, 248);
    doc.text(`INCIDENT REFERENCE ID: ${incId}  |  SECTOR: BANKING & FINANCIAL SERVICES (BFSI)`, marginX + 14, 60);

    startY = 80;

    // SECTION 4.0 TABLE
    autoTable(doc, {
      startY: startY,
      margin: { left: marginX, right: marginX },
      head: [
        [
          {
            content: "4.0  RUPEE FINANCIAL EXPOSURE & IMPACT ASSESSMENT",
            colSpan: 2,
            styles: { fillColor: [30, 58, 102], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 }
          }
        ]
      ],
      body: [
        ["4.1 Direct Rupee Funds at Risk", `Rs. ${directINR.toLocaleString("en-IN")}.00 (${(directINR / 10000000).toFixed(2)} Crore INR)`],
        ["4.2 Customer Blast Radius", `${affectedAccounts} Total Accounts (${corpAccounts} Corporate Treasury, ${hniAccounts} HNI / Private Wealth)`],
        ["4.3 Customer PII / Statement Leak", directINR > 0 ? "NO PII EXFILTRATED (Intercepted before clearance batch)" : "Zero Customer PII Impact"],
        ["4.4 Payment Switch & Core Ledger Status", "OPERATIONAL (Unauthorized activity quarantined in flight)"],
        ["4.5 Business Continuity Status", "Green / Normal (Zero disruption to retail banking customers)"]
      ],
      theme: "grid",
      styles: { fontSize: 7.2, cellPadding: 3.5, textColor: [30, 41, 59], lineColor: [226, 232, 240], lineWidth: 0.5 },
      columnStyles: {
        0: { cellWidth: 155, fontStyle: "bold", textColor: [71, 85, 105], fillColor: [248, 250, 252] },
        1: { cellWidth: "auto" }
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 1 && data.row.index === 0) {
          data.cell.styles.textColor = [16, 185, 129];
          data.cell.styles.fontStyle = "bold";
        }
      }
    });

    startY = (doc as any).lastAutoTable.finalY + 8;

    // SECTION 5.0 TABLE
    const actionRows = actions.slice(0, 4).map((act, idx) => [
      `5.${idx + 1} ${act.title}`,
      `${act.description} [EXECUTED / SEALED]`
    ]);
    actionRows.push(["5.5 Digital Evidence Locker", "SEALED in SHA-256 Immutable Audit Ledger & AWS S3 WORM Storage"]);
    actionRows.push(["5.6 Real-Time Telemetry Stream", "Elastic Cloud live agent monitoring active (1-minute heartbeat)"]);

    autoTable(doc, {
      startY: startY,
      margin: { left: marginX, right: marginX },
      head: [
        [
          {
            content: "5.0  REMEDIAL, MITIGATION & CONTAINMENT ACTIONS EXECUTED",
            colSpan: 2,
            styles: { fillColor: [30, 58, 102], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 }
          }
        ]
      ],
      body: actionRows,
      theme: "grid",
      styles: { fontSize: 7.2, cellPadding: 3.5, textColor: [30, 41, 59], lineColor: [226, 232, 240], lineWidth: 0.5 },
      columnStyles: {
        0: { cellWidth: 155, fontStyle: "bold", textColor: [71, 85, 105], fillColor: [248, 250, 252] },
        1: { cellWidth: "auto" }
      }
    });

    startY = (doc as any).lastAutoTable.finalY + 12;

    // SECTION 6.0: OFFICIAL CERTIFICATE SEAL BOX
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.8);
    doc.roundedRect(marginX, startY, contentWidth, 90, 4, 4, "FD");

    // Navy Accent Strip on Left
    doc.setFillColor(30, 58, 102);
    doc.roundedRect(marginX, startY, 4, 90, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 58, 102);
    doc.text("6.0  STATUTORY DECLARATION & FORMAL NODAL SIGN-OFF", marginX + 12, startY + 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(
      "I hereby confirm that this cyber security incident notification has been generated and validated by the VIGIL\nAutonomous Incident Response Engine in coordination with the CISO Nodal Office. All indicators of compromise,\naffected asset vectors, rupee exposure figures, and containment actions are authentic and cryptographically sealed.",
      marginX + 12,
      startY + 26
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("Digitally Authorized by: Rajeshwar Varma  |  Chief Information Security Officer", marginX + 12, startY + 68);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Apex Commercial Bank of India Ltd  |  Certified Public Key: 0x8F92..BC10  |  Mumbai HQ", marginX + 12, startY + 80);

    // Official Seal Badge
    doc.setFillColor(220, 38, 38);
    doc.roundedRect(pageWidth - marginX - 120, startY + 45, 108, 34, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("OFFICIALLY SEALED", pageWidth - marginX - 112, startY + 58);
    doc.setFontSize(6);
    doc.text("SHA-256 HASH VERIFIED", pageWidth - marginX - 112, startY + 68);
    doc.text("S3 WORM OBJECT LOCK", pageWidth - marginX - 112, startY + 75);

    // Add Footers & Page Numbers to All Pages
    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(marginX, pageHeight - 28, pageWidth - marginX, pageHeight - 28);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text("VIGIL Autonomous AI SOC Analyst  |  Statutory Filing under Section 70B IT Act 2000  |  Strictly Confidential", marginX, pageHeight - 18);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginX - 45, pageHeight - 18);
    }

    return doc.output("blob");
  };

  const handleDownloadPdf = () => {
    try {
      const pdfBlob = generateClientCertInPdf(currentScenario);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CERT_IN_REPORT_${selectedIncId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error("PDF generation failed:", e);
    }
  };

  const handleTranslate = async (lang: string) => {
    setSelectedLang(lang);
    setIsTranslating(true);
    try {
      const res = await fetch(`${API_BASE}/api/translate/indic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentScenario.title, target_lang: lang })
      });
      if (res.ok) {
        const data = await res.json();
        setTranslatedText(data.translated_text);
      } else {
        throw new Error("Use local translation");
      }
    } catch {
      setTranslatedText(currentScenario.indic[lang] || currentScenario.indic["hi"]);
    } finally {
      setIsTranslating(false);
    }
  };

  const isDark = theme === "dark";

  // Filtered Scenarios for Hub View
  const filteredScenarios = scenarios.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.incident_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.threat_tactic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.attacker_ip.includes(searchQuery);
    const matchesSeverity = severityFilter === "ALL" || s.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const totalRiskINR = scenarios.reduce((acc, s) => acc + s.direct_exposure_inr, 0);
  const criticalCount = scenarios.filter(s => s.severity === "CRITICAL").length;
  const highCount = scenarios.filter(s => s.severity === "HIGH").length;
  const fpCount = scenarios.filter(s => !s.is_material).length;

  const navigateToDetail = (incId: string) => {
    setSelectedIncId(incId);
    setCurrentStep(1);
    setIsApproved(false);
    setViewMode("detail");
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDark ? "bg-[#0B1120] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
    }`}>
      {/* Top Application Header */}
      <header className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md transition-colors ${
        isDark ? "bg-[#0F172A]/90 border-slate-800" : "bg-white/90 border-slate-200 shadow-sm"
      }`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode("hub")} 
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-200 bg-clip-text text-transparent">
                  VIGIL
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono font-bold uppercase tracking-wider">
                  AI SOC ANALYST
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Autonomous Security Operations for Indian BFSI</p>
            </div>
          </button>

          {viewMode === "detail" && (
            <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-slate-700">
              <button 
                onClick={() => setViewMode("hub")}
                className="text-xs font-bold text-slate-400 hover:text-sky-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Use Cases</span>
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-mono font-bold text-sky-400">{selectedIncId}</span>
            </div>
          )}
        </div>

        {/* Global Action & Status Strip */}
        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
          }`}>
            <button
              onClick={() => setViewMode("hub")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "hub" 
                  ? isDark ? "bg-sky-500 text-white shadow-md shadow-sky-500/30" : "bg-white text-sky-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Use Cases Hub</span>
            </button>
            <button
              onClick={() => setViewMode("detail")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "detail" 
                  ? isDark ? "bg-sky-500 text-white shadow-md shadow-sky-500/30" : "bg-white text-sky-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Investigation Cockpit</span>
            </button>
          </div>

          {/* Quick Incident Escalation CTA */}
          <button 
            onClick={() => setShowEscalateModal(true)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border transition-all cursor-pointer ${
              isDark 
                ? "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20" 
                : "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
            }`}
            title="Dispatch Slack / PagerDuty / Jira ticket"
          >
            <Send className="h-3.5 w-3.5 text-purple-500" />
            <span className="hidden sm:inline">Escalate</span>
          </button>

          {/* Elastic Cloud Cluster Status */}
          <div 
            className={`hidden md:flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border font-medium ${
              isDark ? "bg-slate-800/80 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
            }`}
            title={backendOnline ? "Backend & Elastic Cloud Cluster Connected" : "Connecting to backend..."}
          >
            <span className={`h-2 w-2 rounded-full ${backendOnline ? "bg-emerald-400 animate-pulse shadow-sm" : "bg-amber-400"}`} />
            <Database className="h-3.5 w-3.5 text-sky-500" />
            <span>Elastic Cloud</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              {backendOnline ? "● Live (ap-south-1)" : "(ap-south-1)"}
            </span>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
              isDark ? "bg-slate-800/80 border-slate-700 text-amber-300 hover:bg-slate-700" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Download Official PDF CTA */}
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-3.5 py-2 rounded-lg shadow-lg shadow-sky-600/20 transition-all cursor-pointer"
            title="Download Official CERT-In Annexure-1 Report PDF"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Export PDF</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* VIEW 1: USE CASES HUB (Incident Discovery & Scenario Dashboard) */}
      {/* ========================================================================= */}
      {viewMode === "hub" && (
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Executive Overview Banner */}
          <div className={`p-6 rounded-2xl border relative overflow-hidden ${
            isDark 
              ? "bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-950 border-slate-800 shadow-xl" 
              : "bg-gradient-to-br from-white via-sky-50/40 to-slate-50 border-slate-200 shadow-md"
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6 text-sky-500" />
                  <h1 className="text-xl font-black tracking-tight">Banking Threat Discovery & Incident Response Hub</h1>
                </div>
                <p className={`text-xs mt-1 max-w-3xl ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Real-time threat detection across Elastic Cloud (AWS ap-south-1). Select any active banking incident to launch the autonomous 6-step triage, forensic blast radius analysis, and statutory CERT-In Annexure-1 compliance workflow.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateToDetail(scenarios[0].incident_id)}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
                >
                  <Play className="h-4 w-4" />
                  <span>Launch Live Cockpit</span>
                </button>
              </div>
            </div>

            {/* Top Aggregate Risk Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Rupee Risk at Stake</div>
                <div className="text-2xl font-black font-mono text-emerald-500 mt-1">₹ {(totalRiskINR / 10000000).toFixed(2)} Cr</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Across {scenarios.length} Banking Scenarios</div>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Critical Breaches</div>
                <div className="text-2xl font-black font-mono text-red-500 mt-1">{criticalCount} Active</div>
                <div className="text-[10px] text-red-400/80 mt-0.5">Mandatory 6-Hr CERT-In Filing</div>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">High-Risk Incidents</div>
                <div className="text-2xl font-black font-mono text-amber-500 mt-1">{highCount} Active</div>
                <div className="text-[10px] text-amber-400/80 mt-0.5">Automated Containment Ready</div>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">False Positive Suppression</div>
                <div className="text-2xl font-black font-mono text-sky-400 mt-1">{fpCount} Verified</div>
                <div className="text-[10px] text-sky-400/80 mt-0.5">Pre-Approved Maintenance Cron</div>
              </div>
            </div>
          </div>

          {/* Search, Filter Bar & Use Cases Grid */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search use cases by keyword, IP, tactic, user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border transition-colors outline-none font-medium ${
                    isDark 
                      ? "bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-sky-500" 
                      : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 shadow-sm"
                  }`}
                />
              </div>

              <div className="flex items-center gap-1.5 self-start md:self-auto">
                {["ALL", "CRITICAL", "HIGH", "LOW"].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      severityFilter === sev
                        ? "bg-sky-600 text-white shadow"
                        : isDark
                        ? "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {sev === "ALL" ? "All Scenarios" : sev}
                  </button>
                ))}
              </div>
            </div>

            {/* 8 Use Cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScenarios.map((sc) => {
                const isSelected = selectedIncId === sc.incident_id;
                return (
                  <div
                    key={sc.incident_id}
                    onClick={() => navigateToDetail(sc.incident_id)}
                    className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer group hover:scale-[1.01] ${
                      isSelected
                        ? isDark 
                          ? "bg-slate-900/90 border-sky-500 ring-2 ring-sky-500/30 shadow-xl" 
                          : "bg-sky-50/50 border-sky-400 ring-2 ring-sky-300 shadow-md"
                        : isDark
                        ? "bg-[#0F172A] border-slate-800/80 hover:border-slate-700"
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                            {sc.incident_id}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono uppercase ${
                            sc.severity === "CRITICAL"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : sc.severity === "HIGH"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          }`}>
                            {sc.severity}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold ${sc.is_material ? "text-amber-500" : "text-emerald-400"}`}>
                          {sc.is_material ? "Mandatory 6-Hr" : "Benign FP"}
                        </span>
                      </div>

                      <h3 className={`font-bold text-sm leading-snug group-hover:text-sky-400 transition-colors ${
                        isDark ? "text-slate-100" : "text-slate-900"
                      }`}>
                        {sc.title}
                      </h3>

                      <p className={`text-xs mt-2 line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {sc.impact_summary}
                      </p>

                      <div className={`mt-4 p-3 rounded-xl border space-y-1.5 text-xs ${
                        isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200/80"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">₹ Exposure:</span>
                          <span className="font-bold font-mono text-emerald-400">
                            ₹ {sc.direct_exposure_inr.toLocaleString("en-IN")}.00
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Threat Tactic:</span>
                          <span className="font-mono text-sky-400 text-[11px] truncate max-w-[170px]">
                            {sc.threat_tactic}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Primary IP:</span>
                          <span className="font-mono text-slate-300 text-[11px]">
                            {sc.attacker_ip}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Tool: {sc.current_step}/6 Complete
                      </span>
                      <button className="text-xs font-bold text-sky-500 group-hover:text-sky-400 flex items-center gap-1 transition-transform group-hover:translate-x-1">
                        <span>Investigate Scenario</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: DETAILED INCIDENT INVESTIGATION COCKPIT */}
      {/* ========================================================================= */}
      {viewMode === "detail" && (
        <div className="flex-1 flex flex-col">
          {/* Sub-Header Breadcrumb & Navigation */}
          <div className={`border-b px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
            isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode("hub")}
                className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Use Cases</span>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-400">{currentScenario.incident_id}</span>
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold font-mono uppercase ${
                    currentScenario.severity === "CRITICAL"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : currentScenario.severity === "HIGH"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}>
                    {currentScenario.severity}
                  </span>
                  <span className="font-bold text-sm truncate max-w-xl">{currentScenario.title}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Scenario Quick-Switcher */}
              <select
                value={selectedIncId}
                onChange={(e) => navigateToDetail(e.target.value)}
                className={`text-xs font-medium px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                  isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                {scenarios.map((sc) => (
                  <option key={sc.incident_id} value={sc.incident_id}>
                    {sc.incident_id}: {sc.title.slice(0, 40)}...
                  </option>
                ))}
              </select>

              {/* 6-Hour SLA Clock */}
              {currentScenario.is_material && (
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  <Clock className="h-3.5 w-3.5 animate-pulse" />
                  <span>{formatSla(slaSeconds)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cockpit Main Body */}
          <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 max-w-[1600px] mx-auto w-full">
            {/* Left Column: Quick Scenario Stream & Summary */}
            <div className="w-full lg:w-4/12 flex flex-col gap-5">
              {/* Business Rupee Exposure Box */}
              <div className={`border rounded-2xl p-5 text-left relative overflow-hidden transition-colors ${
                isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span>Business Risk Exposure</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                    bank.exposure.lookup
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-black font-mono tracking-tight text-emerald-400">
                    ₹ {currentScenario.direct_exposure_inr.toLocaleString("en-IN")}.00
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {currentScenario.is_material 
                      ? "Direct funds at risk in pending transaction queue." 
                      : "Zero financial exposure. Routine operation."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Users className="h-3.5 w-3.5" />
                      <span>Blast Radius</span>
                    </div>
                    <div className="text-base font-bold text-sky-400 font-mono mt-0.5">
                      {currentScenario.step3.affected_accounts_total} Accounts
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Penalty Saved</span>
                    </div>
                    <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                      {currentScenario.step3.penalty_saved.split(" ")[0]} {currentScenario.step3.penalty_saved.split(" ")[1]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scenarios Stream List */}
              <div className={`border rounded-2xl p-5 flex-1 flex flex-col text-left transition-colors ${
                isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Activity className="h-4 w-4 text-sky-400" />
                    <span>Attack Triage Stream</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                    {scenarios.length} Scenarios
                  </span>
                </div>

                <div className="space-y-2.5 overflow-y-auto max-h-[480px] pr-1">
                  {scenarios.map((sc) => {
                    const isSelected = selectedIncId === sc.incident_id;
                    return (
                      <button
                        key={sc.incident_id}
                        onClick={() => navigateToDetail(sc.incident_id)}
                        className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? isDark 
                              ? "bg-slate-900 border-sky-500 ring-1 ring-sky-500/40 shadow-md" 
                              : "bg-sky-50 border-sky-400 ring-1 ring-sky-300 shadow-sm"
                            : isDark
                            ? "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                            : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-sky-400">{sc.incident_id}</span>
                          <span className={`text-[10px] px-2 py-0.2 rounded font-mono font-bold uppercase ${
                            sc.severity === "CRITICAL"
                              ? "text-red-400 bg-red-500/10"
                              : sc.severity === "HIGH"
                              ? "text-amber-400 bg-amber-500/10"
                              : "text-emerald-400 bg-emerald-500/10"
                          }`}>
                            {sc.severity}
                          </span>
                        </div>
                        <div className="font-bold text-xs mt-1 truncate">{sc.title}</div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {sc.is_material ? "Mandatory 6-Hr" : "Benign FP"}
                          </span>
                          <span className="font-mono text-emerald-400 font-bold">
                            ₹ {sc.direct_exposure_inr.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Deep Forensic & Investigation Tabs */}
            <div className="w-full lg:w-8/12 flex flex-col gap-4">
              {/* Tab Navigation */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto gap-2">
                <div className="flex items-center gap-1.5">
                  {[
                    { id: "workflow", label: "6-Step Pipeline", icon: Workflow },
                    { id: "topology", label: "Attack Topology", icon: Network },
                    { id: "timeline", label: "Forensic Timeline", icon: ListTree },
                    { id: "mitre", label: "MITRE ATT&CK", icon: Compass },
                    { id: "customers", label: "Blast Accounts", icon: Users },
                    { id: "telemetry", label: "Live Telemetry", icon: Activity },
                    { id: "esql", label: "ES|QL Copilot", icon: Terminal },
                    { id: "certin", label: "CERT-In Form", icon: FileText },
                    { id: "indic", label: "Sarvam Indic", icon: Globe },
                    { id: "ledger", label: "SHA-256 Ledger", icon: Lock }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          isActive
                            ? isDark
                              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                              : "bg-sky-600 text-white shadow-sm"
                            : isDark
                            ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {activeTab === "workflow" && (
                  <button
                    onClick={handleRunAllSteps}
                    disabled={isExecuting}
                    className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer flex-shrink-0"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                    <span>{isExecuting ? "Running..." : "Auto-Run All"}</span>
                  </button>
                )}
              </div>

              {/* TAB 1: 6-STEP AGENTIC PIPELINE */}
              {activeTab === "workflow" && (
                <div className={`border rounded-2xl p-5 flex flex-col gap-5 text-left transition-colors ${
                  isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  {/* Step Buttons */}
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { num: 1, label: "1. Materiality", desc: "RBI Check" },
                      { num: 2, label: "2. ES|QL", desc: "Evidence" },
                      { num: 3, label: "3. ₹ Exposure", desc: "bank.exposure" },
                      { num: 4, label: "4. Containment", desc: "HITL Gate" },
                      { num: 5, label: "5. CERT-In", desc: "Annexure-1" },
                      { num: 6, label: "6. Ledger", desc: "SHA-256 Seal" }
                    ].map((st) => (
                      <button
                        key={st.num}
                        onClick={() => setCurrentStep(st.num)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          currentStep === st.num
                            ? "bg-sky-500/20 border-sky-500 text-sky-500 shadow-sm ring-1 ring-sky-500/40 font-bold"
                            : currentStep > st.num
                            ? isDark ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : isDark ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400"
                        }`}
                      >
                        <div className="text-xs font-bold flex items-center justify-between">
                          <span>{st.label}</span>
                          {currentStep > st.num && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                        </div>
                        <div className="text-[10px] opacity-75 mt-0.5">{st.desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* Active Step Content */}
                  <div className={`border rounded-2xl p-5 text-left transition-colors ${
                    isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50/70 border-slate-200"
                  }`}>
                    {currentStep === 1 && (
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-sm text-sky-500 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Step 1: Incident Classification & RBI Materiality Check
                          </div>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                            currentScenario.is_material 
                              ? isDark ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-red-100 text-red-700 border border-red-200"
                              : isDark ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}>
                            {currentScenario.is_material ? "Status: Material Regulatory Breach" : "Status: Benign False Positive"}
                          </span>
                        </div>
                        <div className={`mt-4 space-y-2.5 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          <p>• <strong>RBI Guideline Ref</strong>: <code className="text-sky-500">{currentScenario.step1.rbi_ref}</code></p>
                          <p>• <strong>CERT-In Category</strong>: {currentScenario.step1.certin_category}</p>
                          <p>• <strong>MITRE ATT&CK Classification</strong>: <span className="font-mono text-amber-500">{currentScenario.threat_tactic} ({currentScenario.mitre_id})</span></p>
                          <p>• <strong>Threshold Evaluation</strong>: {currentScenario.step1.threshold_desc}</p>
                          <p>• <strong>Mandated Statutory Clock</strong>: <strong className="text-amber-500">{currentScenario.step1.clock_status}</strong></p>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-sm text-amber-500 flex items-center gap-2">
                            <Terminal className="h-4 w-4" />
                            Step 2: Autonomous ES|QL Threat Hunt & Forensic Evidence
                          </div>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                            isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700"
                          }`}>
                            Tool: generate_esql
                          </span>
                        </div>

                        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/90 border-amber-500/30" : "bg-amber-50/70 border-amber-200"}`}>
                          <div className="font-bold text-xs text-amber-500 flex items-center gap-2 mb-1.5">
                            <Terminal className="h-3.5 w-3.5" />
                            {currentScenario.step2.autonomous_detection_title}
                          </div>
                          <div className={`p-3 rounded-lg font-mono text-xs border whitespace-pre-line ${
                            isDark ? "bg-slate-950 text-amber-300 border-slate-800" : "bg-white text-amber-900 border-amber-100"
                          }`}>
                            {currentScenario.step2.autonomous_detection_query}
                          </div>
                          <p className={`text-xs mt-2 italic ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            💡 <strong>Detection Logic:</strong> {currentScenario.step2.autonomous_detection_explanation}
                          </p>
                        </div>

                        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                          <div className="font-bold text-xs text-sky-500 flex items-center gap-2 mb-1.5">
                            <Database className="h-3.5 w-3.5" />
                            {currentScenario.step2.forensic_blast_radius_title}
                          </div>
                          <div className={`p-3 rounded-lg font-mono text-xs border whitespace-pre-line ${
                            isDark ? "bg-slate-950 text-sky-300 border-slate-800" : "bg-slate-50 text-sky-900 border-slate-200"
                          }`}>
                            {currentScenario.step2.forensic_blast_radius_query}
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs mt-3">
                            <div>• <strong>Discovered Entity:</strong> <span className="text-amber-500 font-mono font-semibold">{currentScenario.step2.discovered_entity}</span></div>
                            <div>• <strong>Compromised Key:</strong> <span className="text-sky-500 font-mono font-semibold">{currentScenario.step2.compromised_id}</span></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-sm text-emerald-500 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Step 3: ₹ Direct Financial Risk Exposure Scoring
                          </div>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                            isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                          }`}>
                            Tool: bank.exposure.lookup
                          </span>
                        </div>
                        <div className={`mt-4 space-y-2.5 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          <p>• <strong>Direct Rupee Exposure</strong>: <span className="text-emerald-500 font-black font-mono text-sm">₹ {currentScenario.direct_exposure_inr.toLocaleString("en-IN")}.00</span></p>
                          <p>• <strong>Corporate Accounts Impacted</strong>: {currentScenario.step3.corporate_count} Corporate Entities</p>
                          <p>• <strong>HNI & Private Wealth Accounts</strong>: {currentScenario.step3.hni_count} High-Net-Worth Individuals</p>
                          <p>• <strong>Identified Entities in Blast Radius</strong>: {currentScenario.step3.account_examples}</p>
                          <p>• <strong>Business Risk Severity</strong>: <span className="text-amber-500 font-bold font-mono">{currentScenario.step3.business_risk_level}</span></p>
                        </div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-sm text-amber-500 flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Step 4: Containment Action Authorization (Human-in-the-Loop Gate)
                          </div>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                            isApproved
                              ? isDark ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : isDark ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-amber-100 text-amber-700 border border-amber-200"
                          }`}>
                            {isApproved ? "APPROVED & SEALED" : "PENDING ANALYST SIGN-OFF"}
                          </span>
                        </div>

                        <div className="mt-4 space-y-3.5 text-xs">
                          <div className="space-y-2">
                            {currentScenario.step4.actions.map((act, i) => (
                              <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl border transition-colors ${
                                isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                              }`}>
                                <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isApproved ? "text-emerald-500" : "text-slate-400"}`} />
                                <div>
                                  <div className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{act.title}</div>
                                  <div className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                    {act.description} • <span className="text-sky-500 font-semibold">{act.system}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {isApproved ? (
                            <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                              isDark ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-800"
                            }`}>
                              <Check className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                              <span>{currentScenario.step4.containment_success_msg}</span>
                            </div>
                          ) : (
                            <div className="pt-2 flex items-center gap-3">
                              <button
                                onClick={handleApproveContainment}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                              >
                                <UserCheck className="h-4 w-4" />
                                <span>1-Click Authorize & Execute Containment</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {currentStep === 5 && (
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-sm text-sky-500 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Step 5: Official CERT-In Annexure-1 Report Generated
                          </div>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                            isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                          }`}>
                            Tool: certin.report.draft
                          </span>
                        </div>
                        <div className={`mt-4 space-y-2.5 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          <p>• <strong>Statutory Document</strong>: Annexure-1 Cyber Incident Notification Form (IT Act Sec 70B)</p>
                          <p>• <strong>Turnaround Time</strong>: Completed in <strong>4.2 minutes</strong> (vs. standard 4+ hours manual drafting).</p>
                          <p>• <strong>Affected Infrastructure</strong>: {currentScenario.step5.affected_systems}</p>
                          <p>• <strong>Remediation Status</strong>: {currentScenario.step5.remedial_summary}</p>
                          <div className="pt-2 flex items-center gap-3">
                            <button
                              onClick={() => setActiveTab("certin")}
                              className="text-xs font-bold text-sky-500 hover:text-sky-600 underline cursor-pointer"
                            >
                              View Full Form & Download PDF →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 6 && (
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-sm text-purple-500 flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Step 6: Cryptographic Evidence Sealing (SHA-256 Ledger)
                          </div>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                            isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700"
                          }`}>
                            Tool: evidence.ledger.append
                          </span>
                        </div>
                        <div className={`mt-4 space-y-2.5 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          <p>• <strong>Evidence Locker</strong>: AWS S3 Object Lock (WORM - Write Once Read Many) in ap-south-1 (Mumbai)</p>
                          <p>• <strong>Incident Block Reference</strong>: <code className="text-purple-500 font-mono font-bold">{selectedIncId}-SEALED-BLOCK-105</code></p>
                          <p>• <strong>Audit Defensibility</strong>: 100% Tamper-evident proof guaranteed for RBI Cyber Security inspection.</p>
                          <div className="pt-2">
                            <button
                              onClick={() => setActiveTab("ledger")}
                              className="text-xs font-bold text-purple-500 hover:text-purple-600 underline cursor-pointer"
                            >
                              Inspect Cryptographic Hash Chain →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ATTACK TOPOLOGY */}
              {activeTab === "topology" && (
                <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
                  isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-sky-500">
                        <Network className="h-4 w-4" />
                        Interactive Attack Topology & Infrastructure Graph
                      </div>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Click on any node to inspect compromised telemetry and mitigation status.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 my-2">
                    {currentScenario.topology.map((node) => (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedNode?.id === node.id
                            ? isDark ? "bg-slate-900 border-sky-400 ring-2 ring-sky-500/30" : "bg-sky-50 border-sky-500 ring-2 ring-sky-200"
                            : isDark ? "bg-slate-950/70 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            node.type === "ATTACKER" ? "bg-red-500/20 text-red-400" :
                            node.type === "TARGET" ? "bg-amber-500/20 text-amber-400" :
                            "bg-sky-500/20 text-sky-400"
                          }`}>
                            {node.type}
                          </span>
                          <span className={`h-2 w-2 rounded-full ${node.status === "BLOCKED" ? "bg-red-500" : "bg-emerald-500"}`} />
                        </div>
                        <div className="font-bold text-xs mt-2 truncate">{node.label}</div>
                        <div className="text-[11px] font-mono text-slate-400 mt-1">{node.ip}</div>
                      </div>
                    ))}
                  </div>

                  {selectedNode && (
                    <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                      isDark ? "bg-slate-950 border-sky-500/40 text-slate-300" : "bg-sky-50/50 border-sky-200 text-slate-700"
                    }`}>
                      <div className="font-bold text-sky-500 flex items-center justify-between">
                        <span>Node Details: {selectedNode.label}</span>
                        <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-200">✕</button>
                      </div>
                      <p>• <strong>IP Address</strong>: <code className="font-mono">{selectedNode.ip}</code> ({selectedNode.geo})</p>
                      <p>• <strong>Protocol</strong>: {selectedNode.protocol}</p>
                      <p>• <strong>MITRE ATT&CK Mapping</strong>: <span className="font-mono text-amber-500 font-bold">{selectedNode.mitre_tag}</span></p>
                      <p>• <strong>Forensic Details</strong>: {selectedNode.details}</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: FORENSIC TIMELINE */}
              {activeTab === "timeline" && (
                <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
                  isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-sm font-bold text-sky-500">
                      <ListTree className="h-4 w-4" />
                      Forensic Reconstruction Timeline
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {currentScenario.timeline.length} Events Sequenced
                    </span>
                  </div>

                  <div className="space-y-3 relative pl-4 border-l-2 border-slate-700 my-2">
                    {currentScenario.timeline.map((event, i) => (
                      <div key={i} className="relative group">
                        <div className={`absolute -left-[23px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                          event.severity === "CRITICAL" ? "bg-red-500 border-slate-900" :
                          event.severity === "HIGH" ? "bg-amber-500 border-slate-900" : "bg-sky-500 border-slate-900"
                        }`} />
                        <div className={`p-3.5 rounded-xl border text-xs transition-all ${
                          isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200"
                        }`}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs">{event.title}</span>
                            <span className="font-mono text-[11px] text-slate-400">{event.time} ({event.offset})</span>
                          </div>
                          <p className={`mt-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{event.description}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="font-mono text-[10px] text-sky-400">Tactic: {event.tactic}</span>
                            <button
                              onClick={() => setInspectingEcs(event.raw_ecs)}
                              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 underline"
                            >
                              Inspect Raw ECS Payload →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: MITRE ATT&CK */}
              {activeTab === "mitre" && (
                <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
                  isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-500">
                      <Compass className="h-4 w-4" />
                      MITRE ATT&CK Enterprise Matrix Mapping (BFSI)
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-2">
                    {[
                      { tactic: "TA0001 Initial Access", technique: currentScenario.mitre_id, desc: "Exploitation of public facing gateway / credential stuffing." },
                      { tactic: "TA0008 Lateral Movement", technique: "T1557 MITM / Token Pivot", desc: "Internal propagation across core banking switches." },
                      { tactic: "TA0040 Impact", technique: "T1565.001 Account Tampering", desc: "Unauthorized transaction velocity limit manipulation." }
                    ].map((item, i) => (
                      <div key={i} className={`p-4 rounded-xl border text-left text-xs space-y-1.5 ${
                        isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200"
                      }`}>
                        <div className="font-bold text-amber-500">{item.tactic}</div>
                        <div className="font-mono font-semibold text-sky-400 text-xs">{item.technique}</div>
                        <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: BLAST RADIUS ACCOUNTS */}
              {activeTab === "customers" && (
                <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
                  isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-500">
                      <Users className="h-4 w-4" />
                      Core Banking Customer Blast Radius Table
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {currentScenario.step3.accounts_table.length} Accounts Isolated
                    </span>
                  </div>

                  <div className="overflow-x-auto my-2">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className={`border-b ${isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                          <th className="pb-2">Account ID</th>
                          <th className="pb-2">Customer Name</th>
                          <th className="pb-2">Tier</th>
                          <th className="pb-2">Exposed (₹)</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {currentScenario.step3.accounts_table.map((acc, i) => (
                          <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                            <td className="py-2.5 font-mono text-sky-400 font-bold">{acc.account_id}</td>
                            <td className="py-2.5 font-bold">{acc.name}</td>
                            <td className="py-2.5">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono">
                                {acc.tier}
                              </span>
                            </td>
                            <td className="py-2.5 font-mono text-emerald-400 font-bold">₹ {acc.exposed_inr.toLocaleString("en-IN")}</td>
                            <td className="py-2.5">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                                {acc.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: LIVE TELEMETRY */}
              {activeTab === "telemetry" && (
                <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
                  isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-sm font-bold text-sky-500">
                      <Activity className="h-4 w-4 animate-pulse" />
                      Live Indian BFSI Simulated Telemetry Stream
                    </div>
                  </div>

                  <div className="space-y-2 overflow-y-auto max-h-[350px]">
                    {liveEvents.map((evt) => (
                      <div key={evt.id} className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                        isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-sky-400 font-bold">{evt.id}</span>
                          <span className="text-slate-400">• {evt.channel}</span>
                          <span className="text-slate-500">({evt.ip})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-400 font-bold">₹ {evt.amt.toLocaleString("en-IN")}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            evt.status === "BLOCKED" ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                          }`}>
                            {evt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: ES|QL COPILOT */}
              {activeTab === "esql" && (
                <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
                  isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-500">
                      <Terminal className="h-4 w-4" />
                      Natural Language to ES|QL Threat Hunting Copilot
                    </div>
                  </div>

                  {/* Pre-built Queries */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400">Pre-Configured AI Threat Hunting Queries:</div>
                    {currentScenario.copilot_prompts.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setEsqlInput(p.esql_query);
                          handleExecuteEsql();
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                          isDark 
                            ? "bg-slate-950 border-slate-800 hover:border-amber-500/50 text-slate-200" 
                            : "bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-800"
                        }`}
                      >
                        <div className="font-semibold text-amber-400">"{p.question}"</div>
                      </button>
                    ))}
                  </div>

                  {/* Query Editor */}
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={4}
                      value={esqlInput}
                      onChange={(e) => setEsqlInput(e.target.value)}
                      className={`w-full p-3 rounded-xl font-mono text-xs border outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-amber-300" : "bg-slate-50 border-slate-200 text-amber-900"
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleExecuteEsql}
                        disabled={isQuerying}
                        className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>{isQuerying ? "Executing against Elastic Cloud..." : "Execute ES|QL Query"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Results Table */}
                  {esqlResult && (
                    <div className="overflow-x-auto mt-2">
                      <table className="w-full text-xs font-mono">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            {esqlResult.columns?.map((c: any, i: number) => (
                              <th key={i} className="pb-1.5 pr-4">{c.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {esqlResult.values?.map((row: any[], i: number) => (
                            <tr key={i}>
                              {row.map((val: any, j: number) => (
                                <td key={j} className="py-1.5 pr-4 text-slate-300">{String(val)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: CERT-In FORM (EXECUTIVE OFFICIAL ANNEXURE 1 VIEW) */}
              {activeTab === "certin" && (
                <div className={`border rounded-2xl overflow-hidden text-left transition-colors shadow-xl ${
                  isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200"
                }`}>
                  {/* Action Bar */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-sky-500" />
                      <span className="font-bold text-sm">Official CERT-In Annexure-1 Regulatory Document</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">
                        Section 70B IT Act Compliant
                      </span>
                    </div>
                    <button
                      onClick={handleDownloadPdf}
                      className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-sky-600/20 transition-all cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Official PDF (2 Pages)</span>
                    </button>
                  </div>

                  {/* Document Container */}
                  <div className={`p-6 max-w-4xl mx-auto my-4 rounded-xl border font-sans text-xs space-y-6 shadow-sm ${
                    isDark ? "bg-[#0B1120] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                  }`}>
                    {/* Official Document Header Banner */}
                    <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-[#0F1E36] to-slate-900 border border-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">
                          GOVERNMENT OF INDIA | MINISTRY OF ELECTRONICS & INFORMATION TECHNOLOGY
                        </div>
                        <div className="text-base font-black tracking-tight text-sky-400 mt-1">
                          INDIAN COMPUTER EMERGENCY RESPONSE TEAM (CERT-In)
                        </div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5">
                          CYBER SECURITY INCIDENT REPORTING FORM — ANNEXURE 1
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Mandatory Statutory Reporting under Section 70B of IT Act 2000 & CERT-In Directions 2022
                        </div>
                      </div>

                      <div className="bg-red-500/20 border border-red-500/40 p-3 rounded-xl text-right flex-shrink-0">
                        <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider">6-Hour Statutory SLA</div>
                        <div className="text-xs font-bold text-emerald-400 mt-0.5">Status: FILED IN TIME</div>
                        <div className="text-[10px] font-mono text-slate-300">Elapsed: 4.2 Minutes</div>
                      </div>
                    </div>

                    {/* Section 1.0 */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sky-500">
                        <span>1.0</span>
                        <span>ORGANISATION PARTICULARS & CISO NODAL CONTACT</span>
                      </div>
                      <div className="divide-y divide-slate-200 dark:divide-slate-800 border rounded-lg overflow-hidden text-xs">
                        <div className="grid grid-cols-3 p-2.5 bg-slate-50/50 dark:bg-slate-950/40">
                          <span className="font-semibold text-slate-500">1.1 Name of Organisation</span>
                          <span className="col-span-2 font-bold text-slate-900 dark:text-slate-100">Apex Commercial Bank of India Ltd</span>
                        </div>
                        <div className="grid grid-cols-3 p-2.5 bg-white dark:bg-[#0F172A]">
                          <span className="font-semibold text-slate-500">1.2 Regulatory Category</span>
                          <span className="col-span-2 text-slate-800 dark:text-slate-200">Banking & Financial Services (Scheduled Commercial Bank - RBI Supervised)</span>
                        </div>
                        <div className="grid grid-cols-3 p-2.5 bg-slate-50/50 dark:bg-slate-950/40">
                          <span className="font-semibold text-slate-500">1.3 CISO / Nodal Officer</span>
                          <span className="col-span-2 text-slate-800 dark:text-slate-200">Rajeshwar Varma (Chief Information Security Officer)</span>
                        </div>
                        <div className="grid grid-cols-3 p-2.5 bg-white dark:bg-[#0F172A]">
                          <span className="font-semibold text-slate-500">1.4 24x7 SOC Emergency Hotline</span>
                          <span className="col-span-2 font-mono text-slate-800 dark:text-slate-200">ciso-office@apexbank.in | soc-hotline@apexbank.in | +91-22-6889-0100</span>
                        </div>
                        <div className="grid grid-cols-3 p-2.5 bg-slate-50/50 dark:bg-slate-950/40">
                          <span className="font-semibold text-slate-500">1.5 Data Center & Cloud Infrastructure</span>
                          <span className="col-span-2 text-slate-800 dark:text-slate-200">Primary DC: Navi Mumbai Tier-IV | DR: Hyderabad | Cloud: AWS ap-south-1</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 2.0 */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sky-500">
                        <span>2.0</span>
                        <span>INCIDENT IDENTIFICATION & REGULATORY CLASSIFICATION</span>
                      </div>
                      <div className="divide-y divide-slate-200 dark:divide-slate-800 border rounded-lg overflow-hidden text-xs">
                        <div className="grid grid-cols-3 p-2.5 bg-slate-50/50 dark:bg-slate-950/40">
                          <span className="font-semibold text-slate-500">2.1 Incident Reference ID</span>
                          <span className="col-span-2 font-mono font-bold text-amber-500">{currentScenario.incident_id}</span>
                        </div>
                        <div className="grid grid-cols-3 p-2.5 bg-white dark:bg-[#0F172A]">
                          <span className="font-semibold text-slate-500">2.2 Detection Timestamp</span>
                          <span className="col-span-2 font-mono text-slate-800 dark:text-slate-200">{new Date().toUTCString()}</span>
                        </div>
                        <div className="grid grid-cols-3 p-2.5 bg-slate-50/50 dark:bg-slate-950/40">
                          <span className="font-semibold text-slate-500">2.3 CERT-In Category</span>
                          <span className="col-span-2 font-semibold text-red-500">{currentScenario.step1.certin_category}</span>
                        </div>
                        <div className="grid grid-cols-3 p-2.5 bg-white dark:bg-[#0F172A]">
                          <span className="font-semibold text-slate-500">2.4 Severity Assessment</span>
                          <span className="col-span-2 font-bold text-red-400">{currentScenario.severity} (Immediate Board Escalation)</span>
                        </div>
                        <div className="grid grid-cols-3 p-2.5 bg-slate-50/50 dark:bg-slate-950/40">
                          <span className="font-semibold text-slate-500">2.5 MITRE ATT&CK Mapping</span>
                          <span className="col-span-2 font-mono text-sky-400">{currentScenario.threat_tactic} ({currentScenario.mitre_id})</span>
                        </div>
                        <div className="grid grid-cols-3 p-2.5 bg-white dark:bg-[#0F172A]">
                          <span className="font-semibold text-slate-500">2.6 Impacted Banking Channel</span>
                          <span className="col-span-2 font-semibold text-slate-800 dark:text-slate-200">{currentScenario.payment_channel || currentScenario.step3.account_examples}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 3.0 */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sky-500">
                        <span>3.0</span>
                        <span>TECHNICAL FORENSICS & MULTI-IP INDICATORS OF COMPROMISE (IoCs)</span>
                      </div>
                      <div className="divide-y divide-slate-200 dark:divide-slate-800 border rounded-lg overflow-hidden text-xs font-mono">
                        <div className="grid grid-cols-3 p-2.5 bg-slate-50/50 dark:bg-slate-950/40">
                          <span className="font-sans font-semibold text-slate-500">3.1 Primary Attacker / C2 IP</span>
                          <span className="col-span-2 font-bold text-red-500">{currentScenario.attacker_ip} (Primary C2 Ingress)</span>
                        </div>
                        {currentScenario.attacker_ips && currentScenario.attacker_ips.length > 1 && (
                          <div className="grid grid-cols-3 p-2.5 bg-white dark:bg-[#0F172A]">
                            <span className="font-sans font-semibold text-slate-500">3.2 Botnet / Proxy / Tor Relays</span>
                            <span className="col-span-2 text-amber-400">{currentScenario.attacker_ips.slice(1).join(", ")}</span>
                          </div>
                        )}
                        <div className="grid grid-cols-3 p-2.5 bg-slate-50/50 dark:bg-slate-950/40">
                          <span className="font-sans font-semibold text-slate-500">3.3 Target Assets & Endpoints</span>
                          <span className="col-span-2 text-sky-400">{currentScenario.target_assets ? currentScenario.target_assets.join(", ") : currentScenario.affected_systems.join(", ")}</span>
                        </div>
                        <div className="grid grid-cols-3 p-2.5 bg-white dark:bg-[#0F172A]">
                          <span className="font-sans font-semibold text-slate-500">3.4 Compromised Credential / Key</span>
                          <span className="col-span-2 text-slate-300">{currentScenario.compromised_credentials || currentScenario.compromised_user}</span>
                        </div>
                        <div className="grid grid-cols-3 p-2.5 bg-slate-50/50 dark:bg-slate-950/40">
                          <span className="font-sans font-semibold text-slate-500">3.5 Malicious Hash / Payload ID</span>
                          <span className="col-span-2 text-slate-400 break-all">{currentScenario.payload_hash || "SHA256: 4f98d9e2b4510aa18992cde8710b14ea987b213f"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 4.0 */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sky-500">
                        <span>4.0</span>
                        <span>RUPEE FINANCIAL EXPOSURE & IMPACT ASSESSMENT</span>
                      </div>
                      <div className="divide-y divide-slate-200 dark:divide-slate-800 border rounded-lg overflow-hidden text-xs">
                        <div className="grid grid-cols-3 p-2.5 bg-slate-50/50 dark:bg-slate-950/40">
                          <span className="font-semibold text-slate-500">4.1 Direct Financial Risk (INR)</span>
                          <span className="col-span-2 font-mono font-black text-emerald-500 text-sm">
                            ₹ {currentScenario.direct_exposure_inr.toLocaleString("en-IN")}.00
                          </span>
                        </div>
                        <div className="grid grid-cols-3 p-2.5 bg-white dark:bg-[#0F172A]">
                          <span className="font-semibold text-slate-500">4.2 Customer Blast Radius</span>
                          <span className="col-span-2 font-semibold text-slate-800 dark:text-slate-200">
                            {currentScenario.step3.affected_accounts_total} Accounts ({currentScenario.step3.corporate_count} Corporate, {currentScenario.step3.hni_count} HNI)
                          </span>
                        </div>
                        <div className="grid grid-cols-3 p-2.5 bg-slate-50/50 dark:bg-slate-950/40">
                          <span className="font-semibold text-slate-500">4.3 Core Banking Integrity</span>
                          <span className="col-span-2 text-emerald-400 font-semibold">NORMAL (Unauthorized transactions intercepted & isolated in flight)</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 5.0 */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sky-500">
                        <span>5.0</span>
                        <span>REMEDIAL, MITIGATION & CONTAINMENT ACTIONS EXECUTED</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        {currentScenario.step4.actions.map((act, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50">
                            <div>
                              <span className="font-bold text-sky-400">5.{i+1} {act.title}:</span>{" "}
                              <span className="text-slate-400">{act.description}</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              EXECUTED
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 6.0: Certificate Seal */}
                    <div className="p-4 rounded-xl border border-sky-500/30 bg-gradient-to-br from-slate-950 via-[#0A1428] to-slate-950 text-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-bold text-sky-400 text-xs">
                          6.0 STATUTORY DECLARATION & FORMAL NODAL SIGN-OFF
                        </div>
                        <p className="text-[11px] text-slate-400 max-w-xl">
                          "Submitted in compliance with Section 70B of Information Technology Act 2000 & CERT-In Directions 2022. All telemetry, multiple threat vectors, and containment records are verified and cryptographically sealed."
                        </p>
                        <div className="text-xs font-bold text-slate-200 pt-1">
                          Digitally Authorized by: Rajeshwar Varma | Chief Information Security Officer (Apex Bank)
                        </div>
                      </div>

                      <div className="bg-red-500/20 border border-red-500/40 p-3 rounded-xl text-center flex-shrink-0">
                        <div className="text-[10px] font-bold text-red-400">OFFICIALLY SEALED</div>
                        <div className="text-[9px] font-mono text-slate-300">SHA-256 HASH VERIFIED</div>
                        <div className="text-[9px] font-mono text-emerald-400 font-bold mt-0.5">S3 WORM OBJECT LOCK</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: SARVAM INDIC */}
              {activeTab === "indic" && (
                <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
                  isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-sm font-bold text-sky-500">
                      <Globe className="h-4 w-4" />
                      Sarvam AI Indic Language Localization (Branch Triage)
                    </div>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                      { code: "hi", label: "हिन्दी (Hindi)" },
                      { code: "mr", label: "मराठी (Marathi)" },
                      { code: "gu", label: "ગુજરાતી (Gujarati)" },
                      { code: "ta", label: "தமிழ் (Tamil)" },
                      { code: "te", label: "తెలుగు (Telugu)" },
                      { code: "bn", label: "বাংলা (Bengali)" },
                      { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
                      { code: "ml", label: "മലയാളം (Malayalam)" },
                      { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
                      { code: "od", label: "ଓଡ଼ିଆ (Odia)" }
                    ].map((l) => (
                      <button
                        key={l.code}
                        onClick={() => handleTranslate(l.code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          selectedLang === l.code
                            ? "bg-sky-600 text-white shadow"
                            : isDark ? "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200" : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>

                  <div className={`p-4 rounded-xl border text-sm font-medium leading-relaxed ${
                    isDark ? "bg-slate-950 border-slate-800 text-sky-200" : "bg-sky-50/60 border-sky-200 text-slate-800"
                  }`}>
                    {isTranslating ? "Translating using Sarvam AI..." : translatedText}
                  </div>
                </div>
              )}

              {/* TAB 10: SHA-256 LEDGER */}
              {activeTab === "ledger" && (
                <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
                  isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-sm font-bold text-purple-500">
                      <Lock className="h-4 w-4" />
                      Immutable SHA-256 Forensic Audit Chain
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-400">AWS S3 WORM Sealed</span>
                  </div>

                  <div className={`p-4 rounded-xl border font-mono text-xs space-y-2.5 ${
                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div>
                      <span className="text-slate-400">Block Reference:</span>{" "}
                      <span className="text-purple-400 font-bold">{selectedIncId}-SEALED-BLOCK-105</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Current Block Hash:</span>{" "}
                      <span className="text-sky-400 break-all">{currentScenario.step6.block_hash}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Previous Block Hash:</span>{" "}
                      <span className="text-slate-500 break-all">{currentScenario.step6.prev_hash}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Merkle Root Hash:</span>{" "}
                      <span className="text-emerald-400 break-all">{currentScenario.step6.merkle_root}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RAW ECS INSPECT MODAL */}
      {inspectingEcs && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-2xl w-full rounded-2xl border p-6 shadow-2xl text-left ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="font-bold text-sm text-sky-400 flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Raw Elastic Common Schema (ECS) Payload
              </div>
              <button onClick={() => setInspectingEcs(null)} className="text-slate-400 hover:text-slate-200">
                <X className="h-4 w-4" />
              </button>
            </div>
            <pre className="mt-4 p-4 rounded-xl bg-slate-950 text-sky-300 font-mono text-xs overflow-x-auto max-h-96">
              {JSON.stringify(inspectingEcs, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* ESCALATE MODAL */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-lg w-full rounded-2xl border p-6 shadow-2xl text-left ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="font-bold text-sm text-purple-400 flex items-center gap-2">
                <Send className="h-4 w-4" />
                Dispatch Incident Escalation
              </div>
              <button onClick={() => setShowEscalateModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <p className="text-slate-400">Select notification channels to broadcast incident package <strong>{selectedIncId}</strong>:</p>
              <div className="space-y-2">
                {["Slack #soc-war-room", "PagerDuty CISO On-Call Rotation", "Jira Security Task (CERT-In Ticket)", "RBI CSIR Portal API"].map((ch, i) => (
                  <label key={i} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer ${
                    isDark ? "bg-slate-950 border-slate-800 hover:border-purple-500" : "bg-slate-50 border-slate-200 hover:border-purple-400"
                  }`}>
                    <input type="checkbox" defaultChecked className="rounded accent-purple-500" />
                    <span className="font-semibold text-slate-200">{ch}</span>
                  </label>
                ))}
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button onClick={() => setShowEscalateModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 font-bold">Cancel</button>
                <button onClick={() => { alert(`Incident ${selectedIncId} escalated to war room & CISO.`); setShowEscalateModal(false); }} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl font-bold">Dispatch Alerts</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
