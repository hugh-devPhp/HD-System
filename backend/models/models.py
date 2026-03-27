from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(JSONB, default=[])  # list of strings
    github_link = Column(String(500), nullable=True)
    live_demo_link = Column(String(500), nullable=True)
    featured = Column(Boolean, default=False)
    images = Column(JSONB, default=[])  # list of image URLs
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Writing(Base):
    __tablename__ = "writings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    type = Column(String(50), nullable=False)  # film_idea | script | synopsis | article
    content = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=True)
    status = Column(String(20), default="draft")  # draft | published
    featured = Column(Boolean, default=False)
    cover_image = Column(String(500), nullable=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class HomepageContent(Base):
    __tablename__ = "homepage_content"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False)  # hero_title, tagline, about_text, etc.
    value = Column(Text, nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(200), unique=True, nullable=False)
    hashed_password = Column(String(500), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
