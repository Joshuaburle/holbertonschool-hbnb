from .base import BaseModel
from .user import User
from .place import Place


class Review(BaseModel):
    def __init__(self, text: str, rating: int, place: Place, user: User):
        super().__init__()
        self.text = self._validate_text(text)
        self.rating = self._validate_rating(rating)
        self.place = self._validate_place(place)
        self.user = self._validate_user(user)

    @staticmethod
    def _validate_text(value: str) -> str:
        if not isinstance(value, str) or not value.strip():
            raise ValueError("text is required")
        return value.strip()

    @staticmethod
    def _validate_rating(value: int) -> int:
        if not isinstance(value, int):
            raise ValueError("rating must be an integer")
        if value < 1 or value > 5:
            raise ValueError("rating must be between 1 and 5")
        return value

    @staticmethod
    def _validate_place(place: Place) -> Place:
        if not isinstance(place, Place):
            raise ValueError("place must be a Place")
        return place

    @staticmethod
    def _validate_user(user: User) -> User:
        if not isinstance(user, User):
            raise ValueError("user must be a User")
        return user

    def update(self, data: dict):
        if "text" in data:
            self.text = self._validate_text(data["text"])
        if "rating" in data:
            self.rating = self._validate_rating(data["rating"])
        self.save()