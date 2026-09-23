# Architecture

AVRO separates account execution, signing factors, policy enforcement, and recovery so that no single operational component becomes a custodian.

## Authorization model

```text
                 ┌───────────────────┐
                 │  Device shard A   │
                 └─────────┬─────────┘
                           │
                 ┌─────────▼─────────┐
                 │  Threshold quorum │
                 │      2 of 3       │
                 └─────────┬─────────┘
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
┌─────▼─────┐       ┌──────▼──────┐      ┌──────▼──────┐
│ Co-signer │       │ Smart       │      │ Recovery    │
│ shard B   │       │ account     │      │ shard C     │
└───────────┘       └─────────────┘      └─────────────┘
```

The device and policy co-signer form the normal transaction path. Recovery is independent and intended for access rotation when the primary device is unavailable.

## Components

### Smart contracts

`contracts/` contains the smart-account and factory contracts used for deterministic deployment and threshold-authorized execution.

### SDK

`sdk/` exposes typed TypeScript primitives for wallet creation, account operations, signing, backend communication, and related protocol integrations.

### Backend

`backend/` hosts policy-aware signing and application APIs. The co-signer is one factor in the threshold model and must not be capable of unilateral execution.

### Desktop

`desktop/` is the Tauri v2 client for Windows, macOS, and Linux. It combines local key material, smart-account operations, recovery, privacy features, and payment flows.

### Android

`android/` is the React Native / Expo mobile client.

### Web

`src/` contains the public TanStack Start site, docs surfaces, downloads, and protocol presentation.
