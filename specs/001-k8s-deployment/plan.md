# Implementation Plan: Local Kubernetes Deployment

**Branch**: `001-k8s-deployment` | **Date**: 2026-02-18 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-k8s-deployment/spec.md`

**Note**: This plan focuses on deployment infrastructure, not application code changes. All Phase III application functionality remains unchanged.

## Summary

Deploy the complete Phase III Todo AI Chatbot application (FastAPI backend with MCP tools and Cohere agent, Next.js frontend with ChatKit integration, Neon Serverless PostgreSQL) to a local Minikube Kubernetes cluster. Demonstrate cloud-native principles through containerization (Docker), orchestration (Helm), AI-assisted operations (kubectl-ai, kagent), and reusable deployment intelligence (skills/subagents). Achieve reproducible, secure, observable deployment while preserving 100% of existing application functionality and earning hackathon bonus points for AI-native DevOps approach.

## Technical Context

**Language/Version**:
- Backend: Python 3.11+ (existing Phase III FastAPI application)
- Frontend: Node.js 18+ / Next.js 14+ (existing Phase III application)
- Container Runtime: Docker 24+
- Orchestration: Kubernetes 1.28+ (via Minikube)

**Primary Dependencies**:
- **Containerization**: Docker, multi-stage builds
- **Orchestration**: Minikube, Helm 3+, kubectl
- **AI Tools**: kubectl-ai (natural language K8s commands), kagent (agentic cluster management)
- **Existing Stack**: FastAPI, SQLModel, Next.js, Cohere API, Neon PostgreSQL, Better Auth, MCP SDK
- **Base Images**: python:3.11-slim, node:18-alpine

**Storage**:
- Neon Serverless PostgreSQL (external to cluster, connection via Secret)
- Kubernetes Secrets for sensitive credentials
- No persistent volumes needed (stateless application)

**Testing**:
- End-to-end deployment tests (helm install, pod readiness, chat functionality)
- Security scans (container image vulnerability scanning)
- Integration tests (natural language commands → task CRUD → DB persistence)

**Target Platform**:
- Local development: Minikube on Windows/macOS/Linux
- Container images: linux/amd64 architecture
- Kubernetes version: 1.28+ (Minikube default)

**Project Type**: Deployment infrastructure (not application code changes)

**Performance Goals**:
- Deployment time: <5 minutes from helm install to all pods ready
- Pod startup time: <30 seconds per component
- Chat response time: <3 seconds for 95% of requests
- Container image size: <600MB total for both images

**Constraints**:
- MUST NOT modify Phase III application code
- MUST use Minikube only (no cloud clusters)
- MUST generate all YAML via spec-driven process (no manual editing)
- MUST keep Neon DB external (not deployed in cluster)
- MUST maintain 100% user isolation
- MUST achieve <600MB total image size

**Scale/Scope**:
- Single-node Minikube cluster
- 1 replica per component (backend, frontend)
- Local development/demo environment
- 2-3 reusable skills/subagents for bonus points

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase IV Kubernetes Deployment Standards

✅ **Containerization Requirements**
- Multi-stage builds for optimization: PASS (planned in Dockerfiles)
- Official base images: PASS (python:3.11-slim, node:18-alpine)
- No hardcoded secrets: PASS (Kubernetes Secrets)
- Health check instructions: PASS (planned in Dockerfiles)
- Reproducible builds: PASS (deterministic Dockerfiles)
- <600MB total image size: PASS (target constraint)

✅ **Orchestration Requirements**
- Helm charts for packaging: PASS (planned)
- Spec-driven manifest generation: PASS (no manual YAML)
- Resource limits and requests: PASS (planned in templates)
- Readiness and liveness probes: PASS (planned)
- Minikube deployment: PASS (target platform)
- Idempotent deployment: PASS (Helm design)

✅ **Security Requirements**
- Kubernetes Secrets for credentials: PASS (planned)
- Runtime secret injection: PASS (via Secret mounts)
- Basic RBAC: PASS (planned)
- No secrets in images: PASS (validation required)
- Input validation: PASS (existing Phase III)

✅ **Observability Requirements**
- Structured JSON logging: PASS (existing Phase III backend)
- Readiness probes: PASS (planned)
- Liveness probes: PASS (planned)
- Health check endpoints: PASS (planned /health, /ready)
- Cluster logging access: PASS (kubectl logs)

✅ **AI-Assisted Operations**
- kubectl-ai integration: PASS (planned)
- kagent integration: PASS (planned)
- Documentation with examples: PASS (planned in README)

✅ **Reusable Intelligence**
- 2+ skills/subagents: PASS (planned: dockerfile-generator, helm-chart-generator, deployment-troubleshooter)
- Documented with inputs/outputs: PASS (planned)
- Testable independently: PASS (design requirement)
- Spec-driven development: PASS (follows SDD)

✅ **Backward Compatibility**
- No Phase III code changes: PASS (deployment only)
- User isolation maintained: PASS (no changes to auth)
- Conversation persistence: PASS (Neon DB external)
- All 5 MCP tools work: PASS (no changes)
- Cohere API integration: PASS (no changes)

### Core Principles Compliance

✅ **Spec-First Development**: This plan follows spec → plan → tasks → implement workflow
✅ **Zero Manual Coding**: All artifacts generated via Claude Code
✅ **Phase Isolation**: Only Phase IV deployment work, no Phase V features
✅ **Deterministic Architecture**: Reproducible deployment process
✅ **AI-Native Design**: kubectl-ai, kagent, and reusable skills demonstrate AI-first approach
✅ **Cloud-Native Readiness**: Containerization and Kubernetes orchestration

**GATE STATUS**: ✅ PASS - All constitution requirements satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-k8s-deployment/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output - Docker/Helm/K8s best practices
├── data-model.md        # Phase 1 output - Deployment entities and relationships
├── quickstart.md        # Phase 1 output - Quick deployment guide
├── contracts/           # Phase 1 output - Helm values schema, health check contracts
│   ├── helm-values-schema.yaml
│   ├── health-check-api.yaml
│   └── secret-structure.yaml
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Deployment Infrastructure (NEW for Phase IV)
docker/
├── backend/
│   ├── Dockerfile           # Multi-stage build for FastAPI backend
│   └── .dockerignore
└── frontend/
    ├── Dockerfile           # Multi-stage build for Next.js frontend
    └── .dockerignore

helm/
└── todo-app/
    ├── Chart.yaml           # Helm chart metadata
    ├── values.yaml          # Default configuration values
    ├── values-dev.yaml      # Development overrides
    ├── values-prod.yaml     # Production overrides (for Phase V)
    └── templates/
        ├── _helpers.tpl     # Template helpers
        ├── namespace.yaml   # Namespace definition
        ├── secret.yaml      # Secrets for Cohere API key, DB connection
        ├── configmap.yaml   # Non-sensitive configuration
        ├── deployment-backend.yaml   # Backend deployment
        ├── deployment-frontend.yaml  # Frontend deployment
        ├── service-backend.yaml      # Backend ClusterIP service
        ├── service-frontend.yaml     # Frontend NodePort service
        ├── ingress.yaml              # Ingress for external access
        └── NOTES.txt                 # Post-install instructions

.claude/
└── skills/
    ├── dockerfile-generator/     # Skill: Generate optimized Dockerfiles
    │   ├── skill.md
    │   └── examples/
    ├── helm-chart-generator/     # Skill: Generate Helm chart templates
    │   ├── skill.md
    │   └── examples/
    └── k8s-troubleshooter/       # Skill: Diagnose deployment issues
        ├── skill.md
        └── examples/

docs/
├── deployment/
│   ├── minikube-setup.md        # Minikube installation and configuration
│   ├── helm-deployment.md       # Helm installation guide
│   ├── troubleshooting.md       # Common issues and solutions
│   └── ai-tools-usage.md        # kubectl-ai and kagent examples
└── architecture/
    └── kubernetes-architecture.md  # Architecture diagram and explanation

# Existing Application Code (NO CHANGES for Phase IV)
backend/                 # Existing Phase III FastAPI application
frontend/                # Existing Phase III Next.js application
```

