"""Request and response bodies.
Fields are declared in snake_case for Python, and serialized to camelCase in the JSON,
as is expected by the React client."""

from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, model_validator
from pydantic.alias_generators import to_camel


class Unit(StrEnum):
    unit_family: str
    factor: float

    # __new__ creates an instance and returns it
    # needed here because strings are immutable and my enum inherits from str
    def __new__(cls, value: str, unit_family: str, factor: float) -> "Unit":
        obj = str.__new__(cls, value)
        obj._value_ = value
        obj.unit_family = unit_family
        obj.factor = factor
        return obj

    NG_UL = "ng/µL", "mass_per_volume", 1.0
    UG_UL = "µg/µL", "mass_per_volume", 1000.0
    MG_ML = "mg/mL", "mass_per_volume", 1000.0
    NM = "nM", "mol_per_volume", 1.0
    UM = "µM", "mol_per_volume", 1_000.0
    MM = "mM", "mol_per_volume", 1_000_000.0
    M = "M", "mol_per_volume", 1_000_000_000.0
    UL = "µL", "volume", 1.0
    ML = "mL", "volume", 1_000.0


class ApiModel(BaseModel):
    """Base for every request and response body.
    Fields are declared snake_case and serialized to camelCase."""

    # strict = True prevents converting booleans to 1 or 0
    # pupulate_by_name = True accepts snake and pascal case input names
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, strict=True)


class Quantity(ApiModel):
    value: float = Field(gt=0)
    unit: Unit = Field(strict=False)

    def to_base(self) -> float:
        """Converts the unit to base unit.
        ng/µL for gram per volume, nM for mol per volume, and µL for volume."""
        return self.value * self.unit.factor


class DilutionRequest(ApiModel):
    """Desired volume and concentration starting from the stock concentration, e.g.
    mol/l (mol / volume), mg/ml (mass / volume) or equivalent units."""

    stock_conc: Quantity = Field(examples=[{"value": 250, "unit": "mM"}])
    final_conc: Quantity = Field(examples=[{"value": 50, "unit": "mM"}])
    final_volume: Quantity = Field(examples=[{"value": 20, "unit": "µL"}])

    @model_validator(mode="after")
    def check_units(self) -> "DilutionRequest":
        if self.stock_conc.unit.unit_family not in {"mass_per_volume", "mol_per_volume"}:
            raise ValueError("Stock concentration must be expressed in concentration units.")
        if self.final_conc.unit.unit_family not in {"mass_per_volume", "mol_per_volume"}:
            raise ValueError("Final concentration must be expressed in concentration units.")
        if self.final_volume.unit.unit_family != "volume":
            raise ValueError("Final volume must be expressed in volume units.")

        if self.final_conc.unit.unit_family != self.stock_conc.unit.unit_family:
            raise ValueError("Unit families must match.")
        if self.final_conc.to_base() >= self.stock_conc.to_base():
            raise ValueError("Final concentration must be lower than stock concentration.")

        return self


class DilutionResponse(ApiModel):
    """Volumes to combine, µL."""

    stock: float
    diluent: float
