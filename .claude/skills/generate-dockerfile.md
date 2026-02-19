# Skill: Generate Optimized Dockerfile

## Purpose

Generate optimized, multi-stage Dockerfiles for containerizing applications with security best practices, minimal image size, and efficient layer caching.

## Inputs

- **language**: Programming language/runtime (python, node, go, java, rust, etc.)
- **base_image**: Preferred base image (e.g., python:3.11-slim, node:18-alpine)
- **app_structure**: Application structure details
  - Entry point file (e.g., main.py, server.js)
  - Dependencies file (e.g., requirements.txt, package.json)
  - Build command (if applicable)
  - Runtime command
- **port**: Application port number
- **health_check_path**: Health check endpoint path (optional)

## Outputs

- **Dockerfile**: Multi-stage Dockerfile with:
  - Builder stage for dependencies
  - Runtime stage with minimal footprint
  - Non-root user configuration
  - Health check instruction
  - Optimized layer caching
  - Security best practices

## Usage Examples

### Example 1: Python FastAPI Application

**Input:**
```yaml
language: python
base_image: python:3.11-slim
app_structure:
  entry_point: main.py
  dependencies: requirements.txt
  runtime_command: uvicorn main:app --host 0.0.0.0 --port 8000
port: 8000
health_check_path: /health
```

**Output:**
```dockerfile
# Multi-stage build for Python FastAPI application
FROM python:3.11-slim as builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
RUN adduser --disabled-password --gecos '' appuser
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
RUN chown -R appuser:appuser /app
USER appuser
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Example 2: Node.js Next.js Application

**Input:**
```yaml
language: node
base_image: node:18-alpine
app_structure:
  entry_point: server.js
  dependencies: package.json
  build_command: npm run build
  runtime_command: node server.js
port: 3000
```

**Output:**
```dockerfile
# Multi-stage build for Next.js application
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

## Best Practices Applied

1. **Multi-stage builds**: Separate builder and runtime stages to minimize final image size
2. **Layer caching**: Copy dependency files before application code for better cache utilization
3. **Non-root user**: Run application as non-root user for security
4. **Minimal base images**: Use slim/alpine variants to reduce image size
5. **Health checks**: Include HEALTHCHECK instruction for container orchestration
6. **Security**: Remove build tools from runtime image, use --no-cache-dir for pip
7. **Optimization**: Clean up package manager caches, remove unnecessary files

## Testing

To test the generated Dockerfile:

```bash
# Build the image
docker build -t test-app:latest -f Dockerfile .

# Check image size
docker images test-app:latest

# Run container
docker run -p 8000:8000 test-app:latest

# Test health check
docker inspect --format='{{json .State.Health}}' <container-id>
```

## Validation Checklist

- [ ] Multi-stage build implemented
- [ ] Non-root user configured
- [ ] Health check included (if applicable)
- [ ] Dependencies copied before application code
- [ ] Build tools removed from runtime image
- [ ] Image size optimized (<500MB for typical applications)
- [ ] Security best practices followed

## Related Skills

- `generate-helm-chart`: Generate Kubernetes manifests for the containerized application
- `troubleshoot-k8s-deployment`: Diagnose issues with deployed containers

## Version

1.0.0

## Last Updated

2026-02-19
