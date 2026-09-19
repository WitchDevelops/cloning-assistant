import pytest
from fastapi.testclient import TestClient

from backend.api import app

client = TestClient(app)


def test_dilution_returns_expected_volumes():
    response = client.post(
        "/api/dilution", json={"stockConc": 100, "finalConc": 20, "finalVolume": 50}
    )
    assert response.status_code == 200
    assert response.json() == {"stock": 10, "diluent": 40}


def test_dilution_handles_non_round_numbers():
    response = client.post(
        "/api/dilution", json={"stockConc": 666.6666, "finalConc": 33.3333, "finalVolume": 100}
    )

    assert response.status_code == 200
    assert response.json() == pytest.approx({"stock": 5.0, "diluent": 95.0}, rel=1e-3)


def test_dilution_rejects_final_above_stock():
    response = client.post(
        "/api/dilution", json={"stockConc": 100, "finalConc": 200, "finalVolume": 50}
    )
    error = response.json()["detail"][0]
    assert response.status_code == 422  # validation error
    assert error["loc"] == ["body", "finalConc"]  # error in the response body, finalConc field
    assert "must be lower than stock_conc" in error["msg"]


# parametrize to test all combinations of input field and zero or negative input
@pytest.mark.parametrize("field", ["stockConc", "finalConc", "finalVolume"])
@pytest.mark.parametrize("bad_value", [0, -1])
def test_dilution_rejects_non_positive_values(field, bad_value):
    body = {"stockConc": 100, "finalConc": 20, "finalVolume": 50}
    body[field] = bad_value
    response = client.post("/api/dilution", json=body)
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", field]


def test_dilution_rejects_empty_body():
    response = client.post("/api/dilution", json={})
    locs = [e["loc"] for e in response.json()["detail"]]
    assert response.status_code == 422
    assert len(locs) == 3  # all tree inputs are required


def test_dilution_rejects_equal_concentrations_of_stock_and_final():
    response = client.post(
        "/api/dilution", json={"stockConc": 100, "finalConc": 100, "finalVolume": 50}
    )
    error = response.json()["detail"][0]
    assert response.status_code == 422
    assert error["loc"] == ["body", "finalConc"]
    assert "final_conc must be lower than stock_conc" in error["msg"]
