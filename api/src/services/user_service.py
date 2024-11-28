from datetime import datetime

from fastapi import UploadFile
from pydantic import EmailStr

from src.repositories.i_user_repository import IUserRepository
from src.schemas import UserInputData, UserCreateData, UserData
from src.utils import PasswordUtils, ImageValidator

__all__ = [
    "UserService",
    "UsernameAlreadyUsedException",
    "EmailAlreadyUsedException",
    "CannotSaveImageException",
    "ImageSizeException",
    "ImageFiletypeException",
    "ImageAspectRatioException",
    "InvalidDataFormatException"
]


class UsernameAlreadyUsedException(Exception):
    """
    Raised when trying to register user with username that already used
    """


class EmailAlreadyUsedException(Exception):
    """
    Raised when trying to register user with email that already used
    """


class CannotSaveImageException(Exception):
    """
    Raised when cannot save an image in volume directory
    """


class ImageSizeException(Exception):
    """
    Raised when image size is too large (>10MB)
    """


class ImageFiletypeException(Exception):
    """
    Raised when received an image with unsupported filetype
    """


class ImageAspectRatioException(Exception):
    """
    Raised when received an image with unsupported aspect ratio
    """


class InvalidDataFormatException(Exception):
    """
    Raised when received an invalid data format
    """


class UserService:
    _user_repository: IUserRepository

    def __init__(self, user_repository: IUserRepository) -> None:
        self._user_repository = user_repository

    async def register(self, user_register_data: UserInputData) -> UserData:
        user_username_used = await self._user_repository.find_user_by_username(user_register_data.username)
        if user_username_used:
            raise UsernameAlreadyUsedException

        user_email_exists = await self._user_repository.find_user_by_email(user_register_data.email)
        if user_email_exists:
            raise EmailAlreadyUsedException

        hashed_password = PasswordUtils.hashed_password(user_register_data.password)
        user_create_data = UserCreateData.get_from_register_data(user_register_data, hashed_password)

        user = await self._user_repository.insert_user(user_create_data)
        return UserData.model_validate(user)

    async def edit_avatar(self, user: UserData, user_image: UploadFile) -> UserData:
        image_validator = ImageValidator(user_image)

        if not image_validator.validate_size():
            raise ImageSizeException
        if not image_validator.validate_filetype():
            raise ImageFiletypeException
        if not await image_validator.validate_aspect_ratio():
            raise ImageAspectRatioException

        image_bytes = image_validator.image_bytes
        filename = "user_" + user.username + '.' + image_validator.filetype
        try:
            with open(f"/app/images/{filename}", "wb") as file:
                file.write(image_bytes)
        except Exception as e:
            raise CannotSaveImageException from e

        user.photo_url = f"/images/{filename}"
        await self._user_repository.update_user_avatar_by_id(user.id, user.photo_url)

        return user

    async def edit_about(self, user: UserData, about: str) -> UserData:
        await self._user_repository.update_user_about_by_id(user.id, about)
        user.about = about

        return user

    async def edit_birthdate(self, user: UserData, birthdate: str) -> UserData:
        try:
            new_birthdate = datetime.strptime(birthdate, "%Y-%m-%d").date()
        except ValueError:
            raise InvalidDataFormatException

        await self._user_repository.update_user_birthdate_by_id(user.id, new_birthdate)
        user.birthdate = new_birthdate

        return user

    async def edit_email(self, user: UserData, new_email: EmailStr) -> UserData:
        user_email_exists = await self._user_repository.find_user_by_email(new_email)
        if user_email_exists:
            raise EmailAlreadyUsedException

