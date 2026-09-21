import pytest
from fastapi.testclient import TestClient

from backend.api import app

client = TestClient(app)


def test_dilution_returns_expected_volumes():
    response = client.post(
        "/api/dilution",
        json={
            "stockConc": {"value": 100, "unit": "mM"},
            "finalConc": {"value": 20, "unit": "mM"},
            "finalVolume": {"value": 50, "unit": "µL"},
        },
    )
    assert response.status_code == 200
    assert response.json() == {"stock": 10, "diluent": 40}


def test_dilution_handles_non_round_numbers():
    response = client.post(
        "/api/dilution",
        json={
            "stockConc": {"value": 666.6666, "unit": "mM"},
            "finalConc": {"value": 33.3333, "unit": "mM"},
            "finalVolume": {"value": 100, "unit": "µL"},
        },
    )

    assert response.status_code == 200
    assert response.json() == pytest.approx({"stock": 5.0, "diluent": 95.0}, rel=1e-3)


def test_dilution_rejects_final_above_stock():
    response = client.post(
        "/api/dilution",
        json={
            "stockConc": {"value": 100, "unit": "mM"},
            "finalConc": {"value": 200, "unit": "mM"},
            "finalVolume": {"value": 50, "unit": "µL"},
        },
    )
    error = response.json()["detail"][0]
    assert response.status_code == 422  # validation error
    assert error["loc"] == ["body"]
    assert "Final concentration must be lower than stock concentration." in error["msg"]


# parametrize to test all combinations of input field and zero or negative input
@pytest.mark.parametrize("field", ["stockConc", "finalConc", "finalVolume"])
@pytest.mark.parametrize("bad_value", [0, -1])
def test_dilution_rejects_non_positive_values(field, bad_value):
    body = {
        "stockConc": {"value": 100, "unit": "mM"},
        "finalConc": {"value": 20, "unit": "mM"},
        "finalVolume": {"value": 50, "unit": "µL"},
    }
    body[field]["value"] = bad_value
    response = client.post("/api/dilution", json=body)
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", field, "value"]


def test_dilution_rejects_empty_body():
    response = client.post("/api/dilution", json={})
    locs = [e["loc"] for e in response.json()["detail"]]
    assert response.status_code == 422
    assert len(locs) == 3  # all tree inputs are required


def test_dilution_rejects_equal_concentrations_of_stock_and_final():
    response = client.post(
        "/api/dilution",
        json={
            "stockConc": {"value": 100, "unit": "mM"},
            "finalConc": {"value": 100, "unit": "mM"},
            "finalVolume": {"value": 50, "unit": "µL"},
        },
    )
    error = response.json()["detail"][0]
    assert response.status_code == 422
    assert error["loc"] == ["body"]
    assert "Final concentration must be lower than stock concentration." in error["msg"]
