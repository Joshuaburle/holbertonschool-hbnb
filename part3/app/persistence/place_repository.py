from app.persistence.repository import SQLAlchemyRepository
from app.models.place import Place


class PlaceRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(Place)

    def get_by_owner(self, owner_id: str):
        """Return all places belonging to a given user."""
        return Place.query.filter_by(owner_id=owner_id).all()
