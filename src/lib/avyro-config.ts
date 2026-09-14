import { useEffect, useState } from "react";

export type AvyroPublicConfig = {
  ticker: string;
  contractAddress: string;
  buyUrl: string;
  xUrl: string;
  githubUrl: string;
};

export const DEFAULT_AVYRO_CONFIG: AvyroPublicConfig = {
  ticker: "AVYR",
  contractAddress: "0xee2ddd7128c291b027712eca157b3ff31a55a05a",
  buyUrl: "https://ponsfamily.com/launchpad/",
  xUrl: "https://x.com/AvyroProtocol",
  githubUrl: "https://github.com/AvyroProtocol/AvyroProtocol",
};

function normalizeConfig(value: Partial<AvyroPublicConfig> | null | undefined): AvyroPublicConfig {
  return {
    ...DEFAULT_AVYRO_CONFIG,
    ...(value ?? {}),
    ticker: (value?.ticker || DEFAULT_AVYRO_CONFIG.ticker).replace(/^\$/, "").trim() || "AVYR",
    contractAddress: (value?.contractAddress || DEFAULT_AVYRO_CONFIG.contractAddress).trim(),
    buyUrl: (value?.buyUrl || DEFAULT_AVYRO_CONFIG.buyUrl).trim(),
    xUrl: (value?.xUrl || DEFAULT_AVYRO_CONFIG.xUrl).trim(),
    githubUrl: (value?.githubUrl || DEFAULT_AVYRO_CONFIG.githubUrl).trim(),
  };
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
    return () => { cancelled = true; window.clearInterval(refresh); };
  }, []);

  return { config, loaded };
}
