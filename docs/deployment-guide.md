# Phase IV - Kubernetes Deployment Guide

## Overview

This guide provides detailed, step-by-step instructions for deploying the Todo AI Chatbot application to a local Kubernetes cluster using Minikube and Helm.

## Prerequisites

### Required Software

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| Docker Desktop | 20.10+ | Container runtime | https://www.docker.com/products/docker-desktop |
| Minikube | 1.30+ | Local Kubernetes cluster | https://minikube.sigs.k8s.io/docs/start/ |
| kubectl | 1.27+ | Kubernetes CLI | https://kubernetes.io/docs/tasks/tools/ |
| Helm | 3.12+ | Kubernetes package manager | https://helm.sh/docs/intro/install/ |

### System Requirements

- **CPU**: 4 cores minimum (2 for Minikube, 2 for application)
- **Memory**: 8GB RAM minimum (4GB for Minikube, 4GB for system)
- **Disk**: 20GB free space
- **OS**: Windows 10/11, macOS 10.15+, or Linux

### Required Credentials

Before starting, ensure you have:

1. **Cohere API Key**: Sign up at https://cohere.ai/ and get your API key
2. **Neon Database URL**: PostgreSQL connection string from https://neon.tech/
3. **JWT Secret**: Generate a random secret (e.g., `openssl rand -hex 32`)

## Deployment Steps

### Step 1: Verify Prerequisites

**1.1 Check Docker**

```bash
docker --version
# Expected: Docker version 20.10.0 or higher

docker ps
# Expected: No errors, shows running containers (if any)
```

**1.2 Check Minikube**

```bash
minikube version
# Expected: minikube version: v1.30.0 or higher
```

**1.3 Check kubectl**

```bash
kubectl version --client
# Expected: Client Version: v1.27.0 or higher
```

**1.4 Check Helm**

```bash
helm version
# Expected: version.BuildInfo{Version:"v3.12.0" or higher}
```

If any tool is missing, install it using the links in the Prerequisites table.

---

### Step 2: Start Minikube Cluster

**2.1 Start Minikube with Recommended Resources**

```bash
minikube start --cpus=4 --memory=8192 --driver=docker
```

**Expected Output:**
```
😄  minikube v1.30.0 on Darwin 13.0
✨  Using the docker driver based on user configuration
👍  Starting control plane node minikube in cluster minikube
🚜  Pulling base image ...
🔥  Creating docker container (CPUs=4, Memory=8192MB) ...
🐳  Preparing Kubernetes v1.27.0 on Docker 23.0.2 ...
🔎  Verifying Kubernetes components...
🌟  Enabled addons: storage-provisioner, default-storageclass
🏄  Done! kubectl is now configured to use "minikube" cluster
```

**2.2 Enable Required Addons**

```bash
# Enable ingress controller
minikube addons enable ingress

# Enable metrics server (optional, for resource monitoring)
minikube addons enable metrics-server
```

**Expected Output:**
```
💡  ingress is an addon maintained by Kubernetes
🔎  Verifying ingress addon...
🌟  The 'ingress' addon is enabled
```

**2.3 Verify Cluster is Running**

```bash
kubectl cluster-info
```

**Expected Output:**
```
Kubernetes control plane is running at https://127.0.0.1:xxxxx
CoreDNS is running at https://127.0.0.1:xxxxx/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

**2.4 Check Node Status**

```bash
kubectl get nodes
```

**Expected Output:**
```
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   1m    v1.27.0
```

---

### Step 3: Build Container Images

**3.1 Navigate to Project Root**

```bash
cd /path/to/phase4
```

**3.2 Build Backend Image**

```bash
docker build -t todo-backend:latest -f docker/backend/Dockerfile backend/
```

**Expected Output:**
```
[+] Building 45.2s (12/12) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 789B
 => [internal] load .dockerignore
 => [builder 1/4] FROM docker.io/library/python:3.11-slim
 => [builder 2/4] WORKDIR /app
 => [builder 3/4] COPY requirements.txt .
 => [builder 4/4] RUN pip install --user --no-cache-dir -r requirements.txt
 => [stage-1 1/6] FROM docker.io/library/python:3.11-slim
 => [stage-1 2/6] WORKDIR /app
 => [stage-1 3/6] RUN adduser --disabled-password --gecos '' appuser
 => [stage-1 4/6] COPY --from=builder /root/.local /root/.local
 => [stage-1 5/6] COPY . .
 => [stage-1 6/6] RUN chown -R appuser:appuser /app
 => exporting to image
 => => exporting layers
 => => writing image sha256:abc123...
 => => naming to docker.io/library/todo-backend:latest
