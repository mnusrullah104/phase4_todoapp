# AI-Assisted Kubernetes Operations

This guide demonstrates how to use AI-powered tools (kubectl-ai and kagent) for managing Kubernetes deployments with natural language commands.

## Overview

Phase IV leverages AI-native DevOps tools to simplify Kubernetes operations:

- **kubectl-ai**: Natural language interface for kubectl commands
- **kagent**: Agentic cluster management and troubleshooting

## Prerequisites

### Install kubectl-ai

```bash
# Install kubectl-ai (choose your platform)

# macOS (Homebrew)
brew install kubectl-ai

# Linux (Binary)
curl -LO https://github.com/sozercan/kubectl-ai/releases/latest/download/kubectl-ai-linux-amd64
chmod +x kubectl-ai-linux-amd64
sudo mv kubectl-ai-linux-amd64 /usr/local/bin/kubectl-ai

# Windows (Scoop)
scoop install kubectl-ai

# Verify installation
kubectl ai --version
```

### Install kagent

```bash
# Install kagent (choose your platform)

# macOS/Linux
curl -LO https://github.com/kubefirst/kagent/releases/latest/download/kagent
chmod +x kagent
sudo mv kagent /usr/local/bin/

# Verify installation
kagent --version
```

### Configure API Keys

Both tools require OpenAI API access:

```bash
# Set OpenAI API key
export OPENAI_API_KEY='your-openai-api-key'

# Or add to your shell profile
echo 'export OPENAI_API_KEY="your-openai-api-key"' >> ~/.bashrc
source ~/.bashrc
```

## kubectl-ai Usage Examples

### Workflow 1: Check Pod Status

**Natural Language Command:**
```bash
kubectl ai "show me all pods in todo-app namespace"
```

**Generated kubectl Command:**
```bash
kubectl get pods -n todo-app
```

**Output:**
```
NAME                                  READY   STATUS    RESTARTS   AGE
backend-deployment-7d9f8b5c6d-x7k2m   1/1     Running   0          5m
frontend-deployment-6c8d9f4b5-p9n3l   1/1     Running   0          5m
```

### Workflow 2: View Logs

**Natural Language Command:**
```bash
kubectl ai "get logs from backend pod in todo-app namespace"
```

**Generated kubectl Command:**
```bash
kubectl logs -l app=backend -n todo-app --tail=50
```

**Output:**
```
INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Workflow 3: Troubleshoot Failed Pods

**Natural Language Command:**
```bash
kubectl ai "describe the backend pod that is failing in todo-app"
```

**Generated kubectl Command:**
```bash
kubectl describe pod -l app=backend -n todo-app | grep -A 10 Events
```

**Output:**
```
Events:
  Type     Reason     Age   From               Message
  ----     ------     ----  ----               -------
  Normal   Scheduled  2m    default-scheduler  Successfully assigned todo-app/backend-deployment-xxx to minikube
  Normal   Pulling    2m    kubelet            Pulling image "todo-backend:latest"
  Normal   Pulled     1m    kubelet            Successfully pulled image
  Normal   Created    1m    kubelet            Created container backend
  Normal   Started    1m    kubelet            Started container backend
```

### Workflow 4: Check Resource Usage

**Natural Language Command:**
```bash
kubectl ai "show me resource usage for all pods in todo-app"
```

**Generated kubectl Command:**
```bash
kubectl top pods -n todo-app
```

**Output:**
```
NAME                                  CPU(cores)   MEMORY(bytes)
backend-deployment-7d9f8b5c6d-x7k2m   45m          156Mi
frontend-deployment-6c8d9f4b5-p9n3l   32m          128Mi
```

### Workflow 5: Restart Deployment

**Natural Language Command:**
```bash
kubectl ai "restart the backend deployment in todo-app namespace"
```

**Generated kubectl Command:**
```bash
kubectl rollout restart deployment/backend-deployment -n todo-app
```

**Output:**
```
deployment.apps/backend-deployment restarted
```

## kagent Usage Examples

### Workflow 1: Deployment Health Analysis

**Command:**
```bash
kagent analyze deployment backend-deployment -n todo-app
```

**Output:**
```
🔍 Analyzing deployment: backend-deployment

