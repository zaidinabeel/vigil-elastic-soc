"""
Core Banking CRM, Account Database & In-Memory ES|QL Engine for VIGIL.
Provides realistic customer profiles, account balances, AML scores, and offline ES|QL execution.
"""
import sqlite3
import re
from typing import Dict, Any, List

# Core Banking Customer Database
MOCK_ACCOUNTS: Dict[str, Dict[str, Any]] = {
    "ACC-CORP-9921448": {
        "account_id": "ACC-CORP-9921448",
        "customer_name": "Apex Infotech Solutions Pvt Ltd",
        "customer_tier": "Corporate",
        "account_type": "Corporate Current & Payroll",
        "balance_inr": 245000000.00,
        "branch_code": "MUM-BKC-01",
        "branch_name": "Bandra Kurla Complex Branch, Mumbai",
        "ciso_contact": "ciso@apexbank.in",
        "kyc_status": "VERIFIED_FULL",
        "daily_limit_inr": 500000000.00,
        "is_frozen": False
    },
    "ACC-CORP-8812901": {
        "account_id": "ACC-CORP-8812901",
        "customer_name": "Bharat Logistics & Supply Chain Ltd",
        "customer_tier": "Corporate",
        "account_type": "Vendor Settlement Account",
        "balance_inr": 184000000.00,
        "branch_code": "BLR-MG-04",
        "branch_name": "MG Road Branch, Bengaluru",
        "ciso_contact": "ciso@apexbank.in",
        "kyc_status": "VERIFIED_FULL",
        "daily_limit_inr": 200000000.00,
        "is_frozen": False
    },
    "ACC-HNI-7719203": {
        "account_id": "ACC-HNI-7719203",
        "customer_name": "Rajeshwari Singhania",
        "customer_tier": "HNI",
        "account_type": "Private Wealth Savings",
        "balance_inr": 48500000.00,
        "branch_code": "DEL-CP-02",
        "branch_name": "Connaught Place Branch, New Delhi",
        "ciso_contact": "ciso@apexbank.in",
        "kyc_status": "VERIFIED_FULL",
        "daily_limit_inr": 10000000.00,
        "is_frozen": False
    },
    "ACC-HNI-6628194": {
        "account_id": "ACC-HNI-6628194",
        "customer_name": "Dr. Vikramaditya Reddy",
        "customer_tier": "HNI",
        "account_type": "Private Wealth Savings",
        "balance_inr": 32000000.00,
        "branch_code": "HYD-HITEC-03",
        "branch_name": "HITEC City Branch, Hyderabad",
        "ciso_contact": "ciso@apexbank.in",
        "kyc_status": "VERIFIED_FULL",
        "daily_limit_inr": 10000000.00,
        "is_frozen": False
    },
    "ACC-RETAIL-1049281": {
        "account_id": "ACC-RETAIL-1049281",
        "customer_name": "Amit Sharma",
        "customer_tier": "Retail",
        "account_type": "Standard Salary Savings",
        "balance_inr": 450000.00,
        "branch_code": "PUN-FC-01",
        "branch_name": "FC Road Branch, Pune",
        "ciso_contact": "ciso@apexbank.in",
        "kyc_status": "VERIFIED_FULL",
        "daily_limit_inr": 200000.00,
        "is_frozen": False
    }
}

# In-Memory SQLite Database for Local ES|QL Simulation
_db_conn = None

def get_db():
    global _db_conn
    if _db_conn is None:
        _db_conn = sqlite3.connect(":memory:", check_same_thread=False)
        _db_conn.row_factory = sqlite3.Row
        _init_db(_db_conn)
    return _db_conn

