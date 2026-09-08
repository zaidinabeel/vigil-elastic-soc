"""
Synthetic Indian Banking Telemetry & Ground-Truth Attack Corpus Generator for VIGIL.
Generates realistic ECS v8.11+ logs (UPI, IMPS, Auth, Firewall, CRM) and ingests into Elastic Cloud.
Usage:
  python telemetry_generator.py --ingest
"""
import sys
import json
import random
from datetime import datetime, timedelta
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(BASE_DIR))

from backend.elastic.client import elastic_client
from backend.data.mock_bank_db import get_db

# Ground Truth Incident Scenarios Definition
SCENARIOS = [
    {
        "incident_id": "INC-2026-0902-01",
        "title": "Privileged OAuth2 Token Theft & Unauthorized Corporate UPI Batch Payout",
        "severity": "CRITICAL",
        "threat_tactic": "Privilege Escalation / Financial Exfiltration",
        "mitre_id": "T1078.004",
        "attacker_ip": "198.51.100.44",
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
        "title": "Distributed Botnet Credential Stuffing on NetBanking Portal",
        "severity": "HIGH",
        "threat_tactic": "Credential Access / Brute Force",
        "mitre_id": "T1110.004",
        "attacker_ip": "203.0.113.89",
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
        "attacker_ip": "10.14.88.22",
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
        "attacker_ip": "10.2.14.105",
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
        "attacker_ip": "10.0.1.1",
        "compromised_user": "system_batch_scheduler",
        "batch_id": "MONTHLY-INTEREST-CALC-2026",
        "direct_exposure_inr": 0.0,
        "affected_accounts_count": 50000,
        "corporate_count": 5000,
        "hni_count": 15000,
        "is_material": False,
        "rbi_status": "BENIGN_FP_SUPPRESSED",
        "description": "Scheduled monthly batch rebalancing executed at 02:00 AM. High ledger volume accurately correlated with maintenance calendar; false alarm suppressed automatically by Vigil."
    }
]

