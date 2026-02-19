# Skill: Troubleshoot Kubernetes Deployment

## Purpose

Diagnose and fix common Kubernetes deployment issues by analyzing pod status, logs, events, and resource configurations. Provides actionable recommendations and kubectl commands for resolution.

## Inputs

- **namespace**: Kubernetes namespace where the deployment exists
- **deployment_name**: Name of the deployment to troubleshoot (optional if using pod name)
- **pod_name**: Specific pod name to troubleshoot (optional)
- **error_symptoms**: Description of observed issues
  - Pods not starting
  - CrashLoopBackOff
  - ImagePullBackOff
  - Pending state
  - Connection errors
  - Performance issues

## Outputs

- **Diagnosis report**: Detailed analysis of the issue
- **Root cause**: Identified root cause of the problem
- **Recommended fixes**: Step-by-step resolution instructions
- **kubectl commands**: Exact commands to execute for diagnosis and fixes
- **Prevention tips**: How to avoid the issue in the future

## Usage Examples

### Example 1: ImagePullBackOff Error

**Input:**
```yaml
namespace: todo-app
deployment_name: backend-deployment
error_symptoms: Pods stuck in ImagePullBackOff state
```

**Diagnosis Process:**
```bash
# Step 1: Check pod status
kubectl get pods -n todo-app -l app=backend

# Step 2: Describe pod for detailed error
kubectl describe pod <pod-name> -n todo-app

# Step 3: Check events
kubectl get events -n todo-app --sort-by='.lastTimestamp' | grep -i error
```

**Output:**
```
DIAGNOSIS REPORT
================

Issue: ImagePullBackOff
Severity: HIGH
Component: backend-deployment

ROOT CAUSE:
Container image 'todo-backend:latest' not found in Minikube's local image cache.
The image was not loaded into Minikube after building.

SYMPTOMS OBSERVED:
- Pod status: ImagePullBackOff
- Event message: "Failed to pull image 'todo-backend:latest': rpc error: code = Unknown desc = Error response from daemon: pull access denied"
- Container not starting

RECOMMENDED FIXES:

1. Load the image into Minikube:
   ```bash
   docker build -t todo-backend:latest -f docker/backend/Dockerfile backend/
   minikube image load todo-backend:latest
   ```

2. Verify image is loaded:
   ```bash
   minikube image ls | grep todo-backend
   ```

3. Restart the deployment:
   ```bash
   kubectl rollout restart deployment/backend-deployment -n todo-app
   ```

4. Monitor pod startup:
   ```bash
   kubectl get pods -n todo-app -w
   ```

PREVENTION TIPS:
- Always load images into Minikube after building: `minikube image load <image-name>`
- Use imagePullPolicy: IfNotPresent in deployment to avoid unnecessary pulls
- Consider using a local registry for team development
- Add image loading to deployment scripts

VERIFICATION:
After applying fixes, verify:
- Pod status shows "Running"
- Container is ready (1/1)
- No error events in the last 5 minutes
```

### Example 2: CrashLoopBackOff Error

**Input:**
```yaml
namespace: todo-app
pod_name: backend-deployment-abc123-xyz
error_symptoms: Pod keeps restarting, CrashLoopBackOff
```

**Diagnosis Process:**
```bash
# Step 1: Check pod status and restart count
kubectl get pod backend-deployment-abc123-xyz -n todo-app

# Step 2: Check current logs
kubectl logs backend-deployment-abc123-xyz -n todo-app

# Step 3: Check previous container logs
kubectl logs backend-deployment-abc123-xyz -n todo-app --previous

# Step 4: Describe pod for exit codes
kubectl describe pod backend-deployment-abc123-xyz -n todo-app
```

**Output:**
```
DIAGNOSIS REPORT
================

Issue: CrashLoopBackOff
Severity: CRITICAL
Component: backend-deployment

ROOT CAUSE:
Application failing to start due to missing DATABASE_URL environment variable.
Secret 'app-secrets' not found in namespace.

SYMPTOMS OBSERVED:
- Pod status: CrashLoopBackOff
- Restart count: 5
- Exit code: 1
- Log error: "KeyError: 'DATABASE_URL'"
- Container starts but exits immediately

RECOMMENDED FIXES:

1. Check if secret exists:
   ```bash
   kubectl get secret app-secrets -n todo-app
   ```

2. If secret doesn't exist, create it:
   ```bash
   kubectl create secret generic app-secrets \
     --from-literal=COHERE_API_KEY='your-key' \
     --from-literal=DATABASE_URL='your-db-url' \
     --from-literal=JWT_SECRET='your-secret' \
     --namespace=todo-app
   ```

3. Verify secret has correct keys:
   ```bash
   kubectl get secret app-secrets -n todo-app -o jsonpath='{.data}' | jq 'keys'
   ```

4. If secret exists but has wrong keys, delete and recreate:
   ```bash
   kubectl delete secret app-secrets -n todo-app
   # Then create with correct keys
   ```

5. Restart deployment:
   ```bash
   kubectl rollout restart deployment/backend-deployment -n todo-app
   ```

PREVENTION TIPS:
- Create secrets before deploying applications
- Use Helm pre-install hooks to validate secrets exist
- Add secret validation to CI/CD pipeline
- Document required secrets in README
- Use secret templates in Helm charts

VERIFICATION:
After applying fixes, verify:
- Pod status shows "Running"
- Restart count stops increasing
- Application logs show successful startup
- Health check endpoints respond
```