✅ Deployment Status: Healthy
   - Desired replicas: 1
   - Current replicas: 1
   - Ready replicas: 1
   - Up-to-date replicas: 1

✅ Pod Health: All pods running
   - backend-deployment-7d9f8b5c6d-x7k2m: Running (Ready)

✅ Resource Utilization:
   - CPU: 45m / 500m (9% of limit)
   - Memory: 156Mi / 512Mi (30% of limit)

✅ Probes: Configured correctly
   - Liveness probe: /health (passing)
   - Readiness probe: /ready (passing)

⚠️  Recommendations:
   - Consider reducing memory limit to 256Mi (currently using 156Mi)
   - CPU usage is low, could reduce limit to 250m
```

### Workflow 2: Resource Optimization

**Command:**
```bash
kagent optimize resources -n todo-app
```

**Output:**
```
🔧 Resource Optimization Analysis

Current Resource Allocation:
┌────────────┬──────────┬──────────┬──────────┬──────────┐
│ Deployment │ CPU Req  │ CPU Lim  │ Mem Req  │ Mem Lim  │
├────────────┼──────────┼──────────┼──────────┼──────────┤
│ backend    │ 100m     │ 500m     │ 128Mi    │ 512Mi    │
│ frontend   │ 100m     │ 500m     │ 128Mi    │ 512Mi    │
└────────────┴──────────┴──────────┴──────────┴──────────┘

Actual Usage (Last 24h):
┌────────────┬──────────┬──────────┐
│ Deployment │ CPU Avg  │ Mem Avg  │
├────────────┼──────────┼──────────┤
│ backend    │ 45m      │ 156Mi    │
│ frontend   │ 32m      │ 128Mi    │
└────────────┴──────────┴──────────┘

💡 Recommendations:
1. Backend: Reduce memory limit to 256Mi (save 256Mi)
2. Frontend: Memory usage is optimal
3. Both: CPU limits can be reduced to 250m (save 500m total)

Estimated Savings: 756Mi memory, 500m CPU
```

### Workflow 3: Troubleshooting Assistant

**Command:**
```bash
kagent troubleshoot pod backend-deployment-7d9f8b5c6d-x7k2m -n todo-app
```

**Output:**
```
🔍 Troubleshooting Pod: backend-deployment-7d9f8b5c6d-x7k2m

Pod Status: Running ✅
Container Status: Ready ✅
Restart Count: 0 ✅

Recent Events:
  ✅ Successfully pulled image "todo-backend:latest"
  ✅ Created container backend
  ✅ Started container backend

Health Checks:
  ✅ Liveness probe: Passing (last check: 10s ago)
  ✅ Readiness probe: Passing (last check: 5s ago)

Resource Usage:
  ✅ CPU: 45m / 500m (within limits)
  ✅ Memory: 156Mi / 512Mi (within limits)

Network:
  ✅ Service endpoints: backend-service (8000/TCP)
  ✅ DNS resolution: Working

Logs (Last 10 lines):
  INFO:     Started server process [1]
  INFO:     Application startup complete.
  INFO:     Uvicorn running on http://0.0.0.0:8000

✅ No issues detected. Pod is healthy.
```

## Practical Workflows

### Complete Deployment Workflow

```bash
# 1. Check cluster status
kubectl ai "show me all nodes and their status"

# 2. Deploy application
helm install todo-app helm/todo-app -n todo-app

# 3. Monitor deployment progress
kubectl ai "watch pods in todo-app namespace until they are running"

# 4. Verify health
kagent analyze deployment backend-deployment -n todo-app
kagent analyze deployment frontend-deployment -n todo-app