**Structure Decision**: This is a deployment infrastructure project that adds containerization and orchestration to the existing Phase III application. The structure separates deployment artifacts (docker/, helm/, .claude/skills/) from application code (backend/, frontend/). No changes to existing application code are required - only new deployment infrastructure is added.

## Architecture Overview

### High-Level Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Developer Machine                         │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Minikube Cluster                         │ │
│  │                  (Single-node Kubernetes)                   │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │              Namespace: todo-app                      │  │ │
│  │  │                                                        │  │ │
│  │  │  ┌─────────────────────┐    ┌────────────────────┐  │  │ │
│  │  │  │   Backend Pod       │    │   Frontend Pod     │  │  │ │
│  │  │  │                     │    │                    │  │  │ │
│  │  │  │  FastAPI + MCP      │    │  Next.js + ChatKit │  │  │ │
│  │  │  │  + Cohere Agent     │    │                    │  │  │ │
│  │  │  │                     │    │                    │  │  │ │
│  │  │  │  Deployment (1)     │    │  Deployment (1)    │  │  │ │
│  │  │  │  Readiness Probe    │    │  Readiness Probe   │  │  │ │
│  │  │  │  Liveness Probe     │    │  Liveness Probe    │  │  │ │
│  │  │  └──────────┬──────────┘    └─────────┬──────────┘  │  │ │
│  │  │             │                          │             │  │ │
│  │  │  ┌──────────▼──────────┐    ┌─────────▼──────────┐ │  │ │
│  │  │  │  Service (ClusterIP)│    │ Service (NodePort) │ │  │ │
│  │  │  │  backend-service    │    │ frontend-service   │ │  │ │
│  │  │  └──────────┬──────────┘    └─────────┬──────────┘ │  │ │
│  │  │             │                          │             │  │ │
│  │  │             └──────────┬───────────────┘             │  │ │
│  │  │                        │                             │  │ │
│  │  │             ┌──────────▼──────────┐                  │  │ │
│  │  │             │  Ingress (optional) │                  │  │ │
│  │  │             │  nginx-ingress      │                  │  │ │
│  │  │             └──────────┬──────────┘                  │  │ │
│  │  │                        │                             │  │ │
│  │  │  ┌─────────────────────┴──────────────────────────┐ │  │ │
│  │  │  │              Kubernetes Secrets                 │ │  │ │
│  │  │  │  - COHERE_API_KEY                               │ │  │ │
│  │  │  │  - DATABASE_URL (Neon connection string)        │ │  │ │
│  │  │  │  - JWT_SECRET                                   │ │  │ │
│  │  │  └─────────────────────────────────────────────────┘ │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Access Methods:                                                │
│  - kubectl port-forward service/frontend-service 3000:3000     │
│  - minikube service frontend-service                            │
│  - Ingress: http://todo-app.local (if ingress enabled)         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
                  ┌───────────────────────┐
                  │  External Services    │
                  │                       │
                  │  - Neon PostgreSQL    │
                  │  - Cohere API         │
                  └───────────────────────┘
