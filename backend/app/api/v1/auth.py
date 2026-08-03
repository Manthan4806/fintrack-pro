from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import verify_password, create_access_token
from app.crud.user import create_user, get_user_by_email
from app.db.database import get_db
from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserLogin,
    Token,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    existing_user = get_user_by_email(db, user.email)

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    return create_user(db, user)


@router.post(
    "/login",
    response_model=Token,
)
def login(
    user_credentials: UserLogin,
    db: Session = Depends(get_db),
):
    user = get_user_by_email(
        db,
        user_credentials.email,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(
        user_credentials.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        {"sub": str(user.email)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }