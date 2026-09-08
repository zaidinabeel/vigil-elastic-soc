"""
Direct Kibana Saved Objects Synchronizer for VIGIL.
Pushes visualizations and dashboards directly into your live Kibana instance via the Kibana REST API.
"""
import urllib.request
import urllib.error
import ssl
import json

def sync_kibana_dashboard():
    kibana_url = "https://2e98630873f0435f88a6b02c6587a8ed.ap-south-1.aws.elastic-cloud.com:443"
    api_key = "c1BZSWdhQUJ4QzNiRW9QZlh6a0Q6MWZvWjItZ1kxeHlCMElyWTVmY3BUUQ=="
    
    headers = {
        "Authorization": f"ApiKey {api_key}",
        "Content-Type": "application/json",
        "kbn-xsrf": "true"
    }
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    def put_saved_object(obj_type, obj_id, attributes, references=None):
        payload = {
            "attributes": attributes,
            "references": references or []
        }
        url = f"{kibana_url}/api/saved_objects/{obj_type}/{obj_id}?overwrite=true"
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=15) as res:
                res_data = json.loads(res.read().decode("utf-8"))
                print(f"✅ Created/Updated {obj_type}: '{attributes.get('title', obj_id)}'")
                return res_data
        except urllib.error.HTTPError as e:
            err = e.read().decode("utf-8")
            print(f"❌ Error creating {obj_type} {obj_id}: {err}")

    print("================================================================================")
    print("🚀 Synchronizing VIGIL Visualizations & Dashboards to Kibana...")
    print("================================================================================")

    # 1. Ensure Data Views Exist with exact IDs
    put_saved_object("index-pattern", "vigil-banking-dataview", {
        "title": "logs-banking-*",
        "name": "VIGIL Banking Logs (logs-banking-*)",
        "timeFieldName": "@timestamp"
    })

    put_saved_object("index-pattern", "vigil-auth-dataview", {
        "title": "logs-auth-*",
        "name": "VIGIL Auth Logs (logs-auth-*)",
        "timeFieldName": "@timestamp"
    })

    # 2. Metric Visualization: Total Rupee Exposure
    metric_vis_state = {
        "title": "[VIGIL] ₹ Rupee Financial Exposure",
        "type": "metric",
        "params": {
            "metric": {
                "percentageMode": False,
                "useRanges": False,
                "colorSchema": "Green to Red",
                "metricColorMode": "None",
                "colorsRange": [{"from": 0, "to": 10000000}],
                "labels": {"show": True},
                "style": {"bgFill": "#000", "bgColor": False, "labelColor": False, "subText": "Total Funds at Risk across Corporate & HNI Accounts", "fontSize": 32}
            }
        },
        "aggs": [
            {"id": "1", "enabled": True, "type": "sum", "schema": "metric", "params": {"field": "bank.amount_inr", "customLabel": "Total Rupee Risk (₹)"}}
        ]
    }
    put_saved_object("visualization", "vigil-vis-rupee-metric", {
        "title": "[VIGIL] ₹ Rupee Financial Exposure",
        "visState": json.dumps(metric_vis_state),
        "uiStateJSON": "{}",
        "description": "Total Rupee risk exposed across corporate and HNI accounts",
        "kibanaSavedObjectMeta": {
            "searchSourceJSON": json.dumps({
                "query": {"query": "", "language": "kuery"},
                "filter": [],
                "indexRefName": "kibanaSavedObjectMeta.searchSourceJSON.index"
            })
        }
    }, references=[
        {"name": "kibanaSavedObjectMeta.searchSourceJSON.index", "type": "index-pattern", "id": "vigil-banking-dataview"}
    ])

    # 3. Pie Visualization: Exposure by Customer Tier
    pie_vis_state = {
        "title": "[VIGIL] Exposure by Customer Tier",
        "type": "pie",
        "params": {
            "type": "pie",
            "addTooltip": True,
            "addLegend": True,
            "legendPosition": "right",
            "isDonut": True
        },
        "aggs": [
            {"id": "1", "enabled": True, "type": "sum", "schema": "metric", "params": {"field": "bank.amount_inr", "customLabel": "Exposure (₹)"}},
            {"id": "2", "enabled": True, "type": "terms", "schema": "segment", "params": {"field": "bank.customer_tier", "size": 5, "order": "desc", "orderBy": "1", "customLabel": "Customer Tier"}}
        ]
    }
    put_saved_object("visualization", "vigil-vis-tier-pie", {
        "title": "[VIGIL] Exposure by Customer Tier",
        "visState": json.dumps(pie_vis_state),
        "uiStateJSON": "{}",
        "description": "Financial blast radius segmented by Corporate vs HNI",
        "kibanaSavedObjectMeta": {
            "searchSourceJSON": json.dumps({
                "query": {"query": "", "language": "kuery"},
                "filter": [],
                "indexRefName": "kibanaSavedObjectMeta.searchSourceJSON.index"
            })
        }
    }, references=[
        {"name": "kibanaSavedObjectMeta.searchSourceJSON.index", "type": "index-pattern", "id": "vigil-banking-dataview"}
    ])

    # 4. Bar Visualization: Failed Logins by Attacker IP
    bar_vis_state = {
        "title": "[VIGIL] Failed Logins by Attacker IP",
        "type": "horizontal_bar",
        "params": {
            "type": "histogram",
            "grid": {"categoryLines": False},
            "categoryAxes": [{"id": "CategoryAxis-1", "type": "category", "position": "left", "show": True, "style": {}, "scale": {"type": "linear"}, "labels": {"show": True, "truncate": 100}, "title": {}}],
            "valueAxes": [{"id": "ValueAxis-1", "name": "LeftAxis-1", "type": "value", "position": "bottom", "show": True, "style": {}, "scale": {"type": "linear"}, "labels": {"show": True, "rotate": 0, "filter": False, "truncate": 100}, "title": {"text": "Failed Attempts"}}],
            "seriesParams": [{"show": True, "type": "histogram", "mode": "normal", "data": {"label": "Failed Logins", "id": "1"}, "valueAxis": "ValueAxis-1", "drawLinesBetweenPoints": True, "showCircles": True}],
            "addTooltip": True,
            "addLegend": True,
            "legendPosition": "right"
        },
        "aggs": [
            {"id": "1", "enabled": True, "type": "count", "schema": "metric", "params": {"customLabel": "Failed Logins"}},
            {"id": "2", "enabled": True, "type": "terms", "schema": "segment", "params": {"field": "source.ip", "size": 10, "order": "desc", "orderBy": "1", "customLabel": "Attacker Source IP"}}
        ]
    }
    put_saved_object("visualization", "vigil-vis-failed-logins", {
        "title": "[VIGIL] Failed Logins by Attacker IP",
        "visState": json.dumps(bar_vis_state),
        "uiStateJSON": "{}",
        "description": "Attacker IP brute force attempt volume",
        "kibanaSavedObjectMeta": {
            "searchSourceJSON": json.dumps({
                "query": {"query": "event.outcome: \"failure\"", "language": "kuery"},
                "filter": [],
                "indexRefName": "kibanaSavedObjectMeta.searchSourceJSON.index"
            })
        }
    }, references=[
        {"name": "kibanaSavedObjectMeta.searchSourceJSON.index", "type": "index-pattern", "id": "vigil-auth-dataview"}
    ])

    # 5. Dashboard: [VIGIL] BFSI AI SOC Analyst Command Center
    dashboard_panels = [
        {
            "version": "8.0.0",
            "type": "visualization",
            "gridData": {"x": 0, "y": 0, "w": 24, "h": 12, "i": "1"},
            "panelIndex": "1",
            "embeddableConfig": {},
            "panelRefName": "panel_1"
        },
        {
            "version": "8.0.0",
            "type": "visualization",
            "gridData": {"x": 24, "y": 0, "w": 24, "h": 12, "i": "2"},
            "panelIndex": "2",
            "embeddableConfig": {},
            "panelRefName": "panel_2"
        },
        {
            "version": "8.0.0",
            "type": "visualization",
            "gridData": {"x": 0, "y": 12, "w": 48, "h": 14, "i": "3"},
            "panelIndex": "3",
            "embeddableConfig": {},
            "panelRefName": "panel_3"
        }
    ]

    put_saved_object("dashboard", "vigil-soc-dashboard", {
        "title": "[VIGIL] BFSI AI SOC Analyst Command Center",
        "description": "Real-time monitoring of UPI fraud telemetry, ES|QL blast radius, and 6-hour CERT-In compliance.",
        "panelsJSON": json.dumps(dashboard_panels),
        "optionsJSON": json.dumps({"useMargins": True, "syncColors": True, "hidePanelTitles": False}),
        "version": 1,
        "timeRestore": False,
        "kibanaSavedObjectMeta": {
            "searchSourceJSON": json.dumps({"query": {"query": "", "language": "kuery"}, "filter": []})
        }
    }, references=[
        {"name": "panel_1", "type": "visualization", "id": "vigil-vis-rupee-metric"},
        {"name": "panel_2", "type": "visualization", "id": "vigil-vis-tier-pie"},
        {"name": "panel_3", "type": "visualization", "id": "vigil-vis-failed-logins"}
    ])

    print("================================================================================")
    print("🎉 All Kibana Visualizations & Dashboards Synced Successfully!")
    print("👉 Simply refresh your Kibana Dashboard tab in your browser!")
    print("================================================================================")

if __name__ == "__main__":
    sync_kibana_dashboard()
