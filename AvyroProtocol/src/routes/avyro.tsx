import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, Github } from "lucide-react";
import { AvyroFooter, AvyroHeader } from "@/components/AvyroChrome";
import { useAvyroConfig } from "@/lib/avyro-config";
import { usePageReveal } from "@/lib/use-page-reveal";
import "@/styles/avyro-site.css";

export const Route = createFileRoute("/avyro")({
  component: AvyroCoinPage,
  head: () => ({
    meta: [
      { title: "$AVYRO | Avyro Protocol" },
      { name: "description", content: "Official $AVYRO page for Avyro Protocol with launch access, contract verification, and official links." },
    ],
  }),
});

function shortAddress(address: string) {
  if (!address) return "COMING SOON";
  if (address.length < 22) return address;
  return `${address.slice(0, 12)}…${address.slice(-10)}`;
}

function AvyroCoinPage() {
  usePageReveal();
  const { config, buyUrl } = useAvyroConfig();
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
          <div className="nx-coin-grid" />
          <div className="nx-coin-ghost" aria-hidden="true">${config.ticker}</div>
          <div className="nx-container nx-coin-layout">
            <div className="nx-coin-copy" data-reveal>
              <a href="/" className="nx-back"><ArrowLeft size={14}/> BACK TO PROTOCOL</a>
              <div className="nx-live-pill nx-live-pill-dark"><i className={live ? "is-live" : ""}/><span>AVYRO ECOSYSTEM</span><b>{live ? "CONTRACT LIVE" : "COMING SOON"}</b></div>
              <h1><span>$</span>{config.ticker}</h1>
              <p>The official home for $AVYRO launch access, verified contract information, and Avyro-controlled ecosystem links.</p>
              <div className="nx-hero-actions">
                {buyUrl ? <a className="nx-button nx-button-light" href={buyUrl} target="_blank" rel="noreferrer">Buy on Pons <ExternalLink size={15}/></a> : <span className="nx-button nx-button-light is-disabled">Launch coming soon</span>}
                {config.xUrl && <a className="nx-button nx-button-outline-dark" href={config.xUrl} target="_blank" rel="noreferrer">Follow updates <ArrowRight size={15}/></a>}
              </div>
            </div>

            <div className="nx-token-sculpture" data-reveal aria-label="$AVYRO token visualization">
              <div className="nx-sculpture-orbit nx-so1"/><div className="nx-sculpture-orbit nx-so2"/><div className="nx-sculpture-orbit nx-so3"/>
              <div className="nx-sculpture-disc"><img src="/assets/avyro-mark-black.png" alt=""/><span>AVYRO</span></div>
              <span className="nx-sculpture-tag nx-st1">ROBINHOOD CHAIN</span><span className="nx-sculpture-tag nx-st2">${config.ticker}</span><span className="nx-sculpture-tag nx-st3">OFFICIAL</span>
            </div>
          </div>
        </section>

        <section className="nx-section nx-coin-contract">
          <div className="nx-container">
            <div className="nx-contract-console" data-reveal>
              <div className="nx-contract-head"><span>OFFICIAL CONTRACT</span><div>ROBINHOOD CHAIN</div></div>
              <div className="nx-contract-address">
                <div><small>CONTRACT ADDRESS</small><strong title={config.contractAddress || "Contract address coming soon"}>{shortAddress(config.contractAddress)}</strong></div>
                <button type="button" onClick={copy} disabled={!live}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "COPIED" : "COPY CA"}</button>
              </div>
            </div>

            <div className="nx-coin-metrics" data-reveal>
              <article><span>01</span><small>TICKER</small><strong>${config.ticker}</strong><p>Official Avyro ecosystem symbol.</p></article>
              <article><span>02</span><small>NETWORK</small><strong>Robinhood Chain</strong><p>Arbitrum-powered EVM L2 · Chain ID 4663.</p></article>
              <article><span>03</span><small>LAUNCH</small><strong>Pons Launchpad</strong><p>Official launch access opens when the contract goes live.</p></article>
              <article><span>04</span><small>STATUS</small><strong>{live ? "Live" : "Coming soon"}</strong><p>Use Avyro-controlled links for contract and launch information.</p></article>
            </div>
          </div>
        </section>

        <section className="nx-section nx-coin-story">
          <div className="nx-container nx-coin-story-layout">
            <div data-reveal><span className="nx-index">AVYRO ECOSYSTEM</span><h2>One protocol.<br/>One official token page.</h2><p>$AVYRO is presented separately from the wallet experience so product security, token information, and launch access stay clear and easy to verify.</p></div>
            <div className="nx-coin-steps" data-reveal>
              <article><span>01</span><div><h3>Verified contract information</h3><p>The official contract address appears here as soon as the token launches.</p></div></article>
              <article><span>02</span><div><h3>Direct launch access</h3><p>The buy action opens the official Pons launch page for the live $AVYRO contract.</p></div></article>
              <article><span>03</span><div><h3>Official ecosystem links</h3><p>Use Avyro-controlled X and GitHub channels for protocol and launch updates.</p></div></article>
            </div>
          </div>
        </section>

        <section className="nx-coin-final">
          <div className="nx-container" data-reveal>
            <div><span className="nx-index nx-index-dark">OFFICIAL SOURCES</span><h2>Stay connected<br/>to Avyro.</h2><p>Protocol releases, developer updates, and ecosystem announcements are published through Avyro-controlled channels.</p></div>
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