```

**3.3 Build Frontend Image**

```bash
docker build -t todo-frontend:latest -f docker/frontend/Dockerfile frontend/
```

**Expected Output:**
```
[+] Building 120.5s (18/18) FINISHED
 => [internal] load build definition from Dockerfile
 => [deps 1/3] FROM docker.io/library/node:18-alpine
 => [deps 2/3] WORKDIR /app
 => [deps 3/3] COPY package.json package-lock.json* ./
 => [deps 4/3] RUN npm ci --only=production
 => [builder 1/4] WORKDIR /app
 => [builder 2/4] COPY package.json package-lock.json* ./
 => [builder 3/4] RUN npm ci
 => [builder 4/4] COPY . .
 => [builder 5/4] RUN npm run build
 => [runner 1/6] WORKDIR /app
 => [runner 2/6] RUN addgroup --system --gid 1001 nodejs
 => [runner 3/6] RUN adduser --system --uid 1001 nextjs
 => [runner 4/6] COPY --from=builder /app/public ./public
 => [runner 5/6] COPY --from=builder /app/.next/standalone ./
 => [runner 6/6] COPY --from=builder /app/.next/static ./.next/static
 => exporting to image
 => => writing image sha256:def456...
 => => naming to docker.io/library/todo-frontend:latest
```

**3.4 Verify Images Built**

```bash
docker images | grep todo-
```

**Expected Output:**
```
todo-frontend   latest   def456...   2 minutes ago   250MB
todo-backend    latest   abc123...   5 minutes ago   320MB
```

**Total size should be <600MB.**

---

### Step 4: Load Images into Minikube

**4.1 Load Backend Image**

```bash
minikube image load todo-backend:latest
```

**Expected Output:**
```
✅  Successfully loaded image todo-backend:latest
```

**4.2 Load Frontend Image**

```bash
minikube image load todo-frontend:latest
```

**Expected Output:**
```
✅  Successfully loaded image todo-frontend:latest
```

**4.3 Verify Images in Minikube**

```bash
minikube image ls | grep todo-
```

**Expected Output:**
```
docker.io/library/todo-backend:latest
docker.io/library/todo-frontend:latest
```

---

### Step 5: Create Kubernetes Namespace

**5.1 Create Namespace**

```bash
kubectl create namespace todo-app
```

**Expected Output:**
```
namespace/todo-app created
```

**5.2 Verify Namespace**

```bash
kubectl get namespaces | grep todo-app
```

**Expected Output:**
```
todo-app   Active   5s
```

---

### Step 6: Create Kubernetes Secrets

**6.1 Prepare Your Credentials**

Replace the placeholder values with your actual credentials:

- `your-cohere-api-key`: Your Cohere API key from https://cohere.ai/
- `your-neon-db-url`: Your Neon PostgreSQL connection string
- `your-jwt-secret`: A random secret (generate with `openssl rand -hex 32`)

**6.2 Create Secret**

```bash
kubectl create secret generic app-secrets \
  --from-literal=COHERE_API_KEY='your-cohere-api-key' \
  --from-literal=DATABASE_URL='your-neon-db-url' \
  --from-literal=JWT_SECRET='your-jwt-secret' \
  --namespace=todo-app
```

**Expected Output:**
```
secret/app-secrets created
```

**6.3 Verify Secret Created**

```bash
kubectl get secret app-secrets -n todo-app
```

**Expected Output:**
```
NAME          TYPE     DATA   AGE
app-secrets   Opaque   3      10s
```

**6.4 Verify Secret Keys**

```bash
kubectl get secret app-secrets -n todo-app -o jsonpath='{.data}' | jq 'keys'
```

**Expected Output:**
```json
[
  "COHERE_API_KEY",
  "DATABASE_URL",
  "JWT_SECRET"
]
```

**Security Note:** Never commit secrets to version control. The secret values are base64 encoded but not encrypted at rest in Kubernetes.

---

### Step 7: Validate Helm Chart

**7.1 Lint Helm Chart**

```bash
helm lint helm/todo-app
```

**Expected Output:**
```
==> Linting helm/todo-app
[INFO] Chart.yaml: icon is recommended

