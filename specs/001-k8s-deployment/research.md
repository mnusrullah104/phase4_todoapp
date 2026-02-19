# Research: Kubernetes Deployment Best Practices

**Feature**: Local Kubernetes Deployment (001-k8s-deployment)
**Date**: 2026-02-18
**Purpose**: Research and document best practices for containerizing and deploying FastAPI + Next.js applications to Kubernetes

## 1. Docker Multi-Stage Builds

### Research Question
What are the optimal multi-stage build patterns for Python FastAPI and Next.js applications to minimize image size while maintaining functionality?

### Decision: Multi-Stage Build Strategy

**For FastAPI Backend**:
```dockerfile
# Stage 1: Builder - Install dependencies
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Runtime - Copy only necessary files
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
HEALTHCHECK CMD curl --fail http://localhost:8000/health || exit 1
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**For Next.js Frontend**:
```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

**Rationale**:
- Separates build-time dependencies from runtime
- Reduces final image size by 50-70%
- Improves security by excluding build tools from production image
- Enables better layer caching for faster rebuilds

**Alternatives Considered**:
- Single-stage builds: Rejected due to large image size (includes build tools)
- Distroless images: Rejected due to complexity and debugging difficulty in Phase IV
- Full Python/Node images: Rejected due to size (>1GB combined)

### Layer Caching Strategy

**Decision**: Copy dependency files before application code

**Pattern**:
```dockerfile
COPY requirements.txt .     # Changes infrequently
RUN pip install ...          # Cached unless requirements change
COPY . .                     # Changes frequently, doesn't invalidate cache above
```

**Rationale**: Dependencies change less frequently than code, so installing them in a separate layer enables cache reuse during development.

## 2. Helm Chart Structure

### Research Question
What is the optimal Helm chart structure for a microservices application with multiple components?

### Decision: Single Chart with Multiple Templates

**Structure**:
```
helm/todo-app/
├── Chart.yaml              # Chart metadata
├── values.yaml             # Default values
├── values-dev.yaml         # Development overrides
└── templates/
    ├── _helpers.tpl        # Template helpers
    ├── namespace.yaml      # Namespace (optional)
    ├── secret.yaml         # Secrets
    ├── configmap.yaml      # ConfigMaps
    ├── deployment-backend.yaml
    ├── deployment-frontend.yaml
    ├── service-backend.yaml
    ├── service-frontend.yaml
    ├── ingress.yaml
    └── NOTES.txt           # Post-install instructions
```

**Rationale**:
- Single chart simplifies deployment (one helm install command)
- Multiple templates provide clear separation of concerns
- Easier to understand and maintain for Phase IV scope
- Sufficient for 2-component application

**Alternatives Considered**:
- Separate charts per component: Rejected due to complexity (requires umbrella chart)
- Monolithic template: Rejected due to poor maintainability
- Helm dependencies: Rejected as overkill for Phase IV

### Values Organization

**Decision**: Hierarchical values.yaml structure

**Pattern**:
```yaml
global:
  namespace: todo-app
  imagePullPolicy: IfNotPresent

backend:
  image:
    repository: todo-backend
    tag: latest
  replicas: 1
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi
  probes:
    liveness:
      path: /health
      initialDelaySeconds: 30
      periodSeconds: 10
    readiness:
      path: /ready
      initialDelaySeconds: 10
      periodSeconds: 5

frontend:
  image:
    repository: todo-frontend
    tag: latest
  replicas: 1
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi
```

**Rationale**: Clear hierarchy, easy to override, follows Helm best practices.

## 3. Kubernetes Health Checks

### Research Question
What are the appropriate health check configurations for FastAPI and Next.js applications?

### Decision: Both Readiness and Liveness Probes

**Readiness Probe** (determines if pod should receive traffic):
- Path: `/ready`
- Initial Delay: 10 seconds (time for app to initialize)
- Period: 5 seconds (check frequently)
- Timeout: 3 seconds
- Failure Threshold: 3 (mark unready after 3 failures)

**Liveness Probe** (determines if pod should be restarted):
- Path: `/health`
- Initial Delay: 30 seconds (allow longer startup)
- Period: 10 seconds (check less frequently)
- Timeout: 5 seconds
- Failure Threshold: 3 (restart after 3 failures)

**Rationale**:
- Readiness prevents traffic to unhealthy pods
- Liveness enables automatic recovery from deadlocks
- Different thresholds prevent restart loops
- Longer initial delay for liveness prevents premature restarts

**Alternatives Considered**:
- Liveness only: Rejected (no traffic management)
- Readiness only: Rejected (no automatic recovery)
- Startup probes: Deferred to Phase V (not needed for fast-starting apps)

### Health Check Endpoints

**Decision**: Implement separate /health and /ready endpoints

**Backend Implementation** (FastAPI):
```python
@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/ready")
async def ready():
    # Check database connectivity
    try:
        await db.execute("SELECT 1")
        return {"status": "ready"}
    except Exception:
        raise HTTPException(status_code=503, detail="Not ready")
```

**Rationale**: /ready checks dependencies (DB), /health is simple and fast.

## 4. Resource Management

### Research Question
What are appropriate resource requests and limits for FastAPI and Next.js in Minikube?

### Decision: Conservative Resource Allocation

**Backend (FastAPI)**:
- CPU Request: 100m (0.1 core)
- CPU Limit: 500m (0.5 core)
- Memory Request: 128Mi
- Memory Limit: 512Mi

**Frontend (Next.js)**:
- CPU Request: 100m
- CPU Limit: 500m
- Memory Request: 128Mi
- Memory Limit: 512Mi

