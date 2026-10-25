import math

import pytest
from pydantic import ValidationError

from backend.schemas import (
    DNALength,
    DNALengthUnit,
    DNAMass,
    DNAMassUnit,
    LigationRequest,
    MassConcentration,
    Volume,
    VolumeUnit,
)


@pytest.mark.parametrize(
    ("value", "unit", "dna_length_bp"),
    [
        (0.1, DNALengthUnit.KB, 100.0),
        (3.0, DNALengthUnit.KB, 3_000.0),
        (100.0, DNALengthUnit.BP, 100.0),
        (3_000.0, DNALengthUnit.BP, 3_000.0),
    ],
)
def test_dna_length_to_base(value, unit, dna_length_bp):
    assert DNALength(value=value, unit=unit).to_base() == dna_length_bp


@pytest.mark.parametrize(
    ("value", "unit", "dna_mass_ng"),
    [
        (0.1, DNAMassUnit.UG, 100.0),
        (2.0, DNAMassUnit.UG, 2_000.0),
        (100.0, DNAMassUnit.NG, 100.0),
        (5_000.0, DNAMassUnit.NG, 5_000.0),
    ],
)
def test_dna_mass_to_base(value, unit, dna_mass_ng):
    assert DNAMass(value=value, unit=unit).to_base() == dna_mass_ng


def test_rejects_dna_length_as_dna_mass():
    with pytest.raises(ValidationError):
        DNAMass(value=2_000.0, unit=DNALengthUnit.BP)


NON_FINITE = [math.inf, -math.inf, math.nan]


@pytest.mark.parametrize("value", NON_FINITE)
def test_quantity_rejects_non_finite_value(value):
    with pytest.raises(ValidationError) as excinfo:
        Volume(value=value, unit=VolumeUnit.UL)
    assert excinfo.value.errors()[0]["type"] == "finite_number"


@pytest.mark.parametrize("value", NON_FINITE)
def test_ligation_request_rejects_non_finite_ratio(value):
    with pytest.raises(ValidationError) as excinfo:
        LigationRequest(
            vector_length=DNALength(value=4, unit="kb"),
            vector_conc=MassConcentration(value=100, unit="ng/µL"),
            vector_mass=DNAMass(value=50, unit="ng"),
            insert_length=DNALength(value=1200, unit="bp"),
            insert_conc=MassConcentration(value=20, unit="ng/µL"),
            molar_ratio=value,
            final_volume=Volume(value=20, unit="µL"),
        )
    assert excinfo.value.errors()[0]["loc"] == ("molar_ratio",)
