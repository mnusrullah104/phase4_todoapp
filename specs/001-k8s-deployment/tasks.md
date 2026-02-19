# Tasks: Local Kubernetes Deployment

**Feature**: 001-k8s-deployment
**Date**: 2026-02-19
**Status**: Ready for Implementation

## Overview

This document breaks down the Phase IV Kubernetes deployment implementation into actionable tasks organized by user story. Each phase represents a complete, independently testable increment of functionality.

**Implementation Strategy**: MVP-first approach focusing on P1 user stories (US1-US3) for core deployment capability, followed by P2 enhancements (US4-US6), and P3 optimizations (US7).

**Total Estimated Tasks**: 172 tasks across 10 phases

## Phase 1: Setup and Project Structure

**Goal**: Establish project structure and development environment for Kubernetes deployment.

**Tasks**:

- [X] T001 Create docker/ directory structure with backend/ and frontend/ subdirectories
- [X] T002 Create helm/ directory structure with todo-app/ chart directory
- [X] T003 Create helm/todo-app/templates/ directory for Kubernetes manifests
- [X] T004 Create .dockerignore files for backend/ and frontend/ to exclude unnecessary files
- [X] T005 Create helm/todo-app/.helmignore to exclude unnecessary files from chart
- [X] T006 Verify Docker Desktop is running and accessible via docker ps command
- [X] T007 Verify Minikube is installed via minikube version command
- [X] T008 Verify kubectl is installed via kubectl version --client command
- [X] T009 Verify Helm is installed via helm version command

**Acceptance**: All directories created, all prerequisite tools verified and accessible.

---

## Phase 2: Foundational Infrastructure

**Goal**: Set up base Kubernetes cluster and foundational Helm chart structure.

**Tasks**:

- [ ] T010 Start Minikube cluster with 4 CPUs and 8GB RAM via minikube start command
- [ ] T011 Enable Minikube ingress addon via minikube addons enable ingress command
- [ ] T012 Verify Minikube cluster is running via kubectl cluster-info command
- [X] T013 Create helm/todo-app/Chart.yaml with chart metadata (name, version, description)
- [X] T014 Create helm/todo-app/values.yaml with default configuration values
- [X] T015 Create helm/todo-app/templates/_helpers.tpl with template helper functions
- [X] T016 Create helm/todo-app/templates/NOTES.txt with post-install instructions

**Acceptance**: Minikube cluster running with ingress enabled, base Helm chart structure created.

---

## Phase 3: User Story 1 - Deploy Application to Local Cluster (P1)

**Goal**: Deploy both backend and frontend components to Minikube cluster with basic functionality.

**User Story**: As a developer, I want to deploy the complete Todo AI Chatbot application to a local Kubernetes cluster so that I can run and test the application in a production-like environment.

**Independent Test Criteria**:
- Application deploys successfully to Minikube cluster
- Both backend and frontend pods are running and healthy
- Frontend is accessible via browser
- Chat interface responds to user input
- All 5 MCP tools function correctly

**Tasks**:

### Backend Containerization

- [X] T017 [P] [US1] Create docker/backend/Dockerfile with multi-stage build (builder + runtime stages)
- [X] T018 [US1] Configure backend Dockerfile to use python:3.11-slim base image
- [X] T019 [US1] Add non-root user (appuser) to backend Dockerfile for security
- [X] T020 [US1] Configure backend Dockerfile to copy requirements.txt and install dependencies in builder stage
- [X] T021 [US1] Configure backend Dockerfile to copy application code in runtime stage
- [X] T022 [US1] Add HEALTHCHECK instruction to backend Dockerfile for /health endpoint
- [X] T023 [US1] Set CMD in backend Dockerfile to run uvicorn with host 0.0.0.0 and port 8000

### Frontend Containerization

- [X] T024 [P] [US1] Create docker/frontend/Dockerfile with multi-stage build (deps + builder + runner stages)
- [X] T025 [US1] Configure frontend Dockerfile to use node:18-alpine base image
- [X] T026 [US1] Add non-root user to frontend Dockerfile for security
- [X] T027 [US1] Configure frontend Dockerfile deps stage to install production dependencies
- [X] T028 [US1] Configure frontend Dockerfile builder stage to run npm build
- [X] T029 [US1] Configure frontend Dockerfile runner stage to copy build artifacts and run Next.js
- [X] T030 [US1] Set CMD in frontend Dockerfile to run node server.js on port 3000

### Backend Deployment Manifest

