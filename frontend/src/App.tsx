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
  CornerDownRight,
  Code2,
  CheckSquare,
  X,
  Maximize2,
  SlidersHorizontal,
  Hash,
  Compass
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
  status: string;
  
  // Step 1: Classification & Materiality
  step1: {
    rbi_ref: string;
    certin_category: string;
    threshold_desc: string;
    clock_status: string;
  };

  // Step 2: Autonomous Detection + Forensic Forensics
  step2: {
    autonomous_detection_title: string;
    autonomous_detection_rule: string;
    autonomous_detection_query: string;
    autonomous_detection_explanation: string;
    
    forensic_blast_radius_title: string;
    forensic_blast_radius_query: string;
    
    discovered_entity: string;
    compromised_id: string;
    matched_count: string;
    
    sample_table: {
      columns: string[];
      rows: (string | number)[][];
    };
  };

  // Step 3: Financial Exposure Scoring
  step3: {
    blast_radius_summary: string;
    corporate_count: number;
    hni_count: number;
    retail_count: number;
    affected_accounts_total: number;
    account_examples: string;
    penalty_saved: string;
    business_risk_level: string;
    customer_profiles: {
      account_id: string;
      name: string;
      tier: "Corporate" | "HNI" | "Retail";
      balance_inr: number;
      exposed_inr: number;
      status: "FROZEN_PRESERVED" | "UNDER_REVIEW" | "NORMAL";
      branch: string;
    }[];
  };

  // Step 4: Containment Actions & HITL Gate
  step4: {
    actions: { title: string; system: string; description: string }[];
    containment_success_msg: string;
  };

  // Step 5: Official CERT-In Report
  step5: {
    affected_systems: string;
    remedial_summary: string;
  };

  // MITRE Attack Chain Progress
  mitre_stages: {
    stage: string;
    tactic: string;
    technique: string;
    status: "DETECTED" | "CONTAINED" | "MITIGATED" | "BASELINE";
    desc: string;
  }[];

  // Attack Topology Graph Nodes
  topology: {
    title: string;
    description: string;
    nodes: TopologyNode[];
  };

  // Forensic Event Timeline
  timeline: TimelineEvent[];

  // AI Copilot Prompts
  copilot_prompts: AICopilotPrompt[];

  // AI Chain-of-Thought Logs
  chain_of_thought: {
    step: string;
    thought: string;
    tool_call: string;
    time: string;
  }[];

  // Interactive ES|QL Terminal Presets
  terminal: {
    default_query: string;
    preset1_label: string;
    preset1_query: string;
    preset2_label: string;
    preset2_query: string;
  };

  // Regional Indic Translations
  indic: {
    [key: string]: string;
  };

  // Escalation Webhook Payloads
  escalation: {
    slack_channel: string;
    pagerduty_urgency: string;
    jira_summary: string;
  };
}

