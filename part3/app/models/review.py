"""
Review model - Tasks 7 & 8
Task 7: core attributes + FK columns.
Task 8: relationship to User (author) added.
        Relationship to Place comes via backref defined in Place.reviews.
"""

from app import db
from .base import BaseModel


class Review(BaseModel):
    __tablename__ = 'reviews'

    # Core attributes (Task 7)
    text   = db.Column(db.Text,    nullable=False)
    rating = db.Column(db.Integer, nullable=False)

    # Foreign keys (Task 7)
    place_id = db.Column(db.String(36), db.ForeignKey('places.id'), nullable=False)
    user_id  = db.Column(db.String(36), db.ForeignKey('users.id'),  nullable=False)

    # One review per user per place
    __table_args__ = (
        db.UniqueConstraint('user_id', 'place_id', name='uq_user_place_review'),
    )

    # Relationships (Task 8)
    # Many-to-one: review.author  /  backref adds user.written_reviews
    author = db.relationship(
        'User',
        backref=db.backref('written_reviews', lazy=True),
        lazy=True,
        foreign_keys=[user_id]
    )
    
    # Note: review.place is provided automatically by the backref
    # defined in Place.reviews (place.py).
    # Serialisation
    def to_dict(self):
        return {
            'id':         self.id,
            'text':       self.text,
            'rating':     self.rating,
            'place_id':   self.place_id,
            'user_id':    self.user_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
