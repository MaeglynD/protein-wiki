// Full-entry coordinates only: both formats retain biological assembly operators.
const cache = new Map();
const cooling = new Map();
const MAX_BYTES = 48e6;
const byteLength = data => typeof data === 'string' ? data.length * 2 : data.byteLength;
function delay(ms, signal) {
  signal?.throwIfAborted();
  return new Promise((resolve, reject) => {
    const done = () => { signal?.removeEventListener('abort', abort); resolve(); };
    const timer = setTimeout(done, ms);
    const abort = () => { clearTimeout(timer); reject(signal.reason); };
    signal?.addEventListener('abort', abort, { once: true });
  });
}
async function download(source, signal) {
  const controller = new AbortController();
  const combined = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;
  let timer = setTimeout(() => controller.abort(new DOMException('Coordinate server timed out', 'TimeoutError')), 18000);
  try {
    const response = await fetch(source.url, { signal: combined });
    clearTimeout(timer);
    timer = setTimeout(() => controller.abort(new DOMException('Coordinate download timed out', 'TimeoutError')), 90000);
    if (!response.ok) {
      const error = new Error(`Coordinate server returned ${response.status}`);
      error.permanent = response.status >= 400 && response.status < 500 && ![408, 429].includes(response.status);
      const retry = response.headers.get('retry-after');
      if (response.status === 429 || response.status === 503) {
        const seconds = retry !== null && /^\d+(\.\d+)?$/.test(retry) ? Number(retry) * 1000 : Date.parse(retry) - Date.now();
        cooling.set(source.host, Date.now() + (Number.isFinite(seconds) ? Math.max(1000, seconds) : 15000));
      }
      throw error;
    }
    if (response.headers.get('content-type')?.includes('text/html')) throw Error('Coordinate server returned a web page');
    const data = source.format === 'cif' ? await response.text() : new Uint8Array(await response.arrayBuffer());
    combined.throwIfAborted();
    const valid = typeof data === 'string'
      ? /^\s*data_/i.test(data) && data.includes('_atom_site.')
      : data.length > 100 && ((data[0] >= 0x80 && data[0] <= 0x8f) || data[0] === 0xde || data[0] === 0xdf);
    if (!valid) throw Error('Invalid coordinate response');
    cooling.delete(source.host);
    return data;
  } finally { clearTimeout(timer); }
}
export async function coordinates(item, signal, onProgress = () => {}) {
  signal?.throwIfAborted();
  if (cache.has(item.id)) {
    const data = cache.get(item.id); cache.delete(item.id); cache.set(item.id, data);
    return data;
  }
  const id = item.id.toUpperCase();
  if (!/^(?:[0-9][A-Z0-9]{3}|PDB_[A-Z0-9]{8})$/.test(id)) throw Error('Invalid structure identifier');
  const sources = item.remote ? [
    { url: `https://models.rcsb.org/${id.toLowerCase()}.bcif`, format: 'bcif', host: 'models' },
    { url: `https://files.rcsb.org/download/${id}.cif`, format: 'cif', host: 'files' }
  ] : [{ url: `/structures/${id}.bcif`, format: 'bcif', host: 'local' }];
  sources.sort((a, b) => (cooling.get(a.host) || 0) - (cooling.get(b.host) || 0));
  const unavailable = new Set();
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    signal?.throwIfAborted();
    const source = sources[attempt % sources.length];
    if (unavailable.has(source.host)) continue;
    const cooldown = Math.max(0, (cooling.get(source.host) || 0) - Date.now());
    // Respect server backoff; use an alternate instead of hammering a busy host.
    if (cooldown > 5000) continue;
    if (attempt >= sources.length || cooldown) {
      onProgress('Reconnecting to the coordinate archive', 0);
      await delay(Math.max(cooldown, 700 + Math.random() * 400), signal);
    } else if (attempt) onProgress('Loading from the alternate RCSB source', 0);
    try {
      const data = await download(source, signal);
      signal?.throwIfAborted();
      if (byteLength(data) <= MAX_BYTES) {
        cache.set(id, data);
        let bytes = [...cache.values()].reduce((n, value) => n + byteLength(value), 0);
        while (bytes > MAX_BYTES) { const key = cache.keys().next().value; bytes -= byteLength(cache.get(key)); cache.delete(key); }
      }
      onProgress('Coordinates ready', 1);
      return data;
    } catch (error) {
      signal?.throwIfAborted();
      lastError = error;
      if (error.permanent) unavailable.add(source.host);
      // CORS hides HTTP status: a browser network error cannot establish its cause.
      if (error instanceof TypeError) cooling.set(source.host, Date.now() + 4000);
    }
  }
  throw lastError || Error('Coordinate archive is temporarily busy. Please retry shortly.');
}
export function forgetCoordinates(id) { cache.delete(id.toUpperCase()); }
