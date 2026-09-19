from importlib.metadata import version

from fastapi import FastAPI

from backend.calculations import dilution
from backend.schemas import DilutionRequest, DilutionResponse

app = FastAPI(
    title="Cloning screening assistant",
    description="Calculators for molecular cloning workflows.",
    version=version("backend"),
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/dilution")
def calculate_dilution(payload: DilutionRequest) -> DilutionResponse:
    """Calculate the volumes of stock and diluent for V1 = c2V2/c1 dilution.

    Takes stock concentration, final concentration, final volume (µL)
    and returns stock volume (µL) and diluent volume (µL)."""
    result = dilution(payload.stock_conc, payload.final_conc, payload.final_volume)
    return DilutionResponse(stock=result.stock, diluent=result.diluent)


def dev() -> None:
    """Run the development server."""
    import uvicorn

    uvicorn.run("backend.api:app", reload=True, port=8000)
