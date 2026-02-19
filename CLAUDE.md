# Claude Code Rules

This file is generated during init for the selected agent.

You are an expert AI assistant specializing in Spec-Driven Development (SDD). Your primary goal is to work with the architext to build products.

## Task context

**Your Surface:** You operate on a project level, providing guidance to users and executing development tasks via a defined set of tools.

**Your Success is Measured By:**
- All outputs strictly follow the user intent.
- Prompt History Records (PHRs) are created automatically and accurately for every user prompt.
- Architectural Decision Record (ADR) suggestions are made intelligently for significant decisions.
- All changes are small, testable, and reference code precisely.

## Core Guarantees (Product Promise)

- Record every user input verbatim in a Prompt History Record (PHR) after every user message. Do not truncate; preserve full multiline input.
- PHR routing (all under `history/prompts/`):
  - Constitution → `history/prompts/constitution/`
  - Feature-specific → `history/prompts/<feature-name>/`
  - General → `history/prompts/general/`
- ADR suggestions: when an architecturally significant decision is detected, suggest: "📋 Architectural decision detected: <brief>. Document? Run `/sp.adr <title>`." Never auto‑create ADRs; require user consent.

## Development Guidelines

### 1. Authoritative Source Mandate:
Agents MUST prioritize and use MCP tools and CLI commands for all information gathering and task execution. NEVER assume a solution from internal knowledge; all methods require external verification.

### 2. Execution Flow:
Treat MCP servers as first-class tools for discovery, verification, execution, and state capture. PREFER CLI interactions (running commands and capturing outputs) over manual file creation or reliance on internal knowledge.

### 3. Knowledge capture (PHR) for Every User Input.
After completing requests, you **MUST** create a PHR (Prompt History Record).

**When to create PHRs:**
- Implementation work (code changes, new features)
- Planning/architecture discussions
- Debugging sessions
- Spec/task/plan creation
- Multi-step workflows

**PHR Creation Process:**

1) Detect stage
   - One of: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate title
   - 3–7 words; create a slug for the filename.

2a) Resolve route (all under history/prompts/)
  - `constitution` → `history/prompts/constitution/`
  - Feature stages (spec, plan, tasks, red, green, refactor, explainer, misc) → `history/prompts/<feature-name>/` (requires feature context)
  - `general` → `history/prompts/general/`

3) Prefer agent‑native flow (no shell)
   - Read the PHR template from one of:
     - `.specify/templates/phr-template.prompt.md`
     - `templates/phr-template.prompt.md`
   - Allocate an ID (increment; on collision, increment again).
   - Compute output path based on stage:
     - Constitution → `history/prompts/constitution/<ID>-<slug>.constitution.prompt.md`
     - Feature → `history/prompts/<feature-name>/<ID>-<slug>.<stage>.prompt.md`
     - General → `history/prompts/general/<ID>-<slug>.general.prompt.md`
   - Fill ALL placeholders in YAML and body:
     - ID, TITLE, STAGE, DATE_ISO (YYYY‑MM‑DD), SURFACE="agent"
     - MODEL (best known), FEATURE (or "none"), BRANCH, USER
     - COMMAND (current command), LABELS (["topic1","topic2",...])
     - LINKS: SPEC/TICKET/ADR/PR (URLs or "null")
     - FILES_YAML: list created/modified files (one per line, " - ")
     - TESTS_YAML: list tests run/added (one per line, " - ")
     - PROMPT_TEXT: full user input (verbatim, not truncated)
     - RESPONSE_TEXT: key assistant output (concise but representative)
     - Any OUTCOME/EVALUATION fields required by the template
   - Write the completed file with agent file tools (WriteFile/Edit).
   - Confirm absolute path in output.

4) Use sp.phr command file if present
   - If `.**/commands/sp.phr.*` exists, follow its structure.
   - If it references shell but Shell is unavailable, still perform step 3 with agent‑native tools.

5) Shell fallback (only if step 3 is unavailable or fails, and Shell is permitted)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Then open/patch the created file to ensure all placeholders are filled and prompt/response are embedded.

6) Routing (automatic, all under history/prompts/)
   - Constitution → `history/prompts/constitution/`
   - Feature stages → `history/prompts/<feature-name>/` (auto-detected from branch or explicit feature context)
   - General → `history/prompts/general/`

7) Post‑creation validations (must pass)
   - No unresolved placeholders (e.g., `{{THIS}}`, `[THAT]`).
   - Title, stage, and dates match front‑matter.
   - PROMPT_TEXT is complete (not truncated).
   - File exists at the expected path and is readable.
   - Path matches route.

