from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select
from .api import router as api_router
from .config.settings import get_settings
from .database.session import engine
from .middleware.error_handler import setup_error_handlers
import logging
from datetime import datetime

# Import all models to register them with SQLModel metadata
from .models import User, Task, Conversation, Message  # noqa: F401

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title="Todo Web Application API",
    description="A production-ready multi-user Todo Web Application with authentication and task management",
    version="1.0.0",
)

# Setup global error handlers
setup_error_handlers(app)

@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    try:
        logger.info("Creating database tables...")
        SQLModel.metadata.create_all(engine)
        logger.info("Database tables created successfully!")
    except Exception as e:
        logger.error(f"Failed to create database tables: {str(e)}")
        raise

# Configure CORS - dynamically build allowed origins
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "https://localhost:3000",
]

# Add production frontend URLs from environment
if settings.frontend_url:
    # Support comma-separated list of URLs
    frontend_urls = [url.strip() for url in settings.frontend_url.split(",")]
    allowed_origins.extend(frontend_urls)
    logger.info(f"CORS allowed origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo Web Application API"}

@app.get("/health")
def health_check():
    """Liveness probe endpoint - checks if application is running"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/ready")
def readiness_check(response: Response):
    """Readiness probe endpoint - checks if application can serve traffic"""
    try:
        # Test database connectivity
        with Session(engine) as session:
            # Execute a simple query to verify database connection
            session.exec(select(1)).first()

        return {
            "status": "ready",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Readiness check failed: {str(e)}")
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "not_ready",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }