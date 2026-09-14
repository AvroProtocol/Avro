import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Copy, ExternalLink, Github, RefreshCw, ShieldCheck } from "lucide-react";
import { AvyroFooter, AvyroHeader } from "@/components/AvyroChrome";
import { useAvyroConfig } from "@/lib/avyro-config";
import { usePageReveal } from "@/lib/use-page-reveal";
import "@/styles/avyro-site.css";

export const Route = createFileRoute("/avyro")({
  component: AvyroCoinPage,
  head: () => ({
    meta: [
      { title: "$AVYR | Avyro Protocol" },
      { name: "description", content: "Official $AVYR coin page for Avyro Protocol, including launch access, contract verification, and official links." },
    ],
  }),
});

function shortAddress(address: string) {
  if (!address) return "Not published yet";
  if (address.length < 18) return address;
  return `${address.slice(0, 8)}…${address.slice(-6)}`;
}

function AvyroCoinPage() {
  usePageReveal();
  const { config, loaded } = useAvyroConfig();
  const [copied, setCopied] = useState(false);
  const live = Boolean(config.contractAddress);

  const copy = async () => {
    if (!live || !navigator.clipboard) return;
    await navigator.clipboard.writeText(config.contractAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="av-site">
      <AvyroHeader />
      <main>
        <section className="av-coin-hero">
          <div className="av-coin-grid" />
          <div className="av-container av-coin-layout">
            <div className="av-coin-copy" data-reveal>
              <span className="av-kicker av-kicker-invert">Avyro ecosystem coin</span>
              <h1><span>$</span>{config.ticker}</h1>
              <p>The protocol coin page is intentionally separate from the wallet product. Launch access, contract verification, and official sources live here in one canonical location.</p>
              <div className="av-hero-actions">
                <a className="av-btn av-btn-solid" href={config.buyUrl} target="_blank" rel="noreferrer">Buy on Pons <ExternalLink size={15} /></a>
                {config.xUrl && <a className="av-btn av-btn-outline" href={config.xUrl} target="_blank" rel="noreferrer">Follow updates <ArrowRight size={15} /></a>}
              </div>
              <div className="av-coin-note"><ShieldCheck size={14} /> Always verify the contract address on this page before interacting with a token contract.</div>
            </div>

            <div className="av-coin-visual" data-reveal>
              <div className="av-coin-orbit av-co1" /><div className="av-coin-orbit av-co2" />
              <div className="av-coin-disc"><img src="/assets/avyro-mark-black.png" alt="" /></div>
              <span className="av-coin-tag av-ct1">ROBINHOOD CHAIN</span>
              <span className="av-coin-tag av-ct2">{config.ticker}</span>
              <span className="av-coin-tag av-ct3">AVYRO ECOSYSTEM</span>
            </div>
          </div>
        </section>

        <section className="av-section">
          <div className="av-container">
            <div className="av-contract-panel" data-reveal>
              <div>
                <span className="av-kicker">Contract address</span>
                <h2 title={config.contractAddress || "Contract address not published"}>{shortAddress(config.contractAddress)}</h2>
                <p>{live ? "Loaded live from /config.json. Update the config file and this page refreshes automatically." : "The contract address is intentionally blank in config.json until the final deployment is ready."}</p>
              </div>
              <div className="av-contract-actions">
                <button type="button" className="av-btn av-btn-outline" onClick={copy} disabled={!live}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied" : "Copy CA"}</button>
                <div className="av-config-state">{loaded ? <Check size={12} /> : <RefreshCw className="av-spin" size={12} />} config.json {loaded ? "synced" : "loading"}</div>
              </div>
            </div>

            <div className="av-coin-stats" data-reveal>
              <article><span>Ticker</span><strong>{config.ticker}</strong><small>Official ecosystem display symbol</small></article>
              <article><span>Network</span><strong>Robinhood Chain</strong><small>Arbitrum-powered EVM L2 · Chain ID 4663</small></article>
              <article><span>Launch</span><strong>Pons Launchpad</strong><small>Official launch destination configured in config.json</small></article>
              <article><span>Source</span><strong>Public config</strong><small>Contract address is runtime-configured, not hardcoded</small></article>
            </div>
          </div>
        </section>

        <section className="av-section av-coin-story">
          <div className="av-container av-coin-story-grid">
            <div data-reveal><span className="av-kicker">Why separate it</span><h2>Product first. Coin information in its own lane.</h2><p>Avyro is primarily self-custodial payment infrastructure. Keeping <strong>{config.ticker}</strong> on a dedicated page makes the main product easier to understand while giving coin users one official source for launch and contract information.</p></div>
            <div className="av-coin-list" data-reveal>
              <article><span>01</span><div><h3>One canonical contract address</h3><p>The page reads the CA from a standalone public config file so it can be updated without rebuilding the React application.</p></div></article>
              <article><span>02</span><div><h3>Direct launch access</h3><p>The primary buy action points to the configured Pons launchpad destination at ponsfamily.com/launchpad/.</p></div></article>
              <article><span>03</span><div><h3>Connected to the protocol</h3><p>The ecosystem layer can support rebates, incentives, and future network participation while the wallet remains self-custodial.</p></div></article>
            </div>
          </div>
        </section>

        <section className="av-section av-coin-final">
          <div className="av-container" data-reveal>
            <div><span className="av-kicker av-kicker-invert">Official links</span><h2>Verify before you connect.</h2><p>Use only Avyro-controlled sources and always compare the contract address before interacting.</p></div>
            <div className="av-coin-final-actions">
              {config.xUrl && <a className="av-btn av-btn-light" href={config.xUrl} target="_blank" rel="noreferrer">X / Twitter <ExternalLink size={15} /></a>}
              {config.githubUrl && <a className="av-btn av-btn-dark-outline" href={config.githubUrl} target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>}
            </div>
          </div>
        </section>
      </main>
      <AvyroFooter />
    </div>
  );
}
