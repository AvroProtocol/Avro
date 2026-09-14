import { useEffect, useState } from "react";
import { ArrowUpRight, Download, Github, Menu, X } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAvyroConfig } from "@/lib/avyro-config";
import { avyroApiUrl } from "@/lib/api";

function XIcon({ size = 16 }: { size?: number }) {
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
  ["Docs", "/docs"],
] as const;

export function AvyroHeader() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { config } = useAvyroConfig();

  useEffect(() => {
    const update = () => {
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setProgress(Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header className="avx-header">
      <div className="avx-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <div className="avx-shell">
        <a className="avx-brand" href="/" aria-label="Avyro home" data-no-translate>
          <span className="avx-brand-orbit"><img src="/assets/avyro-mark-black.png" alt="" /></span>
          <span className="avx-wordmark">AVYRO</span>
        </a>

        <nav className="avx-nav" aria-label="Primary navigation">
          {NAV.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </nav>

        <div className="avx-actions">
          <a className="avx-token" href="/avyro"><span />${config.ticker}<ArrowUpRight size={13} /></a>
          {config.xUrl && <a className="avx-icon avx-social" href={config.xUrl} target="_blank" rel="noreferrer" aria-label="Avyro on X"><XIcon /></a>}
          {config.githubUrl && <a className="avx-icon avx-social" href={config.githubUrl} target="_blank" rel="noreferrer" aria-label="Avyro on GitHub"><Github size={16} /></a>}
          <LanguageToggle className="avx-language" />
          <ThemeToggle className="avx-theme" />
          <a className="avx-download" href={avyroApiUrl("v1/downloads/windows")}><Download size={14} /><span>Desktop</span></a>
          <button className="avx-menu" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label="Toggle navigation">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div className={`avx-mobile ${open ? "is-open" : ""}`}>
        <div className="avx-mobile-grid">
          {NAV.map(([label, href], index) => (
            <a key={label} href={href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{label}<ArrowUpRight size={15} /></a>
          ))}
          <a href="/avyro" onClick={() => setOpen(false)}><span>07</span>${config.ticker}<ArrowUpRight size={15} /></a>
        </div>
        <div className="avx-mobile-tools">
          {config.xUrl && <a href={config.xUrl} target="_blank" rel="noreferrer"><XIcon /> X</a>}
          {config.githubUrl && <a href={config.githubUrl} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>}
          <LanguageToggle className="avx-language" onSelect={() => setOpen(false)} />
          <ThemeToggle className="avx-theme" />
        </div>
      </div>
    </header>
  );
}

export function AvyroFooter() {
  const { config } = useAvyroConfig();
  return (
    <footer className="avx-footer">
      <div className="avx-footer-marquee" aria-hidden="true">
        <div>{Array.from({ length: 2 }).flatMap(() => ["AVYRO", "PRIVATE PAYMENTS", "REAL OWNERSHIP", "2-OF-3 SECURITY", "OPEN SDK"]).map((item, index) => <span key={`${item}-${index}`}>{item}<i>✦</i></span>)}</div>
      </div>
      <div className="avx-footer-inner">
        <div className="avx-footer-brand">
          <a href="/" className="avx-footer-logo" data-no-translate><img src="/assets/avyro-mark-white.png" alt="" /><span>AVYRO</span></a>
          <p>Self-custodial payment infrastructure built around privacy, programmable accounts, and distributed control.</p>
          <div className="avx-footer-signal"><i /><span>Built for Robinhood Chain · Chain ID 4663</span></div>
        </div>
        <div className="avx-footer-links">
          <div><b>Explore</b><a href="/#product">Product</a><a href="/#security">Security</a><a href="/#privacy">Privacy</a><a href="/#mobile">Mobile</a></div>
          <div><b>Build</b><a href="/#developers">Developers</a><a href="/docs">Docs</a><a href="/#research">Research</a><a href="/avyro">${config.ticker}</a></div>
          <div><b>Connect</b>{config.xUrl && <a href={config.xUrl} target="_blank" rel="noreferrer">X / Twitter</a>}{config.githubUrl && <a href={config.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}<a href="mailto:security@avyroprotocol.com">Security</a></div>
        </div>
      </div>
      <div className="avx-footer-bottom"><span>© 2026 Avyro Protocol</span><span>avyroprotocol.com</span></div>
    </footer>
  );
}
