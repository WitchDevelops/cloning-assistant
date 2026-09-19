from fastapi.testclient import TestClient

from backend.api import app

client = TestClient(app)


def test_cors_allows_the_vite_dev_origin():
    response = client.options(
        "/api/dilution",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
        },
    )
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
