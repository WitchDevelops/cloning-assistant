import pytest
from fastapi.testclient import TestClient

from backend.api import app

client = TestClient(app)


def quantity(value: float, unit: str) -> dict:
    return {"value": value, "unit": unit}


def body(**overrides) -> dict:
    payload = {
        "vectorLength": quantity(4, "kb"),
        "vectorConc": quantity(100, "ng/µL"),
        "vectorMass": quantity(50, "ng"),
        "insertLength": quantity(1200, "bp"),
        "insertConc": quantity(20, "ng/µL"),
        "molarRatio": 3,
        "finalVolume": quantity(20, "µL"),
    }
    payload.update(overrides)
    return payload


def test_ligation_returns_reaction_and_control():
    # Worked by hand from the body() defaults:
    #   insert mass   = 50 ng × (1200 bp / 4000 bp) × 3 = 45 ng
    #   vector volume = 50 ng / 100 ng/µL = 0.5 µL
    #   insert volume = 45 ng / 20 ng/µL  = 2.25 µL
    #   buffer 10 % of 20 µL = 2 µL, ligase 5 % = 1 µL
    #   water, reaction = 20 − (0.5 + 2.25 + 2 + 1) = 14.25 µL
    #   water, control  = 20 − (0.5 + 2 + 1) = 16.5 µL
    response = client.post("/api/ligation", json=body())
    assert response.status_code == 200
    assert response.json() == {
        "insertMass": 45.0,
        "reaction": {
            "vectorVolume": 0.5,
            "insertVolume": 2.25,
            "ligaseVolume": 1,
            "ligaseBufferVolume": 2,
            "waterVolume": 14.25,
        },
        "control": {
            "vectorVolume": 0.5,
            "insertVolume": 0,
            "ligaseVolume": 1,
            "ligaseBufferVolume": 2,
            "waterVolume": 16.5,
        },
    }


def test_ligation_rejects_reagents_exceeding_final_volume():
    # Vector at 1 ng/µL needs 50 µL for 50 ng, already more than the 20 µL reaction,
    # before insert (2.25 µL), buffer (2 µL) and ligase (1 µL) are added.
    response = client.post("/api/ligation", json=body(vectorConc=quantity(1, "ng/µL")))
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body"]
    assert "Increase the reaction volume" in response.json()["detail"][0]["msg"]


@pytest.mark.parametrize("field", ["vectorConc", "insertConc"])
def test_ligation_rejects_molar_concentration(field):
    response = client.post("/api/ligation", json=body(**{field: quantity(100, "nM")}))
    assert response.status_code == 422
    locs = [error["loc"] for error in response.json()["detail"]]
    assert ["body", field, "unit"] in locs


@pytest.mark.parametrize(
    ("field", "converted"),
    [
        ("vectorLength", quantity(4000, "bp")),  # 4 kb
        ("vectorMass", quantity(0.05, "µg")),  # 50 ng
        ("vectorConc", quantity(0.1, "µg/µL")),  # 100 ng/µL
        ("finalVolume", quantity(0.02, "mL")),  # 20 µL
    ],
)
def test_ligation_converts_units_to_base(field, converted):
    expected = client.post("/api/ligation", json=body()).json()
    response = client.post("/api/ligation", json=body(**{field: converted}))
    assert response.status_code == 200
    result = response.json()
    assert result["insertMass"] == pytest.approx(expected["insertMass"])
    assert result["reaction"] == pytest.approx(expected["reaction"])
    assert result["control"] == pytest.approx(expected["control"])


QUANTITY_FIELDS = [
    "vectorLength",
    "vectorConc",
    "vectorMass",
    "insertLength",
    "insertConc",
    "finalVolume",
]


@pytest.mark.parametrize("field", QUANTITY_FIELDS)
@pytest.mark.parametrize("bad_value", [0, -1])
def test_ligation_rejects_non_positive_quantities(field, bad_value):
    payload = body()
    payload[field]["value"] = bad_value
    response = client.post("/api/ligation", json=payload)
    assert response.status_code == 422
    locs = [error["loc"] for error in response.json()["detail"]]
    assert ["body", field, "value"] in locs


@pytest.mark.parametrize("bad_value", [0, -1])
def test_ligation_rejects_non_positive_ratio(bad_value):
    response = client.post("/api/ligation", json=body(molarRatio=bad_value))
    assert response.status_code == 422
    locs = [error["loc"] for error in response.json()["detail"]]
    assert ["body", "molarRatio"] in locs


def test_ligation_rejects_empty_body():
    response = client.post("/api/ligation", json={})
    assert response.status_code == 422
    assert len(response.json()["detail"]) == 7
