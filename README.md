# Cloning Screening Assistant

[![CI](https://github.com/WitchDevelops/cloning-assistant/actions/workflows/ci.yml/badge.svg)](https://github.com/WitchDevelops/cloning-assistant/actions/workflows/ci.yml)

Calculators and a 96-well plate map for screening colonies after a ligation and
transformation.

## Stack
Python/FastAPI backend, React/TypeScript frontend.

Early development - the calculators are not built yet.

## Requirements

- **[uv](https://docs.astral.sh/uv/)** - manages Python and the backend dependencies
- **[Node.js](https://nodejs.org/)** - version in `frontend/.nvmrc`

You do not need to install Python separately. uv reads `backend/.python-version`
and downloads the right interpreter itself.

### Installing uv

**macOS / Linux**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows (PowerShell)**

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Or, with a package manager: `brew install uv`, `winget install --id=astral-sh.uv -e`.

### Installing Node

**macOS / Linux** - with [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install
```

Run from `frontend/`; nvm reads `.nvmrc`.

**Windows** - [nvm-windows](https://github.com/coreybutler/nvm-windows), [fnm](https://github.com/Schniz/fnm),
or the installer from [nodejs.org](https://nodejs.org/).

## Running it locally

Every command below is identical on Linux, macOS and Windows.

### Backend

```bash
cd backend
uv sync
uv run dev
```

Serves on <http://localhost:8000>.

- <http://localhost:8000/api/health> - health check
- <http://localhost:8000/docs> - interactive API documentation (Swagger UI)
- <http://localhost:8000/redoc> - the same API as reference documentation

### Frontend

In a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Serves on <http://localhost:5173>.

## Contributing

(for now contributions are closed, I'm still setting it up and working on an MVP)

### Pre-commit hooks

Install once after cloning:

```bash
uv tool install pre-commit
pre-commit install
```

On every commit this runs, against staged files only:

- `ruff` - lint and format the backend
- `eslint` - lint the frontend
- trailing whitespace, end-of-file newline, YAML/JSON validity, large-file guard

Most hooks fix files in place. When one does, re-stage and commit again.

To run everything without committing:

```bash
pre-commit run --all-files
```

### Tests

```bash
cd backend && uv run pytest
cd frontend && npm test
```

Type checking runs in CI rather than in the commit hook, because mypy needs the
project's installed dependencies and pre-commit's hook environments are isolated
from them:

```bash
cd backend && uv run mypy src
```

### Validation

Input validation is deliberately done twice: **Zod** on the front end for
immediate feedback and data cleaning, and **Pydantic** on the back end as the
real gate. Never trust the raw input from the user.

## Planned work

- The calculators: ligation, restriction digest, gel loading dye, colony PCR
  master mix, dilution
- The 96-well plate map: configurable start well, well states, multi-plate
  overflow, print and JSON export
- Docker image and a deployed instance
