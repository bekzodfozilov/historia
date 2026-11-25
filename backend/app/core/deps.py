from typing import Annotated, Literal

from fastapi import Depends, HTTPException, Query, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.db import get_db
from app.models import User

DB = Annotated[Session, Depends(get_db)]
LangParam = Annotated[Literal["en", "uz"] | None, Query(description="Resolve bilingual fields to one language")]

_bearer = HTTPBearer(auto_error=False)


def current_user(db: DB, cred: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)]) -> User:
    uid = decode_token(cred.credentials, "access") if cred else None
    user = db.get(User, uid) if uid is not None else None
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated", headers={"WWW-Authenticate": "Bearer"})
    return user


def require_role(*roles: str):
    def dep(user: Annotated[User, Depends(current_user)]) -> User:
        if user.role not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Insufficient role")
        return user
    return dep
