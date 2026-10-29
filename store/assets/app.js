/* Branding & Decoration Botswana — prototype quote engine + catalogue
   Zero dependencies. All calculation happens in the browser; nothing is transmitted or stored.

   Interface principles
   --------------------
   1. Answer first, form second: the price panel is always visible and updates on every change.
   2. Plain language over jargon: "Within 72 hours" rather than "rush surcharge".
   3. Guidance, not blocking: nothing is disabled — costs and minimums are explained instead.
   4. One job per card: pick → brand → fine-tune. */

const CONFIG = {
  // PRODUCTION BLOCKER — replace both before any outreach or paid traffic.
  // WHATSAPP_NUMBER: full international number without + or spaces, e.g. "26774000000"
  //   (Gaborone mobile). Empty = opens WhatsApp's contact picker — do not ship empty.
  // EMAIL: monitored inbox that replies within 4 working hours, e.g. "quotes@brandinganddecoration.co.bw"
  WHATSAPP_NUMBER: "",
  EMAIL: "quotes@example.co.bw"
};

const state = {
  data: null,
  suppliers: null,      // supplier registry (orchestration layer)
  product: null,        // selected product object
  decor: [],            // selected decoration method ids
  catFilter: "",        // builder category filter
  catSearch: "",        // builder search term
  catCatalogue: "",     // catalogue category filter
  catSupplier: "",      // catalogue supplier lane filter
  lastQuote: null
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const money = (n) => "P" + Math.round(n).toLocaleString("en-BW");
const money2 = (n) => "P" + n.toLocaleString("en-BW", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = (v, fallback) => (Number.isFinite(Number(v)) ? Number(v) : fallback);

/* ---------------- data loading ---------------- */

async function loadData() {
  // Offline-first: try IndexedDB (ERP) first, then network JSON, then cache
  let cat = null;
  try {
    if (window.BDB_DB) {
      const prods = await BDB_DB.getAll('products');
      const cfg = await BDB_DB.get('settings', 'config');
      const del = await BDB_DB.get('settings', 'delivery');
      const dec = await BDB_DB.get('settings', 'decoration');
      if (prods && prods.length && cfg && del) {
        // Reconstitute catalogue shape from DB
        cat = { products: prods.map(({_source,_seeded_at,_updated_at,_suppliers, suppliers, ...r})=> ({...r, suppliers: suppliers||_suppliers||[]})), config: cfg.value, delivery: del.value, decoration: (dec && dec.value) || null };
        if (!cat.decoration) {
          const resDec = await fetch("data/catalogue.json", { cache: "no-cache" });
          const orig = await resDec.json(); cat.decoration = orig.decoration;
        }
        // attach meta
        cat._meta = { note: "LIVE from IndexedDB (ERP)", currency: "BWP", updated: new Date().toISOString().slice(0,10) };
      }
    }
  } catch (e) { console.warn('DB load failed, falling back to fetch', e); }
  if (!cat) {
    const res = await fetch("data/catalogue.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Could not load catalogue data");
    cat = await res.json();
  }
  state.data = cat;
  // Load supplier registry (non-blocking, enriches UI)
  try {
    const sres = await fetch("data/suppliers.json", { cache: "no-cache" });
    if (sres.ok) state.suppliers = await sres.json();
  } catch {}
  // Also try supplier DB overlay if BDB_DB present
  try {
    if (window.BDB_DB) {
      const supDB = await BDB_DB.getAll('suppliers');
      if (supDB && supDB.length && state.suppliers) {
        // DB wins for status/channel freshness
        const map = new Map(supDB.map(s=> [s.id, s]));
        state.suppliers.suppliers = state.suppliers.suppliers.map(s=> map.has(s.id) ? {...s, ...map.get(s.id)} : s);
      }
    }
  } catch {}
}

/* ---------------- pricing engine (unchanged from the verified version) ---------------- */

function marginFor(qty) {
  const tiers = state.data.config.margin_tiers;
  let m = tiers[0].margin;
  for (const t of tiers) if (qty >= t.min_qty) m = t.margin;
  return m;
}

function decorById(id) {
  return state.data.decoration.find((d) => d.id === id);
}

/**
 * Calculate a quote.
 * Every input is explicit so the same function can be reused server-side later.
 */
function calculate({ product, qty, decorIds, stitches, positions, colours, deliveryFee, terms, rush }) {
  const cfg = state.data.config;
  const margin = marginFor(qty);

  // 1. Product line
  const productCost = product.landed_cost * qty;
  const productSell = productCost * (1 + margin);

  // 2. Decoration lines
  const decorLines = [];
  const methodWarnings = [];
  let decorSellTotal = 0;
  let decorCostTotal = 0;
  let setupTotal = 0;

  for (const id of decorIds) {
    const d = decorById(id);
    if (!d) continue;

    if (d.minQty && qty < d.minQty) {
      methodWarnings.push(`${d.label} is economical from ${d.minQty} units — at ${qty} units we would consolidate with another run or switch method. Confirm before ordering.`);
    }

    let unitPrice = 0, unitCost = 0, setup = 0, label = d.label;

    if (id === "embroidery") {
      const k = Math.max(stitches, d.minStitches) / 1000;
      unitPrice = k * d.pricePer1000;
      unitCost = k * d.costPer1000;
      setup = d.setup;
      label = `${d.label} — ${Math.max(stitches, d.minStitches).toLocaleString()} stitches`;
      // Embroidery scales with the number of decorated positions
      unitPrice *= positions;
      unitCost *= positions;
    } else if (id === "screen") {
      unitPrice = d.pricePerUnit * colours * positions;
      unitCost = d.costPerUnit * colours * positions;
      setup = d.setup * colours;
      label = `${d.label} — ${colours} colour${colours > 1 ? "s" : ""}${positions > 1 ? ` × ${positions} positions` : ""}`;
    } else {
      unitPrice = d.pricePerUnit * positions;
      unitCost = d.costPerUnit * positions;
      setup = d.setup || 0;
      if (positions > 1) label = `${d.label} × ${positions} positions`;
    }

    // Enforce the decoration margin floor if a method is accidentally priced below it
    unitPrice = Math.max(unitPrice, unitCost * (1 + cfg.decoration_margin_floor));

    const lineSell = unitPrice * qty;
    decorSellTotal += lineSell;
    decorCostTotal += unitCost * qty;
    setupTotal += setup;

    decorLines.push({
      label,
      unitPrice,
      unitCost,
      setup,
      setupLabel: d.setup_label || "Setup",
      lineSell,
      lineCost: unitCost * qty
    });
  }

  // 3. Surcharges
  const baseSubtotal = productSell + decorSellTotal + setupTotal;
  const creditRate = cfg.credit_surcharge[terms] || 0;
  const creditSurcharge = baseSubtotal * creditRate;
  const rushSurcharge = rush === "rush" ? cfg.rush_surcharge * (baseSubtotal + creditSurcharge) : 0;
  const afterSurcharges = baseSubtotal + creditSurcharge + rushSurcharge;

  // 4. Delivery
  const freeDelivery = afterSurcharges >= cfg.free_delivery_threshold;
  const delivery = freeDelivery ? 0 : deliveryFee;

  // 5. Totals
  const subtotalExVat = afterSurcharges + delivery;
  const vat = subtotalExVat * cfg.vat_rate;
  const totalInclVat = subtotalExVat + vat;

  const totalCost = productCost + decorCostTotal;
  const grossProfit = subtotalExVat - totalCost;
  const grossMarginPct = subtotalExVat > 0 ? grossProfit / subtotalExVat : 0;

  return {
    qty, margin, methodWarnings,
    product: { cost: productCost, sell: productSell, unitSell: productSell / qty },
    decorLines, decorSellTotal, decorCostTotal, setupTotal,
    creditRate, creditSurcharge, rushSurcharge,
    delivery, freeDelivery,
    subtotalExVat, vat, totalInclVat,
    unitPriceInclVat: totalInclVat / qty,
    totalCost, grossProfit, grossMarginPct
  };
}

/* ---------------- helpers ---------------- */

function quoteRef() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `BDB-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function channelLabel(c) {
  return {
    sa_trade: "South African trade account (duty embedded)",
    import: "Direct import (SACU duty applies)",
    local: "Botswana manufacture / fabrication",
    local_stock: "Gaborone buffer stock"
  }[c] || c;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

function validityLabel(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function termsLabel(terms) {
  return { prepay: "prepayment", days30: "30-day terms", days60: "60-day terms" }[terms] || terms;
}

function blankFromPrice(p) {
  return p.landed_cost * (1 + marginFor(p.moq));
}

function scrollToId(id, block) {
  const el = document.getElementById(id);
  if (el && typeof el.scrollIntoView === "function") el.scrollIntoView({ behavior: "smooth", block: block || "center" });
}

function qtyStep(qty) {
  if (qty >= 500) return 50;
  if (qty >= 100) return 25;
  if (qty >= 25) return 5;
  return 1;
}

function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

/* ---------------- reading the interface ---------------- */

function readMeta() {
  const product = state.product;
  const qty = Math.max(1, Math.round(num($("#q-qty").value, 100)));
  const zone = state.data.delivery.find((d) => d.zone === $("#q-delivery").value) || state.data.delivery[0];
  return {
    product,
    qty,
    decorIds: state.decor,
    stitches: Math.max(6000, num($("#q-stitches").value, 8000)),
    positions: Math.min(4, Math.max(1, Math.round(num($("#q-positions").value, 1)))),
    colours: Math.min(6, Math.max(1, Math.round(num($("#q-colours").value, 1)))),
    deliveryFee: zone.fee,
    deliveryZone: zone.zone,
    terms: $("#q-terms").value,
    rush: $("#q-rush").value,
    client: $("#q-client").value.trim()
  };
}

/* ---------------- step 1: products ---------------- */

function renderCatChips() {
  const cats = [...new Set(state.data.products.map((p) => p.category))].sort();
  $("#q-cat-chips").innerHTML = ["", ...cats]
    .map((c) => `<button type="button" class="chip filter ${state.catFilter === c ? "selected" : ""}" data-cat="${escapeHtml(c)}">${c || "All"}</button>`)
    .join("");
}

function renderProductList() {
  const term = state.catSearch.toLowerCase();
  const list = state.data.products
    .filter((p) => (!state.catFilter || p.category === state.catFilter) &&
      (!term || p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term) || (p.decor || []).join(" ").includes(term)))
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  if (!list.length) {
    $("#q-product-list").innerHTML = `<p class="plist-note">Nothing matches “${escapeHtml(state.catSearch)}”. Try a simpler word — “vest”, “shirt”, “gift”, “bottle”.</p>`;
    return;
  }

  $("#q-product-list").innerHTML = list.map((p) => `
    <button type="button" class="prow" data-product="${p.id}" aria-pressed="${state.product && state.product.id === p.id ? "true" : "false"}">
      <span class="prow-main">
        <strong>${p.name}</strong>
        <span class="prow-meta">${p.category} · min ${p.moq} ${p.unit} · ${p.lead_days} working days</span>
      </span>
      <span class="prow-price"><strong>${money(blankFromPrice(p))}</strong><small>per ${p.unit}, blank</small></span>
    </button>`).join("");
}

function selectProduct(id) {
  state.product = state.data.products.find((p) => p.id === id) || null;
  if (!state.product) return;

  $("#chosen").hidden = false;
  $("#chosen-name").textContent = state.product.name;
  $("#chosen-meta").textContent = `${state.product.category} · ${channelLabel(state.product.channel)} · lead time ${state.product.lead_days} working days`;

  state.decor = [];
  renderProductList();
  renderDecorChips();
  refresh();
}

function clearProduct() {
  state.product = null;
  $("#chosen").hidden = true;
  renderProductList();
  renderDecorChips();
  refresh();
}

/* ---------------- step 2: branding ---------------- */

function renderDecorChips() {
  const wrap = $("#decor-options");
  const allowed = state.product ? (state.product.decor || []) : [];

  if (!allowed.length) {
    wrap.innerHTML = "";
    $("#decor-empty").hidden = !!state.product ? false : true;
    $("#decor-fields").hidden = true;
    return;
  }

  $("#decor-empty").hidden = true;
  $("#decor-fields").hidden = false;

  state.decor = state.decor.filter((id) => allowed.includes(id));
  if (!state.decor.length) state.decor = [allowed[0]];

  const qty = Math.max(1, num($("#q-qty").value, 100));

  wrap.innerHTML = allowed.map((id) => {
    const d = decorById(id);
    const belowMin = d.minQty && qty < d.minQty;
    return `<label class="chip ${state.decor.includes(id) ? "selected" : ""}" title="${escapeHtml(d.note || "")}">
      <input type="checkbox" value="${id}" ${state.decor.includes(id) ? "checked" : ""} />
      ${d.label}${belowMin ? `<span class="chip-min">min ${d.minQty}</span>` : ""}
    </label>`;
  }).join("");

  toggleDecorFields();
}

function toggleDecorFields() {
  const hasEmbroidery = state.decor.includes("embroidery");
  const hasScreen = state.decor.includes("screen");
  $("#q-stitches-wrap").hidden = !hasEmbroidery;
  $("#screen-colours-wrap").hidden = !hasScreen;
}

/* ---------------- the live answer ---------------- */

function renderEmpty() {
  $("#quote-output").innerHTML = `
    <div class="answer-empty">
      <div class="pulse" aria-hidden="true"></div>
      <h3>Your price appears here</h3>
      <p>Start with step 1. The number updates as you change quantity or branding — nothing to submit.</p>
    </div>`;
  $("#mobile-bar").hidden = true;
}

function nextTierTip(qty) {
  const tiers = [...state.data.config.margin_tiers].sort((a, b) => a.min_qty - b.min_qty);
  const next = tiers.find((t) => t.min_qty > qty);
  if (!next) return null;
  const now = calculate({ ...readMeta(), decorIds: state.decor, qty });
  const at = calculate({ ...readMeta(), decorIds: state.decor, qty: next.min_qty });
  const unitDrop = now.unitPriceInclVat - at.unitPriceInclVat;
  if (unitDrop < 1) return null;
  return `Volume tip: at ${next.min_qty} units the unit price falls from ${money2(now.unitPriceInclVat)} to ${money2(at.unitPriceInclVat)} — ${money2(unitDrop)} less each.`;
}

function renderAnswer(q, meta) {
  const out = $("#quote-output");
  const product = meta.product;
  const warnings = [];
  const tips = [];

  if (meta.qty < product.moq) warnings.push(`Minimum order quantity for ${product.name} is ${product.moq} ${product.unit}. This quote is calculated on ${meta.qty} — confirm with us if you need a smaller run.`);
  if (meta.rush === "rush" && product.lead_days > 3) warnings.push("Rush turnaround needs partner capacity confirmed — we normally revert within 4 working hours.");
  if (q.subtotalExVat < state.data.config.min_order_value) warnings.push(`Minimum order value is ${money(state.data.config.min_order_value)}. Small runs can be consolidated or collected to reduce cost.`);
  if (!meta.decorIds.length) warnings.push("No branding selected — this is blank product only.");
  (q.methodWarnings || []).forEach((w) => warnings.push(w));

  if (q.freeDelivery) tips.push(`Delivery to ${meta.deliveryZone} is included at this order value.`);
  const tierTip = nextTierTip(meta.qty);
  if (tierTip) tips.push(tierTip);

  const branding = q.decorLines.length ? q.decorLines.map((l) => l.label).join(" + ") : "no branding";

  const lines = [];
  lines.push(`<div class="line"><span>${product.name}<small>${q.qty} × ${money(product.landed_cost * (1 + q.margin))} · volume tier ${Math.round(q.margin * 100)}%</small></span><span>${money(q.product.sell)}</span></div>`);
  q.decorLines.forEach((l) => {
    lines.push(`<div class="line"><span>${l.label}<small>${q.qty} × ${money(l.unitPrice)}</small></span><span>${money(l.lineSell)}</span></div>`);
    if (l.setup > 0) lines.push(`<div class="line"><span>${l.setupLabel} (one-off)</span><span>${money(l.setup)}</span></div>`);
  });
  if (q.creditSurcharge > 0) lines.push(`<div class="line"><span>${termsLabel(meta.terms)} priced in (${(q.creditRate * 100).toFixed(0)}%)</span><span>${money(q.creditSurcharge)}</span></div>`);
  if (q.rushSurcharge > 0) lines.push(`<div class="line"><span>Rush turnaround (+${Math.round(state.data.config.rush_surcharge * 100)}%)</span><span>${money(q.rushSurcharge)}</span></div>`);
  lines.push(`<div class="line"><span>Delivery — ${meta.deliveryZone}</span><span>${q.delivery === 0 ? "Included" : money(q.delivery)}</span></div>`);
  lines.push(`<div class="line"><span>Subtotal (excl. VAT)</span><span>${money(q.subtotalExVat)}</span></div>`);
  lines.push(`<div class="line"><span>VAT @ ${Math.round(state.data.config.vat_rate * 100)}%</span><span>${money(q.vat)}</span></div>`);
  lines.push(`<div class="line total"><span>Total (incl. VAT)</span><span>${money(q.totalInclVat)}</span></div>`);

  out.innerHTML = `
    <div class="answer-head">
      <span class="tiny">${meta.client ? escapeHtml(meta.client) + " · " : ""}${quoteRef()}</span>
      <span class="ref">valid until ${validityLabel(state.data.config.quote_validity_days)}</span>
    </div>
    <div class="answer-total">${money(q.totalInclVat)}</div>
    <p class="answer-unit"><strong>${money2(q.unitPriceInclVat)}</strong> per ${product.unit} — ${branding}</p>
    <p class="answer-said">Delivered to ${meta.deliveryZone} · ${termsLabel(meta.terms)} · ready in about ${meta.rush === "rush" ? "3" : product.lead_days} working days.</p>
    ${warnings.map((w) => `<div class="q-warn">${w}</div>`).join("")}
    ${tips.map((t) => `<div class="q-tip">${t}</div>`).join("")}
    <div class="lines">${lines.join("")}</div>
    <div class="answer-actions">
      <button type="button" class="btn primary" data-action="whatsapp">Send on WhatsApp</button>
      <button type="button" class="btn ghost" data-action="print">Print / PDF</button>
      <button type="button" class="btn ghost" data-action="copy">Copy</button>
    </div>
    <p class="answer-note">Firm quotes follow verified supplier pricing, artwork review and — for first orders — a 50% deposit. Source channel: ${channelLabel(product.channel)}.</p>
    <details class="margin">
      <summary>Internal margin view (staff only — remove before sharing)</summary>
      <table class="margin-table">
        <tr><td>Product cost</td><td class="num">${money(q.product.cost)}</td></tr>
        <tr><td>Decoration cost</td><td class="num">${money(q.decorCostTotal)}</td></tr>
        <tr><td>Total direct cost</td><td class="num">${money(q.totalCost)}</td></tr>
        <tr><td>Revenue excl. VAT</td><td class="num">${money(q.subtotalExVat)}</td></tr>
        <tr><td><strong>Gross profit</strong></td><td class="num"><strong>${money(q.grossProfit)}</strong></td></tr>
        <tr><td><strong>Gross margin</strong></td><td class="num"><strong>${(q.grossMarginPct * 100).toFixed(1)}%</strong></td></tr>
        <tr><td>Margin floor check</td><td class="num">${q.grossMarginPct >= 0.28 ? "PASS (≥28%)" : "REVIEW — below 28% floor"}</td></tr>
      </table>
    </details>`;

  state.lastQuote = { q, meta, product };

  const total = $("#mobile-total");
  if (total) total.textContent = money(q.totalInclVat);
  $("#mobile-bar").hidden = false;

  out.classList.remove("updated");
  void out.offsetWidth; // restart the settle animation
  out.classList.add("updated");
}

function refresh() {
  if (!state.data) return;
  if (!state.product) { renderEmpty(); return; }
  const meta = readMeta();
  const q = calculate(meta);
  renderAnswer(q, meta);
}

function updateFineSummary() {
  if (!state.data) return;
  const meta = readMeta();
  $("#fine-summary").textContent = `${meta.deliveryZone} · ${termsLabel(meta.terms)} · ${meta.rush === "rush" ? "rush (≤72 hours)" : "standard lead time"}`;
}

/* ---------------- share actions ---------------- */

function summaryText() {
  const { q, meta, product } = state.lastQuote;
  const lines = [
    `INDICATIVE QUOTE — Branding & Decoration Botswana`,
    meta.client ? `Client/project: ${meta.client}` : null,
    `Product: ${product.name} (${q.qty} ${product.unit})`,
    ...q.decorLines.map((l) => `Branding: ${l.label}`),
    `Delivery: ${meta.deliveryZone}`,
    `Terms: ${termsLabel(meta.terms)}`,
    `Total (incl. VAT): ${money(q.totalInclVat)}`,
    `Unit price: ${money2(q.unitPriceInclVat)}`,
    `Lead time: ${product.lead_days} working days`,
    `Note: indicative only. Firm quote follows verified costing and artwork review.`
  ].filter(Boolean);
  return lines.join("\n");
}

async function copySummary() {
  if (!state.lastQuote) return;
  try {
    await navigator.clipboard.writeText(summaryText());
    toast("Quote summary copied.");
  } catch {
    toast("Copy failed — select the quote text manually.");
  }
}

function sendWhatsApp() {
  if (!state.lastQuote) { toast("Choose a product first."); return; }
  const text = encodeURIComponent(summaryText());
  const base = CONFIG.WHATSAPP_NUMBER ? `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${text}` : `https://wa.me/?text=${text}`;
  window.open(base, "_blank", "noopener");
}

/* ---------------- catalogue ---------------- */

function renderCatalogueChips() {
  const cats = [...new Set(state.data.products.map((p) => p.category))].sort();
  $("#c-cat-chips").innerHTML = ["", ...cats]
    .map((c) => `<button type="button" class="chip filter ${state.catCatalogue === c ? "selected" : ""}" data-ccat="${escapeHtml(c)}">${c || "All"}</button>`)
    .join("");
  const supEl = $("#c-supplier-chips");
  if (supEl) {
    const suppliers = (state.suppliers && state.suppliers.suppliers) || [];
    const laneLabels = { amrod_bw: "Amrod BW", barron_sa: "Barron", jonsson_sa: "Jonsson", industrial_clothing_sa: "Industrial", twentyfour_sa: "TwentyFour", jasani_ae: "Jasani", china_agent: "China", local_ctm_bw: "Local CMT", local_stock_bw: "Buffer" };
    const lanes = suppliers.length ? suppliers.slice(0, 8).map((s) => s.id) : [];
    supEl.innerHTML = ["", ...lanes]
      .map((id) => {
        const label = id ? (laneLabels[id] || id) : "All lanes";
        const supName = id ? (suppliers.find((s) => s.id === id)?.name || id) : "";
        return `<button type="button" class="chip filter ${state.catSupplier === id ? "selected" : ""}" data-sup="${escapeHtml(id)}" title="${escapeHtml(supName)}">${label}</button>`;
      })
      .join("") + (suppliers.length ? ` <a href="admin.html#suppliers" class="tiny" style="margin-left:.4rem;align-self:center;">manage →</a>` : "");
  }
}

function renderGrid() {
  const term = $("#c-search").value.trim().toLowerCase();
  const cat = state.catCatalogue;
  const supLane = state.catSupplier;

  const list = state.data.products.filter((p) => {
    const hitCat = !cat || p.category === cat;
    const hitTerm = !term || p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
    const hitSup = !supLane || ((p.suppliers || p._suppliers || []).includes(supLane));
    return hitCat && hitTerm && hitSup;
  });

  $("#catalogue-grid").innerHTML = list.length ? list.map((p) => {
    const supIds = p.suppliers || p._suppliers || [];
    const supBadges = supIds.length ? supIds.slice(0,3).map(id=> `<span class="chip" style="font-size:.68rem;padding:.18rem .45rem;">${escapeHtml(id.replace(/_sa|_bw|_ae/g,''))}</span>`).join(' ') : '';
    const chan = p.channel==='import' ? 'import · duty applies' : p.channel==='local' ? 'local CMT' : p.channel==='local_stock' ? 'buffer 0d' : 'SA trade';
    return `
    <article class="card">
      <h3>${p.name}</h3>
      <p class="tiny">${p.category} · min ${p.moq} ${p.unit} · ${p.lead_days} working days · ${chan} ${supBadges}</p>
      <p>From <strong>${money(blankFromPrice(p))}</strong> per ${p.unit}, blank — branding quoted separately.</p>
      <p class="tiny">Branding: ${(p.decor || []).map((d) => decorById(d)?.label || d).join(", ") || "supplied blank"}</p>
      <button type="button" class="btn ghost" data-quote="${p.id}">Quote this item</button>
    </article>`; }).join("")
    : `<p class="tiny">Nothing matches that search. Try “vest”, “shirt”, “gift” or “bottle”.</p>`;

  $("#catalogue-count").textContent = `${list.length} of ${state.data.products.length} items · indicative pricing from modelled costs`;
}

/* ---------------- wiring ---------------- */

function initBuilder() {
  // delivery zones from the data file
  $("#q-delivery").innerHTML = state.data.delivery
    .map((d) => `<option value="${d.zone}">${d.zone}${d.fee ? " — " + money(d.fee) : " — free"}</option>`)
    .join("");

  $("#q-validity").textContent = `— ${validityLabel(state.data.config.quote_validity_days)}`;

  renderCatChips();
  renderProductList();
  updateFineSummary();
  refresh();

  // search + category
  $("#q-search").addEventListener("input", (e) => { state.catSearch = e.target.value.trim(); renderProductList(); });
  $("#q-cat-chips").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-cat]");
    if (!chip) return;
    state.catFilter = chip.dataset.cat;
    renderCatChips();
    renderProductList();
  });

  // product selection
  $("#q-product-list").addEventListener("click", (e) => {
    const row = e.target.closest("[data-product]");
    if (row) { selectProduct(row.dataset.product); scrollToId("step-brand"); }
  });

  // quantity
  $("#q-qty").addEventListener("input", () => { renderDecorChips(); refresh(); });

  // branding chips
  $("#decor-options").addEventListener("change", (e) => {
    const input = e.target;
    if (input.type !== "checkbox") return;
    state.decor = input.checked
      ? [...new Set([...state.decor, input.value])]
      : state.decor.filter((v) => v !== input.value);
    $$("#decor-options .chip").forEach((chip) => chip.classList.toggle("selected", chip.querySelector("input").checked));
    toggleDecorFields();
    refresh();
  });

  // detail fields
  ["#q-stitches", "#q-positions", "#q-colours"].forEach((sel) => $(sel).addEventListener("input", refresh));
  ["#q-delivery", "#q-terms", "#q-rush"].forEach((sel) =>
    $(sel).addEventListener("change", () => { updateFineSummary(); refresh(); }));
  $("#q-client").addEventListener("input", refresh);

  // partner application
  $("#partner-cta").addEventListener("click", () => {
    window.open(`mailto:${CONFIG.EMAIL}?subject=Partner%20network%20application%20—%20decoration%20capacity&body=Company%3A%0ALocation%3A%0AMachines%3A%0ACapacity%20per%20day%3A%0AThree%20references%3A`, "_blank");
  });
}

