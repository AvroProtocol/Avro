# Avyro Protocol domain setup

The canonical production domain for this repository is **avyroprotocol.com**.

## Production origins

- Website: `https://avyroprotocol.com`
- API / co-signer: `https://api.avyroprotocol.com`
- Recommended www alias: `https://www.avyroprotocol.com` -> redirect to `https://avyroprotocol.com`
- Security contact: `security@avyroprotocol.com`

## Frontend environment

```env
VITE_SITE_URL=https://avyroprotocol.com
VITE_API_URL=https://api.avyroprotocol.com
VITE_BACKEND_URL=https://api.avyroprotocol.com
```

## Backend environment

```env
PUBLIC_APP_URL=https://avyroprotocol.com
CORS_ALLOWED_ORIGINS=https://avyroprotocol.com,https://www.avyroprotocol.com
```

## Android environment

```env
EXPO_PUBLIC_AVYRO_API_URL=https://api.avyroprotocol.com
```

The source contains production fallbacks for the website and API, so the project remains pointed at the AVYRO domains when these optional overrides are not supplied. DNS still needs to be connected at the hosting provider.
