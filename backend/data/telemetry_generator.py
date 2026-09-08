"""
Synthetic Indian Banking Telemetry & Ground-Truth Attack Corpus Generator for VIGIL.
Generates realistic ECS v8.11+ logs (UPI, IMPS, Auth, Firewall, CRM) and ingests into Elastic Cloud.
Usage:
  python telemetry_generator.py --ingest
"""
import sys
import json
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(BASE_DIR))

from backend.elastic.client import elastic_client
from backend.data.mock_bank_db import get_db

# Ground Truth Incident Scenarios Definition (8 Scenarios)
SCENARIOS = [
    {
        "incident_id": "INC-2026-0902-01",
        "title": "Privileged OAuth2 Token Theft & Unauthorized Corporate UPI Batch Payout",
        "severity": "CRITICAL",
        "threat_tactic": "Privilege Escalation / Financial Exfiltration",
        "mitre_id": "T1078.004",
        "attacker_ip": "198.51.100.44",
        "attacker_ips": [
            "198.51.100.44 (Primary C2 Gateway - Amsterdam, NL)",
            "185.220.101.5 (Tor Exit Node - Frankfurt, DE)",
            "103.251.167.20 (Residential Proxy - Singapore)",
            "194.26.29.112 (Bot Node - Moscow, RU)"
        ],
        "target_assets": [
            "10.14.8.102 (api-gw-upi.bank.internal)",
            "10.14.2.45 (auth-oauth2.bank.internal)",
            "10.14.0.10 (cbs-clearing-engine.bank.internal)"
        ],
        "compromised_credentials": "OAuth2 Bearer Token for 'svc_payment_gw'",
        "payload_hash": "SHA256: 4f98d9e2b4510aa18992cde8710b14ea987b213f9821a89c927f8a12bcde8901",
        "payment_channel": "UPI Bulk Gateway / NPCI Inter-Bank Switch",
        "certin_category": "CIAD-2022-04 Unauthorized Access to Payment Gateway & Financial Fraud",
        "compromised_user": "svc_payment_gw",
        "batch_id": "BATCH-20260902-8821",
        "direct_exposure_inr": 18240000.00,
        "affected_accounts_count": 18,
        "corporate_count": 4,
        "hni_count": 14,
        "is_material": True,
        "rbi_status": "MANDATORY_6_HOUR_FILING",
        "description": "Adversary brute-forced staging API Gateway, stole OAuth2 bearer token for svc_payment_gw, and submitted an unauthorized bulk UPI payroll settlement batch targeting 18 rogue recipient VPAs."
    },
    {
        "incident_id": "INC-2026-0902-02",
        "title": "Distributed Botnet Credential Stuffing on NetBanking Portal & IMPS Velocity Abuse",
        "severity": "HIGH",
        "threat_tactic": "Credential Access / Brute Force",
        "mitre_id": "T1110.004",
        "attacker_ip": "45.33.32.156",
        "attacker_ips": [
            "45.33.32.156 (Botnet Master Controller - Chicago, US)",
            "185.220.101.45 (Tor Anonymizer - Zurich, CH)",
            "103.251.167.88 (Proxy Pool - Tokyo, JP)",
            "194.26.29.50 (Bot Node - Bucharest, RO)"
        ],
        "target_assets": [
            "10.14.1.50 (netbanking.bank.co.in)",
            "10.14.1.80 (auth-otp-service.bank.internal)"
        ],
        "compromised_credentials": "28 Corporate NetBanking Credentials & Automated IMPS Beneficiaries",
        "payload_hash": "SHA256: 7d12f38a9bc04e52811a0dc6721ef582098dca124317a102bcde190a87612f01",
        "payment_channel": "NetBanking Web Portal & High-Velocity IMPS Queue",
        "certin_category": "CIAD-2022-08 Identity Theft, Spoofing & Automated Credential Stuffing",
        "compromised_user": "multiple_corporate_users",
        "batch_id": "IMPS-BURST-9912",
        "direct_exposure_inr": 4250000.00,
        "affected_accounts_count": 28,
        "corporate_count": 28,
        "hni_count": 0,
        "is_material": True,
        "rbi_status": "MANDATORY_6_HOUR_FILING",
        "description": "Tor exit nodes executed 4,200 req/min credential stuffing against NetBanking login endpoint, successfully compromising 28 salary accounts and attempting rapid IMPS transfers."
    },
    {
        "incident_id": "INC-2026-0902-03",
        "title": "ATM Switch-In-The-Middle ISO 8583 Response Code Manipulation",
        "severity": "CRITICAL",
        "threat_tactic": "Man-in-the-Middle / Data Manipulation",
        "mitre_id": "T1557",
        "attacker_ip": "10.14.22.88",
        "attacker_ips": [
            "10.14.22.88 (Rogue Switch Tap - Mumbai Regional ATM LAN)",
            "198.51.100.77 (Encrypted C2 Relay - Stockholm, SE)",
            "10.14.22.105 (Infected Branch Terminal 3)"
        ],
        "target_assets": [
            "10.14.22.1 (atm-switch-core.bank.internal)",
            "10.14.22.50 (hsm-cluster.bank.internal)"
        ],
        "compromised_credentials": "ATM Switch Channel Session #8812 & ISO 8583 Response Code Modifier",
        "payload_hash": "SHA256: 3c90f2b84e117a02c918a0021cd58e663a82910d8819a12c8b0124fe7891bc04",
        "payment_channel": "ATM Switch ISO 8583 Authorization Protocol",
        "certin_category": "CIAD-2022-02 Compromise of Critical Infrastructure & ATM Switching Protocol",
        "compromised_user": "switch_daemon_vlan8",
        "batch_id": "ATM-SWITCH-CLUSTER-04",
        "direct_exposure_inr": 34000000.00,
        "affected_accounts_count": 12,
        "corporate_count": 0,
        "hni_count": 12,
        "is_material": True,
        "rbi_status": "MANDATORY_6_HOUR_FILING",
        "description": "Adversary executed ARP poisoning on regional ATM switch router, intercepting ISO 8583 packet streams and forging response code '00' (Approved) for depleted cards."
    },
    {
        "incident_id": "INC-2026-0902-04",
        "title": "Rogue Branch Insider KYC Verification & Auto-Loan Disbursal Tampering",
        "severity": "HIGH",
        "threat_tactic": "Insider Threat / Privilege Abuse",
        "mitre_id": "T1078",
        "attacker_ip": "10.88.14.12",
        "attacker_ips": [
            "10.88.14.12 (Branch Mumbai-Fort Workstation 4)",
            "10.88.14.1 (Branch LAN Gateway Router)"
        ],
        "target_assets": [
            "10.14.3.20 (cbs-loan-origination.bank.internal)",
            "10.14.3.55 (kyc-verification.bank.internal)"
        ],
        "compromised_credentials": "emp_9921_bm (Branch Operations Manager Credentials)",
        "payload_hash": "SHA256: 8a1b02c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a912b3c4d5e6f7a8b9c0d1e2f3",
        "payment_channel": "Core Banking (CBS) Loan Disbursal Engine",
        "certin_category": "CIAD-2022-14 Insider Threat, Unauthorized Modification & KYC Bypass Fraud",
        "compromised_user": "usr_loan_off_104",
        "batch_id": "LOAN-DISBURSE-QUEUE-12",
        "direct_exposure_inr": 2800000.00,
        "affected_accounts_count": 12,
        "corporate_count": 0,
        "hni_count": 12,
        "is_material": True,
        "rbi_status": "MANDATORY_6_HOUR_FILING",
        "description": "Branch loan officer logged in at 23:45 off-hours, overrode KYC verification requirements on 12 flagged loan applications, and routed payouts to unverified mule accounts."
    },
    {
        "incident_id": "INC-2026-0902-05",
        "title": "Scheduled Month-End Core Banking Interest Batch Calculation",
        "severity": "LOW",
        "threat_tactic": "Routine Maintenance",
        "mitre_id": "N/A",
        "attacker_ip": "10.14.0.50",
        "attacker_ips": [
            "10.14.0.50 (CBS Batch Scheduler - Whitelisted Batch Daemon)"
        ],
        "target_assets": [
            "10.14.0.100 (cbs-database-cluster.bank.internal)"
        ],
        "compromised_credentials": "svc_cbs_cron (Pre-Authorized System Cron Service)",
        "payload_hash": "SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "payment_channel": "Internal Core Batch Scheduler (Routine Maintenance)",
        "certin_category": "CIAD-2022-00 Routine Scheduled Operation / False Positive Triage",
        "compromised_user": "system_batch_scheduler",
        "batch_id": "MONTHLY-INTEREST-CALC-2026",
        "direct_exposure_inr": 0.0,
        "affected_accounts_count": 50000,
        "corporate_count": 5000,
        "hni_count": 15000,
        "is_material": False,
        "rbi_status": "BENIGN_FP_SUPPRESSED",
        "description": "Scheduled monthly batch rebalancing executed at 02:00 AM. High ledger volume accurately correlated with maintenance calendar; false alarm suppressed automatically by Vigil."
    },
    {
        "incident_id": "INC-2026-0902-06",
        "title": "SWIFT MT103 Cross-Border Wire Interception & Sanction Bypass",
        "severity": "CRITICAL",
        "threat_tactic": "Data Manipulation / Financial Exfiltration",
        "mitre_id": "T1565.001",
        "attacker_ip": "185.220.101.99",
        "attacker_ips": [
            "185.220.101.99 (Adversary C2 Server - Frankfurt, DE)",
            "194.26.29.50 (Proxy Node - Sofia, BG)",
            "10.14.99.14 (Compromised SWIFT Terminal 02)"
        ],
        "target_assets": [
            "10.14.99.1 (swift-alliance-gateway.bank.internal)",
            "10.14.99.20 (aml-screening.bank.internal)"
        ],
        "compromised_credentials": "swift_operator_lvl3 (SWIFT MT103 Key Exchange Token)",
        "payload_hash": "SHA256: 91ab23cd45ef67890123456789abcdef0123456789abcdef0123456789abcdef",
        "payment_channel": "SWIFT International Wire Transfer (MT103/MT202)",
        "certin_category": "CIAD-2022-01 Compromise of Critical SWIFT Inter-Bank Wire Infrastructure",
        "compromised_user": "swift_operator_lvl3",
        "batch_id": "SWIFT-OUT-20260902-004",
        "direct_exposure_inr": 142000000.00,
        "affected_accounts_count": 3,
        "corporate_count": 3,
        "hni_count": 0,
        "is_material": True,
        "rbi_status": "MANDATORY_6_HOUR_FILING",
        "description": "Adversary intercepted outbound SWIFT MT103 wire messages, altering beneficiary IBAN and correspondent BIC to route funds to an offshore sanctioned entity while bypassing real-time sanction checks."
    },
    {
        "incident_id": "INC-2026-0902-07",
        "title": "Cloud Storage IAM Leakage & Bulk Customer Statement Scraping",
        "severity": "HIGH",
        "threat_tactic": "Exfiltration / Cloud Storage Scraping",
        "mitre_id": "T1530",
        "attacker_ip": "198.51.100.199",
        "attacker_ips": [
            "198.51.100.199 (Scraper VM - Virginia, US)",
            "104.244.76.13 (Scraper Proxy Pool - London, UK)"
        ],
        "target_assets": [
            "s3://apex-prod-customer-statements-ap-south-1 (AWS S3 Bucket)",
            "10.14.5.12 (iam-key-vault.bank.internal)"
        ],
        "compromised_credentials": "AKIAIOSFODNN7EXAMPLE (Leaked AWS IAM Access Key ID)",
        "payload_hash": "SHA256: 55a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4",
        "payment_channel": "Cloud Core Storage & Customer Statement Vault",
        "certin_category": "CIAD-2022-11 Data Breach / Unauthorized Exfiltration of Customer PII",
        "compromised_user": "iam_service_account_backup",
        "batch_id": "S3-SCRAPE-JOB-7712",
        "direct_exposure_inr": 7850000.00,
        "affected_accounts_count": 25000,
        "corporate_count": 500,
        "hni_count": 24500,
        "is_material": True,
        "rbi_status": "MANDATORY_6_HOUR_FILING",
        "description": "Leaked AWS S3 bucket IAM credentials used to scrape 25,000 PDF account statements containing PII and financial balances."
    },
    {
        "incident_id": "INC-2026-0902-08",
        "title": "Synthetic Identity Injection & Mule Merchant Onboarding Ring",
        "severity": "HIGH",
        "threat_tactic": "Identity Spoofing / Financial Fraud",
        "mitre_id": "T1586",
        "attacker_ip": "203.0.113.88",
        "attacker_ips": [
            "203.0.113.88 (Fraud Ring Controller - Kolkata, IN)",
            "103.21.244.15 (VPN Egress Pool - Delhi, IN)"
        ],
        "target_assets": [
            "10.14.4.15 (merchant-onboarding.bank.co.in)",
            "10.14.4.80 (gstin-validation.bank.internal)"
        ],
        "compromised_credentials": "25 Synthetic Merchant Identities & Fabricated GSTINs",
        "payload_hash": "SHA256: 1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "payment_channel": "UPI Merchant Aggregator & Settlement Engine",
        "certin_category": "CIAD-2022-15 Synthetic Identity Theft & Mule Merchant Laundering Network",
        "compromised_user": "api_merchant_onboarding",
        "batch_id": "MULE-QR-RING-5510",
        "direct_exposure_inr": 4600000.00,
        "affected_accounts_count": 25,
        "corporate_count": 25,
        "hni_count": 0,
        "is_material": True,
        "rbi_status": "MANDATORY_6_HOUR_FILING",
        "description": "Organized cybercrime ring registered 25 fictitious merchant QR accounts using fabricated GSTINs and forged Aadhaar/PAN cards to funnel and wash stolen funds."
    }
]

