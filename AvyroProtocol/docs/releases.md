# Release policy

Avyro keeps GitHub Releases focused on user-facing product versions.

## Versioned releases

Application releases use semantic version tags such as `v0.1.14` and contain the downloadable Android, Windows, macOS, and Linux artifacts for that version.

Backend deployments are continuous and are not published as GitHub Releases. Backend changes are verified by the `Backend CI` workflow and deployed through the production hosting pipeline.

The SDK is published from versioned Avyro releases only, or by an explicit manual publish workflow.

## Download endpoints

Public download buttons use the branded API routes:

- Android: `https://api.avyroprotocol.com/v1/downloads/android`
- Windows: `https://api.avyroprotocol.com/v1/downloads/windows`
- macOS: `https://api.avyroprotocol.com/v1/downloads/macos`
- Linux: `https://api.avyroprotocol.com/v1/downloads/linux`

These routes resolve to the latest compatible assets from the current Avyro product release.
