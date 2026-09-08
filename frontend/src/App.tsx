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
      system: string;
      type: string;
      description: string;
    }[];
    containment_success_msg: string;
  };
  step5: {
    certin_title: string;
    affected_systems: string;
    remedial_summary: string;
  };
  step6: {
    sha256_hash: string;
    merkle_root: string;
    block_id: number;
  };
  topology: TopologyNode[];
  timeline: TimelineEvent[];
  copilot_prompts: AICopilotPrompt[];
  terminal: {
    default_query: string;
    preset1_label: string;
    preset1_query: string;
    preset2_label: string;
    preset2_query: string;
  };
  indic: {
    hi: string;
    mr: string;
    ta: string;
    te: string;
    bn: string;
  };
  escalation: {
    slack_channel: string;
    pagerduty_urgency: string;
    jira_summary: string;
  };
}

const SCENARIOS_DATA: ScenarioConfig[] = [
  {
    incident_id: "INC-2026-0902-01",
    title: "Privileged OAuth2 Token Theft & Unauthorized UPI Bulk Draining",
    severity: "CRITICAL",
    threat_tactic: "Privilege Escalation & Financial Fraud",
    mitre_id: "T1078.004",
    direct_exposure_inr: 18240000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 4,
    compromised_user: "svc_payment_gw",
    attacker_ip: "198.51.100.44",
    batch_id: "BATCH-20260902-8821",
    impact_summary: "Automated API key compromise draining merchant accounts via UPI high-risk velocity burst.",
    affected_systems: ["UPI Payment Gateway", "NPCI Inter-Bank Switch", "Core Banking IMPS Switch"],
    step1: {
      rbi_ref: "RBI/2021-22/Master-Direction-Payment-Security-Controls-Sec-4.2",
      certin_category: "CIAD-2022-04 Unauthorized Access & Financial Fraud",
      threshold_desc: "Direct financial exposure > ₹10,00,000 threshold & systemic payment gateway compromise.",
      clock_status: "Clock Running: 5h 48m remaining to submit Annexure-1",
      penalty_at_stake: "₹ 1,00,00,000 (Sec 70B Non-Compliance)",
      reasoning_bullet: "Critical velocity spike: 14 rapid UPI drains across 6 banks; OAuth2 token lacks IP pinning."
    },
    step2: {
      autonomous_detection_title: "Stage 1: Autonomous Threat Hunting (Zero Hardcoded IOCs)",
      autonomous_detection_query: "FROM logs-banking-*\n| WHERE bank.channel == \"UPI_GATEWAY\" AND bank.aml_risk_score > 85.0\n| STATS total_drained = sum(bank.amount_inr), tx_count = count() BY source.ip, user.name, bank.batch_id\n| WHERE tx_count >= 5 AND total_drained > 1000000.00\n| SORT total_drained DESC",
      autonomous_detection_explanation: "Identifies anomalous high-velocity aggregation across payment streams where AML risk is critical without prior knowledge of attacker IP.",
      forensic_blast_radius_title: "Stage 2: Lateral Movement & Blast Radius Pivot",
      forensic_blast_radius_query: "FROM logs-banking-*\n| WHERE source.ip == \"198.51.100.44\" OR user.name == \"svc_payment_gw\"\n| KEEP @timestamp, source.ip, user.name, bank.account_id, bank.amount_inr, bank.customer_tier, bank.beneficiary_vpa\n| SORT @timestamp DESC\n| LIMIT 10",
      discovered_entity: "198.51.100.44 (External Ingress IP)",
      compromised_id: "svc_payment_gw (OAuth2 Payment Daemon)",
      sample_table: {
        columns: ["@timestamp", "user.name", "bank.beneficiary_vpa", "bank.amount_inr", "bank.customer_tier"],
        rows: [
          ["2026-09-02T19:24:12Z", "svc_payment_gw", "merchant.bulk@yesbank", 4200000.00, "Corporate"],
          ["2026-09-02T19:24:35Z", "svc_payment_gw", "merchant.bulk@yesbank", 3800000.00, "Corporate"],
          ["2026-09-02T19:25:01Z", "svc_payment_gw", "merchant.bulk@yesbank", 2900000.00, "Corporate"],
          ["2026-09-02T19:25:28Z", "svc_payment_gw", "merchant.bulk@yesbank", 4140000.00, "Corporate"],
          ["2026-09-02T19:25:49Z", "svc_payment_gw", "merchant.bulk@yesbank", 3200000.00, "HNI"]
        ]
      }
    },
    step3: {
      corporate_count: 3,
      hni_count: 15,
      affected_accounts_total: 18,
      account_examples: "Tata Power Global, Reliance Retail Merchant, HNI-Apex-9901",
      business_risk_level: "CRITICAL (₹ 1.82 Crore Direct Exposure)",
      penalty_saved: "₹ 1,00,00,000 RBI Penalty Averted",
      core_systems_affected: "UPI Switch Cluster #3 (Mumbai DC)",
      accounts_table: [
        { account_id: "ACC-CORP-8812901", name: "Bharat Logistics Global Corp", tier: "Corporate", balance_inr: 28000000.00, exposed_inr: 6400000.00, status: "FROZEN_PRESERVED", branch: "Nariman Point, Mumbai" },
        { account_id: "ACC-CORP-4491023", name: "Zenith Retail Mega-Merchants", tier: "Corporate", balance_inr: 15400000.00, exposed_inr: 5800000.00, status: "FROZEN_PRESERVED", branch: "BKC Tech Hub, Mumbai" },
        { account_id: "ACC-CORP-1092834", name: "Kaveri Infra Solutions Ltd", tier: "Corporate", balance_inr: 9200000.00, exposed_inr: 3200000.00, status: "FROZEN_PRESERVED", branch: "Connaught Place, New Delhi" },
        { account_id: "ACC-HNI-9912041", name: "R. Singhania (Private Wealth)", tier: "HNI", balance_inr: 4500000.00, exposed_inr: 1440000.00, status: "FROZEN_PRESERVED", branch: "Indiranagar, Bengaluru" },
        { account_id: "ACC-HNI-3301928", name: "Dr. K. S. Venkatesh", tier: "HNI", balance_inr: 3800000.00, exposed_inr: 1400000.00, status: "FROZEN_PRESERVED", branch: "Banjara Hills, Hyderabad" }
      ]
    },
    step4: {
      actions: [
        { title: "Revoke OAuth2 Bearer Token", system: "API Gateway (WAF-Edge-01)", type: "IAM", description: "Immediately invalidate active bearer session for svc_payment_gw." },
        { title: "Drop Ingress IP 198.51.100.44", system: "Cloudflare / Perimeter Firewall", type: "Network", description: "Null-route all ingress packets from threat origin ASN." },
        { title: "Place Debit Freeze on Outbound Settlement Batch", system: "Core Banking Engine (CBS)", type: "Core Banking", description: "Suspend batch BATCH-20260902-8821 in NPCI clearing queue." }
      ],
      containment_success_msg: "Automated Containment Rules Dispatched: Token revoked, IP blocked, and ₹1.82 Cr payout queue halted."
    },
    step5: {
      certin_title: "CYBER SECURITY INCIDENT REPORTING FORM - ANNEXURE 1",
      affected_systems: "UPI Gateway / Merchant Settlement Switch",
      remedial_summary: "OAuth2 bearer token revoked, ingress IP null-routed, settlement batch quarantined."
    },
    step6: {
      sha256_hash: "0x7a3f89e219ba482c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c",
      merkle_root: "0x9c4172f8812e99a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5",
      block_id: 105
    },
    topology: [
      { id: "node-1", label: "External Threat Actor", type: "ATTACKER", ip: "198.51.100.44", geo: "Tor Exit / Offshore", status: "BLOCKED", protocol: "HTTPS / TLS 1.3", mitre_tag: "T1078.004 Valid Accounts", details: "Forged OAuth2 Bearer token with elevated payment dispatch privileges." },
      { id: "node-2", label: "WAF & API Gateway", type: "GATEWAY", ip: "10.0.4.12", geo: "AWS Mumbai (ap-south-1)", status: "ACTIVE", protocol: "REST / JSON", mitre_tag: "T1190 Exploit Public-Facing App", details: "Ingress point for svc_payment_gw API transactions." },
      { id: "node-3", label: "UPI Switch Cluster", type: "CORE_SYSTEM", ip: "10.0.8.50", geo: "Mumbai On-Prem DC", status: "ISOLATED", protocol: "ISO 8583 / NPCI API", mitre_tag: "T1565.001 Data Manipulation", details: "High-speed inter-bank routing switch for instant settlements." },
      { id: "node-4", label: "Core Banking System (CBS)", type: "TARGET", ip: "10.2.0.1", geo: "Secure Treasury Enclave", status: "FROZEN", protocol: "Finacle RPC", mitre_tag: "T1005 Data from Local System", details: "Debit accounts held across Corporate & HNI tiers." }
    ],
    timeline: [
      { offset: "+00:00", time: "19:15:02 UTC", title: "API Key Credential Theft", tactic: "Credential Access", source_ip: "198.51.100.44", description: "Attacker acquired valid OAuth2 refresh token from misconfigured staging CI/CD pipeline.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:15:02Z", "event.category": "authentication", "event.outcome": "success", "user.name": "svc_payment_gw", "source.ip": "198.51.100.44" } },
      { offset: "+00:09", time: "19:24:12 UTC", title: "Rapid UPI Drain Burst Initiated", tactic: "Execution", source_ip: "198.51.100.44", description: "14 parallel high-value UPI payout requests sent in 110 seconds.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:24:12Z", "bank.channel": "UPI_GATEWAY", "bank.amount_inr": 4200000.0, "bank.aml_risk_score": 98.4 } },
      { offset: "+00:11", time: "19:26:15 UTC", title: "Vigil Alert Zero Triggered", tactic: "Defense Evasion", source_ip: "10.0.8.50", description: "Vigil AI engine detected AML anomaly and velocity spike exceeding regulatory ceiling.", severity: "HIGH", raw_ecs: { "@timestamp": "2026-09-02T19:26:15Z", "alert.severity": "CRITICAL", "alert.engine": "VIGIL_TIER1_AGENT" } },
      { offset: "+00:13", time: "19:28:40 UTC", title: "Automated Containment Dispatched", tactic: "Remediation", source_ip: "10.0.4.12", description: "Token revoked, firewall null-route applied, payout settlement queue halted.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:28:40Z", "action": "REVOKE_TOKEN_AND_FREEZE", "status": "SUCCESS" } }
    ],
    copilot_prompts: [
      { question: "Detect high-value UPI drains with elevated AML risk score", esql_query: "FROM logs-banking-*\n| WHERE bank.channel == \"UPI_GATEWAY\" AND bank.aml_risk_score > 85.0\n| STATS total_drained = sum(bank.amount_inr), tx_count = count() BY source.ip, user.name, bank.batch_id\n| SORT total_drained DESC", explanation: "Aggregates transactions where AML score indicates extreme fraudulent behavior." },
      { question: "List all transactions initiated by service account svc_payment_gw", esql_query: "FROM logs-banking-*\n| WHERE user.name == \"svc_payment_gw\"\n| KEEP @timestamp, source.ip, bank.account_id, bank.amount_inr, bank.beneficiary_vpa\n| SORT @timestamp DESC\n| LIMIT 20", explanation: "Provides granular transaction audit trail for the compromised service account." },
      { question: "Identify all destination UPI VPAs receiving suspicious funds", esql_query: "FROM logs-banking-*\n| WHERE bank.aml_risk_score > 90.0\n| STATS total_received = sum(bank.amount_inr) BY bank.beneficiary_vpa\n| SORT total_received DESC", explanation: "Maps recipient mule VPAs to place inter-bank liens." }
    ],
    terminal: {
      default_query: "FROM logs-banking-*\n| WHERE bank.channel == \"UPI_GATEWAY\" AND bank.aml_risk_score > 85.0\n| STATS total_drained = sum(bank.amount_inr), tx_count = count() BY source.ip, user.name, bank.batch_id\n| SORT total_drained DESC\n| LIMIT 10",
      preset1_label: "⚡ Stage 1: Autonomous Detection",
      preset1_query: "FROM logs-banking-*\n| WHERE bank.channel == \"UPI_GATEWAY\" AND bank.aml_risk_score > 85.0\n| STATS total_drained = sum(bank.amount_inr), tx_count = count() BY source.ip, user.name, bank.batch_id",
      preset2_label: "🎯 Stage 2: Lateral Pivot",
      preset2_query: "FROM logs-banking-*\n| WHERE source.ip == \"198.51.100.44\" OR user.name == \"svc_payment_gw\"\n| KEEP @timestamp, source.ip, user.name, bank.account_id, bank.amount_inr, bank.customer_tier\n| LIMIT 10"
    },
    indic: {
      hi: "सुरक्षा अलर्ट: अनाधिकृत एपीआई कुंजी (OAuth2) द्वारा यूपीआई भुगतान गेटवे पर संदिग्ध निकासी का पता चला है। तत्काल प्रभाव से टोकन रद्द कर दिया गया है।\n\n📌 शाखा कार्रवाई: ₹ 1.82 करोड़ की संदिग्ध निकासी को रोक दिया गया है। संबंधित मर्चेंट खातों पर डेबिट रोक लगा दी गई है।",
      mr: "सुरक्षा सूचना: अनधिकृत एपीआई टोकन वापरून यूपीआई गेटवेवरून संशयास्पद रक्कम काढण्याचा प्रयत्न झाला आहे. टोकन तात्काळ रद्द करण्यात आले आहे.\n\n📌 शाखा कृती: ₹ 1.82 कोटींचा व्यवहार रोखण्यात आला असून सर्व खाती सुरक्षित करण्यात आली आहेत.",
      ta: "பாதுகாப்பு எச்சரிக்கை: அங்கீகரிக்கப்படாத API டோக்கன் மூலம் UPI பணப் பரிவர்த்தனை முயற்சி கண்டறியப்பட்டது. டோக்கன் உடனடியாக ரத்து செய்யப்பட்டது.\n\n📌 கிளை நடவடிக்கை: ₹ 1.82 கோடி பரிவர்த்தனை முடக்கப்பட்டது. தொடர்புடைய கணக்குகள் பாதுகாக்கப்பட்டுள்ளன.",
      te: "భద్రతా హెచ్చరిక: అనధికారిక API టోకెన్ ద్వారా UPI చెల్లింపు గేట్‌వేలో అనుమానాస్పద లావాదేవీలు గుర్తించబడ్డాయి. టోకెన్ రద్దు చేయబడింది.\n\n📌 బ్రాంచ్ చర్య: ₹ 1.82 కోట్ల అనుమానాస్పద చెల్లింపులు నిలిపివేయబడ్డాయి.",
      bn: "নিরাপত্তা সতর্কতা: অননুমোদিত API কী ব্যবহার করে UPI গেটওয়েতে সন্দেহজনক লেনদেন শনাক্ত হয়েছে। টোকেন অবিলম্বে বাতিল করা হয়েছে।\n\n📌 শাখা পদক্ষেপ: ₹ 1.82 কোটি টাকার লেনদেন স্থগিত করা হয়েছে।"
    },
    escalation: {
      slack_channel: "#soc-tier1-critical-alerts",
      pagerduty_urgency: "P1 (IMMEDIATE ESCALATION)",
      jira_summary: "[CRITICAL] OAuth2 Token Compromise - UPI Bulk Gateway Drain - Ref INC-2026-0902-01"
    }
  },
  {
    incident_id: "INC-2026-0902-02",
    title: "Distributed Botnet Credential Stuffing on NetBanking & IMPS Velocity Abuse",
    severity: "HIGH",
    threat_tactic: "Credential Access / Brute Force",
    mitre_id: "T1110.004",
    direct_exposure_inr: 4250000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 3,
    compromised_user: "corporate_salary_admin",
    attacker_ip: "203.0.113.89",
    batch_id: "IMPS-BURST-9912",
    impact_summary: "Distributed IP botnet executing credential stuffing against NetBanking portal targeting corporate payout accounts.",
    affected_systems: ["NetBanking Web Ingress", "IMPS Immediate Payment Switch", "IAM Multi-Factor Engine"],
    step1: {
      rbi_ref: "RBI/2022-23/Master-Direction-Information-Security-Controls-Sec-5.1",
      certin_category: "CIAD-2022-01 Credential Access & Automated Botnet Attacks",
      threshold_desc: "Over 500 failed logins in 3 minutes followed by unauthorized outbound high-value IMPS transfers.",
      clock_status: "Clock Running: 5h 52m remaining to submit Annexure-1",
      penalty_at_stake: "₹ 50,00,000 (Regulatory Non-Compliance)",
      reasoning_bullet: "Distributed brute-force pattern across 45 IP addresses targeting high-balance corporate payroll credentials."
    },
    step2: {
      autonomous_detection_title: "Stage 1: Autonomous Threat Hunting (Velocity Anomaly)",
      autonomous_detection_query: "FROM logs-auth-*\n| WHERE event.category == \"authentication\" AND event.outcome == \"failure\"\n| STATS fail_count = count() BY source.ip, user.name\n| WHERE fail_count > 10\n| SORT fail_count DESC",
      autonomous_detection_explanation: "Detects distributed brute force clusters exceeding baseline threshold.",
      forensic_blast_radius_title: "Stage 2: Outbound IMPS Correlated Transfers",
      forensic_blast_radius_query: "FROM logs-banking-*\n| WHERE bank.channel == \"IMPS\" AND user.name == \"corporate_salary_admin\"\n| KEEP @timestamp, source.ip, bank.account_id, bank.amount_inr, bank.beneficiary_vpa\n| SORT @timestamp DESC",
      discovered_entity: "203.0.113.89 (Botnet Proxy Head)",
      compromised_id: "corporate_salary_admin (Corporate IAM Session)",
      sample_table: {
        columns: ["@timestamp", "user.name", "bank.channel", "bank.amount_inr", "event.outcome"],
        rows: [
          ["2026-09-02T19:30:11Z", "corporate_salary_admin", "IMPS", 1250000.00, "pending"],
          ["2026-09-02T19:30:45Z", "corporate_salary_admin", "IMPS", 1500000.00, "pending"],
          ["2026-09-02T19:31:02Z", "corporate_salary_admin", "IMPS", 1500000.00, "pending"]
        ]
      }
    },
    step3: {
      corporate_count: 5,
      hni_count: 2,
      affected_accounts_total: 7,
      account_examples: "Mahindra Heavy Corp, Godrej Logistics, HNI-Apex-102",
      business_risk_level: "HIGH (₹ 42.5 Lakhs at Risk)",
      penalty_saved: "₹ 50,00,000 Saved",
      core_systems_affected: "NetBanking Web Farm & IMPS Switch",
      accounts_table: [
        { account_id: "ACC-CORP-7719203", name: "Mahindra Heavy Precision Corp", tier: "Corporate", balance_inr: 12000000.00, exposed_inr: 2500000.00, status: "FROZEN_PRESERVED", branch: "Worli Corporate, Mumbai" },
        { account_id: "ACC-CORP-6628194", name: "Godrej Logistics Eastern Hub", tier: "Corporate", balance_inr: 8900000.00, exposed_inr: 1750000.00, status: "FROZEN_PRESERVED", branch: "Park Street, Kolkata" }
      ]
    },
    step4: {
      actions: [
        { title: "Enforce WAF Geo-IP & Threat Intel Block", system: "Cloudflare WAF", type: "Network", description: "Block ASN range originating botnet credential stuffing wave." },
        { title: "Force Terminate Corporate IAM Sessions", system: "Active Directory / Okta", type: "IAM", description: "Kill active session tokens and enforce mandatory MFA step-up." },
        { title: "Freeze Outbound IMPS Queue", system: "NPCI IMPS Switch", type: "Payment", description: "Hold batch IMPS-BURST-9912 awaiting SOC human clearance." }
      ],
      containment_success_msg: "Botnet ingress blocked, IAM credentials rotated, and ₹42.5L IMPS transfers preserved."
    },
    step5: {
      certin_title: "CYBER SECURITY INCIDENT REPORTING FORM - ANNEXURE 1",
      affected_systems: "NetBanking Web Farm & IMPS Gateway",
      remedial_summary: "Distributed botnet IPs blocked, force password rotation applied on impacted corporate admins."
    },
    step6: {
      sha256_hash: "0x3f9a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
      merkle_root: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      block_id: 106
    },
    topology: [
      { id: "node-1", label: "Distributed Botnet Nodes", type: "ATTACKER", ip: "203.0.113.89", geo: "Multi-Region Proxy", status: "BLOCKED", protocol: "HTTP / REST", mitre_tag: "T1110.004 Credential Stuffing", details: "Rotating user agents testing leaked credential dictionaries." },
      { id: "node-2", label: "NetBanking Reverse Proxy", type: "GATEWAY", ip: "10.0.3.15", geo: "AWS Mumbai", status: "ACTIVE", protocol: "HTTPS", mitre_tag: "T1190 Ingress Vulnerability", details: "Rate-limiting threshold breached." },
      { id: "node-3", label: "IMPS Outbound Gateway", type: "TARGET", ip: "10.0.9.11", geo: "Mumbai DC", status: "ISOLATED", protocol: "ISO 8583", mitre_tag: "T1565.001 Account Tampering", details: "Held in escrow pending SOC verification." }
    ],
    timeline: [
      { offset: "+00:00", time: "19:28:10 UTC", title: "Botnet Credential Burst Started", tactic: "Initial Access", source_ip: "203.0.113.89", description: "520 login attempts in 180 seconds across 40 corporate accounts.", severity: "HIGH", raw_ecs: { "@timestamp": "2026-09-02T19:28:10Z", "event.category": "authentication", "event.outcome": "failure" } },
      { offset: "+00:02", time: "19:30:11 UTC", title: "Successful Login on Admin Account", tactic: "Privilege Escalation", source_ip: "203.0.113.89", description: "Attacker authenticated into corporate_salary_admin account.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:30:11Z", "user.name": "corporate_salary_admin", "event.outcome": "success" } },
      { offset: "+00:04", time: "19:32:00 UTC", title: "Vigil Botnet Quarantine Applied", tactic: "Remediation", source_ip: "10.0.3.15", description: "Vigil automated rule blocked botnet IPs and quarantined IMPS queue.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:32:00Z", "action": "BLOCK_BOTNET" } }
    ],
    copilot_prompts: [
      { question: "List top IPs generating failed logins in last 1 hour", esql_query: "FROM logs-auth-*\n| WHERE event.outcome == \"failure\"\n| STATS fails = count() BY source.ip\n| SORT fails DESC\n| LIMIT 10", explanation: "Shows external IPs actively brute forcing credentials." }
    ],
    terminal: {
      default_query: "FROM logs-auth-*\n| WHERE event.outcome == \"failure\"\n| STATS fail_count = count() BY source.ip, user.name\n| WHERE fail_count >= 5\n| SORT fail_count DESC\n| LIMIT 10",
      preset1_label: "⚡ Failed Login Heatmap",
      preset1_query: "FROM logs-auth-*\n| WHERE event.outcome == \"failure\"\n| STATS fail_count = count() BY source.ip",
      preset2_label: "🎯 Targeted Accounts",
      preset2_query: "FROM logs-auth-*\n| STATS success_rate = count() BY user.name\n| LIMIT 10"
    },
    indic: {
      hi: "सुरक्षा सूचना: नेटबैंकिंग पोर्टल पर बॉटनेट क्रेडेंशियल स्टफिंग का प्रयास पकड़ा गया। कॉर्पोरेट सैलरी एडमिन अकाउंट को सुरक्षित कर दिया गया है।\n\n📌 शाखा कार्रवाई: ₹ 42.5 लाख के आईएमपीएस ट्रांसफर रोक दिए गए हैं।",
      mr: "सुरक्षा सूचना: नेटबँकिंग पोर्टलवर बॉटनेटकडून मोठा हल्ला झाला आहे. सर्व संशयित खाती तात्काळ सुरक्षित करण्यात आली आहेत.\n\n📌 शाखा कृती: ₹ 42.5 लाखांचे व्यवहार रोखण्यात आले आहेत.",
      ta: "பாதுகாப்பு தகவல்: நெட்பேங்கிங் தளத்தில் பாட்நெட் தாக்குதல் தடுக்கப்பட்டது. கார்ப்பரேட் கணக்குகள் பாதுகாக்கப்பட்டுள்ளன.\n\n📌 கிளை நடவடிக்கை: ₹ 42.5 லட்சம் பரிவர்த்தனை நிறுத்தி வைக்கப்பட்டது.",
      te: "భద్రతా సమాచారం: నెట్‌బ్యాంకింగ్ పోర్టల్‌పై బాట్‌నెట్ దాడి విఫలం చేయబడింది.\n\n📌 బ్రాంచ్ చర్య: ₹ 42.5 లక్షల బదిలీలు నిలిపివేయబడ్డాయి.",
      bn: "নিরাপত্তা তথ্য: নেটব্যাঙ্কিং পোর্টালে বটনেট আক্রমণ প্রতিহত করা হয়েছে।\n\n📌 শাখা পদক্ষেপ: ₹ 42.5 লক্ষ টাকার ট্রান্সফার আটকানো হয়েছে।"
    },
    escalation: {
      slack_channel: "#soc-tier1-botnet-alerts",
      pagerduty_urgency: "P2 (HIGH PRIORITY)",
      jira_summary: "[HIGH] Distributed Credential Stuffing & IMPS Velocity Abuse - Ref INC-2026-0902-02"
    }
  },
  {
    incident_id: "INC-2026-0902-03",
    title: "ATM Switch-In-The-Middle ISO 8583 Response Code Tampering",
    severity: "CRITICAL",
    threat_tactic: "Man-in-the-Middle / Data Tampering",
    mitre_id: "T1557",
    direct_exposure_inr: 34000000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 4,
    compromised_user: "switch_daemon_vlan8",
    attacker_ip: "10.14.88.22",
    batch_id: "ATM-SWITCH-CLUSTER-04",
    impact_summary: "Rogue network tap on internal ATM switch altering ISO 8583 response codes from '51' (Insufficient Funds) to '00' (Approved).",
    affected_systems: ["ATM Switch Controller", "Hardware Security Module (HSM)", "Core Debit Engine"],
    step1: {
      rbi_ref: "RBI/2020-21/Cyber-Security-Framework-for-Banks-Appendix-G",
      certin_category: "CIAD-2022-03 Man-in-the-Middle & Core Protocol Tampering",
      threshold_desc: "Core banking protocol compromise directly impacting ATM cash dispense authorization.",
      clock_status: "Clock Running: 5h 44m remaining to submit Annexure-1",
      penalty_at_stake: "₹ 1,00,00,000 (Critical Infrastructure Violation)",
      reasoning_bullet: "Altering authorization messages from decline to approve enables unlimited off-us cash dispensing."
    },
    step2: {
      autonomous_detection_title: "Stage 1: Autonomous Threat Hunting (ATM Protocol Drift)",
      autonomous_detection_query: "FROM logs-banking-*\n| WHERE bank.channel == \"ATM_SWITCH\" AND bank.amount_inr > 20000.00\n| STATS total_dispensed = sum(bank.amount_inr), tx_count = count() BY source.ip, bank.batch_id\n| WHERE total_dispensed > 5000000.00",
      autonomous_detection_explanation: "Detects unauthorized aggregate cash dispense spikes bypassing core balances.",
      forensic_blast_radius_title: "Stage 2: ATM Terminal Blast Radius",
      forensic_blast_radius_query: "FROM logs-banking-*\n| WHERE source.ip == \"10.14.88.22\"\n| KEEP @timestamp, bank.account_id, bank.amount_inr, bank.batch_id\n| LIMIT 10",
      discovered_entity: "10.14.88.22 (Internal Rogue Switch Tap)",
      compromised_id: "switch_daemon_vlan8 (ATM Authorization Daemon)",
      sample_table: {
        columns: ["@timestamp", "bank.batch_id", "bank.amount_inr", "bank.channel"],
        rows: [
          ["2026-09-02T19:40:02Z", "ATM-SWITCH-CLUSTER-04", 1000000.00, "ATM_SWITCH"],
          ["2026-09-02T19:40:22Z", "ATM-SWITCH-CLUSTER-04", 1000000.00, "ATM_SWITCH"],
          ["2026-09-02T19:40:45Z", "ATM-SWITCH-CLUSTER-04", 1000000.00, "ATM_SWITCH"]
        ]
      }
    },
    step3: {
      corporate_count: 0,
      hni_count: 12,
      affected_accounts_total: 12,
      account_examples: "ATM Regional Cluster 04 (Delhi NCR, Bengaluru, Mumbai)",
      business_risk_level: "CRITICAL (₹ 3.40 Crore Potential Cash Dispense)",
      penalty_saved: "₹ 1,00,00,000 Regulatory Penalty Averted",
      core_systems_affected: "ATM Switch Cluster #4 & HSM Zone",
      accounts_table: [
        { account_id: "ACC-ATM-990182", name: "ATM Terminal Cluster 04-North", tier: "HNI", balance_inr: 50000000.00, exposed_inr: 12000000.00, status: "FROZEN_PRESERVED", branch: "Regional ATM Switch, Delhi" },
        { account_id: "ACC-ATM-441209", name: "ATM Terminal Cluster 04-West", tier: "HNI", balance_inr: 45000000.00, exposed_inr: 11000000.00, status: "FROZEN_PRESERVED", branch: "Regional ATM Switch, Mumbai" },
        { account_id: "ACC-ATM-330199", name: "ATM Terminal Cluster 04-South", tier: "HNI", balance_inr: 38000000.00, exposed_inr: 11000000.00, status: "FROZEN_PRESERVED", branch: "Regional ATM Switch, Bengaluru" }
      ]
    },
    step4: {
      actions: [
        { title: "Isolate Switch Interface 10.14.88.22", system: "Cisco Core Switch VLAN 8", type: "Network", description: "Quarantine rogue tap port to sinkhole VLAN." },
        { title: "Rotate HSM MAC Keys", system: "Thales HSM Enclave", type: "Crypto", description: "Force instant key rotation for ISO 8583 message authentication codes." },
        { title: "Force Synchronous Host Ledger Verification", system: "Core Banking Engine", type: "Core Banking", description: "Disable stand-in processing (STIP) mode across all ATM controllers." }
      ],
      containment_success_msg: "ATM switch port quarantined, HSM keys rotated, and stand-in authorization halted."
    },
    step5: {
      certin_title: "CYBER SECURITY INCIDENT REPORTING FORM - ANNEXURE 1",
      affected_systems: "ATM Switch Controller & ISO 8583 Parser",
      remedial_summary: "Rogue tap quarantined, HSM zone rotated, stand-in offline mode disabled."
    },
    step6: {
      sha256_hash: "0x8e5a77192834bba9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3",
      merkle_root: "0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c",
      block_id: 107
    },
    topology: [
      { id: "node-1", label: "Internal Switch Tap", type: "ATTACKER", ip: "10.14.88.22", geo: "Internal DC Tap", status: "ISOLATED", protocol: "ISO 8583 Raw TCP", mitre_tag: "T1557 MITM Tampering", details: "Forging response packets on VLAN 8." },
      { id: "node-2", label: "ATM Switch Hub", type: "CORE_SYSTEM", ip: "10.0.12.1", geo: "Mumbai DC", status: "ACTIVE", protocol: "ISO 8583", mitre_tag: "T1565 Data Manipulation", details: "Switch controller for 1,200 ATMs." },
      { id: "node-3", label: "Thales HSM Zone", type: "TARGET", ip: "10.0.14.5", geo: "Secure Cryptographic Vault", status: "FROZEN", protocol: "PKCS#11", mitre_tag: "T1552 Unsecured Keys", details: "MAC verification rotated." }
    ],
    timeline: [
      { offset: "+00:00", time: "19:38:00 UTC", title: "Rogue ARP Poisoning on Switch VLAN", tactic: "Lateral Movement", source_ip: "10.14.88.22", description: "Internal rogue device intercepted ATM switch traffic.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:38:00Z", "network.protocol": "arp", "source.ip": "10.14.88.22" } },
      { offset: "+00:02", time: "19:40:02 UTC", title: "ISO 8583 Response Code 00 Forgery", tactic: "Impact", source_ip: "10.14.88.22", description: "Declined transactions altered to Approved in transit.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:40:02Z", "bank.amount_inr": 1000000.0, "bank.channel": "ATM_SWITCH" } },
      { offset: "+00:04", time: "19:42:15 UTC", title: "Vigil Instant Switch Quarantine", tactic: "Remediation", source_ip: "10.0.12.1", description: "Vigil automated protocol validator dropped rogue tap and enforced synchronous host mode.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:42:15Z", "action": "SINKHOLE_VLAN" } }
    ],
    copilot_prompts: [
      { question: "Audit all ATM switch transactions exceeding ₹50,000", esql_query: "FROM logs-banking-*\n| WHERE bank.channel == \"ATM_SWITCH\" AND bank.amount_inr > 50000.00\n| STATS total_dispensed = sum(bank.amount_inr) BY source.ip, bank.batch_id\n| SORT total_dispensed DESC", explanation: "Identifies anomalies in ATM cash dispensing." }
    ],
    terminal: {
      default_query: "FROM logs-banking-*\n| WHERE bank.channel == \"ATM_SWITCH\"\n| STATS total_cash = sum(bank.amount_inr), count = count() BY bank.batch_id\n| SORT total_cash DESC\n| LIMIT 10",
      preset1_label: "⚡ ATM Cash Anomaly",
      preset1_query: "FROM logs-banking-*\n| WHERE bank.channel == \"ATM_SWITCH\" AND bank.amount_inr > 20000.00\n| STATS sum(bank.amount_inr) BY source.ip",
      preset2_label: "🎯 Terminal Drift",
      preset2_query: "FROM logs-banking-*\n| WHERE bank.channel == \"ATM_SWITCH\"\n| KEEP @timestamp, source.ip, bank.amount_inr"
    },
    indic: {
      hi: "सुरक्षा सूचना: एटीएम स्विच नेटवर्क पर एमआईटीएम (MITM) हमले का पता चला है। फर्जी अप्रूवल कोड तुरंत रद्द कर दिए गए हैं।\n\n📌 शाखा कार्रवाई: ₹ 3.40 करोड़ की अनधिकृत निकासी रोक दी गई है और एटीएम स्विच को सुरक्षित कर दिया गया है।",
      mr: "सुरक्षा सूचना: एटीएम स्विच नेटवर्कवरील बनावट व्यवहार तात्काळ रोखण्यात आले आहेत.\n\n📌 शाखा कृती: ₹ 3.40 कोटींचे नुकसान टाळले गेले आहे.",
      ta: "பாதுகாப்பு எச்சரிக்கை: ஏடிஎம் சுவிட்ச் நெட்வொர்க் முறைகேடு கண்டறியப்பட்டு தடுக்கப்பட்டது.\n\n📌 கிளை நடவடிக்கை: ₹ 3.40 கோடி பணப் பாதுகாப்பு உறுதி செய்யப்பட்டது.",
      te: "భద్రతా సమాచారం: ఏటీఎం స్విచ్ నెట్‌వర్క్‌లో మోసపూరిత లావాదేవీలు నిలిపివేయబడ్డాయి.\n\n📌 బ్రాంచ్ చర్య: ₹ 3.40 కోట్ల నష్టం నివారించబడింది.",
      bn: "নিরাপত্তা তথ্য: এটিএম সুইচ নেটওয়ার্কে জালিয়াতি প্রতিহত করা হয়েছে।\n\n📌 শাখা পদক্ষেপ: ₹ 3.40 কোটি টাকা সুরক্ষিত রাখা হয়েছে।"
    },
    escalation: {
      slack_channel: "#soc-tier1-switch-alerts",
      pagerduty_urgency: "P1 (CRITICAL INCIDENT)",
      jira_summary: "[CRITICAL] ATM Switch ISO 8583 Response Code Tampering - Ref INC-2026-0902-03"
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
    current_step: 4,
    compromised_user: "usr_loan_off_104",
    attacker_ip: "10.2.14.105",
    batch_id: "LOAN-DISBURSE-QUEUE-12",
    impact_summary: "Rogue branch officer approving fraudulent loan applications and disbursing funds to personal mule accounts.",
    affected_systems: ["CBS Loan Engine", "Branch Terminal Gateway", "Aadhaar KYC Service"],
    step1: {
      rbi_ref: "RBI/2021-22/Internal-Fraud-Prevention-Guidelines-Sec-3.4",
      certin_category: "CIAD-2022-04 Insider Threat & Fraudulent Ledger Entries",
      threshold_desc: "Internal employee privilege abuse bypassing maker-checker loan verification.",
      clock_status: "Clock Running: 5h 50m remaining to submit Annexure-1",
      penalty_at_stake: "₹ 50,00,000 (Internal Controls Failure)",
      reasoning_bullet: "12 loans disbursed at midnight outside operating hours to accounts created <24h ago."
    },
    step2: {
      autonomous_detection_title: "Stage 1: Autonomous Threat Hunting (Off-Hours Disbursals)",
      autonomous_detection_query: "FROM logs-banking-*\n| WHERE bank.channel == \"CBS_LOAN\" AND bank.aml_risk_score >= 90.0\n| STATS total_disbursed = sum(bank.amount_inr), count = count() BY user.name, source.ip",
      autonomous_detection_explanation: "Flags loan disbursements executed during non-operational hours with extreme AML scores.",
      forensic_blast_radius_title: "Stage 2: Mule Recipient Accounts Pivot",
      forensic_blast_radius_query: "FROM logs-banking-*\n| WHERE user.name == \"usr_loan_off_104\"\n| KEEP @timestamp, bank.account_id, bank.amount_inr, bank.beneficiary_vpa\n| LIMIT 10",
      discovered_entity: "10.2.14.105 (Branch LAN Terminal)",
      compromised_id: "usr_loan_off_104 (Branch Loan Officer)",
      sample_table: {
        columns: ["@timestamp", "user.name", "bank.account_id", "bank.amount_inr"],
        rows: [
          ["2026-09-02T19:48:10Z", "usr_loan_off_104", "ACC-MULE-101", 240000.00],
          ["2026-09-02T19:49:15Z", "usr_loan_off_104", "ACC-MULE-102", 235000.00],
          ["2026-09-02T19:50:00Z", "usr_loan_off_104", "ACC-MULE-103", 250000.00]
        ]
      }
    },
    step3: {
      corporate_count: 0,
      hni_count: 12,
      affected_accounts_total: 12,
      account_examples: "12 Flagged Auto-Loan Accounts (Branch 104, Surat)",
      business_risk_level: "HIGH (₹ 28.0 Lakhs at Risk)",
      penalty_saved: "₹ 50,00,000 Penalty Saved",
      core_systems_affected: "Finacle CBS Loan Origination Module",
      accounts_table: [
        { account_id: "ACC-MULE-991201", name: "Flagged Auto Loan #01", tier: "HNI", balance_inr: 240000.00, exposed_inr: 240000.00, status: "FROZEN_PRESERVED", branch: "Ring Road Branch, Surat" },
        { account_id: "ACC-MULE-991202", name: "Flagged Auto Loan #02", tier: "HNI", balance_inr: 235000.00, exposed_inr: 235000.00, status: "FROZEN_PRESERVED", branch: "Ring Road Branch, Surat" }
      ]
    },
    step4: {
      actions: [
        { title: "Suspend Active Directory Account", system: "Active Directory (AD-DC-02)", type: "IAM", description: "Disable usr_loan_off_104 and revoke terminal session." },
        { title: "Halt Outbound NEFT Clearing", system: "RBI NEFT Clearing Gateway", type: "Core Banking", description: "Hold outbound credit settlement for batch LOAN-DISBURSE-QUEUE-12." },
        { title: "Place Debit Lien on Mule Accounts", system: "Core Banking Engine (CBS)", type: "Core Banking", description: "Freeze funds across 12 beneficiary mule accounts." }
      ],
      containment_success_msg: "Insider user suspended, NEFT settlement queue halted, and 12 mule accounts frozen."
    },
    step5: {
      certin_title: "CYBER SECURITY INCIDENT REPORTING FORM - ANNEXURE 1",
      affected_systems: "CBS Loan Disbursal & Branch Terminal Gateway",
      remedial_summary: "Insider AD credentials revoked, NEFT payout suspended, debit freezes enforced."
    },
    step6: {
      sha256_hash: "0x2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
      merkle_root: "0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
      block_id: 108
    },
    topology: [
      { id: "node-1", label: "Branch Officer Terminal", type: "ATTACKER", ip: "10.2.14.105", geo: "Surat Branch LAN", status: "ISOLATED", protocol: "RDP / Internal LAN", mitre_tag: "T1078 Valid Accounts", details: "Executing off-hours bulk loan disbursals." },
      { id: "node-2", label: "CBS Loan Module", type: "TARGET", ip: "10.0.1.10", geo: "Central DC", status: "FROZEN", protocol: "Finacle RPC", mitre_tag: "T1565 Data Manipulation", details: "Disbursal queue halted." }
    ],
    timeline: [
      { offset: "+00:00", time: "19:46:00 UTC", title: "Off-Hours Login Detected", tactic: "Initial Access", source_ip: "10.2.14.105", description: "Branch loan officer logged in at 23:46 off-hours.", severity: "HIGH", raw_ecs: { "@timestamp": "2026-09-02T19:46:00Z", "user.name": "usr_loan_off_104" } },
      { offset: "+00:03", time: "19:49:15 UTC", title: "12 Bulk Loans Approved Without Dual Auth", tactic: "Impact", source_ip: "10.2.14.105", description: "Maker-checker bypass triggered on ₹28.0 Lakhs in auto-loans.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:49:15Z", "bank.amount_inr": 2800000.0 } },
      { offset: "+00:06", time: "19:52:30 UTC", title: "Vigil Insider Isolation", tactic: "Remediation", source_ip: "10.0.1.10", description: "Account suspended and debit liens placed on all 12 mule accounts.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:52:30Z", "action": "SUSPEND_USER_AND_LIEN" } }
    ],
    copilot_prompts: [
      { question: "List loan disbursements executed after hours with high AML score", esql_query: "FROM logs-banking-*\n| WHERE bank.channel == \"CBS_LOAN\" AND bank.aml_risk_score > 85.0\n| KEEP @timestamp, user.name, bank.amount_inr, bank.account_id", explanation: "Detects internal fraud during non-operational hours." }
    ],
    terminal: {
      default_query: "FROM logs-banking-*\n| WHERE bank.channel == \"CBS_LOAN\"\n| STATS sum(bank.amount_inr) BY user.name\n| LIMIT 10",
      preset1_label: "⚡ Loan Disbursal Velocity",
      preset1_query: "FROM logs-banking-*\n| WHERE bank.channel == \"CBS_LOAN\"\n| STATS count(), sum(bank.amount_inr) BY user.name",
      preset2_label: "🎯 Mule Beneficiaries",
      preset2_query: "FROM logs-banking-*\n| WHERE user.name == \"usr_loan_off_104\"\n| KEEP @timestamp, bank.amount_inr, bank.account_id"
    },
    indic: {
      hi: "सुरक्षा सूचना: शाखा स्तर पर अनधिकृत लोन वितरण का प्रयास पकड़ा गया। संबंधित अधिकारी का खाता तुरंत निलंबित कर दिया गया है।\n\n📌 शाखा कार्रवाई: ₹ 28.0 लाख के सभी 12 म्यूल खातों पर रोक लगा दी गई है।",
      mr: "सुरक्षा सूचना: शाखेतून अनधिकृत कर्ज वाटपाचा प्रयत्न रोखण्यात आला आहे.\n\n📌 शाखा कृती: ₹ 28.0 लाखांची सर्व खाती गोठवण्यात आली आहेत.",
      ta: "பாதுகாப்பு தகவல்: கிளை அளவில் கடன் முறைகேடு தடுக்கப்பட்டது.\n\n📌 கிளை நடவடிக்கை: ₹ 28.0 லட்சம் நிதி பாதுகாக்கப்பட்டு கணக்குகள் முடக்கப்பட்டன.",
      te: "భద్రతా సమాచారం: బ్రాంచ్ లోన్ అధికారి అనధికారిక లావాదేవీలు నిలిపివేయబడ్డాయి.\n\n📌 బ్రాంచ్ చర్య: ₹ 28.0 లక్షల నిధులు ఫ్రీజ్ చేయబడ్డాయి.",
      bn: "নিরাপত্তা তথ্য: শাখা স্তরে অননুমোদিত ঋণ বিতরণ প্রতিহত করা হয়েছে।\n\n📌 শাখা পদক্ষেপ: ₹ 28.0 লক্ষ টাকা সুরক্ষিত রাখা হয়েছে।"
    },
    escalation: {
      slack_channel: "#soc-tier1-insider-threats",
      pagerduty_urgency: "P2 (HIGH PRIORITY)",
      jira_summary: "[HIGH] Insider KYC Bypass & Auto-Loan Disbursal Tampering - Ref INC-2026-0902-04"
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
    attacker_ip: "10.0.1.1",
    batch_id: "MONTHLY-INTEREST-CALC-2026",
    impact_summary: "High volume monthly interest calculation batch verified against maintenance calendar; benign false alarm suppressed.",
    affected_systems: ["CBS Batch Engine", "Savings Deposit Sub-Ledger"],
    step1: {
      rbi_ref: "RBI/2021-22/Batch-Processing-Exemptions-Sec-2.1",
      certin_category: "BENIGN_SCHEDULED_MAINTENANCE",
      threshold_desc: "Pre-approved monthly maintenance window. AML risk score < 5.0 across all records.",
      clock_status: "NO FILING REQUIRED (Benign Maintenance Flow)",
      penalty_at_stake: "₹ 0 (False Positive Correctly Suppressed)",
      reasoning_bullet: "Volume spike is 100% correlated with scheduled CBS cron job; zero anomalous external IPs."
    },
    step2: {
      autonomous_detection_title: "Stage 1: Autonomous Suppression Evaluation",
      autonomous_detection_query: "FROM logs-banking-*\n| WHERE bank.batch_id LIKE \"MONTHLY-*\"\n| STATS routine_volume = count(), avg_aml_risk = avg(bank.aml_risk_score) BY bank.batch_id\n| WHERE avg_aml_risk < 5.0",
      autonomous_detection_explanation: "Verifies that high-volume batch activity is benign and matches known maintenance parameters.",
      forensic_blast_radius_title: "Stage 2: Verification of Zero External Activity",
      forensic_blast_radius_query: "FROM logs-auth-*\n| WHERE user.name == \"system_batch_scheduler\"\n| KEEP @timestamp, source.ip, event.outcome",
      discovered_entity: "10.0.1.1 (Internal Core Scheduler)",
      compromised_id: "system_batch_scheduler (Automated Cron Daemon)",
      sample_table: {
        columns: ["@timestamp", "user.name", "bank.batch_id", "bank.aml_risk_score", "status"],
        rows: [
          ["2026-09-02T19:55:00Z", "system_batch_scheduler", "MONTHLY-INTEREST-CALC-2026", 2.1, "BENIGN"],
          ["2026-09-02T19:55:02Z", "system_batch_scheduler", "MONTHLY-INTEREST-CALC-2026", 1.8, "BENIGN"]
        ]
      }
    },
    step3: {
      corporate_count: 5000,
      hni_count: 15000,
      affected_accounts_total: 50000,
      account_examples: "All Retail & Corporate Savings Accounts",
      business_risk_level: "ZERO RISK (Pre-Approved Routine Operation)",
      penalty_saved: "Analyst Fatigue Averted",
      core_systems_affected: "CBS Batch Computing Engine",
      accounts_table: [
        { account_id: "ACC-RETAIL-ALL", name: "Standard Retail Savings Ledger", tier: "Retail", balance_inr: 500000000.00, exposed_inr: 0.0, status: "NORMAL", branch: "All Branches" }
      ]
    },
    step4: {
      actions: [
        { title: "Validate Against Maintenance Calendar", system: "ITSM Change Management", type: "Audit", description: "Correlate batch run with approved RFC-2026-0902-MONTH-END." },
        { title: "Auto-Close Alert Zero Trigger", system: "Vigil SOC Engine", type: "Automation", description: "Close alert without waking Tier-1 on-call analysts." }
      ],
      containment_success_msg: "Batch verified against change management calendar; alert closed as benign false positive."
    },
    step5: {
      certin_title: "INTERNAL INCIDENT CLOSURE REPORT (NO STATUTORY FILING REQUIRED)",
      affected_systems: "CBS Batch Engine (Scheduled Maintenance)",
      remedial_summary: "Confirmed pre-approved interest calculation batch. No security compromise."
    },
    step6: {
      sha256_hash: "0x0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
      merkle_root: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
      block_id: 109
    },
    topology: [
      { id: "node-1", label: "Core Batch Scheduler", type: "BENIGN_DAEMON", ip: "10.0.1.1", geo: "Primary DC", status: "BENIGN", protocol: "Cron / Internal Loopback", mitre_tag: "N/A - Benign Cron", details: "Executing pre-scheduled monthly interest accrual." },
      { id: "node-2", label: "Savings Deposit Ledger", type: "CORE_SYSTEM", ip: "10.0.1.2", geo: "Primary DC", status: "ACTIVE", protocol: "Finacle RPC", mitre_tag: "N/A - Legitimate Batch", details: "Routine ledger update." }
    ],
    timeline: [
      { offset: "+00:00", time: "19:54:00 UTC", title: "Month-End Batch Calculation Started", tactic: "Maintenance", source_ip: "10.0.1.1", description: "Automated interest accrual batch triggered on schedule.", severity: "LOW", raw_ecs: { "@timestamp": "2026-09-02T19:54:00Z", "bank.batch_id": "MONTHLY-INTEREST-CALC-2026" } },
      { offset: "+00:01", time: "19:55:00 UTC", title: "Vigil Automated FP Suppression", tactic: "Verification", source_ip: "10.0.1.1", description: "Vigil verified RFC change management approval and closed alert.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:55:00Z", "action": "AUTO_SUPPRESS" } }
    ],
    copilot_prompts: [
      { question: "Verify monthly interest batch AML risk distribution", esql_query: "FROM logs-banking-*\n| WHERE bank.batch_id LIKE \"MONTHLY-*\"\n| STATS avg_aml = avg(bank.aml_risk_score), max_aml = max(bank.aml_risk_score) BY bank.batch_id", explanation: "Confirms benign nature of monthly interest calculation." }
    ],
    terminal: {
      default_query: "FROM logs-banking-*\n| WHERE bank.batch_id LIKE \"MONTHLY-*\"\n| STATS routine_volume = count(), avg_aml_risk = avg(bank.aml_risk_score) BY bank.batch_id",
      preset1_label: "⚡ Batch AML Score",
      preset1_query: "FROM logs-banking-*\n| WHERE bank.batch_id LIKE \"MONTHLY-*\"\n| STATS avg(bank.aml_risk_score)",
      preset2_label: "🎯 Scheduler Audit",
      preset2_query: "FROM logs-auth-*\n| WHERE user.name == \"system_batch_scheduler\"\n| KEEP @timestamp, source.ip, event.outcome"
    },
    indic: {
      hi: "सिस्टम सूचना: माह के अंत में कोर बैंकिंग ब्याज गणना सफलतापूर्वक पूरी हुई। असामान्य मात्रा को पूर्व-अनुमोदित रखरखाव के रूप में सत्यापित किया गया।\n\n📌 शाखा कार्रवाई: किसी सुरक्षा कार्रवाई की आवश्यकता नहीं है।",
      mr: "सिस्टम सूचना: नियमित व्याज जमा प्रक्रिया यशस्वीरीत्या पूर्ण झाली.\n\n📌 शाखा कृती: कोणत्याही सुरक्षेच्या कारवाईची आवश्यकता नाही.",
      ta: "அமைப்பு தகவல்: மாத இறுதி வட்டி கணக்கீட்டு செயல்முறை வெற்றிகரமாக முடிந்தது.\n\n📌 கிளை நடவடிக்கை: எந்த பாதுகாப்பு நடவடிக்கையும் தேவையில்லை.",
      te: "సిస్టమ్ సమాచారం: నెలవారీ వడ్డీ గణన ప్రక్రియ విజయవంతంగా పూర్తయింది.\n\n📌 బ్రాంచ్ చర్య: ఎలాంటి భద్రతా చర్యలు అవసరం లేదు.",
      bn: "নিরাপত্তা ঘটনা সারসংক্ষেপ: মাস-শেষের নিয়মিত সুদ জমা প্রক্রিয়া সফলভাবে সম্পন্ন হয়েছে।\n\n📌 শাখা পদক্ষেপ: কোনও নিরাপত্তা পদক্ষেপের প্রয়োজন নেই।"
    },
    escalation: {
      slack_channel: "#soc-tier1-maintenance-logs",
      pagerduty_urgency: "LOW (INFORMATIONAL)",
      jira_summary: "[AUTO-CLOSED] Month-End Routine Interest Batch Verified"
    }
  },
  {
    incident_id: "INC-2026-0902-06",
    title: "SWIFT MT103 Cross-Border Wire Interception & Sanction Bypass",
    severity: "CRITICAL",
    threat_tactic: "Exfiltration / Financial Wire Fraud",
    mitre_id: "T1565.001",
    direct_exposure_inr: 142000000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 4,
    compromised_user: "swift_operator_mum",
    attacker_ip: "192.0.2.77",
    batch_id: "SWIFT-OUTBOUND-CORP-99",
    impact_summary: "Interception of outbound SWIFT MT103 payment stream altering beneficiary IBANs to offshore shell accounts.",
    affected_systems: ["SWIFT Alliance Gateway", "Treasury Wire Engine", "OFAC/RBI Sanction Screening Server"],
    step1: {
      rbi_ref: "RBI/2022-23/Master-Direction-Cross-Border-Remittance-Controls-Sec-7.1",
      certin_category: "CIAD-2022-04 High-Value Cross-Border Wire Tampering",
      threshold_desc: "Direct financial exposure > ₹10 Crore across international foreign exchange settlement queues.",
      clock_status: "Clock Running: 5h 42m remaining to submit Annexure-1",
      penalty_at_stake: "₹ 1,00,00,000 (FEMA & IT Act Violation)",
      reasoning_bullet: "Critical international wire tampering altering destination BIC/IBAN codes on 4 corporate foreign exchange wires."
    },
    step2: {
      autonomous_detection_title: "Stage 1: Autonomous Detection (High-Value Cross-Border Spikes)",
      autonomous_detection_query: "FROM logs-banking-*\n| WHERE bank.channel == \"SWIFT_WIRE\" AND bank.amount_inr > 20000000.00\n| STATS total_wire = sum(bank.amount_inr), count = count() BY source.ip, user.name, bank.batch_id\n| SORT total_wire DESC",
      autonomous_detection_explanation: "Identifies anomalous high-value SWIFT remittance batches with sudden destination IBAN changes.",
      forensic_blast_radius_title: "Stage 2: Sanction List Correlation & Wire Blast Radius",
      forensic_blast_radius_query: "FROM logs-banking-*\n| WHERE source.ip == \"192.0.2.77\" OR user.name == \"swift_operator_mum\"\n| KEEP @timestamp, bank.account_id, bank.amount_inr, bank.customer_tier\n| LIMIT 10",
      discovered_entity: "192.0.2.77 (Offshore C2 Proxy)",
      compromised_id: "swift_operator_mum (SWIFT Alliance Operator)",
      sample_table: {
        columns: ["@timestamp", "user.name", "bank.amount_inr", "bank.customer_tier"],
        rows: [
          ["2026-09-02T19:10:00Z", "swift_operator_mum", 45000000.00, "Corporate"],
          ["2026-09-02T19:11:30Z", "swift_operator_mum", 52000000.00, "Corporate"],
          ["2026-09-02T19:13:10Z", "swift_operator_mum", 45000000.00, "Corporate"]
        ]
      }
    },
    step3: {
      corporate_count: 3,
      hni_count: 0,
      affected_accounts_total: 3,
      account_examples: "Adani Global Port Corp, Larsen Industrial Exports, Vedanta Forex Treasury",
      business_risk_level: "CRITICAL (₹ 14.20 Crore Direct Wire Risk)",
      penalty_saved: "₹ 1,00,00,000 Saved",
      core_systems_affected: "SWIFT Alliance Access Server (Mumbai Fort DC)",
      accounts_table: [
        { account_id: "ACC-CORP-998812", name: "Adani Global Port Logistics", tier: "Corporate", balance_inr: 850000000.00, exposed_inr: 52000000.00, status: "FROZEN_PRESERVED", branch: "Fort Commercial, Mumbai" },
        { account_id: "ACC-CORP-441109", name: "Larsen Industrial Global Exports", tier: "Corporate", balance_inr: 420000000.00, exposed_inr: 45000000.00, status: "FROZEN_PRESERVED", branch: "Ballard Estate, Mumbai" },
        { account_id: "ACC-CORP-330198", name: "Vedanta International Forex Treasury", tier: "Corporate", balance_inr: 390000000.00, exposed_inr: 45000000.00, status: "FROZEN_PRESERVED", branch: "BKC Special Banking, Mumbai" }
      ]
    },
    step4: {
      actions: [
        { title: "Sever SWIFT Alliance Gateway VPN", system: "Fortinet Edge Gateway", type: "Network", description: "Drop bilateral IPSEC tunnel to SWIFT international network." },
        { title: "Revoke SWIFT Operator SmartCard & Session", system: "SWIFT HSM PKI", type: "IAM", description: "Revoke X.509 certificate for swift_operator_mum." },
        { title: "Transmit Stop-Payment Broadcast", system: "SWIFT FIN Protocol", type: "Treasury", description: "Dispatch MT192 cancellation message to overseas correspondent banks." }
      ],
      containment_success_msg: "SWIFT gateway isolated, MT192 stop-payment dispatched, and ₹14.20 Cr wire transfer halted."
    },
    step5: {
      certin_title: "CYBER SECURITY INCIDENT REPORTING FORM - ANNEXURE 1",
      affected_systems: "SWIFT Alliance Gateway & Treasury Wire Engine",
      remedial_summary: "SWIFT connection isolated, MT192 cancellation dispatched, smartcard certificate revoked."
    },
    step6: {
      sha256_hash: "0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
      merkle_root: "0xaabbccddeeff00112233445566778899aabbccddeeff00112233445566778899",
      block_id: 110
    },
    topology: [
      { id: "node-1", label: "Offshore Threat Operator", type: "ATTACKER", ip: "192.0.2.77", geo: "Frankfurt / Offshore", status: "BLOCKED", protocol: "SSH Tunnel / TCP 22", mitre_tag: "T1565.001 Message Tampering", details: "Injecting altered MT103 payload." },
      { id: "node-2", label: "SWIFT Alliance Gateway", type: "TARGET", ip: "10.0.18.2", geo: "Mumbai Fort DC", status: "ISOLATED", protocol: "SWIFT FIN / MT103", mitre_tag: "T1005 Local System Exfiltration", details: "International foreign exchange wire switch." }
    ],
    timeline: [
      { offset: "+00:00", time: "19:08:00 UTC", title: "SWIFT HSM PKI Token Compromise", tactic: "Credential Access", source_ip: "192.0.2.77", description: "Attacker acquired operator session via compromised jump host.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:08:00Z", "user.name": "swift_operator_mum" } },
      { offset: "+00:03", time: "19:11:30 UTC", title: "4 High-Value Outbound MT103 Wires Injected", tactic: "Impact", source_ip: "192.0.2.77", description: "₹14.20 Crore foreign exchange remittance routed to unverified offshore IBANs.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:11:30Z", "bank.amount_inr": 142000000.0 } },
      { offset: "+00:05", time: "19:13:30 UTC", title: "Vigil MT192 Emergency Stop Dispatched", tactic: "Remediation", source_ip: "10.0.18.2", description: "Vigil automated pipeline triggered MT192 cancellation broadcast halting overseas clearance.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:13:30Z", "action": "STOP_SWIFT_WIRE" } }
    ],
    copilot_prompts: [
      { question: "List all outbound international wires > ₹1 Crore", esql_query: "FROM logs-banking-*\n| WHERE bank.channel == \"SWIFT_WIRE\" AND bank.amount_inr > 10000000.00\n| KEEP @timestamp, user.name, bank.amount_inr, bank.account_id", explanation: "Detects large corporate cross-border wire anomalies." }
    ],
    terminal: {
      default_query: "FROM logs-banking-*\n| WHERE bank.channel == \"SWIFT_WIRE\"\n| STATS total_wire = sum(bank.amount_inr) BY user.name\n| LIMIT 10",
      preset1_label: "⚡ SWIFT Remittance Volume",
      preset1_query: "FROM logs-banking-*\n| WHERE bank.channel == \"SWIFT_WIRE\"\n| STATS sum(bank.amount_inr)",
      preset2_label: "🎯 Operator Audit",
      preset2_query: "FROM logs-auth-*\n| WHERE user.name == \"swift_operator_mum\"\n| KEEP @timestamp, source.ip, event.outcome"
    },
    indic: {
      hi: "सुरक्षा अलर्ट: स्विफ्ट (SWIFT) विदेशी मुद्रा वायर ट्रांसफर पर गंभीर छेड़छाड़ का पता चला है। तत्काल प्रभाव से वायर ट्रांसफर रोक दिया गया है।\n\n📌 शाखा कार्रवाई: ₹ 14.20 करोड़ का विदेशी प्रेषण सफलतापूर्वक रोक दिया गया है।",
      mr: "सुरक्षा सूचना: स्विफ्ट आंतरराष्ट्रीय वायर ट्रान्सफरमधील मोठा फेरफार तात्काळ थांबवण्यात आला आहे.\n\n📌 शाखा कृती: ₹ 14.20 कोटींचा निधी सुरक्षित करण्यात आला आहे.",
      ta: "பாதுகாப்பு எச்சரிக்கை: ஸ்விஃப்ட் சர்வதேச பணப் பரிவர்த்தனை முறைகேடு தடுத்து நிறுத்தப்பட்டது.\n\n📌 கிளை நடவடிக்கை: ₹ 14.20 கோடி நிதி இழப்பு தவிர்க்கப்பட்டது.",
      te: "భద్రతా సమాచారం: స్విఫ్ట్ అంతర్జాతీయ వైర్ బదిలీలలో మోసం నిరోధించబడింది.\n\n📌 బ్రాంచ్ చర్య: ₹ 14.20 కోట్ల నిధులు రక్షించబడ్డాయి.",
      bn: "নিরাপত্তা সতর্কতা: সুইফট আন্তর্জাতিক ওয়্যার ট্রান্সফার জালিয়াতি প্রতিহত করা হয়েছে।\n\n📌 শাখা পদক্ষেপ: ₹ 14.20 কোটি টাকা সুরক্ষিত রাখা হয়েছে।"
    },
    escalation: {
      slack_channel: "#soc-tier1-swift-fraud",
      pagerduty_urgency: "P1 (CRITICAL INCIDENT)",
      jira_summary: "[CRITICAL] SWIFT MT103 Cross-Border Wire Interception - Ref INC-2026-0902-06"
    }
  },
  {
    incident_id: "INC-2026-0902-07",
    title: "Cloud Storage IAM Leakage & Bulk Customer Statement Scraping",
    severity: "HIGH",
    threat_tactic: "Credential Access / Exfiltration",
    mitre_id: "T1552.001",
    direct_exposure_inr: 7850000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 3,
    compromised_user: "aws_statement_archiver",
    attacker_ip: "198.51.100.199",
    batch_id: "S3-STATEMENT-BULK-01",
    impact_summary: "Leaked AWS S3 bucket IAM credentials used to scrape 25,000 PDF account statements containing PII and financial balances.",
    affected_systems: ["AWS S3 Statement Archive (ap-south-1)", "Customer Document Vault", "IAM Key Vault"],
    step1: {
      rbi_ref: "RBI/2021-22/Customer-Data-Protection-Framework-Sec-6.2",
      certin_category: "CIAD-2022-02 Data Breach & Customer Financial PII Exfiltration",
      threshold_desc: "Massive breach of customer financial account statements exceeding 10,000 records.",
      clock_status: "Clock Running: 5h 46m remaining to submit Annexure-1",
      penalty_at_stake: "₹ 50,00,000 (DPDP Act & RBI Data Violation)",
      reasoning_bullet: "25,000 bank statements downloaded in 8 minutes using compromised AWS IAM access key."
    },
    step2: {
      autonomous_detection_title: "Stage 1: Autonomous Detection (S3 Object Get Spikes)",
      autonomous_detection_query: "FROM logs-audit-*\n| WHERE event.action == \"s3:GetObject\" AND destination.domain LIKE \"*.s3.ap-south-1.amazonaws.com\"\n| STATS download_count = count() BY source.ip, user.name\n| WHERE download_count > 500\n| SORT download_count DESC",
      autonomous_detection_explanation: "Detects mass data exfiltration from statement archiving buckets.",
      forensic_blast_radius_title: "Stage 2: Customer PII Impact Assessment",
      forensic_blast_radius_query: "FROM logs-banking-*\n| WHERE user.name == \"aws_statement_archiver\"\n| KEEP @timestamp, source.ip, bank.customer_tier, bank.account_id\n| LIMIT 10",
      discovered_entity: "198.51.100.199 (Public Cloud Scraper)",
      compromised_id: "aws_statement_archiver (AWS S3 Archival IAM)",
      sample_table: {
        columns: ["@timestamp", "user.name", "event.action", "target_bucket"],
        rows: [
          ["2026-09-02T19:35:01Z", "aws_statement_archiver", "s3:GetObject", "apex-bank-prod-statements-2026"],
          ["2026-09-02T19:35:05Z", "aws_statement_archiver", "s3:GetObject", "apex-bank-prod-statements-2026"],
          ["2026-09-02T19:35:10Z", "aws_statement_archiver", "s3:GetObject", "apex-bank-prod-statements-2026"]
        ]
      }
    },
    step3: {
      corporate_count: 120,
      hni_count: 850,
      affected_accounts_total: 25000,
      account_examples: "Corporate Statement Vault & HNI Wealth Dossiers",
      business_risk_level: "HIGH (25,000 High-Profile Customer Statements Leaked)",
      penalty_saved: "₹ 50,00,000 Regulatory Fine Averted",
      core_systems_affected: "AWS S3 Statement Vault (ap-south-1)",
      accounts_table: [
        { account_id: "ACC-CORP-VAULT", name: "Corporate Financial Statements Archive", tier: "Corporate", balance_inr: 7850000.00, exposed_inr: 7850000.00, status: "FROZEN_PRESERVED", branch: "Central Archival, Mumbai" }
      ]
    },
    step4: {
      actions: [
        { title: "Delete Leaked AWS IAM Access Key", system: "AWS IAM (ap-south-1)", type: "Cloud IAM", description: "Immediately delete access key ID AKIA... and revoke active STS sessions." },
        { title: "Apply S3 Bucket Deny-All Policy", system: "AWS S3 Bucket Policy", type: "Storage", description: "Enforce explicit deny on apex-bank-prod-statements except from trusted VPC endpoint." },
        { title: "Trigger Customer Compromise Notifications", system: "CRM Notification Service", type: "Compliance", description: "Send automated security notice to impacted corporate clients." }
      ],
      containment_success_msg: "AWS IAM key revoked, S3 bucket locked down to VPC endpoint, and exfiltration halted."
    },
    step5: {
      certin_title: "CYBER SECURITY INCIDENT REPORTING FORM - ANNEXURE 1",
      affected_systems: "AWS S3 Statement Archive (Mumbai)",
      remedial_summary: "Leaked IAM credentials deleted, S3 bucket restricted to private VPC endpoint."
    },
    step6: {
      sha256_hash: "0x44556677889900aabbccddeeff11223344556677889900aabbccddeeff112233",
      merkle_root: "0xddeeff00112233445566778899aabbccddeeff00112233445566778899aabbcc",
      block_id: 111
    },
    topology: [
      { id: "node-1", label: "Cloud Scraping Botnet", type: "ATTACKER", ip: "198.51.100.199", geo: "Public Cloud IP", status: "BLOCKED", protocol: "HTTPS / AWS API", mitre_tag: "T1552.001 Credentials in Files", details: "Scraping statement objects using leaked secret key." },
      { id: "node-2", label: "AWS S3 Statement Archive", type: "TARGET", ip: "52.95.12.8", geo: "AWS Mumbai (ap-south-1)", status: "FROZEN", protocol: "S3 REST", mitre_tag: "T1005 Cloud Storage Exfiltration", details: "Locked to private VPC." }
    ],
    timeline: [
      { offset: "+00:00", time: "19:32:00 UTC", title: "AWS IAM Key Used from Untrusted IP", tactic: "Initial Access", source_ip: "198.51.100.199", description: "Archival IAM credentials used from public non-VPC IP address.", severity: "HIGH", raw_ecs: { "@timestamp": "2026-09-02T19:32:00Z", "user.name": "aws_statement_archiver" } },
      { offset: "+00:03", time: "19:35:01 UTC", title: "Bulk S3 GetObject Burst Triggered", tactic: "Exfiltration", source_ip: "198.51.100.199", description: "25,000 PDF account statements downloaded.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:35:01Z", "event.action": "s3:GetObject" } },
      { offset: "+00:05", time: "19:37:00 UTC", title: "Vigil Cloud IAM Auto-Revocation", tactic: "Remediation", source_ip: "52.95.12.8", description: "Vigil automated cloud response deleted access key and enforced VPC endpoint lock.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:37:00Z", "action": "DELETE_IAM_KEY" } }
    ],
    copilot_prompts: [
      { question: "Audit all S3 GetObject requests by external IPs", esql_query: "FROM logs-audit-*\n| WHERE destination.domain LIKE \"*.s3.*.amazonaws.com\"\n| STATS downloads = count() BY source.ip, user.name\n| SORT downloads DESC", explanation: "Detects unauthorized cloud storage downloads." }
    ],
    terminal: {
      default_query: "FROM logs-audit-*\n| WHERE event.action == \"s3:GetObject\"\n| STATS count = count() BY source.ip, user.name\n| SORT count DESC\n| LIMIT 10",
      preset1_label: "⚡ S3 Object Access",
      preset1_query: "FROM logs-audit-*\n| WHERE event.action == \"s3:GetObject\"\n| STATS count() BY source.ip",
      preset2_label: "🎯 Cloud IAM Audit",
      preset2_query: "FROM logs-auth-*\n| WHERE user.name == \"aws_statement_archiver\"\n| KEEP @timestamp, source.ip, event.outcome"
    },
    indic: {
      hi: "सुरक्षा सूचना: क्लाउड स्टोरेज (AWS S3) पर अनधिकृत एक्सेस रोका गया। लीक हुए क्रेडेंशियल्स को तुरंत हटा दिया गया है।\n\n📌 शाखा कार्रवाई: डेटा सुरक्षित है और बकेट को केवल प्राइवेट वीपीसी तक सीमित कर दिया गया है।",
      mr: "सुरक्षा सूचना: क्लाउड स्टोरेजवरील अनधिकृत प्रवेश रोखण्यात आला आहे.\n\n📌 शाखा कृती: सर्व क्रेडेंशियल्स तात्काळ रद्द करण्यात आले आहेत.",
      ta: "பாதுகாப்பு தகவல்: கிளவுட் சேமிப்பக தரவு திருட்டு முயற்சி தடுக்கப்பட்டது.\n\n📌 கிளை நடவடிக்கை: பாதுகாப்பு நெறிமுறைகள் வலுப்படுத்தப்பட்டுள்ளன.",
      te: "భద్రతా సమాచారం: క్లౌడ్ స్టోరేజ్‌పై అనధికారిక డేటా స్క్రాపింగ్ నిలిపివేయబడింది.\n\n📌 బ్రాంచ్ చర్య: సురక్షిత చర్యలు చేపట్టబడ్డాయి.",
      bn: "নিরাপত্তা তথ্য: ক্লাউড স্টোরেজে অননুমোদিত অ্যাক্সেস প্রতিহত করা হয়েছে।\n\n📌 শাখা পদক্ষেপ: ডেটা সম্পূর্ণ সুরক্ষিত রাখা হয়েছে।"
    },
    escalation: {
      slack_channel: "#soc-tier1-cloud-security",
      pagerduty_urgency: "P2 (HIGH PRIORITY)",
      jira_summary: "[HIGH] Cloud S3 Key Leakage & Customer Statement Scraping - Ref INC-2026-0902-07"
    }
  },
  {
    incident_id: "INC-2026-0902-08",
    title: "Synthetic Identity Injection & Mule Merchant Onboarding Ring",
    severity: "HIGH",
    threat_tactic: "Defense Evasion / Subvert Trust Controls",
    mitre_id: "T1553",
    direct_exposure_inr: 4600000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 3,
    compromised_user: "kyc_onboarding_svc",
    attacker_ip: "203.0.113.245",
    batch_id: "KYC-SYNTHETIC-RING-04",
    impact_summary: "Automated injection of synthetic Aadhaar/PAN identity hashes into merchant digital onboarding pipeline to establish fake credit lines.",
    affected_systems: ["Digital Merchant Onboarding API", "Aadhaar e-KYC Switch", "Credit Line Allotment Engine"],
    step1: {
      rbi_ref: "RBI/2022-23/Digital-Payment-Security-Controls-Sec-8.3",
      certin_category: "CIAD-2022-04 Synthetic Identity & Merchant Ring Fraud",
      threshold_desc: "Automated creation of 24 fake merchant accounts with fraudulent credit allotment.",
      clock_status: "Clock Running: 5h 54m remaining to submit Annexure-1",
      penalty_at_stake: "₹ 50,00,000 (KYC Regulatory Non-Compliance)",
      reasoning_bullet: "24 merchant accounts onboarded in 90 seconds sharing duplicate forged digital signature hashes."
    },
    step2: {
      autonomous_detection_title: "Stage 1: Autonomous Detection (High-Speed KYC Registrations)",
      autonomous_detection_query: "FROM logs-banking-*\n| WHERE bank.channel == \"MERCHANT_ONBOARD\" AND bank.kyc_verified == true\n| STATS onboard_count = count() BY source.ip, bank.batch_id\n| WHERE onboard_count >= 10\n| SORT onboard_count DESC",
      autonomous_detection_explanation: "Flags synthetic merchant rings created in rapid bursts sharing forged biometric hashes.",
      forensic_blast_radius_title: "Stage 2: Credit Limit Exposure Pivot",
      forensic_blast_radius_query: "FROM logs-banking-*\n| WHERE source.ip == \"203.0.113.245\"\n| KEEP @timestamp, bank.account_id, bank.amount_inr, bank.customer_tier\n| LIMIT 10",
      discovered_entity: "203.0.113.245 (Mule Syndicate Ingress)",
      compromised_id: "kyc_onboarding_svc (Digital Onboarding Gateway)",
      sample_table: {
        columns: ["@timestamp", "user.name", "bank.account_id", "credit_limit_inr"],
        rows: [
          ["2026-09-02T19:42:01Z", "kyc_onboarding_svc", "ACC-MERCHANT-SYNTH-01", 200000.00],
          ["2026-09-02T19:42:05Z", "kyc_onboarding_svc", "ACC-MERCHANT-SYNTH-02", 200000.00],
          ["2026-09-02T19:42:10Z", "kyc_onboarding_svc", "ACC-MERCHANT-SYNTH-03", 200000.00]
        ]
      }
    },
    step3: {
      corporate_count: 24,
      hni_count: 0,
      affected_accounts_total: 24,
      account_examples: "24 Synthetic Shell Merchant Entities",
      business_risk_level: "HIGH (₹ 46.0 Lakhs in Pre-Approved Credit Lines)",
      penalty_saved: "₹ 50,00,000 KYC Penalty Saved",
      core_systems_affected: "Merchant Onboarding Switch & e-KYC Server",
      accounts_table: [
        { account_id: "ACC-SYNTH-MERCHANT-01", name: "Apex Synthetic Shell Corp #01", tier: "Corporate", balance_inr: 200000.00, exposed_inr: 200000.00, status: "FROZEN_PRESERVED", branch: "Digital Onboarding Hub" },
        { account_id: "ACC-SYNTH-MERCHANT-02", name: "Apex Synthetic Shell Corp #02", tier: "Corporate", balance_inr: 200000.00, exposed_inr: 200000.00, status: "FROZEN_PRESERVED", branch: "Digital Onboarding Hub" }
      ]
    },
    step4: {
      actions: [
        { title: "Block Ingress IP 203.0.113.245", system: "Edge Firewall", type: "Network", description: "Drop all merchant registration API packets from syndicate IP." },
        { title: "Debit Freeze 24 Synthetic Merchant Accounts", system: "Core Banking Engine (CBS)", type: "Core Banking", description: "Freeze credit lines and lock payouts across the 24 identified shell accounts." },
        { title: "Enforce Mandatory Video-KYC Fallback", system: "e-KYC Verification Engine", type: "Policy", description: "Force manual video-KYC and biometric verification for flagged merchant cluster." }
      ],
      containment_success_msg: "Syndicate IP blocked, 24 synthetic merchant accounts frozen, and ₹46.0L credit lines secured."
    },
    step5: {
      certin_title: "CYBER SECURITY INCIDENT REPORTING FORM - ANNEXURE 1",
      affected_systems: "Digital Merchant Onboarding API & e-KYC Gateway",
      remedial_summary: "Syndicate IP blocked, credit lines frozen, mandatory video-KYC enforced."
    },
    step6: {
      sha256_hash: "0x556677889900aabbccddeeff11223344556677889900aabbccddeeff11223344",
      merkle_root: "0xeeff00112233445566778899aabbccddeeff00112233445566778899aabbccdd",
      block_id: 112
    },
    topology: [
      { id: "node-1", label: "Mule Syndicate Botnet", type: "ATTACKER", ip: "203.0.113.245", geo: "Syndicate Ingress", status: "BLOCKED", protocol: "HTTPS / JSON API", mitre_tag: "T1553 Subvert Trust", details: "Injecting forged biometric Aadhaar tokens." },
      { id: "node-2", label: "Merchant Onboarding API", type: "TARGET", ip: "10.0.5.20", geo: "AWS Mumbai", status: "ISOLATED", protocol: "REST", mitre_tag: "T1078 Valid Accounts", details: "24 accounts frozen." }
    ],
    timeline: [
      { offset: "+00:00", time: "19:40:00 UTC", title: "Synthetic Registration Burst Started", tactic: "Initial Access", source_ip: "203.0.113.245", description: "24 merchant applications submitted in 90 seconds.", severity: "HIGH", raw_ecs: { "@timestamp": "2026-09-02T19:40:00Z", "bank.channel": "MERCHANT_ONBOARD" } },
      { offset: "+00:02", time: "19:42:01 UTC", title: "Vigil Automated Syndicate Detection", tactic: "Defense Evasion", source_ip: "10.0.5.20", description: "Vigil identified duplicate biometric hash pattern and halted credit lines.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:42:01Z", "bank.amount_inr": 4600000.0 } },
      { offset: "+00:04", time: "19:44:00 UTC", title: "Vigil Account Freezes Dispatched", tactic: "Remediation", source_ip: "10.0.5.20", description: "All 24 synthetic accounts frozen and syndicate IP dropped.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:44:00Z", "action": "FREEZE_SYNTHETIC_RING" } }
    ],
    copilot_prompts: [
      { question: "List rapid merchant registrations created in last 1 hour", esql_query: "FROM logs-banking-*\n| WHERE bank.channel == \"MERCHANT_ONBOARD\"\n| STATS count() BY source.ip, bank.batch_id", explanation: "Detects merchant onboarding burst anomalies." }
    ],
    terminal: {
      default_query: "FROM logs-banking-*\n| WHERE bank.channel == \"MERCHANT_ONBOARD\"\n| KEEP @timestamp, source.ip, bank.account_id, bank.amount_inr\n| LIMIT 10",
      preset1_label: "⚡ Merchant Velocity",
      preset1_query: "FROM logs-banking-*\n| WHERE bank.channel == \"MERCHANT_ONBOARD\"\n| STATS count() BY source.ip",
      preset2_label: "🎯 Identity Audit",
      preset2_query: "FROM logs-auth-*\n| WHERE user.name == \"kyc_onboarding_svc\"\n| KEEP @timestamp, source.ip, event.outcome"
    },
    indic: {
      hi: "सुरक्षा सूचना: डिजिटल मर्चेंट ऑनबोर्डिंग पर सिंथेटिक पहचान सिंडिकेट का हमला रोका गया। 24 फर्जी खातों को तुरंत सील कर दिया गया है।\n\n📌 शाखा कार्रवाई: ₹ 46.0 लाख की क्रेडिट लाइन सुरक्षित कर ली गई है।",
      mr: "सुरक्षा सूचना: बनावट खाती तयार करण्याचा मोठा प्रयत्न हाणून पाडला आहे. सर्व 24 खाती गोठवण्यात आली आहेत.\n\n📌 शाखा कृती: ₹ 46.0 लाखांची क्रेडिट मर्यादा सुरक्षित करण्यात आली आहे.",
      ta: "பாதுகாப்பு தகவல்: போலி வணிகர் கணக்குகள் தொடங்குவது தடுக்கப்பட்டது. 24 கணக்குகள் முடக்கப்பட்டன.\n\n📌 கிளை நடவடிக்கை: ₹ 46.0 லட்சம் கடன் வரம்பு பாதுகாக்கப்பட்டது.",
      te: "భద్రతా సమాచారం: నకిలీ మర్చంట్ ఖాతాల సృష్టి నిరోధించబడింది. 24 ఖాతాలు ఫ్రీజ్ చేయబడ్డాయి.\n\n📌 బ్రాంచ్ చర్య: ₹ 46.0 లక్షల క్రెడిట్ నిధులు రక్షించబడ్డాయి.",
      bn: "নিরাপত্তা তথ্য: জাল মার্চেন্ট অ্যাকাউন্ট খোলার প্রচেষ্টা প্রতিহত করা হয়েছে। ২৪টি অ্যাকাউন্ট সিল করা হয়েছে।\n\n📌 শাখা পদক্ষেপ: ₹ 46.0 লক্ষ টাকা সুরক্ষিত রাখা হয়েছে।"
    },
    escalation: {
      slack_channel: "#soc-tier1-fraud-ring",
      pagerduty_urgency: "P2 (HIGH PRIORITY)",
      jira_summary: "[HIGH] Synthetic Identity Injection & Mule Merchant Onboarding Ring - Ref INC-2026-0902-08"
    }
  }
];

