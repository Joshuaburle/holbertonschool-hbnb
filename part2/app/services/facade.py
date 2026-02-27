from app.persistence.repository import InMemoryRepository

class HBnBFacade:
    def __init__(self):
        self.user_repo = InMemoryRepository()
        self.place_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()

    # User Management Methods
    def create_user(self, user_data):
        from app.models.user import User

        email = user_data.get("email")
        first_name = user_data.get("first_name", "").strip()
        last_name = user_data.get("last_name", "").strip()

        if not email:
            raise ValueError("Email is required")
        if not first_name and not last_name:
            raise ValueError("First name and last name cannot both be empty")
        if not first_name:
            raise ValueError("First name cannot be empty")
        if not last_name:
            raise ValueError("Last name cannot be empty")

        for user in self.user_repo.get_all():
            if user.email == email:
                raise ValueError(f"User with email '{email}' already exists")

        user = User(**user_data)
        self.user_repo.add(user)

        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email
        }


    def get_user(self, user_id):
        user = self.user_repo.get(user_id)
        if not user:
            raise ValueError(f"User {user_id} does not exist")

        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email
        }

    def get_all_users(self):
        """Retourne tous les users sous forme de liste de dicts"""
        return [
            {
                "id": u.id,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "email": u.email
            }
            for u in self.user_repo.get_all()
        ]

    def get_user_by_email(self, email):
        for user in self.user_repo.get_all():
            if user.email == email:
                return {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email
                }

        return None

    # Place Management Methods
    def create_place(self, place_data):
        from app.models.place import Place

        owner = self.user_repo.get(place_data.get("owner_id"))
        if not owner:
            raise ValueError(f"Owner {place_data.get('owner_id')} does not exist")

        amenities_ids = place_data.get("amenities", [])
        amenities = []
        for a_id in amenities_ids:
            amenity = self.amenity_repo.get(a_id)
            if not amenity:
                raise ValueError(f"Amenity {a_id} does not exist")
            amenities.append(amenity)

        place = Place(
            title=place_data.get("title"),
            description=place_data.get("description"),
            price=place_data.get("price"),
            latitude=place_data.get("latitude"),
            longitude=place_data.get("longitude"),
            owner=owner,
            amenities=amenities
            )

        self.place_repo.add(place.id, place)


        return {
            "id": place.id,
            "title": place.title,
            "description": place.description,
            "price": place.price,
            "latitude": place.latitude,
            "longitude": place.longitude,
            "owner_id": owner.id,
            "amenities": [a.id for a in amenities]
            }

    def get_place(self, place_id):
        place = self.place_repo.get(place_id)
        if not place:
            raise ValueError(f"Place {place_id} does not exist")
        return {
            "id": place.id,
            "title": place.title,
            "description": place.description,
            "price": place.price,
            "latitude": place.latitude,
            "longitude": place.longitude,
            "owner": {
                "id": place.owner.id,
                "first_name": place.owner.first_name,
                "last_name": place.owner.last_name,
                "email": place.owner.email
            },
            "amenities": [{"id": a.id, "name": a.name} for a in place.amenities]
        }

    def get_all_places(self):
        places = self.place_repo.get_all()
        return [
            {
                "id": p.id,
                "title": p.title,
                "latitude": p.latitude,
                "longitude": p.longitude
            }
            for p in places
        ]

    def update_place(self, place_id, place_data):
        place = self.place_repo.get(place_id)
        if not place:
            return None

        for field in ["title", "description", "price", "latitude", "longitude"]:
            if field in place_data:
                setattr(place, field, place_data[field])

        if "owner_id" in place_data:
            owner = self.user_repo.get(place_data["owner_id"])
            if not owner:
                raise ValueError(f"Owner {place_data['owner_id']} does not exist")
            place.owner = owner

        if "amenities" in place_data:
            amenities = []
            for a_id in place_data["amenities"]:
                amenity = self.amenity_repo.get(a_id)
                if not amenity:
                    raise ValueError(f"Amenity {a_id} does not exist")
                amenities.append(amenity)
            place.amenities = amenities

        return {"message": "Place updated successfully"}

    # Review Management Methods
    def create_review(self, text, rating, user_id, place_id):
        from app.models.review import Review

        user = self.user_repo.get(user_id)
        if not user:
            raise ValueError(f"User {user_id} does not exist")

        place = self.place_repo.get(place_id)
        if not place:
            raise ValueError(f"Place {place_id} does not exist")

        review = Review(text=text, rating=rating, place=place, user=user)
        self.review_repo.add(review.id, review)
        return {
            "id": review.id,
            "text": review.text,
            "rating": review.rating,
            "user_id": review.user.id,
            "place_id": review.place.id
        }

    def get_review_by_id(self, review_id):
        review = self.review_repo.get(review_id)
        if not review:
            raise ValueError(f"Review {review_id} does not exist")
        return {
            "id": review.id,
            "text": review.text,
            "rating": review.rating,
            "user_id": review.user.id,
            "place_id": review.place.id
        }

    def get_all_reviews(self):
        return [
            {
                "id": r.id,
                "text": r.text,
                "rating": r.rating,
                "user_id": r.user.id,
                "place_id": r.place.id
            }
            for r in self.review_repo.get_all()
        ]

    def get_reviews_by_place(self, place_id):
        place = self.place_repo.get(place_id)
        if not place:
            raise ValueError(f"Place {place_id} does not exist")
        return [
            {
                "id": r.id,
                "text": r.text,
                "rating": r.rating,
                "user_id": r.user.id,
                "place_id": r.place.id
            }
            for r in self.review_repo.get_all() if r.place.id == place_id
        ]

        if not review:
            raise ValueError(f"No reviews found for place {place_id}")
        return review

    def update_review(self, review_id, update_data):
        review = self.review_repo.get(review_id)
        if not review:
            return None
        review.update(update_data)
        return {
            "id": review.id,
            "text": review.text,
            "rating": review.rating,
            "user_id": review.user.id,
            "place_id": review.place.id
        }

    def delete_review(self, review_id):
        review = self.review_repo.get(review_id)
        if not review:
            return False
        self.review_repo.delete(review_id)
        return True

    # Amenity Management Methods
    def create_amenity(self, amenity_data):
        from app.models.amenity import Amenity

        name = amenity_data.get("name")
        if not name:
            raise ValueError("Amenity name is required")

        for amenity in self.amenity_repo.get_all():
            if amenity.name == name:
                raise ValueError(f"Amenity '{name}' already exists")

        amenity = Amenity(name=name)
        self.amenity_repo.add(amenity)

        return {
            "id": amenity.id,
            "name": amenity.name
        }

    def get_amenity(self, amenity_id):
        amenity = self.amenity_repo.get(amenity_id)
        if not amenity:
            raise ValueError(f"Amenity {amenity_id} does not exist")

        return {
            "id": amenity.id,
            "name": amenity.name
        }

    def get_all_amenities(self):
        return [
            {
                "id": a.id,
                "name": a.name
            }
            for a in self.amenity_repo.get_all()
        ]

    def update_amenity(self, amenity_id, amenity_data):
        amenity = self.amenity_repo.get(amenity_id)
        if not amenity:
            return None

        if "name" in amenity_data:
            if not amenity_data["name"]:
                raise ValueError("Amenity name cannott be empty")

            for a in self.amenity_repo.get_all():
                if a.name == amenity_data["name"] and a.id != amenity_id:
                    raise ValueError(f"Amenity '{amenity_data['name']}' already exists")

            amenity.name = amenity_data["name"]

        return {
            "id": amenity.id,
            "name": amenity.name
        }