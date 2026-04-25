from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.db.base import AsyncSessionLocal
from app.models.user import User
from app.utils.exceptions import UnauthorizedError

bearer_scheme = HTTPBearer()


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    user_id = decode_access_token(credentials.credentials)
    if not user_id:
        raise UnauthorizedError("Invalid or expired token")

    user = await db.get(User, user_id)
    if not user or not user.is_active:
        raise UnauthorizedError("User not found or inactive")
    return user
