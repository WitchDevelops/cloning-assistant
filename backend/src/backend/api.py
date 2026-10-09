import os
from importlib.metadata import version

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.calculations import dilution
from backend.schemas import DilutionRequest, DilutionResponse, StockResponse
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


@router.get("/stocks", tags=["Stock solutions"])
def get_standard_stocks() -> StockResponse:
    """Return a list of predefined stocks."""

    return StockResponse(stocks=STANDARD_STOCKS)


app.include_router(router)
