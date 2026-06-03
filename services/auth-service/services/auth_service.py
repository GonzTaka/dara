from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.user import User
from schemas.auth import RegisterRequest
from utils.security import hash_password
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