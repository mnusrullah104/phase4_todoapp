# 🚀 Startup Guide - Phase III Todo Application

## Quick Start (Development)

### Prerequisites
- Python 3.13+ installed
- Node.js 18+ and npm installed
- PostgreSQL database (Neon DB configured in `.env`)

### Step 1: Start the Backend Server

```bash
cd backend
python -m uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Database tables created successfully!
INFO:     Application startup complete.
```

**Verify Backend is Running:**
- Open http://localhost:8001/health - Should return `{"status":"healthy","version":"1.0.0"}`
- Open http://localhost:8001/docs - Should show API documentation

### Step 2: Start the Frontend

Open a **new terminal window**:

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
- Ready in 2.5s
```

### Step 3: Access the Application

1. Open your browser to **http://localhost:3000**
2. You'll see the landing page with "Start Free Today" button
3. Click **"Sign Up"** to create a new account
4. Enter your email and password (minimum 6 characters)
5. After signup, you'll be automatically logged in and redirected to the dashboard

## 🔐 Authentication Flow

### First Time Users
1. Click "Sign Up" on the homepage
2. Create an account with email/password
3. You'll receive a JWT token automatically
4. You'll be redirected to `/dashboard`

### Returning Users
1. Click "Sign In" on the homepage
2. Enter your credentials
3. You'll be redirected to `/dashboard`

### Test Account (Already Created)
- **Email:** test@example.com
- **Password:** testpass123

## 🐛 Troubleshooting

### Frontend stuck on landing page?
**Solution:** You need to sign up or log in first. The app requires authentication.

### Backend not responding?
**Check:**
1. Is the backend server running? Check terminal for errors
2. Is it running on port 8001? Run: `curl http://localhost:8001/health`
3. Check backend logs for database connection errors

### Database errors?
**Solution:** Run the database initialization script:
```bash
cd backend
python init_db.py
```

### CORS errors in browser console?
**Solution:** Make sure:
1. Backend is running on port 8001
2. Frontend is running on port 3000
3. Both servers are running simultaneously

## 💡 Development Tips

1. **Keep both servers running** - Backend on port 8001, Frontend on port 3000
2. **Check browser console** - Look for API errors or CORS issues
3. **Check backend logs** - Terminal shows all API requests and errors
4. **Use the test account** - test@example.com / testpass123 for quick testing
5. **API Documentation** - Visit http://localhost:8001/docs for interactive API testing