def _init_db(conn):
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS telemetry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        category TEXT,
        event_type TEXT,
        source_ip TEXT,
        destination_ip TEXT,
        user_name TEXT,
        roles TEXT,
        bank_account_id TEXT,
        bank_customer_tier TEXT,
        bank_upi_vpa TEXT,
        bank_beneficiary_vpa TEXT,
        bank_channel TEXT,
        bank_amount_inr REAL,
        bank_batch_id TEXT,
        bank_aml_risk_score REAL,
        status_code INTEGER,
        scenario_id TEXT
    )
    """)
    conn.commit()

def execute_mock_esql(query: str) -> Dict[str, Any]:
    """
    Parses common ES|QL piped queries into SQL statements over the local SQLite telemetry table.
    """
    conn = get_db()
    cur = conn.cursor()

    # Normalize query
    q = query.strip()
    
    # 1. Parse table / index
    from_match = re.search(r'FROM\s+([^\s\|]+)', q, re.IGNORECASE)
    where_match = re.search(r'\|\s*WHERE\s+([^\|]+)', q, re.IGNORECASE)
    stats_match = re.search(r'\|\s*STATS\s+([^\|]+)', q, re.IGNORECASE)
    limit_match = re.search(r'\|\s*LIMIT\s+(\d+)', q, re.IGNORECASE)
    
    limit = int(limit_match.group(1)) if limit_match else 50
    where_clause = "1=1"
    if where_match:
        raw_where = where_match.group(1).strip()
        # Translate ES|QL field names to SQL column names
        raw_where = raw_where.replace("source.ip", "source_ip")
        raw_where = raw_where.replace("destination.ip", "destination_ip")
        raw_where = raw_where.replace("user.name", "user_name")
        raw_where = raw_where.replace("event.category", "category")
        raw_where = raw_where.replace("event.type", "event_type")
        raw_where = raw_where.replace("bank.batch_id", "bank_batch_id")
        raw_where = raw_where.replace("bank.upi_vpa", "bank_upi_vpa")
        raw_where = raw_where.replace("bank.amount_inr", "bank_amount_inr")
        raw_where = raw_where.replace("bank.customer_tier", "bank_customer_tier")
        raw_where = raw_where.replace("==", "=")
        where_clause = raw_where

    # Handle STATS aggregations
    if stats_match:
        stats_str = stats_match.group(1).strip()
        by_match = re.search(r'BY\s+([^\s\|]+)', stats_str, re.IGNORECASE)
        group_by = ""
        if by_match:
            raw_by = by_match.group(1).strip()
            raw_by = raw_by.replace("bank.customer_tier", "bank_customer_tier").replace("user.name", "user_name")
            group_by = f"GROUP BY {raw_by}"
            stats_str = re.sub(r'BY\s+[^\s\|]+', '', stats_str, flags=re.IGNORECASE).strip()

        # Parse aggregations like sum(bank.amount_inr), count()
        stats_str = stats_str.replace("sum(bank.amount_inr)", "SUM(bank_amount_inr) as total_amount_inr")
        stats_str = stats_str.replace("count()", "COUNT(*) as tx_count")
        stats_str = stats_str.replace("avg(bank.aml_risk_score)", "AVG(bank_aml_risk_score) as avg_aml")
        stats_str = stats_str.replace("total_amount = sum(bank.amount_inr)", "SUM(bank_amount_inr) as total_amount_inr")

        sql = f"SELECT {stats_str} {', ' + raw_by if by_match else ''} FROM telemetry WHERE {where_clause} {group_by} LIMIT {limit}"
    else:
        sql = f"SELECT timestamp as `@timestamp`, category as `event.category`, user_name as `user.name`, source_ip as `source.ip`, bank_upi_vpa as `bank.upi_vpa`, bank_amount_inr as `bank.amount_inr`, bank_customer_tier as `bank.customer_tier`, bank_batch_id as `bank.batch_id` FROM telemetry WHERE {where_clause} ORDER BY timestamp ASC LIMIT {limit}"

    try:
        cur.execute(sql)
        rows = [dict(r) for r in cur.fetchall()]
        cols = [{"name": k, "type": "keyword"} for k in (rows[0].keys() if rows else ["@timestamp", "count"])]
        # Format like ES|QL REST JSON: {"columns": [...], "values": [[...], [...]]}
        values = [[r[c["name"]] for c in cols] for r in rows]
        return {
            "columns": cols,
            "values": values,
            "is_mock": True,
            "took": 4
        }
    except Exception as e:
        # Return graceful fallback rows
        return {
            "columns": [{"name": "@timestamp", "type": "date"}, {"name": "bank.amount_inr", "type": "float"}, {"name": "bank.customer_tier", "type": "keyword"}],
            "values": [["2026-09-02T19:24:00Z", 18240000.00, "Corporate"]],
            "error_note": str(e),
            "is_mock": True
        }
