# Phase IV - Demo Script (<90 Seconds)

## Video Structure

**Total Duration**: 85 seconds
**Format**: Screen recording with voiceover or text overlays
**Objective**: Demonstrate Kubernetes deployment and AI chatbot functionality

---

## Scene 1: Introduction (5 seconds)

**Visual**: Title slide or terminal with project name

**Voiceover/Text**:
> "Phase IV: Kubernetes Deployment of Todo AI Chatbot"

**On Screen**:
```
Phase IV - Kubernetes Deployment
Todo AI Chatbot Application
Local Minikube Cluster
```

---

## Scene 2: Cluster Status (10 seconds)

**Visual**: Terminal showing Minikube and kubectl commands

**Commands**:
```bash
# Show Minikube is running
minikube status

# Show cluster info
kubectl cluster-info

# Show namespace
kubectl get namespaces | grep todo-app
```

**Expected Output**:
```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running

Kubernetes control plane is running at https://127.0.0.1:xxxxx

todo-app   Active   5m
```

**Voiceover/Text**:
> "Minikube cluster running with todo-app namespace"

---

## Scene 3: Deployment Status (15 seconds)

**Visual**: Terminal showing pod and service status

**Commands**:
```bash
# Show all pods running
kubectl get pods -n todo-app

# Show services
kubectl get svc -n todo-app

# Show ingress
kubectl get ingress -n todo-app
```

**Expected Output**:
```
NAME                                  READY   STATUS    RESTARTS   AGE
backend-deployment-7d9f8b5c6d-x7k2m   1/1     Running   0          3m
frontend-deployment-6c8d9f4b5-p9n3l   1/1     Running   0          3m

NAME               TYPE        CLUSTER-IP      PORT(S)          AGE
backend-service    ClusterIP   10.96.100.50    8000/TCP         3m
frontend-service   NodePort    10.96.200.100   3000:30080/TCP   3m

NAME            CLASS   HOSTS             ADDRESS        PORTS   AGE
todo-ingress    nginx   todo-app.local    192.168.49.2   80      3m
```

**Voiceover/Text**:
> "All pods running, services exposed, ingress configured"

---

## Scene 4: Application Access (10 seconds)

**Visual**: Terminal showing port-forward command, then browser opening

**Commands**:
```bash
# Start port forwarding
kubectl port-forward -n todo-app service/frontend-service 3000:3000
```

**Expected Output**:
```
Forwarding from 127.0.0.1:3000 -> 3000
Forwarding from [::1]:3000 -> 3000
```

**Visual Transition**: Browser opens to http://localhost:3000

**Voiceover/Text**:
> "Accessing application via port-forward"

---

## Scene 5: User Login (8 seconds)

**Visual**: Browser showing login page and dashboard

**Actions**:
1. Show login page with email/password fields
2. Click "Sign In" button
3. Dashboard loads with task list

**Voiceover/Text**:
> "User authentication with JWT tokens"

---

## Scene 6: AI Chatbot - Task Creation (15 seconds)

**Visual**: Browser showing chat interface

**Actions**:
1. Click chat icon in bottom-right corner
2. Chat widget opens
3. Type: "Add task: Deploy Phase IV to Kubernetes"
4. Press Enter
5. Chatbot responds: "✓ Task created: Deploy Phase IV to Kubernetes"
6. Task appears in task list on dashboard

**Voiceover/Text**:
> "Natural language task creation via AI chatbot"

**Highlight**: Show the task appearing in the main task list

---

## Scene 7: AI Chatbot - Task Operations (12 seconds)

**Visual**: Chat interface with multiple commands

**Actions**:
1. Type: "Show my tasks"
2. Chatbot lists all tasks
3. Type: "Complete task: Deploy Phase IV to Kubernetes"
4. Chatbot responds: "✓ Task marked as complete"
5. Task shows checkmark in dashboard

**Voiceover/Text**:
> "All 5 MCP tools working: add, list, complete, update, delete"

---

## Scene 8: Kubernetes Self-Healing (10 seconds)

**Visual**: Split screen - Terminal and Browser

