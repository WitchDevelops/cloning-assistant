import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND_DIR = ROOT / "backend"
FRONTEND_DIR = ROOT / "frontend"

backend_server = subprocess.Popen(["uv", "run", "dev"], cwd=BACKEND_DIR)
frontend_server = subprocess.Popen(["npm", "run", "dev"], cwd=FRONTEND_DIR)

try:
    backend_server.wait()
    frontend_server.wait()
except KeyboardInterrupt:
    backend_server.terminate()
    frontend_server.terminate()
    backend_server.wait()
    frontend_server.wait()
