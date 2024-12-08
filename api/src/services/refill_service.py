from src.repositories.interfaces import IRefillRepository, IRefillRentRepository
from src.schemas import Refill, RefillRent, RefillCreate, UserData

__all__ = [
    "RefillService",
    "UserAlreadyStartedRentException",
    "CannotFinishRentException",
    "RefillWasNotFoundException",
    "NotEnoughRightsException"
]


class UserAlreadyStartedRentException(Exception):
    """
    Raised when user have already started a rent
    """


class CannotFinishRentException(Exception):
    """
    Raised when user cannot finish rent (invalid rent_id)
    """


class RefillWasNotFoundException(Exception):
    """
    Raised when refill was not found
    """


class NotEnoughRightsException(Exception):
    """
    Raised when user hasn't enough right
    """


class RefillService:
    _refill_repository: IRefillRepository
    _refill_rent_repository: IRefillRentRepository

    def __init__(
            self,
            refill_repository: IRefillRepository,
            refill_rent_repository: IRefillRentRepository
    ) -> None:
        self._refill_repository = refill_repository
        self._refill_rent_repository = refill_rent_repository

    async def get_all_refills(self) -> list[Refill]:
        refills_orm = await self._refill_repository.get_all_refills()
        return [Refill.model_validate(refill_orm) for refill_orm in refills_orm]

    async def get_last_user_refill_rents(self, user_id: int) -> list[RefillRent]:
        refill_rents_orm = await self._refill_rent_repository.get_user_last_refill_rents(user_id)
        return [RefillRent.model_validate(refill_rent_orm) for refill_rent_orm in refill_rents_orm]

    async def start_refill_rent(self, user_id: int, refill_id: int) -> RefillRent:
        user_unfinished_rent = await self._refill_rent_repository.find_user_unfinished_rent(user_id)
        if user_unfinished_rent:
            raise UserAlreadyStartedRentException

        refill_rent_raw = await self._refill_rent_repository.start_rent(user_id, refill_id)
        return RefillRent.model_validate(refill_rent_raw)

    async def finish_refill_rent(self, user_id: int, rent_id: int) -> RefillRent:
        user_unfinished_rent = await self._refill_rent_repository.find_user_unfinished_rent(user_id)
        refill_rent_raw = await self._refill_rent_repository.finish_rent(rent_id)

        if not user_unfinished_rent or user_unfinished_rent.user_id != user_id or not refill_rent_raw:
            raise CannotFinishRentException

        return RefillRent.model_validate(refill_rent_raw)

    async def get_refill_info(self, refill_id: int) -> Refill:
        refill_raw = await self._refill_repository.find_refill_by_id(refill_id)

        if refill_raw is None:
            raise RefillWasNotFoundException

        return Refill.model_validate(refill_raw)

    async def create_new_refill(self, refill_create_data: RefillCreate, user: UserData) -> Refill:
        if user.role != 'admin':
            raise NotEnoughRightsException

        refill_raw = await self._refill_repository.insert_refill(refill_create_data.model_dump())
        return Refill.model_validate(refill_raw)

    async def delete_refill(self, refill_id: int, user: UserData) -> Refill:
        if user.role != 'admin':
            raise NotEnoughRightsException

        refill_raw = await self._refill_repository.find_refill_by_id(refill_id)
        if not refill_raw:
            raise RefillWasNotFoundException

        refill_raw = await self._refill_repository.delete_refill(refill_id)
        return Refill.model_validate(refill_raw)
