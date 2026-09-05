from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.budget import Budget
from app.schemas.budget import BudgetCreate


def create_budget(db: Session, budget: BudgetCreate, user_id):
    existing_budget = (
        db.query(Budget)
        .filter(
            Budget.user_id == user_id,
            Budget.category == budget.category
        )
        .first()
    )

    if existing_budget:
        raise HTTPException(
            status_code=400,
            detail=f"A budget for {budget.category} already exists"
        )

    db_budget = Budget(
        user_id=user_id,
        category=budget.category,
        amount=budget.amount
    )

    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)

    return db_budget


def get_budgets(db: Session, user_id):
    return (
        db.query(Budget)
        .filter(Budget.user_id == user_id)
        .all()
    )


def delete_budget(db: Session, budget_id: str, user_id):
    budget = (
        db.query(Budget)
        .filter(
            Budget.id == budget_id,
            Budget.user_id == user_id
        )
        .first()
    )

    if budget is None:
        return None

    db.delete(budget)
    db.commit()

    return budget