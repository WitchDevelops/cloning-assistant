import uvicorn


def main() -> None:
    """Run the backend development server
    while reading the environment variables from backend/.env."""

    uvicorn.run("backend.api:app", env_file=".env", reload=True, port=8000)
