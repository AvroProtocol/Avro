# AVYRO migration notes

This source pack uses **AVYRO / Avyro Protocol** consistently across the public website, desktop client, Android client, SDK, backend, contracts, release metadata, documentation, application identifiers, storage keys, icons, and social assets.

## Brand and product identity

- Master brand: **AVYRO**
- Protocol and applications: **Avyro Protocol**
- Ecosystem ticker: **$AVYRO**
- Website: responsive black/white interface with persistent light/dark theme switching, animated sections, interactive custody demos, mobile-first navigation, and reduced-motion accessibility
- Token route: `/avyro`, driven by `public/config.json`
- SDK namespace: `@avyro/protocol-sdk`
- Public TypeScript APIs: `AvyroWallet`, `AvyroAccount`, and `AvyroFactory`
- Desktop identifier: `com.avyro.desktop`
- Mobile identifier: `com.avyro.mobile`
- Receipt formats, storage namespaces, application copy, contract identifiers, and release metadata use Avyro naming

## API configuration

The default branded API origin is:

```text
https://api.avyroprotocol.com
```

Deployments can override it without changing source code:

```text
VITE_BACKEND_URL=https://api.avyroprotocol.com
VITE_API_URL=https://api.avyroprotocol.com
EXPO_PUBLIC_AVYRO_API_URL=https://api.avyroprotocol.com
```

The SDK and desktop wallet also accept an explicit `apiUrl` when a client is created.

## AVYRO configuration

The public token page reads `public/config.json`. The public contract address is intentionally blank until the final `$AVYRO` deployment. The website treats `public/config.json` as the canonical runtime source for the ticker, CA, launch URL template, X profile, and GitHub repository.

Backend environment variables:

```text
AVYRO_TOKEN_ADDRESS=
AVYRO_USD_REFERENCE_PRICE=
AVYRO_PRICE_MAX_DEVIATION_BPS=2000
AVYRO_USD_PRICE=
```

For the website, set `contractAddress` in `public/config.json`; the displayed CA and `https://www.ponsfamily.com/launchpad/{ca}` buy URL update automatically. Backend token operations still require the production `AVYRO_TOKEN_ADDRESS` environment variable, and native clients should be built against the verified production token address.

## Database upgrade

Fresh installs create AVYRO-named rebate ledger columns directly. Existing databases are upgraded by `backend/db/migrations/008_avyr_rebate_columns.sql`, which safely renames the historical rebate columns when present.

## Distribution

The default social destinations are `x.com/AvyroProtocol` and `github.com/AvyroProtocol/Avyro`.
