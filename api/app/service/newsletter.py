from uuid import uuid4

from fastapi import HTTPException

from app.repository.newsletter import NewsletterRepository
from app.utils import is_valid_email


class NewsletterService:

    @staticmethod
    async def subscribe(email: str) -> dict:
        if not is_valid_email(email):
            raise HTTPException(status_code=400, detail="Invalid email address!")

        existing = await NewsletterRepository.find_by_email(email)
        if existing:
            raise HTTPException(status_code=400, detail="This email is already subscribed!")

        await NewsletterRepository.create(id=str(uuid4()), email=email)
        return {"email": email}
