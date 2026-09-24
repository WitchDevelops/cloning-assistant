"""Request and response bodies.
Fields are declared in snake_case for Python, and serialized to camelCase in the JSON,
as is expected by the React client."""

from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, model_validator
from pydantic.alias_generators import to_camel


class UnitFamily(StrEnum):
    """Concentration units are only interconvertible within a family.
    Crossing families needs a molecular weight, which this API does not take."""

    MASS_PER_VOLUME = "mass_per_volume"
    MOL_PER_VOLUME = "mol_per_volume"
    VOLUME = "volume"


class ConcentrationUnit(StrEnum):
    """Concentration units. `factor` converts to the family base: ng/µL or nM."""

    unit_family: UnitFamily
    factor: float

    # __new__ creates an instance and returns it
    # needed here because strings are immutable and my enum inherits from str
    def __new__(cls, value: str, unit_family: UnitFamily, factor: float) -> "ConcentrationUnit":
        obj = str.__new__(cls, value)
        obj._value_ = value
        obj.unit_family = unit_family
        obj.factor = factor
        return obj

    NG_UL = "ng/µL", UnitFamily.MASS_PER_VOLUME, 1.0
    UG_UL = "µg/µL", UnitFamily.MASS_PER_VOLUME, 1000.0
    MG_ML = "mg/mL", UnitFamily.MASS_PER_VOLUME, 1000.0
    NM = "nM", UnitFamily.MOL_PER_VOLUME, 1.0
    UM = "µM", UnitFamily.MOL_PER_VOLUME, 1_000.0
    MM = "mM", UnitFamily.MOL_PER_VOLUME, 1_000_000.0
    M = "M", UnitFamily.MOL_PER_VOLUME, 1_000_000_000.0


class VolumeUnit(StrEnum):
    """Volume units. `factor` converts to µL. One family, so no family attribute."""

    factor: float

    def __new__(cls, value: str, factor: float) -> "VolumeUnit":
        obj = str.__new__(cls, value)
        obj._value_ = value
        obj.factor = factor
        return obj

    UL = "µL", 1.0
    ML = "mL", 1_000.0


class ApiModel(BaseModel):
    """Base for every request and response body.
    Fields are declared snake_case and serialized to camelCase."""

    # strict = True prevents converting booleans to 1 or 0
    # pupulate_by_name = True accepts snake and pascal case input names
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, strict=True)


class Quantity(ApiModel):
    """A magnitude paired with a unit. Subclasses narrow `unit` to one dimension,
    so a volume cannot be supplied where a concentration is expected."""

    value: float = Field(gt=0)
    # Declared as a union here only so `to_base` can see `.factor`; each subclass
    # narrows it to one dimension. The `strict` constraint lives on the subclasses
    # because it cannot be applied to a union.
    unit: ConcentrationUnit | VolumeUnit

    def to_base(self) -> float:
        """This quantity's value converted to its family's base unit:
        ng/µL for mass per volume, nM for molar, µL for volume."""
        return self.value * self.unit.factor


class Concentration(Quantity):
    """A concentration in mass-per-volume or molar units."""

    # strict=False because a JSON body carries the unit as a plain string;
    # under strict=True Pydantic would demand an enum instance and reject "mM".
    unit: ConcentrationUnit = Field(strict=False)


class Volume(Quantity):
    """A volume."""

    unit: VolumeUnit = Field(strict=False)


class DilutionRequest(ApiModel):
    """Desired volume and concentration starting from the stock concentration.
    The unit types are enforced by the field types; both concentrations must
    additionally belong to the same family."""

    stock_conc: Concentration = Field(examples=[{"value": 250, "unit": "mM"}])
    final_conc: Concentration = Field(examples=[{"value": 50, "unit": "mM"}])
    final_volume: Volume = Field(examples=[{"value": 20, "unit": "µL"}])

    @model_validator(mode="after")
    def check_units(self) -> "DilutionRequest":
        if self.final_conc.unit.unit_family != self.stock_conc.unit.unit_family:
            raise ValueError("Unit families must match.")
        if self.final_conc.to_base() >= self.stock_conc.to_base():
            raise ValueError("Final concentration must be lower than stock concentration.")

        return self


class DilutionResponse(ApiModel):
    """Volumes to combine, µL."""

    stock: float
    diluent: float


class Stock(ApiModel):
    """Defines a stock solution (Cold Spring Harbor standards)."""

    name: str
    composition: dict[str, Concentration]
    concentration_factor: int | None = Field(default=None, gt=0)
    ph: float | None = None
    note: str | None = None
    citation: str | None = None


class StockResponse(ApiModel):
    """A list of predefined stock solutions."""

    stocks: list[Stock]
