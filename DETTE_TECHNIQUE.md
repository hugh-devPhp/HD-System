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

- [x] **Ports** — le README indique désormais 4300/4301 comme `package.json`, `docker-compose.yml` et CORS.
- [ ] **CORS en dur** — `allow_origins` codé en dur dans `backend/main.py` ; le passer en variable d'environnement.
- [ ] **Portfolio servi en mode dev** — `portfolio/Dockerfile` lance `ng serve`. Avec le SSR, l'image de prod doit être un build multi-stage qui lance `node dist/portfolio/server/server.mjs` ; réserver le montage de volume à un `docker-compose.override.yml` de dev.
- [ ] **Pas d'environnement prod pour l'admin** — créer `admin/src/environments/environment.prod.ts` avec `fileReplacements` dans `angular.json`.
- [x] **Documentation** — `# HD-System` orphelin retiré ; `GET /projects/{id}`, `GET /writing/{id}` et `?featured=` documentés ; thème clair, découpage des composants et comportement réel des conteneurs décrits.

## 🟡 Backend — Qualité et maintenabilité

- [ ] **Migrations** — Alembic est dans `requirements.txt` mais inutilisé ; le schéma est créé par `Base.metadata.create_all` au démarrage. Initialiser Alembic.
- [ ] **Dépendances** — remplacer `python-jose` (peu maintenu) par `PyJWT` ; retirer `passlib` (inutilisé, `bcrypt` est appelé directement) ; remplacer `datetime.utcnow()` (déprécié) par `datetime.now(timezone.utc)`.
- [ ] **Validation** — `type` et `status` des writings sont de simples `String` ; utiliser des `Enum` Pydantic / SQLAlchemy.
- [ ] **Médias** — pas de route `DELETE /media/{filename}` ; fichier lu entièrement en mémoire avant contrôle de taille.
- [ ] **Pagination** — aucune sur les listes (`/projects`, `/writing`, `/media/list`).
- [ ] **Tests** — aucun. Ajouter `pytest` + `httpx`/`TestClient` avec une base de test (auth et CRUD en priorité).

## 🟢 Frontend

- [x] **Découpage des composants admin** — templates et styles inline (pages de 230 à 450 lignes) extraits en fichiers `.html` / `.css`.
- [x] **Découpage du portfolio** — `about`, `contact`, `hero`, `projects`, `stories` utilisent désormais leurs fichiers `.html` / `.scss` (comme `navbar`).
- [x] **`[innerHTML]`** dans `about` — le `style` inline (supprimé par le sanitizer) remplacé par du CSS ; conteneur `<p>` → `<div>` (paragraphes imbriqués invalides, cassaient l'hydratation SSR).
- [x] **SEO** — Angular SSR (rendu à la requête), title/meta/Open Graph/canonical par page, `robots.txt` et `sitemap.xml` dynamiques.
- [x] **Page de détail d'un écrit** — route `/stories/:id` avec rendu Markdown (`marked`) ; les brouillons affichent « not found » côté front.
- [ ] **Déploiement SSR du portfolio** — le build produit désormais un serveur Node (`npm run serve:ssr:portfolio`) : le Dockerfile de prod doit lancer ce serveur (et non nginx en statique). Vérifier `siteUrl` dans `environment.prod.ts` (valeur supposée : `https://hugues-devallois.com`).
- [ ] **Vraie 404 HTTP** — une page d'écrit inconnue renvoie un statut 200 (marquée `noindex`) ; renvoyer un 404 côté serveur.

## ⚙️ Outillage

- [ ] **CI** — GitHub Action : lint, tests, builds Angular + Python.
- [ ] **Qualité de code** — `ruff` (Python), ESLint + Prettier (Angular), `pre-commit`.
- [ ] **Branches** — travail sur `master` alors que la branche principale est `main` : réunifier.
