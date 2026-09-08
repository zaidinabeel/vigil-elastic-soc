"""
ECS v8.11+ Schema Mappings and BFSI Extensions for VIGIL.
Defines component templates and index templates for:
- logs-banking-* (UPI, IMPS, NetBanking, Core Banking)
- logs-auth-* (Authentication, Kerberos, Okta, Active Directory)
- logs-network-* (Firewall, WAF, NetFlow)
- logs-threat-* (CERT-In CIAD Threat Intel Feeds)
"""
from typing import Dict, Any

# Component Template: Standard ECS Base Fields
ECS_BASE_MAPPINGS: Dict[str, Any] = {
    "template": {
        "mappings": {
            "properties": {
                "@timestamp": {"type": "date"},
                "event": {
                    "properties": {
                        "category": {"type": "keyword"},
                        "type": {"type": "keyword"},
                        "outcome": {"type": "keyword"},
                        "action": {"type": "keyword"},
                        "severity": {"type": "long"},
                        "risk_score": {"type": "float"}
                    }
                },
                "source": {
                    "properties": {
                        "ip": {"type": "ip"},
                        "port": {"type": "long"},
                        "geo": {
                            "properties": {
                                "country_name": {"type": "keyword"},
                                "city_name": {"type": "keyword"}
                            }
                        }
                    }
                },
                "destination": {
                    "properties": {
                        "ip": {"type": "ip"},
                        "port": {"type": "long"},
                        "domain": {"type": "keyword"}
                    }
                },
                "host": {
                    "properties": {
                        "name": {"type": "keyword"},
                        "hostname": {"type": "keyword"},
                        "ip": {"type": "ip"},
                        "os": {
                            "properties": {
                                "name": {"type": "keyword"}
                            }
                        }
                    }
                },
                "user": {
                    "properties": {
                        "name": {"type": "keyword"},
                        "roles": {"type": "keyword"},
                        "domain": {"type": "keyword"},
                        "id": {"type": "keyword"}
                    }
                },
                "threat": {
                    "properties": {
                        "tactic": {
                            "properties": {
                                "name": {"type": "keyword"},
                                "id": {"type": "keyword"}
                            }
                        },
                        "technique": {
                            "properties": {
                                "name": {"type": "keyword"},
                                "id": {"type": "keyword"}
                            }
                        },
                        "indicator": {
                            "properties": {
                                "ip": {"type": "ip"},
                                "type": {"type": "keyword"}
                            }
                        }
                    }
                }
            }
        }
    }
}

# Component Template: Custom BFSI Banking Extensions
BANKING_ECS_MAPPINGS: Dict[str, Any] = {
    "template": {
        "mappings": {
            "properties": {
                "bank": {
                    "properties": {
                        "account_id": {"type": "keyword"},
                        "customer_tier": {"type": "keyword"},       # Corporate, HNI, Retail
                        "upi_vpa": {"type": "keyword"},            # e.g., merchant.bulk@yesbank
                        "beneficiary_vpa": {"type": "keyword"},    # e.g., rogue.payout@paytm
                        "channel": {"type": "keyword"},            # UPI_GATEWAY, NETBANKING, IMPS, ATM_SWITCH, CORE_API
                        "amount_inr": {"type": "scaled_float", "scaling_factor": 100},
                        "currency": {"type": "keyword"},
                        "batch_id": {"type": "keyword"},           # e.g., BATCH-20260902-8821
                        "terminal_id": {"type": "keyword"},       # ATM terminal identifier
                        "aml_risk_score": {"type": "float"},       # 0.0 to 100.0
                        "kyc_verified": {"type": "boolean"},
                        "iso_8583_response_code": {"type": "keyword"} # '00' Approved, '51' Insufficient Funds
                    }
                }
            }
        }
    }
}

# Index Template for Banking Logs
BANKING_INDEX_TEMPLATE: Dict[str, Any] = {
    "index_patterns": ["logs-banking-*"],
    "template": {
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0,
            "index.lifecycle.name": "logs-default-policy"
        }
    },
    "composed_of": ["vigil-ecs-base", "vigil-banking-extension"],
    "priority": 500
}

# Index Template for Auth Logs
AUTH_INDEX_TEMPLATE: Dict[str, Any] = {
    "index_patterns": ["logs-auth-*"],
    "template": {
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0
        }
    },
    "composed_of": ["vigil-ecs-base"],
    "priority": 500
}

# Index Template for Network / WAF Logs
NETWORK_INDEX_TEMPLATE: Dict[str, Any] = {
    "index_patterns": ["logs-network-*"],
    "template": {
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0
        }
    },
    "composed_of": ["vigil-ecs-base"],
    "priority": 500
}
