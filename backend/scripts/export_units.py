"""Writes the unit table to contracts/units.json, the fixture the frontend
drift test compares against. Regenerate after any change to Unit."""

import json
from pathlib import Path

from pydantic.alias_generators import to_camel

from backend.schemas import Unit

# walks up to repo root to store the result there
OUTPUT = Path(__file__).resolve().parents[2] / "contracts" / "units.json"


def unit_table() -> dict[str, dict[str, object]]:
    """Maps each unit's wire value to its family (camelCase) and base-unit factor."""
    return {
        unit.value: {"family": to_camel(unit.unit_family), "factor": unit.factor} for unit in Unit
    }


def main() -> None:
    """Writes the table to contracts/units.json, creating the directory if needed."""
    table = unit_table()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(table, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {len(table)} units to {OUTPUT}")


if __name__ == "__main__":
    main()
