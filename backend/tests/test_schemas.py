import pytest
from pydantic import ValidationError

from backend.schemas import DNALength, DNALengthUnit, DNAMass, DNAMassUnit


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
