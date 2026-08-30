from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.accounts import router as accounts_router
from app.api.v1.transactions import router as transactions_router


app = FastAPI(
    title="FinTrack Pro API",
    version="1.0.0"
)


# =========================
# CORS CONFIGURATION
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# ROOT ENDPOINT
# =========================

@app.get("/")
def root():
    return {
        "message": "Welcome to FinTrack Pro API"
    }


# =========================
# API ROUTES
# =========================

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(accounts_router)
app.include_router(transactions_router)