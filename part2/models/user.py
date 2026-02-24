import re
from .base import BaseModel

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class User(BaseModel):
    def __init__(self, first_name: str, last_name: str, email: str, is_admin: bool = False):
        super().__init__()
        self.first_name = self._validate_name(first_name, "first_name", 50)
        self.last_name = self._validate_name(last_name, "last_name", 50)
        self.email = self._validate_email(email)
        self.is_admin = bool(is_admin)

    @staticmethod
    def _validate_name(value: str, field: str, max_len: int) -> str:
        if not isinstance(value, str) or not value.strip():
            raise ValueError(f"{field} is required")
        value = value.strip()
        if len(value) > max_len:
            raise ValueError(f"{field} must be <= {max_len} characters")
        return value

    @staticmethod
    def _validate_email(value: str) -> str:
        if not isinstance(value, str) or not value.strip():
            raise ValueError("email is required")
        value = value.strip().lower()
        if not EMAIL_RE.match(value):
            raise ValueError("email format is invalid")
        return value

    def update(self, data: dict):
        """
        Update user fields with validation.
        """
        if "first_name" in data:
            self.first_name = self._validate_name(data["first_name"], "first_name", 50)
        if "last_name" in data:
            self.last_name = self._validate_name(data["last_name"], "last_name", 50)
        if "email" in data:
            self.email = self._validate_email(data["email"])
        if "is_admin" in data:
            self.is_admin = bool(data["is_admin"])
        self.save()