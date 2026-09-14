import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  BookOpen,
  Code2,
  Copy,
  Download,
  Fingerprint,
  KeyRound,
  Link2,
  LockKeyhole,
  Network,
  Orbit,
  RadioTower,
  ShieldCheck,
  Sliders,
  Smartphone,
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
      { title: "Avyro Protocol | Private payments. Real ownership." },
      {
        name: "description",
        content: "Self-custodial payment infrastructure with 2-of-3 threshold security, ERC-4337 smart accounts, passkey recovery, privacy rails, and an open SDK.",
      },
    ],
  }),
});

const DOWNLOADS = [
  ["Windows", "Windows 10 / 11 · x64", avyroApiUrl("v1/downloads/windows")],
  ["macOS", "macOS 11+ · Apple Silicon", avyroApiUrl("v1/downloads/macos")],
  ["Linux", "Debian / AppImage", avyroApiUrl("v1/downloads/linux")],
] as const;

const ANDROID_DOWNLOAD_URL = avyroApiUrl("v1/downloads/android");

const ROADMAP = [
  ["01", "LIVE", "Threshold custody", "ERC-4337 accounts, 2-of-3 key sharding, passkey recovery, desktop and mobile clients."],
  ["02", "LIVE", "Open developer stack", "Typed Viem SDK, co-signer APIs, transaction guardrails, pay links, and account tooling."],
  ["03", "BUILDING", "Swap and bridge rails", "USDG and ETH routing, bridge quotes, transparent spread measurement, and rebate flows."],
  ["04", "NEXT", "Privacy plane one", "Threshold ECDSA, blind co-signing, and policy proofs that minimize transaction profiling."],
  ["05", "PLANNED", "Privacy plane two", "ERC-5564 stealth addresses, receiver unlinkability, and screened privacy pools."],
  ["06", "PLANNED", "Global expansion", "Additional EVM adapters, more L2 networks, and portable recovery across every client."],
] as const;

const FAQS = [
  ["What is Avyro?", "Avyro is a self-custodial smart wallet and open developer platform for private payments. It combines ERC-4337 smart accounts, threshold key security, passkey recovery, payment links, swaps, and privacy infrastructure."],
  ["Who controls the wallet?", "You do. A wallet is protected by three independent shards. Your device holds one shard, the policy co-signer holds another, and a passkey-backed recovery path protects the third. Any two are required to authorize."],
  ["Can Avyro move funds by itself?", "No. The policy co-signer cannot spend alone. The account contract requires a valid threshold quorum before execution."],
  ["What happens if a device is lost?", "The recovery path can combine the passkey shard with the co-signer shard to rotate access or migrate funds without exposing a seed phrase."],
  ["Which network does Avyro support?", "Avyro is engineered for Robinhood Chain, an Arbitrum-powered EVM L2 with Chain ID 4663. Native ETH is used for gas and USDG is a core settlement asset."],
] as const;

const HERO_WORDS = ["OWN IT.", "MOVE IT.", "KEEP IT PRIVATE."] as const;

const MOBILE_FEATURES = [
  [ShieldCheck, "2-of-3 protection", "Device, policy co-signer, and recovery shard keep mobile authorization distributed."],
  [Sliders, "Spending guardrails", "Transfer caps, rolling limits, and policy checks stay visible before you sign."],
  [Link2, "Disposable pay links", "Create focused payment links without exposing the main wallet flow."],
  [Fingerprint, "Passkey recovery", "Recover and rotate access with an independent hardware-backed factor."],
] as const;

const RESEARCH = [
  ["01", "Wallet drainers", "$494M wallet drainer losses", "Wallet drainers show why one valid signature should never control an entire balance.", "/case-study/higher-lead-conversion.html"],
  ["02", "Custodial collapse", "$9B custodial liabilities", "FTX shows how custodial convenience becomes counterparty risk when users cannot verify control.", "/case-study/fewer-missed-calls.html"],
  ["03", "Recovery design", "3-party recovery debate", "Hardware recovery debates show why seed phrases remain a fragile default for mainstream users.", "/case-study/lower-support-costs.html"],
  ["04", "Compliant privacy", "2025 Privacy Pools launch", "Privacy after Tornado Cash requires clean provenance without rebuilding a public transaction graph.", "/case-study/41-faster-resolution.html"],
] as const;

