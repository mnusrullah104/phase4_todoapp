# Skill: Generate Helm Chart

## Purpose

Generate complete Kubernetes Helm chart templates for deploying applications with proper resource management, health checks, security configurations, and best practices.

## Inputs

- **app_components**: List of application components
  - Component name (e.g., backend, frontend, database)
  - Container image details
  - Port numbers
  - Service type (ClusterIP, NodePort, LoadBalancer)
- **resource_requirements**: Resource requests and limits
  - CPU requests/limits
  - Memory requests/limits
- **probe_configurations**: Health check settings
  - Liveness probe path and settings
  - Readiness probe path and settings
- **secrets**: Required secrets and their keys
- **ingress_config**: Ingress configuration (optional)
  - Host name
  - TLS settings

## Outputs

- **Complete Helm chart** with:
  - Chart.yaml (metadata)
  - values.yaml (configuration)
  - templates/_helpers.tpl (template functions)
  - templates/deployment-*.yaml (one per component)
  - templates/service-*.yaml (one per component)
  - templates/secret.yaml (secret documentation)
  - templates/ingress.yaml (if ingress enabled)
  - templates/serviceaccount.yaml (RBAC)
  - templates/role.yaml (RBAC)
  - templates/rolebinding.yaml (RBAC)
  - templates/NOTES.txt (post-install instructions)

## Usage Examples

### Example 1: Microservices Application (Backend + Frontend)

**Input:**
```yaml
app_components:
  - name: backend
    image:
      repository: myapp-backend
      tag: latest
    port: 8000
    service_type: ClusterIP
    health_checks:
      liveness: /health
      readiness: /ready
  - name: frontend
    image:
      repository: myapp-frontend
      tag: latest
    port: 3000
    service_type: NodePort
    health_checks:
      liveness: /
      readiness: /

resource_requirements:
  backend:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi
  frontend:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi

secrets:
  - name: app-secrets
    keys:
      - API_KEY
      - DATABASE_URL
      - JWT_SECRET

ingress_config:
  enabled: true
  host: myapp.local
  className: nginx
```

**Output Structure:**
```
helm/myapp/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── _helpers.tpl
│   ├── namespace.yaml
│   ├── serviceaccount.yaml
│   ├── role.yaml
│   ├── rolebinding.yaml
│   ├── secret.yaml
│   ├── deployment-backend.yaml
│   ├── deployment-frontend.yaml
│   ├── service-backend.yaml
│   ├── service-frontend.yaml
│   ├── ingress.yaml
│   └── NOTES.txt
└── .helmignore
```

### Example 2: Single Component Application

**Input:**
```yaml
app_components:
  - name: api
    image:
      repository: myapi
      tag: v1.0.0
    port: 8080
    service_type: LoadBalancer
    health_checks:
      liveness: /healthz
      readiness: /ready

resource_requirements:
  api:
    requests:
      cpu: 200m
      memory: 256Mi
    limits:
      cpu: 1000m
      memory: 1Gi

secrets:
  - name: api-secrets
    keys:
      - DB_PASSWORD
      - API_TOKEN

ingress_config:
  enabled: false
```

**Generated values.yaml:**
```yaml
global:
  namespace: myapp
  imagePullPolicy: IfNotPresent

api:
  image:
    repository: myapi
    tag: v1.0.0
    pullPolicy: IfNotPresent
  replicas: 1
  resources:
    requests:
      cpu: 200m
      memory: 256Mi
    limits:
      cpu: 1000m
      memory: 1Gi
  probes:
    liveness:
      path: /healthz
      port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
    readiness:
      path: /ready
      port: 8080
      initialDelaySeconds: 10
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 3
  service:
    type: LoadBalancer
    port: 8080
    targetPort: 8080

secrets:
  name: api-secrets
  keys:
    dbPassword: DB_PASSWORD
    apiToken: API_TOKEN
```

## Best Practices Applied

1. **Parameterization**: All configuration values in values.yaml for easy customization
2. **Template helpers**: Reusable template functions for labels and names
3. **Resource management**: Proper CPU and memory requests/limits
4. **Health checks**: Both liveness and readiness probes configured
5. **Security**: RBAC with minimal permissions, non-root containers
6. **Observability**: Structured labels for monitoring and logging
7. **Documentation**: Clear NOTES.txt with deployment instructions
8. **Validation**: Helm lint-compatible templates

## Testing

To test the generated Helm chart:

```bash
# Validate chart structure
helm lint helm/myapp

# Dry-run to preview resources
helm install myapp helm/myapp --dry-run --debug

# Template rendering test
helm template myapp helm/myapp | kubectl apply --dry-run=client -f -

# Install to cluster
helm install myapp helm/myapp -n myapp-namespace

# Verify deployment
kubectl get all -n myapp-namespace
```

## Validation Checklist

- [ ] Chart.yaml has correct metadata
- [ ] values.yaml has sensible defaults
- [ ] All templates render without errors
- [ ] Helm lint passes without warnings
- [ ] Resource requests/limits defined
- [ ] Health probes configured
- [ ] RBAC resources included
- [ ] Secret documentation provided
- [ ] NOTES.txt has clear instructions
- [ ] Labels follow Kubernetes conventions

## Template Patterns

### Deployment Template Pattern
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "app.fullname" . }}-{{ .component }}
  labels:
    {{- include "app.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.component.replicas }}
  selector:
    matchLabels:
      {{- include "app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "app.selectorLabels" . | nindent 8 }}
    spec:
      serviceAccountName: {{ include "app.serviceAccountName" . }}
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
      - name: {{ .component }}
        image: "{{ .Values.component.image.repository }}:{{ .Values.component.image.tag }}"
        ports:
        - containerPort: {{ .Values.component.port }}
        livenessProbe:
          httpGet:
            path: {{ .Values.component.probes.liveness.path }}
            port: {{ .Values.component.port }}
        readinessProbe:
          httpGet:
            path: {{ .Values.component.probes.readiness.path }}
            port: {{ .Values.component.port }}
        resources:
          {{- toYaml .Values.component.resources | nindent 10 }}
```

## Related Skills

- `generate-dockerfile`: Generate Dockerfiles for containerizing applications
- `troubleshoot-k8s-deployment`: Diagnose issues with Helm deployments

## Version

1.0.0

## Last Updated

2026-02-19
