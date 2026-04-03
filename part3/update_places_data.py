#!/usr/bin/env python3
"""
Minimal script to update existing places with correct data and amenities.
Usage: python3 update_places_data.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app, db
from app.models.place import Place
from app.models.amenity import Amenity
from app.models.user import User
from config import DevelopmentConfig

app = create_app(DevelopmentConfig)

# Places data with unique titles, descriptions, prices, and coordinates
PLACES_DATA = [
    {
        'title': 'Sunset Loft',
        'description': 'Modern loft with a beautiful sunset view over the city.',
        'price': 80.0,
        'latitude': 48.85,
        'longitude': 2.35,
        'amenities': ['WiFi', 'Kitchen', 'Balcony', 'TV']
    },
    {
        'title': 'Seaside Apartment',
        'description': 'Relaxing apartment near the beach with ocean breeze.',
        'price': 120.0,
        'latitude': 43.29,
        'longitude': 5.37,
        'amenities': ['WiFi', 'Air conditioning', 'Parking']
    },
    {
        'title': 'Ocean Breeze Apartment',
        'description': 'Comfortable apartment with amazing sea view.',
        'price': 95.0,
        'latitude': 43.30,
        'longitude': 5.40,
        'amenities': ['WiFi', 'TV', 'Kitchen', 'Air conditioning']
    },
    {
        'title': 'Alpine Retreat',
        'description': 'Cozy mountain cabin with stunning alpine views.',
        'price': 75.0,
        'latitude': 46.48,
        'longitude': 11.36,
        'amenities': ['Heating', 'Kitchen', 'Parking']
    },
    {
        'title': 'Garden House',
        'description': 'Charming house with private garden and patio.',
        'price': 110.0,
        'latitude': 50.71,
        'longitude': 7.10,
        'amenities': ['Garden', 'Kitchen', 'TV', 'WiFi']
    }
]

def update_places():
    """Update existing places with new data and amenities."""
    with app.app_context():
        # Get or create test user for owner
        admin = User.query.filter_by(email='test@test.com').first()
        if not admin:
            print('[ERROR] Test user not found. Create it first with scripts/create_test_user.py')
            return
        
        # Get or create amenities
        amenity_map = {}
        for amenity_name in ['WiFi', 'Air conditioning', 'Kitchen', 'Parking', 'TV', 'Balcony', 'Heating', 'Garden']:
            amenity = Amenity.query.filter_by(name=amenity_name).first()
            if not amenity:
                amenity = Amenity(name=amenity_name)
                db.session.add(amenity)
            amenity_map[amenity_name] = amenity
        db.session.commit()
        print(f'[OK] Ensured {len(amenity_map)} amenities exist')
        
        # Get existing places (or create if needed)
        existing_places = Place.query.all()
        print(f'[INFO] Found {len(existing_places)} existing places')
        
        # Update or create places with new data
        for idx, place_data in enumerate(PLACES_DATA):
            if idx < len(existing_places):
                place = existing_places[idx]
                print(f'[UPDATE] Updating place {idx+1}: {place_data["title"]}')
            else:
                place = Place(
                    title='',
                    description='',
                    price=0,
                    latitude=0,
                    longitude=0,
                    owner_id=admin.id
                )
                db.session.add(place)
                print(f'[CREATE] Creating new place {idx+1}: {place_data["title"]}')
            
            # Update place data
            place.title = place_data['title']
            place.description = place_data['description']
            place.price = place_data['price']
            place.latitude = place_data['latitude']
            place.longitude = place_data['longitude']
            place.owner_id = admin.id
            
            # Clear old amenities and add new ones
            place.amenities = []
            for amenity_name in place_data['amenities']:
                if amenity_name in amenity_map:
                    place.amenities.append(amenity_map[amenity_name])
            
            db.session.add(place)
            print(f'  - Title: {place.title}')
            print(f'  - Price: ${place.price}')
            print(f'  - Amenities: {", ".join([a.name for a in place.amenities])}')
        
        db.session.commit()
        print(f'\n[OK] Successfully updated/created {len(PLACES_DATA)} places')

if __name__ == '__main__':
    try:
        update_places()
    except Exception as e:
        print(f'[ERROR] {e}')
        import traceback
        traceback.print_exc()
