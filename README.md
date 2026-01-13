# StreamBox (Netflix-like Movie Catalog)

A clean, modern, dark-themed movie streaming catalog with:

- Clean URLs (e.g. `/movie/12`)
- Movie detail pages with trailer + cast
- Admin CMS: add/edit/delete movies, manage cast
- SQLite storage (PDO)
- Secure-by-default basics: prepared statements, output escaping, CSRF protection, admin session auth

## Folder structure

```
assets/              # Static CSS/JS
backend/
  public/            # PHP front controller (router)
  src/               # App code (controllers, repositories, core)
  database/          # schema.sql + SQLite file (created at runtime)
frontend/
  views/             # PHP view templates (reusable partials)
```

## Running locally

1. Copy env

```bash
cp .env.example .env
```

2. Start the PHP built-in server (recommended docroot is project root so `/assets` is served directly)

```bash
php -S localhost:8000 -t . backend/public/index.php
```

3. Visit

- Public site: http://localhost:8000/
- Admin: http://localhost:8000/admin

### Admin credentials

Configured via `.env`:

- `ADMIN_USER` (default: `admin`)
- `ADMIN_PASSWORD` (default: `admin123`)

For production, set `ADMIN_PASSWORD_HASH` (use `password_hash()`), and remove `ADMIN_PASSWORD`.

## Database

The SQLite database file will be created automatically on first run:

- Default path: `backend/database/app.sqlite` (configurable via `DB_PATH`)

Schema: `backend/database/schema.sql`

## Notes for production

- Serve `/assets` directly via a web server/CDN.
- Run behind PHP-FPM (Nginx/Apache) with HTTPS.
- Configure a strong `ADMIN_PASSWORD_HASH`.