function initCatalogue() {
  renderCatalogueChips();
  renderGrid();
  renderSupplierStrip();

  $("#c-search").addEventListener("input", renderGrid);
  $("#c-cat-chips").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-ccat]");
    if (!chip) return;
    state.catCatalogue = chip.dataset.ccat;
    renderCatalogueChips();
    renderGrid();
  });
  const supChips = $("#c-supplier-chips");
  if (supChips) supChips.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-sup]");
    if (!chip) return;
    state.catSupplier = chip.dataset.sup;
    renderCatalogueChips();
    renderGrid();
  });

  $("#catalogue-grid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-quote]");
    if (!btn) return;
    selectProduct(btn.dataset.quote);
    scrollToId("builder", "start");
  });
}

function renderSupplierStrip() {
  const grid = $("#supplier-strip-grid");
  const badge = $("#supplierCountHero");
  if (!grid || !state.suppliers) return;
  const suppliers = state.suppliers.suppliers.slice(0,6);
  if (badge) badge.textContent = `${state.suppliers.suppliers.length} supplier lanes`;
  grid.innerHTML = suppliers.map(s=> `
    <article class="card">
      <h3>${escapeHtml(s.name)} ${s.trade_only ? '<span class="badge warn">trade-only</span>' : ''}</h3>
      <p class="tiny">${escapeHtml(s.category.slice(0,2).join(' · '))} · ${escapeHtml(s.channel)} · ${s.lead_days}d</p>
      <p class="tiny">${escapeHtml((s.strength||'').slice(0,110))}</p>
      <p class="tiny"><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">Visit →</a> ${s.products_mapped? `· ${s.products_mapped} SKUs mapped` : ''}</p>
    </article>
  `).join('');
}

