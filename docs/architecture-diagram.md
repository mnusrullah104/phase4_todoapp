# Phase IV - Kubernetes Architecture

## Overview

This document describes the Kubernetes architecture for the Todo AI Chatbot application deployed on Minikube.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Minikube Cluster                                │
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                      Namespace: todo-app                            │ │
│  │                                                                      │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │                    Ingress Controller                         │  │ │
│  │  │  (nginx)                                                      │  │ │
│  │  │  Host: todo-app.local                                         │  │ │
│  │  └────────────────────┬─────────────────────────────────────────┘  │ │
│  │                       │                                              │ │
│  │                       ▼                                              │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │              Frontend Service (NodePort)                      │  │ │
│  │  │              Port: 3000, NodePort: 30080                      │  │ │
│  │  └────────────────────┬─────────────────────────────────────────┘  │ │
│  │                       │                                              │ │
│  │                       ▼                                              │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │           Frontend Deployment (1 replica)                     │  │ │
│  │  │  ┌────────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  Pod: frontend-deployment-xxxxx                         │  │  │ │
│  │  │  │  Image: todo-frontend:latest (Node.js 18-alpine)        │  │  │ │
│  │  │  │  Port: 3000                                              │  │  │ │
│  │  │  │  Resources: 100m-500m CPU, 128Mi-512Mi Memory           │  │  │ │
│  │  │  │  Probes: Liveness (/) + Readiness (/)                   │  │  │ │
│  │  │  │  Security: runAsNonRoot, runAsUser 1001                 │  │  │ │
│  │  │  │                                                           │  │  │ │
│  │  │  │  Env: NEXT_PUBLIC_BACKEND_URL → backend-service:8000    │  │  │ │
│  │  │  └────────────────────────────────────────────────────────┘  │  │ │
│  │  └──────────────────────────────────────────────────────────────┘  │ │
│  │                                                                      │ │
│  │                       │ HTTP Requests                                │ │
│  │                       ▼                                              │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │              Backend Service (ClusterIP)                      │  │ │
│  │  │              Port: 8000                                       │  │ │
│  │  └────────────────────┬─────────────────────────────────────────┘  │ │
│  │                       │                                              │ │
│  │                       ▼                                              │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │           Backend Deployment (1 replica)                      │  │ │
│  │  │  ┌────────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  Pod: backend-deployment-xxxxx                          │  │  │ │
│  │  │  │  Image: todo-backend:latest (Python 3.11-slim)          │  │  │ │
│  │  │  │  Port: 8000                                              │  │  │ │
│  │  │  │  Resources: 100m-500m CPU, 128Mi-512Mi Memory           │  │  │ │
│  │  │  │  Probes: Liveness (/health) + Readiness (/ready)        │  │  │ │
│  │  │  │  Security: runAsNonRoot, runAsUser 1000                 │  │  │ │
│  │  │  │  ServiceAccount: backend-sa                             │  │  │ │
│  │  │  │                                                           │  │  │ │
│  │  │  │  Env (from Secret: app-secrets):                        │  │  │ │
│  │  │  │    - COHERE_API_KEY                                     │  │  │ │
│  │  │  │    - DATABASE_URL                                       │  │  │ │
│  │  │  │    - JWT_SECRET                                         │  │  │ │
│  │  │  └────────────────────────────────────────────────────────┘  │  │ │
│  │  └──────────────────────────────────────────────────────────────┘  │ │
│  │                                                                      │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │                    RBAC Resources                             │  │ │
│  │  │  ┌────────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  ServiceAccount: backend-sa                             │  │  │ │
│  │  │  └────────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌────────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  Role: backend-role                                     │  │  │ │
│  │  │  │  Permissions: read secrets, configmaps, services        │  │  │ │
│  │  │  └────────────────────────────────────────────────────────┘  │  │ │
│  │  │  ┌────────────────────────────────────────────────────────┐  │  │ │
│  │  │  │  RoleBinding: backend-rolebinding                       │  │  │ │
│  │  │  │  Binds: backend-sa → backend-role                       │  │  │ │
│  │  │  └────────────────────────────────────────────────────────┘  │  │ │
│  │  └──────────────────────────────────────────────────────────────┘  │ │
│  │                                                                      │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │                    Secret: app-secrets                        │  │ │
│  │  │  - COHERE_API_KEY (base64 encoded)                           │  │ │
│  │  │  - DATABASE_URL (base64 encoded)                             │  │ │
│  │  │  - JWT_SECRET (base64 encoded)                               │  │ │
│  │  └──────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ PostgreSQL Connection
                                   ▼
                    ┌──────────────────────────────┐
                    │  External: Neon Serverless   │
                    │  PostgreSQL Database         │
                    │  (User data, conversations)  │
                    └──────────────────────────────┘
                                   │
                                   │ API Calls
                                   ▼
                    ┌──────────────────────────────┐
                    │  External: Cohere AI API     │
                    │  (Natural language processing)│
                    └──────────────────────────────┘
