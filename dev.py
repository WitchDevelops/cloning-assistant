import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND_DIR = ROOT / "backend"
FRONTEND_DIR = ROOT / "frontend"

dev_servers = []

try:
    backend_server = subprocess.Popen(["uv", "run", "dev"], cwd=BACKEND_DIR)
    dev_servers.append(backend_server)
    frontend_server = subprocess.Popen(["npm", "run", "dev"], cwd=FRONTEND_DIR)
    dev_servers.append(frontend_server)

    while True:
        for server in dev_servers:
            status = server.poll()
            if status is not None:
                for other in dev_servers:
                    other.terminate()
                    other.wait()
                sys.exit(status)
        time.sleep(1)

except KeyboardInterrupt:
    # terminate both, then wait on both
    for server in dev_servers:
        server.terminate()
    for server in dev_servers:
        server.wait()

except OSError:
    for server in dev_servers:
        server.terminate()
    for server in dev_servers:
        server.wait()
    raise