function initActions() {
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;

    if (action === "whatsapp") sendWhatsApp();
    else if (action === "print") window.print();
    else if (action === "copy") copySummary();
    else if (action === "clear-product") { clearProduct(); scrollToId("step-product", "start"); }
    else if (action === "see-answer") scrollToId("quote-output", "center");
    else if (action === "qty-minus" || action === "qty-plus") {
      const input = $("#q-qty");
      const current = Math.max(1, Math.round(num(input.value, 100)));
      const step = qtyStep(current);
      const next = action === "qty-plus" ? current + step : Math.max(1, current - step);
      input.value = next;
      renderDecorChips();
      refresh();
    }
  });
}

/* ---------------- boot ---------------- */

(async function boot() {
  // Load offline DB helper if present (free, no build step)
  try {
    await new Promise((resolve)=>{
      if (window.BDB_DB) return resolve();
      const s=document.createElement('script'); s.src='assets/db.js'; s.onload=resolve; s.onerror=resolve; document.head.appendChild(s);
    });
  } catch {}
  try {
    await loadData();
    initBuilder();
    initCatalogue();
    initActions();
    // Offline badge + capture hook
    const badge = document.getElementById('offlineBadge');
    if (badge) {
      const upd=()=>{ const on=navigator.onLine; badge.style.display=''; badge.textContent = on ? '● Online — offline ready' : '● Offline — quotes queue locally'; badge.style.background = on ? 'var(--accent-soft)' : 'var(--warn-bg)'; badge.style.borderColor = on ? '#bfd3c6' : 'var(--warn-line)'; };
      window.addEventListener('online', upd); window.addEventListener('offline', upd); upd();
    }
    // Auto-capture quotes to ERP sync queue when BDB_DB exists (offline-first)
    const origRefresh = refresh;
    let captureTimer=null;
    const orig = refresh;
    window.refresh = function(){ orig(); clearTimeout(captureTimer); captureTimer=setTimeout(async()=>{
      try{
        if(!window.BDB_DB || !state.product || !state.lastQuote) return;
        const q=state.lastQuote.q, meta=state.lastQuote.meta;
        // throttle: only every 2s max
        await BDB_DB.enqueueSync('quote', { id:`QCAP-${Date.now().toString(36)}`, sku: state.product.id, qty: q.qty, total_ex_vat: q.subtotalExVat, margin: q.grossMarginPct, customer: meta.client||'—', zone: meta.deliveryZone, status:'draft', created_at:new Date().toISOString(), product: state.product.name });
      }catch{}
    }, 1800); };
  } catch (err) {
    document.querySelector("main").insertAdjacentHTML("afterbegin",
      `<div class="wrap"><p class="q-warn">Catalogue data could not be loaded (${escapeHtml(err.message)}). Serve this folder over HTTP — e.g. <code>python3 -m http.server</code> — rather than opening the file directly.</p></div>`);
  }

  if ("serviceWorker" in navigator) {
    // Register for both http and https when served (SW requires secure context or localhost)
    navigator.serviceWorker.register("sw.js").catch(() => {});
    // Listen for SW sync trigger
    navigator.serviceWorker.addEventListener('message', (e)=>{
      if(e.data && e.data.type==='BDB_FLUSH_QUEUE' && window.BDB_DB) window.BDB_DB.flushSyncQueue(()=>Promise.resolve()).catch(()=>{});
    });
  }
})();