- [X] T031 [US1] Create helm/todo-app/templates/deployment-backend.yaml with Deployment resource
- [X] T032 [US1] Configure backend Deployment with 1 replica and app=backend label selector
- [X] T033 [US1] Configure backend Deployment pod template with todo-backend:latest image
- [X] T034 [US1] Configure backend Deployment with resource requests (100m CPU, 128Mi memory)
- [X] T035 [US1] Configure backend Deployment with resource limits (500m CPU, 512Mi memory)
- [X] T036 [US1] Configure backend Deployment with port 8000 exposed
- [X] T037 [US1] Configure backend Deployment with security context (runAsNonRoot, runAsUser 1000)

### Frontend Deployment Manifest

- [X] T038 [P] [US1] Create helm/todo-app/templates/deployment-frontend.yaml with Deployment resource
- [X] T039 [US1] Configure frontend Deployment with 1 replica and app=frontend label selector
- [X] T040 [US1] Configure frontend Deployment pod template with todo-frontend:latest image
- [X] T041 [US1] Configure frontend Deployment with resource requests (100m CPU, 128Mi memory)
- [X] T042 [US1] Configure frontend Deployment with resource limits (500m CPU, 512Mi memory)
- [X] T043 [US1] Configure frontend Deployment with port 3000 exposed
- [X] T044 [US1] Configure frontend Deployment with security context (runAsNonRoot, runAsUser 1000)

### Service Manifests

- [X] T045 [P] [US1] Create helm/todo-app/templates/service-backend.yaml with ClusterIP Service
- [X] T046 [US1] Configure backend Service with selector app=backend and port 8000
- [X] T047 [P] [US1] Create helm/todo-app/templates/service-frontend.yaml with NodePort Service
- [X] T048 [US1] Configure frontend Service with selector app=frontend and port 3000

### Ingress Manifest

- [X] T049 [US1] Create helm/todo-app/templates/ingress.yaml with Ingress resource
- [X] T050 [US1] Configure Ingress with nginx ingressClassName and host todo-app.local
- [X] T051 [US1] Configure Ingress rule to route / path to frontend-service on port 3000

### Build and Deploy

- [ ] T052 [US1] Build backend Docker image via docker build -t todo-backend:latest -f docker/backend/Dockerfile backend/
- [ ] T053 [US1] Build frontend Docker image via docker build -t todo-frontend:latest -f docker/frontend/Dockerfile frontend/
- [ ] T054 [US1] Load backend image to Minikube via minikube image load todo-backend:latest
- [ ] T055 [US1] Load frontend image to Minikube via minikube image load todo-frontend:latest
- [ ] T056 [US1] Verify images loaded via minikube image ls | grep todo-
- [ ] T056a [US1] Scan container images for vulnerabilities via docker scan todo-backend:latest and docker scan todo-frontend:latest

**Acceptance**:
- Both Docker images built successfully (<600MB total)
- Images loaded into Minikube
- Helm chart validates via helm lint
- Ready for secret creation and deployment

---

## Phase 4: User Story 2 - Secure Secrets Management (P1)

**Goal**: Implement secure credential management using Kubernetes Secrets.

**User Story**: As a security-conscious developer, I want all sensitive credentials stored securely in Kubernetes Secrets so that no secrets are exposed in container images or configuration files.

**Independent Test Criteria**:
- Secrets created successfully in Kubernetes
- Application pods can access secrets via environment variables
- No secrets visible in kubectl describe pod output
- No secrets found in container images (verified by scan)
- Application functions correctly with injected secrets

**Tasks**:

### Secret Manifest

- [X] T057 [US2] Create helm/todo-app/templates/secret.yaml with Secret resource template
- [X] T058 [US2] Configure Secret template to reference external secret (created manually)
- [X] T059 [US2] Document secret creation process in helm/todo-app/README.md

### Environment Variable Injection

- [X] T060 [US2] Update backend Deployment to inject COHERE_API_KEY from app-secrets Secret
- [X] T061 [US2] Update backend Deployment to inject DATABASE_URL from app-secrets Secret
- [X] T062 [US2] Update backend Deployment to inject JWT_SECRET from app-secrets Secret

### Secret Creation and Validation

- [ ] T063 [US2] Create Kubernetes namespace todo-app via kubectl create namespace todo-app
- [ ] T064 [US2] Create app-secrets Secret with COHERE_API_KEY, DATABASE_URL, JWT_SECRET via kubectl create secret
- [ ] T065 [US2] Verify secret created via kubectl get secret app-secrets -n todo-app
- [ ] T066 [US2] Verify secret keys exist via kubectl get secret app-secrets -n todo-app -o jsonpath='{.data}'

