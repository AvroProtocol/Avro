import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Code2,
  Download,
  Fingerprint,
  KeyRound,
  Layers3,
  LockKeyhole,
  Network,
  Orbit,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Split,
  TerminalSquare,
  WalletCards,
  Zap,
} from "lucide-react";
import { AvyroFooter, AvyroHeader } from "@/components/AvyroChrome";
import { useAvyroConfig } from "@/lib/avyro-config";
import { usePageReveal } from "@/lib/use-page-reveal";
import { avyroApiUrl } from "@/lib/api";
import "@/styles/avyro-site.css";

export const Route = createFileRoute("/")({
  component: AvyroLandingPage,
  head: () => ({
    meta: [
      { title: "Avyro Protocol: Private payments. Real ownership." },
      {
        name: "description",
        content: "Self-custodial payments on Robinhood Chain with 2-of-3 threshold security, smart accounts, passkey recovery, stealth receiving, and an open SDK.",
      },
    ],
  }),
});

const DOWNLOADS = [
  ["Windows", "Windows 10 / 11 · x64", avyroApiUrl("v1/downloads/windows")],
  ["macOS", "macOS 11+ · Apple Silicon", avyroApiUrl("v1/downloads/macos")],
  ["Linux", "Debian / AppImage", avyroApiUrl("v1/downloads/linux")],
] as const;

const ROADMAP = [
  ["01", "Live", "Threshold custody", "ERC-4337 accounts, 2-of-3 key sharding, passkey recovery, desktop and mobile clients."],
  ["02", "Live", "Open developer stack", "Typed Viem SDK, co-signer APIs, transaction guardrails, pay links, and account tooling."],
  ["03", "Building", "Swap and bridge rails", "USDG and ETH routing, bridge quotes, transparent spread measurement, and rebate flows."],
  ["04", "Next", "Privacy plane one", "Threshold ECDSA, blind co-signing, and policy proofs that minimize transaction profiling."],
  ["05", "Planned", "Privacy plane two", "ERC-5564 stealth addresses, receiver unlinkability, and screened privacy pools."],
  ["06", "Planned", "Global expansion", "Additional EVM adapters, more L2 networks, and portable recovery across every client."],
] as const;

const FAQS = [
  ["What is Avyro?", "Avyro is a self-custodial smart wallet and open developer platform built for private payments on Robinhood Chain. It combines ERC-4337 smart accounts, threshold key security, passkey recovery, payment links, swaps, and privacy infrastructure."],
  ["Who controls the wallet?", "You do. A wallet is protected by three independent shards. Your device holds one shard, the policy co-signer holds another, and a passkey-backed recovery path protects the third. Any two are required to authorize."],
  ["Can Avyro move funds by itself?", "No. The policy co-signer cannot spend alone. The account contract requires a valid threshold quorum before execution."],
  ["What happens if a device is lost?", "The recovery path can combine the passkey shard with the co-signer shard to rotate access or migrate funds without exposing a seed phrase."],
  ["Which network does Avyro support?", "Avyro is engineered for Robinhood Chain, an Arbitrum-powered EVM L2 with Chain ID 4663. Native ETH is used for gas and USDG is a core settlement asset."],
] as const;

function CustodyLab() {
  const [active, setActive] = useState([true, true, false]);
  const labels = [
    ["A", "Local device", "Encrypted OS keystore"],
    ["B", "Policy co-signer", "Rules, limits, anomaly checks"],
    ["C", "Passkey recovery", "Hardware-backed recovery"],
  ] as const;
  const count = active.filter(Boolean).length;
  const safe = count >= 2;

  const toggle = (index: number) => setActive(current => current.map((value, i) => i === index ? !value : value));

  return (
    <div className="av-custody-lab">
      <div className="av-custody-status">
        <div className={`av-quorum ${safe ? "is-safe" : ""}`}>
          <strong>{count}/3</strong>
          <span>{safe ? "Quorum ready" : "One more shard required"}</span>
        </div>
        <p>Toggle shards to see how the account remains usable without giving any single party control.</p>
      </div>
      <div className="av-shards">
        {labels.map((item, index) => (
          <button key={item[0]} type="button" className={active[index] ? "is-active" : ""} onClick={() => toggle(index)}>
            <span>{item[0]}</span>
            <div><strong>{item[1]}</strong><small>{item[2]}</small></div>
            <i>{active[index] ? <Check size={13} /> : null}</i>
          </button>
        ))}
      </div>
      <div className="av-lab-flow" aria-hidden="true">
        <div className={active[0] ? "on" : ""}>A</div><i />
        <div className={safe ? "on" : ""}><KeyRound size={17} /><b>QUORUM</b></div><i />
        <div className={active[1] || active[2] ? "on" : ""}>B/C</div>
      </div>
    </div>
  );
}

