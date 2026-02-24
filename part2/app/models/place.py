from .base import BaseModel
from .user import User
from .amenity import Amenity


class Place(BaseModel):
    def __init__(
        self,
        title: str,
        description: str,
        price: float,
        latitude: float,
        longitude: float,
        owner: User,
    ):
        super().__init__()
        self.title = self._validate_title(title)
        self.description = description or ""
        self.price = self._validate_price(price)
        self.latitude = self._validate_latitude(latitude)
        self.longitude = self._validate_longitude(longitude)
        self.owner = self._validate_owner(owner)

        # Relationships
        self.reviews = []     # List[Review]
        self.amenities = []   # List[Amenity]

    @staticmethod
    def _validate_title(value: str) -> str:
        if not isinstance(value, str) or not value.strip():
            raise ValueError("title is required")
        value = value.strip()
        if len(value) > 100:
            raise ValueError("title must be <= 100 characters")
        return value

    @staticmethod
    def _validate_price(value: float) -> float:
        if not isinstance(value, (int, float)):
            raise ValueError("price must be a number")
        value = float(value)
        # Task doc: positive value => strictly > 0
        if value <= 0:
            raise ValueError("price must be a positive value")
        return value

    @staticmethod
    def _validate_latitude(value: float) -> float:
        if not isinstance(value, (int, float)):
            raise ValueError("latitude must be a number")
        value = float(value)
        if value < -90.0 or value > 90.0:
            raise ValueError("latitude must be between -90 and 90")
        return value

    @staticmethod
    def _validate_longitude(value: float) -> float:
        if not isinstance(value, (int, float)):
            raise ValueError("longitude must be a number")
        value = float(value)
        if value < -180.0 or value > 180.0:
            raise ValueError("longitude must be between -180 and 180")
        return value

    @staticmethod
    def _validate_owner(owner: User) -> User:
        if not isinstance(owner, User):
            raise ValueError("owner must be a User")
        return owner

    def add_amenity(self, amenity: Amenity):
        if not isinstance(amenity, Amenity):
            raise ValueError("amenity must be an Amenity")

        # Avoid duplicates by id
        if any(a.id == amenity.id for a in self.amenities):
            return

        self.amenities.append(amenity)
        self.save()

    def update(self, data: dict):
        if "title" in data:
            self.title = self._validate_title(data["title"])
        if "description" in data:
            self.description = data["description"] or ""
        if "price" in data:
            self.price = self._validate_price(data["price"])
        if "latitude" in data:
            self.latitude = self._validate_latitude(data["latitude"])
        if "longitude" in data:
            self.longitude = self._validate_longitude(data["longitude"])
        if "owner" in data:
            self.owner = self._validate_owner(data["owner"])

        self.save()