from fastapi import APIRouter

from app.schema import ContactMessageSchema, ResponseSchema
from app.service.contact import ContactService

router = APIRouter(prefix="/contact", tags=["Contact"])


@router.post("/", response_model=ResponseSchema, response_model_exclude_none=True)
async def submit_message(request_body: ContactMessageSchema):
    result = await ContactService.submit_message(
        request_body.name, request_body.email, request_body.subject, request_body.message
    )
    return ResponseSchema(detail="Your message has been sent!", result=result)