function AvyroLandingPage() {
  usePageReveal();
  const { config } = useAvyroConfig();
  const [openFaq, setOpenFaq] = useState(0);
  const [activeMode, setActiveMode] = useState<"send" | "receive" | "recover">("send");
  const heroRef = useRef<HTMLDivElement>(null);

  const activeModeCopy = useMemo(() => ({
    send: ["Private send", "Build and authorize an ERC-4337 UserOperation using a threshold signature and policy controls."],
    receive: ["Stealth receive", "Share one identity while receiving to one-time addresses derived from your stealth meta-address."],
    recover: ["Passkey recovery", "Restore access through an independent hardware-backed shard without exposing a seed phrase."],
  }[activeMode]), [activeMode]);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const move = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      node.style.setProperty("--mx", `${x * 22}px`);
      node.style.setProperty("--my", `${y * 22}px`);
    };
    node.addEventListener("pointermove", move);
    return () => node.removeEventListener("pointermove", move);
  }, []);

  return (
    <div className="av-site">
      <AvyroHeader />
      <main>
        <section className="av-hero" ref={heroRef}>
          <div className="av-hero-gridlines" />
          <div className="av-hero-orb av-hero-orb-one" />
          <div className="av-hero-orb av-hero-orb-two" />
          <div className="av-container av-hero-layout">
            <div className="av-hero-copy" data-reveal>
              <div className="av-eyebrow"><span /> Private payments · real ownership</div>
              <h1>Money should move.<br/><em>Control should not.</em></h1>
              <p>Avyro is self-custodial payment infrastructure for Robinhood Chain. Hold, send, swap, recover, and build with threshold security that removes the single key problem.</p>
              <div className="av-hero-actions">
                <a href="#product" className="av-btn av-btn-solid">Explore Avyro <ArrowRight size={16} /></a>
                <a href="/avyro" className="av-btn av-btn-outline">$AVYR <ArrowUpRight size={15} /></a>
              </div>
              <div className="av-proof-row">
                <span><b>2-of-3</b> threshold quorum</span>
                <span><b>ERC-4337</b> smart accounts</span>
                <span><b>4663</b> Robinhood Chain</span>
              </div>
            </div>

            <div className="av-hero-machine" data-reveal aria-label="Avyro threshold security visualization">
              <div className="av-machine-ring av-r1" /><div className="av-machine-ring av-r2" /><div className="av-machine-ring av-r3" />
              <div className="av-machine-core">
                <img src="/assets/avyro-mark-white.png" alt="" />
                <small>AVYRO</small>
              </div>
              <div className="av-machine-card av-mc-a"><span>A</span><strong>Device</strong><small>local shard</small></div>
              <div className="av-machine-card av-mc-b"><span>B</span><strong>Policy</strong><small>co-signer</small></div>
              <div className="av-machine-card av-mc-c"><span>C</span><strong>Passkey</strong><small>recovery</small></div>
              <div className="av-machine-label">NO SINGLE POINT OF FAILURE</div>
            </div>
          </div>
          <div className="av-ticker" aria-hidden="true"><div>{Array.from({ length: 2 }).flatMap(() => ["THRESHOLD CUSTODY", "PRIVATE PAYMENTS", "PASSKEY RECOVERY", "STEALTH RECEIVE", "OPEN SDK", "SMART ACCOUNTS", "ROBINHOOD CHAIN"]).map((item, i) => <span key={i}>{item}</span>)}</div></div>
        </section>

        <section className="av-section" id="product">
          <div className="av-container">
            <div className="av-section-intro" data-reveal>
              <div><span className="av-kicker">Product system</span><h2>One account.<br/>Multiple ways to stay in control.</h2></div>
              <p>Avyro separates custody from convenience. Everyday payments stay fast while control is distributed across independent security boundaries.</p>
            </div>

            <div className="av-mode-panel" data-reveal>
              <div className="av-mode-tabs">
                {(["send", "receive", "recover"] as const).map(mode => <button key={mode} className={activeMode === mode ? "active" : ""} onClick={() => setActiveMode(mode)}>{mode}</button>)}
              </div>
              <div className="av-mode-main">
                <div><span>ACTIVE FLOW</span><h3>{activeModeCopy[0]}</h3><p>{activeModeCopy[1]}</p><a href="#security">See the security model <ArrowRight size={15} /></a></div>
                <div className="av-mode-visual">
                  <div className="av-mode-node"><WalletCards size={20} /><span>Wallet</span></div>
                  <i /><div className="av-mode-gate"><Split size={22} /><b>2 / 3</b></div><i />
                  <div className="av-mode-node"><Network size={20} /><span>{activeMode === "recover" ? "Recovery" : "Chain"}</span></div>
                </div>
              </div>
            </div>

            <div className="av-feature-grid">
              <article data-reveal><ShieldCheck /><span>Threshold security</span><h3>Three independent shards. Two required.</h3><p>Device, policy co-signer, and passkey recovery each hold a separate part of the authorization path.</p></article>
              <article data-reveal><LockKeyhole /><span>Policy controls</span><h3>Security rules execute before signing.</h3><p>Velocity checks, spend limits, anomaly detection, and transaction intent validation can block risky requests.</p></article>
              <article data-reveal><Fingerprint /><span>Recovery</span><h3>No seed phrase as the only lifeline.</h3><p>Hardware-backed passkey recovery creates an independent route back into the wallet.</p></article>
              <article data-reveal><Orbit /><span>Privacy</span><h3>Receive without reusing the same destination.</h3><p>ERC-5564 stealth addressing creates one-time receive addresses while keeping a stable public identity.</p></article>
            </div>
          </div>
        </section>

        <section className="av-section av-section-black" id="security">
          <div className="av-container av-security-layout">
            <div data-reveal>
              <span className="av-kicker av-kicker-invert">Interactive custody lab</span>
              <h2>Security you can reason about.</h2>
              <p>Instead of hiding the security model behind marketing language, Avyro makes the quorum explicit. Two shards authorize. One shard never can.</p>
              <div className="av-security-points">
                <span><Check size={13} /> Local shard encrypted on device</span>
                <span><Check size={13} /> Policy-aware remote co-signer</span>
                <span><Check size={13} /> Passkey-backed recovery path</span>
              </div>
            </div>
            <div data-reveal><CustodyLab /></div>
          </div>
        </section>

        <section className="av-section" id="privacy">
          <div className="av-container">
            <div className="av-section-intro av-section-intro-tight" data-reveal>
              <div><span className="av-kicker">Privacy by layers</span><h2>Protect the payment graph, not just the interface.</h2></div>
              <p>Avyro combines one-time receive addresses, future blind co-signing, and screened privacy rails with a threshold account model.</p>
            </div>
            <div className="av-privacy-stage" data-reveal>
              <div className="av-privacy-radar"><span /><span /><span /><div><RadioTower size={25} /><b>PUBLIC IDENTITY</b><small>one handle</small></div></div>
              <div className="av-privacy-path"><i /><b>unlink</b><i /></div>
              <div className="av-stealth-stack">
                <div><span>01</span><strong>0x8A...1D7</strong><small>one-time destination</small></div>
                <div><span>02</span><strong>0x40...B92</strong><small>one-time destination</small></div>
                <div><span>03</span><strong>0xEF...318</strong><small>one-time destination</small></div>
              </div>
            </div>
          </div>
        </section>

        <section className="av-section av-dev-section" id="developers">
          <div className="av-container av-dev-grid">
            <div data-reveal>
              <span className="av-kicker">For developers</span>
              <h2>Put self-custody inside your product.</h2>
              <p>Use typed wallet primitives, smart-account utilities, transfer helpers, pay links, guardrails, and recovery flows from one TypeScript SDK.</p>
              <div className="av-dev-badges"><span>Viem</span><span>TypeScript</span><span>ERC-4337</span><span>MIT</span></div>
              <a className="av-btn av-btn-solid" href="/docs.html">Open SDK <ArrowUpRight size={15} /></a>
            </div>
            <div className="av-code-window" data-reveal>
              <div className="av-code-top"><span /><span /><span /><b>payment.ts</b></div>
              <pre><code><em>import</em> {'{'} AvyroWallet {'}'} <em>from</em>{'\n'}<strong>"@avyro/protocol-sdk"</strong>;{'\n\n'}<em>const</em> wallet = <em>await</em> AvyroWallet.connect();{'\n\n'}<em>await</em> wallet.transfer({'{'}{'\n'}  asset: <strong>"USDG"</strong>,{'\n'}  privacy: <strong>"stealth"</strong>,{'\n'}  policy: <strong>"standard"</strong>{'\n'}{'}'});</code></pre>
              <div className="av-code-foot"><TerminalSquare size={14} /> threshold authorization prepared locally</div>
            </div>
          </div>
        </section>

        <section className="av-section av-network-section">
          <div className="av-container">
            <div className="av-network-card" data-reveal>
              <div className="av-network-copy"><span className="av-kicker av-kicker-invert">Settlement rail</span><h2>Built around Robinhood Chain.</h2><p>Native ETH for gas and settlement. USDG as a core stablecoin rail. ERC-4337 execution for programmable accounts.</p><div className="av-network-stats"><div><b>4663</b><span>Chain ID</span></div><div><b>ETH</b><span>Native gas</span></div><div><b>USDG</b><span>Stablecoin rail</span></div></div></div>
              <div className="av-network-orbit"><div className="av-net-core">R</div><span className="av-net-n1">AVYRO</span><span className="av-net-n2">USDG</span><span className="av-net-n3">ETH</span><span className="av-net-n4">4337</span></div>
            </div>
          </div>
        </section>

        <section className="av-section" id="roadmap">
          <div className="av-container">
            <div className="av-section-intro" data-reveal><div><span className="av-kicker">Roadmap</span><h2>From secure custody to private financial infrastructure.</h2></div><p>The product expands in deliberate layers so privacy never comes at the cost of recoverability or user control.</p></div>
            <div className="av-roadmap">
              {ROADMAP.map((item, index) => (
                <article key={item[0]} data-reveal>
                  <b>{item[0]}</b><div><span className={index < 2 ? "live" : index === 2 ? "building" : ""}>{item[1]}</span><h3>{item[2]}</h3><p>{item[3]}</p></div><ArrowUpRight size={17} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="av-section av-token-tease">
          <div className="av-container av-token-grid" data-reveal>
            <div><span className="av-kicker">Avyro ecosystem</span><h2>{config.ticker}</h2><p>The protocol coin has its own page for launch access, contract verification, and official links. Product information stays separate from token information.</p><a href="/avyro" className="av-btn av-btn-solid">Open {config.ticker} page <ArrowRight size={15} /></a></div>
            <div className="av-token-mark"><img src="/assets/avyro-mark-white.png" alt="" /><div className="av-token-ring-one"/><div className="av-token-ring-two"/></div>
          </div>
        </section>

        <section className="av-section">
          <div className="av-container av-download-panel" data-reveal>
            <div><span className="av-kicker">Desktop client</span><h2>Run Avyro where your local shard lives.</h2><p>Keep Shard A encrypted inside the operating-system keystore and authorize transactions from a dedicated desktop client.</p></div>
            <div className="av-download-list">{DOWNLOADS.map(item => <a key={item[0]} href={item[2]}><Download size={17}/><div><strong>{item[0]}</strong><small>{item[1]}</small></div><ArrowRight size={15}/></a>)}</div>
          </div>
        </section>

        <section className="av-section av-faq-section">
          <div className="av-container av-faq-grid">
            <div data-reveal><span className="av-kicker">FAQ</span><h2>Clear answers for a security-first wallet.</h2><p>Avyro is designed to make the security model inspectable, not mysterious.</p></div>
            <div className="av-faq-list" data-reveal>{FAQS.map((item, index) => <article key={item[0]} className={openFaq === index ? "open" : ""}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{item[0]}</span><ChevronDown size={17}/></button><div><p>{item[1]}</p></div></article>)}</div>
          </div>
        </section>

        <section className="av-final-cta">
          <div className="av-container" data-reveal>
            <div><Sparkles size={18}/><span>AVYRO PROTOCOL</span></div>
            <h2>Private payments.<br/>Real ownership.</h2>
            <p>Self-custody infrastructure for a more open financial world.</p>
            <div className="av-hero-actions"><a href="#product" className="av-btn av-btn-light">Explore product <ArrowRight size={15}/></a>{config.xUrl && <a href={config.xUrl} className="av-btn av-btn-dark-outline">Follow Avyro <ArrowUpRight size={15}/></a>}</div>
          </div>
        </section>
      </main>
      <AvyroFooter />
    </div>
  );
}
