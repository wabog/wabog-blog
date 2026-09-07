const STORAGE_KEY = "wabog_attribution";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const CLICK_ID_KEYS = ["gclid", "fbclid", "ttclid", "msclkid"] as const;

// blog.wabog.com, wabog.com y app.wabog.com son tres orígenes distintos y no
// comparten localStorage. La querystring del enlace es el único vehículo que
// lleva la atribución de uno al siguiente, hasta el registro.
const DECORATED_PREFIXES = ["https://wabog.com", "https://app.wabog.com"];

type Touch = Record<string, string> & { seen_at?: string };

export type Attribution = {
  first_seen_at?: string;
  landing_url?: string;
  referrer?: string;
  first?: Touch;
  latest?: Touch;
};

const normalizeText = (value: string | null) => (value || "").replace(/\s+/g, " ").trim();

// Los UTM se comparan entre sí en los reportes, así que se normalizan.
// Los click IDs son opacos y sensibles a mayúsculas: solo se recortan.
const normalizeUtm = (value: string | null) => normalizeText(value).toLowerCase().slice(0, 200);
const normalizeClickId = (value: string | null) => normalizeText(value).slice(0, 500);

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

function readTouchFromUrl(): Touch | null {
  const params = new URLSearchParams(window.location.search);
  const touch: Touch = {};

  for (const key of UTM_KEYS) {
    const value = normalizeUtm(params.get(key));
    if (value) touch[key] = value;
  }

  for (const key of CLICK_ID_KEYS) {
    const value = normalizeClickId(params.get(key));
    if (value) touch[key] = value;
  }

  return Object.keys(touch).length ? touch : null;
}

export function captureAttribution(): Attribution {
  const stored = readAttribution() || {};
  const touch = readTouchFromUrl();
  const now = new Date().toISOString();

  // La primera visita siempre deja rastro, aunque sea tráfico directo:
  // landing y referrer son datos reales, no atribución inventada.
  if (!stored.first_seen_at) {
    stored.first_seen_at = now;
    stored.landing_url = window.location.pathname;
    stored.referrer = document.referrer || "";
  }

  // El first-touch se sella en la primera visita atribuible, no en la primera
  // visita a secas: una llegada directa no debe gastarlo.
  if (touch) {
    const currentTouch: Touch = { seen_at: now, ...touch };
    if (!stored.first) stored.first = currentTouch;
    stored.latest = currentTouch;
  }

  saveAttribution(stored);
  return stored;
}

export function decorateOutboundLinks(attribution: Attribution) {
  const first = attribution.first;
  if (!first) return;

  const latest = attribution.latest || first;
  const latestDiffers = (["utm_source", "utm_medium", "utm_campaign"] as const).some(
    (key) => (latest[key] || "") !== (first[key] || ""),
  );

  const selector = DECORATED_PREFIXES.map((prefix) => `a[href^="${prefix}"]`).join(", ");

  document.querySelectorAll<HTMLAnchorElement>(selector).forEach((link) => {
    let url: URL;
    try {
      url = new URL(link.getAttribute("href") || "", window.location.href);
    } catch {
      return;
    }

    for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
      if (first[key]) url.searchParams.set(key, first[key]);
    }

    url.searchParams.set("wbg_first_seen", first.seen_at || attribution.first_seen_at || "");
    if (attribution.landing_url) url.searchParams.set("wbg_landing", attribution.landing_url);

    if (latestDiffers) {
      for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) {
        if (latest[key]) {
          url.searchParams.set(`wbg_latest_${key.replace("utm_", "")}`, latest[key]);
        }
      }
    }

    link.setAttribute("href", url.toString());
  });
}
