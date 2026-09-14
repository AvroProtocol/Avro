import { useEffect, useState } from "react";
import { applyLanguage, readStoredLang, storeLang, type Lang } from "@/lib/translate";

const LANGUAGE_EVENT = "avyro:language";

export function LanguageToggle({
  className = "",
  style,
  onSelect,
}: {
  className?: string;
  style?: React.CSSProperties;
  onSelect?: () => void;
}) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const initial = readStoredLang();
    setLang(initial);
    applyLanguage(initial);

    const sync = (event: Event) => {
      const next = (event as CustomEvent<Lang>).detail;
      if (next === "en" || next === "zh") setLang(next);
    };
    window.addEventListener(LANGUAGE_EVENT, sync as EventListener);
    return () => window.removeEventListener(LANGUAGE_EVENT, sync as EventListener);
  }, []);

  const select = (next: Lang) => {
    storeLang(next);
    setLang(next);
    applyLanguage(next);
    window.dispatchEvent(new CustomEvent<Lang>(LANGUAGE_EVENT, { detail: next }));
    onSelect?.();
  };

  return (
    <div className={`lang-toggle ${className}`} style={style} role="group" aria-label="Language / 语言" data-no-translate>
      <button
        type="button"
        className={`lang-toggle-option ${lang === "en" ? "is-active" : ""}`}
        onClick={() => select("en")}
        aria-pressed={lang === "en"}
        title="English"
      >
        EN
      </button>
      <button
        type="button"
        className={`lang-toggle-option ${lang === "zh" ? "is-active" : ""}`}
        onClick={() => select("zh")}
        aria-pressed={lang === "zh"}
        title="简体中文"
      >
        中文
      </button>
    </div>
  );
}

export default LanguageToggle;
