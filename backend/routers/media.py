import os
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from schemas.schemas import MediaUploadResponse
from services.auth_service import get_current_admin

router = APIRouter(prefix="/media", tags=["Media"])

UPLOAD_DIR = "uploads"
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}
MAX_SIZE = 10 * 1024 * 1024  # 10MB

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=MediaUploadResponse)
async def upload_media(
    file: UploadFile = File(...),
    _=Depends(get_current_admin)
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="File type not allowed. Use JPEG, PNG, WebP, GIF, or SVG.")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")

    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(content)

    return MediaUploadResponse(
        url=f"/uploads/{filename}",
        filename=filename,
        size=len(content)
    )


@router.get("/list")
def list_media(_=Depends(get_current_admin)):
    files = []
    for fname in os.listdir(UPLOAD_DIR):
        fpath = os.path.join(UPLOAD_DIR, fname)
        if os.path.isfile(fpath):
            files.append({
                "filename": fname,
                "url": f"/uploads/{fname}",
                "size": os.path.getsize(fpath)
            })
    return files
