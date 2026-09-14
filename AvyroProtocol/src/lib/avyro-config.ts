import { useEffect, useMemo, useState } from "react";

export type AvyroPublicConfig = {
  ticker: string;
  contractAddress: string;
  buyUrl: string;
  xUrl: string;
  githubUrl: string;
};

export const DEFAULT_AVYRO_CONFIG: AvyroPublicConfig = {
  ticker: "AVYRO",
  contractAddress: "",
  buyUrl: "https://www.ponsfamily.com/launchpad/{ca}",
  xUrl: "https://x.com/AvyroProtocol",
  githubUrl: "https://github.com/AvyroProtocol/Avyro",
};

function normalizeConfig(value: Partial<AvyroPublicConfig> | null | undefined): AvyroPublicConfig {
  return {
    ...DEFAULT_AVYRO_CONFIG,
    ...(value ?? {}),
    ticker: (value?.ticker || DEFAULT_AVYRO_CONFIG.ticker).replace(/^\$/, "").trim() || "AVYRO",
    contractAddress: (value?.contractAddress ?? DEFAULT_AVYRO_CONFIG.contractAddress).trim(),
    buyUrl: (value?.buyUrl || DEFAULT_AVYRO_CONFIG.buyUrl).trim(),
    xUrl: (value?.xUrl || DEFAULT_AVYRO_CONFIG.xUrl).trim(),
    githubUrl: (value?.githubUrl || DEFAULT_AVYRO_CONFIG.githubUrl).trim(),
  };
}

export function resolveAvyroBuyUrl(template: string, contractAddress: string) {
  const ca = contractAddress.trim();
  if (!ca) return "";
  const base = template.trim();
  if (!base) return "";
  return base.includes("{ca}")
    ? base.replace(/\{ca\}/gi, encodeURIComponent(ca))
    : `${base.replace(/\/$/, "")}/${encodeURIComponent(ca)}`;
}

export function useAvyroConfig() {
  const [config, setConfig] = useState<AvyroPublicConfig>(DEFAULT_AVYRO_CONFIG);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch(`/config.json?v=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`config.json returned ${response.status}`);
        const next = normalizeConfig(await response.json());
        if (!cancelled) setConfig(next);
      } catch {
        if (!cancelled) setConfig(DEFAULT_AVYRO_CONFIG);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };

    load();
    const refresh = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(refresh);
    };
  }, []);

  const buyUrl = useMemo(
    () => resolveAvyroBuyUrl(config.buyUrl, config.contractAddress),
    [config.buyUrl, config.contractAddress],
  );

  return { config, loaded, buyUrl };
}
