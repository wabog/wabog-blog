import core from "./attribution-core.cjs";
const STORAGE_KEY = core.STORAGE_KEY;
const DECORATED_HOSTS = new Set(["wabog.com", "app.wabog.com", "ayuda.wabog.com"]);

type Touch = Record<string, string> & { seen_at?: string };

export type Attribution = {
  first_seen_at?: string;
  landing_url?: string;
  referrer?: string;
  first?: Touch;
  latest?: Touch;
  touches?: Touch[];
};

export function readAttribution(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? (parsed as Attribution) : null;
  } catch {
    return null;
  }
}

function saveAttribution(value: Attribution) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Modo privado o almacenamiento lleno: la atribución no persiste y el
    // registro se contará como directo. Nunca debe romper la navegación.
  }
}

export function captureAttribution(): Attribution {
  const data = core.capture(readAttribution(), window.location.search,
    window.location.pathname, document.referrer, new Date().toISOString()) as Attribution;
  saveAttribution(data);
  return data;
}

export function decorateOutboundLinks(attribution: Attribution) {
  if (!attribution.first) return;
  document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
    try {
      const url = new URL(link.getAttribute("href") || "", window.location.href);
      if (url.protocol !== "https:" || !DECORATED_HOSTS.has(url.hostname)) return;
      link.setAttribute("href", core.decorateUrl(url.toString(), attribution));
    } catch { /* Invalid links must not break client navigation. */ }
  });
}
