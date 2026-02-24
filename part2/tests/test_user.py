from app.models.user import User

u = User("Ada", "Lovelace", "ada@example.com")
print(u.first_name, u.last_name, u.email, u.is_admin)

u.update({"first_name": "Grace"})
print("Updated:", u.first_name)

# This should raise ValueError
# u.update({"email": "not-an-email"})