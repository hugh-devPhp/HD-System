# HD — Hugues-Devallois · Personal Brand System

> **Engineer of Systems. Writer of Stories.**

A complete, production-ready full-stack digital ecosystem for a dual-identity personal brand:
a software engineer who writes screenplays.

---

## Architecture Overview

```
hd-system/
├── backend/          FastAPI · Python 3.12 · PostgreSQL
├── portfolio/        Angular 19 · Public Portfolio (port 4300)
├── admin/            Angular 19 · Private CMS Dashboard (port 4301)
├── docker-compose.yml
└── DETTE_TECHNIQUE.md  Known technical debt & planned improvements
```

**Data flow:**
```
Admin Dashboard  ──POST/PUT──▶  FastAPI  ──SQL──▶  PostgreSQL
                                   │
Public Portfolio ──GET──────────▶  FastAPI
```

Everything is live and data-driven. Content created in the admin instantly appears on the portfolio.

---

## Quick Start (Docker — Recommended)

### Prerequisites
- Docker & Docker Compose installed

### 1. Clone and configure
```bash
cd hd-system
cp backend/.env.example backend/.env
# Edit backend/.env with your secret keys
```

### 2. Launch everything
```bash
docker-compose up --build
```

| Service    | URL                        |
|------------|----------------------------|
| Portfolio  | http://localhost:4300       |
| Admin      | http://localhost:4301       |
| API        | http://localhost:8000       |
| API Docs   | http://localhost:8000/api/docs |

> The API container runs `seed.py` on every start (idempotent: creates tables, admin user and sample content if missing).
> The `portfolio` container currently runs the Angular **dev server** (`ng serve`) with the source mounted as a volume;
> the `admin` container serves a production build through nginx.

### 3. Login to Admin
```
Email:    admin@hd.com
Password: hd-admin-2024
```
⚠️ Change these credentials immediately in `backend/seed.py` before production.

---

## Local Development (Without Docker)

### Backend (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and secrets

# Run PostgreSQL (or use Docker just for DB)
docker run -d \
  --name hd_postgres \
  -e POSTGRES_USER=hd_user \
  -e POSTGRES_PASSWORD=hd_password \
  -e POSTGRES_DB=hd_portfolio \
  -p 5432:5432 \
  postgres:16-alpine

# Seed database (creates tables + admin user + sample content)
python seed.py

# Start dev server
uvicorn main:app --reload --port 8000
```

### Portfolio (Angular 19)

```bash
cd portfolio
npm install
npm start        # Runs on http://localhost:4300
```

### Admin (Angular 19)

```bash
cd admin
npm install
npm start        # Runs on http://localhost:4301
```

> CORS in `backend/main.py` only allows `http://localhost:4300` and `http://localhost:4301`.

---

## API Reference

All admin endpoints require `Authorization: Bearer <token>` header.

### Authentication
| Method | Endpoint         | Auth | Description        |
|--------|-----------------|------|--------------------|
| POST   | /auth/login     | ✗    | Login, get tokens  |
| POST   | /auth/refresh   | ✗    | Refresh tokens     |

### Projects
| Method | Endpoint           | Auth | Description        |
|--------|--------------------|------|--------------------|
| GET    | /projects          | ✗    | List all projects  |
| GET    | /projects?featured=true | ✗ | Featured only    |
| GET    | /projects/{id}     | ✗    | Get one project    |
| POST   | /projects          | ✓    | Create project     |
| PUT    | /projects/{id}     | ✓    | Update project     |
| DELETE | /projects/{id}     | ✓    | Delete project     |

### Writing
| Method | Endpoint           | Auth | Description        |
|--------|--------------------|------|--------------------|
| GET    | /writing           | ✗    | List all entries (drafts included) |
| GET    | /writing?status=published | ✗ | Published only |
| GET    | /writing?type=film_idea   | ✗ | By type        |
| GET    | /writing?featured=true    | ✗ | Featured only  |
| GET    | /writing/{id}      | ✗    | Get one entry (any status) |
| POST   | /writing           | ✓    | Create entry       |
| PUT    | /writing/{id}      | ✓    | Update entry       |
| DELETE | /writing/{id}      | ✓    | Delete entry       |

### Homepage
| Method | Endpoint    | Auth | Description              |
|--------|-------------|------|--------------------------|
| GET    | /homepage   | ✗    | Get all content fields   |
| PUT    | /homepage   | ✓    | Bulk update content      |

### Media
| Method | Endpoint        | Auth | Description        |
|--------|-----------------|------|--------------------|
| POST   | /media/upload   | ✓    | Upload image file  |
| GET    | /media/list     | ✓    | List uploaded files|

