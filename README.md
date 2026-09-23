<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/assets/avro-mark-white.png">
    <source media="(prefers-color-scheme: light)" srcset="public/assets/avro-mark-black.png">
    <img alt="AVRO" src="public/assets/avro-mark-black.png" width="112">
  </picture>

# AVRO

**Private payments. Real ownership.**

Self-custodial smart accounts, threshold security, recovery, privacy tooling, native apps, and an open SDK for Robinhood Chain.

[Website](https://avroprotocol.com) · [Docs](https://avroprotocol.com/docs) · [Releases](https://github.com/AvroProtocol/Avro/releases) · [X](https://x.com/Avroproto)

[![Backend CI](https://github.com/AvroProtocol/Avro/actions/workflows/backend.yml/badge.svg)](https://github.com/AvroProtocol/Avro/actions/workflows/backend.yml)
[![Android](https://github.com/AvroProtocol/Avro/actions/workflows/android.yml/badge.svg)](https://github.com/AvroProtocol/Avro/actions/workflows/android.yml)
[![Desktop](https://github.com/AvroProtocol/Avro/actions/workflows/desktop-release.yml/badge.svg)](https://github.com/AvroProtocol/Avro/actions/workflows/desktop-release.yml)
[![Release](https://img.shields.io/github/v/release/AvroProtocol/Avro?label=release)](https://github.com/AvroProtocol/Avro/releases/latest)
[![License](https://img.shields.io/github/license/AvroProtocol/Avro)](LICENSE)

</div>

## Overview

AVRO is a self-custodial wallet and developer stack built for Robinhood Chain. The wallet model distributes authorization across three independent security factors and requires any two to approve execution.

```text
Device shard ──────────────┐
                           ├── 2 of 3 quorum ──> smart-account execution
Policy co-signer ──────────┤
                           │
Passkey recovery shard ────┘
```

No single device, co-signer, or recovery factor can authorize a transaction alone.

## Download AVRO

| Platform | Direct download | Build |
| --- | --- | --- |
| Android | [Download APK](https://api.avroprotocol.com/v1/downloads/android) | React Native / Expo |
| Windows | [Download installer](https://api.avroprotocol.com/v1/downloads/windows) | Tauri v2 |
| macOS | [Download DMG](https://api.avroprotocol.com/v1/downloads/macos) | Tauri v2, Apple Silicon |
| Linux | [Download package](https://api.avroprotocol.com/v1/downloads/linux) | AppImage / Debian |

Release binaries are also published on the [GitHub Releases](https://github.com/AvroProtocol/Avro/releases) page.

## Product stack

| Component | Purpose |
| --- | --- |
| **Web** | Product site, docs, downloads, research, mobile showcase, and `$AVRO` page |
| **Desktop** | Native wallet for Windows, macOS, and Linux |
| **Android** | Mobile wallet and companion experience |
| **Backend** | Policy-aware co-signer, payment APIs, and service endpoints |
| **SDK** | Typed TypeScript primitives for accounts, signing, payments, recovery, and integrations |
| **Contracts** | ERC-4337 compatible smart accounts and deterministic account factory |

## Core capabilities

- 2-of-3 threshold authorization
- ERC-4337 smart accounts
- Passkey-backed recovery
- Private payment and stealth-address flows
- Spending policy and guardrail controls
- Swaps, bridge flows, and payment links
- Desktop and Android clients
- Open TypeScript SDK

## Network

| Property | Value |
| --- | --- |
| Network | Robinhood Chain |
| Chain ID | `4663` |
| Gas asset | `ETH` |
| Settlement asset | `USDG` |
| Account abstraction | ERC-4337 |

## Repository layout

```text
.
├── src/                  Web application
├── public/               Static assets and public runtime config
├── desktop/              Tauri v2 desktop client
├── android/              React Native / Expo Android client
├── backend/              API and policy co-signer service
├── sdk/                  @avro/protocol-sdk
├── contracts/            Smart-account contracts
├── docs/                 Architecture and deployment notes
├── scripts/              Repository utilities
└── .github/workflows/    CI, security, and release automation
```

## Development

### Requirements

- Bun
- Node.js where required by platform tooling
- Rust toolchain for Tauri
- Foundry for smart contracts
- Java 17 and Android tooling for Android builds

### Web

```bash
bun install
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

### Backend

```bash
cd backend
bun install
bun run check
bun test
bun run dev
```

### Desktop

Build the local SDK first, then start the desktop client.

```bash
cd sdk
bun install
bun run build

cd ../desktop
bun install
bun run dev
```

For a native Tauri development build:

```bash
cd desktop
bun run tauri dev
```

### Android

```bash
cd android
bun install
bun run start
```

## Configuration

The public website reads its launch configuration from [`public/config.json`](public/config.json). The backend and native clients use environment variables documented in their example environment files.

Production services:

- Website: `https://avroprotocol.com`
- API: `https://api.avroprotocol.com`
- Security contact: `security@avroprotocol.com`

Deployment notes are available in [`docs/deployment.md`](docs/deployment.md).

## Security

Security-sensitive changes should be reviewed with the threshold model in mind. The co-signer must never become a unilateral spending authority, and recovery must remain independent from the normal signing path.

Please do not open public issues for vulnerabilities. See [`SECURITY.md`](SECURITY.md) for the reporting process and scope.

## Contributing

Contributions are welcome. Start with [`CONTRIBUTING.md`](CONTRIBUTING.md) for setup, testing, and pull-request expectations.

## License

Released under the [MIT License](LICENSE).
