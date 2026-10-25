import os
from importlib.metadata import version

from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.calculations import dilution, ligation, ligation_control
from backend.schemas import (
    DilutionRequest,
    DilutionResponse,
    LigationReaction,
    LigationRequest,
    LigationResponse,
    StockResponse,
)
from backend.stocks import STANDARD_STOCKS

app = FastAPI(
    title="Molecular biology assistant",
    description="Calculators for molecular cloning workflows.",
    version=version("backend"),
)

# Sets up CORS so that backend can talk to frontend on the allowed port
# (ALLOWED_ORIGINS env var, see .env.example)
# strip() to remove spaces between the items, .split() to get individual ones
ALLOWED_ORIGINS = [origin.strip() for origin in os.environ["ALLOWED_ORIGINS"].split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


router = APIRouter(prefix="/api")


@router.get("/health", tags=["Health"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/dilution", tags=["Calculators"])
def calculate_dilution(payload: DilutionRequest) -> DilutionResponse:
    """Calculate the volumes of stock and diluent for V1 = c2V2/c1 dilution.

    Takes stock concentration, final concentration, final volume (µL)
    and returns stock volume (µL) and diluent volume (µL)."""
    result = dilution(
        payload.stock_conc.to_base(), payload.final_conc.to_base(), payload.final_volume.to_base()
    )
    return DilutionResponse(stock=result.stock, diluent=result.diluent)


@router.post("/ligation", tags=["Calculators"])
def calculate_ligation(payload: LigationRequest) -> LigationResponse:
    """Calculate the volumes of the insert, vector and water for a single ligation reaction.

    Takes insert size and concentration, vector size and concentration
    and molar ratio (insert:vector)."""
    vector_mass = payload.vector_mass.to_base()
    vector_conc = payload.vector_conc.to_base()
    final_volume = payload.final_volume.to_base()

    try:
        reaction_data = ligation(
            vector_mass=vector_mass,
            vector_length=payload.vector_length.to_base(),
            vector_conc=vector_conc,
            insert_length=payload.insert_length.to_base(),
            insert_conc=payload.insert_conc.to_base(),
            ratio=payload.molar_ratio,
            final_volume=final_volume,
        )
        control_data = ligation_control(
            vector_mass=vector_mass,
            vector_conc=vector_conc,
            final_volume=final_volume,
        )

    except ValueError as exception:
        raise HTTPException(
            status_code=422,
            detail=[{"loc": ["body"], "msg": str(exception), "type": "value_error"}],
        ) from exception

    return LigationResponse(
        insert_mass=reaction_data.insert_volume * payload.insert_conc.to_base(),
        reaction=LigationReaction(**reaction_data._asdict()),
        control=LigationReaction(**control_data._asdict()),
    )


@router.get("/stocks", tags=["Stock solutions"])
def get_standard_stocks() -> StockResponse:
    """Return a list of predefined stocks."""

    return StockResponse(stocks=STANDARD_STOCKS)


app.include_router(router)
