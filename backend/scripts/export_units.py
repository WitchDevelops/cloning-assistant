"""Writes the unit table to contracts/units.json, the fixture the frontend
drift test compares against. Regenerate after any change to Unit."""

import json
from pathlib import Path

from pydantic.alias_generators import to_camel

from backend.schemas import ConcentrationUnit, DNALengthUnit, DNAMassUnit, UnitFamily, VolumeUnit

# walks up to repo root to store the result there
OUTPUT = Path(__file__).resolve().parents[2] / "contracts" / "units.json"


def unit_table() -> dict[str, dict[str, object]]:
    """Maps each unit's wire value to its family (camelCase) and base-unit factor."""
    conc_table = {
        conc_unit.value: {"family": to_camel(conc_unit.unit_family), "factor": conc_unit.factor}
        for conc_unit in ConcentrationUnit
    }
    vol_table = {
        vol_unit.value: {"family": to_camel(UnitFamily.VOLUME), "factor": vol_unit.factor}
        for vol_unit in VolumeUnit
    }

    dna_length_table = {
        dna_length_unit.value: {
            "family": to_camel(UnitFamily.DNA_LENGTH),
            "factor": dna_length_unit.factor,
        }
        for dna_length_unit in DNALengthUnit
    }

    dna_mass_table = {
        dna_mass_unit.value: {
            "family": to_camel(UnitFamily.DNA_MASS),
            "factor": dna_mass_unit.factor,
        }
        for dna_mass_unit in DNAMassUnit
    }
    return conc_table | vol_table | dna_length_table | dna_mass_table


def main() -> None:
    """Writes the table to contracts/units.json, creating the directory if needed."""
    table = unit_table()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(table, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {len(table)} units to {OUTPUT}")


if __name__ == "__main__":
    main()
