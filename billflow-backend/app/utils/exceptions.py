"""
utils/exceptions.py

Typed application exceptions.
- Raise these from services — never raw HTTPException.
- The global handler in main.py converts them to the standard error envelope.
"""

from fastapi import status


class AppException(Exception):
    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    message: str = "An unexpected error occurred"

    def __init__(self, message: str | None = None) -> None:
        self.message = message or self.__class__.message
        super().__init__(self.message)


class BadRequestError(AppException):
    status_code = status.HTTP_400_BAD_REQUEST
    message = "Bad request"


class UnauthorizedError(AppException):
    status_code = status.HTTP_401_UNAUTHORIZED
    message = "Authentication required"


class ForbiddenError(AppException):
    status_code = status.HTTP_403_FORBIDDEN
    message = "Access denied"


class NotFoundError(AppException):
    status_code = status.HTTP_404_NOT_FOUND
    message = "Resource not found"


class ConflictError(AppException):
    status_code = status.HTTP_409_CONFLICT
    message = "Resource already exists"
