from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import AdminUser
from schemas.schemas import LoginRequest, TokenResponse, RefreshRequest
from services.auth_service import (
    verify_password, create_access_token, create_refresh_token,
    decode_refresh_token, hash_password
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(AdminUser.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")

    data = {"sub": str(user.id), "email": user.email}
    return TokenResponse(
        access_token=create_access_token(data),
        refresh_token=create_refresh_token(data)
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(request: RefreshRequest):
    payload = decode_refresh_token(request.refresh_token)
    data = {"sub": payload["sub"], "email": payload["email"]}
    return TokenResponse(
        access_token=create_access_token(data),
        refresh_token=create_refresh_token(data)
    )
