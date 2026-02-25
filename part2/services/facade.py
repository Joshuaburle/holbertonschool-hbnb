# AMENITY METHODS

def create_amenity(self, amenity_data):
    if not amenity_data or "name" not in amenity_data:
        raise ValueError("Invalid amenity data")

    name = amenity_data.get("name")

    if not isinstance(name, str) or not name.strip():
        raise ValueError("Amenity name must be a non-empty string")

    amenity = Amenity(name=name.strip())
    self.amenity_repo.add(amenity)

    return amenity


def get_amenity(self, amenity_id):
    return self.amenity_repo.get(amenity_id)


def get_all_amenities(self):
    return self.amenity_repo.get_all()


def update_amenity(self, amenity_id, amenity_data):
    amenity = self.amenity_repo.get(amenity_id)

    if not amenity:
        return None

    if not amenity_data or "name" not in amenity_data:
        raise ValueError("Invalid amenity data")

    name = amenity_data.get("name")

    if not isinstance(name, str) or not name.strip():
        raise ValueError("Amenity name must be a non-empty string")

    amenity.name = name.strip()
    self.amenity_repo.update(amenity_id, amenity)

    return amenity
