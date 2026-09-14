# Avyro Protocol domain setup

The canonical production domain is **avyroprotocol.com**.

## Website

The root Vercel project deploys the TanStack website from the repository root.

- Website: `https://avyroprotocol.com`
- Recommended alias: `https://www.avyroprotocol.com` → redirect to `https://avyroprotocol.com`
- Security contact: `security@avyroprotocol.com`

Frontend environment:

```env
VITE_SITE_URL=https://avyroprotocol.com
VITE_API_URL=https://api.avyroprotocol.com
VITE_BACKEND_URL=https://api.avyroprotocol.com
```

## API / co-signer

The API is a separate backend application under `backend/`. It must be deployed as a **second Vercel project** with the project root directory set to `backend`.

The repository includes `backend/api/index.ts` and `backend/vercel.json` so the Express backend can run as a Vercel Node function. After the backend deployment is healthy, attach the custom domain:

`api.avyroprotocol.com`

Then add the DNS record Vercel requests at the domain provider. The API hostname cannot resolve until that custom domain/DNS step is completed.

Backend environment at minimum:

```env
NODE_ENV=production
DATABASE_URL=
ROBINHOOD_CHAIN_ID=4663
ROBINHOOD_RPC_URL=https://rpc.mainnet.chain.robinhood.com
SHARD_B_ENCRYPTION_KEY=
JWT_SECRET=
CORS_ALLOWED_ORIGINS=https://avyroprotocol.com,https://www.avyroprotocol.com
PUBLIC_APP_URL=https://avyroprotocol.com
AVYRO_TOKEN_ADDRESS=
```

Keep `AVYRO_TOKEN_ADDRESS` empty until the verified `$AVYRO` contract is deployed. Configure all remaining backend secrets from `backend/.env.example` before enabling production signing, staking, rebates, or pay-link settlement.

## Android

```env
EXPO_PUBLIC_AVYRO_API_URL=https://api.avyroprotocol.com
```
