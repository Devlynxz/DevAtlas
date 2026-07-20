from typing import Optional

from pydantic import BaseModel


class ProfileUpdateSchema(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    social_github: Optional[str] = None
    social_linkedin: Optional[str] = None
    social_twitter: Optional[str] = None
    social_website: Optional[str] = None
