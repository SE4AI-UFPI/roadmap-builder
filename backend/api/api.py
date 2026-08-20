from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
import os

# Importe as funções do seu script original
from scripts.roadmap_builder import (
    validate_config, format_validation_errors, parse_date,
    schedule_issues, milestone_due_dates, validate_remote_access,
    ensure_milestones, ensure_labels, ensure_issues,
    create_project, get_project_id, link_project_to_repository,
    add_issues_to_project
)

app = FastAPI(title="Roadmap Builder API")

# Configuração de CORS para permitir requisições do React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Ajuste para a URL do seu React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Modelos de entrada de dados (Substituem os argumentos do CLI)
class RoadmapPayload(BaseModel):
    owner: str
    repo: str
    apply: bool = False
    create_project: bool = False
    project_title: str = "RoadmapBuilder"
    project_number: int | None = None
    project_start_date: str | None = None
    config: dict[str, Any]  # O JSON que antes vinha do arquivo agora vem aqui


@app.post("/api/build-roadmap")
def build_roadmap(payload: RoadmapPayload, github_token: str = Header(...)):
    cfg = payload.config

    # 1. Validação do Config (Reaproveitando sua função)
    validation_errors = validate_config(cfg)
    if validation_errors:
        raise HTTPException(status_code=400, detail=format_validation_errors(validation_errors))

    project_start_date = None
    if payload.project_start_date:
        project_start_date = parse_date(payload.project_start_date)
    elif cfg.get("schedule", {}).get("project_start_date"):
        project_start_date = parse_date(cfg["schedule"]["project_start_date"])

    issue_schedule = schedule_issues(cfg, project_start_date)
    due_dates = milestone_due_dates(issue_schedule)

    # Hack simples para contornar o uso de args nas suas funções originais
    class MockArgs:
        owner = payload.owner
        repo = payload.repo
        create_project = payload.create_project
        project_number = payload.project_number

    if payload.apply:
        remote_errors = validate_remote_access(MockArgs(), github_token)
        if remote_errors:
            raise HTTPException(status_code=400, detail=format_validation_errors(remote_errors))

    # 2. Execução (Reaproveitando suas funções)
    try:
        milestones = ensure_milestones(payload.owner, payload.repo, github_token, cfg, payload.apply, due_dates)
        ensure_labels(payload.owner, payload.repo, github_token, cfg, payload.apply)
        titles = ensure_issues(payload.owner, payload.repo, github_token, cfg, milestones, payload.apply,
                               issue_schedule)

        project_id = None
        if payload.create_project or payload.project_number:
            if payload.apply:
                if payload.create_project:
                    project_id = create_project(payload.owner, payload.repo, github_token, payload.project_title)
                else:
                    project_id = get_project_id(payload.owner, github_token, payload.project_number)
                    link_project_to_repository(payload.owner, payload.repo, github_token, project_id)

                add_issues_to_project(
                    payload.owner, payload.repo, github_token, project_id,
                    cfg, titles, payload.apply, issue_schedule
                )

        return {"status": "success", "message": "Roadmap processado com sucesso!", "issues_created": titles}

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))