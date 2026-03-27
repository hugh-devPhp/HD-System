from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.models import Writing
from schemas.schemas import WritingCreate, WritingUpdate, WritingOut
from services.auth_service import get_current_admin

router = APIRouter(prefix="/writing", tags=["Writing"])


@router.get("", response_model=List[WritingOut])
def get_writings(
    status: Optional[str] = None,
    type: Optional[str] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Writing)
    if status:
        query = query.filter(Writing.status == status)
    if type:
        query = query.filter(Writing.type == type)
    if featured is not None:
        query = query.filter(Writing.featured == featured)
    return query.order_by(Writing.order.asc(), Writing.created_at.desc()).all()


@router.get("/{writing_id}", response_model=WritingOut)
def get_writing(writing_id: int, db: Session = Depends(get_db)):
    writing = db.query(Writing).filter(Writing.id == writing_id).first()
    if not writing:
        raise HTTPException(status_code=404, detail="Writing not found")
    return writing


@router.post("", response_model=WritingOut)
def create_writing(
    data: WritingCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin)
):
    writing = Writing(**data.model_dump())
    db.add(writing)
    db.commit()
    db.refresh(writing)
    return writing


@router.put("/{writing_id}", response_model=WritingOut)
def update_writing(
    writing_id: int,
    data: WritingUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin)
):
    writing = db.query(Writing).filter(Writing.id == writing_id).first()
    if not writing:
        raise HTTPException(status_code=404, detail="Writing not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(writing, field, value)
    db.commit()
    db.refresh(writing)
    return writing


@router.delete("/{writing_id}")
def delete_writing(
    writing_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin)
):
    writing = db.query(Writing).filter(Writing.id == writing_id).first()
    if not writing:
        raise HTTPException(status_code=404, detail="Writing not found")
    db.delete(writing)
    db.commit()
    return {"message": "Writing deleted successfully"}