```

### Data Flow

1. **User → Frontend**: Browser accesses frontend via port-forward/ingress
2. **Frontend → Backend**: ChatKit sends messages to backend service (ClusterIP)
3. **Backend → Cohere**: Backend calls Cohere API for LLM operations
4. **Backend → MCP Tools**: Agent invokes MCP tools for task operations
5. **MCP Tools → Neon DB**: Tools query/update tasks in external Neon database
6. **Backend → Frontend**: Response flows back through services to user

### Secret Management Flow

1. Secrets created in Kubernetes (kubectl create secret or Helm template)
2. Secrets mounted as environment variables in pods
3. Application reads secrets from environment at runtime
4. No secrets in container images or version control

## Complexity Tracking

> **No violations detected** - All constitution requirements are satisfied by the planned approach.

This section intentionally left empty as there are no constitution violations requiring justification.

## Key Decisions & Tradeoffs

| Decision | Options Considered | Chosen | Rationale / Trade-off |
|----------|-------------------|--------|----------------------|
| **Image Storage** | Docker Hub / Local registry / minikube image load | minikube image load | Faster iteration, no push/pull overhead, no registry setup needed. Trade-off: Images not shareable across machines (acceptable for local dev). |
| **Ingress vs Port-Forward** | Port-forward only / Ingress with nginx addon | Ingress + nginx addon | More realistic production simulation, better UX, demonstrates K8s networking. Trade-off: Requires addon setup (minimal effort). |
| **Replica Count** | 1 replica / 2+ replicas | 1 replica per component | Minikube resource constraints, simpler debugging. Trade-off: No HA demonstration (acceptable for Phase IV scope). |
| **Helm Chart Structure** | Single monolithic chart / Separate subcharts per component | Single chart with multiple templates | Simpler maintenance, easier to understand, sufficient for Phase IV. Trade-off: Less modular (acceptable for current scope). |
| **Secrets Management** | Plain environment variables / Kubernetes Secrets / External secret manager | Kubernetes Secrets | Native K8s approach, secure, follows best practices. Trade-off: Manual secret creation step (documented in quickstart). |
| **Base Images** | Alpine / Slim / Full | python:3.11-slim, node:18-alpine | Balance between size and compatibility. Slim for Python (better compatibility), Alpine for Node (smaller size). |
| **AI Tool Integration** | Claude Code only / + kubectl-ai / + kubectl-ai + kagent | kubectl-ai + kagent | Maximizes hackathon bonus points, demonstrates AI-native DevOps. Trade-off: Additional tool setup (documented). |
| **Reusable Intelligence Scope** | Minimal (1 skill) / Medium (2-3 skills) / High (5+ skills) | Medium (3 skills) | Targets +200 to +400 bonus points, demonstrates capability without over-engineering. Skills: dockerfile-generator, helm-chart-generator, k8s-troubleshooter. |
| **Health Check Strategy** | Liveness only / Readiness only / Both | Both liveness and readiness probes | Proper K8s pattern, enables self-healing and traffic management. Trade-off: Requires /health and /ready endpoints (minimal backend changes). |
| **Logging Approach** | Container stdout/stderr / Sidecar logging / External logging service | Container stdout/stderr | Standard K8s pattern, works with kubectl logs, sufficient for Phase IV. Trade-off: No centralized logging (acceptable, can add in Phase V). |

## Implementation Phases

### Phase 0: Research & Best Practices

**Objective**: Research and document best practices for Docker, Helm, and Kubernetes deployment patterns specific to FastAPI and Next.js applications.

**Research Tasks**:

1. **Docker Multi-Stage Builds**
   - Research optimal multi-stage build patterns for Python FastAPI applications
   - Research optimal multi-stage build patterns for Next.js applications
   - Investigate layer caching strategies for faster rebuilds
   - Document base image selection criteria (slim vs alpine vs distroless)

2. **Helm Chart Best Practices**
   - Research Helm chart structure for microservices applications
   - Investigate values.yaml organization patterns
   - Document template helper functions for DRY principles
   - Research secret management patterns in Helm

3. **Kubernetes Health Checks**
   - Research readiness vs liveness probe patterns
   - Document appropriate timeouts and thresholds
   - Investigate startup probes for slow-starting applications

4. **Resource Management**
   - Research appropriate resource requests/limits for FastAPI and Next.js
   - Document Minikube resource allocation recommendations
   - Investigate QoS classes (Guaranteed, Burstable, BestEffort)

5. **Security Best Practices**
   - Research Kubernetes RBAC patterns for application deployments
   - Document secret rotation strategies
   - Investigate pod security standards
   - Research network policy patterns

**Output**: `research.md` with consolidated findings, decisions, and rationale for each area.

### Phase 1: Design & Contracts

**Objective**: Define deployment entities, relationships, and contracts for the Kubernetes deployment.

**Design Tasks**:

1. **Deployment Entities** (`data-model.md`)
   - Container Image: Properties (name, tag, size, base image, layers)
   - Deployment: Properties (replicas, strategy, selectors, pod template)
   - Service: Properties (type, ports, selectors, endpoints)
   - Secret: Properties (name, keys, mount paths, environment variables)
   - Ingress: Properties (host, paths, backend services, TLS)
   - Health Check: Properties (path, port, initial delay, period, timeout, threshold)

2. **API Contracts** (`contracts/`)
   - `helm-values-schema.yaml`: JSON Schema for values.yaml validation
   - `health-check-api.yaml`: OpenAPI spec for /health and /ready endpoints
   - `secret-structure.yaml`: Document required secrets and their structure

3. **Quickstart Guide** (`quickstart.md`)
   - Prerequisites checklist (Minikube, Docker, Helm, kubectl)
   - Step-by-step deployment instructions
   - Verification steps
   - Troubleshooting quick reference

**Output**: `data-model.md`, `contracts/` directory with schemas, `quickstart.md`

### Phase A: Container Preparation

**Objective**: Create optimized, secure Docker images for backend and frontend.

**Tasks**:

1. **Backend Dockerfile Generation**
   - Use dockerfile-generator skill to create multi-stage Dockerfile
   - Stage 1: Build dependencies (pip install)
   - Stage 2: Production runtime (copy only necessary files)
   - Add health check instruction
   - Optimize layer caching (COPY requirements.txt before code)
   - Target size: <300MB

2. **Frontend Dockerfile Generation**
   - Use dockerfile-generator skill to create multi-stage Dockerfile
   - Stage 1: Build Next.js application (npm run build)
   - Stage 2: Production runtime (node or nginx serve)
   - Optimize for static asset serving
   - Target size: <250MB

3. **Build and Validate Images**
   - Build images locally: `docker build -t todo-backend:latest -f docker/backend/Dockerfile backend/`
   - Build images locally: `docker build -t todo-frontend:latest -f docker/frontend/Dockerfile frontend/`
   - Scan for vulnerabilities: `docker scan todo-backend:latest`
   - Verify no secrets in images: `docker history todo-backend:latest`
   - Check image sizes: `docker images | grep todo-`

4. **Load Images into Minikube**
   - `minikube image load todo-backend:latest`
   - `minikube image load todo-frontend:latest`
   - Verify: `minikube image ls | grep todo-`

**Acceptance Criteria**:
- Both images build successfully without errors
- Total image size <600MB
- No secrets found in image layers
- Images load into Minikube successfully

### Phase B: Helm Chart Generation

**Objective**: Generate complete, parameterized Helm chart for the application.

**Tasks**:

1. **Chart Structure Creation**
   - Use helm-chart-generator skill to create base structure
   - Generate Chart.yaml with metadata
   - Generate values.yaml with sensible defaults
   - Create values-dev.yaml for local development overrides

2. **Template Generation**
   - Generate namespace.yaml (optional, for isolation)
   - Generate secret.yaml (template for Cohere API key, DB URL, JWT secret)
   - Generate configmap.yaml (non-sensitive config)
   - Generate deployment-backend.yaml (with probes, resources, secret mounts)
   - Generate deployment-frontend.yaml (with probes, resources, env vars)
   - Generate service-backend.yaml (ClusterIP for internal access)
   - Generate service-frontend.yaml (NodePort for external access)
   - Generate ingress.yaml (optional, for nginx-ingress)
   - Generate _helpers.tpl (template helper functions)
   - Generate NOTES.txt (post-install instructions)

3. **Values Configuration**
   - Define image names and tags
   - Define replica counts (1 for each)
   - Define resource requests/limits (CPU: 100m-500m, Memory: 128Mi-512Mi)
   - Define probe configurations (initial delay, period, timeout)
   - Define service ports (backend: 8000, frontend: 3000)
   - Define ingress host (todo-app.local)

4. **Chart Validation**
   - Lint chart: `helm lint helm/todo-app`
   - Dry-run install: `helm install todo-app helm/todo-app --dry-run --debug`
   - Validate generated YAML: `helm template todo-app helm/todo-app | kubectl apply --dry-run=client -f -`

**Acceptance Criteria**:
- Helm chart passes lint without errors
- Dry-run generates valid Kubernetes YAML
- All templates render correctly with default values
- Chart is parameterized and reusable

### Phase C: Minikube & Cluster Setup

**Objective**: Prepare Minikube cluster and create required secrets.

**Tasks**:

1. **Minikube Initialization**
   - Start Minikube: `minikube start --cpus=4 --memory=8192 --driver=docker`
   - Enable ingress addon: `minikube addons enable ingress`
   - Enable metrics-server (optional): `minikube addons enable metrics-server`
   - Verify cluster: `kubectl cluster-info`

2. **Namespace Creation**
   - Create namespace: `kubectl create namespace todo-app` (or via Helm)
   - Set default namespace: `kubectl config set-context --current --namespace=todo-app`

3. **Secret Creation**
   - Create secret for Cohere API key:
     ```bash
     kubectl create secret generic cohere-secret \
       --from-literal=COHERE_API_KEY=<key> \
       -n todo-app
     ```
   - Create secret for database connection:
     ```bash
     kubectl create secret generic database-secret \
       --from-literal=DATABASE_URL=<neon-connection-string> \
       -n todo-app
     ```
   - Create secret for JWT:
     ```bash
     kubectl create secret generic jwt-secret \
       --from-literal=JWT_SECRET=<secret> \
       -n todo-app
     ```
   - Verify secrets: `kubectl get secrets -n todo-app`

4. **Ingress Configuration**
   - Add entry to /etc/hosts: `<minikube-ip> todo-app.local`
   - Get Minikube IP: `minikube ip`

**Acceptance Criteria**:
- Minikube cluster is running and accessible
- Ingress addon is enabled
- All secrets are created and accessible
- Namespace is configured

### Phase D: Deployment & First Run

**Objective**: Deploy application to Minikube and verify all components are running.

**Tasks**:

1. **Helm Deployment**
   - Install chart: `helm install todo-app helm/todo-app -n todo-app`
   - Watch deployment: `kubectl get pods -n todo-app -w`
   - Wait for ready: `kubectl wait --for=condition=ready pod -l app=todo-backend -n todo-app --timeout=120s`

2. **Deployment Verification**
   - Check pod status: `kubectl get pods -n todo-app`
   - Check services: `kubectl get svc -n todo-app`
   - Check ingress: `kubectl get ingress -n todo-app`
   - View logs: `kubectl logs -l app=todo-backend -n todo-app --tail=50`

3. **Health Check Validation**
   - Port-forward backend: `kubectl port-forward svc/backend-service 8000:8000 -n todo-app`
   - Test health endpoint: `curl http://localhost:8000/health`
   - Test ready endpoint: `curl http://localhost:8000/ready`
   - Verify probe status: `kubectl describe pod <backend-pod> -n todo-app | grep -A 5 Liveness`

