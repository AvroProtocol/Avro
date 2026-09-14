# Contributing to AVYRO

Thank you for contributing to AVYRO. This repository includes the web application, native clients, backend services, SDK, and smart contracts, so changes should stay focused and easy to review.

## Before you start

Please open an issue for substantial product, protocol, or architecture changes before implementation. Small bug fixes and documentation improvements can go directly to a pull request.

Security vulnerabilities must not be reported in public issues. Follow [SECURITY.md](SECURITY.md) instead.

## Development setup

### Requirements

- Bun
- Rust for Tauri desktop development
- Foundry for smart contracts
- Java 17 and Android tooling for Android builds

### Clone

```bash
git clone https://github.com/AvyroProtocol/Avyro.git
cd Avyro
bun install
```

Install dependencies in the component you plan to change:

```bash
cd backend && bun install
cd ../sdk && bun install
cd ../desktop && bun install
cd ../android && bun install
```

## Validation

Run the checks that match your change.

```bash
# Web
bun run check
bun run lint
bun run build

# Backend
cd backend
bun run check
bun test

# SDK
cd ../sdk
bun run check
bun test
bun run build

# Contracts
cd ../contracts
forge test
```

Desktop and Android changes should also be validated through their GitHub Actions workflows before release.

## Pull requests

- Create branches from `main`.
- Keep one concern per pull request.
- Include tests for behavior changes where practical.
- Explain user-visible changes and any security implications.
- Do not commit secrets, private keys, seed phrases, production credentials, or local `.env` files.
- Keep public APIs typed and documented.
- Avoid unrelated formatting or refactors in the same pull request.

Example branch names:

```text
feat/passkey-recovery
fix/android-release-upload
docs/sdk-quickstart
```

Example commit messages:

```text
Add passkey recovery guardrail
Fix Android release asset upload
Document SDK wallet creation
```

## Reporting bugs

Include:

- component and environment
- exact reproduction steps
- expected behavior
- actual behavior
- relevant logs or screenshots
- minimal reproduction when available

For security issues, use the private reporting process in [SECURITY.md](SECURITY.md).
