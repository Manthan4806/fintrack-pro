from app.core.security import hash_password, verify_password

password = "hello123"

hashed = hash_password(password)

print("Generated Hash:")
print(hashed)

print()

print("Verification Result:")
print(verify_password(password, hashed))