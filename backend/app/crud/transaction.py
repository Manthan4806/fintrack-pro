from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.schemas.transaction import (
    TransactionCreate,
    TransactionUpdate,
)


def create_transaction(
    db: Session,
    transaction: TransactionCreate,
):
    db_transaction = Transaction(
        account_id=transaction.account_id,
        amount=transaction.amount,
        type=transaction.type,
        description=transaction.description,
    )

    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    return db_transaction


def get_transactions(
    db: Session,
):
    return db.query(Transaction).all()

def update_transaction(
    db: Session,
    transaction_id,
    transaction: TransactionUpdate,
):
    db_transaction = (
        db.query(Transaction)
        .filter(Transaction.id == transaction_id)
        .first()
    )

    if db_transaction is None:
        return None

    db_transaction.amount = transaction.amount
    db_transaction.type = transaction.type
    db_transaction.description = transaction.description

    db.commit()
    db.refresh(db_transaction)

    return db_transaction

def delete_transaction(
    db: Session,
    transaction_id,
):
    db_transaction = (
        db.query(Transaction)
        .filter(Transaction.id == transaction_id)
        .first()
    )

    if db_transaction is None:
        return None

    db.delete(db_transaction)
    db.commit()

    return db_transaction