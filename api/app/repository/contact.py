from app.model import ContactMessage
from app.repository.base_repo import BaseRepo


class ContactRepository(BaseRepo):
    model = ContactMessage
