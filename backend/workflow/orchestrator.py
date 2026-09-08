"""
VIGIL 6-Step Agentic Workflow Orchestrator.
Coordinates deterministic investigation steps, custom tool calls, and state transitions.
"""
from typing import Dict, Any, List, Optional
from backend.data.telemetry_generator import SCENARIOS
from backend.workflow.step1_classification import evaluate_materiality
from backend.workflow.step2_evidence import gather_esql_evidence
from backend.workflow.step3_exposure import calculate_business_exposure
from backend.workflow.step4_containment import draft_containment_actions, execute_containment_approval
from backend.workflow.step5_certin_report import draft_certin_report
from backend.workflow.step6_evidence_ledger import append_to_ledger, get_ledger_history

class WorkflowOrchestrator:
    def __init__(self):
        # In-Memory Incident States
        self.incident_states: Dict[str, Dict[str, Any]] = {}
        self._init_scenarios()

    def _init_scenarios(self):
        for s in SCENARIOS:
            inc_id = s["incident_id"]
            self.incident_states[inc_id] = {
                "incident_id": inc_id,
                "scenario": s,
                "current_step": 0,
                "status": "TRIAGED_ALERT_ZERO",
                "step1_materiality": None,
                "step2_evidence": None,
                "step3_exposure": None,
                "step4_containment": None,
                "step5_certin": None,
                "step6_ledger": None
            }

    def list_incidents(self) -> List[Dict[str, Any]]:
        results = []
        for inc_id, state in self.incident_states.items():
            sc = state["scenario"]
            results.append({
                "incident_id": inc_id,
                "title": sc["title"],
                "severity": sc["severity"],
                "threat_tactic": sc["threat_tactic"],
                "direct_exposure_inr": sc["direct_exposure_inr"],
                "is_material": sc["is_material"],
                "rbi_status": sc["rbi_status"],
                "current_step": state["current_step"],
                "status": state["status"]
            })
        return results

    def get_incident(self, incident_id: str) -> Optional[Dict[str, Any]]:
        state = self.incident_states.get(incident_id)
        if not state:
            return None
        return {
            **state,
            "ledger_history": get_ledger_history(incident_id)
        }

    def execute_step(self, incident_id: str, step_num: int) -> Dict[str, Any]:
        state = self.incident_states.get(incident_id)
        if not state:
            raise ValueError(f"Incident '{incident_id}' not found.")
        
        sc = state["scenario"]

        if step_num == 1:
            res = evaluate_materiality(sc)
            state["step1_materiality"] = res
            state["current_step"] = max(state["current_step"], 1)
            state["status"] = "MATERIALITY_EVALUATED"
            append_to_ledger(incident_id, "STEP1_MATERIALITY_CHECK", res)
            return res

        elif step_num == 2:
            res = gather_esql_evidence(sc)
            state["step2_evidence"] = res
            state["current_step"] = max(state["current_step"], 2)
            state["status"] = "EVIDENCE_GATHERED"
            append_to_ledger(incident_id, "STEP2_ESQL_EVIDENCE_GATHERED", res)
            return res

        elif step_num == 3:
            ev = state.get("step2_evidence") or gather_esql_evidence(sc)
            res = calculate_business_exposure(sc, ev)
            state["step3_exposure"] = res
            state["current_step"] = max(state["current_step"], 3)
            state["status"] = "EXPOSURE_SCORED"
            append_to_ledger(incident_id, "STEP3_FINANCIAL_EXPOSURE_SCORED", res)
            return res

        elif step_num == 4:
            exp = state.get("step3_exposure") or calculate_business_exposure(sc, {})
            res = draft_containment_actions(sc, exp)
            state["step4_containment"] = res
            state["current_step"] = max(state["current_step"], 4)
            state["status"] = "WAITING_FOR_HITL_APPROVAL"
            append_to_ledger(incident_id, "STEP4_CONTAINMENT_PROPOSED", res)
            return res

        elif step_num == 5:
            mat = state.get("step1_materiality") or evaluate_materiality(sc)
            ev = state.get("step2_evidence") or gather_esql_evidence(sc)
            exp = state.get("step3_exposure") or calculate_business_exposure(sc, ev)
            cont = state.get("step4_containment") or draft_containment_actions(sc, exp)
            res = draft_certin_report(sc, mat, ev, exp, cont)
            state["step5_certin"] = res
            state["current_step"] = max(state["current_step"], 5)
            state["status"] = "CERT_IN_REPORT_DRAFTED"
            append_to_ledger(incident_id, "STEP5_CERT_IN_REPORT_GENERATED", res)
            return res

        elif step_num == 6:
            ledger_entries = get_ledger_history(incident_id)
            res = {
                "step": 6,
                "step_name": "EVIDENCE_LEDGER_SEALED",
                "incident_id": incident_id,
                "total_sealed_blocks": len(ledger_entries),
                "latest_hash": ledger_entries[-1]["current_hash"] if ledger_entries else "N/A",
                "audit_status": "SEALED_IMMUTABLE_WORM",
                "defensibility_badge": "100%_RBI_AUDIT_DEFENSIBLE"
            }
            state["step6_ledger"] = res
            state["current_step"] = max(state["current_step"], 6)
            state["status"] = "INCIDENT_RESOLVED_AND_SEALED"
            append_to_ledger(incident_id, "STEP6_FINAL_SEAL", res)
            return res

        else:
            raise ValueError(f"Invalid step number: {step_num}")

    def execute_all_steps(self, incident_id: str) -> Dict[str, Any]:
        """Runs Steps 1 through 6 sequentially."""
        for step in range(1, 7):
            self.execute_step(incident_id, step)
        return self.get_incident(incident_id)

    def approve_containment(self, incident_id: str, analyst_id: str = "analyst_nabeel_z") -> Dict[str, Any]:
        state = self.incident_states.get(incident_id)
        if not state:
            raise ValueError(f"Incident '{incident_id}' not found.")
        
        approval_res = execute_containment_approval(incident_id, analyst_id)
        if state.get("step4_containment"):
            state["step4_containment"]["containment_status"] = "APPROVED_AND_EXECUTED"
            state["step4_containment"]["approval_meta"] = approval_res
        
        append_to_ledger(incident_id, "CONTAINMENT_APPROVED_BY_HUMAN", approval_res, analyst_id=analyst_id)
        return approval_res

orchestrator = WorkflowOrchestrator()
