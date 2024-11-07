from fastapi import Request
from fastapi.responses import JSONResponse

__all__ = [
    "catch_exception_middleware",
]


async def catch_exception_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        print(e)
        return JSONResponse({"detail": "Internal server error"},
                            status_code=500)
