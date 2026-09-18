from importlib.metadata import version

from fastapi import FastAPI

app = FastAPI(
    title="Cloning screening assistant",
    description="Calculators for molecular cloning workflows.",
    version=version("backend"),
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def dev() -> None:
    """Run the development server."""
    import uvicorn

    uvicorn.run("backend.api:app", reload=True, port=8000)
