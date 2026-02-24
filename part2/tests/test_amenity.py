from app.models.amenity import Amenity

a = Amenity("WiFi")
print(a.name)

a.update({"name": "Parking"})
print("Updated:", a.name)

# Uncomment to test validation
# Amenity("")