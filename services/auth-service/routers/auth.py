from fastapi import APIRouter, Depends, Response, 
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
def login(request: LoginRequest, response: Response, db: Session = Depends(get_db)):
    access_token, refresh_token = login_user(request, db)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True, #only accessible via HTTP and java cannot read it
        secure= False #since its development and not production 
        samesite="lax"
        max_age=60 * 60 * 24 * 7, #time expires in 7 days but in seconds

    )
    return LoginResponse(access_token=access_token)
