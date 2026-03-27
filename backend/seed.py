"""
Seed script — run once to bootstrap the database.
Usage: python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
from models.models import AdminUser, Project, Writing, HomepageContent
from services.auth_service import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ─── Admin User ────────────────────────────────────────────
existing = db.query(AdminUser).filter(AdminUser.email == "admin@hd.com").first()
if not existing:
    admin = AdminUser(
        email="admin@hd.com",
        hashed_password=hash_password("hd-admin-2024"),
        is_active=True
    )
    db.add(admin)
    print("✅ Admin user created: admin@hd.com / hd-admin-2024")
else:
    print("⚠️  Admin user already exists")

# ─── Homepage Content ──────────────────────────────────────
homepage_defaults = {
    "hero_title": "HD",
    "hero_subtitle": "Hugues-Devallois",
    "tagline": "Engineer of Systems. Writer of Stories.",
    "hero_intro": "I build software that works and write stories that matter. Two crafts. One vision.",
    "about_text": "I exist at the intersection of logic and imagination. By day, I architect systems that solve real problems with clean, scalable code. By night, I craft narratives that explore what it means to be human. This duality isn't a contradiction — it's the source of everything I create. Every system I build tells a story. Every story I write follows a system.",
    "contact_message": "Let's build something — or tell a story together.",
    "email": "contact@hugues-devallois.com",
    "whatsapp": "+33600000000",
}
for key, value in homepage_defaults.items():
    existing = db.query(HomepageContent).filter(HomepageContent.key == key).first()
    if not existing:
        db.add(HomepageContent(key=key, value=value))
print("✅ Homepage content seeded")

# ─── Sample Projects ───────────────────────────────────────
if db.query(Project).count() == 0:
    projects = [
        Project(
            title="CineTrack",
            description="A full-stack platform for tracking film production workflows, budgets, and crew scheduling. Built for indie filmmakers who need professional tools without the enterprise price tag.",
            tech_stack=["Angular", "FastAPI", "PostgreSQL", "Docker"],
            github_link="https://github.com/hd/cinetrack",
            live_demo_link="https://cinetrack.demo.com",
            featured=True,
            order=1
        ),
        Project(
            title="NarrativeOS",
            description="An AI-assisted story development tool that helps screenwriters structure their narratives using the Save the Cat beat sheet methodology.",
            tech_stack=["React", "Node.js", "OpenAI API", "MongoDB"],
            github_link="https://github.com/hd/narrativeos",
            featured=True,
            order=2
        ),
        Project(
            title="SysLog Dashboard",
            description="Real-time system monitoring dashboard with custom alerting rules, log aggregation, and performance analytics.",
            tech_stack=["Vue.js", "FastAPI", "Redis", "Grafana"],
            github_link="https://github.com/hd/syslog",
            featured=False,
            order=3
        ),
    ]
    for p in projects:
        db.add(p)
    print("✅ Sample projects seeded")

# ─── Sample Writing ────────────────────────────────────────
if db.query(Writing).count() == 0:
    writings = [
        Writing(
            title="PARALLAX",
            type="film_idea",
            excerpt="A surveillance analyst discovers that the terrorist she's been tracking for three years is herself — from a parallel timeline.",
            content="# PARALLAX\n\n**Genre:** Sci-Fi Thriller\n\n**Logline:** A surveillance analyst discovers that the terrorist she's been tracking for three years is herself — from a parallel timeline.\n\n## The Concept\n\nWe open on ELENA, 34, watching feeds. Always watching. She sees patterns where others see noise. But the pattern she's been tracking for 1,096 days leads somewhere she never expected: a mirror.\n\n## Act Structure\n\n**Act I:** Elena identifies a ghost — a figure who moves through the city's surveillance grid with impossible precision. Someone who knows exactly where every camera is.\n\n**Act II:** The investigation leads to evidence that predates Elena's own career. She begins to question not the timeline, but herself.\n\n**Act III:** The confrontation isn't with an enemy. It's with a version of herself who made different choices.",
            status="published",
            featured=True,
            order=1
        ),
        Writing(
            title="THE WEIGHT OF CLEAN CODE",
            type="article",
            excerpt="On the philosophical overlap between writing maintainable software and writing honest fiction.",
            content="# The Weight of Clean Code\n\nThere's a moment every programmer knows: you open a file you wrote six months ago and can't understand a single line of it.\n\nThere's a moment every writer knows: you read a paragraph you drafted last year and it feels like someone else wrote it.\n\nThese moments are the same.\n\nBoth are confrontations with your past self. Both reveal how much you've grown — and how much you failed to communicate your intent when it mattered.\n\nClean code, like honest prose, is an act of radical empathy. You are not writing for yourself. You are writing for the person — possibly yourself in six months — who will need to understand what you meant.\n\nThe variable name `x` is the novelist's 'he did the thing.' Both are technically precise and completely useless.",
            status="published",
            featured=True,
            order=2
        ),
        Writing(
            title="SIGNAL/NOISE",
            type="synopsis",
            excerpt="A sound engineer at a dying radio station receives transmissions that can only be heard by people who are about to die.",
            content="# SIGNAL/NOISE\n\n**Format:** Feature Film (97 min)\n**Genre:** Drama / Supernatural Thriller\n\n## Synopsis\n\nMARCO, 41, runs the night shift at WKND, a community radio station in a rust-belt city slowly forgetting it exists.\n\nOne night, between the static and the jazz, he hears something that shouldn't be there: a voice, clean as a signal in dead air, reading names.\n\nThe next morning, three of those names are in the obituaries.\n\nMarco tells no one. He starts recording.\n\nBy week three, he realizes the signal doesn't predict death — it announces it to people who need to hear it. People who haven't said goodbye. People who have unfinished business with the living.\n\nThe question isn't what the signal is. The question is: why can Marco hear it at all?",
            status="published",
            featured=False,
            order=3
        ),
    ]
    for w in writings:
        db.add(w)
    print("✅ Sample writing entries seeded")

db.commit()
db.close()
print("\n🎬 HD Portfolio database seeded successfully.")
print("   API docs: http://localhost:8000/api/docs")
