from fastapi import FastAPI
from routers import auth

app = FastAPI(
    title="auth-service",
    description="Handles authentication, users, and workspaces for DARA.",
    version="0.1.0",
)

app.include_router(auth.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}