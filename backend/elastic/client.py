"""
Unified Elastic Client for VIGIL.
Communicates directly with Elastic Cloud or local Elasticsearch clusters using native HTTP/REST.
Includes fallback in-memory ES|QL execution engine for zero-dependency offline development.
"""
import os
import json
import base64
import urllib.request
import urllib.error
import ssl
from typing import Dict, Any, List, Optional
from backend.config import (
    ELASTIC_CLOUD_ID,
    ELASTIC_API_KEY,
    ELASTICSEARCH_URL,
    ELASTICSEARCH_USERNAME,
    ELASTICSEARCH_PASSWORD,
    USE_LIVE_ELASTIC,
    HAS_ELASTIC_CREDS
)

class ElasticClient:
    def __init__(self):
        self.endpoint = None
        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        self.is_live = False
        self._init_connection()

    def _init_connection(self):
        if not USE_LIVE_ELASTIC:
            print("ℹ️ VIGIL ElasticClient: Running in LOCAL / SIMULATED mode (USE_LIVE_ELASTIC=false).")
            return

        # 1. Resolve Cloud ID if provided
        if ELASTIC_CLOUD_ID:
            try:
                # Cloud ID format: name:base64(host:port$es_uuid$kibana_uuid)
                parts = ELASTIC_CLOUD_ID.split(":")
                if len(parts) >= 2:
                    decoded = base64.b64decode(parts[1]).decode("utf-8")
                    host_parts = decoded.split("$")
                    raw_host = host_parts[0]
                    clean_host = raw_host.split(":")[0]
                    port = raw_host.split(":")[1] if ":" in raw_host else "443"
                    es_uuid = host_parts[1] if len(host_parts) > 1 else ""
                    if es_uuid:
                        self.endpoint = f"https://{es_uuid}.{clean_host}:{port}"
                    else:
                        self.endpoint = f"https://{clean_host}:{port}"
                    print(f"🔗 Resolved Elastic Cloud Endpoint: {self.endpoint}")
            except Exception as e:
                print(f"⚠️ Warning: Could not decode ELASTIC_CLOUD_ID ({e}). Falling back to ELASTICSEARCH_URL.")

        # 2. Direct URL fallback (ignore web console URLs)
        if not self.endpoint and ELASTICSEARCH_URL and not "cloud.elastic.co/home" in ELASTICSEARCH_URL:
            self.endpoint = ELASTICSEARCH_URL.rstrip("/")

        # 3. Authentication Header
        if ELASTIC_API_KEY:
            self.headers["Authorization"] = f"ApiKey {ELASTIC_API_KEY}"
        elif ELASTICSEARCH_PASSWORD:
            userpass = f"{ELASTICSEARCH_USERNAME}:{ELASTICSEARCH_PASSWORD}".encode("utf-8")
            b64_auth = base64.b64encode(userpass).decode("utf-8")
            self.headers["Authorization"] = f"Basic {b64_auth}"

        # 4. Test Connectivity
        if self.endpoint:
            try:
                info = self._request("GET", "/")
                if "version" in info:
                    self.is_live = True
                    cluster_name = info.get("cluster_name", "unknown")
                    es_version = info.get("version", {}).get("number", "8.x")
                    print(f"✅ Connected to Elastic Cloud / Cluster: '{cluster_name}' (ES v{es_version}) at {self.endpoint}")
            except Exception as e:
                print(f"⚠️ Could not reach live Elasticsearch endpoint ({e}). Running with local mock engine.")
                self.is_live = False
        else:
            print("ℹ️ No Elastic Cloud credentials provided. Running in high-fidelity local simulator mode.")

    def _request(self, method: str, path: str, payload: Optional[Any] = None) -> Dict[str, Any]:
        if not self.endpoint:
            raise ConnectionError("No live Elasticsearch endpoint configured.")

        url = f"{self.endpoint}{path}"
        data = None
        if payload is not None:
            if isinstance(payload, str):
                data = payload.encode("utf-8")
            else:
                data = json.dumps(payload).encode("utf-8")

        # Disable SSL verification for development/testing if needed
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        req = urllib.request.Request(url, data=data, headers=self.headers, method=method)
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=15) as response:
                res_body = response.read().decode("utf-8")
                return json.loads(res_body) if res_body else {}
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8")
            try:
                err_json = json.loads(err_body)
                raise RuntimeError(f"Elasticsearch API error [{e.code}]: {err_json}")
            except json.JSONDecodeError:
                raise RuntimeError(f"Elasticsearch HTTP {e.code}: {err_body}")

    def ping(self) -> bool:
        """Check cluster connectivity."""
        if not self.is_live:
            return False
        try:
            res = self._request("GET", "/")
            return "version" in res
        except Exception:
            return False

    def cluster_health(self) -> Dict[str, Any]:
        """Fetch cluster health status."""
        if not self.is_live:
            return {"status": "green", "cluster_name": "vigil-local-mock", "number_of_nodes": 1, "mock": True}
        return self._request("GET", "/_cluster/health")

    def put_index_template(self, name: str, template_body: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update an index template."""
        if not self.is_live:
            return {"acknowledged": True, "mock": True}
        return self._request("PUT", f"/_index_template/{name}", template_body)

    def put_component_template(self, name: str, template_body: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update a component template."""
        if not self.is_live:
            return {"acknowledged": True, "mock": True}
        return self._request("PUT", f"/_component_template/{name}", template_body)

    def bulk_index(self, ndjson_body: str) -> Dict[str, Any]:
        """Bulk index documents via NDJSON payload."""
        if not self.is_live:
            return {"items": [], "errors": False, "mock": True}
        headers = dict(self.headers)
        headers["Content-Type"] = "application/x-ndjson"
        
        url = f"{self.endpoint}/_bulk"
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        req = urllib.request.Request(url, data=ndjson_body.encode("utf-8"), headers=headers, method="POST")
        with urllib.request.urlopen(req, context=ctx, timeout=30) as response:
            res_body = response.read().decode("utf-8")
            return json.loads(res_body)

    def execute_esql(self, query: str) -> Dict[str, Any]:
        """
        Execute an ES|QL query against Elastic Cloud.
        Supports POST /_query?format=json (Serverless / 9.x) and POST /_esql?format=json (8.x).
        """
        if not self.is_live:
            from backend.data.mock_bank_db import execute_mock_esql
            return execute_mock_esql(query)

        # 1. Try POST /_query?format=json (Serverless / Modern ES 9.x)
        try:
            return self._request("POST", "/_query?format=json", {"query": query})
        except Exception as e1:
            # 2. Fallback to POST /_esql?format=json (ES 8.x standard)
            try:
                return self._request("POST", "/_esql?format=json", {"query": query})
            except Exception as e2:
                print(f"⚠️ Live ES|QL query failed ({e1} / {e2}). Falling back to local engine.")
                from backend.data.mock_bank_db import execute_mock_esql
                return execute_mock_esql(query)

    def search(self, index: str, query: Dict[str, Any]) -> Dict[str, Any]:
        """Standard Elasticsearch Search API."""
        if not self.is_live:
            return {"hits": {"total": {"value": 0}, "hits": []}, "mock": True}
        return self._request("POST", f"/{index}/_search", query)

# Global client singleton
elastic_client = ElasticClient()