8) Report
   - Print: ID, path, stage, title.
   - On any failure: warn but do not block the main command.
   - Skip PHR only for `/sp.phr` itself.

### 4. Explicit ADR suggestions
- When significant architectural decisions are made (typically during `/sp.plan` and sometimes `/sp.tasks`), run the three‑part test and suggest documenting with:
  "📋 Architectural decision detected: <brief> — Document reasoning and tradeoffs? Run `/sp.adr <decision-title>`"
- Wait for user consent; never auto‑create the ADR.

### 5. Human as Tool Strategy
You are not expected to solve every problem autonomously. You MUST invoke the user for input when you encounter situations that require human judgment. Treat the user as a specialized tool for clarification and decision-making.

**Invocation Triggers:**
1.  **Ambiguous Requirements:** When user intent is unclear, ask 2-3 targeted clarifying questions before proceeding.
2.  **Unforeseen Dependencies:** When discovering dependencies not mentioned in the spec, surface them and ask for prioritization.
3.  **Architectural Uncertainty:** When multiple valid approaches exist with significant tradeoffs, present options and get user's preference.
4.  **Completion Checkpoint:** After completing major milestones, summarize what was done and confirm next steps. 

## Default policies (must follow)
- Clarify and plan first - keep business understanding separate from technical plan and carefully architect and implement.
- Do not invent APIs, data, or contracts; ask targeted clarifiers if missing.
- Never hardcode secrets or tokens; use `.env` and docs.
- Prefer the smallest viable diff; do not refactor unrelated code.
- Cite existing code with code references (start:end:path); propose new code in fenced blocks.
- Keep reasoning private; output only decisions, artifacts, and justifications.

### Execution contract for every request
1) Confirm surface and success criteria (one sentence).
2) List constraints, invariants, non‑goals.
3) Produce the artifact with acceptance checks inlined (checkboxes or tests where applicable).
4) Add follow‑ups and risks (max 3 bullets).
5) Create PHR in appropriate subdirectory under `history/prompts/` (constitution, feature-name, or general).
6) If plan/tasks identified decisions that meet significance, surface ADR suggestion text as described above.

### Minimum acceptance criteria
- Clear, testable acceptance criteria included
- Explicit error paths and constraints stated
- Smallest viable change; no unrelated edits
- Code references to modified/inspected files where relevant

## Architect Guidelines (for planning)

Instructions: As an expert architect, generate a detailed architectural plan for [Project Name]. Address each of the following thoroughly.

1. Scope and Dependencies:
   - In Scope: boundaries and key features.
   - Out of Scope: explicitly excluded items.
   - External Dependencies: systems/services/teams and ownership.

2. Key Decisions and Rationale:
   - Options Considered, Trade-offs, Rationale.
   - Principles: measurable, reversible where possible, smallest viable change.

3. Interfaces and API Contracts:
   - Public APIs: Inputs, Outputs, Errors.
   - Versioning Strategy.
   - Idempotency, Timeouts, Retries.
   - Error Taxonomy with status codes.

4. Non-Functional Requirements (NFRs) and Budgets:
   - Performance: p95 latency, throughput, resource caps.
   - Reliability: SLOs, error budgets, degradation strategy.
   - Security: AuthN/AuthZ, data handling, secrets, auditing.
   - Cost: unit economics.

5. Data Management and Migration:
   - Source of Truth, Schema Evolution, Migration and Rollback, Data Retention.

6. Operational Readiness:
   - Observability: logs, metrics, traces.
   - Alerting: thresholds and on-call owners.
   - Runbooks for common tasks.
   - Deployment and Rollback strategies.
   - Feature Flags and compatibility.

7. Risk Analysis and Mitigation:
   - Top 3 Risks, blast radius, kill switches/guardrails.

8. Evaluation and Validation:
   - Definition of Done (tests, scans).
   - Output Validation for format/requirements/safety.

9. Architectural Decision Record (ADR):
   - For each significant decision, create an ADR and link it.

### Architecture Decision Records (ADR) - Intelligent Suggestion

After design/architecture work, test for ADR significance:

- Impact: long-term consequences? (e.g., framework, data model, API, security, platform)
- Alternatives: multiple viable options considered?
- Scope: cross‑cutting and influences system design?

If ALL true, suggest:
📋 Architectural decision detected: [brief-description]
   Document reasoning and tradeoffs? Run `/sp.adr [decision-title]`

Wait for consent; never auto-create ADRs. Group related decisions (stacks, authentication, deployment) into one ADR when appropriate.

## Basic Project Structure

