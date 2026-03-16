"""
Place model - Tasks 7 & 8
Task 7: core attributes + FK columns.
Task 8: relationship() added for User (owner), Review (one-to-many),
        and Amenity (many-to-many via place_amenity association table).
"""

from app import db
from .base import BaseModel

# Association table - Place <-> Amenity (many-to-many)
place_amenity = db.Table(
    'place_amenity',
    db.Column('place_id',   db.String(36), db.ForeignKey('places.id'),    primary_key=True),
    db.Column('amenity_id', db.String(36), db.ForeignKey('amenities.id'), primary_key=True)
)

class Place(BaseModel):
    __tablename__ = 'places'

    # Core attributes (Task 7)
    title       = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text,        nullable=True)
    price       = db.Column(db.Float,       nullable=False)
    latitude    = db.Column(db.Float,       nullable=True)
    longitude   = db.Column(db.Float,       nullable=True)

    # Foreign key (Task 7)
    owner_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)

    # Relationships (Task 8)
    # Many-to-one: place.owner / backref adds user.places
    owner = db.relationship('User', backref=db.backref('places', lazy=True), lazy=True)

    # One-to-many: place.reviews  (cascade deletes orphan reviews)
    reviews = db.relationship('Review', backref='place', lazy=True, cascade='all, delete-orphan')

    # Many-to-many: place.amenities  /  backref adds amenity.places
    amenities = db.relationship(
        'Amenity',
        secondary=place_amenity,
        lazy='subquery',
        backref=db.backref('places', lazy=True)
    )

    # Serialisation

    def to_dict(self):
        return {
            'id':          self.id,
            'title':       self.title,
            'description': self.description,
            'price':       self.price,
            'latitude':    self.latitude,
            'longitude':   self.longitude,
            'owner_id':    self.owner_id,
            'amenities':   [a.to_dict() for a in self.amenities],
            'reviews':     [r.to_dict() for r in self.reviews],
            'created_at':  self.created_at.isoformat(),
            'updated_at':  self.updated_at.isoformat(),
        }
