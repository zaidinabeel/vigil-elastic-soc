"""
VIGIL Backend API Service.
Built with FastAPI to orchestrate the 6-step agentic investigation workflow,
live ES|QL querying against Elastic Cloud, Sarvam AI Indic translations, and CERT-In PDF generation.
"""
import sys
import os
import json
from pathlib import Path
from typing import Dict, Any, Optional

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

try:
    from fastapi import FastAPI, HTTPException, Response, Request
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False

from backend.config import SERVER_HOST, SERVER_PORT
from backend.elastic.client import elastic_client
from backend.workflow.orchestrator import orchestrator
from backend.workflow.step6_evidence_ledger import verify_ledger_integrity
from backend.services.sarvam_translator import translate_incident_brief
from backend.services.pdf_generator import generate_certin_pdf

# Initialize FastAPI App
if HAS_FASTAPI:
    app = FastAPI(
        title="VIGIL — AI Tier-1 SOC Analyst for Banks",
        description="Autonomous, explainable, and regulator-aligned incident response for Indian BFSI.",
        version="1.0.0"
    )

    # Enable CORS for React Frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    class ContainmentApprovalRequest(BaseModel):
        incident_id: str
        analyst_id: Optional[str] = "analyst_nabeel_z"
        decision: Optional[str] = "APPROVE"

    class EsqlQueryRequest(BaseModel):
        query: str

    class TranslationRequest(BaseModel):
        text: str
        target_lang: str = "hi"

    @app.get("/")
    def root():
        cluster_health = elastic_client.cluster_health()
        return {
            "status": "ONLINE",
            "service": "VIGIL AI Tier-1 SOC Backend",
            "version": "1.0.0",
            "elastic_cluster": cluster_health.get("cluster_name", "342d4ae4b3c34f17b141a42be3274185"),
            "elastic_connected": not cluster_health.get("mock", False),
            "region": "ap-south-1 (Mumbai)",
            "docs": "/docs",
            "endpoints": {
                "health": "/api/health",
                "incidents": "/api/incidents",
                "esql_execute": "/api/esql/execute",
                "certin_pdf": "/api/reports/certin/{incident_id}/pdf"
            }
        }

    @app.get("/api/health")
    def health_check():
        cluster_health = elastic_client.cluster_health()
        return {
            "status": "HEALTHY",
            "service": "VIGIL AI Tier-1 SOC Backend",
            "elastic_cluster": cluster_health.get("cluster_name", "local-simulator"),
            "elastic_status": cluster_health.get("status", "green"),
            "is_live_elastic": not cluster_health.get("mock", False)
        }

    @app.get("/api/incidents")
    def list_incidents():
        return orchestrator.list_incidents()

    @app.get("/api/incidents/{incident_id}")
    def get_incident_detail(incident_id: str):
        inc = orchestrator.get_incident(incident_id)
        if not inc:
            raise HTTPException(status_code=404, detail="Incident not found.")
        return inc

    @app.post("/api/incidents/{incident_id}/step/{step_num}")
    def run_workflow_step(incident_id: str, step_num: int):
        try:
            return orchestrator.execute_step(incident_id, step_num)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @app.post("/api/incidents/{incident_id}/execute-all")
    def run_all_steps(incident_id: str):
        try:
            return orchestrator.execute_all_steps(incident_id)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @app.post("/api/hitl/approve")
    def approve_containment(req: ContainmentApprovalRequest):
        try:
            return orchestrator.approve_containment(req.incident_id, req.analyst_id)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @app.post("/api/esql/execute")
    def execute_custom_esql(req: EsqlQueryRequest):
        return elastic_client.execute_esql(req.query)

    @app.post("/api/translate/indic")
    def translate_brief(req: TranslationRequest):
        return translate_incident_brief(req.text, req.target_lang)

    @app.get("/api/reports/certin/{incident_id}/pdf")
    def download_certin_pdf(incident_id: str):
        inc = orchestrator.get_incident(incident_id)
        if not inc:
            raise HTTPException(status_code=404, detail="Incident not found.")
        pdf_bytes = generate_certin_pdf(inc)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=CERT_IN_{incident_id}.pdf"}
        )

    @app.get("/api/ledger/verify")
    def check_ledger():
        return verify_ledger_integrity()

    @app.post("/api/telemetry/inject-pulse")
    def inject_pulse_now():
        from backend.data.live_stream_daemon import generate_attack_pulse
        attack_docs, attack_name = generate_attack_pulse()
        lines = []
        for d in attack_docs:
            idx = d.pop("_index", "logs-banking-default")
            lines.append(json.dumps({"index": {"_index": idx}}))
            lines.append(json.dumps(d))
        ndjson_body = "\n".join(lines) + "\n"
        res = elastic_client.bulk_index(ndjson_body)
        return {
            "status": "ATTACK_PULSE_INJECTED",
            "campaign": attack_name,
            "events_count": len(attack_docs),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

    # Background Live Telemetry Streamer on Render
    import threading
    import time
    from datetime import datetime

    def _background_telemetry_loop():
        time.sleep(5) # Allow server to bind port first
        iteration = 0
        render_url = os.getenv("RENDER_EXTERNAL_URL", "https://vigil-backend-k511.onrender.com")
        
        while True:
            iteration += 1
            try:
                from backend.data.live_stream_daemon import generate_noise_batch, generate_attack_pulse
                import random
                import urllib.request
                
                batch = generate_noise_batch(batch_size=random.randint(8, 16))
                
                # 20% probability of periodic attack pulse
                if random.random() < 0.20:
                    attack_docs, _ = generate_attack_pulse()
                    batch.extend(attack_docs)
                    
                lines = []
                for d in batch:
                    idx = d.pop("_index", "logs-banking-default")
                    lines.append(json.dumps({"index": {"_index": idx}}))
                    lines.append(json.dumps(d))
                ndjson_body = "\n".join(lines) + "\n"
                elastic_client.bulk_index(ndjson_body)

                # Keep-Alive Self Ping every 50 iterations (~5 mins) to prevent Render from sleeping
                if iteration % 50 == 0 and render_url:
                    try:
                        req = urllib.request.Request(f"{render_url}/api/health", headers={"User-Agent": "VigilKeepAlive/1.0"})
                        with urllib.request.urlopen(req, timeout=5) as res:
                            pass
                    except Exception:
                        pass

            except Exception:
                pass
            time.sleep(6)

    @app.on_event("startup")
    def on_startup():
        worker = threading.Thread(target=_background_telemetry_loop, daemon=True)
        worker.start()

else:
    # Minimal HTTP Server fallback using standard library
    import http.server
    import socketserver
    
    class VigilHTTPHandler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            if self.path == "/api/incidents":
                self.wfile.write(json.dumps(orchestrator.list_incidents()).encode())
            else:
                self.wfile.write(json.dumps({"status": "VIGIL_OK"}).encode())

    app = None

def start_server():
    print("================================================================================")
    print(f"🛡️  Starting VIGIL Backend API Server on {SERVER_HOST}:{SERVER_PORT}")
    print(f"📡 Swagger API Docs: http://localhost:{SERVER_PORT}/docs")
    print("================================================================================")
    if HAS_FASTAPI:
        import uvicorn
        uvicorn.run(app, host=SERVER_HOST, port=SERVER_PORT)
    else:
        with socketserver.TCPServer((SERVER_HOST, SERVER_PORT), VigilHTTPHandler) as httpd:
            httpd.serve_forever()

if __name__ == "__main__":
    start_server()