**Terminal Commands**:
```bash
# Delete backend pod to trigger restart
kubectl delete pod -n todo-app -l app=backend

# Watch pod recreation
kubectl get pods -n todo-app -w
```

**Expected Output**:
```
pod "backend-deployment-7d9f8b5c6d-x7k2m" deleted

NAME                                  READY   STATUS              RESTARTS   AGE
backend-deployment-7d9f8b5c6d-n8k5p   0/1     ContainerCreating   0          2s
backend-deployment-7d9f8b5c6d-n8k5p   1/1     Running             0          15s
```

**Browser**: Chat interface still works, conversation history preserved

**Voiceover/Text**:
> "Self-healing: Pod restarted automatically, data persisted"

---

## Scene 9: Closing Summary (10 seconds)

**Visual**: Terminal or slide showing key achievements

**On Screen**:
```
✓ Kubernetes Deployment Complete
✓ Multi-stage Docker images (<600MB)
✓ Helm chart with RBAC security
✓ Health probes and self-healing
✓ AI chatbot with 5 MCP tools
✓ Conversation persistence
✓ 3 reusable deployment skills
```

**Voiceover/Text**:
> "Phase IV complete: Production-ready Kubernetes deployment"

---

## Alternative: Fast-Paced Version (60 seconds)

If time is tight, combine scenes:

**Scene 1-2 Combined** (8 seconds): Intro + Cluster Status
**Scene 3-4 Combined** (12 seconds): Deployment + Access
**Scene 5-6 Combined** (15 seconds): Login + Task Creation
**Scene 7** (10 seconds): Task Operations
**Scene 8** (10 seconds): Self-Healing
**Scene 9** (5 seconds): Summary

---

## Recording Tips

### Preparation
1. **Clean Environment**:
   - Clear terminal history
   - Close unnecessary applications
   - Set terminal font size to 14-16pt for readability
   - Use high contrast theme (dark background, light text)

2. **Pre-stage Commands**:
   - Have all commands ready in a text file
   - Test the flow before recording
   - Ensure Minikube is running and stable

3. **Browser Setup**:
   - Clear browser cache and cookies
   - Zoom to 125% for better visibility
   - Close unnecessary tabs
   - Disable browser extensions

### Recording
1. **Screen Recording Software**:
   - OBS Studio (free, cross-platform)
   - QuickTime (macOS)
   - Windows Game Bar (Windows)
   - Loom (web-based)

2. **Recording Settings**:
   - Resolution: 1920x1080 (1080p)
   - Frame rate: 30 fps minimum
   - Audio: Clear voiceover or text overlays
   - Cursor: Visible and highlighted

3. **Pacing**:
   - Speak clearly and not too fast
   - Pause briefly between scenes
   - Allow time for viewers to read output
   - Use text overlays for key points

### Editing
1. **Transitions**:
   - Smooth cuts between scenes
   - Fade in/out for scene changes
   - Highlight important text with boxes or arrows

2. **Text Overlays**:
   - Use large, readable font (24pt+)
   - High contrast (white text on dark background)
   - Position at top or bottom, not covering content

3. **Timing**:
   - Cut dead time (waiting for commands)
   - Speed up slow operations (2x speed)
   - Keep total under 90 seconds

---

## Voiceover Script (Full Version)

**[0:00-0:05] Introduction**
"Phase IV: Kubernetes Deployment of the Todo AI Chatbot application on a local Minikube cluster."

**[0:05-0:15] Cluster Status**
"Our Minikube cluster is running with the todo-app namespace. All Kubernetes components are healthy."

**[0:15-0:30] Deployment Status**
"Both backend and frontend pods are running. Services are exposed via ClusterIP and NodePort. Ingress is configured for production-like access."

**[0:30-0:40] Application Access**
"We access the application using port-forwarding. The frontend loads successfully with user authentication."

**[0:40-0:55] AI Chatbot Demo**
"The AI chatbot uses natural language to create tasks. We say 'Add task: Deploy Phase IV to Kubernetes' and the task is created instantly. The chatbot can list, complete, update, and delete tasks using conversational commands."