---

## Admin Dashboard — Features

### Authentication
- JWT access + refresh token pair
- Auto-refresh on 401 (via Angular HTTP interceptor)
- Auth guard on all protected routes

### Dashboard Overview
- Live stats: project count, writing entries, featured items, published stories
- Quick action cards: New Project, New Story, Edit Homepage, Upload Media
- Recent items panels with live status

### Projects Management
- Full CRUD with modal forms
- Table view + card grid view toggle
- Live search filtering
- Tech stack tag input (press Enter or comma to add)
- Featured toggle with visual indicator
- GitHub & live demo link fields

### Writing Management
- Full CRUD with large modal editor
- Lightweight Markdown editor with toolbar (Bold, Italic, H1, H2, List)
- Type filter: Film Idea / Script / Synopsis / Article
- Status filter: Draft / Published
- One-click status toggle (Draft ↔ Published)
- Featured toggle

### Homepage Editor
- Edit all public-facing text fields live
- Side-by-side live preview panel
- Sections: Hero, About, Contact
- Single "Save All" action

### Media Manager
- Drag & drop image upload zone
- Upload progress indicator per file
- Image grid with hover-to-copy URL
- Supports JPEG, PNG, WebP, GIF, SVG up to 10MB

---

## Portfolio Website

### Routes

| Route          | Page          | Notes                                                    |
|----------------|---------------|----------------------------------------------------------|
| `/`            | Home          | All sections below; navbar links use `/#section` anchors |
| `/stories/:id` | Story detail  | Full text rendered from Markdown; drafts → "not found"   |

### Home — Sections

| Section     | Content source         | Notes                          |
|-------------|------------------------|--------------------------------|
| Hero        | `/homepage` API        | Title, tagline, intro text     |
| About       | `/homepage` API        | Narrative bio text             |
| Projects    | `/projects` API        | All projects, grid layout      |
| Stories     | `/writing?status=published` API | Filterable by type, each card links to its detail page |
| Contact     | `/homepage` API        | Email + WhatsApp buttons       |

### Server-Side Rendering & SEO

The portfolio uses **Angular SSR** (rendered on each request, no prerendering, so CMS changes show up immediately):

- Each page sets its own `<title>`, description, Open Graph tags and canonical URL (`SeoService`).
  Unknown or unpublished stories are marked `noindex`.
- The SSR server (`src/server.ts`) also serves `/robots.txt` and a dynamic `/sitemap.xml`
  (home + every published story).
- Absolute URLs use `siteUrl` from `src/environments/`.
- `API_INTERNAL_URL` (optional) lets the server reach the API through a different URL than the browser
  (e.g. `http://api:8000` inside Docker); the browser reuses the server's responses via the HTTP transfer cache.

---

## Visual Identity

| Token       | Value                     |
|-------------|---------------------------|
| Brand Red   | `#D4001A`                 |
| Background  | `#080808` (void black)    |
| Surface     | `#111111`                 |
| Display font| Bebas Neue                |
| Body font   | Outfit                    |
| Mono font   | DM Mono                   |

The portfolio defaults to the dark theme and offers a **light theme** toggle in the navbar
(`ThemeService`, persisted in `localStorage` under `hd-theme`, applied via `data-theme` on `<html>`).

---

## Writing Types

| Type       | Value      | Description                    |
|------------|------------|--------------------------------|
| Film Idea  | `film_idea`| High-concept premise or pitch  |
| Script     | `script`   | Full or partial screenplay     |
| Synopsis   | `synopsis` | Story outline / treatment      |
| Article    | `article`  | Essays, think-pieces           |

---

## Production Deployment

### Security Checklist
- [ ] Change `SECRET_KEY` and `REFRESH_SECRET_KEY` in `.env`
- [ ] Change admin email/password in `seed.py`
- [ ] Set `POSTGRES_PASSWORD` to a strong password
- [ ] Configure CORS `allow_origins` in `main.py` to your actual domains
- [ ] Use HTTPS (Caddy, nginx + certbot, or a cloud provider)
- [ ] Consider cloud storage (S3) for media uploads in production

### Environment Variables (Production)
```env
DATABASE_URL=postgresql://user:strongpassword@db-host:5432/hd_portfolio
SECRET_KEY=<64-char-random-string>
REFRESH_SECRET_KEY=<different-64-char-random-string>
```

### Frontend Production Builds
```bash
# Portfolio — update apiUrl and siteUrl in src/environments/environment.prod.ts first
cd portfolio && npm run build
# SSR build: run it with Node (not as static files), default port 4000
PORT=4000 API_INTERNAL_URL=<api-url-reachable-from-server> npm run serve:ssr:portfolio

# Admin — update src/environments/environment.ts with your API URL
cd admin && npm run build
```