function shortAddress(address: string) {
  if (!address) return "Contract address coming soon";
  if (address.length < 20) return address;
  return `${address.slice(0, 10)}…${address.slice(-8)}`;
}

function QuorumEngine() {
  const [active, setActive] = useState([true, true, false]);
  const labels = [
    ["A", "DEVICE", "LOCAL SHARD"],
    ["B", "POLICY", "CO-SIGNER"],
    ["C", "PASSKEY", "RECOVERY"],
  ] as const;
  const count = active.filter(Boolean).length;
  const ready = count >= 2;

  return (
    <div className="nx-quorum">
      <div className="nx-quorum-radar" aria-hidden="true">
        <i className="nx-radar-ring nx-ring-one" />
        <i className="nx-radar-ring nx-ring-two" />
        <i className="nx-radar-ring nx-ring-three" />
        <span className="nx-radar-scan" />
        <div className={`nx-quorum-core ${ready ? "is-ready" : ""}`}>
          <img src="/assets/avyro-mark-white.png" alt="" />
          <b>{count}/3</b>
          <small>{ready ? "QUORUM READY" : "NEED 2 SHARDS"}</small>
        </div>
        {labels.map((item, index) => (
          <button
            type="button"
            key={item[0]}
            className={`nx-shard nx-shard-${index + 1} ${active[index] ? "is-active" : ""}`}
            onClick={() => setActive(current => current.map((value, i) => i === index ? !value : value))}
          >
            <span>{item[0]}</span><strong>{item[1]}</strong><small>{item[2]}</small><i>{active[index] ? <Check size={11} /> : null}</i>
          </button>
        ))}
      </div>
      <div className="nx-quorum-caption"><span>CLICK SHARDS</span><p>Any two authorize. No single device, service, or recovery factor can move funds alone.</p></div>
    </div>
  );
}

function FlowDeck() {
  const [mode, setMode] = useState<"send" | "receive" | "recover">("send");
  const copy = useMemo(() => ({
    send: ["Private send", "Build a UserOperation locally, apply policy, collect the threshold quorum, then execute."],
    receive: ["Stealth receive", "Share one identity while receiving to fresh one-time destinations designed to reduce address reuse."],
    recover: ["Passkey recovery", "Use an independent hardware-backed recovery shard to rotate access without a seed phrase."],
  }[mode]), [mode]);

  return (
    <div className="nx-flow-deck" data-reveal>
      <div className="nx-flow-tabs">
        {(["send", "receive", "recover"] as const).map((item, index) => (
          <button type="button" key={item} className={mode === item ? "is-active" : ""} onClick={() => setMode(item)}><span>0{index + 1}</span>{item}</button>
        ))}
      </div>
      <div className="nx-flow-body">
        <div className="nx-flow-copy">
          <span>ACTIVE FLOW</span>
          <h3 key={mode}>{copy[0]}</h3>
          <p>{copy[1]}</p>
          <a href="#security">Inspect security model <ArrowRight size={15} /></a>
        </div>
        <div className={`nx-flow-map nx-flow-${mode}`}>
          <div className="nx-flow-node"><WalletCards size={20} /><b>WALLET</b><small>intent</small></div>
          <div className="nx-flow-line"><i /></div>
          <div className="nx-flow-gate"><Split size={21} /><b>2 / 3</b><small>quorum</small></div>
          <div className="nx-flow-line"><i /></div>
          <div className="nx-flow-node"><Network size={20} /><b>{mode === "recover" ? "ACCESS" : "CHAIN"}</b><small>{mode}</small></div>
        </div>
      </div>
    </div>
  );
}