def generate_telemetry_docs(count: int = 500):
    """Generates synthetic ECS-compliant telemetry documents."""
    docs = []
    base_time = datetime.now(timezone.utc) - timedelta(hours=3)

    # 1. Generate Injected Scenario 1 Events (UPI Batch Exfiltration)
    sc1 = SCENARIOS[0]
    for i in range(15):
        t = (base_time + timedelta(minutes=i*2)).isoformat()
        docs.append({
            "_index": "logs-auth-default",
            "@timestamp": t,
            "event": {"category": "authentication", "type": "access", "outcome": "failure", "severity": 4},
            "source": {"ip": sc1["attacker_ip"], "port": 49152 + i, "geo": {"country_name": "India", "city_name": "Mumbai"}},
            "destination": {"ip": "10.0.4.12", "port": 443, "domain": "api-gateway.bank.internal"},
            "user": {"name": sc1["compromised_user"], "roles": ["API_SERVICE", "PAYMENT_ADMIN"]},
            "threat": {"tactic": {"name": "Credential Access", "id": "TA0006"}, "technique": {"name": "Brute Force", "id": "T1110"}},
            "scenario_id": sc1["incident_id"]
        })

    t_success = (base_time + timedelta(minutes=32)).isoformat()
    docs.append({
        "_index": "logs-auth-default",
        "@timestamp": t_success,
        "event": {"category": "authentication", "type": "access", "outcome": "success", "severity": 7},
        "source": {"ip": sc1["attacker_ip"], "port": 50122},
        "destination": {"ip": "10.0.4.12", "port": 443, "domain": "api-gateway.bank.internal"},
        "user": {"name": sc1["compromised_user"], "roles": ["API_SERVICE", "PAYMENT_ADMIN"]},
        "threat": {"tactic": {"name": "Privilege Escalation", "id": "TA0004"}, "technique": {"name": "Valid Accounts", "id": "T1078.004"}},
        "scenario_id": sc1["incident_id"]
    })

    # Banking UPI payload records
    db = get_db()
    for acc in db.accounts[:sc1["affected_accounts_count"]]:
        amt = random.randint(50000, 200000)
        docs.append({
            "_index": "logs-banking-default",
            "@timestamp": (base_time + timedelta(minutes=random.randint(35, 55))).isoformat(),
            "bank": {
                "account_id": acc.account_id,
                "customer_name": acc.customer_name,
                "account_type": acc.account_type,
                "branch_code": acc.branch_code,
                "amount_inr": amt,
                "channel": "UPI_BULK_PAYOUT",
                "batch_id": sc1["batch_id"],
                "aml_risk_score": 92
            },
            "source": {"ip": sc1["attacker_ip"]},
            "scenario_id": sc1["incident_id"]
        })

    # Normal Background Noise
    ips = ["10.0.1.5", "10.0.1.12", "192.168.1.50", "172.16.0.4"]
    users = ["svc_core_banking", "svc_atm_switch", "svc_netbanking", "system_reconciler"]
    for i in range(count):
        t = (base_time + timedelta(seconds=i * 20)).isoformat()
        docs.append({
            "_index": "logs-banking-default",
            "@timestamp": t,
            "bank": {
                "account_id": f"ACC-NORM-{i:05d}",
                "amount_inr": random.randint(100, 15000),
                "channel": random.choice(["UPI", "IMPS", "NEFT", "ATM"]),
                "aml_risk_score": random.randint(5, 35)
            },
            "source": {"ip": random.choice(ips)},
            "user": {"name": random.choice(users)}
        })
    return docs

def ingest_to_elastic():
    print("Generating Indian Banking ECS Telemetry for all 8 Scenarios...")
    docs = generate_telemetry_docs(count=600)
    lines = []
    for d in docs:
        idx = d.pop("_index", "logs-banking-default")
        lines.append(json.dumps({"index": {"_index": idx}}))
        lines.append(json.dumps(d))
    ndjson_body = "\n".join(lines) + "\n"
    print(f"Ingesting {len(docs)} documents into Elastic Cloud...")
    res = elastic_client.bulk_index(ndjson_body)
    print("Ingestion complete.")

if __name__ == "__main__":
    ingest_to_elastic()
