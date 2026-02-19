# Data Model: Kubernetes Deployment Entities

**Feature**: Local Kubernetes Deployment (001-k8s-deployment)
**Date**: 2026-02-18
**Purpose**: Define deployment entities, their properties, relationships, and lifecycle

## Overview

This document defines the deployment entities for the Kubernetes-based Todo AI Chatbot application. These are infrastructure entities, not application data models. The application data models (Task, User, Conversation, Message) remain unchanged from Phase III.

## Entity Definitions

### 1. Container Image

**Purpose**: Packaged application component ready for deployment to Kubernetes.

**Properties**:
- `name`: Image name (e.g., "todo-backend", "todo-frontend")
- `tag`: Version identifier (e.g., "latest", "v1.0.0")
- `repository`: Local or remote registry location
- `size`: Total image size in MB
- `baseImage`: Parent image (e.g., "python:3.11-slim")
- `layers`: Number of filesystem layers
- `buildTime`: Time to build image
- `digest`: SHA256 hash for verification

**Relationships**:
- Used by: Deployment (specifies which image to run)
- Built from: Dockerfile (build instructions)

**Lifecycle**:
1. Build: `docker build` creates image from Dockerfile
2. Load: `minikube image load` transfers to cluster
3. Pull: Kubernetes pulls image when creating pod
4. Run: Container runtime executes image in pod

**Validation Rules**:
- Total size (backend + frontend) must be <600MB
- Must not contain hardcoded secrets
- Must pass vulnerability scan (no critical/high vulnerabilities)
- Must include health check instruction

### 2. Deployment

**Purpose**: Kubernetes resource that manages pod replicas and rolling updates.

**Properties**:
- `name`: Deployment name (e.g., "backend-deployment")
- `namespace`: Kubernetes namespace (e.g., "todo-app")
- `replicas`: Number of pod instances (1 for Phase IV)
- `selector`: Label selector for pods
- `strategy`: Update strategy (RollingUpdate)
- `revisionHistoryLimit`: Number of old ReplicaSets to retain (10)
- `podTemplate`: Template for creating pods

**Pod Template Properties**:
- `labels`: Key-value pairs for identification
- `containers`: List of container specifications
- `volumes`: Mounted volumes (secrets, configmaps)
- `securityContext`: Security settings
- `restartPolicy`: Always

**Container Specification**:
- `name`: Container name
- `image`: Container image reference
- `ports`: Exposed ports
- `env`: Environment variables
- `envFrom`: Environment from secrets/configmaps
- `resources`: CPU and memory requests/limits
- `livenessProbe`: Health check for restart
- `readinessProbe`: Health check for traffic
- `volumeMounts`: Mounted volumes

**Relationships**:
- Creates: ReplicaSet (manages pod replicas)
- Manages: Pods (application instances)
- References: Container Image (what to run)
- References: Secret (for sensitive data)
- Referenced by: Service (for traffic routing)

**Lifecycle**:
1. Create: `kubectl apply` or `helm install` creates Deployment
2. Schedule: Kubernetes scheduler assigns pods to nodes
3. Run: Pods start and run containers
4. Monitor: Probes check health continuously
5. Update: Rolling update when image changes
6. Scale: Adjust replica count (manual or auto)

**Validation Rules**:
- Must have at least 1 replica
- Must define resource requests and limits
- Must define readiness and liveness probes
- Must use non-root security context

### 3. Service

**Purpose**: Stable network endpoint for accessing pods.

**Properties**:
- `name`: Service name (e.g., "backend-service")
- `namespace`: Kubernetes namespace
- `type`: Service type (ClusterIP, NodePort, LoadBalancer)
- `selector`: Label selector to match pods
- `ports`: Port mappings (port, targetPort, protocol)
- `clusterIP`: Internal cluster IP (auto-assigned)
- `sessionAffinity`: Session stickiness (None or ClientIP)

**Service Types**:
- **ClusterIP** (backend): Internal-only access, used for backend service
- **NodePort** (frontend): External access via node port, used for frontend service
- **LoadBalancer**: External load balancer (not used in Minikube)

**Relationships**:
- Routes to: Pods (via label selector)
- Used by: Ingress (for external routing)
- Used by: Other Services (for internal communication)

**Lifecycle**:
1. Create: Service created with Deployment
2. Discover: DNS entry created (service-name.namespace.svc.cluster.local)
3. Route: Traffic routed to healthy pods (passing readiness probe)
4. Update: Endpoint list updated as pods change

