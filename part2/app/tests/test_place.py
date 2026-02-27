from app.models.user import User
from app.models.place import Place
from app.models.amenity import Amenity

u = User("Ada", "Lovelace", "ada@example.com")
p = Place("Studio", "Nice place", 50.0, 48.85, 2.35, u)

print("Place:", p.title, "Owner:", p.owner.email)

wifi = Amenity("WiFi")
p.add_amenity(wifi)

print("Amenities count:", len(p.amenities))

p.update({"price": 60})
print("Updated price:", p.price)

# Uncomment to test validation (should raise ValueError)
# Place("", "x", 50, 0, 0, u)
# Place("Ok", "x", 0, 0, 0, u)
# Place("Ok", "x", 50, 200, 0, u)