function AvyroLandingPage() {
  usePageReveal();
  const { config, buyUrl } = useAvyroConfig();
  const [openFaq, setOpenFaq] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setWordIndex(index => (index + 1) % HERO_WORDS.length), 2400);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const move = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      node.style.setProperty("--spot-x", `${x}%`);
      node.style.setProperty("--spot-y", `${y}%`);
      node.style.setProperty("--tilt-x", `${((event.clientX - rect.left) / rect.width - .5) * 18}px`);
      node.style.setProperty("--tilt-y", `${((event.clientY - rect.top) / rect.height - .5) * 18}px`);
    };
    node.addEventListener("pointermove", move);
    return () => node.removeEventListener("pointermove", move);
  }, []);

  const copyCa = async () => {
    if (!config.contractAddress || !navigator.clipboard) return;
    await navigator.clipboard.writeText(config.contractAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="av-site nx-site">
      <AvyroHeader />
      <main>
        <section className="nx-hero" id="overview" ref={heroRef}>
          <div className="nx-hero-noise" />
          <div className="nx-hero-grid" />
          <div className="nx-hero-ghost" aria-hidden="true">AVYRO</div>
          <div className="nx-hero-rail nx-rail-left" aria-hidden="true"><span>01</span><i /><span>06</span></div>
          <div className="nx-container nx-hero-layout">
            <div className="nx-hero-copy" data-reveal>
              <div className="nx-live-pill"><i /><span>SELF-CUSTODY INFRASTRUCTURE</span><b>ROBINHOOD CHAIN</b></div>
              <p className="nx-overline">PRIVATE PAYMENTS / REAL OWNERSHIP / OPEN INFRASTRUCTURE</p>
              <h1>YOUR MONEY.<br/><span key={wordIndex}>{HERO_WORDS[wordIndex]}</span></h1>
              <p className="nx-hero-lead">Avyro turns smart-account security into a product you can actually use. Pay, receive, swap, recover, and build without handing one key or one company total control.</p>
              <div className="nx-hero-actions">
                <a href="#product" className="nx-button nx-button-primary">Enter the protocol <ArrowRight size={16} /></a>
                <a href="/avyro" className="nx-button nx-button-ghost">${config.ticker} <ArrowUpRight size={15} /></a>
              </div>
              <div className="nx-proof-strip">
                <div><b>2 / 3</b><span>THRESHOLD QUORUM</span></div>
                <div><b>4337</b><span>SMART ACCOUNTS</span></div>
                <div><b>4663</b><span>CHAIN ID</span></div>
              </div>
            </div>

            <div className="nx-hero-engine" data-reveal>
              <QuorumEngine />
            </div>
          </div>
          <a className="nx-scroll-cue" href="#download"><span>DOWNLOAD AVYRO</span><ArrowDown size={14} /></a>
          <div className="nx-hero-marquee" aria-hidden="true"><div>{Array.from({ length: 2 }).flatMap(() => ["THRESHOLD SECURITY", "PRIVATE PAYMENTS", "PASSKEY RECOVERY", "STEALTH RECEIVE", "OPEN SDK", "SMART ACCOUNTS"]).map((item, i) => <span key={i}>{item}<b>✦</b></span>)}</div></div>
        </section>

        <section className="nx-quick-downloads" id="download">
          <div className="nx-container nx-quick-download-panel" data-reveal>
            <div className="nx-quick-download-copy">
              <span className="nx-index">GET AVYRO</span>
              <h2>Choose your client.</h2>
              <p>Install the native AVYRO client directly from the official release channel.</p>
            </div>
            <div className="nx-quick-download-grid">
              <a href={ANDROID_DOWNLOAD_URL} className="nx-quick-download-card">
                <span>01</span><Smartphone size={20}/><div><strong>Android APK</strong><small>Direct APK download</small></div><Download size={17}/>
              </a>
              <a href={DOWNLOADS[0][2]} className="nx-quick-download-card">
                <span>02</span><TerminalSquare size={20}/><div><strong>Windows</strong><small>Windows 10 / 11 · x64</small></div><Download size={17}/>
              </a>
              <a href={DOWNLOADS[1][2]} className="nx-quick-download-card">
                <span>03</span><Orbit size={20}/><div><strong>macOS</strong><small>Apple Silicon · macOS 11+</small></div><Download size={17}/>
              </a>
            </div>
          </div>
        </section>

        <section className="nx-section nx-product" id="product">
          <div className="nx-container">
            <div className="nx-section-head" data-reveal>
              <div><span className="nx-index">01 / PRODUCT</span><h2>Security without the ceremony.</h2></div>
              <p>Everyday flows stay familiar. Underneath, authorization is split across independent security boundaries so convenience does not become custody.</p>
            </div>
            <FlowDeck />

            <div className="nx-bento">
              <article className="nx-bento-large" data-reveal>
                <div className="nx-card-top"><ShieldCheck size={20} /><span>THRESHOLD CORE</span><b>01</b></div>
                <h3>One wallet.<br/>No single master key.</h3>
                <p>Device, policy co-signer, and passkey recovery create three independent authorization paths. Any two can form quorum.</p>
                <div className="nx-card-visual nx-bars" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
              </article>
              <article data-reveal>
                <div className="nx-card-top"><LockKeyhole size={20} /><span>POLICY</span><b>02</b></div>
                <h3>Rules before signatures.</h3><p>Spend limits, velocity checks, intent validation, and anomaly controls can stop unsafe requests before execution.</p>
                <div className="nx-mini-terminal"><span>policy.check()</span><b>PASS</b></div>
              </article>
              <article data-reveal>
                <div className="nx-card-top"><Fingerprint size={20} /><span>RECOVERY</span><b>03</b></div>
                <h3>A recovery path that is not a seed phrase.</h3><p>Hardware-backed passkeys create an independent route to rotate access when a device disappears.</p>
                <div className="nx-fingerprint-wave" aria-hidden="true"><i/><i/><i/><i/><i/></div>
              </article>
              <article className="nx-bento-wide" data-reveal>
                <div className="nx-card-top"><Orbit size={20} /><span>PRIVACY LAYER</span><b>04</b></div>
                <div className="nx-wide-content"><div><h3>Use one identity. Receive to fresh destinations.</h3><p>Stealth addressing is designed to reduce address reuse while keeping the receiver experience simple.</p></div><div className="nx-stealth-mini"><span>IDENTITY</span><i/><b>0x8A…1D7</b><b>0x40…B92</b><b>0xEF…318</b></div></div>
              </article>
            </div>
          </div>
        </section>

        <section className="nx-section nx-security" id="security">
          <div className="nx-security-grid" aria-hidden="true" />
          <div className="nx-container nx-security-layout">
            <div className="nx-security-copy" data-reveal>
              <span className="nx-index nx-index-dark">02 / SECURITY</span>
              <h2>Trust the quorum.<br/>Not a custodian.</h2>
              <p>Avyro makes the security boundary visible. A remote service cannot spend alone. A stolen device cannot spend alone. Recovery cannot spend alone.</p>
              <div className="nx-security-list">
                <span><Check size={13} /> Local shard encrypted on device</span>
                <span><Check size={13} /> Policy-aware remote co-signer</span>
                <span><Check size={13} /> Hardware-backed recovery factor</span>
                <span><Check size={13} /> Smart-account execution</span>
              </div>
            </div>
            <div className="nx-security-console" data-reveal>
              <div className="nx-console-top"><span>LIVE AUTHORIZATION TRACE</span><i /><i /><i /></div>
              <div className="nx-console-body">
                <div><span>00:00.041</span><b>intent</b><p>transfer / USDG / private</p><em>OK</em></div>
                <div><span>00:00.083</span><b>policy</b><p>limits + destination checks</p><em>OK</em></div>
                <div><span>00:00.127</span><b>shard_a</b><p>local signature share</p><em>READY</em></div>
                <div><span>00:00.171</span><b>shard_b</b><p>policy signature share</p><em>READY</em></div>
                <div className="is-final"><span>00:00.204</span><b>quorum</b><p>2-of-3 authorization complete</p><em>EXECUTE</em></div>
              </div>
              <div className="nx-console-wave" aria-hidden="true">{Array.from({ length: 32 }).map((_, i) => <i key={i} style={{ height: `${18 + ((i * 17) % 52)}%` }} />)}</div>
            </div>
          </div>
        </section>

        <section className="nx-section nx-privacy" id="privacy">
          <div className="nx-container">
            <div className="nx-section-head" data-reveal>
              <div><span className="nx-index">03 / PRIVACY</span><h2>Make the payment graph harder to read.</h2></div>
              <p>Privacy is layered into receiving and authorization rather than painted over the interface. The roadmap extends that model into blind co-signing and screened privacy rails.</p>
            </div>
            <div className="nx-privacy-stage" data-reveal>
              <div className="nx-identity-orbit">
                <div className="nx-orbit-ring nx-o1"/><div className="nx-orbit-ring nx-o2"/><div className="nx-orbit-ring nx-o3"/>
                <div className="nx-identity-core"><RadioTower size={23}/><b>PUBLIC ID</b><small>ONE IDENTITY</small></div>
                <span className="nx-orbit-dot nx-dot-a"/><span className="nx-orbit-dot nx-dot-b"/><span className="nx-orbit-dot nx-dot-c"/>
              </div>
              <div className="nx-privacy-bridge"><span>DERIVE</span><i/><b>UNLINK</b><i/><span>RECEIVE</span></div>
              <div className="nx-address-stack">
                {["0x8A51…1D7", "0x40D2…B92", "0xEF09…318"].map((address, index) => <div key={address}><span>0{index + 1}</span><strong>{address}</strong><small>ONE-TIME DESTINATION</small><i /></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="nx-type-break" aria-hidden="true"><div>AVYRO <span>AVYRO</span> AVYRO <span>AVYRO</span></div></section>

        <section className="nx-section nx-developers" id="developers">
          <div className="nx-container nx-dev-layout">
            <div className="nx-dev-copy" data-reveal>
              <span className="nx-index">04 / DEVELOPERS</span>
              <h2>Make self-custody a primitive.</h2>
              <p>Typed wallet primitives, smart-account utilities, transfers, pay links, guardrails, and recovery flows from one TypeScript SDK.</p>
              <div className="nx-chip-row"><span>VIEM</span><span>TYPESCRIPT</span><span>ERC-4337</span><span>MIT</span></div>
              <a className="nx-button nx-button-primary" href="/docs">Read the SDK docs <ArrowUpRight size={15}/></a>
            </div>
            <div className="nx-code" data-reveal>
              <div className="nx-code-head"><span><i/><i/><i/></span><b>payment.ts</b><em>READY</em></div>
              <pre><code><span>01</span> <i>import</i> {'{'} AvyroWallet {'}'} <i>from</i> <b>"@avyro/protocol-sdk"</b>;{`\n`}<span>02</span>{`\n`}<span>03</span> <i>const</i> wallet = <i>await</i> AvyroWallet.connect();{`\n`}<span>04</span>{`\n`}<span>05</span> <i>await</i> wallet.transfer({'{'}{`\n`}<span>06</span>   asset: <b>"USDG"</b>,{`\n`}<span>07</span>   privacy: <b>"stealth"</b>,{`\n`}<span>08</span>   policy: <b>"standard"</b>{`\n`}<span>09</span> {'}'});</code></pre>
              <div className="nx-code-foot"><TerminalSquare size={14}/><span>threshold authorization prepared locally</span><i /></div>
            </div>
          </div>
        </section>

        <section className="nx-section nx-network" id="network">
          <div className="nx-container">
            <div className="nx-network-panel" data-reveal>
              <div className="nx-network-copy"><span className="nx-index nx-index-dark">05 / SETTLEMENT</span><h2>Built around Robinhood Chain.</h2><p>Native ETH for gas and settlement. USDG as a core stablecoin rail. ERC-4337 execution for programmable accounts.</p><div className="nx-network-stats"><div><b>4663</b><span>CHAIN ID</span></div><div><b>ETH</b><span>NATIVE GAS</span></div><div><b>USDG</b><span>STABLE RAIL</span></div></div></div>
              <div className="nx-network-map" aria-hidden="true"><div className="nx-net-center"><img src="/assets/avyro-mark-white.png" alt=""/></div><i className="nx-net-ring nx-net-r1"/><i className="nx-net-ring nx-net-r2"/><span className="nx-net-a">4337</span><span className="nx-net-b">ETH</span><span className="nx-net-c">USDG</span><span className="nx-net-d">4663</span></div>
            </div>
          </div>
        </section>

        <section className="nx-section nx-mobile-home" id="mobile">
          <div className="nx-container nx-mobile-home-layout">
            <div className="nx-mobile-home-copy" data-reveal>
              <span className="nx-index nx-index-dark">06 / MOBILE</span>
              <h2>Self-custody that moves with you.</h2>
              <p>The mobile experience is now part of the core Avyro story. Send, receive, manage limits, create pay links, and recover access without shrinking a desktop dashboard into a phone.</p>
              <div className="nx-mobile-feature-list">
                {MOBILE_FEATURES.map(([Icon, title, copy]) => <article key={title}><Icon size={18}/><div><b>{title}</b><span>{copy}</span></div></article>)}
              </div>
              <div className="nx-mobile-home-actions"><a className="nx-button nx-button-light" href={ANDROID_DOWNLOAD_URL}><Download size={15}/> Download Android</a><a className="nx-button nx-button-outline-dark" href="#security">Security model <ArrowRight size={15}/></a></div>
            </div>
            <div className="nx-mobile-device-stage" data-reveal aria-label="Avyro mobile wallet preview">
              <div className="nx-mobile-orbit nx-mobile-orbit-a"/><div className="nx-mobile-orbit nx-mobile-orbit-b"/>
              <div className="nx-mobile-phone">
                <div className="nx-mobile-notch"/>
                <div className="nx-mobile-screen">
                  <div className="nx-mobile-top"><img src="/assets/avyro-mark-white.png" alt=""/><span>AVYRO</span><i/></div>
                  <small>PROTECTED BALANCE</small><strong>$12,480.52</strong><em>USDG + ETH</em>
                  <div className="nx-mobile-actions"><span><ArrowRight size={14}/>SEND</span><span><Link2 size={14}/>PAY LINK</span><span><Sliders size={14}/>LIMITS</span></div>
                  <div className="nx-mobile-security-card"><ShieldCheck size={17}/><div><b>2-of-3 protected</b><small>Policy co-signer active</small></div><Check size={14}/></div>
                  <div className="nx-mobile-row"><i/><div><b>Private send</b><small>USDG payment</small></div><span>-120.00</span></div>
                  <div className="nx-mobile-row"><i/><div><b>Stealth receive</b><small>One-time address</small></div><span>+850.00</span></div>
                </div>
              </div>
              <span className="nx-mobile-float nx-mf-a"><Smartphone size={13}/> MOBILE CONTROL</span>
              <span className="nx-mobile-float nx-mf-b"><Fingerprint size={13}/> PASSKEY RECOVERY</span>
            </div>
          </div>
        </section>

        <section className="nx-section nx-research" id="research">
          <div className="nx-container">
            <div className="nx-section-head" data-reveal>
              <div><span className="nx-index">07 / RESEARCH</span><h2>Product decisions backed by real failure modes.</h2></div>
              <p>The former case-study page is now surfaced directly on the home page so the security thesis is visible beside the product it shaped.</p>
            </div>
            <div className="nx-research-grid">
              {RESEARCH.map(([index, label, metric, title, href]) => <a key={index} href={href} className="nx-research-card" data-reveal><div className="nx-research-card-top"><span>{index}</span><b>{label}</b><ArrowUpRight size={16}/></div><h3>{title}</h3><div className="nx-research-meta"><BookOpen size={14}/><span>{metric}</span></div></a>)}
            </div>
          </div>
        </section>

        <section className="nx-section nx-token" id="token">
          <div className="nx-container nx-token-panel" data-reveal>
            <div className="nx-token-title"><span className="nx-index nx-index-dark">08 / ECOSYSTEM</span><h2><small>$</small>{config.ticker}</h2><p>Official launch access and the verified contract address will appear here when $AVYRO goes live.</p></div>
            <div className="nx-token-live">
              <div className="nx-ca-label"><span><i className={config.contractAddress ? "is-live" : ""}/>CONTRACT ADDRESS</span><b>{config.contractAddress ? "LIVE" : "COMING SOON"}</b></div>
              <button type="button" className="nx-ca-box" onClick={copyCa} disabled={!config.contractAddress} title={config.contractAddress || "Contract address coming soon"}><span>{shortAddress(config.contractAddress)}</span>{config.contractAddress && (copied ? <Check size={16}/> : <Copy size={16}/>)}</button>
              <div className="nx-token-actions"><a href="/avyro" className="nx-button nx-button-light">Token page <ArrowRight size={15}/></a>{buyUrl ? <a href={buyUrl} target="_blank" rel="noreferrer" className="nx-button nx-button-outline-dark">Buy ${config.ticker} <ArrowUpRight size={15}/></a> : <span className="nx-button nx-button-outline-dark is-disabled">Buy coming soon</span>}</div>
            </div>
          </div>
        </section>

        <section className="nx-section nx-roadmap" id="roadmap">
          <div className="nx-container">
            <div className="nx-section-head" data-reveal><div><span className="nx-index">09 / ROADMAP</span><h2>Build the trust layer first. Expand from there.</h2></div><p>Each phase adds capability without making recoverability, authorization, or ownership harder to reason about.</p></div>
            <div className="nx-roadmap-list">
              {ROADMAP.map((item, index) => <article key={item[0]} data-reveal><span>{item[0]}</span><b className={index < 2 ? "is-live" : index === 2 ? "is-building" : ""}>{item[1]}</b><h3>{item[2]}</h3><p>{item[3]}</p><ArrowUpRight size={17}/></article>)}
            </div>
          </div>
        </section>

        <section className="nx-section nx-downloads" id="desktop">
          <div className="nx-container nx-download-panel" data-reveal>
            <div><span className="nx-index nx-index-dark">DESKTOP CLIENT</span><h2>Your local shard deserves a local home.</h2><p>Keep Shard A encrypted inside the operating-system keystore and authorize transactions from a dedicated desktop client.</p></div>
            <div className="nx-download-list">{DOWNLOADS.map((item, index) => <a key={item[0]} href={item[2]}><span>0{index + 1}</span><Download size={16}/><div><strong>{item[0]}</strong><small>{item[1]}</small></div><ArrowUpRight size={15}/></a>)}</div>
          </div>
        </section>

        <section className="nx-section nx-faq">
          <div className="nx-container nx-faq-layout">
            <div data-reveal><span className="nx-index">10 / FAQ</span><h2>Security should be explainable.</h2><p>No mystery boxes. Start with the model, then inspect the implementation.</p></div>
            <div className="nx-faq-list" data-reveal>{FAQS.map((item, index) => <article key={item[0]} className={openFaq === index ? "is-open" : ""}><button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>0{index + 1}</span><b>{item[0]}</b><ChevronDown size={17}/></button><div><p>{item[1]}</p></div></article>)}</div>
          </div>
        </section>

        <section className="nx-final">
          <div className="nx-final-grid" aria-hidden="true"/>
          <div className="nx-container" data-reveal>
            <div className="nx-final-mark"><img src="/assets/avyro-mark-white.png" alt=""/><span><Sparkles size={14}/> AVYRO PROTOCOL</span></div>
            <h2>Keep the keys.<br/>Move the value.</h2>
            <p>Private payments and programmable self-custody for a more open financial world.</p>
            <div className="nx-hero-actions"><a href="#product" className="nx-button nx-button-light">Explore Avyro <ArrowRight size={15}/></a>{config.xUrl && <a href={config.xUrl} target="_blank" rel="noreferrer" className="nx-button nx-button-outline-dark">Follow on X <ArrowUpRight size={15}/></a>}</div>
          </div>
        </section>
      </main>
      <AvyroFooter />
    </div>
  );
}
