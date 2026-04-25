import logging
import random
import string
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import OTPVerification, User
from app.schemas.user import ForgotPasswordRequest, LoginRequest, ProfileUpdate, RegisterRequest, ResetPasswordRequest
from app.utils.exceptions import BadRequestError, ConflictError, ForbiddenError, NotFoundError, UnauthorizedError
from app.utils.validators import OTP_LENGTH

logger = logging.getLogger(__name__)


async def register_user(db: AsyncSession, data: RegisterRequest) -> dict:
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise ConflictError("Email is already registered")

    user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password_hash=hash_password(data.password),
        business_name=data.business_name,
        gstin=data.gstin,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    logger.info("New user registered: %s", user.email)
    return {"token": create_access_token(user.id), "user": user}


async def login_user(db: AsyncSession, data: LoginRequest) -> dict:
    result = await db.execute(
        select(User).where((User.email == data.identifier) | (User.phone == data.identifier))
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.password_hash):
        raise UnauthorizedError("Invalid credentials")
    if not user.is_active:
        raise ForbiddenError("Account is inactive")

    user.last_login = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(user)
    logger.info("User logged in: %s", user.email)
    return {"token": create_access_token(user.id), "user": user}


async def forgot_password(db: AsyncSession, data: ForgotPasswordRequest) -> str:
    result = await db.execute(select(User).where(User.email == data.email))
    if not result.scalar_one_or_none():
        # Intentionally vague — prevents email enumeration
        return "If this email exists, an OTP has been sent"

    otp_code = "".join(random.choices(string.digits, k=OTP_LENGTH))
    db.add(OTPVerification(
        email=data.email,
        otp_code=otp_code,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
    ))
    await db.commit()
    logger.info("OTP dispatched for: %s | expires in %d min", data.email, settings.OTP_EXPIRE_MINUTES)
    return "If this email exists, an OTP has been sent"


async def reset_password(db: AsyncSession, data: ResetPasswordRequest) -> str:
    result = await db.execute(
        select(OTPVerification)
        .where(OTPVerification.email == data.email)
        .where(OTPVerification.otp_code == data.otp_code)
        .where(OTPVerification.is_used.is_(False))
        .order_by(OTPVerification.expires_at.desc())
    )
    otp = result.scalar_one_or_none()

    if not otp:
        raise BadRequestError("Invalid OTP")
    if otp.expires_at < datetime.now(timezone.utc):
        raise BadRequestError("OTP has expired")

    user_result = await db.execute(select(User).where(User.email == data.email))
    user = user_result.scalar_one_or_none()
    if not user:
        raise NotFoundError("User not found")

    user.password_hash = hash_password(data.new_password)
    otp.is_used = True
    await db.commit()
    logger.info("Password reset for: %s", data.email)
    return "Password reset successful"


async def update_profile(db: AsyncSession, user: User, data: ProfileUpdate) -> User:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    await db.commit()
    await db.refresh(user)
    return user
