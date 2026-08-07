from sqlalchemy.orm import Session

from app.models.account import Account
from app.schemas.account import AccountCreate


def create_account(
    db: Session,
    account: AccountCreate,
    user_id,
):
    db_account = Account(
        user_id=user_id,
        name=account.name,
        type=account.type,
        balance=account.balance,
        currency=account.currency,
    )

    db.add(db_account)
    db.commit()
    db.refresh(db_account)

    return db_account


def get_accounts(
    db: Session,
    user_id,
):
    return (
        db.query(Account)
        .filter(Account.user_id == user_id)
        .all()
    )