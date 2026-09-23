import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BookUser,
  Check,
  Download,
  Fingerprint,
  Link2,
  Lock,
  Shield,
  Sliders,
  Smartphone,
  Zap,
} from "lucide-react";
import { AvroFooter, AvroHeader } from "@/components/AvroChrome";
import { usePageReveal } from "@/lib/use-page-reveal";
import { avroApiUrl } from "@/lib/api";
import "@/styles/avro-site.css";

export const Route = createFileRoute("/mobile")({
  component: MobilePage,
  head: () => ({
    meta: [
      { title: "Avro Mobile: Self-custody in your pocket" },
      { name: "description", content: "Avro mobile wallet for Robinhood Chain with 2-of-3 threshold security, spending guardrails, passkey recovery, and disposable pay links." },
    ],
  }),
});

const ANDROID_DOWNLOAD_URL = avroApiUrl("v1/downloads/android");

const FEATURES = [
  [Shield, "2-of-3 threshold security", "Device, policy co-signer, and recovery shard. Any two authorize. One never can."],
  [Sliders, "Spending guardrails", "Set transfer caps, rolling limits, and strict enforcement from the phone."],
  [BookUser, "Address poisoning defense", "Local contacts plus look-alike detection reduce copy-paste attack risk."],
  [Link2, "Disposable pay links", "Create one-time receive links that can sweep into the protected smart account."],
  [Fingerprint, "Passkey recovery", "Use a hardware-backed recovery path instead of relying on one seed phrase."],
  [Lock, "Panic freeze", "Suspend automated co-signing with a TOTP authenticator code if a device is compromised."],
] as const;

function MobilePage() {
  usePageReveal();
  const [release] = useState("Latest Android release");
  const downloadUrl = ANDROID_DOWNLOAD_URL;

  return (
    <div className="av-site">
      <AvroHeader />
      <main>
        <section className="av-mobile-hero">
          <div className="av-coin-grid" />
          <div className="av-container av-mobile-hero-grid">
            <div className="av-mobile-copy" data-reveal>
              <span className="av-kicker av-kicker-invert">Avro mobile</span>
              <h1>Self-custody,<br/><em>without the desktop.</em></h1>
              <p>Carry the same threshold security model into everyday payments. Send, receive, manage limits, generate pay links, and trigger emergency controls from a focused mobile client.</p>
              <div className="av-hero-actions">
                <a className="av-btn av-btn-light" href={downloadUrl}><Download size={16}/> Download APK</a>
                <a className="av-btn av-btn-dark-outline" href="/#security">See security model <ArrowRight size={15}/></a>
              </div>
              <div className="av-mobile-release"><span/><b>{release}</b><small>Robinhood Chain · Android</small></div>
            </div>

            <div className="av-phone-stage" data-reveal>
              <div className="av-phone-ring av-pr1"/><div className="av-phone-ring av-pr2"/>
              <div className="av-phone">
                <div className="av-phone-notch"/>
                <div className="av-phone-screen">
                  <div className="av-phone-top"><img src="/assets/avro-mark-white.png" alt=""/><span>AVRO</span><i/></div>
                  <div className="av-phone-balance"><small>Protected balance</small><strong>$12,480.52</strong><span>USDG + ETH</span></div>
                  <div className="av-phone-actions"><div><ArrowRight size={15}/><span>Send</span></div><div><Link2 size={15}/><span>Pay link</span></div><div><Sliders size={15}/><span>Limits</span></div></div>
                  <div className="av-phone-security"><Shield size={15}/><div><b>2-of-3 protected</b><small>Policy co-signer active</small></div><Check size={14}/></div>
                  <div className="av-phone-tx"><span/><div><b>USDG payment</b><small>Private send</small></div><strong>-120.00</strong></div>
                  <div className="av-phone-tx"><span/><div><b>Received</b><small>Stealth address</small></div><strong>+850.00</strong></div>
                </div>
              </div>
              <div className="av-phone-float av-pf1"><Zap size={13}/> Robinhood Chain</div>
              <div className="av-phone-float av-pf2"><Fingerprint size={13}/> Passkey recovery</div>
            </div>
          </div>
        </section>

        <section className="av-section">
          <div className="av-container">
            <div className="av-section-intro" data-reveal><div><span className="av-kicker">Mobile controls</span><h2>The security surface you actually need on a phone.</h2></div><p>Avro mobile focuses on account safety and payment execution instead of shrinking a desktop dashboard into a smaller screen.</p></div>
            <div className="av-mobile-feature-grid">{FEATURES.map(([Icon,title,copy]) => <article key={title} data-reveal><Icon/><span>Mobile primitive</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
          </div>
        </section>

        <section className="av-section av-section-black">
          <div className="av-container av-mobile-security" data-reveal>
            <div><span className="av-kicker av-kicker-invert">Emergency model</span><h2>Lost phone does not mean lost wallet.</h2><p>Shard A can be rotated using the independent recovery path. Panic freeze can stop automated co-signing while you restore access.</p></div>
            <div className="av-mobile-security-flow"><div><Smartphone/><b>Device lost</b></div><i/><div><Lock/><b>Freeze</b></div><i/><div><Fingerprint/><b>Recover</b></div><i/><div><Check/><b>Rotate</b></div></div>
          </div>
        </section>

        <section className="av-section">
          <div className="av-container av-mobile-download" data-reveal>
            <div><span className="av-kicker">Android release</span><h2>Install Avro Mobile.</h2><p>The Android build uses the same Robinhood Chain account model as desktop and the open SDK.</p></div>
            <a className="av-btn av-btn-solid" href={downloadUrl}><Download size={16}/> Download {release}</a>
          </div>
        </section>
      </main>
      <AvroFooter />
    </div>
  );
}
