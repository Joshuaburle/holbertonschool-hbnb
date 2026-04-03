#!/usr/bin/env python3
"""
Seed the database with places and amenities.

Run this from the `part3` folder:
  python3 scripts/seed_places.py

This script:
1. Creates amenities if they don't exist
2. Creates places with unique data
3. Links amenities to places
"""
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from config import DevelopmentConfig


def main():
    app = create_app(DevelopmentConfig)

    with app.app_context():
        # Ensure tables exist
        db.create_all()

        from app.models.amenity import Amenity
        from app.models.place import Place
        from app.persistence.repository import UserRepository

        # Get or create a test owner user
        user_repo = UserRepository()
        owner = user_repo.get_user_by_email("test@test.com")
        if not owner:
            print("❌ Test user not found. Create it first with: python3 scripts/create_test_user.py")
            return 1

        print(f"✓ Using owner: {owner.email}")

        # Define amenities
        amenities_data = [
            "WiFi",
            "Air conditioning",
            "Kitchen",
            "Parking",
            "TV",
            "Balcony",
        ]

        # Create amenities if they don't exist
        amenities_map = {}
        for name in amenities_data:
            existing = db.session.query(Amenity).filter_by(name=name).first()
            if existing:
                amenities_map[name] = existing
                print(f"✓ Amenity '{name}' already exists")
            else:
                amenity = Amenity(name=name)
                db.session.add(amenity)
                amenities_map[name] = amenity
                print(f"✓ Created amenity '{name}'")

        db.session.commit()

        # Define places with realistic data
        places_data = [
            {
                "title": "Sunset Loft",
                "description": "Modern loft with a beautiful sunset view over the city.",
                "price": 80.0,
                "latitude": 48.85,
                "longitude": 2.35,
                "amenities": ["WiFi", "Kitchen", "Balcony", "TV"],
            },
            {
                "title": "Seaside Apartment",
                "description": "Relaxing apartment near the beach with ocean breeze.",
                "price": 120.0,
                "latitude": 43.29,
                "longitude": 5.37,
                "amenities": ["WiFi", "Air conditioning", "Parking"],
            },
            {
                "title": "Ocean Breeze Apartment",
                "description": "Comfortable apartment with amazing sea view.",
                "price": 95.0,
                "latitude": 43.30,
                "longitude": 5.40,
                "amenities": ["WiFi", "TV", "Kitchen", "Air conditioning"],
            },
            {
                "title": "Alpine Retreat",
                "description": "Cozy mountain cabin with fresh alpine air and stunning views.",
                "price": 70.0,
                "latitude": 46.43,
                "longitude": 6.99,
                "amenities": ["Kitchen", "TV", "Parking"],
            },
            {
                "title": "Garden House",
                "description": "Charming house with a spacious garden and outdoor patio.",
                "price": 100.0,
                "latitude": 51.51,
                "longitude": -0.13,
                "amenities": ["Kitchen", "Parking", "WiFi", "Balcony"],
            },
        ]

        # Create places
        for place_data in places_data:
            # Check if place already exists by title
            existing = db.session.query(Place).filter_by(title=place_data["title"]).first()
            if existing:
                print(f"✓ Place '{place_data['title']}' already exists (id={existing.id})")
                # Update amenities even if place exists
                amenity_names = place_data.get("amenities", [])
                existing.amenities = [amenities_map[name] for name in amenity_names if name in amenities_map]
                db.session.commit()
                continue

            # Create new place
            place = Place(
                title=place_data["title"],
                description=place_data["description"],
                price=place_data["price"],
                latitude=place_data["latitude"],
                longitude=place_data["longitude"],
                owner_id=owner.id,
            )

            # Add amenities
            amenity_names = place_data.get("amenities", [])
            for name in amenity_names:
                if name in amenities_map:
                    place.amenities.append(amenities_map[name])

            db.session.add(place)
            print(f"✓ Created place: '{place.title}' (${place.price}) with {len(place.amenities)} amenities")

        db.session.commit()
        print("\n✅ Places seeded successfully!")
        return 0


if __name__ == "__main__":
    sys.exit(main())
