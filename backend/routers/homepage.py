from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.models import HomepageContent
from schemas.schemas import HomepageContentOut, HomepageContentBulkUpdate
from services.auth_service import get_current_admin

router = APIRouter(prefix="/homepage", tags=["Homepage"])

DEFAULT_CONTENT = {
    "hero_title": "HD",
    "hero_subtitle": "Hugues-Devallois",
    "tagline": "Engineer of Systems. Writer of Stories.",
    "hero_intro": "I build software that works and write stories that matter. Two crafts. One vision.",
    "about_text": "I exist at the intersection of logic and imagination. By day, I architect systems that solve real problems. By night, I craft stories that explore what it means to be human. This duality isn't a contradiction — it's the source of everything I create.",
    "contact_message": "Let's build something — or tell a story together.",
    "email": "contact@hugues-devallois.com",
    "whatsapp": "+33600000000",
}


@router.get("", response_model=List[HomepageContentOut])
def get_homepage_content(db: Session = Depends(get_db)):
    items = db.query(HomepageContent).all()

    # Seed defaults if empty
    if not items:
        for key, value in DEFAULT_CONTENT.items():
            item = HomepageContent(key=key, value=value)
            db.add(item)
        db.commit()
        items = db.query(HomepageContent).all()

    return items


@router.put("", response_model=List[HomepageContentOut])
def update_homepage_content(
    data: HomepageContentBulkUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin)
):
    for item in data.items:
        existing = db.query(HomepageContent).filter(HomepageContent.key == item.key).first()
        if existing:
            existing.value = item.value
        else:
            db.add(HomepageContent(key=item.key, value=item.value))
    db.commit()
    return db.query(HomepageContent).all()
