from app.core.security import create_access_token

token = create_access_token(
    {"sub": "manthan@gmail.com"}
)

print(token)