4. **Troubleshooting (if needed)**
   - Use k8s-troubleshooter skill to diagnose issues
   - Check events: `kubectl get events -n todo-app --sort-by='.lastTimestamp'`
   - Describe failing pods: `kubectl describe pod <pod-name> -n todo-app`
   - Check logs for errors: `kubectl logs <pod-name> -n todo-app`

**Acceptance Criteria**:
- All pods reach Running state
- All pods pass readiness checks
- Health endpoints respond successfully
- No error events in cluster

### Phase E: Verification & Demo Preparation

**Objective**: Validate end-to-end functionality and prepare demo artifacts.

**Tasks**:

1. **Access Configuration**
   - Port-forward frontend: `kubectl port-forward svc/frontend-service 3000:3000 -n todo-app`
   - Or use ingress: `http://todo-app.local`
   - Or use minikube service: `minikube service frontend-service -n todo-app`

2. **End-to-End Testing**
   - Open browser to frontend URL
   - Login with test user credentials
   - Test natural language commands:
     - "Add a task to buy groceries"
     - "Show me all my tasks"
     - "Mark the groceries task as complete"
     - "Delete the completed task"
     - "Update my first task to say 'Buy organic groceries'"
   - Verify conversation persists (check Neon DB)
   - Restart backend pod: `kubectl delete pod -l app=todo-backend -n todo-app`
   - Wait for new pod: `kubectl wait --for=condition=ready pod -l app=todo-backend -n todo-app`
   - Verify conversation history is restored

