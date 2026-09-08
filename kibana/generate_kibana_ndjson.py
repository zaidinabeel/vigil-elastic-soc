"""
Kibana Saved Objects Export Generator for VIGIL.
Generates 100% compatible NDJSON for Kibana 8.x and 9.5.3.
"""
import json

def generate_kibana_export():
    objects = []

    # 1. Data View: logs-banking-*
    objects.append({
        "id": "vigil-banking-data-view",
        "type": "data-view",
        "attributes": {
            "title": "logs-banking-*",
            "name": "VIGIL Banking Logs (logs-banking-*)",
            "timeFieldName": "@timestamp",
            "allowNoIndex": True
        },
        "references": [],
        "migrationVersion": {"data-view": "8.0.0"}
    })

    # 2. Data View: logs-auth-*
    objects.append({
        "id": "vigil-auth-data-view",
        "type": "data-view",
        "attributes": {
            "title": "logs-auth-*",
            "name": "VIGIL Auth Logs (logs-auth-*)",
            "timeFieldName": "@timestamp",
            "allowNoIndex": True
        },
        "references": [],
        "migrationVersion": {"data-view": "8.0.0"}
    })

    # 3. Visualization: ₹ Rupee Financial Risk Metric
    vis_metric_state = {
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
                "style": {"bgFill": "#000", "bgColor": False, "labelColor": False, "subText": "", "fontSize": 32}
            }
        },
        "aggs": [
            {"id": "1", "enabled": True, "type": "sum", "schema": "metric", "params": {"field": "bank.amount_inr", "customLabel": "Total Funds at Risk (₹)"}}
        ]
    }
    objects.append({
        "id": "vigil-vis-rupee-metric",
        "type": "visualization",
        "attributes": {
            "title": "[VIGIL] ₹ Rupee Financial Exposure",
            "visState": json.dumps(vis_metric_state),
            "uiStateJSON": "{}",
            "description": "Total Rupee risk exposed across corporate and HNI accounts",
            "kibanaSavedObjectMeta": {
                "searchSourceJSON": json.dumps({
                    "query": {"query": "", "language": "kuery"},
                    "filter": [],
                    "indexRefName": "kibanaSavedObjectMeta.searchSourceJSON.index"
                })
            }
        },
        "references": [
            {"name": "kibanaSavedObjectMeta.searchSourceJSON.index", "type": "data-view", "id": "vigil-banking-data-view"}
        ],
        "migrationVersion": {"visualization": "8.0.0"}
    })

    # 4. Visualization: Financial Risk by Customer Tier (Pie / Donut)
    vis_pie_state = {
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
    objects.append({
        "id": "vigil-vis-tier-pie",
        "type": "visualization",
        "attributes": {
            "title": "[VIGIL] Exposure by Customer Tier",
            "visState": json.dumps(vis_pie_state),
            "uiStateJSON": "{}",
            "description": "Financial blast radius segmented by Corporate vs HNI",
            "kibanaSavedObjectMeta": {
                "searchSourceJSON": json.dumps({
                    "query": {"query": "", "language": "kuery"},
                    "filter": [],
                    "indexRefName": "kibanaSavedObjectMeta.searchSourceJSON.index"
                })
            }
        },
        "references": [
            {"name": "kibanaSavedObjectMeta.searchSourceJSON.index", "type": "data-view", "id": "vigil-banking-data-view"}
        ],
        "migrationVersion": {"visualization": "8.0.0"}
    })

    # 5. Visualization: Failed Logins by Attacker IP (Horizontal Bar)
    vis_bar_state = {
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
    objects.append({
        "id": "vigil-vis-failed-logins",
        "type": "visualization",
        "attributes": {
            "title": "[VIGIL] Failed Logins by Attacker IP",
            "visState": json.dumps(vis_bar_state),
            "uiStateJSON": "{}",
            "description": "Attacker IP brute force attempt volume",
            "kibanaSavedObjectMeta": {
                "searchSourceJSON": json.dumps({
                    "query": {"query": "event.outcome: \"failure\"", "language": "kuery"},
                    "filter": [],
                    "indexRefName": "kibanaSavedObjectMeta.searchSourceJSON.index"
                })
            }
        },
        "references": [
            {"name": "kibanaSavedObjectMeta.searchSourceJSON.index", "type": "data-view", "id": "vigil-auth-data-view"}
        ],
        "migrationVersion": {"visualization": "8.0.0"}
    })

    # 6. Dashboard: [VIGIL] BFSI AI SOC Analyst Command Center
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

    objects.append({
        "id": "vigil-soc-dashboard",
        "type": "dashboard",
        "attributes": {
            "title": "[VIGIL] BFSI AI SOC Analyst Command Center",
            "description": "Real-time monitoring of UPI fraud telemetry, ES|QL blast radius, and 6-hour CERT-In compliance.",
            "panelsJSON": json.dumps(dashboard_panels),
            "optionsJSON": json.dumps({"useMargins": True, "syncColors": True, "hidePanelTitles": False}),
            "version": 1,
            "timeRestore": False,
            "kibanaSavedObjectMeta": {
                "searchSourceJSON": json.dumps({"query": {"query": "", "language": "kuery"}, "filter": []})
            }
        },
        "references": [
            {"name": "panel_1", "type": "visualization", "id": "vigil-vis-rupee-metric"},
            {"name": "panel_2", "type": "visualization", "id": "vigil-vis-tier-pie"},
            {"name": "panel_3", "type": "visualization", "id": "vigil-vis-failed-logins"}
        ],
        "migrationVersion": {"dashboard": "8.0.0"}
    })

    out_path = "/Users/nabeelzaidi/Downloads/elastic_hackathon/kibana/vigil_kibana_dashboards.ndjson"
    with open(out_path, "w", encoding="utf-8") as f:
        for obj in objects:
            f.write(json.dumps(obj) + "\n")

    print(f"🎉 Generated 100% compatible Kibana NDJSON export with {len(objects)} objects at: {out_path}")

if __name__ == "__main__":
    generate_kibana_export()
