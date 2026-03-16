"""
Amenity model - Tasks 7 & 8
Task 7: core attributes only.
Task 8: amenity.places backref is added automatically by the relationship()
        defined in Place.amenities (place.py) - no extra code needed here.
"""

from app import db
from .base import BaseModel

class Amenity(BaseModel):
    __tablename__ = 'amenities'

    name = db.Column(db.String(50), nullable=False, unique=True)

    def to_dict(self):
        return {
            'id':         self.id,
            'name':       self.name,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
