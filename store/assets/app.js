/* Branding & Decoration Botswana — prototype quote engine + catalogue
   Zero dependencies. All calculation happens in the browser; nothing is transmitted. */

const CONFIG = {
  // Set to a full international number (no + or spaces) to route enquiries directly,
  // e.g. "2677XXXXXXX". Empty = open WhatsApp's contact picker.
  WHATSAPP_NUMBER: "",
  EMAIL: "quotes@example.co.bw" // replace with the live address before publishing
};

const state = {
  data: null,
  decor: [],          // selected decoration method ids
  lastQuote: null
};

const $ = (sel) => document.querySelector(sel);
const money = (n) => "P" + Math.round(n).toLocaleString("en-BW");
const money2 = (n) => "P" + n.toLocaleString("en-BW", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ---------------- data loading ---------------- */

async function loadData() {
  const res = await fetch("data/catalogue.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("Could not load catalogue data");
  state.data = await res.json();
}

/* ---------------- pricing engine ---------------- */

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

/* ---------------- quote rendering ---------------- */

function quoteRef() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `BDB-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function renderQuote(q, meta) {
  const out = $("#quote-output");
  const product = meta.product;
  const warnings = [];

  if (meta.qty < product.moq) warnings.push(`Minimum order quantity for ${product.name} is ${product.moq} ${product.unit}. The quote below is calculated on ${meta.qty} — confirm with us if you need a smaller run.`);
  if (meta.rush === "rush" && product.lead_days > 3) warnings.push("Rush turnaround requires partner capacity confirmation — we will revert within 4 working hours.");
  if (q.subtotalExVat < state.data.config.min_order_value) warnings.push(`Minimum order value is ${money(state.data.config.min_order_value)}. Small runs may be consolidated or collected to reduce cost.`);
  if (!meta.decorIds.length) warnings.push("No decoration selected — this quote is for blank product only.");
  (q.methodWarnings || []).forEach((w) => warnings.push(w));

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + state.data.config.quote_validity_days);
  const validStr = validUntil.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const rows = [];
  rows.push(`<tr><td>${product.name}<br><span class="tiny">${q.qty} × ${money(product.landed_cost * (1 + q.margin))} (volume tier ${Math.round(q.margin * 100)}%) · ${product.unit}</span></td><td class="num">${money(q.product.sell)}</td></tr>`);

  q.decorLines.forEach((l) => {
    rows.push(`<tr><td>${l.label}<br><span class="tiny">${q.qty} × ${money(l.unitPrice)}</span></td><td class="num">${money(l.lineSell)}</td></tr>`);
    if (l.setup > 0) rows.push(`<tr><td>${l.setupLabel} (one-off)</td><td class="num">${money(l.setup)}</td></tr>`);
  });

  if (q.creditSurcharge > 0) rows.push(`<tr><td>Payment terms priced in (${(q.creditRate * 100).toFixed(0)}%)</td><td class="num">${money(q.creditSurcharge)}</td></tr>`);
  if (q.rushSurcharge > 0) rows.push(`<tr><td>Rush turnaround (+${Math.round(state.data.config.rush_surcharge * 100)}%)</td><td class="num">${money(q.rushSurcharge)}</td></tr>`);
  rows.push(`<tr><td>Delivery — ${meta.deliveryZone}${q.freeDelivery ? " (free of charge above threshold)" : ""}</td><td class="num">${q.delivery === 0 ? "Included" : money(q.delivery)}</td></tr>`);
  rows.push(`<tr><td>Subtotal (excl. VAT)</td><td class="num">${money(q.subtotalExVat)}</td></tr>`);
  rows.push(`<tr><td>VAT @ 14%</td><td class="num">${money(q.vat)}</td></tr>`);

  out.innerHTML = `
    <div class="q-head">
      <div>
        <h3>Indicative quotation</h3>
        <div class="q-ref">${quoteRef()}${meta.client ? " · " + escapeHtml(meta.client) : ""}</div>
      </div>
      <div class="q-ref">Valid until ${validStr}</div>
    </div>
    ${warnings.map((w) => `<div class="q-warn">${w}</div>`).join("")}
    <table class="q-lines"><tbody>${rows.join("")}</tbody></table>
    <div class="q-total"><span>Total (incl. VAT)</span><span>${money(q.totalInclVat)}</span></div>
    <p class="q-note">
      Effective unit price: <strong>${money2(q.unitPriceInclVat)}</strong> per ${product.unit} including decoration and VAT ·
      Estimated lead time: <strong>${product.lead_days} working days</strong> from artwork and deposit confirmation ·
      Source channel: <strong>${channelLabel(product.channel)}</strong>
    </p>
    <p class="q-note">
      Firm quotations follow verified supplier pricing, artwork review and (for first orders) a 50% deposit.
      Prices are exclusive of any site-specific levies and exclude travel outside the listed delivery zones.
    </p>
    <div class="q-actions">
      <button class="btn primary" id="q-whatsapp" type="button">Send on WhatsApp</button>
      <button class="btn ghost" id="q-print" type="button">Print / save as PDF</button>
      <button class="btn ghost" id="q-copy" type="button">Copy summary</button>
    </div>
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
    </details>
  `;

  state.lastQuote = { q, meta, product };

  $("#q-print").addEventListener("click", () => window.print());
  $("#q-copy").addEventListener("click", () => copySummary());
  $("#q-whatsapp").addEventListener("click", () => sendWhatsApp());
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

function summaryText() {
  const { q, meta, product } = state.lastQuote;
  const lines = [
    `INDICATIVE QUOTE — Branding & Decoration Botswana`,
    meta.client ? `Client/project: ${meta.client}` : null,
    `Product: ${product.name} (${q.qty} ${product.unit})`,
    ...q.decorLines.map((l) => `Decoration: ${l.label}`),
    `Delivery: ${meta.deliveryZone}`,
    `Terms: ${meta.terms === "prepay" ? "prepayment" : meta.terms.replace("days", "") + " days"}`,
    `Total (incl. VAT): ${money(q.totalInclVat)}`,
    `Unit price: ${money2(q.unitPriceInclVat)}`,
    `Lead time: ${product.lead_days} working days`,
    `Note: indicative only. Firm quote follows verified costing and artwork review.`
  ].filter(Boolean);
  return lines.join("\n");
}

async function copySummary() {
  try {
    await navigator.clipboard.writeText(summaryText());
    toast("Quote summary copied to clipboard.");
  } catch {
    toast("Copy failed — select the quote text manually.");
  }
}

function sendWhatsApp() {
  const text = encodeURIComponent(summaryText());
  const base = CONFIG.WHATSAPP_NUMBER ? `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${text}` : `https://wa.me/?text=${text}`;
  window.open(base, "_blank", "noopener");
}

function toast(msg) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.cssText = "position:fixed;left:50%;bottom:1.2rem;transform:translateX(-50%);background:#0f3d2e;color:#fff;padding:.6rem .9rem;border-radius:999px;font-size:.85rem;z-index:100;box-shadow:0 8px 24px rgba(0,0,0,.2)";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

/* ---------------- form wiring ---------------- */

function productsSorted() {
  return [...state.data.products].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

function initForm() {
  const productSel = $("#q-product");
  productSel.innerHTML = productsSorted()
    .map((p) => `<option value="${p.id}">${p.category} — ${p.name} (from ${money(p.landed_cost * 1.28)}/${p.unit})</option>`)
    .join("");

  const zoneSel = $("#q-delivery");
  zoneSel.innerHTML = state.data.delivery.map((d) => `<option value="${d.zone}">${d.zone}${d.fee ? " — " + money(d.fee) : " — free"}</option>`).join("");

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + state.data.config.quote_validity_days);
  $("#q-validity").textContent = validUntil.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  productSel.addEventListener("change", () => { renderDecorOptions(); updateProductNote(); });
  $("#q-qty").addEventListener("input", updateProductNote);
  $("#quote-form").addEventListener("submit", onSubmit);
  $("#q-reset").addEventListener("click", resetForm);
  $("#partner-cta").addEventListener("click", (e) => {
    e.preventDefault();
    window.open(`mailto:${CONFIG.EMAIL}?subject=Partner%20network%20application%20—%20decoration%20capacity&body=Company%3A%0ALocation%3A%0AMachines%3A%0ACapacity%20per%20day%3A%0AThree%20references%3A`, "_blank");
  });

  renderDecorOptions();
  updateProductNote();
}

function currentProduct() {
  return state.data.products.find((p) => p.id === $("#q-product").value) || state.data.products[0];
}

function renderDecorOptions() {
  const product = currentProduct();
  const wrap = $("#decor-options");
  const allowed = product.decor || [];

  if (!allowed.length) {
    wrap.innerHTML = `<p class="tiny">This item is supplied without branding. Choose a decoration-compatible product to add your logo.</p>`;
    state.decor = [];
    return;
  }

  state.decor = state.decor.filter((id) => allowed.includes(id));
  if (!state.decor.length && allowed.length) state.decor = [allowed[0]];

  wrap.innerHTML = allowed.map((id) => {
    const d = decorById(id);
    const qty = Number($("#q-qty").value || 0);
    const blocked = d.minQty && qty > 0 && qty < d.minQty;
    return `<label class="chip ${state.decor.includes(id) ? "selected" : ""} ${blocked ? "disabled" : ""}" title="${d.note || ""}">
      <input type="checkbox" value="${id}" ${state.decor.includes(id) ? "checked" : ""} ${blocked ? "disabled" : ""}/>
      ${d.label}${blocked ? ` (min ${d.minQty})` : ""}
    </label>`;
  }).join("");

  wrap.querySelectorAll("input[type=checkbox]").forEach((cb) => {
    cb.addEventListener("change", () => {
      state.decor = cb.checked
        ? [...new Set([...state.decor, cb.value])]
        : state.decor.filter((v) => v !== cb.value);
      wrap.querySelectorAll(".chip").forEach((chip) => {
        const input = chip.querySelector("input");
        chip.classList.toggle("selected", input.checked);
      });
      toggleEmbroideryFields();
    });
  });

  toggleEmbroideryFields();
}

function toggleEmbroideryFields() {
  const hasEmbroidery = state.decor.includes("embroidery");
  const hasScreen = state.decor.includes("screen");
  $("#q-stitches").closest(".field").style.display = hasEmbroidery ? "" : "none";
  $("#screen-colours-wrap").hidden = !hasScreen;
}

function updateProductNote() {
  const p = currentProduct();
  const qty = Number($("#q-qty").value || 0);
  $("#q-product-note").textContent = `Minimum ${p.moq} ${p.unit} · lead time ${p.lead_days} working days · ${channelLabel(p.channel)}`;
  $("#q-qty-note").textContent = qty && qty < p.moq ? `Below minimum order quantity (${p.moq}).` : "";
  renderDecorOptionsIfNeeded();
}

let lastProductId = null;
function renderDecorOptionsIfNeeded() {
  const id = $("#q-product").value;
  if (id !== lastProductId) { lastProductId = id; renderDecorOptions(); }
}

function onSubmit(e) {
  e.preventDefault();
  const product = currentProduct();
  const qty = Math.max(1, Number($("#q-qty").value || 1));
  const deliveryZone = $("#q-delivery").value;
  const deliveryFee = (state.data.delivery.find((d) => d.zone === deliveryZone) || { fee: 0 }).fee;
  const terms = $("#q-terms").value;
  const rush = $("#q-rush").value;
  const positions = Math.min(4, Math.max(1, Number($("#q-positions").value || 1)));
  const colours = Math.min(6, Math.max(1, Number($("#q-colours").value || 1)));
  const stitches = Math.max(6000, Number($("#q-stitches").value || 8000));

  if (!state.decor.length) renderDecorOptions();

  const q = calculate({ product, qty, decorIds: state.decor, stitches, positions, colours, deliveryFee, terms, rush });
  renderQuote(q, { product, qty, decorIds: state.decor, deliveryZone, terms, rush, client: $("#q-client").value.trim() });
}

function resetForm() {
  $("#quote-form").reset();
  state.decor = [];
  lastProductId = null;
  $("#quote-output").innerHTML = `<div class="placeholder"><h3>Your quote appears here</h3><p>The engine will show unit price, line totals, decoration and setup charges, delivery, VAT and validity date.</p></div>`;
  renderDecorOptions();
  updateProductNote();
}

/* ---------------- catalogue grid ---------------- */

function initCatalogue() {
  const catSel = $("#c-category");
  const cats = [...new Set(state.data.products.map((p) => p.category))].sort();
  catSel.innerHTML = `<option value="">All categories</option>` + cats.map((c) => `<option value="${c}">${c}</option>`).join("");
  catSel.addEventListener("change", renderGrid);
  $("#c-search").addEventListener("input", renderGrid);
  renderGrid();
}

function renderGrid() {
  const term = $("#c-search").value.trim().toLowerCase();
  const cat = $("#c-category").value;
  const list = state.data.products.filter((p) =>
    (!cat || p.category === cat) &&
    (!term || p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))
  );

  $("#catalogue-grid").innerHTML = list.map((p) => `
    <article class="card p-card">
      <h3>${p.name}</h3>
      <div class="p-meta">
        <span class="p-tag">${p.category}</span>
        <span class="p-tag">Min ${p.moq} ${p.unit}</span>
        <span class="p-tag">${p.lead_days} days</span>
      </div>
      <p class="tiny">From <strong>${money(p.landed_cost * 1.28)}</strong> per ${p.unit} (indicative, volume dependent)</p>
      <p class="tiny">Decoration options: ${(p.decor || []).map((d) => decorById(d)?.label || d).join(", ") || "None — supplied blank"}</p>
      <div class="p-actions">
        <button class="btn ghost" type="button" data-quote="${p.id}">Quote this item</button>
      </div>
    </article>
  `).join("");

  $("#catalogue-count").textContent = `${list.length} of ${state.data.products.length} items shown · indicative pricing, replace with verified supplier costs`;

  document.querySelectorAll("[data-quote]").forEach((btn) => {
    btn.addEventListener("click", () => {
      $("#q-product").value = btn.dataset.quote;
      lastProductId = btn.dataset.quote;
      renderDecorOptions();
      updateProductNote();
      document.getElementById("quote").scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* ---------------- boot ---------------- */

(async function boot() {
  try {
    await loadData();
    initForm();
    initCatalogue();
  } catch (err) {
    document.querySelector("main").insertAdjacentHTML("afterbegin",
      `<div class="wrap"><p class="q-warn">Catalogue data could not be loaded (${escapeHtml(err.message)}). Serve this folder over HTTP — e.g. <code>python3 -m http.server</code> — rather than opening the file directly.</p></div>`);
  }

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
