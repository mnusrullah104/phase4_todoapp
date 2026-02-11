"""
Database initialization script for Phase III AI Chatbot Integration.

This script creates all necessary tables in the PostgreSQL database:
- users: User accounts
- tasks: Todo tasks (Phase 2)
- conversations: Chat conversations (Phase 3)
- messages: Chat messages (Phase 3)

Usage:
    python init_db.py
"""
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from sqlmodel import SQLModel, Session
from src.models.user import User
from src.models.task import Task
from src.models.conversation import Conversation
from src.models.message import Message
from src.database.session import engine
from src.config.settings import get_settings
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def init_database():
    """Initialize the database with all tables."""
    print("[*] Initializing Phase III Database...")

    # Get database URL from settings
    settings = get_settings()
    database_url = settings.database_url
    print(f"[*] Database: {database_url.split('@')[1] if '@' in database_url else 'SQLite'}")

    # Create all tables using the existing engine
    print("\n[*] Creating tables...")
    SQLModel.metadata.create_all(engine)

    print("\n[SUCCESS] Database initialized successfully!")
    print("\nTables created:")
    print("  - users")
    print("  - tasks (Phase 2)")
    print("  - conversations (Phase 3)")
    print("  - messages (Phase 3)")

    # Verify tables exist
    from sqlalchemy import text
    with Session(engine) as session:
        print("\n[*] Verifying database connection...")
        # Simple query to verify connection
        result = session.exec(text("SELECT 1")).first()
        if result:
            print("[SUCCESS] Database connection verified!")

    return True

if __name__ == "__main__":
    try:
        init_database()
    except Exception as e:
        print(f"\n[ERROR] Error initializing database: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
