from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ─── AUTH ──────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


# ─── PROJECTS ──────────────────────────────────────────────
class ProjectBase(BaseModel):
    title: str
    description: str
    tech_stack: List[str] = []
    github_link: Optional[str] = None
    live_demo_link: Optional[str] = None
    featured: bool = False
    images: List[str] = []
    order: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    github_link: Optional[str] = None
    live_demo_link: Optional[str] = None
    featured: Optional[bool] = None
    images: Optional[List[str]] = None
    order: Optional[int] = None


class ProjectOut(ProjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── WRITING ───────────────────────────────────────────────
class WritingBase(BaseModel):
    title: str
    type: str  # film_idea | script | synopsis | article
    content: str
    excerpt: Optional[str] = None
    status: str = "draft"
    featured: bool = False
    cover_image: Optional[str] = None
    order: int = 0


class WritingCreate(WritingBase):
    pass


class WritingUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    status: Optional[str] = None
    featured: Optional[bool] = None
    cover_image: Optional[str] = None
    order: Optional[int] = None


class WritingOut(WritingBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── HOMEPAGE ──────────────────────────────────────────────
class HomepageContentItem(BaseModel):
    key: str
    value: str


class HomepageContentOut(HomepageContentItem):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class HomepageContentBulkUpdate(BaseModel):
    items: List[HomepageContentItem]


# ─── MEDIA ─────────────────────────────────────────────────
class MediaUploadResponse(BaseModel):
    url: str
    filename: str
    size: int
