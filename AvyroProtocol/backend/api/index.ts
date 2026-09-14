import { app } from "../src/app";

app.get("/", (_req, res) => {
  res.status(200).json({
    service: "Avyro Protocol API",
    status: "ok",
    health: "/health",
    network: "Robinhood Chain",
    chainId: 4663,
  });
});

export default app;
