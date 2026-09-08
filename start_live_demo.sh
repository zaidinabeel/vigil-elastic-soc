#!/bin/bash
# ==============================================================================
# VIGIL: Live Hackathon Demo & Telemetry Stream Launcher
# ==============================================================================

echo "================================================================================"
echo "🛡️  VIGIL: Starting End-to-End Live Environment..."
echo "================================================================================"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# 1. Start Backend in Background
echo "📡 [1/3] Launching FastAPI Backend Server on port 8000..."
python3.11 backend/main.py &
BACKEND_PID=$!
sleep 2

# 2. Start Live Real-World Telemetry Stream Daemon in Background
echo "⚡ [2/3] Launching Continuous BFSI Telemetry & Attack Stream Daemon..."
python3.11 backend/data/live_stream_daemon.py &
DAEMON_PID=$!
sleep 1

# 3. Start Frontend UI
echo "💻 [3/3] Launching React SOC Cockpit on port 5173..."
cd "$DIR/frontend"
npm run dev &
FRONTEND_PID=$!
sleep 2

echo ""
echo "================================================================================"
echo "🎉 ALL SYSTEMS LIVE & STREAMING TO ELASTIC CLOUD!"
echo "--------------------------------------------------------------------------------"
echo "🌐 Local SOC Cockpit : http://localhost:5173"
echo "📡 Backend API Docs  : http://localhost:8000/docs"
echo "📊 Elastic Cloud URL : https://cloud.elastic.co"
echo "================================================================================"
echo "👉 To share with your team over the internet, open a new terminal and run:"
echo "   npx localtunnel --port 5173 --subdomain vigil-soc-bank"
echo "================================================================================"
echo "Press Ctrl+C to stop all services."

# Trap Ctrl+C to kill all background processes
trap "kill $BACKEND_PID $DAEMON_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

wait
