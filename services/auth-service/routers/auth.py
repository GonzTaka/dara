from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.auth import RegisterRequest, RegisterResponse
from services.auth_service import register_user
from database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    token = register_user(request, db)
    return RegisterResponse(access_token=token)