import os
import sys
import unittest

# Ensure part3 is importable (we're in repo root)
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
part3_path = os.path.join(repo_root, 'part3')
sys.path.insert(0, part3_path)

from app import create_app
from config import DevelopmentConfig


class TestAuth(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app(DevelopmentConfig)
        cls.client = cls.app.test_client()

        # Ensure DB/tables exist and test user is present
        with cls.app.app_context():
            from app import db
            db.create_all()
            from app.services.facade import HBnBFacade

            facade = HBnBFacade()
            user_data = {
                "email": "test@test.com",
                "password": "1234",
                "first_name": "Test",
                "last_name": "User",
                "is_admin": False,
            }
            try:
                facade.create_user(user_data)
            except Exception:
                # user may already exist; that's fine for tests
                pass

    def test_login_success_returns_token(self):
        resp = self.client.post(
            '/api/v1/auth/login',
            json={"email": "test@test.com", "password": "1234"}
        )
        self.assertEqual(resp.status_code, 200, msg=f"Body: {resp.get_data(as_text=True)}")
        data = resp.get_json()
        self.assertIsInstance(data, dict)
        self.assertIn('access_token', data)
        self.assertIsInstance(data['access_token'], str)
        self.assertGreater(len(data['access_token']), 20)

    def test_login_wrong_password_returns_401(self):
        resp = self.client.post(
            '/api/v1/auth/login',
            json={"email": "test@test.com", "password": "wrongpass"}
        )
        self.assertEqual(resp.status_code, 401)


if __name__ == '__main__':
    unittest.main()
