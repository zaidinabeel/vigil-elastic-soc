"""
Step 3: Rupee (₹) Financial Exposure & Business Risk Scoring for VIGIL.
Tool: bank.exposure.lookup
Correlates security telemetry with Core Banking CRM, customer balances, and AML risk.
"""
from typing import Dict, Any
from backend.data.mock_bank_db import MOCK_ACCOUNTS

def calculate_business_exposure(scenario: Dict[str, Any], evidence_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Quantifies direct loss, customer blast radius, and regulatory fine exposure under RBI guidelines.
    """
    direct_loss = scenario.get("direct_exposure_inr", 0.0)
    corp_count = scenario.get("corporate_count", 0)
    hni_count = scenario.get("hni_count", 0)
    tot_accounts = scenario.get("affected_accounts_count", corp_count + hni_count)

    # Core Banking CRM enrichments
    matched_accounts = []
    for acc_id, acc_meta in MOCK_ACCOUNTS.items():
        if (acc_meta["customer_tier"] == "Corporate" and corp_count > 0) or (acc_meta["customer_tier"] == "HNI" and hni_count > 0):
            matched_accounts.append({
                "account_id": acc_meta["account_id"],
                "customer_name": acc_meta["customer_name"],
                "tier": acc_meta["customer_tier"],
                "balance_inr": acc_meta["balance_inr"],
                "branch_name": acc_meta["branch_name"]
            })

    # Projected RBI Penalty under Section 4.2 for delayed/uncontained breaches
    rbi_penalty_exposure = 10000000.00 if direct_loss > 10000000.0 else (5000000.00 if direct_loss > 1000000.0 else 1000000.00)

    # Determine Exposure Risk Tier
    if direct_loss >= 10000000.00 or corp_count >= 2:
        risk_level = "CRITICAL"
    elif direct_loss >= 1000000.00:
        risk_level = "HIGH"
    elif direct_loss > 0:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW_BENIGN"

    return {
        "step": 3,
        "step_name": "FINANCIAL_RISK_QUANTIFICATION",
        "tool_used": "bank.exposure.lookup",
        "incident_id": scenario.get("incident_id"),
        "direct_exposure_inr": direct_loss,
        "direct_exposure_formatted": f"Rs. {direct_loss:,.2f}",
        "affected_accounts_count": tot_accounts,
        "corporate_accounts_count": corp_count,
        "hni_accounts_count": hni_count,
        "matched_crm_profiles": matched_accounts[:3],
        "rbi_penalty_exposure_inr": rbi_penalty_exposure,
        "rbi_penalty_formatted": f"Rs. {rbi_penalty_exposure:,.2f}",
        "total_financial_blast_radius_inr": direct_loss + rbi_penalty_exposure,
        "total_blast_radius_formatted": f"Rs. {direct_loss + rbi_penalty_exposure:,.2f}",
        "business_risk_level": risk_level,
        "recommendation": "EXECUTE_IMMEDIATE_CONTAINMENT_TO_PROTECT_CORP_PAYROLL_BATCH"
    }
