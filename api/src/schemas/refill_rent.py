from datetime import datetime

from pydantic import BaseModel, ConfigDict

__all__ = [
    "RefillRent"
]


class RefillRent(BaseModel):
    id: int
    user_id: int
    refill_id: int
    time_start: datetime
    time_end: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