---

## Tech Stack Summary

| Layer       | Technology              | Version   |
|-------------|-------------------------|-----------|
| API         | FastAPI                 | 0.115     |
| Runtime     | Python                  | 3.12      |
| ORM         | SQLAlchemy              | 2.0       |
| Database    | PostgreSQL              | 16        |
| Auth        | python-jose (JWT)       | 3.3       |
| Frontend    | Angular                 | 19        |
| SSR         | Angular SSR + Express   | 19 / 4    |
| Markdown    | marked                  | 15        |
| Language    | TypeScript              | 5.6       |
| State       | Angular Signals         | native    |
| HTTP        | Angular HttpClient      | native    |
| Styling     | CSS Custom Properties   | native    |
| Container   | Docker + Docker Compose | latest    |
| Web server  | nginx (Alpine) — admin  | latest    |

---

## File Structure

```
hd-system/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── database.py                # SQLAlchemy engine + session
│   ├── seed.py                    # DB bootstrap script
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── models/
│   │   └── models.py              # Project, Writing, HomepageContent, AdminUser
│   ├── schemas/
│   │   └── schemas.py             # Pydantic request/response models
│   ├── routers/
│   │   ├── auth.py                # POST /auth/login, /auth/refresh
│   │   ├── projects.py            # CRUD /projects
│   │   ├── writing.py             # CRUD /writing
│   │   ├── homepage.py            # GET/PUT /homepage
│   │   └── media.py               # POST /media/upload
│   ├── services/
│   │   └── auth_service.py        # JWT encode/decode, password hashing
│   └── uploads/                   # Uploaded media files
│
├── portfolio/                     # Public-facing Angular 19 app
│   ├── src/
│   │   ├── main.ts
│   │   ├── main.server.ts         # SSR bootstrap
│   │   ├── server.ts              # Express SSR server + robots.txt / sitemap.xml
│   │   ├── index.html
│   │   ├── styles.css             # Global dark cinematic theme
│   │   ├── environments/          # apiUrl + siteUrl
│   │   └── app/
│   │       ├── app.component.ts   # Navbar + router outlet
│   │       ├── app.config.ts
│   │       ├── app.config.server.ts   # Server-only providers (API_INTERNAL_URL)
│   │       ├── app.routes.ts      # / and /stories/:id
│   │       ├── pages/             # Each: .ts + .html + .scss
│   │       │   ├── home/          # Loads content, hosts the sections
│   │       │   └── story-detail/  # Full story, Markdown rendering
│   │       ├── services/
│   │       │   ├── portfolio-api.service.ts
│   │       │   ├── seo.service.ts         # Title, meta, Open Graph, canonical
│   │       │   ├── api-url.token.ts       # Server-side API URL token
│   │       │   └── theme.service.ts       # Dark / light theme toggle
│   │       └── components/            # Each: .ts + .html + .scss
│   │           ├── navbar/
│   │           ├── hero/
│   │           ├── about/
│   │           ├── projects/
│   │           ├── stories/
│   │           └── contact/
│   ├── public/assets/hd-logo.png
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── admin/                         # Private Angular 19 CMS
│   ├── src/
│   │   ├── main.ts
│   │   ├── index.html
│   │   ├── styles.css             # Admin UI design system
│   │   ├── environments/
│   │   └── app/
│   │       ├── app.component.ts
│   │       ├── app.config.ts
│   │       ├── app.routes.ts      # Lazy-loaded protected routes
│   │       ├── guards/
│   │       │   └── auth.guard.ts
│   │       ├── interceptors/
│   │       │   └── auth.interceptor.ts   # JWT + auto-refresh
│   │       ├── services/
│   │       │   ├── auth.service.ts
│   │       │   ├── admin-api.service.ts
│   │       │   └── toast.service.ts
│   │       ├── components/            # Each: .ts + .html + .css
│   │       │   ├── sidebar/
│   │       │   └── topbar/
│   │       └── pages/                 # Each: .ts + .html + .css
│   │           ├── login/
│   │           ├── dashboard/
│   │           ├── projects/
│   │           ├── writing/
│   │           ├── homepage/
│   │           └── media/
│   ├── public/assets/hd-logo.png
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml
├── .gitignore
├── DETTE_TECHNIQUE.md
└── README.md
```

---

## Technical Debt

Known issues and planned improvements (security, README/code drift, backend, frontend, tooling)
are tracked in [DETTE_TECHNIQUE.md](DETTE_TECHNIQUE.md).

---

*HD Portfolio System · Built with precision · © Hugues-Devallois*
