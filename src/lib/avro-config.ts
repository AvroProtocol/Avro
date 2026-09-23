import { useEffect, useMemo, useState } from "react";

export type AvroPublicConfig = {
  ticker: string;
  contractAddress: string;
  buyUrl: string;
  xUrl: string;
  githubUrl: string;
};

export const DEFAULT_AVRO_CONFIG: AvroPublicConfig = {
  ticker: "AVRO",
  contractAddress: "",
  buyUrl: "https://www.ponsfamily.com/launchpad/{ca}",
  xUrl: "https://x.com/Avroproto",
  githubUrl: "https://github.com/AvroProtocol/Avro",
};

function normalizeConfig(value: Partial<AvroPublicConfig> | null | undefined): AvroPublicConfig {
  return {
    ...DEFAULT_AVRO_CONFIG,
    ...(value ?? {}),
    ticker: (value?.ticker || DEFAULT_AVRO_CONFIG.ticker).replace(/^\$/, "").trim() || "AVRO",
    contractAddress: (value?.contractAddress ?? DEFAULT_AVRO_CONFIG.contractAddress).trim(),
    buyUrl: (value?.buyUrl || DEFAULT_AVRO_CONFIG.buyUrl).trim(),
    xUrl: (value?.xUrl || DEFAULT_AVRO_CONFIG.xUrl).trim(),
    githubUrl: (value?.githubUrl || DEFAULT_AVRO_CONFIG.githubUrl).trim(),
  };
}

export function resolveAvroBuyUrl(template: string, contractAddress: string) {
  const ca = contractAddress.trim();
  if (!ca) return "";
  const base = template.trim();
  if (!base) return "";
  return base.includes("{ca}")
    ? base.replace(/\{ca\}/gi, encodeURIComponent(ca))
    : `${base.replace(/\/$/, "")}/${encodeURIComponent(ca)}`;
}

export function useAvroConfig() {
  const [config, setConfig] = useState<AvroPublicConfig>(DEFAULT_AVRO_CONFIG);
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
        if (!cancelled) setConfig(DEFAULT_AVRO_CONFIG);
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
    () => resolveAvroBuyUrl(config.buyUrl, config.contractAddress),
    [config.buyUrl, config.contractAddress],
  );

  return { config, loaded, buyUrl };
}
