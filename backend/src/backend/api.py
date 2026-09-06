from fastapi import FastAPI

app = FastAPI()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def dev() -> None:
    """Run the development server."""
    import uvicorn

    uvicorn.run("backend.api:app", reload=True, port=8000)
