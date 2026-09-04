# Cloning Screening Assistant

Calculators and a 96-well plate map for screening colonies after a ligation and
transformation. Python/FastAPI backend, React/TypeScript frontend.

Work in progress.

## Scaffolding progress

### Done

- [x] WSL2 + Ubuntu, Python 3.12 via `uv`, Node via `nvm`
- [x] Backend scaffolded (`uv init`, FastAPI, pytest, ruff, mypy)
- [x] Frontend scaffolded (Vite, React, TypeScript, Zod, Vitest)

### Repo hygiene

- [ ] `LICENSE` (MIT or Apache-2.0)
- [ ] `CITATION.cff`
- [ ] Full README: what it is, how to run, the calculations with worked examples,
      deferred scope, CI badge, live URL

### Backend config

- [ ] `[tool.ruff]`, `[tool.mypy]` and `[tool.pytest.ini_options]` in `pyproject.toml`
- [ ] `backend/tests/` with a passing smoke test
- [ ] `api.py`: FastAPI app, `/api/health` endpoint, CORS

### Frontend config

- [ ] Remove the Vite starter demo
- [ ] Vitest + jsdom + Testing Library
- [ ] Router with the three top-level sections
- [ ] `storage.ts`: thin interface over localStorage

### Tooling

- [ ] `.pre-commit-config.yaml`: ruff, trailing whitespace, end-of-file newline,
      YAML/JSON validity, large-file guard, frontend lint
- [ ] `pre-commit install`

### CI

- [ ] `.github/workflows/ci.yml`: ruff, mypy, pytest, vitest, frontend build, caching
- [ ] Build-status badge in the README

### Docker and deployment

- [ ] Install Docker
- [ ] `Dockerfile` (multi-stage), `docker-compose.yml`, `.dockerignore`
- [ ] Render: static site + web service, CORS narrowed, live URL in the README
