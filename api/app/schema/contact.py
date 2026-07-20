from pydantic import BaseModel


class ContactMessageSchema(BaseModel):
    name: str
    email: str
    subject: str
    message: str