def generate_telemetry_docs(count: int = 500):
    """Generates synthetic ECS-compliant telemetry documents."""
    docs = []
    base_time = datetime.utcnow() - timedelta(hours=3)

    # 1. Generate Injected Scenario 1 Events (UPI Batch Exfiltration)
    sc1 = SCENARIOS[0]
    # API Auth brute force & token theft
    for i in range(15):
        t = (base_time + timedelta(minutes=i*2)).isoformat() + "Z"
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

    # Successful stolen token usage
    t_success = (base_time + timedelta(minutes=32)).isoformat() + "Z"
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

    # High-value UPI batch transactions
    corporate_accounts = ["ACC-CORP-9921448", "ACC-CORP-8812901"]
    hni_accounts = ["ACC-HNI-7719203", "ACC-HNI-6628194"]
    for i in range(18):
        t_tx = (base_time + timedelta(minutes=35 + i)).isoformat() + "Z"
        is_corp = (i < 4)
        acc_id = random.choice(corporate_accounts) if is_corp else random.choice(hni_accounts)
        amt = random.uniform(2500000.0, 4500000.0) if is_corp else random.uniform(200000.0, 400000.0)
        
        docs.append({
            "_index": "logs-banking-default",
            "@timestamp": t_tx,
            "event": {"category": "financial", "type": "transaction", "outcome": "pending", "severity": 9},
            "source": {"ip": sc1["attacker_ip"], "port": 51000 + i},
            "destination": {"ip": "10.0.8.50", "port": 8443, "domain": "npci-switch.bank.internal"},
            "user": {"name": sc1["compromised_user"], "roles": ["PAYMENT_ADMIN"]},
            "bank": {
                "account_id": acc_id,
                "customer_tier": "Corporate" if is_corp else "HNI",
                "upi_vpa": "merchant.bulk@yesbank",
                "beneficiary_vpa": f"rogue.payout.{i+1}@paytm",
                "channel": "UPI_GATEWAY",
                "amount_inr": round(amt, 2),
                "currency": "INR",
                "batch_id": sc1["batch_id"],
                "aml_risk_score": round(random.uniform(88.0, 98.5), 1),
                "kyc_verified": True
            },
            "threat": {"tactic": {"name": "Impact", "id": "TA0040"}, "technique": {"name": "Financial Theft", "id": "T1059"}},
            "scenario_id": sc1["incident_id"]
        })

    # 2. Generate Scenario 2 Events (Botnet NetBanking Credential Stuffing & IMPS)
    sc2 = SCENARIOS[1]
    for i in range(25):
        t_auth = (base_time + timedelta(minutes=i)).isoformat() + "Z"
        docs.append({
            "_index": "logs-auth-default",
            "@timestamp": t_auth,
            "event": {"category": "authentication", "type": "access", "outcome": "failure", "severity": 6},
            "source": {"ip": sc2["attacker_ip"], "port": 40000 + i, "geo": {"country_name": "Tor Exit Node", "city_name": "Amsterdam"}},
            "destination": {"ip": "10.0.2.15", "port": 443, "domain": "auth-gateway.bank.internal"},
            "user": {"name": f"corp_user_{100 + i}", "roles": ["CORP_NETBANKING"]},
            "threat": {"tactic": {"name": "Credential Access", "id": "TA0006"}, "technique": {"name": "Credential Stuffing", "id": "T1110.004"}},
            "scenario_id": sc2["incident_id"]
        })
    for i in range(12):
        t_tx2 = (base_time + timedelta(minutes=30 + i)).isoformat() + "Z"
        docs.append({
            "_index": "logs-banking-default",
            "@timestamp": t_tx2,
            "event": {"category": "financial", "type": "transaction", "outcome": "pending", "severity": 8},
            "source": {"ip": sc2["attacker_ip"], "port": 45000 + i},
            "destination": {"ip": "10.0.8.50", "port": 8443, "domain": "imps-switch.bank.internal"},
            "user": {"name": f"corp_user_{100 + i}", "roles": ["CORP_NETBANKING"]},
            "bank": {
                "account_id": f"ACC-CORP-NET-{i+1:03d}",
                "customer_tier": "Corporate",
                "upi_vpa": f"corp.{i+1}@netbank",
                "beneficiary_vpa": f"mule.imps.{i+1}@sbi",
                "channel": "IMPS",
                "amount_inr": 354166.67,
                "currency": "INR",
                "batch_id": sc2["batch_id"],
                "aml_risk_score": 92.4,
                "kyc_verified": True
            },
            "threat": {"tactic": {"name": "Impact", "id": "TA0040"}, "technique": {"name": "Financial Theft", "id": "T1059"}},
            "scenario_id": sc2["incident_id"]
        })

    # 3. Generate Scenario 3 Events (ATM Switch ISO 8583 MITM Code Tampering)
    sc3 = SCENARIOS[2]
    for i in range(12):
        t_tx3 = (base_time + timedelta(minutes=40 + i*2)).isoformat() + "Z"
        docs.append({
            "_index": "logs-banking-default",
            "@timestamp": t_tx3,
            "event": {"category": "financial", "type": "transaction", "outcome": "success", "severity": 9},
            "source": {"ip": sc3["attacker_ip"], "port": 52000 + i},
            "destination": {"ip": "10.0.12.1", "port": 9000, "domain": "atm-cluster-04.switch.internal"},
            "user": {"name": sc3["compromised_user"], "roles": ["SWITCH_ADMIN"]},
            "bank": {
                "account_id": f"ACC-HNI-ATM-{i+1:03d}",
                "customer_tier": "HNI",
                "upi_vpa": "N/A",
                "beneficiary_vpa": "CASH_DISPENSE_ATM_CLUSTER",
                "channel": "ATM_SWITCH",
                "amount_inr": 2833333.33,
                "currency": "INR",
                "batch_id": sc3["batch_id"],
                "aml_risk_score": 96.0,
                "kyc_verified": True
            },
            "threat": {"tactic": {"name": "Man-in-the-Middle", "id": "TA0009"}, "technique": {"name": "ISO 8583 Manipulation", "id": "T1557"}},
            "scenario_id": sc3["incident_id"]
        })

    # 4. Generate Scenario 4 Events (Rogue Branch Insider KYC Override & Loan Disbursal)
    sc4 = SCENARIOS[3]
    for i in range(12):
        t_tx4 = (base_time + timedelta(minutes=50 + i)).isoformat() + "Z"
        docs.append({
            "_index": "logs-banking-default",
            "@timestamp": t_tx4,
            "event": {"category": "financial", "type": "transaction", "outcome": "pending", "severity": 8},
            "source": {"ip": sc4["attacker_ip"], "port": 53000 + i},
            "destination": {"ip": "10.0.6.20", "port": 8080, "domain": "cbs-loan.bank.internal"},
            "user": {"name": sc4["compromised_user"], "roles": ["LOAN_OFFICER"]},
            "bank": {
                "account_id": f"ACC-LOAN-MULE-{i+1:03d}",
                "customer_tier": "HNI",
                "upi_vpa": "N/A",
                "beneficiary_vpa": f"mule.loan.{i+1}@kotak",
                "channel": "CBS_LOAN_DISBURSAL",
                "amount_inr": 233333.33,
                "currency": "INR",
                "batch_id": sc4["batch_id"],
                "aml_risk_score": 89.0,
                "kyc_verified": False
            },
            "threat": {"tactic": {"name": "Privilege Abuse", "id": "TA0004"}, "technique": {"name": "Insider Override", "id": "T1078"}},
            "scenario_id": sc4["incident_id"]
        })

    # 5. Generate Scenario 5 Events (Scheduled Month-End Core Interest Batch)
    sc5 = SCENARIOS[4]
    for i in range(20):
        t_tx5 = (base_time + timedelta(minutes=60 + i)).isoformat() + "Z"
        docs.append({
            "_index": "logs-banking-default",
            "@timestamp": t_tx5,
            "event": {"category": "financial", "type": "transaction", "outcome": "success", "severity": 1},
            "source": {"ip": sc5["attacker_ip"], "port": 54000 + i},
            "destination": {"ip": "10.0.1.100", "port": 8080, "domain": "cbs-core.bank.internal"},
            "user": {"name": sc5["compromised_user"], "roles": ["SYSTEM_SCHEDULER"]},
            "bank": {
                "account_id": f"ACC-SAVINGS-{i+1:05d}",
                "customer_tier": "Retail",
                "upi_vpa": "N/A",
                "beneficiary_vpa": "AUTO_INTEREST_CREDIT",
                "channel": "CORE_BANKING_ENGINE",
                "amount_inr": 4500.00,
                "currency": "INR",
                "batch_id": sc5["batch_id"],
                "aml_risk_score": 1.0,
                "kyc_verified": True
            },
            "threat": {"tactic": {"name": "Routine Maintenance", "id": "TA0000"}, "technique": {"name": "Scheduled Batch", "id": "T0000"}},
            "scenario_id": sc5["incident_id"]
        })

    # 2. Generate Background Benign Traffic
    tiers = ["Retail", "Retail", "Retail", "HNI", "Corporate"]
    channels = ["UPI_GATEWAY", "NETBANKING", "IMPS", "ATM_SWITCH"]
    for i in range(count):
        t_bg = (base_time + timedelta(minutes=random.randint(0, 180))).isoformat() + "Z"
        c_tier = random.choice(tiers)
        amt = random.uniform(500.0, 25000.0) if c_tier == "Retail" else random.uniform(50000.0, 500000.0)
        
        docs.append({
            "_index": "logs-banking-default",
            "@timestamp": t_bg,
            "event": {"category": "financial", "type": "transaction", "outcome": "success", "severity": 1},
            "source": {"ip": f"103.21.{random.randint(10,250)}.{random.randint(1,254)}", "port": random.randint(1024, 65535)},
            "destination": {"ip": "10.0.8.50", "port": 8443},
            "user": {"name": f"user_retail_{random.randint(100, 999)}", "roles": ["RETAIL_USER"]},
            "bank": {
                "account_id": f"ACC-RETAIL-{random.randint(100000, 999999)}",
                "customer_tier": c_tier,
                "upi_vpa": f"cust.{random.randint(100,999)}@okhdfcbank",
                "beneficiary_vpa": f"merchant.{random.randint(10,99)}@icici",
                "channel": random.choice(channels),
                "amount_inr": round(amt, 2),
                "currency": "INR",
                "batch_id": f"BATCH-ROUTINE-{random.randint(100, 999)}",
                "aml_risk_score": round(random.uniform(2.0, 18.0), 1),
                "kyc_verified": True
            },
            "scenario_id": "BENIGN_BASELINE"
        })

    return docs

