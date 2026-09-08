"""
Configuration loader for VIGIL Backend.
Supports direct .env file loading without requiring external dependencies.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

def load_env_file():
    env_path = BASE_DIR / ".env"
    if not env_path.exists():
        env_path = BASE_DIR / ".env.example"
        
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip("'\"")
                    if key not in os.environ and val:
                        os.environ[key] = val

load_env_file()

# Elastic Settings
ELASTIC_CLOUD_ID = os.getenv("ELASTIC_CLOUD_ID", "").strip()
ELASTIC_API_KEY = os.getenv("ELASTIC_API_KEY", "").strip()
ELASTICSEARCH_URL = os.getenv("ELASTICSEARCH_URL", "").strip()
ELASTICSEARCH_USERNAME = os.getenv("ELASTICSEARCH_USERNAME", "elastic").strip()
ELASTICSEARCH_PASSWORD = os.getenv("ELASTICSEARCH_PASSWORD", "").strip()
USE_LIVE_ELASTIC = os.getenv("USE_LIVE_ELASTIC", "true").lower() in ("true", "1", "yes")

# Check if real elastic credentials are present
HAS_ELASTIC_CREDS = bool((ELASTIC_CLOUD_ID or ELASTICSEARCH_URL) and (ELASTIC_API_KEY or ELASTICSEARCH_PASSWORD))

# AWS Bedrock Settings
AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "")
BEDROCK_MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-5-sonnet-20241022-v2:0")
USE_LIVE_BEDROCK = os.getenv("USE_LIVE_BEDROCK", "false").lower() in ("true", "1", "yes")

# Sarvam AI Settings
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")
USE_LIVE_SARVAM = os.getenv("USE_LIVE_SARVAM", "false").lower() in ("true", "1", "yes")

# Server & KMS Settings
SERVER_HOST = os.getenv("SERVER_HOST", "0.0.0.0")
SERVER_PORT = int(os.getenv("SERVER_PORT", "8000"))
KMS_KEY_ARN = os.getenv("KMS_KEY_ARN", "arn:aws:kms:ap-south-1:123456789012:key/vigil-ledger-sign-key")