3. **Security Validation**
   - Verify no secrets in pod describe: `kubectl describe pod <backend-pod> -n todo-app | grep -i secret`
   - Scan images for vulnerabilities: `docker scan todo-backend:latest`
   - Check RBAC: `kubectl auth can-i --list -n todo-app`

4. **Performance Validation**
   - Measure deployment time (from helm install to all pods ready)
   - Measure pod startup time: `kubectl get pods -n todo-app -o jsonpath='{.items[*].status.containerStatuses[*].state.running.startedAt}'`
   - Measure chat response time (manual testing with stopwatch)
   - Check image sizes: `docker images | grep todo-`

5. **Documentation Updates**
   - Update README.md with deployment instructions
   - Document kubectl-ai usage examples
   - Document kagent usage examples
   - Create troubleshooting guide
   - Document architecture with diagram

6. **Demo Video Recording**
   - Record <90 second video showing:
     - Minikube dashboard or `kubectl get pods`
     - Browser accessing chat interface
     - Natural language task creation
     - Task visible in UI
     - Pod restart and conversation persistence

## Testing & Validation Strategy

### Unit-Level Testing

**Container Images**:
- Build test: Images build without errors
- Size test: Total size <600MB
- Security test: No vulnerabilities (critical/high)
- Secret test: No hardcoded secrets in layers
- Layer test: Efficient layer caching (minimal rebuilds)

