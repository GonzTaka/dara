from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.auth import RegisterRequest, RegisterResponse, LoginRequest, LoginResponse
from services.auth_service import register_user, login_user
from database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    token = register_user(request, db)
    return RegisterResponse(access_token=token)

@router.post("/login", response_model=LoginResponse, status_code=200)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    token = login_user(request, db)
    return LoginResponse(access_token=token)