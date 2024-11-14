from src.repositories.i_user_repository import IUserRepository
from src.schemas import UserInputData, UserCreateData, UserData
from src.utils import PasswdUtils

__all__ = [
    "UserService",
    "UsernameAlreadyUsedException",
    "EmailAlreadyUsedException",
    "CannotSaveImageException"
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

        hashed_password = PasswdUtils.hashed_password(user_register_data.password)
        user_create_data = UserCreateData.get_from_register_data(user_register_data, hashed_password)

        user = await self._user_repository.insert_user(user_create_data)
        return UserData.model_validate(user)

    async def set_profile_photo(self, user: UserData, user_image: bytes, filename: str) -> UserData:
        try:
            with open(f"/app/images/{filename}", "wb") as file:
                file.write(user_image)
        except Exception as e:
            raise CannotSaveImageException from e

        user.photo_url = f"/images/{filename}"
        await self._user_repository.set_user_photo_url(user.photo_url)

        return user