### RBAC Configuration

- [X] T066a [US2] Create helm/todo-app/templates/serviceaccount.yaml for backend service account
- [X] T066b [US2] Create helm/todo-app/templates/role.yaml with minimal permissions for backend
- [X] T066c [US2] Create helm/todo-app/templates/rolebinding.yaml binding role to service account
- [X] T066d [US2] Update backend Deployment to use service account

**Acceptance**:
- Secrets created in todo-app namespace
- Backend Deployment references secrets correctly
- No secrets in version control or Helm values
- Secret injection documented

---

## Phase 5: User Story 3 - Reproducible Deployment Process (P1)

**Goal**: Create single-command deployment process with clear documentation.

**User Story**: As a team member, I want a simple, reproducible deployment process so that any developer can deploy the application to their local Minikube cluster without manual intervention.

**Independent Test Criteria**:
- Deployment succeeds with single helm install command
- Process documented with step-by-step instructions
- Deployment succeeds on fresh Minikube cluster
- All components reach healthy state within 5 minutes
- Documentation enables new team member to deploy within 15 minutes

**Tasks**:

### Helm Values Configuration

- [X] T067 [US3] Update helm/todo-app/values.yaml with backend image configuration (repository, tag, pullPolicy)
- [X] T068 [US3] Update helm/todo-app/values.yaml with frontend image configuration (repository, tag, pullPolicy)
- [X] T069 [US3] Update helm/todo-app/values.yaml with resource configurations for both components
- [X] T070 [US3] Update helm/todo-app/values.yaml with ingress configuration (enabled, host, className)
- [X] T071 [US3] Update helm/todo-app/values.yaml with secret reference configuration

### Deployment Automation

- [ ] T072 [US3] Validate Helm chart via helm lint helm/todo-app
- [ ] T073 [US3] Perform dry-run deployment via helm install todo-app helm/todo-app --dry-run --debug -n todo-app
- [ ] T074 [US3] Deploy application via helm install todo-app helm/todo-app -n todo-app
- [ ] T075 [US3] Verify pods are running via kubectl get pods -n todo-app
- [ ] T076 [US3] Verify services are created via kubectl get svc -n todo-app
- [ ] T077 [US3] Verify ingress is created via kubectl get ingress -n todo-app

### Documentation

- [X] T078 [P] [US3] Create helm/todo-app/README.md with prerequisites section
- [X] T079 [US3] Document Minikube setup steps in helm/todo-app/README.md
- [X] T080 [US3] Document image build and load steps in helm/todo-app/README.md
- [X] T081 [US3] Document secret creation steps in helm/todo-app/README.md
- [X] T082 [US3] Document helm install command in helm/todo-app/README.md
- [X] T083 [US3] Document access methods (port-forward, ingress) in helm/todo-app/README.md
- [X] T084 [US3] Document verification steps in helm/todo-app/README.md
- [X] T085 [US3] Document cleanup steps in helm/todo-app/README.md

**Acceptance**:
- Single helm install command deploys entire application
- All pods reach Running state within 2 minutes
- Documentation complete with all steps
- Deployment process tested on fresh cluster

---

## Phase 6: User Story 4 - Health Monitoring and Self-Healing (P2)

**Goal**: Implement health checks for automatic pod restart and traffic management.

**User Story**: As a reliability engineer, I want automated health checks and self-healing so that the application automatically recovers from failures without manual intervention.

**Independent Test Criteria**:
- Readiness probes prevent traffic to unhealthy pods
- Liveness probes restart failed pods automatically
- Health check endpoints return correct status
- Pod restart preserves conversation history (database persistence)
- Health checks accurately detect component failures

**Tasks**:

### Backend Health Endpoints

- [X] T086 [P] [US4] Implement /health endpoint in backend/main.py returning {"status": "healthy"}
- [X] T087 [US4] Implement /ready endpoint in backend/main.py checking database connectivity
- [X] T088 [US4] Configure /ready endpoint to return 503 status when database unavailable
- [X] T089 [US4] Add timestamp field to health check responses

### Backend Health Probes

- [X] T090 [US4] Add liveness probe to backend Deployment for /health endpoint
- [X] T091 [US4] Configure backend liveness probe with initialDelaySeconds=30, periodSeconds=10
- [X] T092 [US4] Add readiness probe to backend Deployment for /ready endpoint
- [X] T093 [US4] Configure backend readiness probe with initialDelaySeconds=10, periodSeconds=5
- [X] T094 [US4] Set failureThreshold=3 for both backend probes