**Validation Rules**:
- Selector must match Deployment labels
- Port must match container port
- Type must be appropriate for access pattern

### 4. Secret

**Purpose**: Secure storage for sensitive credentials.

**Properties**:
- `name`: Secret name (e.g., "app-secrets")
- `namespace`: Kubernetes namespace
- `type`: Secret type (Opaque, kubernetes.io/tls, etc.)
- `data`: Base64-encoded key-value pairs
- `stringData`: Plain-text key-value pairs (encoded on create)

**Secret Keys** (for this application):
- `COHERE_API_KEY`: Cohere API authentication key
- `DATABASE_URL`: Neon PostgreSQL connection string
- `JWT_SECRET`: JWT signing secret for Better Auth

**Relationships**:
- Used by: Deployment (mounted as environment variables)
- Created before: Deployment (prerequisite)

**Lifecycle**:
1. Create: `kubectl create secret` before Helm install
2. Mount: Referenced in Deployment as environment variables
3. Inject: Kubernetes injects values into pod at runtime
4. Rotate: Update secret and restart pods

**Validation Rules**:
- Must not be stored in version control
- Must not be in Helm values.yaml
- Must be created before deployment
- Must be base64-encoded in YAML

**Security Constraints**:
- Never log secret values
- Never expose in pod describe output
- Never include in container images
- Rotate regularly (manual process for Phase IV)

### 5. ConfigMap

**Purpose**: Non-sensitive configuration data.

**Properties**:
- `name`: ConfigMap name (e.g., "app-config")
- `namespace`: Kubernetes namespace
- `data`: Key-value pairs (plain text)

**Configuration Keys** (examples):
- `LOG_LEVEL`: Logging verbosity (INFO, DEBUG, ERROR)
- `ENVIRONMENT`: Environment name (development, production)
- `FEATURE_FLAGS`: Feature toggle configuration

**Relationships**:
- Used by: Deployment (mounted as environment variables or files)

**Lifecycle**:
1. Create: Created with Helm chart
2. Mount: Referenced in Deployment
3. Update: Can be updated independently
4. Reload: Pods may need restart to pick up changes

**Validation Rules**:
- Must not contain sensitive data
- Should be version-controlled (unlike Secrets)

### 6. Ingress

**Purpose**: HTTP/HTTPS routing from external traffic to services.

**Properties**:
- `name`: Ingress name (e.g., "todo-app-ingress")
- `namespace`: Kubernetes namespace
- `ingressClassName`: Ingress controller (nginx)
- `rules`: Routing rules (host, paths, backend service)
- `tls`: TLS configuration (optional)

**Routing Rules**:
- `host`: Domain name (e.g., "todo-app.local")
- `paths`: URL paths and target services
- `backend`: Service name and port

**Relationships**:
- Routes to: Service (frontend-service)
- Requires: Ingress Controller (nginx addon in Minikube)

**Lifecycle**:
1. Create: Created with Helm chart
2. Configure: Ingress controller configures routing
3. Route: External traffic routed to services
4. Update: Rules updated as needed

**Validation Rules**:
- Ingress controller must be enabled (minikube addons enable ingress)
- Host must be in /etc/hosts (for local development)
- Backend service must exist

### 7. Health Check

**Purpose**: Automated verification of component health.

**Properties**:
- `type`: Probe type (liveness, readiness, startup)
- `handler`: Check method (httpGet, tcpSocket, exec)
- `path`: HTTP endpoint path (e.g., "/health")
- `port`: Port to check
- `initialDelaySeconds`: Wait before first check
- `periodSeconds`: Interval between checks
- `timeoutSeconds`: Check timeout
- `successThreshold`: Consecutive successes to mark healthy
- `failureThreshold`: Consecutive failures to mark unhealthy

**Probe Types**:
- **Liveness**: Determines if pod should be restarted
- **Readiness**: Determines if pod should receive traffic
- **Startup**: Protects slow-starting containers (not used in Phase IV)

**Relationships**:
- Defined in: Deployment (pod template)
- Checks: Container (running application)
- Affects: Service (endpoint list for readiness)

**Lifecycle**:
1. Wait: Initial delay before first check
2. Check: Periodic health check execution
3. Evaluate: Success/failure threshold evaluation
4. Action: Restart (liveness) or remove from endpoints (readiness)

**Validation Rules**:
- Liveness initial delay > readiness initial delay
- Failure threshold ≥ 3 (prevent flapping)
- Timeout < period (prevent overlap)

### 8. Namespace

