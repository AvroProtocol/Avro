<div align="center">

# AVYRO

**Private payments. Real ownership.**

Self-custodial payment infrastructure for Robinhood Chain with 2-of-3 threshold security, smart accounts, passkey recovery, privacy rails, desktop and mobile clients, and an open TypeScript SDK.

</div>

---

## What is Avyro?

Avyro is a self-custodial smart-wallet and developer platform for Robinhood Chain, an Arbitrum-powered EVM L2 with Chain ID `4663`. The account model removes the single-key failure mode by distributing authorization across three independent shards. Any two can authorize a transaction or recovery path. One shard alone cannot spend.

The source pack includes the animated public website, Tauri desktop client, React Native Android client, Bun/Express co-signer backend, Foundry contracts, and the `@avyro/protocol-sdk` TypeScript package.

## Product surfaces

| Surface | Purpose |
|---|---|
| **Avyro Web** | Public product site, interactive custody demos, downloads, docs, mobile page, and the dedicated `$AVYR` page |
| **Avyro Desktop** | Native wallet for Windows, macOS, and Linux with threshold signing, swaps, bridge flows, privacy, pay links, guardrails, and recovery |
| **Avyro Mobile** | Android companion wallet for payments, contacts, pay links, recovery, and security controls |
| **Avyro SDK** | Typed Viem-based wallet, account, bridge, staking, pay-link, recovery, and guardrail primitives |
| **Avyro Co-Signer** | Policy-aware Shard B service that can co-sign only after configured checks pass |
| **Avyro Contracts** | ERC-4337-compatible 2-of-3 threshold smart account and deterministic deployment factory |

## Security model

```text
Shard A  Local device / OS keystore  ─┐
                                       ├─ any 2 of 3 ─> ERC-4337 execution
Shard B  Policy co-signer             ─┤
                                       │
Shard C  Passkey / recovery path      ─┘
```

The co-signer cannot spend funds by itself. The account contract validates a threshold quorum before execution. Recovery is designed to avoid making a single seed phrase the only route back into the wallet.

## New AVYRO interface

The web experience has been rebuilt around a black/white design system with a persistent light/dark toggle, responsive navigation, pointer parallax, reveal motion, animated threshold diagrams, interactive custody controls, privacy visualizations, roadmap motion, mobile-first layouts, and reduced-motion accessibility support.

The public token route is `/avyro`. Its ticker, contract address, buy destination, X profile, and GitHub URL are read at runtime from `public/config.json`. The source pack ships with the currently configured settlement-token contract so staking, pay links, rebates, and the token page use one canonical address. Replace that address in the AVYR configuration when a new contract is deployed.

## Repository structure

```text
Avyro-Protocol/
├── src/                 # TanStack Start web app
├── public/              # public config, docs, assets, social card
├── desktop/             # Tauri v2 native desktop client
├── android/             # React Native / Expo mobile client
├── backend/             # Bun + Express co-signer service
├── sdk/                 # @avyro/protocol-sdk
├── contracts/           # AvyroAccount + AvyroFactory
├── .github/workflows/   # web/app/backend/SDK release automation
└── REBRAND_NOTES.md     # migration and compatibility notes
```

## Local development

### Web

```bash
bun install
bun run dev
```

### Backend

```bash
cd backend
bun install
bun run check
bun test
bun run dev
```

### SDK

```bash
cd sdk
bun install
bun run check
bun test
bun run build
```

### Desktop

```bash
cd sdk && bun install && bun run build && bun link
cd ../desktop
bun install
bun link @avyro/protocol-sdk
bun run dev
```

### Android

```bash
cd android
bun install
bun run start
```

## Network

- Robinhood Chain mainnet
- Chain ID: `4663`
- Native gas asset: `ETH`
- Core settlement asset: `USDG`
- Account abstraction: ERC-4337 v0.6

## Deployment configuration

- Canonical website: `https://avyroprotocol.com`
- Production API: `https://api.avyroprotocol.com`
- Public payment links: `https://avyroprotocol.com/pay/<slug>`

All clients now use Avyro-only identifiers and endpoints. The default API origin is `https://api.avyroprotocol.com` and can be overridden without source edits:

- Web: `VITE_BACKEND_URL` or `VITE_API_URL`
- Android: `EXPO_PUBLIC_AVYRO_API_URL`
- SDK/desktop: pass `apiUrl` when creating a wallet or co-signer client
- Backend token settings: `AVYR_TOKEN_ADDRESS`, `AVYR_USD_REFERENCE_PRICE`, `AVYR_PRICE_MAX_DEVIATION_BPS`, and `AVYR_USD_PRICE`

For an existing database, migration `008_avyr_rebate_columns.sql` upgrades the rebate ledger column names automatically.

## License

MIT. See [LICENSE](LICENSE).