export default function App() {
  const [viewMode, setViewMode] = useState<"hub" | "detail">("hub");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedIncId, setSelectedIncId] = useState<string>("INC-2026-0902-01");
  const [activeTab, setActiveTab] = useState<"workflow" | "topology" | "timeline" | "mitre" | "customers" | "telemetry" | "esql" | "certin" | "indic" | "ledger">("workflow");
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [containmentApproved, setContainmentApproved] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>("hi");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [showCoTDrawer, setShowCoTDrawer] = useState<boolean>(true);

  // Modals
  const [showEscalateModal, setShowEscalateModal] = useState<boolean>(false);
  const [rawEcsModalData, setRawEcsModalData] = useState<any | null>(null);
  const [selectedTopologyNode, setSelectedTopologyNode] = useState<TopologyNode | null>(null);

  // Live Telemetry Feed Simulation
  const [liveLogs, setLiveLogs] = useState<{ id: string; time: string; channel: string; ip: string; status: string; amt: number }[]>([
    { id: "LOG-9921", time: "Just now", channel: "UPI_GATEWAY", ip: "198.51.100.44", status: "BLOCKED", amt: 4200000.00 },
    { id: "LOG-9920", time: "4s ago", channel: "NETBANKING", ip: "203.0.113.89", status: "WAF_DROP", amt: 350000.00 },
    { id: "LOG-9919", time: "8s ago", channel: "ATM_SWITCH", ip: "10.14.88.22", status: "QUARANTINED", amt: 2833333.33 },
    { id: "LOG-9918", time: "14s ago", channel: "CBS_LOAN", ip: "10.2.14.105", status: "HOLD", amt: 233333.33 },
    { id: "LOG-9917", time: "22s ago", channel: "CORE_ENGINE", ip: "10.0.1.1", status: "BENIGN_PASS", amt: 4500.00 }
  ]);
  const [isTelemetryStreaming, setIsTelemetryStreaming] = useState<boolean>(true);

  // Backend Health Ping
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [elasticClusterName, setElasticClusterName] = useState<string>("ap-south-1");

  const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || "https://vigil-backend-k511.onrender.com";

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "HEALTHY") {
          setBackendOnline(true);
          if (data.elastic_cluster) setElasticClusterName(data.elastic_cluster);
        }
      })
      .catch(() => setBackendOnline(false));
  }, [API_BASE]);

  // Active Scenario Configuration
  const currentScenario = SCENARIOS_DATA.find(s => s.incident_id === selectedIncId) || SCENARIOS_DATA[0];

  // Filtered Scenarios list based on search and severity
  const filteredScenarios = SCENARIOS_DATA.filter(s => {
    const matchSev = severityFilter === "ALL" || s.severity === severityFilter;
    const matchSearch = s.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
                        s.incident_id.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        s.threat_tactic.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        s.compromised_user.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        s.attacker_ip.toLowerCase().includes(searchFilter.toLowerCase());
    return matchSev && matchSearch;
  });

  // Aggregate Stats for Hub
  const totalRupeeRisk = SCENARIOS_DATA.reduce((acc, s) => acc + s.direct_exposure_inr, 0);
  const totalCritical = SCENARIOS_DATA.filter(s => s.severity === "CRITICAL").length;
  const totalHigh = SCENARIOS_DATA.filter(s => s.severity === "HIGH").length;
  const totalSuppressed = SCENARIOS_DATA.filter(s => !s.is_material).length;

  // ES|QL Terminal State
  const [esqlQuery, setEsqlQuery] = useState<string>(currentScenario.terminal.default_query);
  const [esqlResult, setEsqlResult] = useState<any>(null);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);

  // 6-Hour Clock Countdown State (starts at 5h 48m 12s)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20892);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update HTML class for dark/light theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [theme]);

  // When scenario changes, synchronize terminal and translation
  const handleSelectScenario = (incId: string) => {
    setSelectedIncId(incId);
    setActiveStep(1);
    const newSc = SCENARIOS_DATA.find(s => s.incident_id === incId) || SCENARIOS_DATA[0];
    setContainmentApproved(newSc.incident_id === "INC-2026-0902-05");
    setEsqlQuery(newSc.terminal.default_query);
    setEsqlResult(null);
    setSelectedTopologyNode(null);
    setTranslatedText(newSc.indic[selectedLang] || newSc.indic["hi"]);
    setViewMode("detail");
  };

  const formatCountdown = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
  };

  // Auto-Run 6-Step Workflow
  const handleAutoRun = async () => {
    setIsRunning(true);
    for (let step = 1; step <= 6; step++) {
      setActiveStep(step);
      if (step === 4 && currentScenario.incident_id !== "INC-2026-0902-05") {
        setContainmentApproved(false);
      }
      await new Promise(r => setTimeout(r, 650));
    }
    setIsRunning(false);
  };

  const handleApproveContainment = () => {
    setContainmentApproved(true);
  };

  const handleRunEsql = async () => {
    setIsQuerying(true);
    try {
      const res = await fetch(`${API_BASE}/api/esql/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: esqlQuery })
      });
      if (res.ok) {
        const data = await res.json();
        setEsqlResult(data);
      } else {
        throw new Error("API query fallback");
      }
    } catch (e) {
      setEsqlResult({
        columns: currentScenario.step2.sample_table.columns.map(c => ({ name: c, type: "keyword" })),
        values: currentScenario.step2.sample_table.rows,
        took: 7
      });
    } finally {
      setIsQuerying(false);
    }
  };

  // Client-Side PDF Binary Generator
  const generateClientCertInPdf = (sc: ScenarioConfig): Blob => {
    const w = 595.28;
    const h = 841.89;
    const margin_x = 40.0;
    const content_w = w - 2 * margin_x;
    let y = h - 40.0;
    const stream: string[] = [];

    const escape = (text: any) =>
      String(text || "")
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")
        .replace(/\r/g, "");

    const h_box = 65.0;
    stream.push(`q
0.06 0.09 0.16 rg
${margin_x} ${y - h_box} ${content_w} ${h_box} re f
0.01 0.52 0.78 RG 1.5 w
${margin_x} ${y - h_box} ${content_w} ${h_box} re S
1 1 1 rg
BT
/F2 13 Tf
${margin_x + 12} ${y - 24} Td
(INDIAN COMPUTER EMERGENCY RESPONSE TEAM (CERT-In)) Tj
ET
0.22 0.74 0.97 rg
BT
/F2 9.5 Tf
${margin_x + 12} ${y - 40} Td
(CYBER SECURITY INCIDENT REPORTING FORM - ANNEXURE 1) Tj
ET
0.58 0.64 0.72 rg
BT
/F1 7 Tf
${margin_x + 12} ${y - 54} Td
(Mandatory statutory reporting under Section 70B of IT Act 2000 & CERT-In Directions 2022) Tj
ET
Q
`);
    y -= (h_box + 14);

    const drawSection = (title: string) => {
      stream.push(`q
0.01 0.52 0.78 rg
${margin_x} ${y - 12} 3 12 re f
0.06 0.09 0.16 rg
BT
/F2 9.5 Tf
${margin_x + 8} ${y - 10.5} Td
(${escape(title)}) Tj
ET
Q
`);
      y -= 18;
    };

    const drawField = (label: string, value: any, isHighlight = false) => {
      stream.push(`q
0.96 0.97 0.99 rg
${margin_x} ${y - 15} ${content_w} 15 re f
0.88 0.91 0.94 RG 0.5 w
${margin_x} ${y - 15} ${content_w} 15 re S
0.3 0.35 0.42 rg
BT
/F2 7.5 Tf
${margin_x + 6} ${y - 11} Td
(${escape(label)}:) Tj
ET
${isHighlight ? "0.8 0.1 0.1 rg" : "0.06 0.09 0.16 rg"}
BT
/${isHighlight ? "F2" : "F1"} 7.5 Tf
${margin_x + 180} ${y - 11} Td
(${escape(String(value).slice(0, 70))}) Tj
ET
Q
`);
      y -= 17;
    };

    const nowStr = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

    drawSection("1. ORGANISATION PARTICULARS & NODAL CONTACT");
    drawField("Name of Organisation", "Apex Commercial Bank of India Ltd");
    drawField("Sector / Regulatory Body", "Banking & Financial Services (RBI Supervised)");
    drawField("CISO Nodal Officer Contact", "ciso-office@apexbank.in | +91-22-6889-0100");
    drawField("Reporting Reference ID", sc.incident_id);
    y -= 6;

    drawSection("2. INCIDENT DETECTION & REGULATORY CLASSIFICATION");
    drawField("Date & Time of Incident Detection", nowStr);
    drawField("CERT-In Incident Category", sc.step1?.certin_category || "CIAD-2022-04 Unauthorized Access & Fraud");
    drawField("Regulatory Reporting Window", "Mandatory 6 Hours (CERT-In / RBI Directions)");
    drawField("MITRE ATT&CK Classification", `${sc.threat_tactic} (${sc.mitre_id})`);
    drawField("Attacker Source Entity / IP", sc.step2?.discovered_entity || sc.attacker_ip, true);
    y -= 6;

    drawSection("3. RUPEE FINANCIAL EXPOSURE & IMPACT ASSESSMENT");
    const directRisk = Number(sc.direct_exposure_inr || 0);
    drawField("Direct Financial Risk (INR)", `Rs. ${directRisk.toLocaleString("en-IN")}.00`, directRisk > 0);
    drawField("Customer Accounts Affected", `${sc.step3?.affected_accounts_total || 18} Accounts (${sc.step3?.corporate_count || 3} Corporate, ${sc.step3?.hni_count || 15} HNI)`);
    drawField("Payment Channels Impacted", sc.step3?.account_examples || "Core Banking & Inter-Bank Switch");
    drawField("Core Banking Operational Status", "NORMAL (Unauthorized activity intercepted & neutralized)");
    y -= 6;

    drawSection("4. REMEDIAL & CONTAINMENT ACTIONS TAKEN");
    const acts = sc.step4?.actions || [];
    drawField("Perimeter Firewall Action", acts[0]?.title || "Null-routed malicious ingress IP on edge firewall");
    drawField("IAM Session Invalidation", acts[1]?.title || "OAuth2 Bearer token revoked & forced password rotation");
    drawField("Payment Velocity Gate", acts[2]?.title || "Placed debit freeze & suspended anomalous outbound batches");
    drawField("Cryptographic Evidence Status", "SEALED in SHA-256 Hash Chain Ledger (S3 Object Lock)");

    stream.push(`q
0.88 0.91 0.94 RG 0.5 w
${margin_x} 30 m ${w - margin_x} 30 l S
0.5 0.55 0.65 rg
BT
/F1 6.5 Tf
${margin_x} 20 Td
(Generated automatically by VIGIL AI Tier-1 SOC Analyst | Sealed under SHA-256 Hash Chain) Tj
${w - margin_x - 70} 20 Td
(CERT-In 6-Hour Filing) Tj
ET
Q
`);

    const pageStream = stream.join("\n");
    const streamLen = new TextEncoder().encode(pageStream).length;

    const objs = [
      `<< /Type /Catalog /Pages 2 0 R >>`,
      `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`,
      `<< /Type /Page /Parent 2 0 R
/MediaBox [0 0 ${w} ${h}]
/Resources <<
  /Font <<
    /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
    /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
  >>
>>
/Contents 4 0 R >>`,
      `<< /Length ${streamLen} >>\nstream\n${pageStream}\nendstream`
    ];

    let pdfStr = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
    const offsets: number[] = [];

    objs.forEach((obj, idx) => {
      offsets.push(new TextEncoder().encode(pdfStr).length);
      pdfStr += `${idx + 1} 0 obj\n${obj}\nendobj\n`;
    });

    const xrefPos = new TextEncoder().encode(pdfStr).length;
    pdfStr += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
    offsets.forEach(off => {
      pdfStr += `${String(off).padStart(10, "0")} 00000 n \n`;
    });
    pdfStr += `trailer\n<< /Size ${objs.length + 1}\n   /Root 1 0 R\n>>\nstartxref\n${xrefPos}\n%%EOF\n`;

    return new Blob([new TextEncoder().encode(pdfStr)], { type: "application/pdf" });
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reports/certin/${selectedIncId}/pdf`);
      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 500) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `CERT_IN_REPORT_${selectedIncId}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          return;
        }
      }
    } catch (e) {
      console.warn("API PDF download fallback triggered:", e);
    }

    const pdfBlob = generateClientCertInPdf(currentScenario);
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CERT_IN_REPORT_${selectedIncId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleCopyReport = () => {
    const reportText = `CERT-In Report Ref: ${selectedIncId} | Bank: Apex Commercial Bank | Loss: Rs. ${currentScenario.direct_exposure_inr.toLocaleString("en-IN")} | Status: Contained & Sealed`;
    navigator.clipboard.writeText(reportText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleLanguageChange = async (lang: string) => {
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
    } catch (e) {
      setTranslatedText(currentScenario.indic[lang] || currentScenario.indic["hi"]);
    } finally {
      setIsTranslating(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDark ? "bg-[#0B1120] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
    }`}>
      
      {/* 1. TOP HEADER BAR */}
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
              <p className="text-[11px] text-slate-400 font-medium">
                Autonomous Security Operations for Indian BFSI
              </p>
            </div>
          </button>

          {/* Breadcrumb / Mode Indicator */}
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

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
          }`}>
            <button
              onClick={() => setViewMode("hub")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "hub"
                  ? (isDark ? "bg-sky-500 text-white shadow-md shadow-sky-500/30" : "bg-white text-sky-700 shadow-sm")
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
                  ? (isDark ? "bg-sky-500 text-white shadow-md shadow-sky-500/30" : "bg-white text-sky-700 shadow-sm")
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Investigation Cockpit</span>
            </button>
          </div>

          {/* SOC Escalation / Webhooks Modal Trigger */}
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

          {/* Elastic Cloud Live Badge */}
          <div className={`hidden md:flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border font-medium ${
            isDark ? "bg-slate-800/80 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
          }`} title={backendOnline ? "Backend & Elastic Cloud Cluster Connected" : "Connecting to backend..."}>
            <span className={`h-2 w-2 rounded-full ${backendOnline ? "bg-emerald-400 animate-pulse shadow-sm" : "bg-amber-400"}`} />
            <Database className="h-3.5 w-3.5 text-sky-500" />
            <span>Elastic Cloud</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              {backendOnline ? "● Live (ap-south-1)" : "(ap-south-1)"}
            </span>
          </div>

          {/* Theme Toggle Button (Dark / Light) */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
              isDark 
                ? "bg-slate-800/80 border-slate-700 text-amber-300 hover:bg-slate-700" 
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
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
      {/* VIEW MODE 1: MASTER USE CASES & INCIDENT DISCOVERY HUB                    */}
      {/* ========================================================================= */}
      {viewMode === "hub" && (
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Executive Overview Banner & Stats */}
          <div className={`p-6 rounded-2xl border relative overflow-hidden ${
            isDark 
              ? "bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-950 border-slate-800 shadow-xl" 
              : "bg-gradient-to-br from-white via-sky-50/40 to-slate-50 border-slate-200 shadow-md"
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6 text-sky-500" />
                  <h1 className="text-xl font-black tracking-tight">
                    Banking Threat Discovery & Incident Response Hub
                  </h1>
                </div>
                <p className={`text-xs mt-1 max-w-3xl ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Real-time threat detection across Elastic Cloud (AWS ap-south-1). Select any active banking incident to launch the autonomous 6-step triage, forensic blast radius analysis, and statutory CERT-In Annexure-1 compliance workflow.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectScenario(SCENARIOS_DATA[0].incident_id)}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
                >
                  <Play className="h-4 w-4" />
                  <span>Launch Live Cockpit</span>
                </button>
              </div>
            </div>

            {/* Top 4 KPI Metric Strips */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className={`p-4 rounded-xl border ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Rupee Risk at Stake</div>
                <div className="text-2xl font-black font-mono text-emerald-500 mt-1">
                  ₹ {(totalRupeeRisk / 10000000).toFixed(2)} Cr
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Across {SCENARIOS_DATA.length} Banking Scenarios</div>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Critical Breaches</div>
                <div className="text-2xl font-black font-mono text-red-500 mt-1">
                  {totalCritical} Active
                </div>
                <div className="text-[10px] text-red-400/80 mt-0.5">Mandatory 6-Hr CERT-In Filing</div>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">High-Risk Incidents</div>
                <div className="text-2xl font-black font-mono text-amber-500 mt-1">
                  {totalHigh} Active
                </div>
                <div className="text-[10px] text-amber-400/80 mt-0.5">Automated Containment Ready</div>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">False Positive Suppression</div>
                <div className="text-2xl font-black font-mono text-sky-400 mt-1">
                  {totalSuppressed} Verified
                </div>
                <div className="text-[10px] text-sky-400/80 mt-0.5">Pre-Approved Maintenance Cron</div>
              </div>
            </div>
          </div>

          {/* Search, Filter & Scenarios Grid */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search use cases by keyword, IP, tactic, user..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border transition-colors outline-none font-medium ${
                    isDark 
                      ? "bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-sky-500" 
                      : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 shadow-sm"
                  }`}
                />
              </div>

              {/* Severity Filter Pills */}
              <div className="flex items-center gap-1.5 self-start md:self-auto">
                {["ALL", "CRITICAL", "HIGH", "LOW"].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      severityFilter === sev
                        ? "bg-sky-600 text-white shadow"
                        : (isDark ? "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50")
                    }`}
                  >
                    {sev === "ALL" ? "All Scenarios" : sev}
                  </button>
                ))}
              </div>
            </div>

            {/* 8 Scenarios Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScenarios.map((sc) => {
                const isSelected = selectedIncId === sc.incident_id;
                return (
                  <div
                    key={sc.incident_id}
                    onClick={() => handleSelectScenario(sc.incident_id)}
                    className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer group hover:scale-[1.01] ${
                      isSelected
                        ? (isDark ? "bg-slate-900/90 border-sky-500 ring-2 ring-sky-500/30 shadow-xl" : "bg-sky-50/50 border-sky-400 ring-2 ring-sky-300 shadow-md")
                        : (isDark ? "bg-[#0F172A] border-slate-800/80 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm")
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
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

                        <span className={`text-[10px] font-bold ${
                          sc.is_material ? "text-amber-500" : "text-emerald-400"
                        }`}>
                          {sc.is_material ? "Mandatory 6-Hr" : "Benign FP"}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className={`font-bold text-sm leading-snug group-hover:text-sky-400 transition-colors ${
                        isDark ? "text-slate-100" : "text-slate-900"
                      }`}>
                        {sc.title}
                      </h3>
                      <p className={`text-xs mt-2 line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {sc.impact_summary}
                      </p>

                      {/* Key Indicators Strip */}
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
                          <span className="font-mono text-sky-400 text-[11px] truncate max-w-[170px]">{sc.threat_tactic}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Threat IP:</span>
                          <span className="font-mono text-slate-300 text-[11px]">{sc.attacker_ip}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Tool: {sc.current_step}/6 Complete
                      </span>
                      <button className="text-xs font-bold text-sky-500 group-hover:text-sky-400 flex items-center gap-1 transition-transform group-hover:translate-x-1">
                        <span>Investigate Incident</span>
                        <ArrowRight className="h-3.5 w-3.5" />
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
      {/* VIEW MODE 2: DETAILED INCIDENT INVESTIGATION COCKPIT                       */}
      {/* ========================================================================= */}
      {viewMode === "detail" && (
        <div className="flex-1 flex flex-col">
          
          {/* Incident Context Header */}
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

            {/* Quick Switch Dropdown & Countdown */}
            <div className="flex items-center gap-3">
              <select
                value={selectedIncId}
                onChange={(e) => handleSelectScenario(e.target.value)}
                className={`text-xs font-medium px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                  isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                {SCENARIOS_DATA.map((s) => (
                  <option key={s.incident_id} value={s.incident_id}>
                    {s.incident_id}: {s.title.slice(0, 40)}...
                  </option>
                ))}
              </select>

              {currentScenario.is_material && (
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  <Clock className="h-3.5 w-3.5 animate-pulse" />
                  <span>{formatCountdown(secondsRemaining)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main 2-Column Cockpit */}
          <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 max-w-[1600px] mx-auto w-full">
            
            {/* Left Column: Business Risk & Incident Selector */}
            <div className="w-full lg:w-4/12 flex flex-col gap-5">
              
              {/* Financial Risk Summary Card */}
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
                    {currentScenario.is_material ? "Direct funds at risk in pending transaction queue." : "Zero financial exposure. Routine operation."}
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

              {/* Triage Stream List */}
              <div className={`border rounded-2xl p-5 flex-1 flex flex-col text-left transition-colors ${
                isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Radio className="h-4 w-4 text-sky-400" />
                    <span>Attack Triage Stream</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                    {SCENARIOS_DATA.length} Scenarios
                  </span>
                </div>

                <div className="space-y-2.5 overflow-y-auto max-h-[480px] pr-1">
                  {SCENARIOS_DATA.map((s) => {
                    const isSelected = selectedIncId === s.incident_id;
                    return (
                      <button
                        key={s.incident_id}
                        onClick={() => handleSelectScenario(s.incident_id)}
                        className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? (isDark ? "bg-slate-900 border-sky-500 ring-1 ring-sky-500/40 shadow-md" : "bg-sky-50 border-sky-400 ring-1 ring-sky-300 shadow-sm")
                            : (isDark ? "bg-slate-950/60 border-slate-800/80 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:border-slate-300")
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-sky-400">{s.incident_id}</span>
                          <span className={`text-[10px] px-2 py-0.2 rounded font-mono font-bold uppercase ${
                            s.severity === "CRITICAL" ? "text-red-400 bg-red-500/10" : s.severity === "HIGH" ? "text-amber-400 bg-amber-500/10" : "text-emerald-400 bg-emerald-500/10"
                          }`}>
                            {s.severity}
                          </span>
                        </div>
                        <div className="font-bold text-xs mt-1 truncate">{s.title}</div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {s.is_material ? "Mandatory 6-Hr" : "Benign FP"}
                          </span>
                          <span className="font-mono text-emerald-400 font-bold">
                            ₹ {s.direct_exposure_inr.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: 10 Investigation Tabs */}
            <div className="w-full lg:w-8/12 flex flex-col gap-4">
              
              {/* Tab Navigation Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto gap-2">
                <div className="flex items-center gap-1.5">
                  {[
                    { id: "workflow", label: "6-Step Pipeline", icon: Workflow },
                    { id: "topology", label: "Attack Topology", icon: Network },
                    { id: "timeline", label: "Forensic Timeline", icon: ListTree },
                    { id: "mitre", label: "MITRE ATT&CK", icon: Compass },
                    { id: "customers", label: "Blast Accounts", icon: Users },
                    { id: "telemetry", label: "Live Telemetry", icon: Radio },
                    { id: "esql", label: "ES|QL Copilot", icon: Terminal },
                    { id: "certin", label: "CERT-In Form", icon: FileText },
                    { id: "indic", label: "Sarvam Indic", icon: Globe },
                    { id: "ledger", label: "SHA-256 Ledger", icon: Lock }
                  ].map((t) => {
                    const Icon = t.icon;
                    const isActive = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          isActive
                            ? (isDark ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" : "bg-sky-600 text-white shadow-sm")
                            : (isDark ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100")
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>

                {activeTab === "workflow" && (
                  <button
                    onClick={handleAutoRun}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer flex-shrink-0"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRunning ? "animate-spin" : ""}`} />
                    <span>{isRunning ? "Running..." : "Auto-Run All"}</span>
                  </button>
                )}
              </div>

              {/* TAB 1: 6-STEP AGENTIC WORKFLOW */}
              {activeTab === "workflow" && (
                <div className={`border rounded-2xl p-5 flex flex-col gap-5 text-left transition-colors ${
                  isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  
                  {/* Stepper Bar */}
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { num: 1, label: "1. Materiality", desc: "RBI Check" },
                      { num: 2, label: "2. ES|QL", desc: "Evidence" },
                      { num: 3, label: "3. ₹ Exposure", desc: "bank.exposure" },
                      { num: 4, label: "4. Containment", desc: "HITL Gate" },
                      { num: 5, label: "5. CERT-In", desc: "Annexure-1" },
                      { num: 6, label: "6. Ledger", desc: "SHA-256 Seal" }
                    ].map((s) => (
                      <button
                        key={s.num}
                        onClick={() => setActiveStep(s.num)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          activeStep === s.num
                            ? "bg-sky-500/20 border-sky-500 text-sky-500 shadow-sm ring-1 ring-sky-500/40 font-bold"
                            : activeStep > s.num
                            ? (isDark ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700")
                            : (isDark ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400")
                        }`}
                      >
                        <div className="text-xs font-bold flex items-center justify-between">
                          <span>{s.label}</span>
                          {activeStep > s.num && <CheckCircle className="h-3 w-3 text-emerald-500" />}
                        </div>
                        <div className="text-[10px] opacity-75 mt-0.5">{s.desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* Active Step Detailed Content View */}
                  <div className={`border rounded-2xl p-5 text-left transition-colors ${
                    isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50/70 border-slate-200"
                  }`}>
                    
                    {/* STEP 1: MATERIALITY */}
                    {activeStep === 1 && (
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-sm text-sky-500 flex items-center gap-2">
                            <FileCheck className="h-4 w-4" />
                            Step 1: Incident Classification & RBI Materiality Check
                          </div>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                            currentScenario.is_material 
                              ? (isDark ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-red-100 text-red-700 border border-red-200")
                              : (isDark ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-emerald-100 text-emerald-700 border border-emerald-200")
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

                    {/* STEP 2: ES|QL EVIDENCE */}
                    {activeStep === 2 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-sm text-amber-500 flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Step 2: Autonomous ES|QL Threat Hunt & Forensic Evidence
                          </div>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                            isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700"
                          }`}>
                            Tool: generate_esql
                          </span>
                        </div>

                        {/* Stage 1 Box */}
                        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/90 border-amber-500/30" : "bg-amber-50/70 border-amber-200"}`}>
                          <div className="font-bold text-xs text-amber-500 flex items-center gap-2 mb-1.5">
                            <Zap className="h-3.5 w-3.5" />
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

                        {/* Stage 2 Box */}
                        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                          <div className="font-bold text-xs text-sky-500 flex items-center gap-2 mb-1.5">
                            <Filter className="h-3.5 w-3.5" />
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

                    {/* STEP 3: FINANCIAL EXPOSURE */}
                    {activeStep === 3 && (
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

                    {/* STEP 4: CONTAINMENT & HITL GATE */}
                    {activeStep === 4 && (
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-sm text-amber-500 flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Step 4: Containment Action Authorization (Human-in-the-Loop Gate)
                          </div>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                            containmentApproved 
                              ? (isDark ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-emerald-100 text-emerald-700 border border-emerald-200")
                              : (isDark ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-amber-100 text-amber-700 border border-amber-200")
                          }`}>
                            {containmentApproved ? "APPROVED & SEALED" : "PENDING ANALYST SIGN-OFF"}
                          </span>
                        </div>
                        <div className="mt-4 space-y-3.5 text-xs">
                          <div className="space-y-2">
                            {currentScenario.step4.actions.map((act, i) => (
                              <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl border transition-colors ${
                                isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                              }`}>
                                <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${containmentApproved ? "text-emerald-500" : "text-slate-400"}`} />
                                <div>
                                  <div className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{act.title}</div>
                                  <div className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                    {act.description} • <span className="text-sky-500 font-semibold">{act.system}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {!containmentApproved ? (
                            <div className="pt-2 flex items-center gap-3">
                              <button
                                onClick={handleApproveContainment}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                              >
                                <UserCheck className="h-4 w-4" />
                                <span>1-Click Authorize & Execute Containment</span>
                              </button>
                            </div>
                          ) : (
                            <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                              isDark ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-800"
                            }`}>
                              <Check className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                              <span>{currentScenario.step4.containment_success_msg}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* STEP 5: CERT-In REPORT */}
                    {activeStep === 5 && (
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

                    {/* STEP 6: SHA-256 LEDGER */}
                    {activeStep === 6 && (
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

              {/* TAB 2: INTERACTIVE ATTACK TOPOLOGY GRAPH */}
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
                        onClick={() => setSelectedTopologyNode(node)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedTopologyNode?.id === node.id
                            ? (isDark ? "bg-slate-900 border-sky-400 ring-2 ring-sky-500/30" : "bg-sky-50 border-sky-500 ring-2 ring-sky-200")
                            : (isDark ? "bg-slate-950/70 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:border-slate-300")
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            node.type === "ATTACKER" ? "bg-red-500/20 text-red-400" : node.type === "TARGET" ? "bg-amber-500/20 text-amber-400" : "bg-sky-500/20 text-sky-400"
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

                  {selectedTopologyNode && (
                    <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${isDark ? "bg-slate-950 border-sky-500/40 text-slate-300" : "bg-sky-50/50 border-sky-200 text-slate-700"}`}>
                      <div className="font-bold text-sky-500 flex items-center justify-between">
                        <span>Node Details: {selectedTopologyNode.label}</span>
                        <button onClick={() => setSelectedTopologyNode(null)} className="text-slate-400 hover:text-slate-200">✕</button>
                      </div>
                      <p>• <strong>IP Address</strong>: <code className="font-mono">{selectedTopologyNode.ip}</code> ({selectedTopologyNode.geo})</p>
                      <p>• <strong>Protocol</strong>: {selectedTopologyNode.protocol}</p>
                      <p>• <strong>MITRE ATT&CK Mapping</strong>: <span className="font-mono text-amber-500 font-bold">{selectedTopologyNode.mitre_tag}</span></p>
                      <p>• <strong>Forensic Details</strong>: {selectedTopologyNode.details}</p>
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
                    {currentScenario.timeline.map((ev, i) => (
                      <div key={i} className="relative group">
                        <div className={`absolute -left-[23px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                          ev.severity === "CRITICAL" ? "bg-red-500 border-slate-900" : ev.severity === "HIGH" ? "bg-amber-500 border-slate-900" : "bg-sky-500 border-slate-900"
                        }`} />
                        <div className={`p-3.5 rounded-xl border text-xs transition-all ${
                          isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200"
                        }`}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs">{ev.title}</span>
                            <span className="font-mono text-[11px] text-slate-400">{ev.time} ({ev.offset})</span>
                          </div>
                          <p className={`mt-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{ev.description}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="font-mono text-[10px] text-sky-400">Tactic: {ev.tactic}</span>
                            <button
                              onClick={() => setRawEcsModalData(ev.raw_ecs)}
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
                    ].map((m, i) => (
                      <div key={i} className={`p-4 rounded-xl border text-left text-xs space-y-1.5 ${
                        isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200"
                      }`}>
                        <div className="font-bold text-amber-500">{m.tactic}</div>
                        <div className="font-mono font-semibold text-sky-400 text-xs">{m.technique}</div>
                        <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: BLAST ACCOUNTS */}
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
                            <td className="py-2.5"><span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono">{acc.tier}</span></td>
                            <td className="py-2.5 font-mono text-emerald-400 font-bold">₹ {acc.exposed_inr.toLocaleString("en-IN")}</td>
                            <td className="py-2.5"><span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">{acc.status}</span></td>
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
                      <Radio className="h-4 w-4 animate-pulse" />
                      Live Indian BFSI Simulated Telemetry Stream
                    </div>
                  </div>

                  <div className="space-y-2 overflow-y-auto max-h-[350px]">
                    {liveLogs.map((log) => (
                      <div key={log.id} className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                        isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-sky-400 font-bold">{log.id}</span>
                          <span className="text-slate-400">• {log.channel}</span>
                          <span className="text-slate-500">({log.ip})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-400 font-bold">₹ {log.amt.toLocaleString("en-IN")}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            log.status === "BLOCKED" ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                          }`}>{log.status}</span>
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

                  {/* Preset Questions */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400">Pre-Configured AI Threat Hunting Queries:</div>
                    {currentScenario.copilot_prompts.map((cp, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setEsqlQuery(cp.esql_query);
                          handleRunEsql();
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                          isDark ? "bg-slate-950 border-slate-800 hover:border-amber-500/50 text-slate-200" : "bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-800"
                        }`}
                      >
                        <div className="font-semibold text-amber-400">"{cp.question}"</div>
                      </button>
                    ))}
                  </div>

                  {/* Query Editor */}
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={4}
                      value={esqlQuery}
                      onChange={(e) => setEsqlQuery(e.target.value)}
                      className={`w-full p-3 rounded-xl font-mono text-xs border outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-amber-300" : "bg-slate-50 border-slate-200 text-amber-900"
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleRunEsql}
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

              {/* TAB 8: CERT-In FORM */}
              {activeTab === "certin" && (
                <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
                  isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-sky-500">
                        <FileText className="h-4 w-4" />
                        CERT-In Annexure-1 Statutory Incident Reporting Form
                      </div>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Mandatory 6-Hour Filing under IT Act 2000 Section 70B
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadPdf}
                      className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl border font-mono text-xs space-y-2 whitespace-pre-wrap ${
                    isDark ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}>
                    <div className="font-bold text-sky-400">INDIAN COMPUTER EMERGENCY RESPONSE TEAM (CERT-In)</div>
                    <div>INCIDENT REPORTING FORM - ANNEXURE 1</div>
                    <div className="text-slate-500">------------------------------------------------------------</div>
                    <div>1. Name of Organisation: Apex Commercial Bank of India Ltd (BFSI)</div>
                    <div>2. Date & Time of Incident: {new Date().toUTCString()}</div>
                    <div>3. Incident Ref ID: {currentScenario.incident_id}</div>
                    <div>4. Nature of Incident: {currentScenario.threat_tactic} ({currentScenario.title})</div>
                    <div>5. Primary Threat Source IP: {currentScenario.attacker_ip}</div>
                    <div>6. Direct Financial Risk: Rs. {currentScenario.direct_exposure_inr.toLocaleString("en-IN")}.00</div>
                    <div>7. Accounts Impacted: {currentScenario.step3.affected_accounts_total} Accounts</div>
                    <div>8. Remedial Actions: {currentScenario.step4.actions[0]?.title}, {currentScenario.step4.actions[1]?.title}</div>
                    <div>9. Cryptographic Evidence: Sealed under SHA-256 Hash Chain (AWS S3 WORM)</div>
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

                  <div className="flex items-center gap-2">
                    {[
                      { code: "hi", label: "हिन्दी (Hindi)" },
                      { code: "mr", label: "मराठी (Marathi)" },
                      { code: "ta", label: "தமிழ் (Tamil)" },
                      { code: "te", label: "తెలుగు (Telugu)" },
                      { code: "bn", label: "বাংলা (Bengali)" }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedLang === lang.code
                            ? "bg-sky-600 text-white shadow"
                            : (isDark ? "bg-slate-900 border border-slate-800 text-slate-400" : "bg-slate-100 border border-slate-200 text-slate-700")
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>

                  <div className={`p-4 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap ${
                    isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}>
                    {translatedText || currentScenario.indic[selectedLang] || currentScenario.indic["hi"]}
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
                      Cryptographic Evidence Ledger (SHA-256 Merkle Chain)
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      AWS S3 Object Lock (WORM)
                    </span>
                  </div>

                  <div className="space-y-2.5 overflow-y-auto max-h-[350px]">
                    {[
                      { block: 101, step: "ALERT_ZERO_DISCOVERY_TRIGGER", hash: "0x7a3f89e219ba482c3d4e5f6a...", prev: "0x000000000000000000000000..." },
                      { block: 102, step: "ESQL_EVIDENCE_GATHERED", hash: "0x9c4172f8812e99a1b2c3d4e5...", prev: "0x7a3f89e219ba482c3d4e5f6a..." },
                      { block: 103, step: "FINANCIAL_EXPOSURE_QUANTIFIED", hash: "0x1f8e99b247012caa3d4e5f6a...", prev: "0x9c4172f8812e99a1b2c3d4e5..." },
                      { block: 104, step: "HUMAN_CONTAINMENT_APPROVED", hash: "0x3d2b881729ec55104e5f6a7b...", prev: "0x1f8e99b247012caa3d4e5f6a..." },
                      { block: 105, step: "CERT_IN_ANNEXURE1_SEALED", hash: currentScenario.step6.sha256_hash.slice(0, 26) + "...", prev: "0x3d2b881729ec55104e5f6a7b..." }
                    ].map((b) => (
                      <div key={b.block} className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
                        isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                      }`}>
                        <div>
                          <div className="flex items-center gap-2 font-bold">
                            <span className="text-purple-400">Block #{b.block}</span>
                            <span>• {b.step}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">Prev Hash: {b.prev}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sky-400 font-bold">Hash: {b.hash}</div>
                          <div className="text-[10px] text-emerald-400 mt-0.5">WORM Locked in ap-south-1</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* MODAL 1: SOC ESCALATION WEBHOOKS */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 text-left space-y-4 ${
            isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900 shadow-2xl"
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Send className="h-4 w-4 text-purple-500" />
                <span>Dispatch SOC Escalation Webhook</span>
              </div>
              <button onClick={() => setShowEscalateModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Slack Channel:</label>
                <input readOnly value={currentScenario.escalation.slack_channel} className={`w-full p-2 rounded-lg border font-mono ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`} />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">PagerDuty Urgency:</label>
                <input readOnly value={currentScenario.escalation.pagerduty_urgency} className={`w-full p-2 rounded-lg border font-mono font-bold text-red-400 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`} />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Jira Ticket Summary:</label>
                <textarea readOnly rows={2} value={currentScenario.escalation.jira_summary} className={`w-full p-2 rounded-lg border font-mono ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setShowEscalateModal(false)} className="px-3 py-1.5 rounded-lg border text-xs font-bold">Cancel</button>
              <button
                onClick={() => {
                  alert(`Escalation payload dispatched to ${currentScenario.escalation.slack_channel} & PagerDuty successfully!`);
                  setShowEscalateModal(false);
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow"
              >
                Dispatch Webhook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RAW ECS PAYLOAD VIEWER */}
      {rawEcsModalData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 text-left space-y-4 ${
            isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900 shadow-2xl"
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm text-sky-400 font-mono">
                <Code2 className="h-4 w-4" />
                <span>Raw ECS 8.11 JSON Telemetry</span>
              </div>
              <button onClick={() => setRawEcsModalData(null)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>
            <pre className={`p-3 rounded-xl border text-[11px] font-mono overflow-auto max-h-72 ${
              isDark ? "bg-slate-950 border-slate-800 text-emerald-300" : "bg-slate-50 border-slate-200 text-emerald-800"
            }`}>
              {JSON.stringify(rawEcsModalData, null, 2)}
            </pre>
            <div className="flex justify-end">
              <button onClick={() => setRawEcsModalData(null)} className="bg-sky-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