1 chart(s) linted, 0 chart(s) failed
```

**7.2 Dry-Run Deployment**

```bash
helm install todo-app helm/todo-app --dry-run --debug -n todo-app
```

**Expected Output:**
```
install.go: [debug] Original chart version: "1.0.0"
install.go: [debug] CHART PATH: /path/to/helm/todo-app

NAME: todo-app
LAST DEPLOYED: ...
NAMESPACE: todo-app
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
backend:
  image:
    repository: todo-backend
    tag: latest
...

HOOKS:
MANIFEST:
---
# Source: todo-app/templates/namespace.yaml
apiVersion: v1
kind: Namespace
...
```

Review the output to ensure all resources are correctly configured.

---

### Step 8: Deploy Application with Helm

**8.1 Install Helm Chart**

```bash
helm install todo-app helm/todo-app --namespace todo-app
```

**Expected Output:**
```
NAME: todo-app
LAST DEPLOYED: Wed Feb 19 10:30:00 2026
NAMESPACE: todo-app
STATUS: deployed
REVISION: 1
NOTES:
1. Get the application URL by running these commands:
  export NODE_PORT=$(kubectl get --namespace todo-app -o jsonpath="{.spec.ports[0].nodePort}" services frontend-service)
  export NODE_IP=$(kubectl get nodes --namespace todo-app -o jsonpath="{.items[0].status.addresses[0].address}")
  echo http://$NODE_IP:$NODE_PORT

2. Or use port-forwarding:
  kubectl port-forward -n todo-app service/frontend-service 3000:3000
  Then access: http://localhost:3000
```

**8.2 Watch Pods Starting**

```bash
kubectl get pods -n todo-app -w
```

**Expected Output:**
```
NAME                                  READY   STATUS              RESTARTS   AGE
backend-deployment-7d9f8b5c6d-x7k2m   0/1     ContainerCreating   0          5s
frontend-deployment-6c8d9f4b5-p9n3l   0/1     ContainerCreating   0          5s
backend-deployment-7d9f8b5c6d-x7k2m   0/1     Running             0          15s
frontend-deployment-6c8d9f4b5-p9n3l   0/1     Running             0          15s
backend-deployment-7d9f8b5c6d-x7k2m   1/1     Running             0          45s
frontend-deployment-6c8d9f4b5-p9n3l   1/1     Running             0          50s
```

Press `Ctrl+C` to stop watching once both pods show `1/1 Running`.

---

### Step 9: Verify Deployment

**9.1 Check Pod Status**

```bash
kubectl get pods -n todo-app
```

**Expected Output:**
```
NAME                                  READY   STATUS    RESTARTS   AGE
backend-deployment-7d9f8b5c6d-x7k2m   1/1     Running   0          2m
frontend-deployment-6c8d9f4b5-p9n3l   1/1     Running   0          2m
```

**9.2 Check Services**

```bash
kubectl get svc -n todo-app
```

**Expected Output:**
```
NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
backend-service    ClusterIP   10.96.100.50    <none>        8000/TCP         2m
frontend-service   NodePort    10.96.200.100   <none>        3000:30080/TCP   2m
```

**9.3 Check Ingress**

```bash
kubectl get ingress -n todo-app
```

**Expected Output:**
```
NAME            CLASS   HOSTS             ADDRESS        PORTS   AGE
todo-ingress    nginx   todo-app.local    192.168.49.2   80      2m
```

**9.4 Check Logs**

```bash
# Backend logs
kubectl logs -n todo-app -l app=backend --tail=20

# Frontend logs
kubectl logs -n todo-app -l app=frontend --tail=20
```

**Expected**: No error messages, application startup logs visible.

---

### Step 10: Access the Application

Choose one of three access methods:

#### Option 1: Port Forwarding (Recommended for Quick Access)

**10.1.1 Start Port Forward**

```bash
kubectl port-forward -n todo-app service/frontend-service 3000:3000
```

**Expected Output:**
```
Forwarding from 127.0.0.1:3000 -> 3000
Forwarding from [::1]:3000 -> 3000
```

**10.1.2 Access Application**

Open browser: http://localhost:3000

**Keep the terminal open** while using the application.

---

#### Option 2: Ingress (Production-Like Access)

**10.2.1 Get Minikube IP**

```bash
minikube ip
```

**Expected Output:**
```
192.168.49.2
```

**10.2.2 Add to /etc/hosts**

```bash
# Linux/macOS
echo "$(minikube ip) todo-app.local" | sudo tee -a /etc/hosts

