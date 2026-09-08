"""
Step 1: Incident Classification & RBI Materiality Evaluator for VIGIL.
Evaluates Attack Discovery narrative against RBI Master Directions & CERT-In 2022 Guidelines.
"""
from typing import Dict, Any

RBI_MATERIALITY_THRESHOLDS = {
    "min_financial_loss_inr": 500000.0,       # Rs. 5 Lakhs
    "max_acceptable_downtime_mins": 15,       # 15 minutes outage on UPI/IMPS
    "min_compromised_customer_records": 100   # 100 PII records
}

def evaluate_materiality(scenario: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates regulatory materiality under RBI Master Direction on Digital Payment Security Controls
    and CERT-In Directions 2022.
    """
    direct_loss = scenario.get("direct_exposure_inr", 0.0)
    severity = scenario.get("severity", "MEDIUM")
    is_critical_payment = scenario.get("threat_tactic", "").lower() in ["privilege escalation / financial exfiltration", "man-in-the-middle / data manipulation"]
    
    # Materiality Rules
    is_material = False
    reasons = []

    if direct_loss >= RBI_MATERIALITY_THRESHOLDS["min_financial_loss_inr"]:
        is_material = True
        reasons.append(f"Direct financial risk of Rs. {direct_loss:,.2f} exceeds RBI materiality threshold of Rs. 5,00,000.00.")

    if severity in ["CRITICAL", "HIGH"]:
        is_material = True
        reasons.append(f"Incident severity is classified as {severity} with active threat tactic: {scenario.get('threat_tactic')}.")

    if is_critical_payment:
        is_material = True
        reasons.append("Core payment infrastructure (UPI/IMPS/Switch) compromised with active funds diversion risk.")

    return {
        "step": 1,
        "step_name": "MATERIALITY_AND_CLASSIFICATION",
        "incident_id": scenario.get("incident_id"),
        "is_material": is_material,
        "classification_status": "MATERIAL_INCIDENT_CONFIRMED" if is_material else "NON_MATERIAL_OR_BENIGN",
        "regulatory_reporting_window_hours": 6,
        "rbi_directive_ref": "RBI/2021-22/Master-Direction-Payment-Security-Controls-Sec-4.2",
        "certin_category": "CIAD-2022-04 Unauthorized Access / Financial Fraud",
        "mitre_tactic": scenario.get("threat_tactic"),
        "mitre_technique_id": scenario.get("mitre_id"),
        "materiality_reasons": reasons,
        "action_required": "PROCEED_TO_GATHER_ESQL_EVIDENCE" if is_material else "AUTO_SUPPRESS_OR_MONITOR"
    }