**Purpose**: Logical isolation and resource grouping.

**Properties**:
- `name`: Namespace name (e.g., "todo-app")
- `labels`: Metadata labels
- `resourceQuota`: Resource limits (optional)
- `limitRange`: Default resource limits (optional)

**Relationships**:
- Contains: All other resources (Deployments, Services, Secrets, etc.)
- Provides: Scope for RBAC policies

**Lifecycle**:
1. Create: Created before or with Helm chart
2. Use: All resources created in namespace
3. Isolate: Resources isolated from other namespaces
4. Delete: Deletes all contained resources

**Validation Rules**:
- Name must be DNS-compatible
- Should be created before deploying resources

## Entity Relationships Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Namespace (todo-app)                     │
│                                                                   │
│  ┌──────────────┐                                                │
│  │ Container    │                                                │
│  │ Image        │                                                │
│  │              │                                                │
│  │ - Backend    │───────┐                                        │
│  │ - Frontend   │       │                                        │
│  └──────────────┘       │ uses                                   │
│                         │                                        │
│  ┌──────────────┐       │      ┌──────────────┐                 │
│  │ Secret       │       │      │ Deployment   │                 │
│  │              │       │      │              │                 │
│  │ - Cohere Key │───────┼─────▶│ - Backend    │                 │
│  │ - DB URL     │ mounts│      │ - Frontend   │                 │
│  │ - JWT Secret │       │      │              │                 │
│  └──────────────┘       │      │ Replicas: 1  │                 │
│                         │      │ Probes: ✓    │                 │
│  ┌──────────────┐       │      └──────┬───────┘                 │
│  │ ConfigMap    │       │             │ creates                 │
│  │              │───────┘             │                         │
│  │ - Log Level  │                     │                         │
│  │ - Env Name   │                     ▼                         │
│  └──────────────┘              ┌──────────────┐                 │
│                                │ Pod          │                 │
│                                │              │                 │
│                                │ - Container  │                 │
│                                │ - Probes     │                 │
│                                └──────┬───────┘                 │
│                                       │ selected by             │
│                                       │                         │
│                                       ▼                         │
│                                ┌──────────────┐                 │
│                                │ Service      │                 │
│                                │              │                 │
│                                │ - Backend    │                 │
│                                │ - Frontend   │                 │
│                                └──────┬───────┘                 │
│                                       │ routes to               │
│                                       │                         │
│                                       ▼                         │
│                                ┌──────────────┐                 │
│                                │ Ingress      │                 │
│                                │              │                 │
│                                │ - todo-app   │                 │
│                                │   .local     │                 │
│                                └──────────────┘                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## State Transitions

### Deployment Lifecycle States

1. **Pending**: Deployment created, waiting for pods to be scheduled
2. **Progressing**: Pods being created and started
3. **Available**: Minimum replicas are running and ready
4. **Complete**: All replicas are running and ready
5. **Failed**: Deployment failed (image pull error, crash loop, etc.)

### Pod Lifecycle States

1. **Pending**: Pod accepted, waiting for scheduling
2. **ContainerCreating**: Pulling image and creating container
3. **Running**: Container started, probes checking
4. **Ready**: Readiness probe passing, receiving traffic
5. **Terminating**: Pod shutting down gracefully
6. **Failed**: Container exited with error
7. **CrashLoopBackOff**: Container repeatedly crashing

### Health Check States

1. **Unknown**: Probe not yet executed
2. **Success**: Probe passed
3. **Failure**: Probe failed
4. **Timeout**: Probe timed out

## Validation Rules Summary

| Entity | Key Validation Rules |
|--------|---------------------|
| **Container Image** | <600MB total, no secrets, passes vulnerability scan |
| **Deployment** | ≥1 replica, has probes, has resource limits, non-root user |
| **Service** | Selector matches pods, correct port mapping |
| **Secret** | Not in version control, base64-encoded, created before deployment |
| **ConfigMap** | No sensitive data, version-controlled |
| **Ingress** | Controller enabled, host in /etc/hosts, backend exists |
| **Health Check** | Liveness delay > readiness delay, failure threshold ≥3 |
| **Namespace** | DNS-compatible name, created before resources |

## Implementation Notes

- All entities are defined in Helm templates (except Secrets, which are created manually)
- Entity relationships are enforced by Kubernetes (e.g., Service selector must match Deployment labels)
- State transitions are managed by Kubernetes controllers
- Validation rules are enforced at deployment time (helm lint, kubectl apply)