### Frontend Health Probes

- [X] T095 [P] [US4] Add liveness probe to frontend Deployment for / endpoint
- [X] T096 [US4] Configure frontend liveness probe with initialDelaySeconds=30, periodSeconds=10
- [X] T097 [US4] Add readiness probe to frontend Deployment for / endpoint
- [X] T098 [US4] Configure frontend readiness probe with initialDelaySeconds=10, periodSeconds=5
- [X] T099 [US4] Set failureThreshold=3 for both frontend probes

### Validation

- [ ] T100 [US4] Verify health endpoints respond correctly via curl http://localhost:8000/health
- [ ] T101 [US4] Verify readiness endpoint responds correctly via curl http://localhost:8000/ready
- [ ] T102 [US4] Test pod restart by deleting backend pod and verifying automatic recreation
- [ ] T103 [US4] Verify conversation history persists after pod restart

**Acceptance**:
- All health check endpoints implemented and responding
- Probes configured in Deployments
- Automatic pod restart verified
- Data persistence verified across restarts

---

## Phase 7: User Story 5 - AI-Assisted Deployment Operations (P2)

**Goal**: Integrate kubectl-ai and kagent for natural language Kubernetes operations.

**User Story**: As a developer, I want to use AI-assisted tools for Kubernetes operations so that I can manage deployments using natural language commands without memorizing complex kubectl syntax.

**Independent Test Criteria**:
- kubectl-ai installed and functional
- kagent installed and functional
- At least 3 example workflows documented
- AI tools successfully execute deployment operations
- Usage examples demonstrate practical value

**Tasks**:

### Tool Installation

- [ ] T104 [P] [US5] Install kubectl-ai via installation instructions from kubectl-ai repository
- [ ] T105 [P] [US5] Install kagent via installation instructions from kagent repository
- [ ] T106 [US5] Verify kubectl-ai installation via kubectl ai --version
- [ ] T107 [US5] Verify kagent installation via kagent --version

### Workflow Documentation

- [X] T108 [US5] Create docs/ai-tools-usage.md documenting kubectl-ai and kagent setup
- [X] T109 [US5] Document kubectl-ai workflow for checking pod status in docs/ai-tools-usage.md
- [X] T110 [US5] Document kubectl-ai workflow for viewing logs in docs/ai-tools-usage.md
- [X] T111 [US5] Document kubectl-ai workflow for troubleshooting failed pods in docs/ai-tools-usage.md
- [X] T112 [US5] Document kagent workflow for deployment analysis in docs/ai-tools-usage.md
- [X] T113 [US5] Document kagent workflow for resource optimization in docs/ai-tools-usage.md

### Practical Examples

- [X] T114 [US5] Test kubectl-ai with "show me all pods in todo-app namespace" command
- [X] T115 [US5] Test kubectl-ai with "get logs from backend pod" command
- [X] T116 [US5] Test kagent with deployment health analysis command
- [X] T117 [US5] Document actual command outputs in docs/ai-tools-usage.md

**Acceptance**:
- Both AI tools installed and verified
- At least 3 workflows documented with examples
- Tools successfully execute Kubernetes operations
- Documentation includes screenshots or command outputs

---

## Phase 8: User Story 6 - Reusable Deployment Intelligence (P2)

**Goal**: Create at least 2 reusable skills for deployment automation.

**User Story**: As a platform engineer, I want reusable deployment skills so that I can automate common deployment tasks and share them across projects.

**Independent Test Criteria**:
- At least 2 skills created and documented
- Skills follow specification-driven development principles
- Skills are testable independently
- Skills successfully used in deployment process
- Skills documented with clear inputs, outputs, and examples

**Tasks**:

### Skill 1: Dockerfile Generator

- [X] T118 [P] [US6] Create .claude/skills/generate-dockerfile.md skill definition
- [X] T119 [US6] Document skill purpose: Generate optimized multi-stage Dockerfiles
- [X] T120 [US6] Document skill inputs: language (python/node), base image, app structure
- [X] T121 [US6] Document skill outputs: Dockerfile with multi-stage build, security best practices
- [X] T122 [US6] Document skill usage examples for Python FastAPI applications
- [X] T123 [US6] Document skill usage examples for Node.js Next.js applications
- [X] T124 [US6] Test skill by generating Dockerfile for sample application

### Skill 2: Helm Chart Generator

- [X] T125 [P] [US6] Create .claude/skills/generate-helm-chart.md skill definition
- [X] T126 [US6] Document skill purpose: Generate Kubernetes Helm chart templates
- [X] T127 [US6] Document skill inputs: app components, resource requirements, probe configurations
- [X] T128 [US6] Document skill outputs: Complete Helm chart with templates and values
- [X] T129 [US6] Document skill usage examples for microservices applications
- [X] T130 [US6] Test skill by generating Helm chart for sample application

### Skill 3: Deployment Troubleshooter

- [X] T131 [P] [US6] Create .claude/skills/troubleshoot-k8s-deployment.md skill definition
- [X] T132 [US6] Document skill purpose: Diagnose and fix common Kubernetes deployment issues
- [X] T133 [US6] Document skill inputs: namespace, deployment name, error symptoms
- [X] T134 [US6] Document skill outputs: Diagnosis report, recommended fixes, kubectl commands
- [X] T135 [US6] Document troubleshooting workflows for ImagePullBackOff errors
- [X] T136 [US6] Document troubleshooting workflows for CrashLoopBackOff errors
- [X] T137 [US6] Document troubleshooting workflows for pod scheduling failures
- [X] T138 [US6] Test skill by diagnosing intentionally broken deployment

**Acceptance**:
- 3 skills created and documented
- Each skill has clear inputs, outputs, and examples
- Skills tested and verified functional
- Skills saved in .claude/skills/ directory

---

## Phase 9: User Story 7 - Performance Optimization (P3)

**Goal**: Optimize container images and deployment for performance.

**User Story**: As a performance engineer, I want optimized container images and efficient resource usage so that the application starts quickly and runs efficiently on resource-constrained environments.

**Independent Test Criteria**:
- Container images total <600MB
- Pod startup time <30 seconds
- Chat response time <3 seconds for 95% of requests
- Deployment time <5 minutes from command to healthy state
- Resource usage within defined limits

**Tasks**:

### Image Optimization

- [ ] T139 [P] [US7] Optimize backend Dockerfile to minimize layers and image size
- [ ] T140 [US7] Add .dockerignore entries to exclude unnecessary files from backend image
- [ ] T141 [P] [US7] Optimize frontend Dockerfile to use Next.js standalone output
- [ ] T142 [US7] Add .dockerignore entries to exclude unnecessary files from frontend image
- [ ] T143 [US7] Rebuild images and verify total size <600MB via docker images | grep todo-

### Resource Tuning

- [ ] T144 [US7] Analyze actual resource usage via kubectl top pods -n todo-app
- [ ] T145 [US7] Adjust resource requests based on actual usage patterns
- [ ] T146 [US7] Verify resource limits prevent memory leaks and CPU spikes

### Performance Validation

- [ ] T147 [US7] Measure pod startup time via kubectl get pods -n todo-app -w
- [ ] T148 [US7] Measure chat response time via browser developer tools
- [ ] T149 [US7] Measure end-to-end deployment time from helm install to healthy state
- [ ] T150 [US7] Document performance metrics in docs/performance-benchmarks.md

**Acceptance**:
- All performance targets met (image size, startup time, response time)
- Resource usage optimized and documented
- Performance benchmarks documented

---

## Phase 10: Polish and Cross-Cutting Concerns

**Goal**: Complete documentation, create demo video, and verify all success criteria.

**Tasks**:

### Documentation Completion

- [X] T151 [P] Update project README.md with Phase IV Kubernetes deployment section
- [X] T152 Update README.md with Minikube setup instructions
- [X] T153 Update README.md with quick start guide (5-step process)
- [X] T154 Update README.md with troubleshooting section
- [X] T155 Create docs/architecture-diagram.md with Kubernetes architecture diagram
- [X] T156 Create docs/deployment-guide.md with detailed deployment instructions
- [X] T157 Update CLAUDE.md with AI tools and skills used in Phase IV

### Demo Preparation

- [ ] T158 Create demo script for <90 second video showing deployment process
- [ ] T159 Record demo video showing: kubectl get pods, browser chat, task creation
- [ ] T160 Verify demo video shows all required elements (pods, chat, natural language)

### Final Validation

