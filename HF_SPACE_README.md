---
title: Todo Backend API
emoji: 📝
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---

# Todo Web Application Backend

FastAPI backend with JWT authentication for the Todo Web Application.

## 🚀 Live Endpoints

- **Health Check**: https://mnusrulah104-todo-backend.hf.space/health
- **API Documentation**: https://mnusrulah104-todo-backend.hf.space/docs
- **ReDoc**: https://mnusrulah104-todo-backend.hf.space/redoc

## 🔧 Features

- User registration and authentication
- JWT token-based security
- Task CRUD operations
- PostgreSQL database integration
- CORS configured for frontend

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/{user_id}/tasks` - Get all tasks
- `POST /api/{user_id}/tasks` - Create task
- `GET /api/{user_id}/tasks/{task_id}` - Get specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle completion

### System
- `GET /` - Welcome message
- `GET /health` - Health check

## 🔒 Environment Variables

Configure these in Space Settings → Repository secrets:

- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT signing key
- `ALGORITHM` - JWT algorithm (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiry time
- `BETTER_AUTH_SECRET` - Auth service secret
- `BETTER_AUTH_URL` - Backend URL
- `BACKEND_URL` - Backend URL
- `FRONTEND_URL` - Frontend URL for CORS

## 🌐 Frontend

Frontend deployed on Vercel: [Link to be added]

## 📝 Repository

GitHub: https://github.com/mnusrullah104/todo_web_phase2

## 🛠️ Tech Stack

- FastAPI
- PostgreSQL (Neon)
- SQLModel
- JWT Authentication
- Python 3.13
