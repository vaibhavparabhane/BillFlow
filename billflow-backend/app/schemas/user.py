import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.utils.validators import (
    validate_gstin,
    validate_login_identifier,
    validate_otp_code,
    validate_password_strength,
    validate_phone,
    NAME_MIN_LENGTH,
    NAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    BUSINESS_NAME_MIN_LENGTH,
    BUSINESS_NAME_MAX_LENGTH,
    PHONE_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    OTP_LENGTH,
    IDENTIFIER_MIN_LENGTH,
)


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=NAME_MIN_LENGTH, max_length=NAME_MAX_LENGTH)
    email: EmailStr
    phone: str | None = None
    password: str = Field(..., min_length=PASSWORD_MIN_LENGTH, max_length=PASSWORD_MAX_LENGTH)
    business_name: str = Field(..., min_length=BUSINESS_NAME_MIN_LENGTH, max_length=BUSINESS_NAME_MAX_LENGTH)
    gstin: str | None = None

    @field_validator("password")
    @classmethod
    def strong_password(cls, v: str) -> str:
        return validate_password_strength(v)

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, v: str | None) -> str | None:
        return validate_phone(v)

    @field_validator("gstin")
    @classmethod
    def valid_gstin(cls, v: str | None) -> str | None:
        return validate_gstin(v)


class LoginRequest(BaseModel):
    identifier: str = Field(..., min_length=IDENTIFIER_MIN_LENGTH)
    password: str = Field(..., min_length=IDENTIFIER_MIN_LENGTH)

    @field_validator("identifier")
    @classmethod
    def valid_identifier(cls, v: str) -> str:
        return validate_login_identifier(v)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp_code: str = Field(..., min_length=OTP_LENGTH, max_length=OTP_LENGTH)
    new_password: str = Field(..., min_length=PASSWORD_MIN_LENGTH, max_length=PASSWORD_MAX_LENGTH)

    @field_validator("otp_code")
    @classmethod
    def valid_otp(cls, v: str) -> str:
        return validate_otp_code(v)

    @field_validator("new_password")
    @classmethod
    def strong_password(cls, v: str) -> str:
        return validate_password_strength(v)


class ProfileUpdate(BaseModel):
    business_name: str | None = Field(None, min_length=BUSINESS_NAME_MIN_LENGTH, max_length=BUSINESS_NAME_MAX_LENGTH)
    address: str | None = None
    gstin: str | None = None
    phone: str | None = None

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, v: str | None) -> str | None:
        return validate_phone(v)

    @field_validator("gstin")
    @classmethod
    def valid_gstin(cls, v: str | None) -> str | None:
        return validate_gstin(v)


class TokenResponse(BaseModel):
    token: str
    user: "UserRead"


class UserRead(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    business_name: str
    gstin: str | None
    address: str | None
    phone: str | None
    is_active: bool
    is_email_verified: bool
    last_login: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
