# Deployment

This document describes the production layout used by AVRO.

## Website

The web application is deployed from the repository root.

- Production: `https://avroprotocol.com`
- Docs: `https://avroprotocol.com/docs`
- Public launch config: `public/config.json`

Typical frontend environment values:

```env
VITE_SITE_URL=https://avroprotocol.com
VITE_API_URL=https://api.avroprotocol.com
VITE_BACKEND_URL=https://api.avroprotocol.com
```

## API

The backend lives in `backend/` and is deployed separately.

- Production: `https://api.avroprotocol.com`
- Vercel root directory: `backend`

Minimum production configuration includes the database, chain RPC, signing encryption material, authentication secrets, allowed origins, and application URL. Use `backend/.env.example` as the reference and store real secrets only in the deployment environment.

Never commit production secrets to the repository.

## Android

The Android client can override the backend origin with:

```env
EXPO_PUBLIC_AVRO_API_URL=https://api.avroprotocol.com
```

## Releases

Desktop releases are built by `.github/workflows/desktop-release.yml`.

Android APKs are built by `.github/workflows/android.yml`.

Published clients are exposed through branded download routes:

```text
https://api.avroprotocol.com/v1/downloads/android
https://api.avroprotocol.com/v1/downloads/windows
https://api.avroprotocol.com/v1/downloads/macos
https://api.avroprotocol.com/v1/downloads/linux
```
