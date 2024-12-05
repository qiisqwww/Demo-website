from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime

from src.models.declarative_base import Base

__all__ = [
    "Refill"
]


class Refill(Base):
    __tablename__ = "refill"

    id: int = Column(Integer, primary_key=True, unique=True)
    address: str = Column(String(length=255), nullable=False)
    power: float = Column(Float, nullable=False)
    is_active: bool = Column(Boolean, nullable=False, default=True)
