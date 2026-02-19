# TaskFlow - AI-Powered Todo Application

A modern, production-ready multi-user task management application with AI chatbot integration, featuring natural language task operations and intelligent navigation.

## 🚀 Features

### Phase IV - Kubernetes Deployment (NEW!)
- **🐳 Containerization**: Multi-stage Docker builds for optimized images (<600MB total)
- **☸️ Kubernetes Orchestration**: Complete Helm chart for local Minikube deployment
- **🔒 Secure Secrets Management**: Kubernetes Secrets for credentials (Cohere API, Database, JWT)
- **🏥 Health Monitoring**: Liveness and readiness probes for self-healing
- **🤖 AI-Assisted Operations**: kubectl-ai and kagent for natural language cluster management
- **♻️ Reusable Intelligence**: 3 deployment skills (Dockerfile generator, Helm chart generator, troubleshooter)
- **📊 RBAC Security**: Role-based access control with minimal permissions
- **📦 Single-Command Deployment**: `helm install` deploys entire application

### Phase III - AI Chatbot Integration
- **Natural Language Task Management**: Create, update, and manage tasks using conversational AI
- **Smart Navigation**: Navigate the app using voice commands ("Go to dashboard", "Open tasks")
- **MCP Tools Integration**: Model Context Protocol tools for seamless task operations
- **OpenAI Agents SDK**: Powered by advanced AI agent architecture
- **Real-time Chat Interface**: Modern, responsive chatbot UI with conversation history

### Core Features
- 🔐 Secure user authentication with JWT
- ✅ Full CRUD operations for tasks
- 📊 Analytics and productivity tracking
- 📅 Calendar view for task scheduling
- 🎨 Modern UI with dark mode support
- 🔄 Real-time updates and optimistic UI
- 📱 Fully responsive design
- 🎯 Drag-and-drop Kanban board
- 🔔 Toast notifications and error handling
- ⚡ Fast and performant

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Context API
- **UI Components**: Custom components with Lucide icons

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.13+
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: SQLModel
- **Authentication**: JWT-based auth
- **AI Integration**: Cohere AI
- **Tools**: Model Context Protocol (MCP)

### AI & Chatbot
- **AI Provider**: Cohere Command R+
- **Agent Framework**: OpenAI Agents SDK
- **Tool Protocol**: MCP (Model Context Protocol)
- **Natural Language Processing**: Advanced NLP for task commands

## 📁 Project Structure

```
phase3_chatboat/
├── backend/                    # FastAPI Backend
│   ├── src/
│   │   ├── api/               # API endpoints (auth, tasks, chat)
│   │   ├── models/            # Database models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── auth/              # JWT authentication
│   │   ├── config/            # Configuration
│   │   ├── database/          # Database session
│   │   ├── middleware/        # Error handling middleware
│   │   ├── mcp/               # MCP tools (task operations, navigation)
│   │   ├── agent/             # AI agent (Cohere integration)
│   │   └── main.py            # FastAPI app entry
│   ├── tests/                 # Backend tests
│   └── pyproject.toml         # Python dependencies
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   ├── components/        # React components
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── tasks/         # Task-specific components
│   │   │   └── ChatWidget.tsx # AI chatbot interface
│   │   ├── contexts/          # React contexts (Theme, Toast)
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # API client and utilities
│   │   └── styles/            # Global styles
│   ├── public/                # Static assets
│   └── package.json           # Node dependencies
│
├── docs/                       # Organized Documentation
│   ├── deployment/            # Deployment guides (HuggingFace, Vercel)
│   ├── development/           # Development guides (database, setup)
│   ├── architecture/          # Architecture documentation
│   ├── phase3/                # Phase III documentation
│   ├── summaries/             # Implementation summaries
│   └── examples/              # Example files
│
├── specs/                      # Feature Specifications (SDD)
│   ├── 001-ai-k12-efficiency/
│   ├── 002-todo-web-app/
│   └── 003-ai-chatbot-integration/
│
├── history/                    # Development History
│   └── prompts/               # Prompt History Records (PHRs)
│
├── skills/                     # Claude Code Custom Skills
│   ├── ai_mcp_integrator/
│   ├── python_specialist/
│   └── frontend_architect/
│
├── scripts/                    # Utility Scripts
│   ├── setup/
│   ├── deployment/
│   └── maintenance/
│
├── .specify/                   # SpecKit Plus Framework
│   ├── memory/
│   ├── templates/
│   └── scripts/
│
├── STRUCTURE.md               # Detailed structure documentation
├── PROJECT_STRUCTURE.txt      # Visual structure reference
├── README.md                  # This file
├── CLAUDE.md                  # Claude Code instructions
├── .env.example               # Environment variables template
├── docker-compose.yml         # Docker configuration
└── vercel.json                # Vercel deployment config
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.13+
- PostgreSQL database (or use Neon Serverless)
- Cohere API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd phase3_chatboat
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_SECRET (random secret key)
# - COHERE_API_KEY (from cohere.ai)
```

3. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Install frontend dependencies**
```bash
cd frontend
npm install
```

5. **Initialize the database**
```bash
cd backend
python -c "from src.database.session import init_db; init_db()"
```

### Running the Application

#### Option 1: Using the startup script (Windows)
```bash
# From project root
scripts/start-all.bat
```

#### Option 2: Manual startup

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn src.main:app --reload --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

## 🤖 Using the AI Chatbot

The AI chatbot is accessible from any page via the chat icon in the bottom-right corner.

### Natural Language Commands

**Task Management:**
- "Add task: Buy groceries"
- "Show my tasks"
- "Complete task: Buy milk"
- "Update task: Change deadline to tomorrow"
- "Delete task: Old project"

**Navigation:**
- "Go to dashboard"
- "Open tasks page"
- "Take me to calendar"
- "Show analytics"
- "Go to settings"

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Tasks
- `GET /api/{user_id}/tasks` - Get all tasks
- `POST /api/{user_id}/tasks` - Create task
- `GET /api/{user_id}/tasks/{id}` - Get specific task
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion

### AI Chat
- `POST /api/{user_id}/chat` - Send message to AI chatbot

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚢 Deployment

### Production Deployment

**Backend:** Deployed on Hugging Face Spaces
- URL: https://mnusrulah104-todoapp-chatbot.hf.space
- API Docs: https://mnusrulah104-todoapp-chatbot.hf.space/docs
- Status: ✅ Live

**Frontend:** Configure to use production backend
```bash
cd frontend
# Create .env.local with production API URL
echo "NEXT_PUBLIC_API_URL=https://mnusrulah104-todoapp-chatbot.hf.space" > .env.local
npm run dev
```

### Local Development

For local development, override the API URL:
```bash
cd frontend
# Create .env.local with local backend
echo "NEXT_PUBLIC_API_URL=http://localhost:8001" > .env.local
npm run dev
```

### Phase IV - Kubernetes Deployment (Minikube)

Deploy the complete application stack to a local Kubernetes cluster using Helm.

**Prerequisites:**
- Docker Desktop (with Kubernetes enabled) or Minikube
- kubectl CLI tool
- Helm 3.x
- 4GB+ RAM available for cluster

**Quick Start (5 Steps):**

1. **Start Minikube and enable ingress**
   ```bash
   minikube start --cpus=4 --memory=8192
   minikube addons enable ingress
   minikube addons enable metrics-server
   ```

2. **Build and load Docker images**
   ```bash
   # Build backend image
   docker build -t todo-backend:latest -f docker/backend/Dockerfile backend/
   minikube image load todo-backend:latest

   # Build frontend image
   docker build -t todo-frontend:latest -f docker/frontend/Dockerfile frontend/
   minikube image load todo-frontend:latest
   ```

3. **Create Kubernetes secrets**
   ```bash
   kubectl create namespace todo-app
   kubectl create secret generic app-secrets \
     --from-literal=COHERE_API_KEY='your-cohere-api-key' \
     --from-literal=DATABASE_URL='your-neon-db-url' \
     --from-literal=JWT_SECRET='your-jwt-secret' \
     --namespace=todo-app
   ```

4. **Deploy with Helm**
   ```bash
   helm install todo-app helm/todo-app --namespace todo-app
   ```

