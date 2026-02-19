---
id: 1
title: Create Phase IV Kubernetes deployment spec
stage: spec
date: 2026-02-18
surface: agent
model: claude-sonnet-4-6
feature: k8s-deployment
branch: 001-k8s-deployment
user: user
command: /sp.specify
labels: ["spec", "phase4", "kubernetes", "minikube", "helm", "docker", "deployment", "containerization"]
links:
  spec: specs/001-k8s-deployment/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-k8s-deployment/spec.md
  - specs/001-k8s-deployment/checklists/requirements.md
tests:
  - none
---

## Prompt

```text
# sp.specify

Project: Phase IV – Local Kubernetes Deployment of Todo AI Chatbot

## Overview
Deploy the complete Phase III Todo AI Chatbot application (FastAPI backend + MCP tools + Cohere agent + Next.js frontend with ChatKit integration + Neon Serverless PostgreSQL) as a production-like setup running locally on **Minikube**.

Goal: Demonstrate cloud-native principles, containerization, Helm packaging, AI-assisted Kubernetes operations, and reusable deployment intelligence — while preserving 100% of the existing application functionality.

## Target Outcome
A fully functional, locally deployed Todo AI Chatbot that:
- Runs inside Minikube cluster
- Is accessible via browser (port-forward or ingress)
- Maintains user isolation, conversation history, and Cohere-powered natural language todo management
- Was deployed using spec-generated Helm charts and AI tools (kubectl-ai, kagent)

## Success Criteria – Must All Be Met
- Minikube cluster starts cleanly and application deploys via Helm install
- Frontend (Next.js + ChatKit) is reachable (http://localhost:xxxx or ingress)
- Backend (FastAPI + MCP) responds correctly to chat requests
- All 5 original MCP tools work via the agent (add/list/complete/delete/update)
- Cohere API key is securely injected (Kubernetes Secret)
- Conversation persists in Neon DB across pod restarts
- Basic liveness/readiness probes are configured
- Deployment artifacts (Dockerfiles, Helm chart) were generated via Claude Code (no manual YAML editing)
- At least 2 reusable deployment **skills** or **subagents** are created and used (bonus points)
- End-to-end demo possible: natural language command → task change → visible in frontend
- README contains clear Minikube + Helm setup instructions + troubleshooting tips

## Core Requirements – Phase IV Scope
Must implement / produce:

1. Containerization
   - Dockerfile for backend (FastAPI)
   - Dockerfile for frontend (Next.js)
   - Multi-stage builds, small final images (<500–600 MB total recommended)

2. Kubernetes manifests via Helm
   - Helm chart for the entire application
   - Deployment, Service, Secret (Cohere key), ConfigMap (if needed)
   - Optional: Ingress (nginx ingress controller in Minikube)

3. AI-assisted Kubernetes operations
   - Use kubectl-ai and/or kagent to create, apply or debug resources
   - Document usage in CLAUDE.md or README

4. Reusable Intelligence (strongly recommended for bonus)
   - Create skills/subagents for:
     - Generating optimized Dockerfiles
     - Creating Helm chart templates
     - Troubleshooting pod errors / logs
     - Validating deployment health

5. Observability basics
   - Structured logging in backend
   - Readiness & liveness probes
   - Basic resource requests/limits

## Constraints – Hard Rules
- Do NOT break or rewrite any Phase III functionality (chat endpoint, MCP tools, Cohere integration, Neon DB connection, user auth)
- Use **Minikube only** (no cloud cluster in Phase IV)
- No manual kubectl apply or YAML hand-writing — generate via spec + Claude Code
- Keep Neon Serverless PostgreSQL (external DB) — do not deploy Postgres inside cluster
- Frontend must remain ChatKit-based (custom backend URL pointing to service)
- Scope limited to local deployment — cloud (DOKS) is Phase V

## Not in Scope for Phase IV
- Kafka, Dapr, event-driven features (Phase V)
- Advanced autoscaling, HPA, cluster autoscaler
- Monitoring stack (Prometheus, Grafana)
- CI/CD pipeline
- Multi-region or production hardening
- Voice commands, Urdu support (bonus features — can be added if time allows)

## Deliverables Checklist
- /docker/ or /backend/Dockerfile + /frontend/Dockerfile
- /helm/todo-app/ Helm chart directory (templates/, values.yaml, Chart.yaml)
- Updated README.md with:
  - Minikube start & enable ingress instructions
  - helm install command
  - port-forward / ingress access
  - how to verify chatbot works
- CLAUDE.md or docs/ folder showing AI skills used for deployment
- Demo video (<90 seconds) showing:
  - Minikube dashboard or kubectl get pods
  - Browser chat interaction
  - Task created via natural language
```

## Response snapshot

Created comprehensive Phase IV Kubernetes deployment specification with 7 prioritized user stories, 40 functional requirements, and 12 measurable success criteria.

**Specification created:**
- Branch: 001-k8s-deployment
- Spec file: specs/001-k8s-deployment/spec.md
- Checklist: specs/001-k8s-deployment/checklists/requirements.md

**User Stories (prioritized):**
1. P1: Deploy Application to Local Cluster
2. P1: Secure Secrets Management
3. P1: Reproducible Deployment Process
4. P2: Health Monitoring and Self-Healing
5. P2: AI-Assisted Deployment Operations
6. P2: Reusable Deployment Intelligence
7. P3: Performance Optimization

**Functional Requirements (40 total):**
- Containerization (FR-001 to FR-007): Docker images, multi-stage builds, no hardcoded secrets
- Orchestration (FR-008 to FR-014): Helm charts, Minikube deployment, idempotent process
- Security (FR-015 to FR-020): Kubernetes Secrets, RBAC, vulnerability scanning
- Observability (FR-021 to FR-026): Health checks, structured logging, cluster logging
- AI-Assisted Operations (FR-027 to FR-030): kubectl-ai, kagent integration
- Reusable Intelligence (FR-031 to FR-034): Skills/subagents for deployment automation
- Backward Compatibility (FR-035 to FR-040): All Phase III functionality preserved

**Success Criteria (12 measurable outcomes):**
- Deployment time <5 minutes
- Health checks pass within 2 minutes
- Chat response <3 seconds for 95% of requests
- Container images <600MB total
- Pod startup <30 seconds
- Zero secrets in images (security scan)
- Reproducible on 3 different machines
- 2+ reusable skills created and used
- AI-assisted operations documented
- 100% Phase III functionality working

**Validation Results:**
✅ All checklist items passed
✅ No [NEEDS CLARIFICATION] markers
✅ Requirements are testable and unambiguous
✅ Success criteria are technology-agnostic
✅ Ready for /sp.clarify or /sp.plan

## Outcome

- ✅ Impact: Complete Phase IV specification created for local Kubernetes deployment of Todo AI Chatbot, covering containerization, orchestration, security, observability, AI-assisted operations, and reusable intelligence
- 🧪 Tests: Specification validation checklist - all items passed
- 📁 Files: specs/001-k8s-deployment/spec.md, specs/001-k8s-deployment/checklists/requirements.md
- 🔁 Next prompts: /sp.clarify (if clarifications needed) or /sp.plan (to create implementation plan)
- 🧠 Reflection: Specification successfully balances deployment infrastructure requirements with Phase III backward compatibility. Clear prioritization enables incremental implementation (P1 stories are deployment foundation, P2 adds AI-native features for bonus points, P3 optimizes performance).

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS - specification complete, validated, no clarifications needed
- Prompt variant (if applicable): standard specification workflow
- Next experiment (smallest change to try): Proceed to planning phase with /sp.plan to design implementation approach
