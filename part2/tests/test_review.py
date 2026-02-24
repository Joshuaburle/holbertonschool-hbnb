from app.models.user import User
from app.models.place import Place
from app.models.review import Review

u = User("Ada", "Lovelace", "ada@example.com")
p = Place("Studio", "Nice place", 50.0, 48.85, 2.35, u)

r = Review("Great place!", 5, p, u)

print("Review:", r.text, r.rating)
print("Place title:", r.place.title)
print("Author:", u.first_name, u.last_name)

# Uncomment to test validation
# Review("Bad", 10, p, u)