```

## Component Details

### Frontend (Next.js)

**Purpose**: Serves the web UI with ChatKit integration for conversational task management.

**Key Features**:
- Next.js 14+ with App Router
- ChatKit UI for AI chatbot interface
- Responsive design with Tailwind CSS
- Connects to backend service via ClusterIP

**Container Specs**:
- Base Image: node:18-alpine
- Multi-stage build: deps → builder → runner
- Non-root user (nextjs, UID 1001)
- Port: 3000
- Health Checks: Liveness and readiness on `/`

### Backend (FastAPI)

**Purpose**: Provides REST API, MCP tools, and Cohere agent integration.

**Key Features**:
- FastAPI with Python 3.13+
- 5 MCP tools (add_task, list_tasks, complete_task, delete_task, update_task)
- OpenAI Agents SDK integration with Cohere
- JWT authentication
- User isolation and data persistence

**Container Specs**:
- Base Image: python:3.11-slim
- Multi-stage build: builder → runtime
- Non-root user (appuser, UID 1000)
- Port: 8000
- Health Checks: Liveness on `/health`, readiness on `/ready`

### Services

**Frontend Service (NodePort)**:
- Type: NodePort
- Port: 3000
- NodePort: 30080
- Selector: app=frontend
- Purpose: External access to frontend

**Backend Service (ClusterIP)**:
- Type: ClusterIP
- Port: 8000
- Selector: app=backend
- Purpose: Internal communication only

### Ingress

**Configuration**:
- IngressClassName: nginx
- Host: todo-app.local
- Path: / → frontend-service:3000
- Purpose: Production-like access pattern

### Secrets Management

**Secret: app-secrets**:
- COHERE_API_KEY: API key for Cohere AI
- DATABASE_URL: Connection string for Neon PostgreSQL
- JWT_SECRET: Secret for JWT token signing

**Security**:
- Base64 encoded in Kubernetes
- Injected as environment variables
- Not stored in version control
- Not visible in container images

### RBAC (Role-Based Access Control)

**ServiceAccount: backend-sa**:
- Used by backend pods
- Minimal permissions principle

**Role: backend-role**:
- Permissions: read secrets (app-secrets only), configmaps, services
- Namespace-scoped

**RoleBinding: backend-rolebinding**:
- Binds backend-sa to backend-role

## Data Flow

### User Request Flow

1. **User** → Browser → http://todo-app.local or http://localhost:3000
2. **Ingress/Port-forward** → Routes to frontend-service:3000
3. **Frontend Service** → Routes to frontend pod
4. **Frontend Pod** → Renders UI, handles user interaction
5. **Frontend** → HTTP request to backend-service:8000
6. **Backend Service** → Routes to backend pod
7. **Backend Pod** → Processes request via FastAPI
8. **Backend** → Calls Cohere API for natural language processing
9. **Backend** → Executes MCP tool (e.g., add_task)
10. **Backend** → Persists data to Neon PostgreSQL
11. **Backend** → Returns response to frontend
12. **Frontend** → Updates UI with result

### Health Check Flow

**Liveness Probes**:
- Frontend: GET / every 10s (after 30s initial delay)
- Backend: GET /health every 10s (after 30s initial delay)
- Purpose: Restart pod if unhealthy

**Readiness Probes**:
- Frontend: GET / every 5s (after 10s initial delay)
- Backend: GET /ready every 5s (after 10s initial delay)
- Purpose: Remove from service endpoints if not ready

## Resource Management

### Resource Requests (Guaranteed)

- Backend: 100m CPU, 128Mi memory
- Frontend: 100m CPU, 128Mi memory
- Total: 200m CPU, 256Mi memory

### Resource Limits (Maximum)

- Backend: 500m CPU, 512Mi memory
- Frontend: 500m CPU, 512Mi memory
- Total: 1000m CPU, 1024Mi memory

### Minikube Requirements

- Minimum: 2 CPUs, 4GB RAM
- Recommended: 4 CPUs, 8GB RAM
- Reason: Overhead for Kubernetes control plane + application pods

## Security Features

### Container Security

- Non-root users in all containers
- Security context: runAsNonRoot=true
- Minimal base images (slim/alpine)
- Multi-stage builds (no build tools in runtime)
- Health checks for automatic recovery

### Network Security

- Backend service is ClusterIP (internal only)
- Frontend exposed via controlled ingress
- No direct pod access from outside cluster

### Secrets Security

- Kubernetes Secrets for sensitive data
- Base64 encoding at rest
- Environment variable injection
- RBAC controls access to secrets

### RBAC Security

- Minimal permissions (read-only)
- Namespace-scoped roles
- Service account per component
- Explicit role bindings

## Deployment Process

### Image Build and Load

```bash
# Build images locally
docker build -t todo-backend:latest -f docker/backend/Dockerfile backend/
docker build -t todo-frontend:latest -f docker/frontend/Dockerfile frontend/

