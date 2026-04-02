#!/usr/bin/env python3
"""
Create a test user in the database using the project's facade so the
password is hashed and the SQLAlchemy session is used correctly.

Run this from the `part3` folder (see instructions below).
"""
import sys
import os

# Ensure the project root (parent of scripts/) is on sys.path so `import app` works
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from config import DevelopmentConfig


def main():
    app = create_app(DevelopmentConfig)

    user_data = {
        "email": "test@test.com",
        "password": "1234",
        "first_name": "Test",
        "last_name": "User",
        "is_admin": False,
    }

    with app.app_context():
        # Ensure tables are created (safe: create_all is idempotent)
        from app import db
        db.create_all()

        # Reuse existing facade which validates, hashes and persists users
        from app.services.facade import HBnBFacade
        from app.persistence.repository import UserRepository

        facade = HBnBFacade()
        try:
            result = facade.create_user(user_data)
        except Exception as exc:
            print(f"Could not create user: {exc}")
            # If user already exists show its id/email
            repo = UserRepository()
            existing = repo.get_user_by_email(user_data["email"])
            if existing:
                print(f"User already exists: id={existing.id}, email={existing.email}")
                return 0
            return 1

        print("User created successfully:")
        print(result)
    return 0


if __name__ == "__main__":
    sys.exit(main())
