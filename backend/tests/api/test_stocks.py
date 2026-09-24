import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from backend.schemas import Stock

CASES = json.loads((Path(__file__).parents[3] / "contracts" / "stock-cases.json").read_text())


@pytest.mark.parametrize("case", CASES, ids=lambda c: c["description"])
def test_matches_shared_contract(case):
    try:
        Stock.model_validate(case["input"])
        is_valid = True
    except ValidationError:
        is_valid = False

    assert is_valid == case["valid"]