**Helm Charts**:
- Lint test: `helm lint` passes without errors
- Template test: All templates render with default values
- Validation test: Generated YAML is valid Kubernetes syntax
- Schema test: values.yaml conforms to schema

### Integration Testing

**Deployment Flow**:
- Minikube start → success
- Helm install → all pods Running
- Health checks → all probes passing
- Service discovery → backend accessible from frontend
- Secret injection → environment variables populated
- Ingress → external access working

**Application Functionality**:
- Login → authentication works
- Chat interface → loads and connects to backend
- Natural language → all 5 MCP tools work
- Database persistence → tasks stored in Neon
- Conversation history → persists across restarts

### End-to-End Testing

**Complete User Journey**:
1. Fresh Minikube cluster
2. Deploy via Helm
3. Access frontend
4. Login as test user
5. Execute 6-8 natural language commands
6. Verify tasks in database
7. Restart backend pod
8. Verify conversation restored
9. Verify no data loss

**Edge Cases**:
- Invalid Cohere API key → meaningful error message
- Database unreachable → retry with backoff, health check fails
- Backend pod crash → Kubernetes restarts within 30s
- High message volume → no crashes, graceful handling
- Missing secret → pod fails to start with clear error

### Performance Testing

**Deployment Performance**:
- Helm install to all pods ready: <5 minutes
- Pod startup time: <30 seconds per component
- Image pull time: <2 minutes (first time)

