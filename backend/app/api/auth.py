import re
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.core.deps import DB, current_user
from app.core.security import create_token, decode_token, hash_password, verify_password
from app.models import User

router = APIRouter(prefix="/auth", tags=["auth"])
_EMAIL = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class Credentials(BaseModel):
    email: str = Field(max_length=254)
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def _email(cls, v: str) -> str:
        v = v.strip().lower()
        if not _EMAIL.match(v):
            raise ValueError("invalid email")
        return v


class RefreshIn(BaseModel):
    refresh_token: str


class Tokens(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    email: str
    role: str


def _tokens(u: User) -> Tokens:
    return Tokens(access_token=create_token(u.id, "access"), refresh_token=create_token(u.id, "refresh"))


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(body: Credentials, db: DB):
    user = User(email=body.email, password_hash=hash_password(body.password), role="reader")
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
    return UserOut(id=user.id, email=user.email, role=user.role)


@router.post("/login", response_model=Tokens)
def login(body: Credentials, db: DB):
    user = db.scalar(select(User).where(User.email == body.email))
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    return _tokens(user)


@router.post("/refresh", response_model=Tokens)
def refresh(body: RefreshIn, db: DB):
    uid = decode_token(body.refresh_token, "refresh")
    user = db.get(User, uid) if uid is not None else None
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid refresh token")
    return _tokens(user)


@router.get("/me", response_model=UserOut)
def me(user: Annotated[User, Depends(current_user)]):
    return UserOut(id=user.id, email=user.email, role=user.role)
