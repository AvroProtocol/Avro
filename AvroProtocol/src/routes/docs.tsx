import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, Code2, Fingerprint, Github, KeyRound, Network, ShieldCheck, Split, TerminalSquare, WalletCards } from "lucide-react";
import { AvroFooter, AvroHeader } from "@/components/AvroChrome";
import { usePageReveal } from "@/lib/use-page-reveal";
import "@/styles/avro-site.css";

export const Route = createFileRoute("/docs")({
  component: DocsPage,
  head: () => ({
    meta: [
      { title: "Docs | Avro Protocol" },
      { name: "description", content: "Avro Protocol technical documentation for threshold custody, ERC-4337 smart accounts, recovery, privacy, and the open TypeScript SDK." },
    ],
  }),
});

const HOME_LINKS = [
  ["Overview", "/#overview"],
  ["The problem", "/#research"],
  ["What Avro does", "/#product"],
  ["Architecture", "/#security"],
  ["The shard model", "/#security"],
  ["How a transaction signs", "/#security"],
  ["Security model", "/#security"],
  ["Privacy framework", "/#privacy"],
  ["Desktop application", "/#desktop"],
  ["Mobile application", "/#mobile"],
  ["Open SDK", "/#developers"],
  ["Network & roadmap", "/#roadmap"],
] as const;

const PRIMITIVES = [
  [Split, "2-of-3 threshold authorization", "Signing authority is distributed across the device shard, policy co-signer, and passkey recovery factor. Any two form quorum."],
  [WalletCards, "ERC-4337 smart accounts", "Avro prepares programmable UserOperations so account behavior can include policy checks, recovery, and gas sponsorship."],
  [Fingerprint, "Passkey recovery", "A hardware-backed recovery factor creates an independent path to rotate access without making one seed phrase the only backup."],
  [ShieldCheck, "Policy-aware co-signing", "The remote shard can apply spending limits, velocity rules, destination checks, and transaction-intent validation before co-signing."],
  [Network, "Robinhood Chain", "Avro targets Robinhood Chain with Chain ID 4663, native ETH for gas, and USDG as a core settlement asset."],
  [Code2, "Open TypeScript SDK", "The SDK exposes wallet, account, transfer, recovery, pay-link, bridge, staking, and guardrail primitives for developers."],
] as const;

