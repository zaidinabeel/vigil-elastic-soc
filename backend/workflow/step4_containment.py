"""
Step 4: Containment Action Drafting & Human-in-the-Loop Gate for VIGIL.
Recommends atomic security actions and waits for analyst 1-click authorization.
"""
from typing import Dict, Any, List
from datetime import datetime

def draft_containment_actions(scenario: Dict[str, Any], exposure_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Drafts containment steps based on compromised identities, network sources, and batch IDs.
    """
    attacker_ip = scenario.get("attacker_ip", "198.51.100.44")
    user = scenario.get("compromised_user", "svc_payment_gw")
    batch_id = scenario.get("batch_id", "BATCH-20260902-8821")
    direct_loss = exposure_data.get("direct_exposure_inr", 0.0)

    inc_id = scenario.get("incident_id", "INC-2026-0902-01")

    if inc_id == "INC-2026-0902-01":
        actions = [
            {
                "action_id": "ACT-01",
                "type": "REVOKE_OAUTH_TOKEN",
                "target": f"OAuth2 Bearer Token for identity: {user}",
                "system": "API Gateway / Auth0",
                "description": f"Instantly invalidate all active sessions and refresh tokens for service account '{user}'.",
                "status": "PENDING_APPROVAL"
            },
            {
                "action_id": "ACT-02",
                "type": "FIREWALL_NULL_ROUTE",
                "target": f"External IPv4 Address: {attacker_ip}",
                "system": "Palo Alto Networks Edge Firewall",
                "description": f"Null-route attacker IP '{attacker_ip}' across all DMZ edge routers to prevent egress.",
                "status": "PENDING_APPROVAL"
            },
            {
                "action_id": "ACT-03",
                "type": "NPCI_BATCH_FREEZE",
                "target": f"UPI Settlement Batch: {batch_id}",
                "system": "NPCI UPI Switch Connector",
                "description": f"Freeze settlement queue for batch '{batch_id}' before inter-bank clearing completes.",
                "status": "PENDING_APPROVAL"
            }
        ]
    elif inc_id == "INC-2026-0902-02":
        actions = [
            {
                "action_id": "ACT-01",
                "type": "WAF_IP_REPUTATION_BLOCK",
                "target": f"Botnet Source IP: {attacker_ip}",
                "system": "Cloudflare / Akamai Edge WAF",
                "description": f"Enforce global geo-IP rate-limit and drop all ingress traffic from Tor exit node '{attacker_ip}'.",
                "status": "PENDING_APPROVAL"
            },
            {
                "action_id": "ACT-02",
                "type": "SESSION_REVOCATION_AND_PWD_RESET",
                "target": "28 Compromised Corporate NetBanking Accounts",
                "system": "NetBanking IAM & SSO",
                "description": "Force immediate password reset and terminate active web sessions for 28 targeted corporate users.",
                "status": "PENDING_APPROVAL"
            },
            {
                "action_id": "ACT-03",
                "type": "IMPS_VELOCITY_FREEZE",
                "target": f"IMPS Outbound Queue: {batch_id}",
                "system": "Core Banking Payment Switch",
                "description": f"Apply high-velocity fraud hold on queue '{batch_id}' to block pending transfers.",
                "status": "PENDING_APPROVAL"
            }
        ]
    elif inc_id == "INC-2026-0902-03":
        actions = [
            {
                "action_id": "ACT-01",
                "type": "NAC_VLAN_ISOLATION",
                "target": f"Rogue Switch Tap: {attacker_ip}",
                "system": "Cisco ISE 802.1X NAC",
                "description": f"Quarantine rogue ATM switch segment '{attacker_ip}' into isolated sinkhole VLAN.",
                "status": "PENDING_APPROVAL"
            },
            {
                "action_id": "ACT-02",
                "type": "ATM_MAC_KEY_ROTATION",
                "target": f"ATM Cluster: {batch_id}",
                "system": "Hardware Security Module (HSM)",
                "description": f"Rotate zone encryption & MAC keys for ATM cluster '{batch_id}' to reject forged ISO 8583 packets.",
                "status": "PENDING_APPROVAL"
            },
            {
                "action_id": "ACT-03",
                "type": "ATM_HARD_AUTHORIZATION_MODE",
                "target": "Regional ATM Switch Cluster 04",
                "system": "Base24 Core Switch",
                "description": "Force stand-in processing off and require 100% synchronous core ledger balance confirmation.",
                "status": "PENDING_APPROVAL"
            }
        ]
    elif inc_id == "INC-2026-0902-04":
        actions = [
            {
                "action_id": "ACT-01",
                "type": "INSIDER_CREDENTIAL_SUSPENSION",
                "target": f"Officer Account: {user}",
                "system": "Active Directory & Finacle CBS",
                "description": f"Instantly revoke branch manager & loan officer approval rights for user '{user}'.",
                "status": "PENDING_APPROVAL"
            },
            {
                "action_id": "ACT-02",
                "type": "LOAN_DISBURSAL_QUEUE_HOLD",
                "target": f"Loan Payout Batch: {batch_id}",
                "system": "CBS Loan Disbursal Engine",
                "description": f"Freeze automated NEFT/RTGS disbursal queue for batch '{batch_id}'.",
                "status": "PENDING_APPROVAL"
            },
            {
                "action_id": "ACT-03",
                "type": "BENEFICIARY_MULE_LIEN",
                "target": "12 Unverified Beneficiary Accounts",
                "system": "Anti-Money Laundering (AML) Core",
                "description": "Place debit lien on 12 identified recipient mule accounts across partner banks.",
                "status": "PENDING_APPROVAL"
            }
        ]
    else: # Scenario 5 (Benign FP)
        actions = [
            {
                "action_id": "ACT-01",
                "type": "MAINTENANCE_CORRELATION_PASS",
                "target": f"Batch: {batch_id}",
                "system": "CBS Batch Scheduler",
                "description": "Correlated high-volume transaction stream with pre-approved month-end interest calculation schedule.",
                "status": "APPROVED"
            },
            {
                "action_id": "ACT-02",
                "type": "AUTO_SUPPRESS_ALERT_ZERO",
                "target": "VIGIL Rule Engine",
                "system": "Elastic Security Detection Engine",
                "description": "Auto-suppressed anomalous volume alert as Benign False Positive. No disruptive containment required.",
                "status": "APPROVED"
            }
        ]

    return {
        "step": 4,
        "step_name": "CONTAINMENT_DRAFTING_AND_HITL_GATE",
        "incident_id": inc_id,
        "containment_status": "APPROVED" if inc_id == "INC-2026-0902-05" else "WAITING_FOR_ANALYST_AUTHORIZATION",
        "proposed_actions": actions,
        "estimated_loss_prevented_inr": direct_loss,
        "estimated_loss_prevented_formatted": f"Rs. {direct_loss:,.2f}",
        "hitl_approval_required": inc_id != "INC-2026-0902-05",
        "gate_message": "Maintenance pre-approved." if inc_id == "INC-2026-0902-05" else "Action authorization required to execute automated network null-routing and token revocation."
    }

def execute_containment_approval(incident_id: str, analyst_id: str = "analyst_nabeel_z") -> Dict[str, Any]:
    """
    Simulates instantaneous execution of containment actions upon human authorization.
    """
    return {
        "incident_id": incident_id,
        "containment_status": "CONTAINMENT_EXECUTED_SUCCESSFULLY",
        "authorized_by": analyst_id,
        "authorization_timestamp": datetime.utcnow().isoformat() + "Z",
        "actions_executed": [
            {"action_id": "ACT-01", "result": "TOKEN_REVOKED_SUCCESSFULLY", "latency_ms": 14},
            {"action_id": "ACT-02", "result": "IP_NULL_ROUTED_IN_FIREWALL", "latency_ms": 28},
            {"action_id": "ACT-03", "result": "UPI_BATCH_SETTLEMENT_FROZEN", "latency_ms": 42}
        ],
        "funds_saved_status": "FUNDS_PRESERVED_BEFORE_SETTLEMENT"
    }
