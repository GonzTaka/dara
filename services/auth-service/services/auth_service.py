from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.user import User
from schemas.auth import LoginRequest, RegisterRequest
from utils.security import hash_password, verify_password 
from utils.jwt import create_access_token


def register_user(request: RegisterRequest, db: Session) -> str:
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )

    new_user = User(
        email=request.email,
        hashed_password=hash_password(request.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return create_access_token(user_id=new_user.id)

def login_user(request: LoginRequest, db: Session) -> str:
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email.",
        )

    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password.",
        )

    return create_access_token(user_id=user.id)
