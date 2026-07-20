import os
import re
from typing import Awaitable, Callable
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile
from slugify import slugify

ALLOWED_IMAGE_TYPES = {"image/png", "image/jpeg", "image/webp"}
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
DEFAULT_AVATAR_PATH = "/media/avatars/default.png"

_EMAIL_REGEX = re.compile(r"^\S+@\S+\.\S+$")


def is_valid_email(email: str) -> bool:
    return bool(_EMAIL_REGEX.match(email))


async def save_uploaded_image(upload_file: UploadFile, directory: str) -> str:
    if upload_file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only PNG, JPEG, or WEBP images are allowed!")

    content = await upload_file.read()
    if len(content) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="Image must be smaller than 5MB.")
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    extension = upload_file.filename.rsplit(".", 1)[-1].lower()
    filename = f"{uuid4()}.{extension}"
    os.makedirs(directory, exist_ok=True)
    file_path = os.path.join(directory, filename)

    async with aiofiles.open(file_path, "wb") as out_file:
        await out_file.write(content)

    return f"/{directory}/{filename}"


def delete_uploaded_file_if_owned(file_path: str, directory: str, protected_filenames=frozenset()) -> None:
    """Remove a previously uploaded file from disk, skipping shared/protected filenames."""
    if not file_path:
        return
    filename = os.path.basename(file_path)
    if filename in protected_filenames:
        return
    full_path = os.path.join(directory, filename)
    if os.path.commonpath([os.path.abspath(full_path), os.path.abspath(directory)]) == os.path.abspath(directory):
        try:
            os.remove(full_path)
        except OSError:
            pass


async def generate_unique_slug(text: str, exists_fn: Callable[[str], Awaitable[bool]]) -> str:
    base_slug = slugify(text)
    slug = base_slug
    suffix = 2
    while await exists_fn(slug):
        slug = f"{base_slug}-{suffix}"
        suffix += 1
    return slug


def compute_reading_time(markdown_text: str) -> int:
    word_count = len(markdown_text.split())
    return max(1, round(word_count / 200))
