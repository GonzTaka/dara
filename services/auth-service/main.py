from fastapi import FastAPI

app = FastAPI(
    title="auth-service",
    description="Handles authentication, users, and workspaces for DARA.",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}