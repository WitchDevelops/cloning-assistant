import pytest
from fastapi.testclient import TestClient

from backend.api import app

client = TestClient(app)


def quantity(value: float, unit: str) -> dict:
    return {"value": value, "unit": unit}


def body(stock: tuple, final: tuple, volume: tuple) -> dict:
    return {
        "stockConc": quantity(*stock),
        "finalConc": quantity(*final),
        "finalVolume": quantity(*volume),
    }


def messages(response) -> list[str]:
    """All validation messages, so a test never depends on which error came first."""
    return [error["msg"] for error in response.json()["detail"]]


def test_dilution_returns_expected_volumes():
    response = client.post("/api/dilution", json=body((100, "mM"), (20, "mM"), (50, "µL")))
    assert response.status_code == 200
    assert response.json() == {"stock": 10, "diluent": 40}


def test_dilution_handles_non_round_numbers():
    response = client.post(
        "/api/dilution", json=body((666.6666, "mM"), (33.3333, "mM"), (100, "µL"))
    )
    assert response.status_code == 200
    assert response.json() == pytest.approx({"stock": 5.0, "diluent": 95.0}, rel=1e-3)


def test_dilution_rejects_final_above_stock():
    response = client.post("/api/dilution", json=body((100, "mM"), (200, "mM"), (50, "µL")))
    assert response.status_code == 422  # validation error
    # a model validator reports against the body as a whole, not a single field
    assert response.json()["detail"][0]["loc"] == ["body"]
    assert any(
        "Final concentration must be lower than stock concentration." in message
        for message in messages(response)
    )


def test_dilution_rejects_equal_concentrations_of_stock_and_final():
    response = client.post("/api/dilution", json=body((100, "mM"), (100, "mM"), (50, "µL")))
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body"]
    assert any(
        "Final concentration must be lower than stock concentration." in message
        for message in messages(response)
    )


# parametrize to test all combinations of input field and zero or negative input
@pytest.mark.parametrize("field", ["stockConc", "finalConc", "finalVolume"])
@pytest.mark.parametrize("bad_value", [0, -1])
def test_dilution_rejects_non_positive_values(field, bad_value):
    payload = body((100, "mM"), (20, "mM"), (50, "µL"))
    payload[field]["value"] = bad_value
    response = client.post("/api/dilution", json=payload)
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", field, "value"]


def test_dilution_rejects_empty_body():
    response = client.post("/api/dilution", json={})
    locs = [error["loc"] for error in response.json()["detail"]]
    assert response.status_code == 422
    assert len(locs) == 3  # all tree inputs are required


# Expected volumes worked out by hand from C1V1 = C2V2 after converting both
# concentrations to the family base (ng/µL or nM) and the volume to µL.
@pytest.mark.parametrize(
    ("stock", "final", "volume", "expected_stock", "expected_diluent"),
    [
        # same units
        ((250, "mM"), (50, "mM"), (20, "µL"), 4.0, 16.0),
        # routine buffer dilution
        ((1, "M"), (50, "mM"), (20, "µL"), 1.0, 19.0),
        # mass per volume, mixed units: 1 mg/mL is 1000 ng/µL
        ((1, "mg/mL"), (100, "ng/µL"), (20, "µL"), 2.0, 18.0),
        # final volume in mL: the result stays in µL
        ((250, "mM"), (50, "mM"), (1, "mL"), 200.0, 800.0),
        ((1, "µg/µL"), (50, "ng/µL"), (2, "mL"), 100.0, 1900.0),
        ((100, "µM"), (10, "µM"), (5, "mL"), 500.0, 4500.0),
    ],
)
def test_dilution_converts_between_units_of_the_same_family(
    stock, final, volume, expected_stock, expected_diluent
):
    response = client.post("/api/dilution", json=body(stock, final, volume))
    assert response.status_code == 200
    assert response.json() == pytest.approx({"stock": expected_stock, "diluent": expected_diluent})


@pytest.mark.parametrize(
    ("stock", "final", "volume", "expected_message"),
    [
        # mass per volume against molar: not interconvertible without a molecular weight
        # (the c1 V1 = c2 V2 rejects this)
        ((250, "ng/µL"), (50, "mM"), (20, "µL"), "Unit families must match."),
        # 0.5 M is 500 mM, so this is above the 1 mM stock even though 0.5 < 1.
        # Rejecting it requires the comparison to happen after conversion.
        (
            (1, "mM"),
            (0.5, "M"),
            (20, "µL"),
            "Final concentration must be lower than stock concentration.",
        ),
    ],
)
def test_dilution_rejects_invalid_unit_combinations(stock, final, volume, expected_message):
    response = client.post("/api/dilution", json=body(stock, final, volume))
    assert response.status_code == 422
    assert any(expected_message in message for message in messages(response))


# A unit from the wrong dimension is rejected by the field type rather than the
# model validator, so the error carries the field path instead of just ["body"].
@pytest.mark.parametrize(
    ("field", "wrong_unit"),
    [
        ("stockConc", "µL"),
        ("finalConc", "µL"),
        ("finalVolume", "mM"),
    ],
)
def test_dilution_rejects_units_from_the_wrong_dimension(field, wrong_unit):
    payload = body((100, "mM"), (20, "mM"), (50, "µL"))
    payload[field]["unit"] = wrong_unit
    response = client.post("/api/dilution", json=payload)
    assert response.status_code == 422
    locs = [error["loc"] for error in response.json()["detail"]]
    assert ["body", field, "unit"] in locs
