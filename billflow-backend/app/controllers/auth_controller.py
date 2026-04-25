from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.user import ForgotPasswordRequest, LoginRequest, ProfileUpdate, RegisterRequest, ResetPasswordRequest
from app.services import auth_service


async def register_user(db: AsyncSession, data: RegisterRequest) -> dict:
    return await auth_service.register_user(db, data)


async def login_user(db: AsyncSession, data: LoginRequest) -> dict:
    return await auth_service.login_user(db, data)


async def forgot_password(db: AsyncSession, data: ForgotPasswordRequest) -> str:
    return await auth_service.forgot_password(db, data)


async def reset_password(db: AsyncSession, data: ResetPasswordRequest) -> str:
    return await auth_service.reset_password(db, data)


async def update_profile(db: AsyncSession, user: User, data: ProfileUpdate) -> User:
    return await auth_service.update_profile(db, user, data)
