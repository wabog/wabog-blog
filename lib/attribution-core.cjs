/* Shared, dependency-free campaign envelope for public Wabog sites. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WabogAttribution = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const CLICK_KEYS = ['ctwa_clid', 'gclid', 'fbclid', 'ttclid', 'msclkid'];
  const STORAGE_KEY = 'wabog_attribution';
  const MAX_AGE = 30 * 86400000;
  function clean(raw, now) {
    if (!raw || typeof raw !== 'object') return null;
    const seen = Date.parse(raw.seen_at || '');
    if (!Number.isFinite(seen) || seen > Date.parse(now) + 300000 || Date.parse(now) - seen > MAX_AGE) return null;
    const touch = { seen_at: new Date(seen).toISOString() };
    for (const key of UTM_KEYS) {
      const value = typeof raw[key] === 'string' ? raw[key].replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 200) : '';
      if (value) touch[key] = value;
    }
    for (const key of CLICK_KEYS) {
      const candidate = raw[key] || (raw.click_id_type === key ? raw.click_id : '');
      if (typeof candidate === 'string' && candidate.trim()) { touch[key] = candidate.trim().slice(0, 500); break; }
    }
    return Object.keys(touch).length > 1 ? touch : null;
  }
  function unique(rows, now) {
    const seen = new Set();
    const result = [];
    for (const raw of rows) {
      const touch = clean(raw, now);
      if (!touch) continue;
      const key = JSON.stringify(touch);
      if (!seen.has(key)) { seen.add(key); result.push(touch); }
    }
    result.sort((a, b) => Date.parse(a.seen_at) - Date.parse(b.seen_at));
    return result.length <= 50 ? result : [result[0], ...result.slice(-49)];
  }
  function capture(stored, search, pathname, referrer, now) {
    const previous = stored && typeof stored === 'object' ? stored : {};
    const params = new URLSearchParams(search);
    const rows = [...(Array.isArray(previous.touches) ? previous.touches : []), previous.first, previous.latest];
    // The help center previously stored a flat UTM record. Preserve its date.
    if (previous.wbg_first_seen) rows.push({ ...previous, seen_at: previous.wbg_first_seen });
    const incoming = params.get('wbg_touches');
    let forwarded = false;
    if (incoming && incoming.length <= 16000) {
      try { const parsed = JSON.parse(incoming); if (Array.isArray(parsed)) { const valid = parsed.slice(0, 8).filter(row => clean(row, now)); rows.push(...valid); forwarded = valid.length > 0; } } catch { /* Legacy UTM still works. */ }
    }
    const current = { seen_at: params.get('wbg_first_seen') || now };
    for (const key of [...UTM_KEYS, ...CLICK_KEYS]) if (params.has(key)) current[key] = params.get(key);
    rows.push(current);
    // Older publishers can forward latest-touch separately, but its timestamp
    // must be explicit; a first-click ID is never borrowed by that later visit.
    if (!forwarded && params.get('wbg_latest_seen')) rows.push({
      seen_at: params.get('wbg_latest_seen'), utm_source: params.get('wbg_latest_source'),
      utm_medium: params.get('wbg_latest_medium'), utm_campaign: params.get('wbg_latest_campaign'),
    });
    const touches = unique(rows, now);
    const data = {
      first_seen_at: previous.first_seen_at || previous.wbg_first_seen || params.get('wbg_first_seen') || now,
      landing_url: previous.landing_url || previous.wbg_landing || params.get('wbg_landing') || pathname,
      referrer: previous.referrer || params.get('wbg_referrer') || referrer,
    };
    if (touches.length) Object.assign(data, { touches, first: touches[0], latest: touches[touches.length - 1] });
    return data;
  }
  function wire(touch) {
    const value = { seen_at: touch.seen_at };
    for (const key of UTM_KEYS) if (touch[key]) value[key] = touch[key];
    for (const key of CLICK_KEYS) if (touch[key]) { value.click_id = touch[key]; value.click_id_type = key; break; }
    return value;
  }
  function history(data) {
    const rows = Array.isArray(data.touches) ? data.touches : [data.first, data.latest];
    const valid = rows.filter(Boolean);
    let recent = valid.length <= 8 ? valid : [valid[0], ...valid.slice(-7)];
    let encoded = JSON.stringify(recent.map(wire));
    while (recent.length > 2 && encodeURIComponent(encoded).length > 6000) {
      recent.splice(1, 1); encoded = JSON.stringify(recent.map(wire));
    }
    return encodeURIComponent(encoded).length <= 6000 ? encoded : null;
  }
  function decorateUrl(href, data) {
    const url = new URL(href);
    if (!data || !data.first) return url.toString();
    const first = data.first, latest = data.latest || first;
    for (const key of [...UTM_KEYS, ...CLICK_KEYS]) {
      url.searchParams.delete(key);
      if (first[key]) url.searchParams.set(key, first[key]);
    }
    url.searchParams.set('wbg_first_seen', first.seen_at || data.first_seen_at);
    if (data.landing_url) url.searchParams.set('wbg_landing', data.landing_url);
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
      const parameter = `wbg_latest_${key.slice(4)}`;
      url.searchParams.delete(parameter);
      if (latest[key] && latest[key] !== first[key]) url.searchParams.set(parameter, latest[key]);
    }
    url.searchParams.set('wbg_latest_seen', latest.seen_at);
    const envelope = history(data);
    url.searchParams.delete('wbg_touches');
    if (envelope) url.searchParams.set('wbg_touches', envelope);
    return url.toString();
  }
  function appUrl(data) { return decorateUrl('https://app.wabog.com/', data); }
  return { UTM_KEYS, CLICK_KEYS, STORAGE_KEY, capture, appUrl, decorateUrl };
});
