from src.repositories.interfaces import IRefillRepository, IRefillRentRepository

__all__ = [
    "RefillService"
]


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
