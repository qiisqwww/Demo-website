from pydantic import BaseModel

__all__ = [
    "RefillCreate"
]


class RefillCreate(BaseModel):
    address: str
    power: float
    is_active: bool
