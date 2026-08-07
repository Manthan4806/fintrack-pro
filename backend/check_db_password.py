from app.core.security import verify_password

stored_hash = "PASTE_THE_HASH_HERE"

print(verify_password("hello123", stored_hash))