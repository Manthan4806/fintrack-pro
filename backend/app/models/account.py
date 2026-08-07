import uuid

from sqlalchemy import Column, DateTime, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base



class Account(Base):
    __tablename__ = "accounts"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    name = Column(
        String(100),
        nullable=False,
    )

    type = Column(
        String(50),
        nullable=False,
    )

    balance = Column(
        Numeric(12, 2),
        default=0,
    )

    currency = Column(
        String(10),
        default="INR",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    transactions = relationship(
    "Transaction",
    back_populates="account",
    cascade="all, delete",
    )