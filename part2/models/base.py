import uuid
from datetime import datetime

class BaseModel:
    def __init__(self):
        self.id = str(uuid.uuid4())
        now = datetime.utcnow()
        self.created_at = now
        self.updated_at = now

    def save(self):
        """Update the updated_at timestamp."""
        self.updated_at = datetime.utcnow()

    def update(self, data: dict):
        """
        Update existing attributes only, then refresh updated_at.
        Child classes may override this for validation.
        """
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()
