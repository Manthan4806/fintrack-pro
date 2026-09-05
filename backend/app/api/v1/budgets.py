from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.crud.budget import create_budget, get_budgets, delete_budget
from app.db.database import get_db
from app.schemas.budget import BudgetCreate, BudgetResponse


router = APIRouter(
    prefix="/budgets",
    tags=["Budgets"]
)


@router.post(
    "",
    response_model=BudgetResponse,
    status_code=status.HTTP_201_CREATED
)
def create_new_budget(
    budget: BudgetCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_budget(
        db=db,
        budget=budget,
        user_id=current_user.id
    )


@router.get(
    "",
    response_model=list[BudgetResponse]
)
def read_budgets(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_budgets(
        db=db,
        user_id=current_user.id
    )


@router.delete(
    "/{budget_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_existing_budget(
    budget_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    delete_budget(
        db=db,
        budget_id=budget_id,
        user_id=current_user.id
    )
    