### Example 3: Pod Scheduling Failure (Pending)

**Input:**
```yaml
namespace: todo-app
deployment_name: frontend-deployment
error_symptoms: Pods stuck in Pending state, not scheduling
```

**Diagnosis Process:**
```bash
# Step 1: Check pod status
kubectl get pods -n todo-app -l app=frontend

# Step 2: Describe pod for scheduling events
kubectl describe pod <pod-name> -n todo-app | grep -A 10 Events

# Step 3: Check node resources
kubectl top nodes

# Step 4: Check resource requests
kubectl get deployment frontend-deployment -n todo-app -o yaml | grep -A 5 resources
```

**Output:**
```
DIAGNOSIS REPORT
================

Issue: Pod Scheduling Failure
Severity: HIGH
Component: frontend-deployment

ROOT CAUSE:
Insufficient CPU resources on Minikube node.
Pod requests 500m CPU but only 200m available.

SYMPTOMS OBSERVED:
- Pod status: Pending
- Event: "0/1 nodes are available: 1 Insufficient cpu"
- No container created
- Scheduler unable to place pod

RECOMMENDED FIXES:

1. Check current resource usage:
   ```bash
   kubectl top nodes
   kubectl top pods -n todo-app
   ```

2. Option A - Increase Minikube resources (Recommended):
   ```bash
   minikube stop
   minikube start --cpus=4 --memory=8192
   ```

3. Option B - Reduce pod resource requests:
   Edit values.yaml:
   ```yaml
   frontend:
     resources:
       requests:
         cpu: 100m  # Reduced from 500m
         memory: 128Mi
   ```

   Then upgrade:
   ```bash
   helm upgrade todo-app helm/todo-app -n todo-app
   ```

4. Option C - Scale down other deployments:
   ```bash
   kubectl scale deployment backend-deployment --replicas=0 -n todo-app
   # Wait for resources to free up
   kubectl scale deployment backend-deployment --replicas=1 -n todo-app
   ```

PREVENTION TIPS:
- Start Minikube with sufficient resources (4 CPU, 8GB RAM minimum)
- Set conservative resource requests for local development
- Use resource quotas to prevent over-allocation
- Monitor resource usage regularly
- Consider using resource limits without requests for non-critical workloads

VERIFICATION:
After applying fixes, verify:
- Pod transitions from Pending to Running
- All containers start successfully
- kubectl top shows healthy resource usage
```

## Troubleshooting Workflows

### Workflow 1: General Pod Issues

```bash
# 1. Check pod status
kubectl get pods -n <namespace>

# 2. Describe pod for details
kubectl describe pod <pod-name> -n <namespace>

# 3. Check logs
kubectl logs <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace> --previous  # Previous container

# 4. Check events
kubectl get events -n <namespace> --sort-by='.lastTimestamp'

# 5. Check resource usage
kubectl top pod <pod-name> -n <namespace>
```

### Workflow 2: Service Connectivity Issues

```bash
# 1. Check service exists
kubectl get svc -n <namespace>

# 2. Check service endpoints
kubectl get endpoints <service-name> -n <namespace>

# 3. Test service from within cluster
kubectl run test-pod --rm -it --image=busybox -n <namespace> -- wget -O- http://<service-name>:<port>

# 4. Check network policies
kubectl get networkpolicies -n <namespace>

# 5. Check DNS resolution
kubectl run test-pod --rm -it --image=busybox -n <namespace> -- nslookup <service-name>
```

### Workflow 3: Configuration Issues

```bash
# 1. Check configmaps
kubectl get configmap -n <namespace>
kubectl describe configmap <name> -n <namespace>

# 2. Check secrets
kubectl get secret -n <namespace>
kubectl get secret <name> -n <namespace> -o jsonpath='{.data}' | jq 'keys'

# 3. Verify environment variables in pod
kubectl exec <pod-name> -n <namespace> -- env | grep <VAR_NAME>

# 4. Check mounted volumes
kubectl describe pod <pod-name> -n <namespace> | grep -A 10 Volumes
```

## Common Issues Reference

| Issue | Symptoms | Common Causes | Quick Fix |
|-------|----------|---------------|-----------|
| ImagePullBackOff | Pod not starting | Image not in registry/Minikube | `minikube image load <image>` |
| CrashLoopBackOff | Pod restarting | App crash, missing config | Check logs: `kubectl logs <pod> --previous` |
| Pending | Pod not scheduled | Resource constraints | Increase Minikube resources or reduce requests |
| Error | Pod failed | Init container failed | Check init container logs |
| OOMKilled | Pod killed | Memory limit exceeded | Increase memory limits |
| Evicted | Pod removed | Node pressure | Check node resources |
| CreateContainerConfigError | Container not created | Missing secret/configmap | Verify secrets exist |
| InvalidImageName | Pod not starting | Malformed image name | Fix image name in deployment |

## Related Skills

- `generate-dockerfile`: Create optimized Dockerfiles to prevent build issues
- `generate-helm-chart`: Generate proper Helm charts with correct configurations

## Version

1.0.0

## Last Updated

2026-02-19
