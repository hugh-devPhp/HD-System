# Dette technique — HD System

Liste des améliorations identifiées lors de la revue du projet (septembre 2026).
Cocher les éléments au fur et à mesure qu'ils sont traités.

---

## 🔴 Priorité haute — Sécurité

- [ ] **Brouillons exposés publiquement** — `GET /writing` sans paramètre `status` et `GET /writing/{id}` renvoient aussi les entrées `draft` (`backend/routers/writing.py`). Filtrer `status == "published"` par défaut côté public et exposer une route admin protégée pour lister tout.
- [ ] **XSS via upload SVG** — les SVG sont acceptés (`backend/routers/media.py`) et servis tels quels sur `/uploads`. Retirer le SVG, le nettoyer, ou le servir avec `Content-Disposition: attachment`.
- [ ] **Extension de fichier non contrôlée** — l'extension est prise du nom fourni par le client. La dériver du `content_type` validé, idéalement vérifier le contenu réel (Pillow).
- [ ] **Secrets avec valeurs par défaut** — `SECRET_KEY` / `REFRESH_SECRET_KEY` ont des valeurs par défaut dans `services/auth_service.py` et en dur dans `docker-compose.yml`. Faire échouer le démarrage si absents (`pydantic-settings`) et utiliser `env_file: backend/.env` dans le compose.
- [ ] **Refresh token sans vérification** — `/auth/refresh` ne vérifie pas que l'admin existe toujours ni qu'il est actif ; aucune révocation possible.
- [ ] **Pas de rate-limiting sur `/auth/login`** — ajouter une limite (ex. `slowapi`).
- [ ] **Identifiants admin en dur** — dans `seed.py` et affichés dans le README. Les lire depuis des variables d'environnement (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).

## 🟠 README désynchronisé du code

- [ ] **Ports** — le README indique 4200/4201 alors que `package.json`, `docker-compose.yml` et CORS utilisent 4300/4301.
- [ ] **CORS en dur** — `allow_origins` codé en dur dans `backend/main.py` ; le passer en variable d'environnement.
- [ ] **Portfolio servi en mode dev** — le README annonce nginx, mais `portfolio/Dockerfile` lance `ng serve`. Faire un build multi-stage nginx (comme l'admin) et réserver le montage de volume à un `docker-compose.override.yml` de dev.
- [ ] **Pas d'environnement prod pour l'admin** — créer `admin/src/environments/environment.prod.ts` avec `fileReplacements` dans `angular.json`.
- [ ] **Documentation** — `# HD-System` orphelin en fin de README ; `GET /writing/{id}` non documenté.

## 🟡 Backend — Qualité et maintenabilité

- [ ] **Migrations** — Alembic est dans `requirements.txt` mais inutilisé ; le schéma est créé par `Base.metadata.create_all` au démarrage. Initialiser Alembic.
- [ ] **Dépendances** — remplacer `python-jose` (peu maintenu) par `PyJWT` ; retirer `passlib` (inutilisé, `bcrypt` est appelé directement) ; remplacer `datetime.utcnow()` (déprécié) par `datetime.now(timezone.utc)`.
- [ ] **Validation** — `type` et `status` des writings sont de simples `String` ; utiliser des `Enum` Pydantic / SQLAlchemy.
- [ ] **Médias** — pas de route `DELETE /media/{filename}` ; fichier lu entièrement en mémoire avant contrôle de taille.
- [ ] **Pagination** — aucune sur les listes (`/projects`, `/writing`, `/media/list`).
- [ ] **Tests** — aucun. Ajouter `pytest` + `httpx`/`TestClient` avec une base de test (auth et CRUD en priorité).

## 🟢 Frontend

- [x] **Découpage des composants admin** — templates et styles inline (pages de 230 à 450 lignes) extraits en fichiers `.html` / `.css`.
- [ ] **Découpage du portfolio inachevé** — seul `navbar` utilise ses fichiers `.html` / `.scss` ; `about`, `contact`, `hero`, `projects`, `stories` ont encore leur template/style inline (les fichiers externes existent mais ne sont pas référencés).
- [ ] **`[innerHTML]`** dans `portfolio/.../about.component.ts` — vérifier le formatage du texte (Angular assainit, mais à contrôler).
- [ ] **SEO** — portfolio sans SSR/prérendu ni balises meta / Open Graph. Envisager Angular SSR.
- [ ] **Page de détail d'un écrit** — pas de route `/stories/:id` pour lire un texte complet, avec rendu Markdown.

## ⚙️ Outillage

- [ ] **CI** — GitHub Action : lint, tests, builds Angular + Python.
- [ ] **Qualité de code** — `ruff` (Python), ESLint + Prettier (Angular), `pre-commit`.
- [ ] **Branches** — travail sur `master` alors que la branche principale est `main` : réunifier.
