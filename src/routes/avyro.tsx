import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, Github, RefreshCw, ShieldCheck } from "lucide-react";
import { AvyroFooter, AvyroHeader } from "@/components/AvyroChrome";
import { useAvyroConfig } from "@/lib/avyro-config";
import { usePageReveal } from "@/lib/use-page-reveal";
import "@/styles/avyro-site.css";

export const Route = createFileRoute("/avyro")({
  component: AvyroCoinPage,
  head: () => ({
    meta: [
      { title: "$AVYRO | Avyro Protocol" },
      { name: "description", content: "Official $AVYRO page for Avyro Protocol with launch access, live contract verification, and official links." },
    ],
  }),
});

function shortAddress(address: string) {
  if (!address) return "NOT PUBLISHED";
  if (address.length < 22) return address;
  return `${address.slice(0, 12)}…${address.slice(-10)}`;
}

function AvyroCoinPage() {
  usePageReveal();
  const { config, loaded, buyUrl } = useAvyroConfig();
  const [copied, setCopied] = useState(false);
  const live = Boolean(config.contractAddress);

  const copy = async () => {
    if (!live || !navigator.clipboard) return;
    await navigator.clipboard.writeText(config.contractAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="av-site nx-site">
      <AvyroHeader />
      <main>
        <section className="nx-coin-hero">
          <div className="nx-coin-grid" aria-hidden="true" />
          <div className="nx-coin-ghost" aria-hidden="true">${config.ticker}</div>
          <div className="nx-container nx-coin-layout">
            <div className="nx-coin-copy" data-reveal>
              <a href="/" className="nx-back"><ArrowLeft size={14}/> BACK TO PROTOCOL</a>
              <div className="nx-live-pill nx-live-pill-dark"><i className={live ? "is-live" : ""}/><span>AVYRO ECOSYSTEM</span><b>{live ? "CONTRACT LIVE" : "PRE-LAUNCH"}</b></div>
              <h1><span>$</span>{config.ticker}</h1>
              <p>One canonical page for launch access, contract verification, and official sources. The contract address is loaded from <code>config.json</code>, and the Pons buy route is generated from that same value.</p>
              <div className="nx-hero-actions">
                {buyUrl ? <a className="nx-button nx-button-light" href={buyUrl} target="_blank" rel="noreferrer">Buy on Pons <ExternalLink size={15}/></a> : <span className="nx-button nx-button-light is-disabled">Buy opens when CA is live</span>}
                {config.xUrl && <a className="nx-button nx-button-outline-dark" href={config.xUrl} target="_blank" rel="noreferrer">Follow updates <ArrowRight size={15}/></a>}
              </div>
              <div className="nx-coin-warning"><ShieldCheck size={15}/><span>Always verify the contract address here before interacting with any token contract.</span></div>
            </div>

            <div className="nx-token-sculpture" data-reveal aria-label="$AVYRO token visualization">
              <div className="nx-sculpture-orbit nx-so1"/><div className="nx-sculpture-orbit nx-so2"/><div className="nx-sculpture-orbit nx-so3"/>
              <div className="nx-sculpture-disc"><img src="/assets/avyro-mark-black.png" alt=""/><span>AVYRO</span></div>
              <span className="nx-sculpture-tag nx-st1">ROBINHOOD CHAIN</span><span className="nx-sculpture-tag nx-st2">${config.ticker}</span><span className="nx-sculpture-tag nx-st3">CONFIG SYNCED</span>
            </div>
          </div>
        </section>

        <section className="nx-section nx-coin-contract">
          <div className="nx-container">
            <div className="nx-contract-console" data-reveal>
              <div className="nx-contract-head"><span>CANONICAL CONTRACT</span><div>{loaded ? <Check size={12}/> : <RefreshCw className="nx-spin" size={12}/>} config.json {loaded ? "SYNCED" : "LOADING"}</div></div>
              <div className="nx-contract-address"><div><small>CONTRACT ADDRESS</small><strong title={config.contractAddress || "Contract address not published"}>{shortAddress(config.contractAddress)}</strong></div><button type="button" onClick={copy} disabled={!live}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "COPIED" : "COPY CA"}</button></div>
              <div className="nx-contract-route"><span>BUY ROUTE</span><code>{buyUrl || "https://www.ponsfamily.com/launchpad/{ca}"}</code><i className={live ? "is-live" : ""}/></div>
            </div>

            <div className="nx-coin-metrics" data-reveal>
              <article><span>01</span><small>TICKER</small><strong>${config.ticker}</strong><p>Official ecosystem display symbol.</p></article>
              <article><span>02</span><small>NETWORK</small><strong>Robinhood Chain</strong><p>Arbitrum-powered EVM L2 · Chain ID 4663.</p></article>
              <article><span>03</span><small>LAUNCH</small><strong>Pons Launchpad</strong><p>The CA is inserted into the launch URL automatically.</p></article>
              <article><span>04</span><small>SOURCE</small><strong>config.json</strong><p>One runtime source controls the public contract address.</p></article>
            </div>
          </div>
        </section>

        <section className="nx-section nx-coin-story">
          <div className="nx-container nx-coin-story-layout">
            <div data-reveal><span className="nx-index">HOW IT WORKS</span><h2>Change one value.<br/>Update every token action.</h2><p>When the final contract is deployed, put the address into <code>public/config.json</code>. The token page, contract display, copy action, launch state, and Pons buy URL all resolve from that value.</p></div>
            <div className="nx-coin-steps" data-reveal>
              <article><span>01</span><div><h3>Publish the contract address</h3><p>Set <code>contractAddress</code> in <code>public/config.json</code>.</p></div></article>
              <article><span>02</span><div><h3>Runtime sync</h3><p>Avyro reloads the config without a hardcoded contract address in the website bundle.</p></div></article>
              <article><span>03</span><div><h3>Launch URL resolves</h3><p><code>{"https://www.ponsfamily.com/launchpad/{ca}"}</code> becomes the live buy URL automatically.</p></div></article>
            </div>
          </div>
        </section>

        <section className="nx-coin-final">
          <div className="nx-container" data-reveal>
            <div><span className="nx-index nx-index-dark">OFFICIAL SOURCES</span><h2>Verify first.<br/>Connect second.</h2><p>Use Avyro-controlled sources and compare the live contract address before interacting.</p></div>
            <div className="nx-token-actions">
              {config.xUrl && <a className="nx-button nx-button-light" href={config.xUrl} target="_blank" rel="noreferrer">X / Twitter <ExternalLink size={15}/></a>}
              {config.githubUrl && <a className="nx-button nx-button-outline-dark" href={config.githubUrl} target="_blank" rel="noreferrer"><Github size={15}/> GitHub</a>}
            </div>
          </div>
        </section>
      </main>
      <AvyroFooter />
    </div>
  );
}
