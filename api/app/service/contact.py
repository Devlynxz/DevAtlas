from uuid import uuid4

from fastapi import HTTPException

from app.repository.contact import ContactRepository
from app.utils import is_valid_email


class ContactService:

    @staticmethod
    async def submit_message(name: str, email: str, subject: str, message: str) -> dict:
        if not name.strip() or not subject.strip() or not message.strip():
            raise HTTPException(status_code=400, detail="Please fill in all fields.")
        if not is_valid_email(email):
            raise HTTPException(status_code=400, detail="Invalid email address!")

        await ContactRepository.create(
            id=str(uuid4()), name=name.strip(), email=email.strip(),
            subject=subject.strip(), message=message.strip(),
        )
        return {"name": name, "email": email}