# Windows (run as Administrator in PowerShell)
Add-Content -Path C:\Windows\System32\drivers\etc\hosts -Value "$(minikube ip) todo-app.local"
```

**10.2.3 Access Application**

Open browser: http://todo-app.local

---

#### Option 3: NodePort (Direct Node Access)

**10.3.1 Open Service**

```bash
minikube service frontend-service -n todo-app
```

**Expected Output:**
```
|-----------|------------------|-------------|---------------------------|
| NAMESPACE |       NAME       | TARGET PORT |            URL            |
|-----------|------------------|-------------|---------------------------|
| todo-app  | frontend-service |        3000 | http://192.168.49.2:30080 |
|-----------|------------------|-------------|---------------------------|
🎉  Opening service todo-app/frontend-service in default browser...
```

Browser opens automatically to the application.

---

### Step 11: Test Application Functionality

**11.1 Test User Registration**

1. Click "Sign Up" on the homepage
2. Enter email and password
3. Click "Create Account"
4. Verify successful registration

**11.2 Test User Login**

1. Enter registered email and password
2. Click "Sign In"
3. Verify redirect to dashboard

**11.3 Test AI Chatbot**

1. Click chat icon in bottom-right corner
2. Type: "Add task: Buy groceries"
3. Verify task created and visible in task list
4. Type: "Show my tasks"
5. Verify chatbot lists all tasks
6. Type: "Complete task: Buy groceries"
7. Verify task marked as complete

**11.4 Test All MCP Tools**

Test each of the 5 MCP tools via natural language:

| Tool | Command | Expected Result |
|------|---------|-----------------|
| add_task | "Add task: Test deployment" | Task created |
| list_tasks | "Show my tasks" | All tasks listed |
| complete_task | "Complete task: Test deployment" | Task marked complete |
| update_task | "Update task: Change deadline to tomorrow" | Task updated |
| delete_task | "Delete task: Test deployment" | Task deleted |

**11.5 Test Conversation Persistence**

1. Send a message to chatbot
2. Restart backend pod: `kubectl delete pod -n todo-app -l app=backend`
3. Wait for new pod to start
4. Open chat again
5. Verify conversation history is preserved

---

## Troubleshooting

### Issue: ImagePullBackOff

**Symptoms:**
```bash
kubectl get pods -n todo-app
NAME                                  READY   STATUS             RESTARTS   AGE
backend-deployment-7d9f8b5c6d-x7k2m   0/1     ImagePullBackOff   0          2m
```

**Diagnosis:**
```bash
kubectl describe pod -n todo-app -l app=backend | grep -A 10 Events
```

**Solution:**
```bash
# Images not loaded into Minikube
minikube image load todo-backend:latest
minikube image load todo-frontend:latest

# Restart deployment
kubectl rollout restart deployment/backend-deployment -n todo-app
```

---

### Issue: CrashLoopBackOff

**Symptoms:**
```bash
kubectl get pods -n todo-app
NAME                                  READY   STATUS             RESTARTS   AGE
backend-deployment-7d9f8b5c6d-x7k2m   0/1     CrashLoopBackOff   5          5m
```

**Diagnosis:**
```bash
# Check current logs
kubectl logs -n todo-app -l app=backend --tail=50

