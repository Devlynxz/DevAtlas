from sqlalchemy.future import select

from app.config import db
from app.model import NewsletterSubscriber
from app.repository.base_repo import BaseRepo


class NewsletterRepository(BaseRepo):
    model = NewsletterSubscriber

    @staticmethod
    async def find_by_email(email: str):
        query = select(NewsletterSubscriber).where(NewsletterSubscriber.email == email)
        return (await db.execute(query)).scalar_one_or_none()
