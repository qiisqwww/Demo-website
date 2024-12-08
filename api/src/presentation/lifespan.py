from fastapi import FastAPI

from contextlib import asynccontextmanager
import asyncio

__all__ = [
    "lifespan"
]


@asynccontextmanager
async def lifespan(_: FastAPI):
    process = await asyncio.create_subprocess_exec(
        'alembic', 'upgrade', 'head',
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    _, _ = await process.communicate()

    yield
