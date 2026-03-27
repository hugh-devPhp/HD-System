from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routers import auth, projects, writing, media, homepage
from database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HD Portfolio API",
    description="Backend API for HD (Hugues-Devallois) personal brand system",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4300", "http://localhost:4301"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(writing.router)
app.include_router(homepage.router)
app.include_router(media.router)


@app.get("/")
def root():
    return {
        "name": "HD Portfolio API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/api/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
