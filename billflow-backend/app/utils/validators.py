"""
utils/validators.py

All validation rules are driven by constants at the top of this file.
No magic strings or hardcoded values inside validator functions.
Each validator raises ValueError with a descriptive message on failure,
making them safe to call directly from Pydantic field_validators.
"""

import re

# ---------------------------------------------------------------------------
# Constants — change rules here, nowhere else
# ---------------------------------------------------------------------------

# Field length limits (shared with SQLAlchemy column definitions)
NAME_MIN_LENGTH = 2
NAME_MAX_LENGTH = 100
EMAIL_MAX_LENGTH = 255
BUSINESS_NAME_MIN_LENGTH = 2
BUSINESS_NAME_MAX_LENGTH = 255
PASSWORD_HASH_LENGTH = 255
PHONE_MAX_LENGTH = 20
GSTIN_LENGTH = 15
IDENTIFIER_MIN_LENGTH = 1

# Phone: Indian mobile numbers
#   Accepted formats: +91XXXXXXXXXX | 0XXXXXXXXXX | XXXXXXXXXX (10 digits, 6-9 start)
PHONE_PATTERN = re.compile(r"^(?:\+91|0)?[6-9][0-9]{9}$")
PHONE_FORMAT_HINT = "+91XXXXXXXXXX, 0XXXXXXXXXX, or 10-digit number starting with 6-9"

# Email: RFC-5322 simplified (Pydantic EmailStr handles deep validation;
#        this is used for plain-string identifier checks in LoginRequest)
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

# GSTIN: Indian GST Identification Number (15-char alphanumeric)
GSTIN_PATTERN = re.compile(r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")
GSTIN_FORMAT_HINT = f"{GSTIN_LENGTH}-character GSTIN (e.g. 22AAAAA0000A1Z5)"

# Password rules
PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 128
PASSWORD_SPECIAL_CHARS = frozenset("!@#$%^&*()_+-=[]{}|;':\",./<>?")

# OTP
OTP_LENGTH = 6
OTP_PATTERN = re.compile(rf"^[0-9]{{{OTP_LENGTH}}}$")


# ---------------------------------------------------------------------------
# Validators
# ---------------------------------------------------------------------------

def validate_email_str(value: str) -> str:
    """Validate a plain string as an email address."""
    value = value.strip().lower()
    if not EMAIL_PATTERN.match(value):
        raise ValueError("Invalid email address")
    return value


def validate_phone(value: str | None) -> str | None:
    """Validate an optional Indian mobile number."""
    if value is None:
        return None
    value = value.strip()
    if not PHONE_PATTERN.match(value):
        raise ValueError(f"Invalid phone number. Accepted formats: {PHONE_FORMAT_HINT}")
    return value


def validate_gstin(value: str | None) -> str | None:
    """Validate an optional Indian GSTIN."""
    if value is None:
        return None
    value = value.strip().upper()
    if not GSTIN_PATTERN.match(value):
        raise ValueError(f"Invalid GSTIN. Expected format: {GSTIN_FORMAT_HINT}")
    return value


def validate_password_strength(value: str) -> str:
    """Enforce password complexity rules."""
    if len(value) < PASSWORD_MIN_LENGTH:
        raise ValueError(f"Password must be at least {PASSWORD_MIN_LENGTH} characters")
    if len(value) > PASSWORD_MAX_LENGTH:
        raise ValueError(f"Password must not exceed {PASSWORD_MAX_LENGTH} characters")
    if not any(c.isupper() for c in value):
        raise ValueError("Password must contain at least one uppercase letter")
    if not any(c.islower() for c in value):
        raise ValueError("Password must contain at least one lowercase letter")
    if not any(c.isdigit() for c in value):
        raise ValueError("Password must contain at least one digit")
    if not any(c in PASSWORD_SPECIAL_CHARS for c in value):
        raise ValueError("Password must contain at least one special character")
    return value


def validate_login_identifier(value: str) -> str:
    """Accept either a valid email or a valid Indian mobile number."""
    value = value.strip()
    if EMAIL_PATTERN.match(value):
        return value.lower()
    if PHONE_PATTERN.match(value):
        return value
    raise ValueError(
        f"Must be a valid email address or Indian mobile number ({PHONE_FORMAT_HINT})"
    )


def validate_otp_code(value: str) -> str:
    """Validate a numeric OTP of exactly OTP_LENGTH digits."""
    if not OTP_PATTERN.match(value):
        raise ValueError(f"OTP must be exactly {OTP_LENGTH} digits")
    return value
