"""
VIGIL Continuous Real-World Telemetry & Attack Simulation Daemon.
Streams realistic Indian BFSI telemetry (UPI, NetBanking, ATM, Auth) with stochastic noise
and periodically injects real-world attack campaigns into Elastic Cloud.

Usage:
  python live_stream_daemon.py
"""
import sys
import time
import json
import random
from datetime import datetime
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(BASE_DIR))

from backend.elastic.client import elastic_client
from backend.data.mock_bank_db import get_db

BANKS = ["okhdfcbank", "okaxis", "okicici", "oksbi", "paytm", "yesbank"]
TIERS = ["Retail", "Retail", "Retail", "Retail", "HNI", "Corporate"]
CHANNELS = ["UPI_GATEWAY", "UPI_GATEWAY", "NETBANKING", "IMPS", "ATM_SWITCH"]

ATTACK_CAMPAIGNS = [
    {
        "name": "UPI Bulk Payroll Token Theft",
        "attacker_ip": "198.51.100.44",
        "user": "svc_payment_gw",
        "batch_id": "BATCH-20260902-8821",
        "vpa": "merchant.bulk@yesbank",
        "target_vpas": [f"rogue.payout.{i}@paytm" for i in range(1, 10)],
        "amount_range": (1500000.0, 4500000.0),
        "tactic": "Privilege Escalation / Financial Exfiltration"
    },
    {
        "name": "Botnet Credential Stuffing Wave",
        "attacker_ip": "203.0.113.89",
        "user": "corporate_salary_admin",
        "batch_id": "IMPS-BURST-9912",
        "vpa": "admin.corp@axis",
        "target_vpas": ["mule.drop.99@icici", "mule.drop.100@icici"],
        "amount_range": (500000.0, 1200000.0),
        "tactic": "Credential Access / Brute Force"
    }
]

def generate_noise_batch(batch_size: int = 15):
    """Generates realistic baseline banking noise (UPI transfers, logins, balance checks)."""
    docs = []
    now_iso = datetime.utcnow().isoformat() + "Z"
    
    for _ in range(batch_size):
        tier = random.choice(TIERS)
        channel = random.choice(CHANNELS)
        bank_handle = random.choice(BANKS)
        
        amt = random.uniform(100.0, 15000.0) if tier == "Retail" else random.uniform(50000.0, 500000.0)
        user_id = f"cust_{random.randint(10000, 99999)}"
        acc_id = f"ACC-{tier.upper()}-{random.randint(1000000, 9999999)}"
        src_ip = f"103.{random.randint(10,250)}.{random.randint(1,254)}.{random.randint(1,254)}"
        
        # 1. Financial Event
        docs.append({
            "_index": "logs-banking-default",
            "@timestamp": now_iso,
            "event": {"category": "financial", "type": "transaction", "outcome": "success", "severity": 1},
            "source": {"ip": src_ip, "port": random.randint(1024, 65535)},
            "destination": {"ip": "10.0.8.50", "port": 8443, "domain": "npci-switch.bank.internal"},
            "user": {"name": user_id, "roles": ["RETAIL_USER"]},
            "bank": {
                "account_id": acc_id,
                "customer_tier": tier,
                "upi_vpa": f"{user_id}@{bank_handle}",
                "beneficiary_vpa": f"merchant.{random.randint(100,999)}@paytm",
                "channel": channel,
                "amount_inr": round(amt, 2),
                "currency": "INR",
                "batch_id": f"BATCH-ROUTINE-{random.randint(100, 999)}",
                "aml_risk_score": round(random.uniform(1.0, 15.0), 1),
                "kyc_verified": True
            },
            "scenario_id": "BENIGN_NOISE"
        })

        # 2. Auth Log (Occasional noise failure)
        outcome = "failure" if random.random() < 0.1 else "success"
        docs.append({
            "_index": "logs-auth-default",
            "@timestamp": now_iso,
            "event": {"category": "authentication", "type": "access", "outcome": outcome, "severity": 2 if outcome == "failure" else 1},
            "source": {"ip": src_ip, "port": random.randint(1024, 65535)},
            "destination": {"ip": "10.0.4.12", "port": 443, "domain": "auth-gateway.bank.internal"},
            "user": {"name": user_id, "roles": ["RETAIL_USER"]},
            "scenario_id": "BENIGN_NOISE"
        })

    return docs

