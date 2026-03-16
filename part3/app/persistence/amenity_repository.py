from app.persistence.repository import SQLAlchemyRepository
from app.models.amenity import Amenity


class AmenityRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(Amenity)

    def get_by_name(self, name: str):
        return Amenity.query.filter_by(name=name).first()
