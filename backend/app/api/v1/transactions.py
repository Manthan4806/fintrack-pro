from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.deps import get_current_user

from app.crud.transaction import (
    create_transaction,
    get_transactions,
    update_transaction,
    delete_transaction,
)

from app.schemas.transaction import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
)
from uuid import UUID
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
)

@router.post(
    "",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_transaction(
        db=db,
        transaction=transaction,
    )

@router.get(
    "",
    response_model=list[TransactionResponse],
)
def read_transactions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_transactions(db)

@router.put(
    "/{transaction_id}",
    response_model=TransactionResponse,
)
def update_existing_transaction(
    transaction_id: UUID,
    transaction: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    updated_transaction = update_transaction(
        db=db,
        transaction_id=transaction_id,
        transaction=transaction,
    )

    if updated_transaction is None:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found",
        )

    return updated_transaction

@router.delete("/{transaction_id}")
def delete_existing_transaction(
    transaction_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    deleted_transaction = delete_transaction(
        db=db,
        transaction_id=transaction_id,
    )

    if deleted_transaction is None:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found",
        )

    return {
        "message": "Transaction deleted successfully"
    }

