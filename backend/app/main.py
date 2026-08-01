from fastapi import FastAPI

app = FastAPI(
    title="FinTrack Pro API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Welcome to FinTrack Pro API"}