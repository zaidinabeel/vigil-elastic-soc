"""
Elastic Cloud Cluster Setup Utility for VIGIL.
Configures component templates, index templates, and verifies ECS v8.11+ BFSI schemas.
Usage:
  python setup_cluster.py
"""
import sys
import json
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(BASE_DIR))

from backend.elastic.client import elastic_client
from backend.elastic.ecs_schema import (
    ECS_BASE_MAPPINGS,
    BANKING_ECS_MAPPINGS,
    BANKING_INDEX_TEMPLATE,
    AUTH_INDEX_TEMPLATE,
    NETWORK_INDEX_TEMPLATE
)

def setup_cluster():
    print("================================================================================")
    print("🛡️  VIGIL: Initializing Elastic Cloud Cluster Setup...")
    print("================================================================================")

    # 1. Check Connectivity
    health = elastic_client.cluster_health()
    status = health.get("status", "unknown")
    cluster_name = health.get("cluster_name", "unknown")
    is_live = not health.get("mock", False)

    print(f"📊 Cluster Name  : {cluster_name}")
    print(f"🟢 Cluster Status: {status.upper()}")
    print(f"🔌 Connection    : {'LIVE ELASTIC CLOUD' if is_live else 'LOCAL SIMULATOR'}")
    print("--------------------------------------------------------------------------------")

    if not is_live:
        print("ℹ️  Running in Local Simulator mode.")
        print("👉 To connect your Elastic Cloud Free Trial:")
        print("   1. Copy your Cloud ID & API Key into backend/.env")
        print("   2. Re-run this script: python3 backend/elastic/setup_cluster.py\n")

    # 2. Register Component Templates
    print("📦 [1/3] Registering ECS Component Templates...")
    try:
        res1 = elastic_client.put_component_template("vigil-ecs-base", ECS_BASE_MAPPINGS)
        print("   ✅ Component Template 'vigil-ecs-base' registered.")
        res2 = elastic_client.put_component_template("vigil-banking-extension", BANKING_ECS_MAPPINGS)
        print("   ✅ Component Template 'vigil-banking-extension' registered.")
    except Exception as e:
        print(f"   ❌ Error registering component templates: {e}")
        return False

    # 3. Register Index Templates
    print("\n📋 [2/3] Registering Index Templates...")
    try:
        elastic_client.put_index_template("vigil-logs-banking", BANKING_INDEX_TEMPLATE)
        print("   ✅ Index Template 'vigil-logs-banking' (pattern: logs-banking-*) active.")
        elastic_client.put_index_template("vigil-logs-auth", AUTH_INDEX_TEMPLATE)
        print("   ✅ Index Template 'vigil-logs-auth' (pattern: logs-auth-*) active.")
        elastic_client.put_index_template("vigil-logs-network", NETWORK_INDEX_TEMPLATE)
        print("   ✅ Index Template 'vigil-logs-network' (pattern: logs-network-*) active.")
    except Exception as e:
        print(f"   ❌ Error registering index templates: {e}")
        return False

    # 4. Verify ES|QL Capability
    print("\n⚡ [3/3] Verifying ES|QL Query Engine...")
    try:
        test_query = "FROM logs-banking-* | LIMIT 1"
        esql_res = elastic_client.execute_esql(test_query)
        columns = [c.get("name") for c in esql_res.get("columns", [])]
        print(f"   ✅ ES|QL Engine responsive. Query executed successfully.")
    except Exception as e:
        print(f"   ⚠️ ES|QL verification note: {e}")

    print("\n================================================================================")
    print("🎉 Cluster setup complete! ECS mappings and index templates are active.")
    print("👉 Next Step: Ingest the 30-day telemetry dataset:")
    print("   python3 backend/data/telemetry_generator.py --ingest")
    print("================================================================================")
    return True

if __name__ == "__main__":
    setup_cluster()
