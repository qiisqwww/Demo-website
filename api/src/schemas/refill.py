from pydantic import BaseModel, ConfigDict

__all__ = [
    "Refill"
]


class Refill(BaseModel):
    id: int
    address: str
    power: float
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
