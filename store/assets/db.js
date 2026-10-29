/* Branding & Decoration Botswana — Offline-first ERP store
   IndexedDB helper: the free, durable, offline backend.
   No server, no cost, no lock-in. Data lives in the browser and exports to JSON for GitHub persistence.
   Free stack: IndexedDB (browser) -> JSON export -> GitHub repo -> Cloudflare Pages (free).
   Optional upgrade (still free): Cloudflare D1/KV via Pages Functions when order volume justifies it.
*/

const DB_NAME = 'bdb-erp';
const DB_VERSION = 2;

const STORES = {
  products: { keyPath: 'id', indices: [{ name: 'category', unique: false }, { name: 'channel', unique: false }] },
  suppliers: { keyPath: 'id', indices: [{ name: 'channel', unique: false }] },
  vendors: { keyPath: 'id', indices: [] },
  quotes: { keyPath: 'id', indices: [{ name: 'status', unique: false }, { name: 'customer', unique: false }, { name: 'created_at', unique: false }] },
  orders: { keyPath: 'id', indices: [{ name: 'status', unique: false }, { name: 'customer', unique: false }] },
  customers: { keyPath: 'id', indices: [{ name: 'name', unique: false }] },
  partners: { keyPath: 'id', indices: [{ name: 'town', unique: false }] },
  certificates: { keyPath: 'id', indices: [{ name: 'sku', unique: false }] },
  vaults: { keyPath: 'id', indices: [{ name: 'customer', unique: false }] },
  settings: { keyPath: 'key', indices: [] },
  syncQueue: { keyPath: 'id', autoIncrement: true, indices: [{ name: 'type', unique: false }] }
};

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      for (const [name, def] of Object.entries(STORES)) {
        if (!db.objectStoreNames.contains(name)) {
          const store = db.createObjectStore(name, { keyPath: def.keyPath, autoIncrement: !!def.autoIncrement });
          for (const idx of def.indices) store.createIndex(idx.name, idx.name, { unique: !!idx.unique });
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(storeName, mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(storeName, mode);
    const store = t.objectStore(storeName);
    let result;
    try { result = fn(store, t); } catch (e) { reject(e); return; }
    t.oncomplete = () => resolve(result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error || new Error('tx aborted'));
    // if fn returns a promise that wraps an IDBRequest, we still resolve via oncomplete; expose result via closure
    if (result && typeof result.then === 'function') result.then(r => { result = r; }).catch(reject);
  });
}

function reqToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// CRUD
async function getAll(storeName) {
  const db = await openDB();
  const t = db.transaction(storeName, 'readonly');
  const store = t.objectStore(storeName);
  return reqToPromise(store.getAll());
}
async function get(storeName, key) {
  const db = await openDB();
  const t = db.transaction(storeName, 'readonly');
  return reqToPromise(t.objectStore(storeName).get(key));
}
async function put(storeName, value) {
  const db = await openDB();
  const t = db.transaction(storeName, 'readwrite');
  t.objectStore(storeName).put(value);
  return new Promise((resolve, reject) => { t.oncomplete = () => resolve(value); t.onerror = () => reject(t.error); });
}
async function del(storeName, key) {
  const db = await openDB();
  const t = db.transaction(storeName, 'readwrite');
  t.objectStore(storeName).delete(key);
  return new Promise((resolve, reject) => { t.oncomplete = () => resolve(); t.onerror = () => reject(t.error); });
}
async function clear(storeName) {
  const db = await openDB();
  const t = db.transaction(storeName, 'readwrite');
  t.objectStore(storeName).clear();
  return new Promise((resolve, reject) => { t.oncomplete = () => resolve(); t.onerror = () => reject(t.error); });
}
async function count(storeName) {
  const db = await openDB();
  const t = db.transaction(storeName, 'readonly');
  return reqToPromise(t.objectStore(storeName).count());
}
async function bulkPut(storeName, items) {
  if (!items || !items.length) return;
  const db = await openDB();
  const t = db.transaction(storeName, 'readwrite');
  const store = t.objectStore(storeName);
  for (const item of items) store.put(item);
  return new Promise((resolve, reject) => { t.oncomplete = () => resolve(); t.onerror = () => reject(t.error); });
}

// Settings helper
async function getSetting(key, fallback) {
  const row = await get('settings', key);
  return row ? row.value : fallback;
}
async function setSetting(key, value) {
  return put('settings', { key, value, updated_at: new Date().toISOString() });
}

// Sync queue (offline quote/order capture)
async function enqueueSync(type, payload) {
  return put('syncQueue', { type, payload, created_at: new Date().toISOString(), attempts: 0 });
}
async function flushSyncQueue(handler) {
  const items = await getAll('syncQueue');
  for (const item of items) {
    try {
      await handler(item);
      await del('syncQueue', item.id);
    } catch (e) {
      // leave in queue for retry; bump attempts
      item.attempts = (item.attempts || 0) + 1;
      item.last_error = String(e.message || e);
      await put('syncQueue', item);
    }
  }
}

// Seed from JSON files when store is empty
async function seedIfEmpty(storeName, url, transform) {
  const c = await count(storeName);
  if (c > 0) return { seeded: false, count: c };
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`seed fetch ${url} ${res.status}`);
    const data = await res.json();
    let items = data.products || data.suppliers || data.vendors || data || [];
    if (transform) items = transform(data);
    // attach provenance
    items = items.map(i => ({ ...i, _source: url, _seeded_at: new Date().toISOString() }));
    await bulkPut(storeName, items);
    return { seeded: true, count: items.length };
  } catch (e) {
    console.warn(`seedIfEmpty ${storeName} failed`, e);
    return { seeded: false, error: String(e) };
  }
}

// Export store to JSON file (for GitHub persistence)
async function exportStore(storeName) {
  const items = await getAll(storeName);
  const clean = items.map(({ _source, _seeded_at, ...rest }) => rest);
  return JSON.stringify({ _meta: { exported_at: new Date().toISOString(), count: clean.length, store: storeName }, [storeName]: clean }, null, 2);
}

async function exportAll() {
  const dump = { _meta: { exported_at: new Date().toISOString(), db: DB_NAME, version: DB_VERSION } };
  for (const name of Object.keys(STORES)) {
    const items = await getAll(name);
    dump[name] = items;
  }
  return JSON.stringify(dump, null, 2);
}

// Expose globally for admin + storefront
window.BDB_DB = { openDB, getAll, get, put, del, clear, count, bulkPut, getSetting, setSetting, enqueueSync, flushSyncQueue, seedIfEmpty, exportStore, exportAll, DB_NAME, DB_VERSION };
