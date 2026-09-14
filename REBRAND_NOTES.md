# AVYRO migration notes

This source pack uses **AVYRO / Avyro Protocol** consistently across the public website, desktop client, Android client, SDK, backend, contracts, release metadata, documentation, application identifiers, storage keys, icons, and social assets.

## Brand and product identity

- Master brand: **AVYRO**
- Protocol and applications: **Avyro Protocol**
- Ecosystem ticker: **$AVYR**
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

## AVYR configuration

The public token page reads `public/config.json`. Backend staking, bridge rebates, pay links, treasury accounting, SDK helpers, and desktop token metadata use the AVYR naming and the same configured contract address.

Backend environment variables:

```text
AVYR_TOKEN_ADDRESS=
AVYR_USD_REFERENCE_PRICE=
AVYR_PRICE_MAX_DEVIATION_BPS=2000
AVYR_USD_PRICE=
```

When changing the AVYR contract, update the backend environment and the public/desktop/SDK token configuration together so every surface resolves the same asset.

## Database upgrade

Fresh installs create AVYR-named rebate ledger columns directly. Existing databases are upgraded by `backend/db/migrations/008_avyr_rebate_columns.sql`, which safely renames the historical rebate columns when present.

## Distribution

The default social destinations are `x.com/AvyroProtocol` and `github.com/AvyroProtocol/AvyroProtocol`. Confirm those values before production deployment.
