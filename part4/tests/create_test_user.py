#!/usr/bin/env python3
"""
Create a test user in the part3 application's database while placed in part4.

This script reuses the existing `HBnBFacade` from the part3 app so password hashing
and persistence logic remain centralized. It adjusts sys.path to import the
part3 package from the repository.

Run from the repository root or from `part4`:

    python3 part4/scripts/create_test_user.py

"""
import sys
import os

# Add the part3 package to sys.path so we can import the Flask app there.
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
part3_path = os.path.join(repo_root, 'part3')
sys.path.insert(0, part3_path)

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
        # Ensure tables are created
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
