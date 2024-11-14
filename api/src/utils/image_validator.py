from fastapi import UploadFile
from PIL import Image

from io import BytesIO

__all__ = [
    "ImageValidator"
]


class ImageValidator:
    _image: UploadFile
    filetype: str = None
    image_bytes: bytes = None

    def __init__(self, image: UploadFile) -> None:
        self._image = image

    def validate_size(self) -> bool:
        return self._image.size <= 8 * 1024 * 1024

    def validate_filetype(self) -> bool:
        filetype = self._image.filename.split('.')[-1]
        if filetype in ('jpg', 'jpeg', 'png', 'svg'):
            self.filetype = filetype
            return True

        return False

    async def validate_aspect_ratio(self) -> bool:
        self.image_bytes = await self._image.read()
        width, height = Image.open(BytesIO(self.image_bytes)).size

        aspect_ratio = width/height
        for ratio in ((4, 3), (1, 1)):
            if abs(aspect_ratio - (ratio[0] / ratio[1])) < 0.01:  # погрешность
                return True

        return False
