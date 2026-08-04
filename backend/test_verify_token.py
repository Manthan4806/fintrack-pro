from app.core.security import (
    create_access_token,
    verify_access_token,
)

token = create_access_token(
    {
        "sub": "john@example.com"
    }
)

print(token)

print()

print(
    verify_access_token(token)
)