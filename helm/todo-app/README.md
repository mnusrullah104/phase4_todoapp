# Todo AI Chatbot - Kubernetes Deployment

This Helm chart deploys the Todo AI Chatbot application to a Kubernetes cluster (Minikube for local development).

## Prerequisites

Before deploying, ensure you have the following installed:

- **Docker Desktop** (24.0+): [Download](https://www.docker.com/products/docker-desktop)
- **Minikube** (1.32+): [Download](https://minikube.sigs.k8s.io/docs/start/)
- **kubectl** (1.28+): [Download](https://kubernetes.io/docs/tasks/tools/)
- **Helm** (3.13+): [Download](https://helm.sh/docs/intro/install/)

Verify installations:
```bash
docker --version
minikube version
kubectl version --client
helm version
```

## Quick Start (5 Steps)

### Step 1: Start Minikube

```bash
# Start Minikube with sufficient resources
minikube start --cpus=4 --memory=8192 --driver=docker

# Enable ingress addon
minikube addons enable ingress

# Verify cluster is running
kubectl cluster-info
```

### Step 2: Build and Load Container Images

```bash
# Navigate to project root
cd /path/to/phase4

# Build backend image
docker build -t todo-backend:latest -f docker/backend/Dockerfile backend/

# Build frontend image
docker build -t todo-frontend:latest -f docker/frontend/Dockerfile frontend/

# Load images into Minikube
minikube image load todo-backend:latest
minikube image load todo-frontend:latest

# Verify images are loaded
minikube image ls | grep todo-
```

### Step 3: Create Kubernetes Secrets

```bash
# Create namespace
kubectl create namespace todo-app

# Create secrets (replace with your actual values)
kubectl create secret generic app-secrets \
  --from-literal=COHERE_API_KEY='your-cohere-api-key-here' \
  --from-literal=DATABASE_URL='postgresql://user:pass@host.neon.tech/db?sslmode=require' \
  --from-literal=JWT_SECRET='your-jwt-secret-here' \
  --namespace=todo-app

# Verify secret was created
kubectl get secret app-secrets -n todo-app
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

### Step 4: Deploy with Helm

```bash
# Validate Helm chart
helm lint helm/todo-app

# Dry-run to preview resources
helm install todo-app helm/todo-app --dry-run --debug -n todo-app

# Install the Helm chart
helm install todo-app helm/todo-app --namespace=todo-app

# Watch pods starting
kubectl get pods -n todo-app -w
```

Expected output (after ~30-60 seconds):
```
NAME                                  READY   STATUS    RESTARTS   AGE
backend-deployment-xxxxx-xxxxx        1/1     Running   0          45s
frontend-deployment-xxxxx-xxxxx       1/1     Running   0          45s
```

Press `Ctrl+C` to stop watching.

### Step 5: Access the Application

**Option A: Port Forward (Simplest)**
```bash
# Forward frontend port
kubectl port-forward svc/frontend-service 3000:3000 -n todo-app

# Open browser to http://localhost:3000
```

**Option B: Ingress (Recommended)**
```bash
# Get Minikube IP
minikube ip

# Add to /etc/hosts (replace <MINIKUBE_IP> with actual IP)
echo "<MINIKUBE_IP> todo-app.local" | sudo tee -a /etc/hosts

# Open browser to http://todo-app.local
```

**Option C: Minikube Service**
```bash
# Open frontend service in browser
minikube service frontend-service -n todo-app
```

## Verification Steps

### 1. Check Pod Health

```bash
# All pods should be Running and Ready
kubectl get pods -n todo-app

# Check pod details
kubectl describe pod -l app=backend -n todo-app
```

Expected: All pods show `1/1 READY` and `Running` status.

### 2. Check Services

```bash
# List services
kubectl get svc -n todo-app

# Test backend health endpoint
kubectl port-forward svc/backend-service 8000:8000 -n todo-app &
curl http://localhost:8000/health
```

Expected: `{"status":"healthy","timestamp":"..."}`

### 3. Test Application

1. Open frontend in browser
2. Login with test credentials
3. Try natural language commands:
   - "Add a task to buy groceries"
   - "Show me all my tasks"
   - "Mark the groceries task as complete"
   - "Delete the completed task"

Expected: All commands work, tasks persist in database.

### 4. Test Pod Restart (Persistence)

```bash
# Delete backend pod
kubectl delete pod -l app=backend -n todo-app

# Wait for new pod to start
kubectl wait --for=condition=ready pod -l app=backend -n todo-app --timeout=60s

# Verify conversation history is restored (check in browser)
```

Expected: Conversation history persists after pod restart.

## Configuration

### Helm Values

The chart can be configured via `values.yaml`. Key configuration options:

```yaml
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

frontend:
  image:
    repository: todo-frontend
    tag: latest
  replicas: 1

ingress:
  enabled: true
  host: todo-app.local
```

### Custom Values

Create a custom values file:

```bash
# Create custom values
cat > values-custom.yaml <<EOF
backend:
  replicas: 2
frontend:
  replicas: 2
ingress:
  host: my-todo-app.local
EOF

# Deploy with custom values
helm install todo-app helm/todo-app -f values-custom.yaml -n todo-app
```

## Troubleshooting

### Issue: Pods Not Starting

**Symptoms**: Pods stuck in `Pending`, `ImagePullBackOff`, or `CrashLoopBackOff`

**Solutions**:

1. **Check pod status**:
   ```bash
   kubectl describe pod <pod-name> -n todo-app
   ```

2. **Check logs**:
   ```bash
   kubectl logs <pod-name> -n todo-app
   ```

3. **Common fixes**:
   - **ImagePullBackOff**: Images not loaded into Minikube
     ```bash
     minikube image load todo-backend:latest
     minikube image load todo-frontend:latest
     ```

   - **CrashLoopBackOff**: Check logs for errors
     ```bash
     kubectl logs <pod-name> -n todo-app --previous
     ```

   - **Secrets missing**: Verify secrets exist
     ```bash
     kubectl get secret app-secrets -n todo-app
     ```

### Issue: Cannot Access Frontend

**Symptoms**: Browser shows "Connection refused" or "Site can't be reached"

**Solutions**:

1. **Verify service is running**:
   ```bash
   kubectl get svc frontend-service -n todo-app
   ```

2. **Check ingress status**:
   ```bash
   kubectl get ingress -n todo-app
   minikube addons list | grep ingress
   ```

3. **Use port-forward as fallback**:
   ```bash
   kubectl port-forward svc/frontend-service 3000:3000 -n todo-app
   ```

### Issue: Database Connection Errors

**Symptoms**: Backend logs show "Database connection failed"

**Solutions**:

1. **Verify DATABASE_URL secret**:
   ```bash
   kubectl get secret app-secrets -n todo-app -o jsonpath='{.data.DATABASE_URL}' | base64 -d
   ```

2. **Test database connectivity from pod**:
   ```bash
   kubectl exec -it <backend-pod> -n todo-app -- curl -v <neon-host>:5432
   ```

3. **Check Neon database status** in Neon dashboard

## Cleanup

### Remove Deployment

```bash
# Uninstall Helm release
helm uninstall todo-app -n todo-app

# Delete namespace (removes all resources)
kubectl delete namespace todo-app
```

### Stop Minikube

```bash
# Stop Minikube cluster
minikube stop

# Delete Minikube cluster (removes all data)
minikube delete
```

## Useful Commands

```bash
# View all resources
kubectl get all -n todo-app

# View logs (follow mode)
kubectl logs -f -l app=backend -n todo-app

# Execute command in pod
kubectl exec -it <pod-name> -n todo-app -- /bin/sh

# View events
kubectl get events -n todo-app --sort-by='.lastTimestamp'

# Restart deployment
kubectl rollout restart deployment/backend-deployment -n todo-app

# View Helm release
helm list -n todo-app

# View Helm values
helm get values todo-app -n todo-app

# Upgrade Helm release
helm upgrade todo-app helm/todo-app -n todo-app

# Minikube dashboard
minikube dashboard
```

## Architecture

```
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
│  │  │  │  FastAPI + MCP      │    │  Next.js + ChatKit │  │  │ │
│  │  │  │  + Cohere Agent     │    │                    │  │  │ │
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
│  │  │             └─────────────────────┘                  │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
                  ┌───────────────────────┐
                  │  External Services    │
                  │  - Neon PostgreSQL    │
                  │  - Cohere API         │
                  └───────────────────────┘
```

## Support

For issues or questions:
- Check [Troubleshooting Guide](../../docs/deployment/troubleshooting.md)
- Review [Architecture Documentation](../../specs/001-k8s-deployment/plan.md)
- Check pod logs: `kubectl logs <pod-name> -n todo-app`
- Check events: `kubectl get events -n todo-app`

## License

See project LICENSE file.