# 5. Check resource usage
kubectl ai "show resource usage for todo-app namespace"

# 6. Test application
kubectl ai "port forward frontend service to local port 3000"
```

### Troubleshooting Workflow

```bash
# 1. Identify failing pods
kubectl ai "show me all pods that are not running in todo-app"

# 2. Get detailed diagnostics
kagent troubleshoot pod <pod-name> -n todo-app

# 3. Check logs
kubectl ai "show me the last 100 lines of logs from the failing pod"

# 4. Check events
kubectl ai "show me recent events in todo-app namespace sorted by time"

# 5. Describe resources
kubectl ai "describe the deployment that owns the failing pod"
```

### Performance Monitoring Workflow

```bash
# 1. Check current resource usage
kubectl ai "show me CPU and memory usage for all pods in todo-app"

# 2. Get optimization recommendations
kagent optimize resources -n todo-app

# 3. Monitor over time
kubectl ai "watch resource usage for todo-app pods"

# 4. Check for resource constraints
kubectl ai "show me any pods that have been evicted or OOMKilled"
```

## Tips and Best Practices

### kubectl-ai Tips

1. **Be specific with namespaces**: Always include the namespace in your query
   ```bash
   kubectl ai "show pods in todo-app namespace"  # Good
   kubectl ai "show pods"  # May show wrong namespace
   ```

2. **Use natural language**: Don't try to mimic kubectl syntax
   ```bash
   kubectl ai "what pods are using the most memory"  # Good
   kubectl ai "get pods sort by memory"  # Less natural
   ```

3. **Verify commands**: Review the generated kubectl command before executing
   ```bash
   kubectl ai "delete all pods in todo-app" --dry-run  # Check first!
   ```

### kagent Tips

1. **Regular health checks**: Run analysis after deployments
   ```bash
   kagent analyze deployment <name> -n <namespace>
   ```

2. **Use optimization suggestions**: Apply recommendations to reduce costs
   ```bash
   kagent optimize resources -n todo-app --apply
   ```

3. **Combine with kubectl**: Use both tools together
   ```bash
   kagent troubleshoot pod <name> -n <namespace>
   kubectl ai "show logs from that pod"
   ```

## Integration with CI/CD

### Pre-deployment Validation

```bash
#!/bin/bash
# validate-deployment.sh

# Check cluster health
kagent analyze cluster

# Validate resource availability
kubectl ai "show available resources on all nodes"

# Check for existing issues
kagent troubleshoot namespace todo-app
```

### Post-deployment Verification

```bash
#!/bin/bash
# verify-deployment.sh

# Wait for pods to be ready
kubectl ai "wait for all pods in todo-app to be ready"

# Verify health
kagent analyze deployment backend-deployment -n todo-app
kagent analyze deployment frontend-deployment -n todo-app

# Check resource usage
kubectl ai "show resource usage for todo-app"
```

## Troubleshooting AI Tools

### kubectl-ai Not Working

**Issue**: Command fails or generates incorrect kubectl commands

**Solutions**:
1. Verify OpenAI API key is set:
   ```bash
   echo $OPENAI_API_KEY
   ```

2. Check kubectl-ai version:
   ```bash
   kubectl ai --version
   ```

3. Test with simple command:
   ```bash
   kubectl ai "show all namespaces"
   ```

### kagent Connection Issues

**Issue**: Cannot connect to cluster

**Solutions**:
1. Verify kubectl context:
   ```bash
   kubectl config current-context
   ```

2. Test cluster connectivity:
   ```bash
   kubectl cluster-info
   ```

3. Check kagent configuration:
   ```bash
   kagent config show
   ```

## Additional Resources

- kubectl-ai GitHub: https://github.com/sozercan/kubectl-ai
- kagent GitHub: https://github.com/kubefirst/kagent
- Kubernetes Documentation: https://kubernetes.io/docs/
- OpenAI API: https://platform.openai.com/docs/

## Version

1.0.0

## Last Updated

2026-02-19
