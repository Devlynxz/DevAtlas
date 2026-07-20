from fastapi import APIRouter, Depends

from app.dependencies import require_admin
from app.schema import CategoryCreate, ResponseSchema
from app.service.category import CategoryService

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("/", response_model=ResponseSchema, response_model_exclude_none=True)
async def list_categories():
    result = await CategoryService.list_categories()
    return ResponseSchema(detail="Successfully fetch data!", result=result)


@router.get("/{slug}", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_category(slug: str):
    result = await CategoryService.get_by_slug(slug)
    return ResponseSchema(detail="Successfully fetch data!", result=result)


@router.post("/", response_model=ResponseSchema, response_model_exclude_none=True, dependencies=[Depends(require_admin)])
async def create_category(request_body: CategoryCreate):
    result = await CategoryService.create_category(request_body.name, request_body.description)
    return ResponseSchema(detail="Successfully created category!", result=result)
