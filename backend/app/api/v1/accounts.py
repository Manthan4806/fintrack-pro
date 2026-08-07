from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.crud.account import create_account, get_accounts
from app.db.database import get_db
from app.schemas.account import (
    AccountCreate,
    AccountResponse,
)

router = APIRouter(
    prefix="/accounts",
    tags=["Accounts"],
)

@router.post(
    "",
    response_model=AccountResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_account(
    account: AccountCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_account(
        db=db,
        account=account,
        user_id=current_user.id,
    )

@router.get(
    "",
    response_model=list[AccountResponse],
)
def read_accounts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_accounts(
        db=db,
        user_id=current_user.id,
    )