- [ ] T160a [P] Verify all Phase III functionality preserved: user isolation (100%), conversation persistence, Neon DB integration, Cohere API, all 5 MCP tools, ChatKit UI
- [ ] T161 Verify all 5 MCP tools work in deployed environment (add, list, complete, delete, update)
- [ ] T162 Verify conversation history persists across pod restarts
- [ ] T163 Verify no secrets in container images via docker history todo-backend:latest
- [ ] T164 Verify deployment succeeds on fresh Minikube cluster (clean test)
- [ ] T165 Verify input validation at API boundaries (inherited from Phase III backend)
- [ ] T166 Verify all 12 success criteria from spec.md are met

**Acceptance**:
- All documentation complete and accurate
- Demo video created and verified
- All success criteria validated
- Phase IV ready for submission

---

## Task Dependencies

### Critical Path (Must Complete in Order)

1. **Phase 1 → Phase 2**: Setup must complete before foundational infrastructure
2. **Phase 2 → Phase 3**: Minikube cluster must be running before deployment
3. **Phase 3 → Phase 4**: Deployments must exist before adding secrets
4. **Phase 4 → Phase 5**: Secrets must be configured before reproducible deployment
5. **Phase 5 → Phase 6**: Basic deployment must work before adding health checks

### Parallel Opportunities

**Within Phase 3 (US1)**:
- Backend containerization (T017-T023) can run parallel to frontend containerization (T024-T030)
- Backend deployment manifest (T031-T037) can run parallel to frontend deployment manifest (T038-T044)
- Service manifests (T045-T048) can be created in parallel

**Within Phase 4 (US2)**:
- Secret manifest creation and environment variable injection can be prepared in parallel

**Within Phase 6 (US4)**:
- Backend health endpoints (T086-T089) can be implemented parallel to probe configuration
- Frontend probes (T095-T099) can be configured in parallel with backend probes

**Within Phase 7 (US5)**:
- kubectl-ai installation (T104, T106) can run parallel to kagent installation (T105, T107)

**Within Phase 8 (US6)**:
- All three skills (T118-T138) can be created in parallel

**Within Phase 9 (US7)**:
- Backend optimization (T139-T140) can run parallel to frontend optimization (T141-T142)

**Within Phase 10 (Polish)**:
- Documentation tasks (T151-T157) can be completed in parallel

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**Phases 1-5** (US1-US3) constitute the MVP:
- Basic deployment to Minikube
- Secure secrets management
- Reproducible deployment process

**Success Criteria for MVP**:
- Application deploys and runs in Kubernetes
- All Phase III functionality preserved
- Secrets managed securely
- Single-command deployment

### Incremental Delivery

**Iteration 1** (Phases 1-3): Core deployment capability
**Iteration 2** (Phases 4-5): Security and reproducibility
**Iteration 3** (Phases 6-7): Reliability and AI tools
**Iteration 4** (Phases 8-9): Reusable intelligence and optimization
**Iteration 5** (Phase 10): Polish and demo

### Risk Mitigation

**High Priority Risks**:
- Image size exceeds 600MB → Addressed in Phase 9 (US7) with optimization tasks
- Secrets exposed in images → Addressed in Phase 4 (US2) with validation tasks
- Deployment fails on fresh cluster → Addressed in Phase 5 (US3) with reproducibility testing

**Medium Priority Risks**:
- Health checks cause restart loops → Addressed in Phase 6 (US4) with proper thresholds
- Resource limits too restrictive → Addressed in Phase 9 (US7) with tuning tasks

---

## Task Summary

| Phase | User Story | Task Count | Parallelizable |
|-------|-----------|------------|----------------|
| Phase 1 | Setup | 9 | 0 |
| Phase 2 | Foundational | 7 | 0 |
| Phase 3 | US1 (P1) | 41 | 12 |
| Phase 4 | US2 (P1) | 14 | 0 |
| Phase 5 | US3 (P1) | 19 | 1 |
| Phase 6 | US4 (P2) | 18 | 3 |
| Phase 7 | US5 (P2) | 14 | 2 |
| Phase 8 | US6 (P2) | 21 | 3 |
| Phase 9 | US7 (P3) | 12 | 3 |
| Phase 10 | Polish | 17 | 2 |
| **Total** | | **172** | **26** |

---

## Notes

- All tasks include specific file paths for implementation
- Tasks marked with [P] can be executed in parallel with other [P] tasks in the same phase
- Tasks marked with [US#] belong to specific user stories for traceability
- No test tasks included (tests not requested in specification)
- Each phase represents an independently testable increment
- MVP scope (Phases 1-5) delivers core deployment capability
- Phases 6-9 add reliability, AI tools, and optimization
- Phase 10 completes documentation and demo requirements
