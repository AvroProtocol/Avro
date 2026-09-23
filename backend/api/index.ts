import { app } from "../src/app.js";

app.get("/", (_req, res) => {
  res.status(200).json({
    service: "Avro Protocol API",
    status: "ok",
    health: "/health",
    network: "Robinhood Chain",
    chainId: 4663,
  });
});

export default app;