def populate_mock_db(docs):
    """Populates the local SQLite DB for offline simulation."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM telemetry")
    
    for d in docs:
        b = d.get("bank", {})
        src = d.get("source", {})
        dst = d.get("destination", {})
        u = d.get("user", {})
        ev = d.get("event", {})
        
        cur.execute("""
        INSERT INTO telemetry (
            timestamp, category, event_type, source_ip, destination_ip,
            user_name, roles, bank_account_id, bank_customer_tier,
            bank_upi_vpa, bank_beneficiary_vpa, bank_channel,
            bank_amount_inr, bank_batch_id, bank_aml_risk_score, status_code, scenario_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            d.get("@timestamp"),
            ev.get("category"),
            ev.get("type"),
            src.get("ip"),
            dst.get("ip"),
            u.get("name"),
            ",".join(u.get("roles", [])),
            b.get("account_id"),
            b.get("customer_tier"),
            b.get("upi_vpa"),
            b.get("beneficiary_vpa"),
            b.get("channel"),
            b.get("amount_inr", 0.0),
            b.get("batch_id"),
            b.get("aml_risk_score", 0.0),
            200 if ev.get("outcome") == "success" else 401,
            d.get("scenario_id")
        ))
    conn.commit()
    print(f"✅ Populated in-memory telemetry database with {len(docs)} records.")

