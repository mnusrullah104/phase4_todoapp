---
id: 4
title: Update constitution Phase IV Kubernetes deployment
stage: constitution
date: 2026-02-18
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: user
command: /sp.constitution
labels: ["constitution", "phase4", "kubernetes", "minikube", "helm", "docker", "aiops", "kubectl-ai", "kagent", "reusable-intelligence"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

```text
# sp.constitution

Project: Phase IV – Local Kubernetes Deployment of Todo AI Chatbot

## Core Principles
- Build strictly on top of the existing Phase I-III Todo AI Chatbot application (in-memory console, full-stack web, AI chatbot with MCP tools and Cohere integration) — do not break or rewrite previous functionality.
- Shift focus to cloud-native deployment: containerize, orchestrate, and manage the application locally on Kubernetes using AI-assisted tools for efficiency and reproducibility.
- Emphasize reusable intelligence: Create and use skills/subagents for deployment tasks to demonstrate AI-native development.
- Maintain stateless architecture where possible, with user isolation, security, and scalability in mind.
- Prioritize spec-driven development (SDD) for all deployment artifacts — no manual YAML writing; generate via Claude Code.
- Promote AIOps: Use AI tools like kubectl-ai and kagent to simplify Kubernetes operations.

## Key Standards
- Follow the hackathon's Phase IV specification: Deploy the full Phase III chatbot (FastAPI backend, Next.js frontend, Neon DB integration, Cohere-powered agent, MCP tools) locally on Minikube.
- Containerization: Dockerize all components (frontend, backend, database proxy if needed) with multi-stage builds for optimization.
- Orchestration: Use Helm charts for packaging and deployment — charts must be spec-generated and reusable.
- AI Assistance: Integrate kubectl-ai for natural language Kubernetes commands and kagent for agentic cluster management.
- Reusable Intelligence: Develop at least 2-3 skills/subagents (e.g., for generating Dockerfiles, Helm charts, or troubleshooting deployments) to earn bonus points.
- Security: Implement basic RBAC, secrets management (e.g., Cohere API key as Kubernetes secret), and network policies.
- Observability: Add basic logging (structured JSON) and readiness/liveness probes.
- Testing: Validate deployment with end-to-end tests (e.g., chat interactions via kubectl port-forward).
- Documentation: Update README with Minikube setup, Helm install instructions, and AI skill usage.

## Constraints
- No manual coding or YAML editing — all implementation via Agentic Dev Stack: Constitution → Specify → Clarify → Plan → Tasks → Implement with Claude Code.
- Reuse existing tech stack: Next.js, FastAPI, SQLModel, Neon Serverless PostgreSQL, Better Auth, Cohere API, OpenAI ChatKit (custom backend), Official MCP SDK.
- Local-only deployment: Use Minikube (no cloud resources in Phase IV; save for Phase V).
- Performance: Ensure the deployed app responds in <3s for chat queries; optimize Docker images (<500MB total).
- Bonus Alignment: Incorporate "Cloud-Native Blueprints" via agent skills for spec-driven Kubernetes manifests.

## Success Criteria
- The full Phase III chatbot runs locally on Minikube: Accessible via browser, handles natural language todo management, persists data in Neon DB.
- Deployment is reproducible: Helm install succeeds on a fresh Minikube cluster.
- AI tools in action: Demonstrate kubectl-ai/kagent usage in CLAUDE.md or demo video.
- Reusable intelligence: Skills/subagents are created, tested, and used for deployment tasks (e.g., generating manifests).
- No downtime or data loss during deployment; user isolation preserved.
- Project earns Phase IV points (250) + bonuses (Reusable Intelligence + Cloud-Native Blueprints = +400 potential).
- Clean, secure, and efficient: Passes basic security scan (e.g., no exposed secrets) and performance test.
```

## Response snapshot

Updated constitution from version 1.2.0 to 1.3.0, replacing production readiness focus with Kubernetes deployment requirements.

**Changes made:**
- Replaced Phase IV Detailed Standards section:
  - Removed: UX improvements, reliability/resilience, new features (categories, tags, due dates, search, export), production readiness
  - Added: Containerization (Docker, multi-stage builds), Orchestration (Helm, Minikube), AI-Assisted DevOps (kubectl-ai, kagent), Reusable Intelligence (skills/subagents), Security (RBAC, Kubernetes Secrets), Observability (probes, health checks), Testing (end-to-end in K8s), Performance (<3s response, <500MB images), Documentation (Minikube setup, Helm usage)

- Updated Phase Consistency Rules for Phase IV:
  - Changed from production readiness to cloud-native Kubernetes deployment
  - Added emphasis on reusable intelligence, AIOps, spec-driven YAML generation
  - Specified local-only deployment with Minikube

- Replaced Phase IV Specific Quality Gates:
  - Removed: UX polish, new features, mobile responsiveness, production deployment
  - Added: Kubernetes deployment success, reproducible Helm install, AI tools demonstration, skills/subagents creation, containerization complete, security measures (Secrets, RBAC), observability (probes, health checks), performance targets, bonus points alignment

**Version bump rationale:** MINOR (1.2.0 → 1.3.0) - materially changed Phase IV direction from production readiness/UX improvements to cloud-native Kubernetes deployment with comprehensive new standards for containerization, orchestration, AI-assisted DevOps, and reusable intelligence.

## Outcome

- ✅ Impact: Constitution updated with comprehensive Phase IV Kubernetes deployment standards, establishing clear governance for containerization (Docker), orchestration (Helm, Minikube), AI-assisted DevOps (kubectl-ai, kagent), reusable intelligence (skills/subagents), security (RBAC, Secrets), and local cloud-native deployment
- 🧪 Tests: none (documentation update)
- 📁 Files: .specify/memory/constitution.md (version 1.3.0)
- 🔁 Next prompts: Feature specification for Phase IV Kubernetes deployment (containerization, Helm charts, Minikube setup, AI tools integration, skills development)
- 🧠 Reflection: Successfully pivoted Phase IV from production readiness to cloud-native deployment focus. Clear standards for Kubernetes, Docker, Helm, and AI-assisted DevOps align with hackathon bonus opportunities (Reusable Intelligence + Cloud-Native Blueprints = +400 points potential).

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS - all placeholders filled, version incremented correctly, sync impact report complete, direction change clearly documented
- Prompt variant (if applicable): standard constitution update workflow with major content replacement
- Next experiment (smallest change to try): Begin Phase IV feature specification for Kubernetes deployment, starting with containerization and Helm chart generation
