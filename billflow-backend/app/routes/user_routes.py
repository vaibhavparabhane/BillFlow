from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.controllers import auth_controller
from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.user import ProfileUpdate, UserRead
from app.utils.responses import SuccessResponse

router = APIRouter(prefix="/api/user", tags=["User"])


@router.get(
    "/profile",
    response_model=SuccessResponse[UserRead],
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
)
async def get_profile(current_user: User = Depends(get_current_user)):
    return SuccessResponse(
        message="Profile fetched",
        data=UserRead.model_validate(current_user),
    )


@router.put(
    "/profile",
    response_model=SuccessResponse[UserRead],
    status_code=status.HTTP_200_OK,
    summary="Update current user profile",
)
async def update_profile(
    data: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = await auth_controller.update_profile(db, current_user, data)
    return SuccessResponse(
        message="Profile updated",
        data=UserRead.model_validate(user),
    )