5. **Access the application**
   ```bash
   # Option 1: Port forwarding (quick access)
   kubectl port-forward -n todo-app service/frontend-service 3000:3000
   # Access at http://localhost:3000

   # Option 2: Ingress (production-like)
   echo "$(minikube ip) todo-app.local" | sudo tee -a /etc/hosts
   # Access at http://todo-app.local

   # Option 3: NodePort (direct node access)
   minikube service frontend-service -n todo-app
   ```

**Verify Deployment:**
```bash
# Check pod status
kubectl get pods -n todo-app

# Check services
kubectl get svc -n todo-app

# View logs
kubectl logs -n todo-app -l app=backend --tail=50
kubectl logs -n todo-app -l app=frontend --tail=50
```

**AI-Assisted Operations:**

Use kubectl-ai for natural language cluster management:
```bash
kubectl ai "show me all pods in todo-app namespace"
kubectl ai "get logs from backend pod in todo-app"
kubectl ai "restart the backend deployment"
```

See [AI Tools Usage Guide](docs/ai-tools-usage.md) for comprehensive kubectl-ai and kagent examples.

**Detailed Documentation:**
- [Helm Chart README](helm/todo-app/README.md) - Complete deployment guide
- [AI Tools Usage](docs/ai-tools-usage.md) - kubectl-ai and kagent workflows
- [Troubleshooting Guide](helm/todo-app/README.md#troubleshooting) - Common issues and fixes

**Reusable Deployment Skills:**

Three Claude Code skills are available for deployment automation:
- `generate-dockerfile` - Create optimized multi-stage Dockerfiles
- `generate-helm-chart` - Generate complete Helm charts
- `troubleshoot-k8s-deployment` - Diagnose and fix deployment issues

See `.claude/skills/` directory for skill documentation.

### Deployment Guides

See detailed deployment guides in `docs/deployment/`:
- [HuggingFace Setup Guide](docs/deployment/HUGGINGFACE_ENV_SETUP.md)
- [New Space Setup Guide](docs/deployment/NEW_SPACE_SETUP_GUIDE.md)
- [Deployment Environment Guide](docs/deployment/DEPLOYMENT_ENV_GUIDE.md)
- [Deployment Complete Summary](docs/deployment/DEPLOYMENT_COMPLETE.md)

### Quick Deploy

**Frontend (Vercel):**
```bash
cd frontend
vercel deploy
```

**Backend (Docker):**
```bash
cd backend
docker build -t taskflow-backend .
docker run -p 8001:8001 taskflow-backend
```

## 📖 Documentation

### Structure & Setup
- [Project Structure](STRUCTURE.md) - Detailed directory structure guide
- [Visual Structure Reference](PROJECT_STRUCTURE.txt) - ASCII structure overview

### Development
- [Database Fix Guide](docs/development/DATABASE_FIX_GUIDE.md)

### Deployment
- [HuggingFace Setup](docs/deployment/HUGGINGFACE_ENV_SETUP.md)
- [Deployment Guide](docs/deployment/DEPLOYMENT_ENV_GUIDE.md)
- [New Space Setup](docs/deployment/NEW_SPACE_SETUP_GUIDE.md)

### Phase III
- Phase III documentation in `docs/phase3/`

## 🔒 Security

- JWT-based authentication and authorization
- User data isolation (all operations scoped to user_id)
- Input validation and sanitization
- Environment-based configuration for secrets
- CORS protection
- SQL injection prevention via SQLModel ORM
- Comprehensive error handling

## 🎨 UI/UX Features

- Modern glassmorphism design
- Smooth animations with Framer Motion
- Dark mode support
- Responsive layout (mobile, tablet, desktop)
- Toast notifications for user feedback
- Confirmation modals for destructive actions
- Loading states for all async operations
- Optimistic UI updates with rollback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Frontend powered by [Next.js](https://nextjs.org/)
- AI integration with [Cohere](https://cohere.ai/)
- UI components inspired by [Notion](https://notion.so) and [Linear](https://linear.app)

---

**Version**: Phase III (AI Chatbot Integration)
**Last Updated**: February 2026
