# Security Policy

AVYRO is a self-custodial threshold wallet and payment stack. Security reports are handled privately because vulnerabilities may affect signing, recovery, account execution, or user funds.

## Report a vulnerability

Do not open a public GitHub issue for a security vulnerability.

Email: `security@avyroprotocol.com`

Please include:

- a clear description of the issue
- affected component and version
- reproduction steps or proof of concept
- expected impact
- any suggested mitigation

## Response targets

- Initial acknowledgement: within 48 hours
- Triage: within 72 hours
- Critical remediation target: within 7 calendar days

These are response targets, not guarantees. Complex protocol or dependency issues may require additional validation before disclosure.

## In scope

| Component | Examples |
| --- | --- |
| `contracts/` | quorum bypass, unauthorized execution, signature validation, account-abstraction issues |
| `backend/` | policy bypass, replay, authentication, shard exposure, rate-limit bypass |
| `sdk/` | key handling, signature construction, unsafe cryptographic behavior |
| `desktop/` | local key storage, IPC boundaries, native credential handling |
| `android/` | local key storage, recovery flows, deep links, application security boundaries |

## Security model

AVYRO requires a 2-of-3 authorization quorum across independent security factors. A valid design must not allow one factor to spend alone.

```text
A  Device shard
B  Policy co-signer
C  Passkey recovery shard

Valid quorum: A+B, A+C, or B+C where the recovery policy permits it
```

Changes that alter signing, recovery, account execution, or key storage should receive additional review.

## Research guidelines

Good-faith research is welcome when it avoids unnecessary access to user data, service disruption, or movement of real funds. Please limit testing to what is required to demonstrate the issue and allow reasonable time for remediation before disclosure.

## Network reference

- Robinhood Chain
- Chain ID `4663`
- ERC-4337 smart-account execution
