"""Request and response bodies.
Fields are declared in snake_case for Python, and serialized to camelCase in the JSON,
as is expected by the React client."""

from pydantic import BaseModel, ConfigDict, Field, ValidationInfo, field_validator
from pydantic.alias_generators import to_camel


class ApiModel(BaseModel):
    """Base for every request and response body.
    Fields are declared snake_case and serialized to camelCase."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class DilutionRequest(ApiModel):
    """Desired volume and concentration starting from the stock concentration, e.g.
    mol/l (mol / volume), mg/ml (mass / volume) or equivalent units. The units must match."""

    stock_conc: float = Field(gt=0)
    final_conc: float = Field(gt=0)
    final_volume: float = Field(gt=0)

    @field_validator("final_conc")
    @classmethod
    def final_lower_than_stock(cls, value: float, info: ValidationInfo) -> float:
        max_conc = info.data.get("stock_conc")
        if max_conc is not None and value >= max_conc:
            raise ValueError("final_conc must be lower than stock_conc")
        return value


class DilutionResponse(ApiModel):
    """Volumes to combine, µL."""

    stock: float
    diluent: float
