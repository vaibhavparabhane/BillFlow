from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.controllers import auth_controller
from app.core.deps import get_db
from app.schemas.user import (
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserRead,
)
from app.utils.responses import SuccessResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=SuccessResponse[TokenResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await auth_controller.register_user(db, data)
    return SuccessResponse(
        message="Registration successful",
        data=TokenResponse(token=result["token"], user=UserRead.model_validate(result["user"])),
    )


@router.post(
    "/login",
    response_model=SuccessResponse[TokenResponse],
    status_code=status.HTTP_200_OK,
    summary="Login with email/phone and password",
)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await auth_controller.login_user(db, data)
    return SuccessResponse(
        message="Login successful",
        data=TokenResponse(token=result["token"], user=UserRead.model_validate(result["user"])),
    )


@router.post(
    "/forgot-password",
    response_model=SuccessResponse[None],
    status_code=status.HTTP_200_OK,
    summary="Request a password reset OTP",
)
async def forgot_password(data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    message = await auth_controller.forgot_password(db, data)
    return SuccessResponse(message=message)


@router.post(
    "/reset-password",
    response_model=SuccessResponse[None],
    status_code=status.HTTP_200_OK,
    summary="Reset password using OTP",
)
async def reset_password(data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    message = await auth_controller.reset_password(db, data)
    return SuccessResponse(message=message)