# Load into Minikube
minikube image load todo-backend:latest
minikube image load todo-frontend:latest
```

### Helm Deployment

```bash
# Create namespace and secrets
kubectl create namespace todo-app
kubectl create secret generic app-secrets \
  --from-literal=COHERE_API_KEY='...' \
  --from-literal=DATABASE_URL='...' \
  --from-literal=JWT_SECRET='...' \
  --namespace=todo-app

# Deploy with Helm
helm install todo-app helm/todo-app --namespace todo-app
```

### Access Methods

**Option 1: Port Forwarding**
```bash
kubectl port-forward -n todo-app service/frontend-service 3000:3000
# Access: http://localhost:3000
```

**Option 2: Ingress**
```bash
echo "$(minikube ip) todo-app.local" | sudo tee -a /etc/hosts
# Access: http://todo-app.local
```

**Option 3: NodePort**
```bash
minikube service frontend-service -n todo-app
# Opens browser automatically
```

## Monitoring and Observability

### Health Endpoints

- Backend `/health`: Returns {"status": "healthy"}
- Backend `/ready`: Checks database connectivity
- Frontend `/`: Returns Next.js page

### Logs

```bash
# Backend logs
kubectl logs -n todo-app -l app=backend --tail=50

# Frontend logs
kubectl logs -n todo-app -l app=frontend --tail=50

# Follow logs
kubectl logs -n todo-app -l app=backend -f
```

### Resource Usage

```bash
# Pod resource usage
kubectl top pods -n todo-app

# Node resource usage
kubectl top nodes
```

### Events

```bash
# Recent events
kubectl get events -n todo-app --sort-by='.lastTimestamp'

# Watch events
kubectl get events -n todo-app -w
```

## AI-Assisted Operations

### kubectl-ai Examples

```bash
# Natural language queries
kubectl ai "show me all pods in todo-app namespace"
kubectl ai "get logs from backend pod"
kubectl ai "restart the backend deployment"
kubectl ai "show resource usage for todo-app"
```

### kagent Examples

```bash
# Deployment analysis
kagent analyze deployment backend-deployment -n todo-app

# Resource optimization
kagent optimize resources -n todo-app

# Troubleshooting
kagent troubleshoot pod <pod-name> -n todo-app
```

## Version

1.0.0

## Last Updated

2026-02-19