**Application Performance**:
- Chat response time: <3 seconds for 95% of requests
- Health check response: <1 second
- Frontend load time: <2 seconds

### Security Testing

**Secret Management**:
- No secrets in `docker history`
- No secrets in `kubectl describe pod`
- Secrets accessible only to authorized pods
- Secret rotation works without image rebuild

**Access Control**:
- RBAC policies enforced
- Network policies (if implemented)
- Pod security standards compliance

### Acceptance Test Checklist

- [ ] Minikube starts successfully
- [ ] Helm install completes without errors
- [ ] All pods reach Running state within 2 minutes
- [ ] All readiness probes pass
- [ ] All liveness probes pass
- [ ] Frontend accessible via browser
- [ ] Backend health endpoint responds
- [ ] Login works with test credentials
- [ ] Natural language command: "Add task" works
- [ ] Natural language command: "List tasks" works
- [ ] Natural language command: "Complete task" works
- [ ] Natural language command: "Delete task" works
- [ ] Natural language command: "Update task" works
- [ ] Tasks persist in Neon database
- [ ] Conversation history persists
- [ ] Pod restart preserves conversation
- [ ] No secrets in pod describe output
- [ ] Container images <600MB total
- [ ] Deployment time <5 minutes
- [ ] Chat response time <3 seconds
- [ ] kubectl-ai usage documented
- [ ] kagent usage documented
- [ ] 2+ reusable skills created
- [ ] Demo video recorded (<90 seconds)
- [ ] README updated with deployment instructions
- [ ] Troubleshooting guide created

## Risk Analysis & Mitigation

### High-Priority Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| **Minikube resource exhaustion** | Deployment fails, pods crash | Medium | Document minimum requirements (8GB RAM, 4 CPU), provide resource limit recommendations, test on constrained environment |
| **Image size exceeds 600MB** | Fails success criteria | Medium | Use multi-stage builds, alpine/slim base images, remove unnecessary dependencies, validate early in Phase A |
| **Secrets accidentally committed** | Security violation, disqualification | Low | Add .dockerignore, .gitignore, use pre-commit hooks, document secret management process |
| **Phase III functionality breaks** | Fails backward compatibility requirement | Low | No application code changes, thorough end-to-end testing, validate all 5 MCP tools |
| **Helm chart generation errors** | Deployment fails | Medium | Use helm-chart-generator skill, validate with helm lint, test dry-run early |
| **Network connectivity issues** | Pods can't reach Neon DB or Cohere API | Medium | Document network requirements, test external connectivity, provide troubleshooting steps |

