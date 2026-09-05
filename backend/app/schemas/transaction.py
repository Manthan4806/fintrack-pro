from datetime import datetime
from uuid import UUID
from enum import Enum

from pydantic import BaseModel, ConfigDict


class TransactionCategory(str, Enum):
    Food = "Food"
    Travel = "Travel"
    Shopping = "Shopping"
    Bills = "Bills"
    Entertainment = "Entertainment"
    Other = "Other"


class TransactionCreate(BaseModel):
    account_id: UUID
    amount: float
    type: str
    description: str | None = None


class TransactionResponse(BaseModel):
    id: UUID
    account_id: UUID
    amount: float
    type: str
    description: str | None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class TransactionUpdate(BaseModel):
    amount: float
    type: str
    description: str | None = None