const SCENARIOS_DATA: ScenarioConfig[] = [
  {
    incident_id: "INC-2026-0902-01",
    title: "Privileged OAuth2 Token Theft & Unauthorized Corporate UPI Batch Payout",
    severity: "CRITICAL",
    threat_tactic: "Privilege Escalation / Financial Exfiltration",
    mitre_id: "T1078.004",
    direct_exposure_inr: 18240000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 0,
    status: "TRIAGED_ALERT_ZERO",
    step1: {
      rbi_ref: "RBI/2021-22/Master-Direction-Payment-Security-Controls-Sec-4.2",
      certin_category: "CIAD-2022-04 Unauthorized Access & Financial Fraud",
      threshold_desc: "Direct exposure of ₹ 1,82,40,000 exceeds the ₹ 5,00,000 regulatory materiality limit.",
      clock_status: "Mandatory 6-Hour Statutory Clock Activated."
    },
    step2: {
      autonomous_detection_title: "1. Autonomous Anomaly Detection (Zero-IP Pre-knowledge)",
      autonomous_detection_rule: "Behavioral Rule: High-Velocity Financial Drain with Elevated AML Risk",
      autonomous_detection_query: "FROM logs-banking-*\n| WHERE bank.channel == \"UPI_GATEWAY\" AND bank.aml_risk_score > 85.0\n| STATS total_drained = sum(bank.amount_inr), tx_count = count() BY source.ip, user.name, bank.batch_id\n| WHERE total_drained > 5000000\n| SORT total_drained desc",
      autonomous_detection_explanation: "Elastic ES|QL scanned all banking transactions without knowing any IP beforehand, mathematically grouping by source.ip and automatically surfacing 198.51.100.44 as having drained ₹ 1.82 Cr with 90+ AML risk.",
      
      forensic_blast_radius_title: "2. Grounded Blast Radius Investigation (Pivoting on Discovered Entity)",
      forensic_blast_radius_query: "FROM logs-*\n| WHERE source.ip == \"198.51.100.44\"\n| KEEP @timestamp, event.category, user.name, bank.upi_vpa, bank.amount_inr\n| SORT @timestamp asc\n| LIMIT 20",
      
      discovered_entity: "198.51.100.44 (Automatically Discovered via AML > 85 & Volume > ₹50L)",
      compromised_id: "OAuth2 Bearer Token for svc_payment_gw",
      matched_count: "18 unauthorized payout transactions identified in 8.4ms.",
      sample_table: {
        columns: ["@timestamp", "user.name", "bank.upi_vpa", "bank.amount_inr", "bank.customer_tier"],
        rows: [
          ["2026-09-02T19:24:12Z", "svc_payment_gw", "merchant.bulk@yesbank", 4200000.00, "Corporate"],
          ["2026-09-02T19:24:35Z", "svc_payment_gw", "merchant.bulk@yesbank", 3800000.00, "Corporate"],
          ["2026-09-02T19:25:01Z", "svc_payment_gw", "merchant.bulk@yesbank", 4500000.00, "Corporate"],
          ["2026-09-02T19:25:28Z", "svc_payment_gw", "merchant.bulk@yesbank", 3200000.00, "Corporate"],
          ["2026-09-02T19:26:00Z", "svc_payment_gw", "merchant.bulk@yesbank", 2540000.00, "HNI"]
        ]
      }
    },
    step3: {
      blast_radius_summary: "Direct funds exposed in pending UPI/IMPS corporate settlement batch",
      corporate_count: 4,
      hni_count: 14,
      retail_count: 0,
      affected_accounts_total: 18,
      account_examples: "Apex Infotech (ACC-CORP-9921448) & Bharat Logistics (ACC-CORP-8812901)",
      penalty_saved: "₹ 1.00 Crore (RBI Sec 4.2)",
      business_risk_level: "CRITICAL",
      customer_profiles: [
        { account_id: "ACC-CORP-9921448", name: "Apex Infotech Ltd (Salary Disbursal)", tier: "Corporate", balance_inr: 45000000.00, exposed_inr: 8200000.00, status: "FROZEN_PRESERVED", branch: "BKC Flagship Branch, Mumbai" },
        { account_id: "ACC-CORP-8812901", name: "Bharat Logistics Global Corp", tier: "Corporate", balance_inr: 28000000.00, exposed_inr: 6400000.00, status: "FROZEN_PRESERVED", branch: "Nariman Point, Mumbai" },
        { account_id: "ACC-HNI-7719203", name: "Rajeshwar Singhania Family Trust", tier: "HNI", balance_inr: 12500000.00, exposed_inr: 2100000.00, status: "FROZEN_PRESERVED", branch: "Vasant Vihar, New Delhi" },
        { account_id: "ACC-HNI-6628194", name: "Dr. Ananya Roy (Private Wealth)", tier: "HNI", balance_inr: 8900000.00, exposed_inr: 1540000.00, status: "FROZEN_PRESERVED", branch: "Indiranagar, Bengaluru" }
      ]
    },
    step4: {
      actions: [
        {
          title: "Revoke API Gateway OAuth2 Bearer Token #8821 (Identity: svc_payment_gw)",
          system: "API Gateway / Auth0",
          description: "Instantly invalidate all active sessions and refresh tokens for service account svc_payment_gw."
        },
        {
          title: "Null-route Attacker IP 198.51.100.44 on Palo Alto Edge Firewall",
          system: "Palo Alto Networks Edge Firewall",
          description: "Null-route attacker IP across all DMZ edge routers to prevent further egress requests."
        },
        {
          title: "Freeze settlement queue for batch BATCH-20260902-8821 in NPCI switch",
          system: "NPCI UPI Switch Connector",
          description: "Freeze settlement queue for batch before inter-bank clearing completes."
        }
      ],
      containment_success_msg: "Containment executed in 42ms. Inter-bank batch settlement frozen in NPCI switch. Zero customer fund loss."
    },
    step5: {
      affected_systems: "API Gateway (api-gateway.bank.internal), NPCI UPI Switch (10.0.8.50)",
      remedial_summary: "OAuth2 token revoked, IP 198.51.100.44 null-routed, UPI batch BATCH-20260902-8821 frozen."
    },
    mitre_stages: [
      { stage: "Initial Access", tactic: "TA0001", technique: "T1190 Exploit Public-Facing App", status: "DETECTED", desc: "Attacker probed staging API Gateway endpoint from external IP." },
      { stage: "Credential Access", tactic: "TA0006", technique: "T1552 Unsecured Credentials", status: "DETECTED", desc: "Extracted OAuth2 Bearer Token for service account svc_payment_gw." },
      { stage: "Privilege Escalation", tactic: "TA0004", technique: "T1078 Valid Accounts", status: "CONTAINED", desc: "Impersonated payment administrator role to submit bulk transaction batches." },
      { stage: "Financial Impact", tactic: "TA0040", technique: "T1499 Financial Fraud / Exfiltration", status: "MITIGATED", desc: "Submitted 18 unauthorized batch transfers totaling ₹ 1.82 Crore to NPCI switch." }
    ],
    topology: {
      title: "UPI Payout Injection Attack Path",
      description: "Attacker leveraged stolen OAuth2 token to inject unauthorized corporate batch into NPCI switch.",
      nodes: [
        { id: "node-1", label: "Threat Actor (Tor Node)", type: "ATTACKER", ip: "198.51.100.44", geo: "Frankfurt, DE", status: "BLOCKED", protocol: "HTTPS / TLS 1.3", mitre_tag: "T1190", details: "High-volume burst targeting OAuth2 API endpoints." },
        { id: "node-2", label: "Palo Alto Edge Firewall", type: "GATEWAY", ip: "10.0.1.1", geo: "AWS Mumbai (ap-south-1)", status: "ISOLATED", protocol: "BGP Null-Route", mitre_tag: "T1562", details: "Active ACL block applied in 18ms." },
        { id: "node-3", label: "Bank API Gateway (Auth0)", type: "CORE_SYSTEM", ip: "10.0.4.20", geo: "DMZ Zone A", status: "COMPROMISED", protocol: "OAuth2 Bearer", mitre_tag: "T1078.004", details: "Identity svc_payment_gw revoked & invalidated." },
        { id: "node-4", label: "NPCI UPI Switch Hub", type: "CORE_SYSTEM", ip: "10.0.8.50", geo: "Core Clearing VPC", status: "ISOLATED", protocol: "ISO 8583 / REST", mitre_tag: "T1499", details: "Settlement batch BATCH-20260902-8821 frozen." },
        { id: "node-5", label: "Impacted Corporate Accounts", type: "TARGET", ip: "10.0.12.100", geo: "Core CBS (BKC Mumbai)", status: "FROZEN", protocol: "Finacle CBS", mitre_tag: "T1048", details: "18 Corporate accounts secured. ₹ 1.82 Cr preserved." }
      ]
    },
    timeline: [
      { offset: "-03:45", time: "19:22:15 UTC", title: "API Gateway Token Probe", tactic: "Reconnaissance", source_ip: "198.51.100.44", description: "Attacker tested compromised OAuth2 Bearer token against /v2/payments/batch/submit.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:22:15Z", "source.ip": "198.51.100.44", "http.request.method": "POST", "url.path": "/v2/payments/batch/submit", "user.name": "svc_payment_gw", "http.response.status_code": 200 } },
      { offset: "-01:20", time: "19:24:12 UTC", title: "High-Volume UPI Payout Burst", tactic: "Financial Exfiltration", source_ip: "198.51.100.44", description: "Injected 18 bulk transfer requests totaling ₹ 1,82,40,000 targeting YesBank merchant VPA.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:24:12Z", "source.ip": "198.51.100.44", "bank.channel": "UPI_GATEWAY", "bank.amount_inr": 4200000.0, "bank.aml_risk_score": 94.2, "bank.upi_vpa": "merchant.bulk@yesbank" } },
      { offset: "00:00", time: "19:25:32 UTC", title: "VIGIL Alert Zero Triggered", tactic: "Autonomous Detection", source_ip: "198.51.100.44", description: "Behavioral ES|QL rule flagged IP 198.51.100.44 for exceeding ₹50L AML volume threshold in under 2 mins.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:25:32Z", "rule.name": "Autonomous UPI Velocity Anomaly", "rule.severity": "CRITICAL", "bank.total_drained_inr": 18240000.0, "rbi.materiality": true } },
      { offset: "+00:38", time: "19:26:10 UTC", title: "HITL Containment Enforced", tactic: "Automated Remediation", source_ip: "198.51.100.44", description: "OAuth2 token revoked, IP null-routed, NPCI settlement batch frozen. Zero customer fund loss.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:26:10Z", "containment.status": "COMPLETED", "containment.elapsed_ms": 42, "funds_saved_inr": 18240000.0 } }
    ],
    copilot_prompts: [
      { question: "Detect high-value UPI drains with elevated AML risk score", esql_query: "FROM logs-banking-*\n| WHERE bank.channel == \"UPI_GATEWAY\" AND bank.aml_risk_score > 85.0\n| STATS total_drained = sum(bank.amount_inr), tx_count = count() BY source.ip, user.name\n| WHERE total_drained > 5000000\n| SORT total_drained desc", explanation: "Calculates the total drain per source IP where AML risk exceeds 85.0 and total drained is over ₹50 Lakhs." },
      { question: "List all transactions initiated by service account svc_payment_gw", esql_query: "FROM logs-banking-*\n| WHERE user.name == \"svc_payment_gw\"\n| KEEP @timestamp, bank.upi_vpa, bank.amount_inr, bank.customer_tier\n| SORT @timestamp asc\n| LIMIT 25", explanation: "Retrieves the exact list of individual payout transactions submitted using the compromised service account." },
      { question: "Identify all destination UPI VPAs receiving suspicious funds", esql_query: "FROM logs-banking-*\n| WHERE source.ip == \"198.51.100.44\"\n| STATS total_received = sum(bank.amount_inr), count = count() BY bank.upi_vpa\n| SORT total_received desc", explanation: "Groups outbound money flows by destination VPA to identify all fraud collection endpoints." }
    ],
    chain_of_thought: [
      { step: "Triage Alert Zero", thought: "Ingested high-frequency transaction burst from API Gateway. Evaluating AML risk index...", tool_call: "elastic.alert_zero.stream", time: "T+0.2s" },
      { step: "Materiality Assessment", thought: "Aggregate exposed sum is ₹ 1,82,40,000 > ₹ 5,00,000 threshold. Statutory 6-hour CERT-In clock initiated.", tool_call: "rbi.materiality.check", time: "T+1.1s" },
      { step: "ES|QL Forensic Query", thought: "Generating piped ES|QL query to isolate attacker IP 198.51.100.44 and correlate affected customer tier balances.", tool_call: "generate_esql", time: "T+2.4s" },
      { step: "HITL Containment Proposal", thought: "Drafted 3 atomic containment actions: Token revocation, Firewall null-routing, NPCI batch freeze. Requesting analyst digital sign-off.", tool_call: "containment.hitl.gate", time: "T+3.8s" },
      { step: "Cryptographic Evidence Seal", thought: "Assembling SHA-256 Merkle root hash. Appending immutable block to AWS S3 Object Lock ledger.", tool_call: "evidence.ledger.append", time: "T+5.0s" }
    ],
    terminal: {
      default_query: "FROM logs-banking-*\n| WHERE bank.channel == \"UPI_GATEWAY\" AND bank.aml_risk_score > 85.0\n| STATS total_drained = sum(bank.amount_inr), tx_count = count() BY source.ip, user.name, bank.batch_id\n| WHERE total_drained > 5000000",
      preset1_label: "⚡ Autonomous Threat Hunt (No IP)",
      preset1_query: "FROM logs-banking-*\n| WHERE bank.channel == \"UPI_GATEWAY\" AND bank.aml_risk_score > 85.0\n| STATS total_drained = sum(bank.amount_inr), tx_count = count() BY source.ip, user.name, bank.batch_id\n| WHERE total_drained > 5000000",
      preset2_label: "🎯 Pivoted Blast Radius",
      preset2_query: "FROM logs-*\n| WHERE source.ip == \"198.51.100.44\"\n| KEEP @timestamp, user.name, bank.upi_vpa, bank.amount_inr\n| LIMIT 10"
    },
    indic: {
      hi: "सुरक्षा घटना सारांश: व्यवहार विश्लेषण के माध्यम से अनधिकृत कॉर्पोरेट यूपीआई भुगतान का स्वचालित पता चला। कुल रु. 1,82,40,000 की वित्तीय जोखिम को समय पर रोक दिया गया है।\n\n📌 क्षेत्रीय शाखा कार्रवाई: सभी प्रभावित कॉर्पोरेट वेतन खातों की तत्काल पुष्टि करें।",
      mr: "सुरक्षा घटना सारांश: संशयास्पद व्यवहारांचा शोध घेऊन अनधिकृत कॉर्पोरेट यूपीआय पेआउट शोधण्यात आले. एकूण रु. 1,82,40,000 चा आर्थिक धोका वेळेत रोखण्यात आला.\n\n📌 प्रादेशिक शाखा कृती: सर्व संबंधित कॉर्पोरेट वेतन खात्यांची त्वरित पडताळणी करा.",
      ta: "பாதுகாப்பு சம்பவ சுருக்கம்: நடத்தை அடிப்படையிலான அல்காரிதம் மூலம் அங்கீகரிக்கப்படாத கார்ப்பரேட் யுபிஐ பரிவர்த்தனை கண்டறியப்பட்டது. ரூ. 1,82,40,000 நிதி ஆபத்து முடக்கப்பட்டது.\n\n📌 கிளை நடவடிக்கை: பாதிக்கப்பட்ட நிறுவன சம்பள கணக்குகளை சரிபார்க்கவும்.",
      te: "భద్రతా సంఘటన సారాంశం: అనుమానాస్పద లావాదేవీల విశ్లేషణ ద్వారా అనధికార కార్పొరేట్ UPI చెల్లింపు స్వయంచాలకంగా గుర్తించబడింది. రూ. 1,82,40,000 ప్రమాదం తొలగించబడింది.\n\n📌 బ్రాంచ్ చర్య: ప్రభావిత కార్పొరేట్ ఖాతాలను ధృవీకరించండి.",
      bn: "নিরাপত্তা ঘটনা সারসংক্ষেপ: ব্যবহারিক প্যাটার্ন সনাক্তকরণের মাধ্যমে অননুমোদিত কর্পোরেট ইউপিআই পেমেন্ট স্বয়ংক্রিয়ভাবে ধরা পড়েছে। মোট ১,৮২,৪০,০০০ টাকা সুরক্ষিত।\n\n📌 শাখা পদক্ষেপ: সমস্ত প্রভাবিত কর্পোরেট অ্যাকাউন্ট অবিলম্বে যাচাই করুন।"
    },
    escalation: {
      slack_channel: "#soc-tier1-critical-incidents",
      pagerduty_urgency: "CRITICAL (P1) - IMMEDIATE PAGING",
      jira_summary: "[SEC-INC-01] Critical UPI Gateway Breach - Compromised OAuth2 Token svc_payment_gw"
    }
  },
  {
    incident_id: "INC-2026-0902-02",
    title: "Distributed Botnet Credential Stuffing on NetBanking Portal",
    severity: "HIGH",
    threat_tactic: "Credential Access / Brute Force",
    mitre_id: "T1110.004",
    direct_exposure_inr: 4250000.00,
    is_material: true,
    rbi_status: "MANDATORY_6_HOUR_FILING",
    current_step: 0,
    status: "TRIAGED_ALERT_ZERO",
    step1: {
      rbi_ref: "RBI/2021-22/Master-Direction-Cyber-Security-Framework-Annex-3",
      certin_category: "CIAD-2022-02 Identity Theft & Automated Credential Stuffing",
      threshold_desc: "Direct exposure of ₹ 42,50,000 across 28 compromised corporate customer accounts exceeds ₹ 5,00,000 limit.",
      clock_status: "Mandatory 6-Hour Statutory Clock Activated."
    },
    step2: {
      autonomous_detection_title: "1. Autonomous Anomaly Detection (Zero-IP Pre-knowledge)",
      autonomous_detection_rule: "Behavioral Rule: Multi-Account Authentication Failure Burst from Single Source",
      autonomous_detection_query: "FROM logs-auth-*\n| WHERE event.outcome == \"failure\"\n| STATS failed_logins = count(), targeted_accounts = count_distinct(user.name) BY source.ip\n| WHERE failed_logins > 10 AND targeted_accounts >= 5\n| SORT failed_logins desc",
      autonomous_detection_explanation: "Elastic ES|QL scanned all NetBanking authentication attempts without knowing any IP beforehand, finding source IP 203.0.113.89 attempting logins on 25+ distinct employee accounts within minutes.",
      
      forensic_blast_radius_title: "2. Grounded Blast Radius Investigation (Pivoting on Discovered Entity)",
      forensic_blast_radius_query: "FROM logs-banking-*\n| WHERE bank.batch_id == \"IMPS-BURST-9912\"\n| STATS total_stolen = sum(bank.amount_inr), victim_count = count() BY bank.channel",
      
      discovered_entity: "203.0.113.89 (Automatically Discovered via Failed Logins > 10 & Targeted Accounts >= 5)",
      compromised_id: "28 Corporate NetBanking Accounts",
      matched_count: "25 auth failure spikes + 12 rapid IMPS payout bursts identified in 6.1ms.",
      sample_table: {
        columns: ["@timestamp", "user.name", "source.ip", "event.outcome", "bank.amount_inr"],
        rows: [
          ["2026-09-02T19:30:10Z", "corp_user_101", "203.0.113.89", "failure", 0.00],
          ["2026-09-02T19:30:12Z", "corp_user_102", "203.0.113.89", "failure", 0.00],
          ["2026-09-02T19:31:05Z", "corp_user_103", "203.0.113.89", "success", 354166.67],
          ["2026-09-02T19:31:40Z", "corp_user_104", "203.0.113.89", "success", 354166.67],
          ["2026-09-02T19:32:15Z", "corp_user_105", "203.0.113.89", "success", 354166.67]
        ]
      }
    },
    step3: {
      blast_radius_summary: "Funds queued across high-velocity outbound IMPS transfer bursts",
      corporate_count: 28,
      hni_count: 0,
      retail_count: 0,
      affected_accounts_total: 28,
      account_examples: "28 Corporate Salary Accounts (ACC-CORP-NET-001 to ACC-CORP-NET-028)",
      penalty_saved: "₹ 50.00 Lakhs (RBI Sec 4.2)",
      business_risk_level: "HIGH",
      customer_profiles: [
        { account_id: "ACC-CORP-NET-001", name: "Vikram Malhotra (CFO Account)", tier: "Corporate", balance_inr: 1200000.00, exposed_inr: 350000.00, status: "FROZEN_PRESERVED", branch: "Cyber Hub, Gurugram" },
        { account_id: "ACC-CORP-NET-002", name: "Suresh Raman (Finance Mgr)", tier: "Corporate", balance_inr: 950000.00, exposed_inr: 350000.00, status: "FROZEN_PRESERVED", branch: "Cyber City, Hyderabad" },
        { account_id: "ACC-CORP-NET-003", name: "Priya Sundaram (Treasury)", tier: "Corporate", balance_inr: 1400000.00, exposed_inr: 350000.00, status: "FROZEN_PRESERVED", branch: "Anna Salai, Chennai" }
      ]
    },
    step4: {
      actions: [
        {
          title: "Enforce Geo-IP reputation block and rate-limit for Tor Node 203.0.113.89 on Edge WAF",
          system: "Cloudflare / Akamai Edge WAF",
          description: "Drop all ingress HTTP/HTTPS traffic from botnet IP across global edge POPs."
        },
        {
          title: "Force immediate password reset and terminate active web sessions for 28 targeted corporate users",
          system: "NetBanking IAM & SSO",
          description: "Kill active JWT session cookies and force MFA challenge on next login."
        },
        {
          title: "Apply high-velocity fraud hold on IMPS outbound queue IMPS-BURST-9912",
          system: "Core Banking Payment Switch",
          description: "Freeze transfer queue to prevent automated rapid IMPS settlement."
        }
      ],
      containment_success_msg: "Containment executed in 31ms. 28 sessions killed, botnet IP blocked on WAF, outbound IMPS burst frozen."
    },
    step5: {
      affected_systems: "NetBanking SSO Portal (auth-gateway.bank.internal), IMPS Switch (10.0.8.50)",
      remedial_summary: "WAF IP block enforced, 28 corporate accounts locked & password reset, IMPS queue frozen."
    },
    mitre_stages: [
      { stage: "Reconnaissance", tactic: "TA0043", technique: "T1595 Active Scanning", status: "DETECTED", desc: "Probed NetBanking login portal for response latency." },
      { stage: "Credential Access", tactic: "TA0006", technique: "T1110.004 Credential Stuffing", status: "DETECTED", desc: "Tested 4,200 username/password combos via Tor botnet." },
      { stage: "Persistence", tactic: "TA0003", technique: "T1078 Valid Accounts", status: "CONTAINED", desc: "Authenticated into 28 accounts and established active web sessions." },
      { stage: "Exfiltration", tactic: "TA0010", technique: "T1041 Exfiltration Over C2", status: "MITIGATED", desc: "Triggered high-velocity IMPS payout queue." }
    ],
    topology: {
      title: "Credential Stuffing & IMPS Burst Path",
      description: "Distributed botnet rotated through credentials to hijack 28 accounts and trigger IMPS payouts.",
      nodes: [
        { id: "node-1", label: "Botnet C2 Node", type: "ATTACKER", ip: "203.0.113.89", geo: "Kyiv, UA", status: "BLOCKED", protocol: "HTTP/2 (Bot Traffic)", mitre_tag: "T1110.004", details: "4,200 password attempts against SSO portal." },
        { id: "node-2", label: "Cloudflare Edge WAF", type: "GATEWAY", ip: "172.67.12.9", geo: "Global Edge", status: "ISOLATED", protocol: "WAF Rate-Limiting", mitre_tag: "T1562", details: "Geo-IP blacklist & JS challenge enacted in 12ms." },
        { id: "node-3", label: "NetBanking SSO IAM", type: "CORE_SYSTEM", ip: "10.0.6.10", geo: "Identity VPC", status: "COMPROMISED", protocol: "JWT / SAML 2.0", mitre_tag: "T1078", details: "28 hijacked sessions forcefully terminated." },
        { id: "node-4", label: "IMPS Outbound Switch", type: "CORE_SYSTEM", ip: "10.0.8.50", geo: "Core Clearing VPC", status: "ISOLATED", protocol: "IMPS Payout API", mitre_tag: "T1041", details: "Batch IMPS-BURST-9912 halted before RTGS clearing." },
        { id: "node-5", label: "28 Corporate Payroll Accounts", type: "TARGET", ip: "10.0.12.110", geo: "Core CBS (Gurugram)", status: "FROZEN", protocol: "Finacle Core", mitre_tag: "T1499", details: "₹ 42.50 Lakhs preserved. Password reset initiated." }
      ]
    },
    timeline: [
      { offset: "-05:10", time: "19:28:00 UTC", title: "Distributed Botnet Login Burst", tactic: "Credential Stuffing", source_ip: "203.0.113.89", description: "High-frequency authentication failures (>100 req/sec) observed on NetBanking SSO endpoint.", severity: "HIGH", raw_ecs: { "@timestamp": "2026-09-02T19:28:00Z", "source.ip": "203.0.113.89", "event.category": "authentication", "event.outcome": "failure", "user.target_count": 28 } },
      { offset: "-02:45", time: "19:30:25 UTC", title: "Successful Logins & Session Spawn", tactic: "Persistence", source_ip: "203.0.113.89", description: "Attacker gained entry to 28 corporate NetBanking accounts via leaked credential dump.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:30:25Z", "source.ip": "203.0.113.89", "event.outcome": "success", "session.count": 28 } },
      { offset: "00:00", time: "19:33:10 UTC", title: "VIGIL Alert Zero Triggered", tactic: "Autonomous Detection", source_ip: "203.0.113.89", description: "ES|QL correlation flagged single IP traversing 28 distinct corporate accounts within 3 minutes.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:33:10Z", "rule.name": "Multi-Account Stuffing Anomaly", "bank.targeted_accounts": 28, "rbi.materiality": true } },
      { offset: "+00:31", time: "19:33:41 UTC", title: "Automated Session & WAF Kill", tactic: "Automated Remediation", source_ip: "203.0.113.89", description: "28 JWT sessions revoked, Cloudflare WAF block enforced, IMPS queue frozen in 31ms.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:33:41Z", "containment.status": "COMPLETED", "sessions_revoked": 28, "funds_saved_inr": 4250000.0 } }
    ],
    copilot_prompts: [
      { question: "Identify IP addresses targeting more than 5 distinct customer accounts", esql_query: "FROM logs-auth-*\n| WHERE event.outcome == \"failure\"\n| STATS failed_logins = count(), targeted_accounts = count_distinct(user.name) BY source.ip\n| WHERE targeted_accounts >= 5\n| SORT targeted_accounts desc", explanation: "Calculates the number of distinct username login targets from a single origin IP address." },
      { question: "Audit all successful logins originated by botnet IP 203.0.113.89", esql_query: "FROM logs-auth-*\n| WHERE source.ip == \"203.0.113.89\" AND event.outcome == \"success\"\n| KEEP @timestamp, user.name, user_agent.original\n| SORT @timestamp asc", explanation: "Filters for successful account compromises stemming from the attacking botnet source." }
    ],
    chain_of_thought: [
      { step: "Auth Anomaly Detected", thought: "Identified high-velocity authentication failure rate (>10/min) from IP 203.0.113.89 across 28 distinct corporate users.", tool_call: "elastic.waf_monitor", time: "T+0.3s" },
      { step: "RBI Impact Scored", thought: "Direct IMPS burst queue totals ₹ 42.50 Lakhs. Exceeds RBI Sec 4.2 mandatory reporting threshold.", tool_call: "rbi.materiality.check", time: "T+0.9s" },
      { step: "ES|QL Blast Radius", thought: "Correlating all active sessions from Tor IP. Total victim count confirmed at 28 corporate payroll users.", tool_call: "generate_esql", time: "T+1.8s" },
      { step: "Containment Execution", thought: "Blocking source IP at Cloudflare Edge WAF and issuing global session revocation across IAM directory.", tool_call: "containment.hitl.gate", time: "T+2.6s" }
    ],
    terminal: {
      default_query: "FROM logs-auth-*\n| WHERE event.outcome == \"failure\"\n| STATS failed_logins = count(), targeted_accounts = count_distinct(user.name) BY source.ip\n| WHERE failed_logins > 10",
      preset1_label: "⚡ Autonomous Botnet Hunt",
      preset1_query: "FROM logs-auth-*\n| WHERE event.outcome == \"failure\"\n| STATS failed_logins = count(), targeted_accounts = count_distinct(user.name) BY source.ip\n| WHERE failed_logins > 10\n| SORT failed_logins desc",
      preset2_label: "🎯 Pivoted IMPS Blast Radius",
      preset2_query: "FROM logs-banking-*\n| WHERE bank.batch_id == \"IMPS-BURST-9912\"\n| STATS sum(bank.amount_inr), count() BY bank.channel"
    },
    indic: {
      hi: "सुरक्षा घटना सारांश: विफल लॉगिन स्पाइक विश्लेषण द्वारा स्वचालित बॉटनेट हमले का पता चला। 28 कॉर्पोरेट खातों से रु. 42,50,000 की निकासी रोक दी गई।\n\n📌 क्षेत्रीय शाखा कार्रवाई: प्रभावित खातों के पासवर्ड तुरंत रीसेट करें।",
      mr: "सुरक्षा घटना सारांश: अयशस्वी लॉगिन पॅटर्नद्वारे बॉटनेटकडून होणारा हल्ला आपोआप शोधण्यात आला. रु. 42,50,000 चा व्यवहार त्वरित थांबवला.\n\n📌 प्रादेशिक शाखा कृती: बाधित ग्राहकांचे पासवर्ड रीसेट करा.",
      ta: "பாதுகாப்பு சம்பவ சுருக்கம்: தொடர் தவறான கடவுச்சொல் முயற்சிகள் மூலம் பாஸ்வேர்ட் தாக்குதல் தானாகக் கண்டறியப்பட்டது. ரூ. 42,50,000 தவறான பரிவர்த்தனை தடுத்து நிறுத்தப்பட்டது.\n\n📌 கிளை நடவடிக்கை: பாதிக்கப்பட்ட கணக்குகளுக்கு புதிய கடவுச்சொல் வழங்கவும்.",
      te: "భద్రతా సంఘటన సారాంశం: విఫలమైన లాగిన్ విశ్లేషణ ద్వారా బోట్‌నెట్ దాడి స్వయంచాలకంగా పసిగట్టబడింది. రూ. 42,50,000 మోసపూరిత బదిలీలు ఆపివేయబడ్డాయి.\n\n📌 బ్రాంచ్ చర్య: పాస్‌వర్డ్‌లను తక్షణమే రీసెట్ చేయండి.",
      bn: "নিরাপত্তা ঘটনা সারসংক্ষেপ: ব্যর্থ লগইন স্পাইক বিশ্লেষণের মাধ্যমে বটনেট আক্রমণ স্বয়ংক্রিয়ভাবে চিহ্নিত হয়েছে। ৪২,৫০,০০০ টাকার অননুমোদিত লেনদেন স্থগিত।\n\n📌 শাখা পদক্ষেপ: আক্রান্ত অ্যাকাউন্টের পাসওয়ার্ড রিসেট করুন।"
    },
    escalation: {
      slack_channel: "#soc-tier1-identity-alerts",
      pagerduty_urgency: "HIGH (P2)",
      jira_summary: "[SEC-INC-02] Botnet Credential Stuffing on NetBanking SSO - 28 Accounts Targeted"
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
    current_step: 0,
    status: "TRIAGED_ALERT_ZERO",
    step1: {
      rbi_ref: "RBI/2019-20/Circular-Security-Measures-ATM-Switches-Sec-2.1",
      certin_category: "CIAD-2022-01 Network Protocol & ISO 8583 Message Manipulation",
      threshold_desc: "Direct exposure of ₹ 3,40,00,000 in fraudulent physical cash dispenses exceeds ₹ 5,00,000 limit.",
      clock_status: "Mandatory 6-Hour Statutory Clock Activated."
    },
    step2: {
      autonomous_detection_title: "1. Autonomous Anomaly Detection (Zero-IP Pre-knowledge)",
      autonomous_detection_rule: "Behavioral Rule: Excessive Cash Dispense Velocity Across ATM Regional Switch Network",
      autonomous_detection_query: "FROM logs-banking-*\n| WHERE bank.channel == \"ATM_SWITCH\"\n| STATS total_cash_dispensed = sum(bank.amount_inr), dispense_count = count() BY source.ip, bank.batch_id\n| WHERE total_cash_dispensed > 10000000\n| SORT total_cash_dispensed desc",
      autonomous_detection_explanation: "Elastic ES|QL grouped all ATM transactions by source network tap without prior IP knowledge, flagging 10.14.88.22 for dispensing ₹ 3.40 Crore in physical cash in under 30 minutes.",
      
      forensic_blast_radius_title: "2. Grounded Blast Radius Investigation (Pivoting on Discovered Entity)",
      forensic_blast_radius_query: "FROM logs-banking-*\n| WHERE bank.channel == \"ATM_SWITCH\" AND source.ip == \"10.14.88.22\"\n| KEEP @timestamp, bank.account_id, bank.amount_inr, bank.customer_tier\n| SORT @timestamp asc\n| LIMIT 20",
      
      discovered_entity: "10.14.88.22 (Automatically Discovered via ATM Switch Cash Dispense > ₹1 Crore)",
      compromised_id: "switch_daemon_vlan8 (Hardware Terminal Injection)",
      matched_count: "12 forged ISO 8583 response code 00 dispense records identified in 7.9ms.",
      sample_table: {
        columns: ["@timestamp", "bank.account_id", "source.ip", "bank.channel", "bank.amount_inr"],
        rows: [
          ["2026-09-02T19:40:00Z", "ACC-HNI-ATM-001", "10.14.88.22", "ATM_SWITCH", 2833333.33],
          ["2026-09-02T19:42:15Z", "ACC-HNI-ATM-002", "10.14.88.22", "ATM_SWITCH", 2833333.33],
          ["2026-09-02T19:44:30Z", "ACC-HNI-ATM-003", "10.14.88.22", "ATM_SWITCH", 2833333.33],
          ["2026-09-02T19:46:45Z", "ACC-HNI-ATM-004", "10.14.88.22", "ATM_SWITCH", 2833333.33],
          ["2026-09-02T19:49:00Z", "ACC-HNI-ATM-005", "10.14.88.22", "ATM_SWITCH", 2833333.33]
        ]
      }
    },
    step3: {
      blast_radius_summary: "Physical cash dispense manipulated at regional ATM switch cluster",
      corporate_count: 0,
      hni_count: 12,
      retail_count: 0,
      affected_accounts_total: 12,
      account_examples: "12 High-Net-Worth Individual Accounts (ACC-HNI-ATM-001 to ACC-HNI-ATM-012)",
      penalty_saved: "₹ 1.00 Crore (RBI Sec 4.2)",
      business_risk_level: "CRITICAL",
      customer_profiles: [
        { account_id: "ACC-HNI-ATM-001", name: "Anand Mahindra (Demo Private Wealth)", tier: "HNI", balance_inr: 50000000.00, exposed_inr: 2833333.33, status: "FROZEN_PRESERVED", branch: "Worli, Mumbai" },
        { account_id: "ACC-HNI-ATM-002", name: "Kiran Mazumdar (Demo Private Wealth)", tier: "HNI", balance_inr: 42000000.00, exposed_inr: 2833333.33, status: "FROZEN_PRESERVED", branch: "MG Road, Bengaluru" }
      ]
    },
    step4: {
      actions: [
        {
          title: "Quarantine rogue ATM switch segment 10.14.88.22 into isolated sinkhole VLAN via 802.1X NAC",
          system: "Cisco ISE 802.1X NAC",
          description: "Isolate physical switch port to stop forged ISO 8583 approval packets."
        },
        {
          title: "Rotate zone encryption and MAC keys for ATM cluster ATM-SWITCH-CLUSTER-04 in HSM",
          system: "Hardware Security Module (HSM)",
          description: "Force regeneration of cryptographic MAC validation keys across regional cluster."
        },
        {
          title: "Force stand-in processing OFF and require 100% synchronous core ledger balance confirmation",
          system: "Base24 Core Switch",
          description: "Disable offline authorization mode to prevent depleted card cash dispenses."
        }
      ],
      containment_success_msg: "Containment executed in 48ms. Rogue VLAN port isolated, HSM MAC keys rotated, synchronous CBS check enforced."
    },
    step5: {
      affected_systems: "Regional ATM Switch Router (10.14.88.22), Base24 ATM Cluster 04 (10.0.12.1)",
      remedial_summary: "VLAN quarantined, HSM cryptographic keys rotated, synchronous ledger validation enforced."
    },
    mitre_stages: [
      { stage: "Network Injection", tactic: "TA0009", technique: "T1557.002 ARP Poisoning", status: "DETECTED", desc: "Tapped Ethernet bridge between ATM cluster and switch." },
      { stage: "Data Manipulation", tactic: "TA0040", technique: "T1565 Data Manipulation", status: "DETECTED", desc: "Changed ISO 8583 response bit from 51 (Decline) to 00 (Approved)." },
      { stage: "Impact / Cash Out", tactic: "TA0040", technique: "T1499 Denial of Service / Theft", status: "MITIGATED", desc: "Automated cash dispensing triggered across 12 ATM terminals." }
    ],
    topology: {
      title: "ATM ISO 8583 Switch-in-the-Middle Path",
      description: "Hardware tap intercepted ATM Ethernet connection to forge approval codes (Bit 39 = 00).",
      nodes: [
        { id: "node-1", label: "Rogue Hardware TAP", type: "ATTACKER", ip: "10.14.88.22", geo: "Regional ATM Substation", status: "BLOCKED", protocol: "ISO 8583 MITM", mitre_tag: "T1557", details: "Forged response code 00 (Approved) on declined transactions." },
        { id: "node-2", label: "Cisco ISE 802.1X NAC", type: "GATEWAY", ip: "10.0.2.1", geo: "Branch Edge", status: "ISOLATED", protocol: "802.1X Dynamic VLAN", mitre_tag: "T1562", details: "Port placed in Sinkhole Quarantine in 22ms." },
        { id: "node-3", label: "HSM Key Server (Zone A)", type: "CORE_SYSTEM", ip: "10.0.3.5", geo: "Hardware Security Module", status: "ISOLATED", protocol: "Thales HSM / PKCS#11", mitre_tag: "T1552", details: "Zone MAC keys regenerated across 12 terminals." },
        { id: "node-4", label: "Base24 Switch Engine", type: "CORE_SYSTEM", ip: "10.0.12.1", geo: "ATM Core Switch", status: "ISOLATED", protocol: "ISO 8583 Financial", mitre_tag: "T1565", details: "Offline Stand-in mode disabled." },
        { id: "node-5", label: "12 HNI Disbursal Accounts", type: "TARGET", ip: "10.0.12.200", geo: "Core CBS (Worli)", status: "FROZEN", protocol: "Finacle CBS", mitre_tag: "T1499", details: "₹ 3.40 Crore in physical cash dispense stopped." }
      ]
    },
    timeline: [
      { offset: "-06:30", time: "19:38:10 UTC", title: "Physical Network Tap Injection", tactic: "Network Injection", source_ip: "10.14.88.22", description: "Rogue hardware device installed on regional ATM cluster Ethernet backhaul.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:38:10Z", "source.ip": "10.14.88.22", "network.protocol": "iso8583", "iso8583.mti": "0200" } },
      { offset: "-03:15", time: "19:40:00 UTC", title: "ISO 8583 Response Code Manipulation", tactic: "Data Manipulation", source_ip: "10.14.88.22", description: "Intercepted response code 51 (Insufficient Funds) and altered to 00 (Approved).", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:40:00Z", "bank.account_id": "ACC-HNI-ATM-001", "bank.amount_inr": 2833333.33, "iso8583.response_code": "00" } },
      { offset: "00:00", time: "19:45:00 UTC", title: "VIGIL Alert Zero Triggered", tactic: "Autonomous Detection", source_ip: "10.14.88.22", description: "ES|QL correlation detected ₹3.40 Cr cash dispense spike with mismatched CBS ledger balances.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:45:00Z", "rule.name": "ATM Switch MITM Discrepancy", "bank.total_cash_inr": 34000000.0, "rbi.materiality": true } },
      { offset: "+00:48", time: "19:45:48 UTC", title: "NAC Port Quarantine & HSM Key Roll", tactic: "Automated Remediation", source_ip: "10.14.88.22", description: "Cisco ISE quarantined port, HSM regenerated zone keys, Base24 offline mode shut down.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:45:48Z", "containment.status": "COMPLETED", "hsm.key_rotation": "SUCCESS", "funds_saved_inr": 34000000.0 } }
    ],
    copilot_prompts: [
      { question: "Find excessive cash dispenses grouped by ATM switch IP", esql_query: "FROM logs-banking-*\n| WHERE bank.channel == \"ATM_SWITCH\"\n| STATS total_cash = sum(bank.amount_inr), count = count() BY source.ip\n| WHERE total_cash > 10000000\n| SORT total_cash desc", explanation: "Calculates total cash dispenses per switch segment exceeding ₹1 Crore." },
      { question: "List all accounts targeted in the ATM switch manipulation", esql_query: "FROM logs-banking-*\n| WHERE bank.channel == \"ATM_SWITCH\" AND source.ip == \"10.14.88.22\"\n| KEEP @timestamp, bank.account_id, bank.amount_inr, bank.customer_tier\n| SORT @timestamp asc", explanation: "Lists all victim account IDs and amounts associated with rogue tap 10.14.88.22." }
    ],
    chain_of_thought: [
      { step: "ATM Discrepancy", thought: "Detected ISO 8583 response code mismatch. ATM dispensed physical cash while CBS returned insufficient balance code 51.", tool_call: "elastic.atm_watcher", time: "T+0.4s" },
      { step: "VLAN Isolation", thought: "Identified rogue tap at subnet 10.14.88.22. Quarantining segment via 802.1X dynamic VLAN port shutdown.", tool_call: "nac.isolate_port", time: "T+1.2s" },
      { step: "HSM Key Rotation", thought: "Triggering emergency Hardware Security Module master zone key regeneration to block replay packets.", tool_call: "hsm.rotate_mac_keys", time: "T+2.1s" }
    ],
    terminal: {
      default_query: "FROM logs-banking-*\n| WHERE bank.channel == \"ATM_SWITCH\"\n| STATS total_cash = sum(bank.amount_inr), tx_count = count() BY source.ip, bank.batch_id\n| WHERE total_cash > 10000000",
      preset1_label: "⚡ Autonomous ATM Anomaly Hunt",
      preset1_query: "FROM logs-banking-*\n| WHERE bank.channel == \"ATM_SWITCH\"\n| STATS total_cash = sum(bank.amount_inr), tx_count = count() BY source.ip, bank.batch_id\n| WHERE total_cash > 10000000",
      preset2_label: "🎯 Pivoted ISO 8583 Forensics",
      preset2_query: "FROM logs-banking-*\n| WHERE bank.channel == \"ATM_SWITCH\" AND source.ip == \"10.14.88.22\"\n| KEEP @timestamp, bank.account_id, bank.amount_inr, bank.customer_tier"
    },
    indic: {
      hi: "सुरक्षा घटना सारांश: अत्यधिक नकद निकासी वेग के आधार पर एटीएम डेटा हेरफेर का स्वचालित पता चला। रु. 3,40,00,000 की निकासी नेटवर्क अलगाव द्वारा तुरंत रोक दी गई।\n\n📌 क्षेत्रीय शाखा कार्रवाई: सभी एटीएम टर्मिनलों की हार्डवेयर जांच सुनिश्चित करें।",
      mr: "सुरक्षा घटना सारांश: एटीएममधून होणाऱ्या असामान्य रोख व्यवहारांच्या आधारे छेडछाड आपोआप शोधण्यात आली. रु. 3,40,00,000 काढण्याचा प्रयत्न हाणून पाडला.\n\n📌 प्रादेशिक शाखा कृती: एटीएम मशीनचे भौतिक निरीक्षण करा.",
      ta: "பாதுகாப்பு சம்பவ சுருக்கம்: வழக்கத்திற்கு மாறான ஏடிஎம் பணப்பரிவர்த்தனை மூலம் நெட்வொர்க் முறைகேடு தானாகக் கண்டறியப்பட்டது. ரூ. 3,40,00,000 ரொக்கத் திருட்டு முயற்சி தடுக்கப்பட்டது.\n\n📌 கிளை நடவடிக்கை: ஏடிஎம்களின் வன்பொருள் பாதுகாப்பை உறுதிப்படுத்தவும்.",
      te: "భద్రతా సంఘటన సారాంశం: అసాధారణ నగదు విత్‌డ్రా ఆధారంగా ATM స్విచ్ నెట్‌వర్క్ మోసం స్వయంచాలకంగా గుర్తించబడింది. రూ. 3,40,00,000 డ్రా కుట్ర ఆపబడింది.\n\n📌 బ్రాంచ్ చర్య: ATM మెషీన్ల భద్రతను తనిఖీ చేయండి.",
      bn: "নিরাপত্তা ঘটনা সারসংক্ষেপ: এটিএম অস্বাভাবিক ক্যাশ তোলার প্যাটার্ন সনাক্তকরণের মাধ্যমে ম্যানিপুলেশন স্বয়ংক্রিয়ভাবে ধরা পড়েছে। ৩,৪০,০০,০০০ টাকা সুরক্ষিত।\n\n📌 শাখা পদক্ষেপ: সমস্ত এটিএম বুথের নিরাপত্তা নিশ্চিত করুন।"
    },
    escalation: {
      slack_channel: "#soc-tier1-physical-atm-fraud",
      pagerduty_urgency: "CRITICAL (P1) - IMMEDIATE PAGING",
      jira_summary: "[SEC-INC-03] ATM Switch ISO 8583 MITM Attack - Segment 10.14.88.22 Quarantined"
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
    current_step: 0,
    status: "TRIAGED_ALERT_ZERO",
    step1: {
      rbi_ref: "RBI/2020-21/Master-Direction-Internal-Frauds-Classification-Sec-3.4",
      certin_category: "CIAD-2022-03 Insider Privilege Abuse & Core Banking Loan Fraud",
      threshold_desc: "Direct exposure of ₹ 28,00,000 in unauthorized loan approvals exceeds ₹ 5,00,000 limit.",
      clock_status: "Mandatory 6-Hour Statutory Clock Activated."
    },
    step2: {
      autonomous_detection_title: "1. Autonomous Anomaly Detection (Zero-IP Pre-knowledge)",
      autonomous_detection_rule: "Behavioral Rule: KYC Bypass & High-Risk Loan Disbursals by Single Operator",
      autonomous_detection_query: "FROM logs-banking-*\n| WHERE bank.channel == \"CBS_LOAN_DISBURSAL\" AND bank.kyc_verified == false\n| STATS unverified_loans = count(), total_unverified_inr = sum(bank.amount_inr) BY user.name, source.ip, bank.batch_id\n| WHERE unverified_loans >= 5\n| SORT total_unverified_inr desc",
      autonomous_detection_explanation: "Elastic ES|QL scanned all core banking loan approval queues without knowing the operator username or workstation IP, automatically flagging user usr_loan_off_104 at terminal 10.2.14.105 for overriding KYC on 12 loans.",
      
      forensic_blast_radius_title: "2. Grounded Blast Radius Investigation (Pivoting on Discovered Entity)",
      forensic_blast_radius_query: "FROM logs-banking-*\n| WHERE user.name == \"usr_loan_off_104\" AND source.ip == \"10.2.14.105\"\n| KEEP @timestamp, user.name, bank.account_id, bank.amount_inr, bank.batch_id\n| LIMIT 20",
      
      discovered_entity: "10.2.14.105 / usr_loan_off_104 (Automatically Discovered via KYC_Verified == False & Volume >= 5)",
      compromised_id: "usr_loan_off_104 (Branch Loan Approval Officer)",
      matched_count: "12 off-hour KYC override & loan payout entries identified in 5.8ms.",
      sample_table: {
        columns: ["@timestamp", "user.name", "bank.account_id", "bank.beneficiary_vpa", "bank.amount_inr"],
        rows: [
          ["2026-09-02T19:50:00Z", "usr_loan_off_104", "ACC-LOAN-MULE-001", "mule.loan.1@kotak", 233333.33],
          ["2026-09-02T19:51:10Z", "usr_loan_off_104", "ACC-LOAN-MULE-002", "mule.loan.2@kotak", 233333.33],
          ["2026-09-02T19:52:20Z", "usr_loan_off_104", "ACC-LOAN-MULE-003", "mule.loan.3@kotak", 233333.33],
          ["2026-09-02T19:53:30Z", "usr_loan_off_104", "ACC-LOAN-MULE-004", "mule.loan.4@kotak", 233333.33],
          ["2026-09-02T19:54:40Z", "usr_loan_off_104", "ACC-LOAN-MULE-005", "mule.loan.5@kotak", 233333.33]
        ]
      }
    },
    step3: {
      blast_radius_summary: "Fraudulent loan disbursals routed to unverified mule accounts",
      corporate_count: 0,
      hni_count: 12,
      retail_count: 0,
      affected_accounts_total: 12,
      account_examples: "12 Unverified Mule Beneficiaries (ACC-LOAN-MULE-001 to ACC-LOAN-MULE-012)",
      penalty_saved: "₹ 50.00 Lakhs (RBI Sec 4.2)",
      business_risk_level: "HIGH",
      customer_profiles: [
        { account_id: "ACC-LOAN-MULE-001", name: "Mule Beneficiary 01 (Flagged)", tier: "HNI", balance_inr: 233333.33, exposed_inr: 233333.33, status: "FROZEN_PRESERVED", branch: "Vashi Branch, Navi Mumbai" },
        { account_id: "ACC-LOAN-MULE-002", name: "Mule Beneficiary 02 (Flagged)", tier: "HNI", balance_inr: 233333.33, exposed_inr: 233333.33, status: "FROZEN_PRESERVED", branch: "Vashi Branch, Navi Mumbai" }
      ]
    },
    step4: {
      actions: [
        {
          title: "Instantly revoke Active Directory, CBS, and Single Sign-On credentials for user usr_loan_off_104",
          system: "Active Directory & Finacle CBS",
          description: "Suspend all manager-level override authority and lock branch terminal."
        },
        {
          title: "Freeze automated NEFT/RTGS loan disbursal queue for batch LOAN-DISBURSE-QUEUE-12 in CBS",
          system: "CBS Loan Disbursal Engine",
          description: "Hold outbound loan disbursement batch in treasury clearing."
        },
        {
          title: "Place immediate debit freeze / lien on all 12 recipient mule accounts across AML network",
          system: "Anti-Money Laundering (AML) Core",
          description: "Mark beneficiary accounts as high-risk mule entities across banking switch."
        }
      ],
      containment_success_msg: "Containment executed in 39ms. Insider access revoked, loan payout batch halted in treasury, mule liens placed."
    },
    step5: {
      affected_systems: "CBS Loan Disbursal Engine (cbs-loan.bank.internal), Branch Terminal (10.2.14.105)",
      remedial_summary: "Insider credentials revoked, loan disbursal queue frozen, beneficiary accounts placed on lien."
    },
    mitre_stages: [
      { stage: "Valid Accounts", tactic: "TA0001", technique: "T1078 Valid Credentials", status: "DETECTED", desc: "Logged into CBS during unauthorized off-hours (23:45)." },
      { stage: "Privilege Abuse", tactic: "TA0004", technique: "T1548 Abuse Elevation Control", status: "CONTAINED", desc: "Overrode AML KYC biometric lock." },
      { stage: "Exfiltration", tactic: "TA0010", technique: "T1048 Exfiltration to Mule Account", status: "MITIGATED", desc: "Disbursed ₹ 28 Lakhs to unverified beneficiary accounts." }
    ],
    topology: {
      title: "Insider KYC Bypass & Auto-Loan Disbursal Path",
      description: "Branch loan officer bypassed KYC verification rules to disburse ₹ 28 Lakhs to mule accounts.",
      nodes: [
        { id: "node-1", label: "Branch Loan Terminal", type: "ATTACKER", ip: "10.2.14.105", geo: "Vashi Branch, Navi Mumbai", status: "BLOCKED", protocol: "Finacle CBS Client", mitre_tag: "T1078", details: "User usr_loan_off_104 logged in at 23:45 off-hours." },
        { id: "node-2", label: "Active Directory Domain", type: "GATEWAY", ip: "10.0.1.10", geo: "Core Identity Forest", status: "ISOLATED", protocol: "Kerberos / LDAP", mitre_tag: "T1548", details: "User account suspended & Kerberos ticket revoked." },
        { id: "node-3", label: "Finacle CBS Loan Engine", type: "CORE_SYSTEM", ip: "10.0.9.15", geo: "Core Banking Zone", status: "COMPROMISED", protocol: "CBS Core Engine", mitre_tag: "T1548", details: "KYC biometric check override flag detected." },
        { id: "node-4", label: "NEFT / RTGS Clearing Queue", type: "CORE_SYSTEM", ip: "10.0.8.60", geo: "Treasury VPC", status: "ISOLATED", protocol: "SFMS / RBI RTGS", mitre_tag: "T1048", details: "Disbursal batch LOAN-DISBURSE-QUEUE-12 placed on hold." },
        { id: "node-5", label: "12 Mule Recipient Accounts", type: "TARGET", ip: "10.0.14.20", geo: "External AML Net", status: "FROZEN", protocol: "AML Debit Lien", mitre_tag: "T1499", details: "Debit lien placed on 12 mule VPAs." }
      ]
    },
    timeline: [
      { offset: "-04:20", time: "19:48:00 UTC", title: "Off-Hour Branch Terminal Login", tactic: "Initial Access", source_ip: "10.2.14.105", description: "Loan officer logged into branch terminal at 23:45 without supervisory approval.", severity: "HIGH", raw_ecs: { "@timestamp": "2026-09-02T19:48:00Z", "user.name": "usr_loan_off_104", "source.ip": "10.2.14.105", "event.action": "user_login" } },
      { offset: "-02:10", time: "19:50:10 UTC", title: "Biometric KYC Bypass & Disbursals", tactic: "Privilege Abuse", source_ip: "10.2.14.105", description: "Approved 12 sequential auto-loans without biometric Aadhaar verification.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:50:10Z", "bank.channel": "CBS_LOAN_DISBURSAL", "bank.kyc_verified": false, "bank.amount_inr": 233333.33 } },
      { offset: "00:00", time: "19:54:40 UTC", title: "VIGIL Alert Zero Triggered", tactic: "Autonomous Detection", source_ip: "10.2.14.105", description: "Behavioral ES|QL rule flagged rapid unverified loan approvals exceeding ₹25L.", severity: "CRITICAL", raw_ecs: { "@timestamp": "2026-09-02T19:54:40Z", "rule.name": "Insider Loan Fraud Pattern", "bank.unverified_loans": 12, "rbi.materiality": true } },
      { offset: "+00:39", time: "19:55:19 UTC", title: "AD Account Suspended & Liens Placed", tactic: "Automated Remediation", source_ip: "10.2.14.105", description: "Active Directory account revoked, outbound NEFT queue halted, mule liens placed.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T19:55:19Z", "containment.status": "COMPLETED", "mule_liens_placed": 12, "funds_saved_inr": 2800000.0 } }
    ],
    copilot_prompts: [
      { question: "Detect all unverified loan disbursals grouped by operator", esql_query: "FROM logs-banking-*\n| WHERE bank.channel == \"CBS_LOAN_DISBURSAL\" AND bank.kyc_verified == false\n| STATS unverified_count = count(), total_amount = sum(bank.amount_inr) BY user.name, source.ip\n| WHERE unverified_count >= 5\n| SORT total_amount desc", explanation: "Finds bank officers approving 5 or more unverified loans without biometric validation." },
      { question: "List destination mule VPAs receiving fraudulent loan payouts", esql_query: "FROM logs-banking-*\n| WHERE user.name == \"usr_loan_off_104\"\n| KEEP @timestamp, bank.account_id, bank.beneficiary_vpa, bank.amount_inr\n| SORT @timestamp asc", explanation: "Retrieves list of beneficiary mule UPI handles linked to insider officer." }
    ],
    chain_of_thought: [
      { step: "Off-Hour Anomaly", thought: "Branch loan officer active at 23:45. 12 sequential loan approvals without biometric validation.", tool_call: "elastic.cbs_audit", time: "T+0.2s" },
      { step: "Insider Quarantine", thought: "Suspending Active Directory account for user usr_loan_off_104. Freezing batch LOAN-DISBURSE-QUEUE-12 in treasury.", tool_call: "ad.revoke_user", time: "T+1.4s" }
    ],
    terminal: {
      default_query: "FROM logs-banking-*\n| WHERE bank.channel == \"CBS_LOAN_DISBURSAL\" AND bank.kyc_verified == false\n| STATS unverified_loans = count(), total_unverified_inr = sum(bank.amount_inr) BY user.name, source.ip\n| WHERE unverified_loans >= 5",
      preset1_label: "⚡ Autonomous KYC Anomaly Hunt",
      preset1_query: "FROM logs-banking-*\n| WHERE bank.channel == \"CBS_LOAN_DISBURSAL\" AND bank.kyc_verified == false\n| STATS unverified_loans = count(), total_unverified_inr = sum(bank.amount_inr) BY user.name, source.ip\n| WHERE unverified_loans >= 5",
      preset2_label: "🎯 Pivoted Officer Forensics",
      preset2_query: "FROM logs-banking-*\n| WHERE user.name == \"usr_loan_off_104\" AND source.ip == \"10.2.14.105\"\n| KEEP @timestamp, bank.account_id, bank.amount_inr, bank.batch_id"
    },
    indic: {
      hi: "सुरक्षा घटना सारांश: बिना केवाईसी सत्यापन ऋण वितरण विश्लेषण द्वारा आंतरिक धोखाधड़ी का स्वचालित पता चला। रु. 28,00,000 का वितरण तुरंत रोक दिया गया।\n\n📌 क्षेत्रीय शाखा कार्रवाई: अधिकारी की सीबीएस पहुंच निलंबित करें।",
      mr: "सुरक्षा घटना सारांश: केवायसी पडताळणी नसलेल्या कर्ज प्रकरणांच्या विश्लेषणाद्वारे अंतर्गत गैरव्यवहार आपोआप शोधण्यात आला. रु. 28,00,000 चे वितरण रोखले.\n\n📌 प्रादेशिक शाखा कृती: अधिकाऱ्याचे सीबीएस ॲक्सेस ब्लॉक करा.",
      ta: "பாதுகாப்பு சம்பவ சுருக்கம்: கேஒய்சி சரிபார்ப்பு இல்லாத கடன் பரிவர்த்தனை பகுப்பாய்வு மூலம் உள் முறைகேடு தானாகக் கண்டறியப்பட்டது. ரூ. 28,00,000 கடன் விநியோகம் முடக்கப்பட்டது.\n\n📌 கிளை நடவடிக்கை: அதிகாரியின் கணினி அனுமதியை ரத்து செய்க.",
      te: "భద్రతా సంఘటన సారాంశం: KYC ధృవీకరణ లేని లోన్ లావాదేవీల విశ్లేషణ ద్వారా అంతర్గత మోసం స్వయంచాలకంగా పసిగట్టబడింది. రూ. 28,00,000 చెల్లింపు ఆపబడింది.\n\n📌 బ్రాంచ్ చర్య: సదరు అధికారి లాగిన్ అనుమతులను రద్దు చేయండి.",
      bn: "নিরাপত্তা ঘটনা সারসংক্ষেপ: কেওয়াইসিবিহীন লোন লেনদেন বিশ্লেষণের মাধ্যমে অভ্যন্তরীণ জালিয়াতি স্বয়ংক্রিয়ভাবে ধরা পড়েছে। ২৮,০০,০০০ টাকা সুরক্ষিত।\n\n📌 শাখা পদক্ষেপ: সংশ্লিষ্ট আধিকারিকের অ্যাক্সেস প্রত্যাহার করুন।"
    },
    escalation: {
      slack_channel: "#soc-tier1-insider-fraud",
      pagerduty_urgency: "HIGH (P2)",
      jira_summary: "[SEC-INC-04] Branch Insider Fraud - User usr_loan_off_104 Bypassed Biometric KYC"
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
    current_step: 0,
    status: "AUTO_FILTERED_FP",
    step1: {
      rbi_ref: "RBI Operational Resilience Baseline Guidelines (Standard Exemption)",
      certin_category: "N/A — Pre-Approved Scheduled Core Banking Maintenance",
      threshold_desc: "Direct exposure of ₹ 0 (Benign operational batch). Alert Zero auto-suppressed.",
      clock_status: "Suppressed: No Regulatory Filing Required (Benign False Positive)."
    },
    step2: {
      autonomous_detection_title: "1. Autonomous Anomaly Detection & Schedule Correlation",
      autonomous_detection_rule: "Behavioral Rule: Volume Spike Correlation with Maintenance Calendar",
      autonomous_detection_query: "FROM logs-banking-*\n| WHERE bank.batch_id LIKE \"MONTHLY-*\" OR bank.batch_id LIKE \"MAINTENANCE-*\"\n| STATS routine_volume = count(), avg_aml_risk = avg(bank.aml_risk_score) BY bank.batch_id\n| WHERE avg_aml_risk < 5.0",
      autonomous_detection_explanation: "Elastic ES|QL correlated the sudden 50,000 transaction burst with the pre-approved month-end batch schedule, mathematically verifying an average AML risk score of only 1.0 (Benign Baseline).",
      
      forensic_blast_radius_title: "2. Maintenance Schedule Confirmation (Core Engine Audit)",
      forensic_blast_radius_query: "FROM logs-auth-*\n| WHERE user.name == \"system_batch_scheduler\"\n| KEEP @timestamp, event.outcome, source.ip\n| LIMIT 10",
      
      discovered_entity: "10.0.1.1 / system_batch_scheduler (Validated Core Batch Engine Daemon)",
      compromised_id: "system_batch_scheduler (Automated Cron Daemon - Benign)",
      matched_count: "20 batch transaction sample records correlated in 3.2ms.",
      sample_table: {
        columns: ["@timestamp", "user.name", "bank.account_id", "bank.channel", "bank.amount_inr"],
        rows: [
          ["2026-09-02T20:00:00Z", "system_batch_scheduler", "ACC-SAVINGS-00001", "CORE_BANKING_ENGINE", 4500.00],
          ["2026-09-02T20:00:01Z", "system_batch_scheduler", "ACC-SAVINGS-00002", "CORE_BANKING_ENGINE", 4500.00],
          ["2026-09-02T20:00:02Z", "system_batch_scheduler", "ACC-SAVINGS-00003", "CORE_BANKING_ENGINE", 4500.00],
          ["2026-09-02T20:00:03Z", "system_batch_scheduler", "ACC-SAVINGS-00004", "CORE_BANKING_ENGINE", 4500.00],
          ["2026-09-02T20:00:04Z", "system_batch_scheduler", "ACC-SAVINGS-00005", "CORE_BANKING_ENGINE", 4500.00]
        ]
      }
    },
    step3: {
      blast_radius_summary: "Routine interest calculation automatically executed across customer savings accounts",
      corporate_count: 5000,
      hni_count: 15000,
      retail_count: 30000,
      affected_accounts_total: 50000,
      account_examples: "50,000 Standard Savings & Fixed Deposit Customer Accounts",
      penalty_saved: "₹ 0 (False Alarm Avoided — 4.5 Analyst Hours Saved)",
      business_risk_level: "BENIGN_FP",
      customer_profiles: [
        { account_id: "ACC-SAVINGS-00001", name: "Standard Retail Savings Group", tier: "Retail", balance_inr: 85000.00, exposed_inr: 0.00, status: "NORMAL", branch: "All Pan-India Branches" }
      ]
    },
    step4: {
      actions: [
        {
          title: "Correlate high-volume transaction stream with pre-approved month-end interest calculation schedule",
          system: "CBS Batch Scheduler",
          description: "Validated execution against official bank maintenance calendar."
        },
        {
          title: "Auto-suppress anomalous volume alert as Benign False Positive in VIGIL Rule Engine",
          system: "Elastic Security Detection Engine",
          description: "Prevent alert fatigue by auto-closing benign maintenance tickets."
        }
      ],
      containment_success_msg: "No disruptive containment required. Verified against CBS calendar. False alarm suppressed automatically."
    },
    step5: {
      affected_systems: "Core Banking Engine (cbs-core.bank.internal), Batch Server (10.0.1.100)",
      remedial_summary: "Maintenance verified, false positive suppressed, zero disruption to banking operations."
    },
    mitre_stages: [
      { stage: "Scheduled Maintenance", tactic: "TA0000", technique: "T0000 Baseline Task", status: "BASELINE", desc: "Pre-approved Core Banking cron executed at 02:00 AM." }
    ],
    topology: {
      title: "Routine CBS Scheduled Maintenance Flow",
      description: "Automated cron daemon executed approved month-end interest crediting across retail accounts.",
      nodes: [
        { id: "node-1", label: "Core Batch Scheduler", type: "BENIGN_DAEMON", ip: "10.0.1.100", geo: "Primary DC (Mumbai)", status: "BENIGN", protocol: "Internal Cron", mitre_tag: "N/A", details: "Pre-approved job MONTHLY-INTEREST-CALC-2026." },
        { id: "node-2", label: "Finacle CBS Engine", type: "CORE_SYSTEM", ip: "10.0.1.1", geo: "Core Banking Zone", status: "BENIGN", protocol: "Batch SQL / CBS", mitre_tag: "N/A", details: "50,000 accounts credited with routine quarterly interest." },
        { id: "node-3", label: "Elastic Detection Rule", type: "GATEWAY", ip: "10.0.4.5", geo: "VIGIL Engine", status: "BENIGN", protocol: "ES|QL Calendar Check", mitre_tag: "N/A", details: "Volume burst matched approved calendar. Alert suppressed." },
        { id: "node-4", label: "Retail Customer Accounts", type: "TARGET", ip: "10.0.12.1", geo: "All Branches", status: "ACTIVE", protocol: "CBS Ledger", mitre_tag: "N/A", details: "50,000 accounts operating normally." }
      ]
    },
    timeline: [
      { offset: "00:00", time: "20:00:00 UTC", title: "Month-End Batch Triggered", tactic: "Scheduled Cron", source_ip: "10.0.1.100", description: "Automated interest calculation script initiated across 50,000 accounts.", severity: "INFO", raw_ecs: { "@timestamp": "2026-09-02T20:00:00Z", "bank.batch_id": "MONTHLY-INTEREST-CALC-2026", "user.name": "system_batch_scheduler", "bank.volume": 50000 } },
      { offset: "+00:01", time: "20:00:01 UTC", title: "Autonomous Schedule Correlation", tactic: "Alert Zero Suppression", source_ip: "10.0.1.100", description: "VIGIL correlated transaction burst with official change calendar; AML risk score average is 1.0.", severity: "LOW", raw_ecs: { "@timestamp": "2026-09-02T20:00:01Z", "rule.suppression": "BENIGN_FALSE_POSITIVE", "avg_aml_risk": 1.0, "analyst_hours_saved": 4.5 } }
    ],
    copilot_prompts: [
      { question: "Verify that interest calculation batch matches approved calendar", esql_query: "FROM logs-banking-*\n| WHERE bank.batch_id LIKE \"MONTHLY-*\"\n| STATS total_volume = count(), avg_aml_risk = avg(bank.aml_risk_score) BY bank.batch_id", explanation: "Correlates high-volume batch transactions with approved maintenance prefixes and verifies low AML risk." }
    ],
    chain_of_thought: [
      { step: "Volume Spike Check", thought: "50,000 TPS burst detected on interest credit queue. Querying core maintenance schedule calendar...", tool_call: "elastic.calendar_correlate", time: "T+0.1s" },
      { step: "False Alarm Suppressed", thought: "Batch ID matches MONTHLY-INTEREST-CALC-2026. AML risk = 1.0 (benign). Ticket auto-closed.", tool_call: "alert.auto_suppress", time: "T+0.4s" }
    ],
    terminal: {
      default_query: "FROM logs-banking-*\n| WHERE bank.batch_id LIKE \"MONTHLY-*\"\n| STATS routine_volume = count(), avg_aml_risk = avg(bank.aml_risk_score) BY bank.batch_id",
      preset1_label: "⚡ Autonomous Maintenance Check",
      preset1_query: "FROM logs-banking-*\n| WHERE bank.batch_id LIKE \"MONTHLY-*\"\n| STATS routine_volume = count(), avg_aml_risk = avg(bank.aml_risk_score) BY bank.batch_id",
      preset2_label: "🎯 Scheduler Audit",
      preset2_query: "FROM logs-auth-*\n| WHERE user.name == \"system_batch_scheduler\"\n| KEEP @timestamp, source.ip, event.outcome"
    },
    indic: {
      hi: "सिस्टम सूचना: माह के अंत में कोर बैंकिंग ब्याज गणना सफलतापूर्वक पूरी हुई। असामान्य मात्रा को पूर्व-अनुमोदित रखरखाव के रूप में सत्यापित किया गया।\n\n📌 शाखा कार्रवाई: किसी सुरक्षा कार्रवाई की आवश्यकता नहीं है।",
      mr: "सिस्टम सूचना: नियमित व्याज जमा प्रक्रिया यशस्वीरीत्या पूर्ण झाली. हा एक नियमित देखभाल प्रक्रियेचा भाग आहे.\n\n📌 प्रादेशिक शाखा कृती: कोणत्याही सुरक्षेच्या कारवाईची आवश्यकता नाही.",
      ta: "அமைப்பு தகவல்: மாத இறுதி வட்டி கணக்கீட்டு செயல்முறை வெற்றிகரமாக முடிந்தது. இது ஒரு சாதாரண வங்கி பராமரிப்பு செயல்முறை.\n\n📌 கிளை நடவடிக்கை: எந்த பாதுகாப்பு நடவடிக்கையும் தேவையில்லை.",
      te: "సిస్టమ్ సమాచారం: నెలవారీ వడ్డీ గణన ప్రక్రియ విజయవంతంగా పూర్తయింది. ఇది సాధారణ బ్యాంకింగ్ నిర్వహణ ప్రక్రియ.\n\n📌 బ్రాంచ్ చర్య: ఎలాంటి భద్రతా చర్యలు అవసరం లేదు.",
      bn: "নিরাপত্তা ঘটনা সারসংক্ষেপ: মাস-শেষের নিয়মিত সুদ জমা প্রক্রিয়া সফলভাবে সম্পন্ন হয়েছে। এটি একটি স্বাভাবিক ব্যাঙ্কিং প্রক্রিয়া।\n\n📌 শাখা পদক্ষেপ: কোনও নিরাপত্তা পদক্ষেপের প্রয়োজন নেই।"
    },
    escalation: {
      slack_channel: "#soc-tier1-maintenance-logs",
      pagerduty_urgency: "LOW (INFORMATIONAL)",
      jira_summary: "[AUTO-CLOSED] Month-End Routine Interest Batch Verified"
    }
  }
];

