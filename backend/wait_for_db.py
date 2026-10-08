import time
import os
import sys
from sqlalchemy import create_engine

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from backend.database import DATABASE_URL, engine

def wait_for_database():
    """Waits for PostgreSQL or database engine connection to be healthy."""
    print(f"[+] Waiting for Database connection ({DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL})...")
    max_retries = 30
    for attempt in range(1, max_retries + 1):
        try:
            conn = engine.connect()
            conn.close()
            print("[SUCCESS] Database is online and accepting connections!")
            return True
        except Exception as e:
            print(f"[Attempt {attempt}/{max_retries}] Database not ready yet ({e}). Waiting 2s...")
            time.sleep(2)
    print("[ERROR] Could not connect to database after 30 attempts.")
    sys.exit(1)

if __name__ == "__main__":
    wait_for_database()
