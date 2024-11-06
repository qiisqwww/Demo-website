from fastapi import FastAPI

from src.config import PROJECT_NAME, DOCS_URL, OPENAPI_URL
from src.presentation.catch_exception_middleware import catch_exception_middleware
from src.presentation.routers import root_router

__all__ = [
    "app_object"
]


app_object = FastAPI(
    title=PROJECT_NAME,
    docs_url=DOCS_URL,
    openapi_url=OPENAPI_URL
)

app_object.middleware("http")(catch_exception_middleware)
app_object.include_router(root_router)