export default function App() {
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

  // Active Scenario Configuration
  const currentScenario = SCENARIOS_DATA.find(s => s.incident_id === selectedIncId) || SCENARIOS_DATA[0];

  // Filtered Scenarios list based on search and severity
  const filteredScenarios = SCENARIOS_DATA.filter(s => {
    const matchSev = severityFilter === "ALL" || s.severity === severityFilter;
    const matchSearch = s.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
                        s.incident_id.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        s.threat_tactic.toLowerCase().includes(searchFilter.toLowerCase());
    return matchSev && matchSearch;
  });

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
  const handleScenarioChange = (incId: string) => {
    setSelectedIncId(incId);
    setActiveStep(1);
    const newSc = SCENARIOS_DATA.find(s => s.incident_id === incId) || SCENARIOS_DATA[0];
    setContainmentApproved(newSc.incident_id === "INC-2026-0902-05");
    setEsqlQuery(newSc.terminal.default_query);
    setEsqlResult(null);
    setSelectedTopologyNode(null);
    setTranslatedText(newSc.indic[selectedLang] || newSc.indic["hi"]);
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

  const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || "";

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
      // High-fidelity scenario-specific local representation
      setEsqlResult({
        columns: currentScenario.step2.sample_table.columns.map(c => ({ name: c, type: "keyword" })),
        values: currentScenario.step2.sample_table.rows,
        took: 7
      });
    } finally {
      setIsQuerying(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reports/certin/${selectedIncId}/pdf`);
      if (res.ok) {
        const blob = await res.blob();
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
    } catch (e) {
      console.warn("API PDF download fallback triggered:", e);
    }

    // Direct Client-Side Form Download fallback
    const reportText = `INDIAN COMPUTER EMERGENCY RESPONSE TEAM (CERT-In)
INCIDENT REPORTING FORM - ANNEXURE 1
================================================================================
1. Name of Organisation: Apex Commercial Bank of India Ltd (BFSI)
2. Reporting Date & Time: ${new Date().toUTCString()} (Within 6-Hour Window)
3. CERT-In Incident Ref: ${selectedIncId}
4. Nature of Incident: ${currentScenario.threat_tactic} (${currentScenario.title})
5. Primary Source IP / Segment: ${currentScenario.step2.discovered_entity}
6. Direct Financial Risk: Rs. ${currentScenario.direct_exposure_inr.toLocaleString("en-IN")}.00
7. Customer Accounts Affected: ${currentScenario.step3.affected_accounts_total} Accounts (${currentScenario.step3.corporate_count} Corporate, ${currentScenario.step3.hni_count} HNI)
8. Remedial & Containment Actions Taken:
   - ${currentScenario.step4.actions[0]?.title || "Contained"}
   - ${currentScenario.step4.actions[1]?.title || "Secured"}
   - ${currentScenario.step4.actions[2]?.title || "Sealed"}
9. Evidence Ledger: Sealed under SHA-256 Hash Chain (AWS S3 WORM Object Lock)
================================================================================
Generated automatically by VIGIL AI Tier-1 SOC Analyst`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CERT_IN_REPORT_${selectedIncId}.txt`;
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
      <header className={`border-b px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md transition-colors ${
        isDark ? "bg-[#0F172A]/90 border-slate-800" : "bg-white/90 border-slate-200 shadow-sm"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
            isDark 
              ? "bg-sky-500/10 border border-sky-500/30 text-sky-400 shadow-lg shadow-sky-500/10" 
              : "bg-sky-50 border border-sky-200 text-sky-600 shadow-sm"
          }`}>
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-lg font-extrabold tracking-tight flex items-center gap-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                VIGIL 
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  isDark ? "bg-sky-500/20 text-sky-400 border-sky-500/30" : "bg-sky-100 text-sky-700 border-sky-200"
                }`}>
                  AI SOC Level-1
                </span>
              </h1>
              <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                • Apex Commercial Bank (India)
              </span>
            </div>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Autonomous Cyber Incident Grounding & Statutory Compliance Engine
            </p>
          </div>
        </div>

        {/* Central 6-Hour Regulatory Clock */}
        <div className={`flex items-center gap-4 rounded-xl px-4 py-2 border transition-colors ${
          isDark ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200 shadow-inner"
        }`}>
          <div className="flex items-center gap-2.5">
            <Clock className={`h-4 w-4 animate-pulse ${isDark ? "text-amber-400" : "text-amber-600"}`} />
            <div className="text-left">
              <div className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                CERT-In 6-Hour Clock
              </div>
              <div className={`text-sm font-mono font-bold ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                {currentScenario.is_material ? formatCountdown(secondsRemaining) : "PAUSED (BENIGN FP)"}
              </div>
            </div>
          </div>
          <div className={`h-6 w-px ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                currentScenario.is_material ? "bg-emerald-400" : "bg-slate-400"
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                currentScenario.is_material ? "bg-emerald-500" : "bg-slate-500"
              }`}></span>
            </span>
            <span className={`text-xs font-semibold ${
              currentScenario.is_material 
                ? (isDark ? "text-emerald-400" : "text-emerald-700") 
                : (isDark ? "text-slate-400" : "text-slate-600")
            }`}>
              {currentScenario.is_material ? "Alert Zero Triage Active" : "Benign Maintenance"}
            </span>
          </div>
        </div>

        {/* Right Action Cluster: Escalate, Elastic Cloud Live Badge, Theme Toggle, PDF Export */}
        <div className="flex items-center gap-2.5">
          
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
          }`}>
            <Database className="h-3.5 w-3.5 text-sky-500" />
            <span>Elastic Cloud</span>
            <span className="text-[10px] opacity-75 font-mono">(ap-south-1)</span>
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
            className="flex items-center gap-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 rounded-lg shadow-md hover:shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span> PDF
          </button>
        </div>
      </header>

      {/* 2. MAIN COCKPIT BODY */}
      <div className="flex-1 grid grid-cols-12 gap-5 p-5 max-w-[1720px] w-full mx-auto">
        
        {/* LEFT COLUMN: Attack Discovery Triage Stream (Col 1-4) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          
          {/* Triage Feed Header Card with Search & Filters */}
          <div className={`border rounded-2xl p-4 shadow-sm transition-colors ${
            isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}>
                <Activity className="h-4 w-4 text-sky-500 animate-pulse" />
                Attack Discovery Triage Stream
              </h2>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                isDark ? "bg-slate-800 text-sky-400 border border-slate-700" : "bg-sky-50 text-sky-700 border border-sky-200"
              }`}>
                {filteredScenarios.length} Scenarios
              </span>
            </div>

            {/* Quick Filter Bar */}
            <div className="space-y-2 mb-3">
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search attacks by keyword, IP, tactic..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors ${
                    isDark ? "bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                  }`}
                />
              </div>

              <div className="flex items-center gap-1.5">
                {["ALL", "CRITICAL", "HIGH", "LOW"].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                      severityFilter === sev
                        ? "bg-sky-500 text-white border-sky-500"
                        : (isDark ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200")
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Scenarios List */}
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {filteredScenarios.map((sc) => {
                const isSelected = selectedIncId === sc.incident_id;
                return (
                  <div
                    key={sc.incident_id}
                    onClick={() => handleScenarioChange(sc.incident_id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected 
                        ? (isDark 
                            ? "bg-sky-950/40 border-sky-500/60 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/30" 
                            : "bg-sky-50/80 border-sky-400 shadow-md ring-1 ring-sky-300")
                        : (isDark 
                            ? "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900" 
                            : "bg-slate-50 border-slate-200/80 hover:border-slate-300 hover:bg-white")
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono font-bold text-sky-500">{sc.incident_id}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        sc.severity === "CRITICAL" ? (isDark ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-red-100 text-red-700 border border-red-200") :
                        sc.severity === "HIGH" ? (isDark ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-amber-100 text-amber-700 border border-amber-200") :
                        (isDark ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-emerald-100 text-emerald-700 border border-emerald-200")
                      }`}>
                        {sc.severity}
                      </span>
                    </div>
                    <div className={`text-xs font-bold line-clamp-1 mb-1 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                      {sc.title}
                    </div>
                    <div className={`flex items-center justify-between text-[11px] font-mono ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}>
                      <span>{sc.is_material ? "⚠️ Mandatory 6-Hr" : "🟢 Baseline FP"}</span>
                      <span className="font-bold text-emerald-500">₹ {sc.direct_exposure_inr.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ₹ Business Exposure Card */}
          <div className={`border rounded-2xl p-4 shadow-sm text-left transition-colors ${
            isDark 
              ? "bg-gradient-to-br from-[#0F172A] to-slate-900 border-slate-800" 
              : "bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-sm"
          }`}>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                ₹ Business Risk Exposure
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${
                isDark ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-100 text-emerald-700 border-emerald-200"
              }`}>
                bank.exposure.lookup
              </span>
            </div>

            <div className={`text-2xl font-black font-mono tracking-tight mb-1 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              ₹ {currentScenario.direct_exposure_inr.toLocaleString("en-IN")}.00
            </div>
            <p className={`text-xs mb-3.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {currentScenario.step3.blast_radius_summary}
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className={`p-2.5 rounded-xl border ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className={`text-[10px] uppercase font-bold flex items-center gap-1 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  <Users className="h-3 w-3" /> Blast Radius
                </div>
                <div className={`text-xs font-bold mt-1 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                  {currentScenario.step3.affected_accounts_total} Accounts
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  ({currentScenario.step3.corporate_count} Corp, {currentScenario.step3.hni_count} HNI)
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className={`text-[10px] uppercase font-bold flex items-center gap-1 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  <ShieldAlert className="h-3 w-3 text-emerald-500" /> Penalty Saved
                </div>
                <div className="text-xs font-bold text-emerald-500 mt-1">
                  {currentScenario.step3.penalty_saved}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  RBI Sec 4.2 Protected
                </div>
              </div>
            </div>
          </div>

          {/* AI Chain of Thought (CoT) Live Drawer Toggle */}
          <div className={`border rounded-2xl p-3.5 text-left transition-colors ${
            isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <button
              onClick={() => setShowCoTDrawer(!showCoTDrawer)}
              className="w-full flex items-center justify-between text-xs font-bold cursor-pointer"
            >
              <div className="flex items-center gap-2 text-sky-500">
                <Cpu className="h-4 w-4" />
                <span>VIGIL AI Autonomous Reasoning (CoT)</span>
              </div>
              {showCoTDrawer ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showCoTDrawer && (
              <div className="mt-3 space-y-2 max-h-[170px] overflow-y-auto pr-1">
                {currentScenario.chain_of_thought.map((cot, idx) => (
                  <div key={idx} className={`p-2 rounded-lg border text-[11px] font-mono ${
                    isDark ? "bg-slate-950 border-slate-800/80 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}>
                    <div className="flex items-center justify-between text-[10px] mb-1 font-bold">
                      <span className="text-amber-500">[{cot.time}] {cot.step}</span>
                      <span className="text-sky-500">{cot.tool_call}</span>
                    </div>
                    <p className="text-[10px] opacity-90">{cot.thought}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT / MAIN SECTION: 6-Step Agentic Workflow & Consoles (Col 5-12) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          
          {/* Navigation Tabs Header */}
          <div className={`flex items-center justify-between border rounded-2xl p-1.5 transition-colors ${
            isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div className="flex items-center gap-1 flex-wrap">
              {[
                { id: "workflow", label: "6-Step Pipeline", icon: Play },
                { id: "topology", label: "Attack Topology", icon: Workflow },
                { id: "timeline", label: "Forensic Timeline", icon: Clock },
                { id: "mitre", label: "MITRE ATT&CK", icon: Network },
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                        : (isDark 
                            ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60" 
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100")
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
                className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRunning ? "animate-spin" : ""}`} />
                <span>{isRunning ? "Running Pipeline..." : "Auto-Run All Steps"}</span>
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

                {/* STEP 2: ES|QL EVIDENCE (AUTONOMOUS + TARGETED) */}
                {activeStep === 2 && (
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div className="font-bold text-sm text-sky-500 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        Step 2: Autonomous Detection & Grounded Forensic Retrieval (ES|QL)
                      </div>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                        isDark ? "bg-sky-500/20 text-sky-400" : "bg-sky-100 text-sky-700"
                      }`}>
                        Two-Stage Pipeline
                      </span>
                    </div>
                    
                    <div className="mt-4 space-y-4 text-xs">
                      
                      {/* STAGE A: AUTONOMOUS DETECTION */}
                      <div className={`p-3.5 rounded-xl border ${
                        isDark ? "bg-slate-900/90 border-amber-500/30" : "bg-amber-50/60 border-amber-200"
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-amber-500 flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-amber-500" />
                            {currentScenario.step2.autonomous_detection_title}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                            isDark ? "bg-amber-950 text-amber-300 border border-amber-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {currentScenario.step2.autonomous_detection_rule}
                          </span>
                        </div>
                        <div className={`p-2.5 rounded-lg font-mono text-[11px] border whitespace-pre-line mb-2 ${
                          isDark ? "bg-slate-950 text-amber-300 border-slate-800" : "bg-white text-amber-800 border-amber-100 shadow-inner"
                        }`}>
                          {currentScenario.step2.autonomous_detection_query}
                        </div>
                        <p className={`text-[11px] italic ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          💡 <strong>How it detects automatically:</strong> {currentScenario.step2.autonomous_detection_explanation}
                        </p>
                      </div>

                      {/* STAGE B: GROUNDED BLAST RADIUS INVESTIGATION */}
                      <div className={`p-3.5 rounded-xl border ${
                        isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                      }`}>
                        <div className={`font-bold mb-2 flex items-center gap-1.5 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                          <Filter className="h-3.5 w-3.5 text-emerald-500" />
                          {currentScenario.step2.forensic_blast_radius_title}
                        </div>
                        <div className={`p-2.5 rounded-lg font-mono text-[11px] border whitespace-pre-line mb-2.5 ${
                          isDark ? "bg-slate-950 text-sky-300 border-slate-800" : "bg-slate-50 text-sky-800 border-slate-200"
                        }`}>
                          {currentScenario.step2.forensic_blast_radius_query}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>• <strong>Discovered Entity:</strong> <span className="text-amber-500 font-mono font-semibold">{currentScenario.step2.discovered_entity}</span></div>
                          <div>• <strong>Compromised Key / User:</strong> <span className="text-sky-500 font-mono font-semibold">{currentScenario.step2.compromised_id}</span></div>
                        </div>
                        <div className={`mt-1.5 text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          • <strong>Records Matched:</strong> {currentScenario.step2.matched_count}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* STEP 3: FINANCIAL EXPOSURE */}
                {activeStep === 3 && (
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div className="font-bold text-sm text-sky-500 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Step 3: ₹ Financial Exposure Scoring (bank.exposure.lookup)
                      </div>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                        isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        Tool: bank.exposure.lookup
                      </span>
                    </div>
                    <div className={`mt-4 space-y-2.5 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      <p>• <strong>Direct Rupee Exposure</strong>: <span className="text-emerald-500 font-black font-mono text-sm">₹ {currentScenario.direct_exposure_inr.toLocaleString("en-IN")}.00</span></p>
                      <p>• <strong>Corporate Accounts Impacted</strong>: {currentScenario.step3.corporate_count} Accounts</p>
                      <p>• <strong>HNI & Private Wealth Accounts</strong>: {currentScenario.step3.hni_count} Accounts</p>
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
                          <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            Requires SOC Tier-1 Analyst Digital Signature
                          </span>
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
                    <Workflow className="h-4 w-4" />
                    {currentScenario.topology.title}
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {currentScenario.topology.description}
                  </p>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                  isDark ? "bg-sky-500/20 text-sky-400 border-sky-500/30" : "bg-sky-50 text-sky-700 border-sky-200"
                }`}>
                  Interactive Node Map
                </span>
              </div>

              {/* Topology Path Grid Flow */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-2">
                {currentScenario.topology.nodes.map((node, i) => {
                  const isSelected = selectedTopologyNode?.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedTopologyNode(node)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                        isSelected
                          ? (isDark ? "bg-sky-950/80 border-sky-400 ring-2 ring-sky-500/40" : "bg-sky-50 border-sky-500 ring-2 ring-sky-300")
                          : (isDark ? "bg-slate-950 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:border-slate-300")
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-500">HOP #{i + 1}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            node.status === "COMPROMISED" ? "bg-red-500/20 text-red-400" :
                            node.status === "BLOCKED" ? "bg-red-500/20 text-red-400" :
                            node.status === "ISOLATED" ? "bg-amber-500/20 text-amber-400" :
                            node.status === "FROZEN" ? "bg-emerald-500/20 text-emerald-400" :
                            "bg-slate-500/20 text-slate-400"
                          }`}>
                            {node.status}
                          </span>
                        </div>
                        <div className={`text-xs font-bold mb-1 ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                          {node.label}
                        </div>
                        <div className="text-[11px] font-mono text-sky-500 font-semibold mb-1">
                          {node.ip}
                        </div>
                        <div className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {node.geo}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{node.protocol}</span>
                        <span className="text-amber-500">{node.mitre_tag}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Node Deep Drill-Down Card */}
              {selectedTopologyNode ? (
                <div className={`p-4 rounded-xl border mt-2 text-left transition-colors ${
                  isDark ? "bg-slate-950/80 border-sky-500/40" : "bg-sky-50/60 border-sky-200"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-sky-500" />
                      <span className="font-bold text-xs">{selectedTopologyNode.label} (Forensic Node Inspection)</span>
                    </div>
                    <button 
                      onClick={() => setSelectedTopologyNode(null)}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div><span className="text-slate-400">IP / Host:</span> <strong className="font-mono text-sky-500">{selectedTopologyNode.ip}</strong></div>
                    <div><span className="text-slate-400">Location:</span> <strong>{selectedTopologyNode.geo}</strong></div>
                    <div><span className="text-slate-400">Protocol:</span> <strong className="font-mono">{selectedTopologyNode.protocol}</strong></div>
                    <div><span className="text-slate-400">MITRE Technique:</span> <strong className="text-amber-500">{selectedTopologyNode.mitre_tag}</strong></div>
                  </div>
                  <p className={`mt-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-800 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    <strong>Diagnostic Status:</strong> {selectedTopologyNode.details}
                  </p>
                </div>
              ) : (
                <div className={`text-center py-3 text-xs italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  Click any topology hop above to inspect forensic connection telemetry & packet diagnostics.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FORENSIC EVENT TIMELINE & LOG PLAYER */}
          {activeTab === "timeline" && (
            <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
              isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-sky-500">
                  <Clock className="h-4 w-4" />
                  Chronological Forensic Event Sequence
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                  isDark ? "bg-slate-800 text-sky-400" : "bg-sky-100 text-sky-700"
                }`}>
                  {currentScenario.timeline.length} Milestones
                </span>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 mt-1">
                {currentScenario.timeline.map((evt, i) => (
                  <div key={i} className={`p-3.5 rounded-xl border transition-colors flex items-start justify-between gap-4 ${
                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200 shadow-sm"
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${
                          evt.severity === "CRITICAL" ? "bg-red-500/20 text-red-500" :
                          evt.severity === "HIGH" ? "bg-amber-500/20 text-amber-500" :
                          "bg-sky-500/20 text-sky-500"
                        }`}>
                          {evt.offset}
                        </span>
                        <div className="w-0.5 h-full bg-slate-800 mt-1 min-h-[20px]" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold">{evt.title}</span>
                          <span className="text-[10px] font-mono text-amber-500 px-1.5 py-0.5 rounded bg-amber-500/10">
                            {evt.tactic}
                          </span>
                        </div>
                        <p className={`text-xs mb-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                          {evt.description}
                        </p>
                        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-3">
                          <span>Time: {evt.time}</span>
                          <span>Source IP: <strong className="text-sky-500">{evt.source_ip}</strong></span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setRawEcsModalData(evt.raw_ecs)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 flex-shrink-0 cursor-pointer transition-all ${
                        isDark 
                          ? "bg-slate-900 border-slate-700 text-sky-400 hover:bg-slate-800" 
                          : "bg-white border-slate-300 text-sky-700 hover:bg-slate-100"
                      }`}
                      title="Inspect Raw Elastic Common Schema JSON document"
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      <span>ECS JSON</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MITRE ATT&CK KILL CHAIN MATRIX */}
          {activeTab === "mitre" && (
            <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
              isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-sky-500">
                  <Network className="h-4 w-4" />
                  MITRE ATT&CK Framework Kill-Chain Progression
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                  isDark ? "bg-sky-500/20 text-sky-400" : "bg-sky-100 text-sky-700"
                }`}>
                  Tactic: {currentScenario.threat_tactic}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {currentScenario.mitre_stages.map((stg, i) => (
                  <div key={i} className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-sky-500">{stg.stage}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          stg.status === "DETECTED" ? "bg-red-500/20 text-red-500 border border-red-500/30" :
                          stg.status === "CONTAINED" ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" :
                          stg.status === "MITIGATED" ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30" :
                          "bg-slate-500/20 text-slate-400"
                        }`}>
                          {stg.status}
                        </span>
                      </div>
                      <div className={`text-xs font-bold mb-1 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                        {stg.technique}
                      </div>
                      <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {stg.desc}
                      </p>
                    </div>
                    <div className="mt-3 text-[10px] font-mono text-slate-500">
                      MITRE Tactic ID: {stg.tactic}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMER BLAST RADIUS DIRECTORY */}
          {activeTab === "customers" && (
            <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
              isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-sky-500">
                  <Users className="h-4 w-4" />
                  Impacted Customer Accounts Directory (Core Banking CRM Lookup)
                </div>
                <span className="text-xs font-mono font-bold text-emerald-500">
                  100% Funds Preserved / Frozen
                </span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {currentScenario.step3.customer_profiles.map((cust, i) => (
                  <div key={i} className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-sky-500 font-mono">{cust.account_id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cust.tier === "Corporate" ? "bg-purple-500/20 text-purple-500 border border-purple-500/30" :
                          cust.tier === "HNI" ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" :
                          "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                        }`}>
                          {cust.tier}
                        </span>
                        <span className="text-xs font-bold">{cust.name}</span>
                      </div>
                      <div className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Branch: {cust.branch} • Total Balance: ₹ {cust.balance_inr.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-red-500 font-mono">
                        Targeted: ₹ {cust.exposed_inr.toLocaleString("en-IN")}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 font-mono inline-block mt-1">
                        {cust.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: LIVE TELEMETRY FEED STREAM */}
          {activeTab === "telemetry" && (
            <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
              isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-sky-500">
                  <Radio className={`h-4 w-4 text-emerald-500 ${isTelemetryStreaming ? "animate-pulse" : ""}`} />
                  Live ECS Real-Time Telemetry Stream Inspector
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTelemetryStreaming(!isTelemetryStreaming)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isTelemetryStreaming ? "bg-slate-800 text-slate-300" : "bg-emerald-600 text-white"
                    }`}
                  >
                    {isTelemetryStreaming ? "Pause Ticker" : "Resume Ticker"}
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    465 Events Ingested
                  </span>
                </div>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto">
                {liveLogs.map((log) => (
                  <div key={log.id} className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-bold">{log.id}</span>
                      <span className="text-sky-500 font-bold">[{log.channel}]</span>
                      <span className={isDark ? "text-slate-300" : "text-slate-800"}>IP: {log.ip}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-500 font-bold">₹ {log.amt.toLocaleString("en-IN")}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.status === "BLOCKED" || log.status === "WAF_DROP" || log.status === "QUARANTINED"
                          ? "bg-red-500/20 text-red-500 border border-red-500/30"
                          : "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                      }`}>
                        {log.status}
                      </span>
                      <span className="text-[10px] text-slate-500">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: INTERACTIVE ES|QL TERMINAL & AI COPILOT */}
          {activeTab === "esql" && (
            <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
              isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-sky-500">
                  <Terminal className="h-4 w-4" />
                  Interactive ES|QL Query Terminal & Natural Language Copilot
                </div>
                <button
                  onClick={handleRunEsql}
                  disabled={isQuerying}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow cursor-pointer"
                >
                  <Play className="h-3 w-3" />
                  <span>{isQuerying ? "Executing..." : "Run ES|QL Query"}</span>
                </button>
              </div>

              {/* Natural Language to ES|QL Copilot Assistant */}
              <div className={`p-3.5 rounded-xl border ${
                isDark ? "bg-slate-950 border-sky-500/30" : "bg-sky-50/50 border-sky-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold text-amber-500">Natural Language AI Query Copilot</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {currentScenario.copilot_prompts.map((cp, idx) => (
                    <button
                      key={idx}
                      onClick={() => setEsqlQuery(cp.esql_query)}
                      className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-semibold text-left transition-all cursor-pointer ${
                        isDark ? "bg-slate-900 border-slate-700 text-sky-300 hover:bg-slate-800" : "bg-white border-sky-200 text-sky-800 hover:bg-sky-100"
                      }`}
                    >
                      💬 "{cp.question}"
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={esqlQuery}
                onChange={(e) => setEsqlQuery(e.target.value)}
                rows={5}
                className={`w-full border rounded-xl p-3.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                  isDark 
                    ? "bg-slate-950 border-slate-800 text-sky-300" 
                    : "bg-slate-50 border-slate-200 text-slate-800 shadow-inner"
                }`}
              />

              {/* Scenario-Specific Pre-set Queries Quick-Pills */}
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Presets:
                </span>
                <button 
                  onClick={() => setEsqlQuery(currentScenario.terminal.preset1_query)}
                  className={`text-[10px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-bold ${
                    isDark 
                      ? "bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700" 
                      : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
                  }`}
                >
                  {currentScenario.terminal.preset1_label}
                </button>
                <button 
                  onClick={() => setEsqlQuery(currentScenario.terminal.preset2_query)}
                  className={`text-[10px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-bold ${
                    isDark 
                      ? "bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700" 
                      : "bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200"
                  }`}
                >
                  {currentScenario.terminal.preset2_label}
                </button>
              </div>

              {/* Query Output Table */}
              {esqlResult && (
                <div className={`border rounded-xl overflow-hidden mt-1 transition-colors ${
                  isDark ? "border-slate-800" : "border-slate-200 shadow-sm"
                }`}>
                  <div className={`px-3.5 py-2 text-[11px] font-mono flex items-center justify-between ${
                    isDark ? "bg-slate-900 text-slate-400" : "bg-slate-100 text-slate-600"
                  }`}>
                    <span>Results ({esqlResult.values?.length || 0} rows)</span>
                    <span>Execution Time: {esqlResult.took || 7}ms</span>
                  </div>
                  <div className="overflow-x-auto max-h-[220px]">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className={`border-b ${
                        isDark ? "bg-slate-950 text-slate-300 border-slate-800" : "bg-white text-slate-700 border-slate-200"
                      }`}>
                        <tr>
                          {esqlResult.columns?.map((c: any, i: number) => (
                            <th key={i} className="px-3.5 py-2.5 text-[11px] uppercase tracking-wider">{c.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${
                        isDark ? "divide-slate-800/60 bg-slate-900/40" : "divide-slate-200 bg-white"
                      }`}>
                        {esqlResult.values?.map((row: any[], rIdx: number) => (
                          <tr key={rIdx} className={isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}>
                            {row.map((cell: any, cIdx: number) => (
                              <td key={cIdx} className={`px-3.5 py-2 ${isDark ? "text-slate-300" : "text-slate-800"}`}>
                                {typeof cell === "number" && cell > 1000 ? `₹ ${cell.toLocaleString("en-IN")}` : String(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: CERT-In REPORT FORM */}
          {activeTab === "certin" && (
            <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
              isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-sky-500 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  CERT-In Annexure-1 Incident Notification (Statutory Form)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReport}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                      isDark ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-white" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedNotification ? "Copied!" : "Copy Summary"}</span>
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Official PDF</span>
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-xl border font-mono text-xs space-y-3 max-h-[400px] overflow-y-auto ${
                isDark ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}>
                <div className="text-center font-bold text-sky-500 border-b pb-2 border-slate-200 dark:border-slate-800">
                  INDIAN COMPUTER EMERGENCY RESPONSE TEAM (CERT-In)<br/>
                  INCIDENT REPORTING FORM - ANNEXURE 1
                </div>
                <div><strong>1. Organisation:</strong> Apex Commercial Bank of India Ltd (BFSI)</div>
                <div><strong>2. Reporting Date:</strong> {new Date().toUTCString()} (Within 6-Hour Clock)</div>
                <div><strong>3. CERT-In Incident Ref:</strong> {selectedIncId}</div>
                <div><strong>4. Nature of Incident:</strong> {currentScenario.threat_tactic} ({currentScenario.title})</div>
                <div><strong>5. Target/Attacker Entity:</strong> {currentScenario.step2.discovered_entity}</div>
                <div><strong>6. Direct Financial Risk:</strong> ₹ {currentScenario.direct_exposure_inr.toLocaleString("en-IN")}.00</div>
                <div><strong>7. Customer Impact:</strong> {currentScenario.step3.affected_accounts_total} Accounts ({currentScenario.step3.corporate_count} Corporate, {currentScenario.step3.hni_count} HNI)</div>
                <div><strong>8. Remedial Actions:</strong> {currentScenario.step5.remedial_summary}</div>
                <div><strong>9. Evidence Ledger:</strong> SHA-256 Hash Chain Sealed in AWS S3 Object Lock (ap-south-1).</div>
              </div>
            </div>
          )}

          {/* TAB 9: SARVAM INDIC BRIEF */}
          {activeTab === "indic" && (
            <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
              isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-sky-500 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Sarvam AI: Regional Indic Incident Briefing (22 Languages)
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { code: "hi", label: "Hindi (हिन्दी)" },
                    { code: "mr", label: "Marathi (मराठी)" },
                    { code: "ta", label: "Tamil (தமிழ்)" },
                    { code: "te", label: "Telugu (తెలుగు)" },
                    { code: "bn", label: "Bengali (বাংলা)" }
                  ].map(l => (
                    <button
                      key={l.code}
                      onClick={() => handleLanguageChange(l.code)}
                      className={`text-xs px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedLang === l.code 
                          ? "bg-sky-500 text-white shadow-sm" 
                          : (isDark ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-5 rounded-xl border text-sm leading-relaxed min-h-[140px] flex items-center transition-colors ${
                isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}>
                {isTranslating ? (
                  <div className="flex items-center gap-2 text-sky-500 animate-pulse font-semibold">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Translating via Sarvam AI 105B Indic Model...</span>
                  </div>
                ) : (
                  <p className="whitespace-pre-line font-medium">
                    {translatedText || currentScenario.indic[selectedLang] || currentScenario.indic["hi"]}
                  </p>
                )}
              </div>
              <div className="text-[11px] text-slate-500">
                <span>Designed for Regional Risk Officers and Branch Compliance Managers outside metro SOCs.</span>
              </div>
            </div>
          )}

          {/* TAB 10: SHA-256 EVIDENCE LEDGER */}
          {activeTab === "ledger" && (
            <div className={`border rounded-2xl p-5 flex flex-col gap-4 text-left transition-colors ${
              isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-purple-500 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Cryptographic SHA-256 Tamper-Evident Evidence Ledger
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                  isDark ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-100 text-emerald-700 border-emerald-200"
                }`}>
                  ✓ 100% Hash Chain Intact
                </span>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto">
                {[
                  { block: 101, step: `${selectedIncId}_TRIGGER`, hash: "0x7a3f89e219ba482c...", prev: "0x0000000000000000..." },
                  { block: 102, step: "AUTONOMOUS_DETECTION_MATCHED", hash: "0x9c4172f8812e99a1...", prev: "0x7a3f89e219ba482c..." },
                  { block: 103, step: "FINANCIAL_EXPOSURE_QUANTIFIED", hash: "0x1f8e99b247012caa...", prev: "0x9c4172f8812e99a1..." },
                  { block: 104, step: "CONTAINMENT_HITL_EXECUTED", hash: "0x3d2b881729ec5510...", prev: "0x1f8e99b247012caa..." },
                  { block: 105, step: "CERT_IN_ANNEXURE1_SEALED", hash: "0x8e5a77192834bba9...", prev: "0x3d2b881729ec5510..." }
                ].map((b) => (
                  <div key={b.block} className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-colors ${
                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200 shadow-sm"
                  }`}>
                    <div>
                      <div className={`flex items-center gap-2 font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                        <span className="text-purple-500">Block #{b.block}</span>
                        <span>• {b.step}</span>
                      </div>
                      <div className={`text-[11px] mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        Prev: {b.prev}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-sky-500 font-bold">Hash: {b.hash}</div>
                      <div className="text-[10px] text-emerald-500 mt-0.5">S3 Object Lock (WORM)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* MODAL 1: RAW ECS JSON INSPECTOR MODAL */}
      {rawEcsModalData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl border rounded-2xl p-5 shadow-2xl text-left ${
            isDark ? "bg-[#0F172A] border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-900"
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-sky-500" />
                <h3 className="font-bold text-sm">Elastic Common Schema (ECS) Raw Document</h3>
              </div>
              <button
                onClick={() => setRawEcsModalData(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className={`mt-3 p-4 rounded-xl font-mono text-xs max-h-[380px] overflow-y-auto ${
              isDark ? "bg-slate-950 text-emerald-400 border border-slate-800" : "bg-slate-50 text-slate-800 border border-slate-200"
            }`}>
              <pre>{JSON.stringify(rawEcsModalData, null, 2)}</pre>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">Compliant with Elastic ECS v8.11 specification</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(rawEcsModalData, null, 2));
                  setCopiedNotification(true);
                  setTimeout(() => setCopiedNotification(false), 2000);
                }}
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedNotification ? "Copied!" : "Copy JSON"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SOC ESCALATION & WEBHOOKS DISPATCHER */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl border rounded-2xl p-5 shadow-2xl text-left ${
            isDark ? "bg-[#0F172A] border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-900"
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-purple-500" />
                <h3 className="font-bold text-sm">SOC Tier-1 Incident Escalation Webhooks</h3>
              </div>
              <button
                onClick={() => setShowEscalateModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5 mt-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Target Slack / Teams Channel</label>
                <input
                  readOnly
                  value={currentScenario.escalation.slack_channel}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono mt-1 ${isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200"}`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">PagerDuty Severity Level</label>
                <input
                  readOnly
                  value={currentScenario.escalation.pagerduty_urgency}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono font-bold mt-1 ${
                    currentScenario.severity === "CRITICAL" ? "text-red-400 bg-red-500/10 border-red-500/30" : "text-amber-400 bg-amber-500/10 border-amber-500/30"
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Automated Jira Service Desk Ticket</label>
                <div className={`p-3 rounded-xl border text-xs font-mono whitespace-pre-line mt-1 ${isDark ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"}`}>
                  {`Summary: ${currentScenario.escalation.jira_summary}\nSeverity: ${currentScenario.severity}\nRegulatory Exposure: Rs. ${currentScenario.direct_exposure_inr.toLocaleString("en-IN")}\nPrimary Entity: ${currentScenario.step2.discovered_entity}\nContainment Status: ${containmentApproved ? "APPLIED" : "PENDING_HITL"}`}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    alert(`✅ Successfully dispatched escalation payload to Slack ${currentScenario.escalation.slack_channel} and PagerDuty!`);
                    setShowEscalateModal(false);
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Dispatch Escalation Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
