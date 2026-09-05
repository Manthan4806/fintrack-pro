from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.transaction import TransactionCategory


class BudgetCreate(BaseModel):
    category: TransactionCategory
    amount: Decimal


class BudgetResponse(BaseModel):
    id: UUID
    user_id: UUID
    category: TransactionCategory
    amount: Decimal
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)