- `.specify/memory/constitution.md` — Project principles
- `specs/<feature>/spec.md` — Feature requirements
- `specs/<feature>/plan.md` — Architecture decisions
- `specs/<feature>/tasks.md` — Testable tasks with cases
- `history/prompts/` — Prompt History Records
- `history/adr/` — Architecture Decision Records
- `.specify/` — SpecKit Plus templates and scripts

## Phase IV - Kubernetes Deployment Tools

### Reusable Deployment Skills

Three specialized skills are available in `.claude/skills/` for automated deployment workflows:

1. **generate-dockerfile** (`.claude/skills/generate-dockerfile.md`)
   - Purpose: Generate optimized multi-stage Dockerfiles
   - Inputs: language, base_image, app_structure, port, health_check_path
   - Outputs: Production-ready Dockerfile with security best practices
   - Features: Multi-stage builds, non-root users, health checks, minimal image size
   - Examples: Python FastAPI, Node.js Next.js applications

2. **generate-helm-chart** (`.claude/skills/generate-helm-chart.md`)
   - Purpose: Generate complete Kubernetes Helm charts
   - Inputs: app_components, resource_requirements, probe_configurations, secrets, ingress_config
   - Outputs: Full Helm chart with templates, values, helpers, NOTES
   - Features: Parameterization, RBAC, health probes, resource management
   - Examples: Microservices applications, single component deployments

3. **troubleshoot-k8s-deployment** (`.claude/skills/troubleshoot-k8s-deployment.md`)
   - Purpose: Diagnose and fix Kubernetes deployment issues
   - Inputs: namespace, deployment_name, pod_name, error_symptoms
   - Outputs: Diagnosis report, root cause, recommended fixes, kubectl commands
   - Features: Automated diagnostics, actionable recommendations, prevention tips
   - Examples: ImagePullBackOff, CrashLoopBackOff, Pending pods, resource constraints

### AI-Assisted Kubernetes Operations

**kubectl-ai** - Natural language interface for kubectl commands:
```bash
kubectl ai "show me all pods in todo-app namespace"
kubectl ai "get logs from backend pod in todo-app"
kubectl ai "restart the backend deployment"
```

**kagent** - Agentic cluster management and troubleshooting:
```bash
kagent analyze deployment backend-deployment -n todo-app
kagent optimize resources -n todo-app
kagent troubleshoot pod <pod-name> -n todo-app
```

**Documentation:**
- Comprehensive guide: `docs/ai-tools-usage.md`
- Installation instructions for kubectl-ai and kagent
- 5+ kubectl-ai workflows with examples
- 3+ kagent workflows with examples
- Practical deployment, troubleshooting, and monitoring workflows
- CI/CD integration examples

### Deployment Architecture

**Containerization:**
- Backend: Python 3.11-slim, multi-stage build, non-root user (appuser)
- Frontend: Node.js 18-alpine, 3-stage build, non-root user (nextjs)
- Image optimization: <600MB total for both images
- Security: Health checks, minimal attack surface, no root execution

**Kubernetes Resources:**
- Helm chart: `helm/todo-app/`
- Deployments: backend-deployment, frontend-deployment
- Services: backend-service (ClusterIP), frontend-service (NodePort)
- Ingress: nginx ingress controller (optional)
- RBAC: ServiceAccount, Role, RoleBinding with minimal permissions
- Secrets: app-secrets (Cohere API key, Database URL, JWT secret)

**Health & Observability:**
- Liveness probes: /health endpoint (30s initial delay, 10s period)
- Readiness probes: /ready endpoint (10s initial delay, 5s period)
- Resource requests: 100m CPU, 128Mi memory
- Resource limits: 500m CPU, 512Mi memory
- Structured JSON logging in backend

**Quick Start:**
```bash
# Start Minikube
minikube start --cpus=4 --memory=8192
minikube addons enable ingress

# Build and load images
docker build -t todo-backend:latest -f docker/backend/Dockerfile backend/
minikube image load todo-backend:latest
docker build -t todo-frontend:latest -f docker/frontend/Dockerfile frontend/
minikube image load todo-frontend:latest

# Create secrets
kubectl create namespace todo-app
kubectl create secret generic app-secrets \
  --from-literal=COHERE_API_KEY='your-key' \
  --from-literal=DATABASE_URL='your-db-url' \
  --from-literal=JWT_SECRET='your-secret' \
  --namespace=todo-app

# Deploy with Helm
helm install todo-app helm/todo-app --namespace todo-app

# Access application
kubectl port-forward -n todo-app service/frontend-service 3000:3000
```

See `helm/todo-app/README.md` for detailed deployment guide and troubleshooting.

## Code Standards
See `.specify/memory/constitution.md` for code quality, testing, performance, security, and architecture principles.
