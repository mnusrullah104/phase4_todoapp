<!-- SYNC IMPACT REPORT
Version change: 1.2.0 -> 1.3.0
Modified principles: None (core principles unchanged)
Added sections: None (replaced existing Phase IV content)
Removed sections: None (replaced existing Phase IV content)
Replaced sections:
  - Phase IV Detailed Standards (replaced production readiness with Kubernetes deployment)
  - Phase IV in Phase Consistency Rules (replaced with cloud-native deployment focus)
  - Phase IV Specific Quality Gates (replaced with Kubernetes deployment criteria)
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ already aligned
  - .specify/templates/spec-template.md ✅ already aligned
  - .specify/templates/tasks-template.md ✅ already aligned
  - .specify/templates/commands/*.md ⚠ review for Phase IV references
Follow-up TODOs: None
Rationale: MINOR bump - materially changed Phase IV direction from production readiness/UX
improvements to cloud-native Kubernetes deployment with Minikube, Helm, Docker, kubectl-ai,
kagent, and reusable intelligence (skills/subagents). Comprehensive new standards for
containerization, orchestration, AI-assisted DevOps, security, and local deployment.
-->

# Hackathon II — Evolution of Todo Constitution

## Core Principles

### I. Spec-First Development
No implementation may begin without a written specification. Specs are the single source of
truth. Code must strictly follow specs. If behavior is unclear → update spec before coding.

### II. Zero Manual Coding Rule
Human must not write application code manually. All code must be generated via Claude Code or
AI agents. Only specs, prompts, and architecture definitions may be written by human.

### III. Phase Isolation Principle
Each phase must only implement features allowed by that phase. No future-phase features
allowed prematurely. Backward compatibility must be preserved. Build on top of existing work
without breaking prior functionality.

### IV. Deterministic Architecture
Same spec must always produce same behavior. Avoid ambiguous logic. Prefer explicit contracts
over assumptions.

### V. AI-Native Design
Treat AI agents as first-class system components. MCP tools, Agents SDK, and ChatKit must be
treated as production interfaces. Agent behavior must be governed by written rules.

### VI. Cloud-Native Readiness
Every service must be container-ready. Stateless services preferred. Externalize configuration
via environment variables. Design for horizontal scalability.

## Engineering Standards

### I. Code Quality
Follow clean architecture principles. Separation of concerns is mandatory. Modular folder
structure required. No hardcoded secrets. Production-grade quality: clean code, proper error
handling, clear user feedback, graceful failure.

### II. API Design
REST endpoints must be predictable and consistent. Use proper HTTP status codes. All protected
endpoints require authentication. User isolation is mandatory. Stateless architecture required
for all endpoints.

### III. Database Discipline
Every schema change must be documented in specs. Migrations must be reproducible. No direct DB
logic inside UI layer.

### IV. Security Baseline
JWT authentication required from Phase II onward. Secrets stored in environment variables. No
tokens in frontend localStorage without encryption. Backend must verify identity independently.
Strict user isolation — every operation must belong only to the authenticated user.

### V. Observability Ready
All services must log important actions. Errors must be human readable. Phase IV+ must support
monitoring hooks.

## Spec Structure Rules

Every feature spec MUST include:

- Purpose
- User Stories
- Functional Requirements
- Acceptance Criteria
- Edge Cases
- API Contracts (if applicable)
- Data Model Impact
- Error Handling Behavior

## Workflow Enforcement

Mandatory Workflow:

1. Write or update spec
2. Validate spec completeness
3. Generate plan from spec
4. Break into implementation tasks
5. Generate code via Claude Code
6. Test behavior
7. Iterate spec if mismatch found

Skipping steps is not allowed. Follow Agentic Dev Stack / SDD workflow strictly:
Constitution → Specify → Clarify → Plan → Tasks → Implement (only via AI coding assistance).

## Phase Consistency Rules

Phase I (CLI):
- In-memory only
- No database
- No auth
- No network calls

Phase II (Web):
- Persistent database (Neon Serverless PostgreSQL)
- REST APIs (FastAPI + SQLModel)
- Better Auth JWT integration
- Multi-user isolation

Phase III (AI Chatbot):
- Build on top of existing Phase I + Phase II work (do not break or rewrite existing Task
  CRUD, authentication, database schema, or business logic)
- MCP tools only for task actions (5 tools: add_task, list_tasks, complete_task, delete_task,
  update_task)
- Stateless server (chat endpoint and MCP tools completely stateless)
- Conversation persistence (full history in database using Conversation and Message models)
- Agent controlled via tool contracts
- Use Cohere API as primary LLM provider for TodoChatAgent
- Integrate OpenAI ChatKit UI into existing frontend
- Always pass and enforce user_id (from auth) in every tool call and chat request

Phase IV (Kubernetes Deployment):
- Build strictly on top of existing Phase I-III work (never break existing functionality)
- Shift focus to cloud-native deployment: containerize, orchestrate, and manage locally on
  Kubernetes
- Deploy full Phase III chatbot (FastAPI backend, Next.js frontend, Neon DB integration,
  Cohere-powered agent, MCP tools) on Minikube
- Emphasize reusable intelligence: Create and use skills/subagents for deployment tasks
- Maintain stateless architecture, user isolation, security, and scalability
- Prioritize spec-driven development for all deployment artifacts (no manual YAML writing)
- Promote AIOps: Use AI tools like kubectl-ai and kagent for Kubernetes operations
- Local-only deployment (no cloud resources in Phase IV; save for Phase V)

Phase V (Cloud + Kafka):
- Event-driven architecture
- Dapr integration
- Kafka-based messaging
- Cloud deployment with CI/CD

## Phase III Detailed Standards

### MCP Server Implementation
- MUST use Official MCP SDK
- MUST expose exactly 5 tools with precise signatures per Phase III specification:
  - add_task: Create new tasks
  - list_tasks: View all tasks or filter by completion status
  - complete_task: Mark tasks as complete or incomplete
  - delete_task: Remove tasks permanently
  - update_task: Modify task title, description, or status
- All tools MUST accept user_id parameter
- All tools MUST enforce user isolation (filter by user_id in database queries)
- All tools MUST be stateless (no server-side session state)
- All tools MUST interact with SQLModel database

### Agent Behavior Requirements
- MUST use Cohere API (Cohere API key) for all LLM operations
- MUST deliver natural, reliable, and friendly conversational experience
- MUST confirm actions clearly and friendly
- MUST handle ambiguous requests intelligently (e.g., list tasks first when task is not
  clearly identified)
- MUST NEVER hallucinate task data — always read from MCP tools
- MUST return helpful, concise, natural-language responses
- MUST interpret natural language flexibly (various phrasings for same intent)
- MUST support multi-tool orchestration in single turn when appropriate

### Chat API Contract
- Endpoint: POST /api/{user_id}/chat
- MUST be completely stateless
- MUST validate user_id matches authenticated user (JWT)
- MUST persist conversation history to database
- MUST load conversation history from database on each request
- MUST pass user_id to all MCP tool calls
- MUST enforce strict user isolation

### Database Models
- MUST implement Conversation model (links to user, tracks conversation metadata)
- MUST implement Message model (stores individual messages with role, content, timestamps)
- MUST preserve conversation history across server restarts
- MUST support conversation resumption

### Frontend Integration
- MUST integrate OpenAI ChatKit UI into existing Todo frontend
- MUST maintain existing Task CRUD UI functionality
- MUST provide seamless user experience between traditional UI and chat interface
- MUST handle authentication state correctly

## Phase IV Detailed Standards

### Containerization Requirements
- MUST Dockerize all components (frontend, backend, database proxy if needed)
- MUST use multi-stage builds for optimization (target: <500MB total for all images)
- MUST externalize all configuration via environment variables
- MUST NOT hardcode secrets in Docker images
- MUST include health check instructions in Dockerfiles
- MUST optimize layer caching for faster builds
- MUST use official base images (node:alpine, python:slim, etc.)
- MUST document all Dockerfile build arguments and environment variables

### Orchestration Requirements
- MUST use Helm charts for packaging and deployment
- MUST generate all Helm charts via spec-driven process (no manual YAML editing)
- MUST make charts reusable and parameterized (values.yaml)
- MUST deploy to Minikube (local Kubernetes cluster)
- MUST support reproducible deployment (helm install succeeds on fresh cluster)
- MUST define proper resource limits and requests
- MUST implement readiness and liveness probes for all services
- MUST use Kubernetes Services for internal communication
- MUST expose frontend via NodePort or LoadBalancer for local access

### AI-Assisted DevOps (AIOps)
- MUST integrate kubectl-ai for natural language Kubernetes commands
- MUST integrate kagent for agentic cluster management
- MUST demonstrate AI tool usage in documentation or demo
- MUST document AI-assisted workflows in CLAUDE.md
- SHOULD use AI tools for troubleshooting and debugging deployments

### Reusable Intelligence Requirements
- MUST develop at least 2-3 skills/subagents for deployment tasks
- Example skills:
  - Dockerfile generator skill (generates optimized Dockerfiles from specs)
  - Helm chart generator skill (generates Kubernetes manifests from specs)
  - Deployment troubleshooter skill (diagnoses and fixes common issues)
- MUST document each skill's purpose, inputs, and outputs
- MUST test skills with real deployment scenarios
- MUST make skills reusable across different projects
- Skills MUST follow spec-driven development principles

### Security Requirements
- MUST implement basic RBAC (Role-Based Access Control)
- MUST store secrets in Kubernetes Secrets (never in code or images)
- MUST use Kubernetes Secrets for Cohere API key, database credentials, JWT secrets
- MUST implement network policies for pod-to-pod communication
- MUST NOT expose sensitive data in logs or error messages
- MUST scan Docker images for vulnerabilities (basic security scan)
- MUST follow principle of least privilege for service accounts
- MUST validate all external inputs at API boundaries

### Observability Requirements
- MUST implement structured JSON logging (user_id, request_id, latency, errors)
- MUST configure readiness probes (check database connectivity, API health)
- MUST configure liveness probes (detect and restart unhealthy pods)
- MUST expose health check endpoints (/health, /ready)
- MUST log all tool calls with parameters and results
- MUST track key metrics:
  - Pod startup time
  - Request latency
  - Error rates
  - Resource utilization
- SHOULD integrate with Kubernetes dashboard for monitoring

### Testing Requirements
- MUST validate deployment with end-to-end tests
- MUST test chat interactions via kubectl port-forward
- MUST verify all Phase I-III features work in Kubernetes environment
- MUST test pod restart scenarios (data persistence)
- MUST test resource limits (no OOM kills under normal load)
- MUST validate secrets are properly injected
- MUST test service discovery and internal communication

### Performance Requirements
- MUST ensure deployed app responds in <3s for chat queries
- MUST optimize Docker images (<500MB total)
- MUST configure appropriate resource limits (CPU, memory)
- MUST handle concurrent requests efficiently
- MUST minimize pod startup time (<30s for all services)

### Documentation Requirements
- MUST update README with Minikube setup instructions
- MUST document Helm installation commands
- MUST document AI skill usage (kubectl-ai, kagent examples)
- MUST provide troubleshooting guide for common deployment issues
- MUST document all environment variables and secrets
- MUST include architecture diagram showing Kubernetes components
- MUST document rollback procedures

### Technology Stack (Phase IV Specific)
- Container Runtime: Docker
- Orchestration: Kubernetes (Minikube for local deployment)
- Package Manager: Helm 3+
- AI Tools: kubectl-ai, kagent
- Existing Stack: Next.js, FastAPI, SQLModel, Neon Serverless PostgreSQL, Better Auth,
  Cohere API, OpenAI ChatKit (custom backend), Official MCP SDK

### Constraints (MUST NOT)
- MUST NOT rewrite working Phase I-III functionality
- MUST NOT use cloud resources in Phase IV (local Minikube only)
- MUST NOT manually write YAML files (use spec-driven generation)
- MUST NOT exceed reasonable scope (focus on deployment, not new features)
- MUST NOT break existing user isolation or authentication
- MUST NOT introduce new heavy dependencies without justification
- MUST NOT switch away from Cohere as LLM provider

## Quality Gates

A phase is considered COMPLETE only when:

- All specs implemented
- All acceptance criteria satisfied
- No manual code present
- Authentication works correctly (Phase II+)
- Agent tools function correctly (Phase III+)
- Deployment reproducible (Phase IV+)
- Events flow correctly (Phase V)

### Phase III Specific Quality Gates

Phase III is complete when:

- User can fully manage todos via natural language: add, list (all/pending/completed),
  complete, delete, update
- Chatbot works only for the currently logged-in user (100% isolation verified)
- Conversation history survives server restarts and is correctly resumed
- All 5 MCP tools are correctly implemented, discoverable, and used by the agent
- Agent selects correct tool(s) according to Phase III behavior specification
- Friendly confirmations and proper error messages are always shown
- Clean integration with existing Todo frontend + ChatKit UI
- Project satisfies all deliverables and requirements listed in Phase III specification
- No existing Phase I or Phase II functionality is broken

### Phase IV Specific Quality Gates

Phase IV is complete when:

- All existing features from Phase I-III work perfectly in Kubernetes environment (no regressions)
- Full Phase III chatbot runs locally on Minikube:
  - Accessible via browser (NodePort or LoadBalancer)
  - Handles natural language todo management (add, list, complete, delete, update)
  - Persists data in Neon DB (conversation history survives pod restarts)
  - User isolation maintained at 100%
- Deployment is reproducible:
  - Helm install succeeds on fresh Minikube cluster
  - All pods start successfully and pass health checks
  - Services are discoverable and communicate correctly
- Containerization complete:
  - All components Dockerized (frontend, backend)
  - Multi-stage builds implemented
  - Docker images optimized (<500MB total)
  - No secrets hardcoded in images
- Orchestration functional:
  - Helm charts generated via spec-driven process
  - Charts are parameterized and reusable
  - Resource limits and requests configured
  - Readiness and liveness probes working
- AI tools demonstrated:
  - kubectl-ai usage documented and shown
  - kagent usage documented and shown
  - AI-assisted workflows captured in CLAUDE.md or demo
- Reusable intelligence created:
  - At least 2-3 skills/subagents developed and tested
  - Skills documented with purpose, inputs, outputs
  - Skills successfully used for deployment tasks
- Security measures active:
  - Kubernetes Secrets used for sensitive data (Cohere API key, DB credentials, JWT secrets)
  - Basic RBAC implemented
  - Network policies configured
  - No secrets exposed in logs or images
  - Basic security scan passed
- Observability in place:
  - Structured JSON logging implemented
  - Health check endpoints working (/health, /ready)
  - Readiness and liveness probes configured
  - Can see errors, latency, and resource usage
- Performance targets met:
  - App responds in <3s for chat queries
  - Pod startup time <30s
  - No OOM kills under normal load
- Testing complete:
  - End-to-end tests pass (chat interactions via kubectl port-forward)
  - Pod restart scenarios tested (data persists)
  - Service discovery validated
  - All Phase I-III features verified in Kubernetes
- Documentation complete:
  - README updated with Minikube setup instructions
  - Helm installation commands documented
  - AI skill usage examples provided
  - Troubleshooting guide included
  - Architecture diagram shows Kubernetes components
- Project earns Phase IV points (250) + bonuses:
  - Reusable Intelligence bonus (skills/subagents)
  - Cloud-Native Blueprints bonus (spec-driven manifests)
  - Target: +400 potential bonus points

## Success Criteria

Final project must:

- Fully follow spec-driven methodology
- Pass functional testing
- Be deployable end-to-end
- Demonstrate AI-native architecture
- Meet hackathon rubric requirements
- Be production-architecture aligned

## Enforcement Mode

When generating code:

- Prefer correctness over speed
- Reject ambiguous instructions
- Ask for spec clarification if required
- Never invent missing requirements
- Never bypass architecture rules
- Always enforce user isolation
- Always validate against specifications

This constitution applies globally to ALL phases.

## Governance

### Amendment Procedure
Constitution changes require:
1. Clear rationale for change
2. Version bump following semantic versioning
3. Sync impact report documenting affected templates
4. Update to dependent artifacts (templates, commands)

### Versioning Policy
- MAJOR: Backward incompatible governance/principle removals or redefinitions
- MINOR: New principle/section added or materially expanded guidance
- PATCH: Clarifications, wording, typo fixes, non-semantic refinements

### Compliance Review
All feature implementations must be validated against current constitution version.
Violations must be corrected before phase completion.

**Version**: 1.3.0 | **Ratified**: 2026-01-24 | **Last Amended**: 2026-02-18