def generate_attack_pulse():
    """Generates an anomalous attack burst with high severity and ₹ risk."""
    docs = []
    now_iso = datetime.utcnow().isoformat() + "Z"
    camp = random.choice(ATTACK_CAMPAIGNS)
    
    # 1. Attacker Auth Attempts (Brute Force)
    for _ in range(8):
        docs.append({
            "_index": "logs-auth-default",
            "@timestamp": now_iso,
            "event": {"category": "authentication", "type": "access", "outcome": "failure", "severity": 6},
            "source": {"ip": camp["attacker_ip"], "port": random.randint(49152, 65535)},
            "destination": {"ip": "10.0.4.12", "port": 443, "domain": "api-gateway.bank.internal"},
            "user": {"name": camp["user"], "roles": ["API_SERVICE"]},
            "threat": {"tactic": {"name": "Credential Access", "id": "TA0006"}, "technique": {"name": "Brute Force", "id": "T1110"}},
            "scenario_id": "ATTACK_PULSE_ACTIVE"
        })

    # 2. High-Value Fraudulent Exfiltration Batch
    for target_vpa in camp["target_vpas"][:4]:
        amt = random.uniform(*camp["amount_range"])
        docs.append({
            "_index": "logs-banking-default",
            "@timestamp": now_iso,
            "event": {"category": "financial", "type": "transaction", "outcome": "pending", "severity": 9},
            "source": {"ip": camp["attacker_ip"], "port": random.randint(49152, 65535)},
            "destination": {"ip": "10.0.8.50", "port": 8443, "domain": "npci-switch.bank.internal"},
            "user": {"name": camp["user"], "roles": ["PAYMENT_ADMIN"]},
            "bank": {
                "account_id": "ACC-CORP-9921448",
                "customer_tier": "Corporate",
                "upi_vpa": camp["vpa"],
                "beneficiary_vpa": target_vpa,
                "channel": "UPI_GATEWAY",
                "amount_inr": round(amt, 2),
                "currency": "INR",
                "batch_id": camp["batch_id"],
                "aml_risk_score": round(random.uniform(92.0, 99.0), 1),
                "kyc_verified": True
            },
            "threat": {"tactic": {"name": camp["tactic"], "id": "TA0040"}},
            "scenario_id": "ATTACK_PULSE_ACTIVE"
        })

    return docs, camp["name"]

def stream_telemetry_loop():
    print("================================================================================")
    print("🛡️  VIGIL: Continuous Real-World Telemetry & Attack Daemon Started")
    print("📡 Ingesting live streams into Elastic Cloud in real-time...")
    print("================================================================================")
    
    iteration = 0
    while True:
        iteration += 1
        
        # 1. Generate regular noise batch
        batch = generate_noise_batch(batch_size=random.randint(10, 20))
        
        # 2. Periodically inject attack pulse every 6 iterations (~25-30 seconds)
        attack_info = None
        if iteration % 6 == 0:
            attack_docs, attack_name = generate_attack_pulse()
            batch.extend(attack_docs)
            attack_info = attack_name

        # 3. Ingest into Elastic Cloud
        lines = []
        for d in batch:
            idx = d.pop("_index", "logs-banking-default")
            lines.append(json.dumps({"index": {"_index": idx}}))
            lines.append(json.dumps(d))
        ndjson_body = "\n".join(lines) + "\n"

        try:
            elastic_client.bulk_index(ndjson_body)
            t_now = datetime.now().strftime("%H:%M:%S")
            if attack_info:
                print(f"[{t_now}] 🚨 INJECTED ATTACK PULSE: '{attack_info}' | {len(batch)} events ingested!")
            else:
                print(f"[{t_now}] ⚡ Streamed {len(batch)} real-world banking events (noise + UPI traffic)")
        except Exception as e:
            print(f"Stream error: {e}")

        # Sleep 4 seconds between streaming batches
        time.sleep(4)

if __name__ == "__main__":
    stream_telemetry_loop()
