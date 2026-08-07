from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class AccountCreate(BaseModel):
    name: str
    type: str
    balance: Decimal = Decimal("0.00")
    currency: str = "INR"


class AccountResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    type: str
    balance: Decimal
    currency: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)