**Total Cluster Requirements**:
- Minimum: 4 CPU cores, 8GB RAM (for Minikube + 2 pods + overhead)
- Recommended: 4 CPU cores, 8GB RAM

**Rationale**:
- Requests ensure minimum resources available
- Limits prevent resource exhaustion
- Conservative values work on typical developer machines
- QoS class: Burstable (requests < limits)

**Alternatives Considered**:
- Guaranteed QoS (requests = limits): Rejected due to resource waste
- BestEffort (no requests/limits): Rejected due to unpredictable behavior
- Higher limits: Rejected due to Minikube constraints

## 5. Secret Management

### Research Question
What is the best practice for managing secrets in Kubernetes for local development?

### Decision: Kubernetes Secrets with Manual Creation

**Approach**:
1. Create secrets via kubectl before Helm install
2. Reference secrets in Helm templates via environment variables
3. Document secret creation in quickstart guide

**Secret Structure**:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: todo-app
type: Opaque
stringData:
  COHERE_API_KEY: "<key>"
  DATABASE_URL: "<neon-connection-string>"
  JWT_SECRET: "<secret>"
```

**Pod Consumption** (via environment variables):
```yaml
env:
  - name: COHERE_API_KEY
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: COHERE_API_KEY
```

**Rationale**:
- Native Kubernetes approach
- Secrets not stored in version control
- Secrets not in Helm values (which might be committed)
- Simple for local development

**Alternatives Considered**:
- Sealed Secrets: Rejected as overkill for Phase IV
- External Secrets Operator: Rejected due to complexity
- Helm secrets plugin: Rejected to avoid additional dependencies
- Plain environment variables: Rejected due to security concerns

### Secret Rotation Strategy

**Decision**: Manual rotation with pod restart

**Process**:
1. Update secret: `kubectl create secret generic app-secrets --from-literal=KEY=new-value --dry-run=client -o yaml | kubectl apply -f -`
2. Restart pods: `kubectl rollout restart deployment/backend -n todo-app`

**Rationale**: Simple, sufficient for Phase IV, no additional tooling required.

## 6. Security Best Practices

### Research Question
What security measures should be implemented for Phase IV Kubernetes deployment?

### Decision: Basic Security Baseline

**Implemented**:
1. **Kubernetes Secrets**: All sensitive data in Secrets
2. **Non-root User**: Run containers as non-root (UID 1000)
3. **Read-only Root Filesystem**: Where possible
4. **No Privileged Containers**: Default security context
5. **Basic RBAC**: Service account with minimal permissions
6. **Image Scanning**: Scan for vulnerabilities before deployment

**Dockerfile Security**:
```dockerfile
# Run as non-root user
RUN adduser --disabled-password --gecos '' appuser
USER appuser
```

**Pod Security Context**:
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  fsGroup: 1000
  readOnlyRootFilesystem: true
```

**Rationale**: Balances security with Phase IV scope, follows Kubernetes security best practices.

**Deferred to Phase V**:
- Network Policies (requires additional setup)
- Pod Security Standards/Policies (complex configuration)
- Image signing and verification (requires registry setup)
- Secrets encryption at rest (requires etcd configuration)

## 7. Base Image Selection

### Research Question
Should we use Alpine, Slim, or Distroless base images?

### Decision: python:3.11-slim for Backend, node:18-alpine for Frontend

**Rationale**:

**Python (Slim)**:
- Size: ~150MB (vs Alpine ~50MB, Full ~900MB)
- Compatibility: Better C extension support than Alpine
- Debugging: Includes shell and basic tools
- Trade-off: Slightly larger than Alpine, but more compatible

**Node (Alpine)**:
- Size: ~40MB (vs Slim ~180MB)
- Compatibility: Node.js works well on Alpine
- Performance: No significant difference
- Trade-off: Minimal, Alpine is ideal for Node.js

**Combined Target**: <600MB total (Backend ~300MB, Frontend ~250MB)

**Alternatives Considered**:
- Distroless: Rejected due to debugging difficulty (no shell)
- Full images: Rejected due to size (>1GB combined)
- Alpine for both: Rejected due to Python C extension issues

## 8. Logging Strategy

### Research Question
What logging approach should be used for Kubernetes applications?

### Decision: Structured JSON Logging to stdout/stderr

**Backend Logging** (Python):
```python
import logging
import json

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "message": record.getMessage(),
            "request_id": getattr(record, 'request_id', None),
            "user_id": getattr(record, 'user_id', None),
        }
        return json.dumps(log_data)

logging.basicConfig(level=logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
```

**Rationale**:
- Structured logs are parseable
- stdout/stderr is Kubernetes standard
- Works with kubectl logs
- No additional infrastructure needed

**Alternatives Considered**:
- Sidecar logging: Rejected as overkill for Phase IV
- External logging service (ELK, Loki): Deferred to Phase V
- File-based logging: Rejected (not Kubernetes-native)

## Summary of Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Docker Strategy** | Multi-stage builds | 50-70% size reduction, better security |
| **Base Images** | python:3.11-slim, node:18-alpine | Balance size and compatibility |
| **Helm Structure** | Single chart, multiple templates | Simplicity for 2-component app |
| **Health Checks** | Both readiness and liveness | Traffic management + auto-recovery |
| **Resources** | Conservative (100m CPU, 128Mi RAM requests) | Works on typical dev machines |
| **Secrets** | Kubernetes Secrets, manual creation | Native approach, secure |
| **Security** | Non-root user, basic RBAC, image scanning | Baseline security for Phase IV |
| **Logging** | Structured JSON to stdout | Kubernetes-native, parseable |

## Implementation Readiness

✅ All research questions answered
✅ All decisions documented with rationale
✅ All alternatives considered
✅ Ready to proceed to Phase 1 (Design & Contracts)