# Check previous container logs
kubectl logs -n todo-app -l app=backend --previous
```

**Common Causes:**

1. **Missing Secrets:**
   ```bash
   # Verify secret exists
   kubectl get secret app-secrets -n todo-app

   # If missing, create it (see Step 6)
   ```

2. **Invalid Database URL:**
   ```bash
   # Check secret value
   kubectl get secret app-secrets -n todo-app -o jsonpath='{.data.DATABASE_URL}' | base64 -d

   # Update if incorrect
   kubectl delete secret app-secrets -n todo-app
   kubectl create secret generic app-secrets --from-literal=DATABASE_URL='correct-url' ...
   ```

3. **Application Error:**
   - Check logs for Python/Node.js errors
   - Verify backend/frontend code is correct

---

### Issue: Pending Pods

**Symptoms:**
```bash
kubectl get pods -n todo-app
NAME                                  READY   STATUS    RESTARTS   AGE
backend-deployment-7d9f8b5c6d-x7k2m   0/1     Pending   0          5m
```

**Diagnosis:**
```bash
kubectl describe pod -n todo-app -l app=backend | grep -A 10 Events
```

**Common Causes:**

1. **Insufficient Resources:**
   ```bash
   # Check node resources
   kubectl top nodes

   # Solution: Increase Minikube resources
   minikube stop
   minikube start --cpus=4 --memory=8192
   ```

2. **Scheduling Constraints:**
   - Check for node selectors or taints
   - Verify resource requests are reasonable

---

### Issue: Service Not Accessible

**Symptoms:**
- Cannot access http://localhost:3000
- Connection refused errors

**Diagnosis:**
```bash
# Check pods are running
kubectl get pods -n todo-app

# Check services
kubectl get svc -n todo-app

# Check endpoints
kubectl get endpoints -n todo-app
```

**Solutions:**

1. **Port Forward Not Running:**
   ```bash
   # Restart port forward
   kubectl port-forward -n todo-app service/frontend-service 3000:3000
   ```

2. **Pods Not Ready:**
   ```bash
   # Wait for pods to be ready
   kubectl wait --for=condition=ready pod -l app=frontend -n todo-app --timeout=120s
   ```

3. **Service Misconfigured:**
   ```bash
   # Check service selector matches pod labels
   kubectl get svc frontend-service -n todo-app -o yaml
   kubectl get pods -n todo-app --show-labels
   ```

---

### Issue: Ingress Not Working

**Symptoms:**
- Cannot access http://todo-app.local
- 404 or connection errors

**Diagnosis:**
```bash
# Check ingress status
kubectl get ingress -n todo-app

# Check ingress controller
kubectl get pods -n ingress-nginx
```

**Solutions:**

1. **Ingress Addon Not Enabled:**
   ```bash
   minikube addons enable ingress
   ```

2. **/etc/hosts Not Updated:**
   ```bash
   # Add entry
   echo "$(minikube ip) todo-app.local" | sudo tee -a /etc/hosts
   ```

3. **Ingress Controller Not Ready:**
   ```bash
   # Wait for ingress controller
   kubectl wait --namespace ingress-nginx \
     --for=condition=ready pod \
     --selector=app.kubernetes.io/component=controller \
     --timeout=120s
   ```

---

## Cleanup

### Uninstall Application

```bash
# Uninstall Helm release
helm uninstall todo-app -n todo-app

# Delete namespace (removes all resources)
kubectl delete namespace todo-app
```

### Stop Minikube

```bash
# Stop cluster (preserves state)
minikube stop

# Delete cluster (removes all data)
minikube delete
```

### Remove Images

```bash
# Remove Docker images
docker rmi todo-backend:latest
docker rmi todo-frontend:latest
```

---

## Next Steps

After successful deployment:

1. **Explore AI Tools**: Try kubectl-ai and kagent for natural language operations
   - See [AI Tools Usage Guide](ai-tools-usage.md)

2. **Review Architecture**: Understand the deployment architecture
   - See [Architecture Diagram](architecture-diagram.md)

3. **Customize Deployment**: Modify Helm values for your needs
   - Edit `helm/todo-app/values.yaml`
   - Upgrade: `helm upgrade todo-app helm/todo-app -n todo-app`

4. **Monitor Performance**: Track resource usage and optimize
   - Use `kubectl top pods -n todo-app`
   - Adjust resource requests/limits in values.yaml

5. **Prepare for Production**: Consider Phase V enhancements
   - Cloud deployment (DigitalOcean Kubernetes)
   - Event-driven architecture (Kafka, Dapr)
   - Advanced monitoring (Prometheus, Grafana)

---

## Support

For issues or questions:

1. Check [Troubleshooting Guide](helm/todo-app/README.md#troubleshooting)
2. Review [Deployment Troubleshooter Skill](.claude/skills/troubleshoot-k8s-deployment.md)
3. Check Minikube logs: `minikube logs`
4. Check Kubernetes events: `kubectl get events -n todo-app`

## Version

1.0.0

## Last Updated

2026-02-19
