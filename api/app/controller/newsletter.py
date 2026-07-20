from fastapi import APIRouter

from app.schema import NewsletterSubscribeSchema, ResponseSchema
from app.service.newsletter import NewsletterService

router = APIRouter(prefix="/newsletter", tags=["Newsletter"])


@router.post("/subscribe", response_model=ResponseSchema, response_model_exclude_none=True)
async def subscribe(request_body: NewsletterSubscribeSchema):
    result = await NewsletterService.subscribe(request_body.email)
    return ResponseSchema(detail="Successfully subscribed!", result=result)