### Medium-Priority Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| **kubectl-ai/kagent not available** | Lose bonus points | Low | Document installation steps, provide fallback to standard kubectl, demonstrate in video |
| **Ingress addon issues** | External access fails | Medium | Provide port-forward alternative, document ingress troubleshooting, test on multiple platforms |
| **Health check false positives** | Unnecessary pod restarts | Medium | Tune probe parameters (initial delay, period, threshold), test under load |
| **Slow image builds** | Development iteration slow | Medium | Optimize Dockerfile layer caching, use .dockerignore, document build optimization |
| **Helm values complexity** | Configuration errors | Low | Provide sensible defaults, document all values, create values-dev.yaml example |

### Low-Priority Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| **Demo video quality issues** | Poor presentation | Low | Test recording setup, prepare script, record multiple takes |
| **Documentation incomplete** | User confusion | Low | Follow documentation checklist, peer review, test with fresh user |
| **Skills not reusable** | Lose bonus points | Low | Design skills generically, test on different project, document clearly |

## Success Metrics

### Functional Success Criteria

✅ **Deployment Success**:
- Helm install completes without errors
- All pods reach Running state
- All health checks pass
- Application accessible via browser

✅ **Backward Compatibility**:
- All 5 MCP tools work (add, list, complete, delete, update)
- User authentication works
- Conversation persistence works
- No Phase III functionality broken

✅ **Security**:
- Zero secrets in container images (verified by scan)
- Zero secrets in pod configurations (verified by kubectl describe)
- Kubernetes Secrets used for all sensitive data
- Basic RBAC implemented

✅ **Observability**:
- Structured JSON logging in backend
- Readiness probes configured and passing
- Liveness probes configured and passing
- Health endpoints responding

### Performance Success Criteria

✅ **Deployment Performance**:
- Deployment time: <5 minutes (target: 3-4 minutes)
- Pod startup time: <30 seconds (target: 15-20 seconds)
- Image size: <600MB total (target: 400-500MB)

✅ **Application Performance**:
- Chat response time: <3 seconds for 95% of requests (target: 1-2 seconds)
- Health check response: <1 second
- Frontend load time: <2 seconds

### Bonus Points Success Criteria

✅ **AI-Assisted Operations**:
- kubectl-ai installed and demonstrated
- kagent installed and demonstrated
- At least 3 usage examples documented
- Demonstrated in demo video or README

✅ **Reusable Intelligence**:
- 2+ skills/subagents created (target: 3)
- Skills documented with inputs/outputs/examples
- Skills tested and working
- Skills demonstrate reusability across projects

**Bonus Points Calculation**:
- Reusable Intelligence (2-3 skills): +200 to +300 points
- Cloud-Native Blueprints (spec-driven manifests): +100 to +200 points
- **Total Potential Bonus**: +300 to +500 points

### Quality Success Criteria

✅ **Code Quality**:
- All artifacts generated via Claude Code (no manual YAML)
- Follows spec-driven development workflow
- Clean, well-organized structure
- Comprehensive documentation

✅ **Reproducibility**:
- Deployment succeeds on fresh Minikube cluster
- Deployment succeeds on 3 different machines
- Single-command deployment (helm install)
- Clear documentation enables 15-minute setup

✅ **Demonstration**:
- Demo video <90 seconds
- Shows Minikube dashboard or kubectl get pods
- Shows browser chat interaction
- Shows natural language task creation
- Shows task visible in UI

## Next Steps

After completing this plan:

1. **Phase 0 Research** (`/sp.plan` will generate `research.md`)
   - Docker multi-stage build best practices
   - Helm chart patterns for microservices
   - Kubernetes health check strategies
   - Resource management recommendations
   - Security best practices

2. **Phase 1 Design** (`/sp.plan` will generate `data-model.md`, `contracts/`, `quickstart.md`)
   - Define deployment entities and relationships
   - Create Helm values schema
   - Document health check API contracts
   - Write quickstart deployment guide

3. **Phase 2 Tasks** (`/sp.tasks` command)
   - Break down implementation into actionable tasks
   - Assign dependencies and priorities
   - Create task checklist for execution

4. **Implementation** (via Claude Code)
   - Generate Dockerfiles using dockerfile-generator skill
   - Generate Helm charts using helm-chart-generator skill
   - Deploy to Minikube
   - Validate and test
   - Create demo video
   - Update documentation

---

**Plan Status**: ✅ COMPLETE - Ready for Phase 0 Research

**Branch**: `001-k8s-deployment`
**Spec**: [spec.md](spec.md)
**Next Command**: `/sp.tasks` (after research and design phases complete)
