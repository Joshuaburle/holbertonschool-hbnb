from abc import ABC, abstractmethod
from app import db

class SQLAlchemyRepository:
    def __init__(self, model):
        self.model = model

    # Create
    def add(self, obj):
        db.session.add(obj)
        db.session.commit()
        db.session.refresh(obj)
        return obj

    # Read
    def get(self, obj_id):
        return self.model.query.get(obj_id)

    def get_all(self):
        return self.model.query.all()

    # Update
    def update(self, obj_id, data: dict):
        obj = self.get(obj_id)
        if obj is None:
            return None
        for key, value in data.items():
            if hasattr(obj, key) and key not in ('id', 'created_at'):
                setattr(obj, key, value)
        db.session.commit()
        db.session.refresh(obj)
        return obj

    # Delete
    def delete(self, obj_id):
        obj = self.get(obj_id)
        if obj is None:
            return False
        db.session.delete(obj)
        db.session.commit()
        return True
