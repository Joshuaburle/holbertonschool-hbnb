from app.persistence.repository import SQLAlchemyRepository
from app.models.review import Review


class ReviewRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(Review)

    def get_by_place(self, place_id: str):
        """Return all reviews for a given place."""
        return Review.query.filter_by(place_id=place_id).all()

    def get_by_user(self, user_id: str):
        """Return all reviews written by a given user."""
        return Review.query.filter_by(user_id=user_id).all()

    def get_by_user_and_place(self, user_id: str, place_id: str):
        """Check whether a user already reviewed a place."""
        return Review.query.filter_by(
            user_id=user_id, place_id=place_id
        ).first()
