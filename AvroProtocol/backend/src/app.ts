import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express, { type Express } from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.js";
import { walletsRouter } from "./routes/wallets.js";
import { cosignRouter } from "./routes/cosign.js";
import { recoveryRouter } from "./routes/recovery.js";
import { bundlerRouter } from "./routes/bundler.js";
import { downloadsRouter } from "./routes/downloads.js";
import { updatesRouter } from "./routes/updates.js";
import { stakingRouter } from "./routes/staking.js";
import { bridgeRouter } from "./routes/bridge.js";
import { freezeRouter } from "./routes/freeze.js";
import { paylinksRouter } from "./routes/paylinks.js";

export function createApp(): Express {
  const app = express();

  const rawCors = process.env.CORS_ALLOWED_ORIGINS?.trim();
  if (rawCors && rawCors !== "None" && rawCors !== "*") {
    const origins = rawCors.split(",").map((o) => o.trim());
    app.use(cors({ origin: origins }));
  } else {
    // Default open CORS for development & desktop WebView
    app.use(cors());
  }

  app.use(express.json());

  // Mount routes
  app.use(healthRouter);
  app.use(walletsRouter);
  app.use(cosignRouter);
  app.use(recoveryRouter);
  app.use(bundlerRouter);
  app.use(downloadsRouter);
  app.use(updatesRouter);
  app.use(stakingRouter);
  app.use(bridgeRouter);
  app.use(freezeRouter);
  app.use("/v1/paylinks", paylinksRouter);

  return app;
}

export const app = createApp();