**[0:55-1:05] Self-Healing**
"Kubernetes provides self-healing. When we delete the backend pod, it automatically restarts. The conversation history persists in the database, demonstrating data persistence."

**[1:05-1:15] Closing**
"Phase IV is complete: production-ready Kubernetes deployment with Docker containers, Helm charts, RBAC security, health monitoring, and AI-powered task management. All artifacts are documented and ready for cloud deployment."

---

## Checklist Before Recording

### Technical Setup
- [ ] Minikube cluster running and stable
- [ ] All pods in Running state (1/1 Ready)
- [ ] Services and ingress created
- [ ] Port-forward working (http://localhost:3000 accessible)
- [ ] User account created and can login
- [ ] Chat interface loads and responds
- [ ] At least one task exists for demonstration

### Recording Setup
- [ ] Screen recording software installed and tested
- [ ] Terminal font size increased (14-16pt)
- [ ] Browser zoom set to 125%
- [ ] All commands prepared in text file
- [ ] Voiceover script reviewed
- [ ] Microphone tested (if using voiceover)
- [ ] Background noise minimized

### Content Verification
- [ ] All required elements visible:
  - [ ] kubectl get pods output
  - [ ] Browser showing chat interface
  - [ ] Natural language task creation
  - [ ] Task appearing in task list
  - [ ] Pod restart demonstration
- [ ] Timing under 90 seconds
- [ ] All text readable at 1080p
- [ ] No sensitive information visible (API keys, passwords)

---

## Post-Recording

### Review
1. Watch the video completely
2. Verify all required elements are shown
3. Check audio quality (if voiceover)
4. Ensure timing is under 90 seconds
5. Verify text is readable

### Export
1. Format: MP4 (H.264 codec)
2. Resolution: 1920x1080
3. Frame rate: 30 fps
4. Audio: AAC codec (if voiceover)
5. File size: <100MB recommended

### Upload
1. YouTube (unlisted or public)
2. Google Drive (shareable link)
3. Loom (direct link)
4. Include link in submission

---

## Troubleshooting During Recording

### Issue: Pods Not Running
**Solution**: Wait for pods to reach Running state before starting recording
```bash
kubectl wait --for=condition=ready pod -l app=backend -n todo-app --timeout=120s
kubectl wait --for=condition=ready pod -l app=frontend -n todo-app --timeout=120s
```

### Issue: Port-Forward Fails
**Solution**: Kill existing port-forward and restart
```bash
# Kill existing port-forward
pkill -f "port-forward.*3000"

# Restart
kubectl port-forward -n todo-app service/frontend-service 3000:3000
```

### Issue: Chat Not Responding
**Solution**: Check backend logs and restart if needed
```bash
kubectl logs -n todo-app -l app=backend --tail=50
kubectl rollout restart deployment/backend-deployment -n todo-app
```

### Issue: Task Not Appearing
**Solution**: Refresh browser page or check database connection
```bash
# Check backend readiness
curl http://localhost:8000/ready

# Check backend logs
kubectl logs -n todo-app -l app=backend --tail=20
```

---

## Demo Script Variations

### Variation A: Technical Focus (For Technical Audience)
- Emphasize Kubernetes architecture
- Show kubectl commands and outputs
- Highlight RBAC, health probes, resource limits
- Demonstrate self-healing and scaling

### Variation B: Business Focus (For Non-Technical Audience)
- Emphasize user experience
- Show chatbot functionality prominently
- Minimize terminal commands
- Focus on natural language interaction

### Variation C: Security Focus
- Show secrets management
- Demonstrate RBAC permissions
- Verify no secrets in images
- Show non-root container execution

---

## Success Criteria for Demo Video

The demo video must show:
1. ✅ Minikube cluster running (kubectl get pods)
2. ✅ Browser showing chat interface
3. ✅ Natural language task creation
4. ✅ Task appearing in task list
5. ✅ At least one other MCP tool operation
6. ✅ Duration under 90 seconds
7. ✅ Clear audio or text overlays
8. ✅ Readable text and outputs

---

## Version

1.0.0

## Last Updated

2026-02-19
