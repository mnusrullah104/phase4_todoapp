@echo off
REM Frontend startup script for Windows

echo Starting Phase III AI Chatbot Frontend...
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env.local exists
if not exist .env.local (
    echo WARNING: .env.local not found, using default API URL (Hugging Face Space)
    echo For local development, create .env.local with: NEXT_PUBLIC_API_URL=http://localhost:8001
    echo.
)

REM Start frontend
echo Starting Next.js development server...
call npm run dev

pause
