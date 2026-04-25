"""
utils/responses.py

Defines the standard API response envelope as Pydantic models so FastAPI
can generate accurate OpenAPI docs via response_model=.

Success:  { "success": true,  "message": "...", "data": <T> }
Error:    { "success": false, "message": "...", "errors": [...] }
"""

from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str
    data: T | None = None


class ErrorDetail(BaseModel):
    field: str | None = None
    message: str


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    errors: list[ErrorDetail] | None = None