function DocsPage() {
  usePageReveal();

  return (
    <div className="av-site nx-site">
      <AvroHeader />
      <main className="nx-docs-page">
        <section className="nx-docs-hero">
          <div className="nx-docs-grid" aria-hidden="true" />
          <div className="nx-container nx-docs-hero-inner">
            <div data-reveal>
              <span className="nx-index nx-index-dark">DOCUMENTATION</span>
              <h1>Build with the security model in view.</h1>
              <p>Technical reference for Avro threshold custody, smart accounts, recovery, privacy infrastructure, and developer tooling.</p>
              <div className="nx-docs-actions">
                <a className="nx-button nx-button-light" href="https://github.com/AvroProtocol/Avro" target="_blank" rel="noreferrer"><Github size={15}/> GitHub <ArrowUpRight size={14}/></a>
                <a className="nx-button nx-button-outline-dark" href="/#developers">Developer overview <ArrowRight size={14}/></a>
              </div>
            </div>
            <div className="nx-docs-terminal" data-reveal>
              <div><span/><span/><span/><b>avro.ts</b></div>
              <pre><code><em>import</em> {'{'} AvroWallet {'}'} <em>from</em>{'\n'}<strong>"@avro/protocol-sdk"</strong>;{'\n\n'}<em>const</em> wallet = <em>await</em> AvroWallet.connect();{'\n'}<em>await</em> wallet.transfer({'{'} asset: <strong>"USDG"</strong> {'}'});</code></pre>
              <footer><TerminalSquare size={14}/> threshold authorization prepared locally</footer>
            </div>
          </div>
        </section>

        <section className="nx-docs-body">
          <div className="nx-container nx-docs-layout">
            <aside className="nx-docs-side" data-reveal>
              <span>DOCUMENTATION</span>
              <p>Jump to the related section on the Avro home page.</p>
              <nav>{HOME_LINKS.map(([label, href]) => <a key={label} href={href}>{label}<ArrowUpRight size={12}/></a>)}</nav>
            </aside>

            <div className="nx-docs-content">
              <section data-reveal>
                <span className="nx-docs-kicker">01 / OVERVIEW</span>
                <h2>Avro Protocol</h2>
                <p className="nx-docs-lead">Avro is a self-custodial wallet and open developer toolkit designed around distributed signing. Funds remain controlled by a threshold smart account, while day-to-day payments can still feel like a normal application.</p>
                <div className="nx-docs-pills"><span>Non-custodial</span><span>2-of-3 threshold</span><span>ERC-4337</span><span>Robinhood Chain</span><span>Open TypeScript SDK</span></div>
              </section>

              <section data-reveal>
                <span className="nx-docs-kicker">02 / ARCHITECTURE</span>
                <h2>Three independent authorization paths.</h2>
                <p>The core model separates signing authority so a stolen device, a compromised service, or a lost recovery factor cannot independently authorize funds.</p>
                <div className="nx-docs-shards">
                  <article><b>A</b><div><strong>Device shard</strong><span>Encrypted in the local operating-system keystore.</span></div></article>
                  <article><b>B</b><div><strong>Policy co-signer</strong><span>Applies policy checks before contributing the second signature share.</span></div></article>
                  <article><b>C</b><div><strong>Passkey recovery</strong><span>Hardware-backed recovery factor for access rotation and recovery.</span></div></article>
                </div>
              </section>

              <section data-reveal>
                <span className="nx-docs-kicker">03 / SIGNING</span>
                <h2>How a transaction moves.</h2>
                <div className="nx-docs-flow">
                  <article><span>01</span><KeyRound/><h3>Build intent</h3><p>The client prepares an unsigned ERC-4337 UserOperation.</p></article>
                  <article><span>02</span><ShieldCheck/><h3>Apply policy</h3><p>Limits, velocity, destination, and transaction intent are checked.</p></article>
                  <article><span>03</span><Split/><h3>Form quorum</h3><p>Two independent signature shares satisfy the 2-of-3 authorization rule.</p></article>
                  <article><span>04</span><Network/><h3>Execute</h3><p>The smart account validates authorization and executes on Robinhood Chain.</p></article>
                </div>
              </section>

              <section data-reveal>
                <span className="nx-docs-kicker">04 / PRIMITIVES</span>
                <h2>The building blocks.</h2>
                <div className="nx-docs-primitives">{PRIMITIVES.map(([Icon,title,copy]) => <article key={title}><Icon size={18}/><h3>{title}</h3><p>{copy}</p></article>)}</div>
              </section>

              <section data-reveal>
                <span className="nx-docs-kicker">05 / SDK</span>
                <h2>Developer surface.</h2>
                <p>The open SDK is designed to expose Avro account and payment primitives without forcing applications to reimplement threshold orchestration.</p>
                <div className="nx-docs-code"><div><span>Package</span><code>@avro/protocol-sdk</code></div><div><span>Repository</span><a href="https://github.com/AvroProtocol/Avro" target="_blank" rel="noreferrer">github.com/AvroProtocol/Avro <ArrowUpRight size={12}/></a></div><div><span>Network</span><code>Robinhood Chain · 4663</code></div></div>
              </section>

              <section data-reveal>
                <span className="nx-docs-kicker">06 / EXPLORE</span>
                <h2>Continue through the product.</h2>
                <p>Each technical topic maps back to an interactive section on the main Avro experience.</p>
                <div className="nx-docs-explore"><a href="/#security">Security model <ArrowRight size={14}/></a><a href="/#privacy">Privacy framework <ArrowRight size={14}/></a><a href="/#mobile">Mobile experience <ArrowRight size={14}/></a><a href="/#research">Research <ArrowRight size={14}/></a><a href="/#roadmap">Roadmap <ArrowRight size={14}/></a></div>
              </section>
            </div>
          </div>
        </section>
      </main>
      <AvroFooter />
    </div>
  );
}
