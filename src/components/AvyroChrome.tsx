import { useState } from "react";
import { Download, Github, Menu, X } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAvyroConfig } from "@/lib/avyro-config";
import { avyroApiUrl } from "@/lib/api";

function XIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

const NAV = [
  ["Product", "/#product"],
  ["Security", "/#security"],
  ["Privacy", "/#privacy"],
  ["Developers", "/#developers"],
  ["Roadmap", "/#roadmap"],
  ["$AVYR", "/avyro"],
] as const;

export function AvyroHeader() {
  const [open, setOpen] = useState(false);
  const { config } = useAvyroConfig();

  return (
    <header className="av-header">
      <div className="av-header-shell">
        <a className="av-brand" href="/" aria-label="Avyro home" data-no-translate>
          <img src="/assets/avyro-mark-black.png" alt="" className="av-brand-mark" />
          <span>AVYRO</span>
        </a>

        <nav className="av-nav" aria-label="Primary navigation">
          {NAV.map(([label, href]) => (
            <a key={label} href={href} className={label === "$AVYR" ? "av-nav-token" : ""}>{label}</a>
          ))}
        </nav>

        <div className="av-header-actions">
          {config.xUrl && (
            <a className="av-icon-btn av-social-desktop" href={config.xUrl} target="_blank" rel="noreferrer" aria-label="Avyro on X"><XIcon /></a>
          )}
          {config.githubUrl && (
            <a className="av-icon-btn av-social-desktop" href={config.githubUrl} target="_blank" rel="noreferrer" aria-label="Avyro on GitHub"><Github size={17} /></a>
          )}
          <LanguageToggle className="av-language" />
          <ThemeToggle className="av-theme" />
          <a className="av-download-btn" href={avyroApiUrl("v1/downloads/windows")}><Download size={15} /><span>Download</span></a>
          <button className="av-menu-btn" type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="Toggle menu">
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <div className={`av-mobile-menu ${open ? "is-open" : ""}`}>
        <nav>{NAV.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}</nav>
        <div className="av-mobile-meta">
          {config.xUrl && <a href={config.xUrl} target="_blank" rel="noreferrer"><XIcon /> X</a>}
          {config.githubUrl && <a href={config.githubUrl} target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a>}
          <LanguageToggle className="av-language" onSelect={() => setOpen(false)} />
          <ThemeToggle className="av-theme" />
        </div>
      </div>
    </header>
  );
}

export function AvyroFooter() {
  const { config } = useAvyroConfig();
  return (
    <footer className="av-footer">
      <div className="av-footer-grid">
        <div className="av-footer-brand">
          <a href="/" className="av-brand" data-no-translate><img src="/assets/avyro-mark-white.png" alt="" className="av-brand-mark" /><span>AVYRO</span></a>
          <p>Private payments. Real ownership. Self-custody infrastructure for a more open financial world.</p>
        </div>
        <div className="av-footer-links">
          <div><span>Product</span><a href="/#product">Wallet</a><a href="/mobile">Mobile</a><a href="/#security">Security</a><a href="/avyro">$AVYR</a></div>
          <div><span>Build</span><a href="/#developers">SDK</a><a href="/docs.html">Docs</a><a href="/case-study.html">Research</a></div>
          <div><span>Network</span><a href="/#roadmap">Roadmap</a>{config.xUrl && <a href={config.xUrl}>X</a>}{config.githubUrl && <a href={config.githubUrl}>GitHub</a>}</div>
        </div>
      </div>
      <div className="av-footer-bottom"><span>© 2026 Avyro Protocol. All rights reserved.</span><span>Built for Robinhood Chain · Chain ID 4663</span></div>
    </footer>
  );
}