def ingest_to_elastic(docs):
    """Bulk ingests documents to Elastic Cloud using NDJSON payload."""
    lines = []
    for d in docs:
        idx = d.pop("_index", "logs-banking-default")
        lines.append(json.dumps({"index": {"_index": idx}}))
        lines.append(json.dumps(d))
    
    ndjson_body = "\n".join(lines) + "\n"

    print(f"🚀 Ingesting {len(docs)} documents into Elastic Cloud...")
    try:
        res = elastic_client.bulk_index(ndjson_body)
        errors = res.get("errors", False)
        if errors:
            print("⚠️ Some items had ingestion warnings in bulk response.")
        else:
            print(f"🎉 Successfully indexed {len(docs)} ECS documents into Elastic Cloud!")
    except Exception as e:
        print(f"⚠️ Live bulk indexing note: {e}. (Data is cached in local simulator).")

def main():
    print("================================================================================")
    print("🛡️  VIGIL: Generating 30-Day Indian Banking Telemetry & Attack Chains...")
    print("================================================================================")
    
    docs = generate_telemetry_docs(count=350)
    print(f"📊 Generated {len(docs)} realistic ECS banking & auth records.")
    
    # Always populate local mock DB
    populate_mock_db(docs)

    # Ingest to Elastic Cloud if live or requested
    if "--ingest" in sys.argv or elastic_client.is_live:
        ingest_to_elastic(docs)

    print("\n✅ Ground-Truth Corpus Ready!")
    print(f"🎯 Active Attack Scenarios: {len(SCENARIOS)}")
    for s in SCENARIOS:
        print(f"   • [{s['severity']}] {s['incident_id']}: {s['title']} (Exp: Rs. {s['direct_exposure_inr']:,.2f})")
    print("================================================================================")

if __name__ == "__main__":
    main()
