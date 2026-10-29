/* B&D Admin — offline-first CMS + ERP
   Zero dependencies. IndexedDB via db.js. Seeded from JSON. Exports back to JSON for GitHub.
*/
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const money = n => 'P' + Math.round(Number(n)||0).toLocaleString('en-BW');
const toast = m => { const el=document.createElement('div'); el.className='toast'; el.textContent=m; document.body.appendChild(el); setTimeout(()=>el.remove(),2600); };
const esc = s => String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const fmtDate = iso => { try{ return new Date(iso).toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'});}catch{ return iso||''; } };

// --- Login gate (device PIN, default 2026) ---
const PIN_KEY='bdb_admin_pin';
function getPin(){ return localStorage.getItem(PIN_KEY) || '2026'; }
function isAuthed(){ return sessionStorage.getItem('bdb_authed')==='1'; }
function showShell(show){
  $('#loginView').hidden = show;
  $('#shell').hidden = !show;
  if(show) refreshAll();
}
$('#pinBtn').addEventListener('click',()=>{
  if($('#pinInput').value === getPin()){ sessionStorage.setItem('bdb_authed','1'); showShell(true); }
  else toast('Wrong PIN');
});
$('#pinInput').addEventListener('keydown',e=>{ if(e.key==='Enter') $('#pinBtn').click(); });
$('#pinReset').addEventListener('click',()=>{ localStorage.removeItem(PIN_KEY); sessionStorage.removeItem('bdb_authed'); $('#pinInput').value='2026'; toast('PIN reset to 2026'); });
$('#logoutBtn').addEventListener('click',()=>{ sessionStorage.removeItem('bdb_authed'); showShell(false); });
if(isAuthed()) showShell(true);
else {
  $('#pinInput').value='';
  // show storage info on login
  if(navigator.storage && navigator.storage.estimate) navigator.storage.estimate().then(e=>{ const pct=e.quota? Math.round(e.usage/e.quota*100):0; $('#loginStorage').textContent = `${Math.round((e.usage||0)/1024/1024)} MB used${e.quota? ` / ${Math.round(e.quota/1024/1024)} MB (${pct}%)`:''}`; });
}

// --- Nav toggle + panel switching ---
$('#navToggle').addEventListener('click',()=> $('#nav').classList.toggle('open'));
window.switchPanel = (id)=>{
  $$('.nav button[data-panel]').forEach(b=> b.classList.toggle('active', b.dataset.panel===id));
  $$('.panel').forEach(p=> p.classList.toggle('active', p.id==='panel-'+id));
  $('#nav').classList.remove('open');
  // lazy refresh
  if(id==='dash') refreshDash();
  if(id==='catalogue') renderCatalogue();
  if(id==='suppliers') renderSuppliers();
  if(id==='vendors') renderVendors();
  if(id==='quotes') renderQuotes();
  if(id==='customers') renderCustomers();
  if(id==='partners') renderPartners();
  if(id==='certs') renderCerts();
  if(id==='pricing') loadPricingEditor();
  if(id==='stock') renderStock();
};
$$('.nav button[data-panel]').forEach(b=> b.addEventListener('click',()=> switchPanel(b.dataset.panel)));

// --- Net + DB badges + offline banner ---
function updateNet(){
  const on = navigator.onLine;
  $('#netBadge').textContent = on ? 'Online' : 'Offline';
  $('#netBadge').className = 'badge ' + (on?'live':'warn');
  $('#offlineBanner').classList.toggle('show', !on);
}
window.addEventListener('online', updateNet); window.addEventListener('offline', updateNet);
updateNet();
async function updateDBBadge(){
  try{ const db = await BDB_DB.openDB(); $('#dbBadge').textContent = `DB ✓ v${db.version}`; $('#dbBadge').className='badge live'; }catch{ $('#dbBadge').textContent='DB ✗'; $('#dbBadge').className='badge warn'; }
}
updateDBBadge();

// global search -> jump to catalogue
$('#globalSearch').addEventListener('keydown',e=>{
  if(e.key==='Enter'){
    const q=e.target.value.trim(); if(!q) return;
    switchPanel('catalogue'); $('#catSearch').value=q; renderCatalogue();
  }
});

// --- Seed from JSON when empty ---
async function seedAll(){
  const r1 = await BDB_DB.seedIfEmpty('products','data/catalogue.json', d=> (d.products||[]).map(p=>({...p, _suppliers: p.suppliers||[] })));
  const r2 = await BDB_DB.seedIfEmpty('suppliers','data/suppliers.json', d=> d.suppliers||[]);
  const r3 = await BDB_DB.seedIfEmpty('vendors','data/vendors.json', d=> d.vendors||[]);
  // seed settings from catalogue config if empty
  const s = await BDB_DB.count('settings');
  if(s===0){
    try{
      const res = await fetch('data/catalogue.json',{cache:'no-cache'}); const cat=await res.json();
      await BDB_DB.bulkPut('settings',[
        {key:'config', value: cat.config},
        {key:'delivery', value: cat.delivery},
        {key:'decoration', value: cat.decoration}
      ]);
    }catch(e){ console.warn('seed settings',e); }
  }
  $('#lastSeed').textContent = `Seed: products ${r1.seeded?'✓':'·'} ${r1.count||''} · suppliers ${r2.seeded?'✓':'·'} ${r2.count||''} · vendors ${r3.seeded?'✓':'·'} ${r3.count||''}`;
  updateDBBadge();
  return {r1,r2,r3};
}

// --- Refresh all KPIs ---
async function refreshDash(){
  const [pCount,sCount,qCount,queueCount] = await Promise.all([
    BDB_DB.count('products'), BDB_DB.count('suppliers'), BDB_DB.count('quotes'), BDB_DB.count('syncQueue')
  ]);
  $('#kpiProducts').textContent = pCount;
  $('#kpiSuppliers').textContent = sCount;
  $('#kpiQuotes').textContent = qCount;
  $('#kpiQueue').textContent = queueCount;
  $('#kpiProductsSub').textContent = pCount ? `${pCount} SKUs · duty-aware landed costs` : 'Seed the catalogue';
  $('#nDash').textContent = '';
  $('#nCat').textContent = pCount||'';
  $('#nSup').textContent = sCount||'';
  $('#nVen').textContent = await BDB_DB.count('vendors');
  $('#nQ').textContent = qCount||'';
  $('#nPar').textContent = await BDB_DB.count('partners');
  $('#catCount').textContent = `${pCount} items`;
}
async function refreshAll(){ await seedAll(); await refreshDash(); await Promise.all([renderCatalogue(),renderSuppliers(),renderVendors(),renderQuotes(),renderCustomers(),renderPartners(),renderCerts(),renderStock()]); }
$('#refreshDash').addEventListener('click', refreshAll);
$('#seedBtn').addEventListener('click', async()=>{ await seedAll(); await refreshAll(); toast('Re-synced JSON → IndexedDB'); });

// --- Catalogue ---
let catCache=[];
async function renderCatalogue(){
  const products = await BDB_DB.getAll('products');
  const suppliers = await BDB_DB.getAll('suppliers');
  catCache = products;
  // populate category + supplier filters
  const cats = [...new Set(products.map(p=>p.category))].sort();
  const prevCat = $('#catCategory').value;
  $('#catCategory').innerHTML = '<option value="">All categories</option>' + cats.map(c=>`<option>${esc(c)}</option>`).join('');
  if(cats.includes(prevCat)) $('#catCategory').value = prevCat;
  const supOpts = suppliers.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('');
  const prevSup = $('#catSupplier').value;
  $('#catSupplier').innerHTML = '<option value="">All suppliers</option>' + supOpts;
  if(suppliers.find(s=>s.id===prevSup)) $('#catSupplier').value = prevSup;
  applyCatFilter();
}
function applyCatFilter(){
  const q = ($('#catSearch').value||'').toLowerCase();
  const ch = $('#catChannel').value;
  const cat = $('#catCategory').value;
  const sup = $('#catSupplier').value;
  let list = catCache.filter(p=>{
    const hitQ = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.decor||[]).join(' ').includes(q) || p.id.toLowerCase().includes(q);
    const hitCh = !ch || p.channel===ch;
    const hitCat = !cat || p.category===cat;
    const hitSup = !sup || (p.suppliers||p._suppliers||[]).includes(sup) || (p.supplier_ids||[]).includes(sup);
    return hitQ && hitCh && hitCat && hitSup;
  });
  list.sort((a,b)=> a.category.localeCompare(b.category)||a.name.localeCompare(b.name));
  $('#catCount').textContent = `${list.length} of ${catCache.length}`;
  const tb = $('#catTable tbody');
  tb.innerHTML = list.map(p=>`
    <tr>
      <td><span class="kbd">${esc(p.id)}</span></td>
      <td><strong>${esc(p.name)}</strong><br/><span class="tiny">${esc(p.category)} · ${esc(p.unit||'each')}</span></td>
      <td>${esc(p.category)}</td>
      <td>${money(p.landed_cost)}</td>
      <td><span class="chip ${p.channel==='import'?'warn':''}">${esc(p.channel)}</span></td>
      <td>${p.moq}</td>
      <td>${p.lead_days}d</td>
      <td><span class="tiny">${esc((p.decor||[]).join(', ')||'—')}</span></td>
      <td><span class="tiny">${esc(((p.suppliers||p._suppliers||p.supplier_ids||[]).join(', ')||'—'))}</span></td>
      <td><button class="btn ghost" data-edit="${esc(p.id)}">Edit</button></td>
    </tr>`).join('') || '<tr><td colspan="10" class="tiny" style="text-align:center;padding:1rem;">No products match. Add one or clear filters.</td></tr>';
  tb.querySelectorAll('[data-edit]').forEach(b=> b.addEventListener('click',()=> openCatEditor(b.dataset.edit)));
}
$('#catSearch').addEventListener('input', applyCatFilter);
$('#catChannel').addEventListener('change', applyCatFilter);
$('#catCategory').addEventListener('change', applyCatFilter);
$('#catSupplier').addEventListener('change', applyCatFilter);

let editingCatId=null;
function openCatEditor(id){
  const p = catCache.find(x=>x.id===id);
  if(!p){ toast('Not found'); return; }
  editingCatId=id;
  $('#catEditorTitle').textContent = `Edit ${id} — ${p.name}`;
  $('#e_id').value=p.id; $('#e_id').disabled=true;
  $('#e_name').value=p.name; $('#e_cat').value=p.category; $('#e_unit').value=p.unit||'each';
  $('#e_channel').value=p.channel; $('#e_cost').value=p.landed_cost; $('#e_moq').value=p.moq; $('#e_lead').value=p.lead_days;
  $('#e_decor').value=(p.decor||[]).join(', ');
  $('#e_suppliers').value=((p.suppliers||p._suppliers||p.supplier_ids||[]).join(', '));
  $('#catEditor').hidden=false; $('#e_delete').hidden=false;
  $('#catEditor').scrollIntoView({behavior:'smooth',block:'center'});
}
$('#catAdd').addEventListener('click',()=>{
  editingCatId=null; $('#catEditorTitle').textContent='Add product';
  $('#e_id').value=''; $('#e_id').disabled=false; $('#e_name').value=''; $('#e_cat').value='Corporate clothing';
  $('#e_unit').value='each'; $('#e_channel').value='sa_trade'; $('#e_cost').value=''; $('#e_moq').value='25'; $('#e_lead').value='7';
  $('#e_decor').value='embroidery'; $('#e_suppliers').value='amrod_bw';
  $('#catEditor').hidden=false; $('#e_delete').hidden=true;
  $('#catEditor').scrollIntoView({behavior:'smooth'});
});
$('#e_cancel').addEventListener('click',()=>{ $('#catEditor').hidden=true; });
$('#e_delete').addEventListener('click', async()=>{
  if(!editingCatId) return;
  if(!confirm(`Delete ${editingCatId}?`)) return;
  await BDB_DB.del('products', editingCatId);
  $('#catEditor').hidden=true; await renderCatalogue(); await refreshDash(); toast('Deleted');
});
$('#e_save').addEventListener('click', async()=>{
  const id = ($('#e_id').value||'').trim().toLowerCase();
  const name = ($('#e_name').value||'').trim();
  if(!id || !name){ toast('ID and name required'); return; }
  const cost = Number($('#e_cost').value); if(!Number.isFinite(cost) || cost<0){ toast('Cost must be ≥0'); return; }
  const doc = {
    id, name, category: $('#e_cat').value, unit: $('#e_unit').value, channel: $('#e_channel').value,
    landed_cost: cost, moq: Math.max(1, Number($('#e_moq').value)||1), lead_days: Math.max(0, Number($('#e_lead').value)||0),
    decor: ($('#e_decor').value||'').split(',').map(s=>s.trim()).filter(Boolean),
    suppliers: ($('#e_suppliers').value||'').split(',').map(s=>s.trim()).filter(Boolean),
    _updated_at: new Date().toISOString()
  };
  await BDB_DB.put('products', doc);
  $('#catEditor').hidden=true; await renderCatalogue(); await refreshDash(); toast('Saved to IndexedDB');
});
$('#catExport').addEventListener('click', async()=>{
  const json = await BDB_DB.exportStore('products');
  $('#ex_out').value = json; switchPanel('import'); $('#ex_out').focus(); toast('Products JSON ready — commit to store/data/catalogue.json');
});

// --- Suppliers ---
let supCache=[];
async function renderSuppliers(){
  let list = await BDB_DB.getAll('suppliers');
  supCache = list;
  // if empty, seed from file directly for immediate view
  if(!list.length){
    try{
      const res=await fetch('data/suppliers.json'); const data=await res.json(); list=data.suppliers||[]; supCache=list;
    }catch{}
  }
  applySupFilter();
}
function applySupFilter(){
  const q = ($('#supSearch').value||'').toLowerCase();
  const ch = $('#supChannel').value;
  let list = supCache.filter(s=>{
    const hitQ = !q || s.name.toLowerCase().includes(q) || s.category.join(' ').toLowerCase().includes(q) || s.id.includes(q);
    const hitCh = !ch || s.channel===ch;
    return hitQ && hitCh;
  });
  const grid = $('#supplierGrid');
  grid.innerHTML = list.map(s=>`
    <article class="sup-card">
      <div style="display:flex;align-items:center;gap:.5rem;">
        <span class="chip live" style="min-width:38px;justify-content:center;font-weight:700;">${esc(s.logo||s.id.slice(0,2).toUpperCase())}</span>
        <h3>${esc(s.name)}</h3>
        <span class="badge ${s.status && s.status.toLowerCase().includes('priority') ? 'warn':''}" style="margin-left:auto;">${esc(s.status||s.channel)}</span>
      </div>
      <p class="sup-meta">${esc(s.country)} · <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url)}</a> ${s.alt_url?`· <a href="${esc(s.alt_url)}" target="_blank">${esc(s.alt_url)}</a>`:''}</p>
      <p class="tiny">${esc(s.type||'')} · ${s.trade_only? '🔒 trade-only' : 'open'} · ${esc(s.channel)} · ${s.lead_days}d${s.lead_days_import?` / import ${s.lead_days_import}d`:''}</p>
      <div class="chips">${(s.category||[]).map(c=>`<span class="chip">${esc(c)}</span>`).join('')}</div>
      <p class="tiny"><strong>Mapped:</strong> ${s.products_mapped||0} SKUs · <strong>MOQ:</strong> ${esc(s.moq_note||'—')}</p>
      <p class="tiny">${esc(s.strength||'')}</p>
      <p class="tiny" style="color:var(--muted);">Gap: ${esc(s.gap_to_exploit||s.notes||'')}</p>
      <div style="display:flex;gap:.4rem;margin-top:.6rem;">
        <button class="btn ghost" data-sup-edit="${esc(s.id)}">Edit</button>
        <a class="btn quiet" href="${esc(s.url)}" target="_blank" rel="noopener">Open site →</a>
        <span class="badge">${esc(s.channel)}</span>
      </div>
    </article>`).join('') || '<p class="tiny">No suppliers. Seed or import.</p>';
  grid.querySelectorAll('[data-sup-edit]').forEach(b=> b.addEventListener('click',()=> openSupEditor(b.dataset.supEdit)));
}
$('#supSearch').addEventListener('input', applySupFilter);
$('#supChannel').addEventListener('change', applySupFilter);
$('#supAdd').addEventListener('click',()=>{
  editingSupId=null; $('#supEditorTitle').textContent='Add supplier';
  $('#s_id').value=''; $('#s_id').disabled=false; $('#s_name').value=''; $('#s_url').value=''; $('#s_channel').value='sa_trade';
  $('#s_lead').value='7'; $('#s_trade').value='false'; $('#s_status').value='Benchmark'; $('#s_cats').value='Corporate clothing'; $('#s_notes').value='';
  $('#supEditor').hidden=false; $('#s_delete').hidden=true;
});
let editingSupId=null;
function openSupEditor(id){
  const s = supCache.find(x=>x.id===id); if(!s) return;
  editingSupId=id;
  $('#supEditorTitle').textContent=`Edit ${s.name}`;
  $('#s_id').value=s.id; $('#s_id').disabled=true; $('#s_name').value=s.name; $('#s_url').value=s.url||''; $('#s_channel').value=s.channel;
  $('#s_lead').value=s.lead_days||7; $('#s_trade').value=String(!!s.trade_only); $('#s_status').value=s.status||''; $('#s_cats').value=(s.category||[]).join(', '); $('#s_notes').value=s.notes||s.gap_to_exploit||'';
  $('#supEditor').hidden=false; $('#s_delete').hidden=false;
  $('#supEditor').scrollIntoView({behavior:'smooth'});
}
$('#s_cancel').addEventListener('click',()=> $('#supEditor').hidden=true);
$('#s_delete').addEventListener('click', async()=>{
  if(!editingSupId) return; if(!confirm(`Delete supplier ${editingSupId}?`)) return;
  await BDB_DB.del('suppliers', editingSupId); $('#supEditor').hidden=true; await renderSuppliers(); await refreshDash(); toast('Deleted');
});
$('#s_save').addEventListener('click', async()=>{
  const id = ($('#s_id').value||'').trim().toLowerCase().replace(/\s+/g,'_');
  const name = ($('#s_name').value||'').trim();
  if(!id||!name){ toast('ID + name required'); return; }
  const existing = await BDB_DB.get('suppliers', id) || supCache.find(s=>s.id===id) || {};
  const doc = {
    ...existing,
    id, name, url: $('#s_url').value.trim(), channel: $('#s_channel').value,
    lead_days: Number($('#s_lead').value)||7, trade_only: $('#s_trade').value==='true',
    status: $('#s_status').value.trim(), category: $('#s_cats').value.split(',').map(s=>s.trim()).filter(Boolean),
    notes: $('#s_notes').value.trim(), gap_to_exploit: $('#s_notes').value.trim(),
    _updated_at: new Date().toISOString()
  };
  await BDB_DB.put('suppliers', doc);
  $('#supEditor').hidden=true; await renderSuppliers(); await refreshDash(); toast('Supplier saved');
});
$('#supExport').addEventListener('click', async()=>{ $('#ex_out').value = await BDB_DB.exportStore('suppliers'); switchPanel('import'); toast('Suppliers JSON ready'); });

// --- Vendors ---
async function renderVendors(){
  const vs = await BDB_DB.getAll('vendors');
  const tb = $('#vendorTable tbody');
  if(!vs.length){
    // fallback to file preview
    try{
      const res=await fetch('data/vendors.json'); const data=await res.json(); const vendors=data.vendors||[];
      tb.innerHTML = vendors.map(v=>`<tr><td><strong>${esc(v.name)}</strong><br/><span class="tiny">${esc(v.id)}</span></td><td>${esc(v.supplier_id)}</td><td>${esc(v.type)}</td><td>${v.content_items}</td><td><span class="badge ${v.status==='active'?'live':''}">${esc(v.status)}</span></td><td>${esc(v.last_sync)}</td><td><span class="tiny">File-only — seed to edit</span></td></tr>`).join('');
      return;
    }catch{}
  }
  tb.innerHTML = vs.map(v=>`
    <tr>
      <td><strong>${esc(v.name)}</strong><br/><span class="tiny">${esc(v.id)}</span></td>
      <td>${esc(v.supplier_id||'—')}</td>
      <td>${esc(v.type)}</td>
      <td>${v.content_items||0}</td>
      <td><span class="badge ${v.status==='active'?'live':''}">${esc(v.status||'active')}</span></td>
      <td>${esc(v.last_sync||'—')}</td>
      <td><button class="btn ghost" data-vdel="${esc(v.id)}">Delete</button></td>
    </tr>`).join('') || '<tr><td colspan="7" class="tiny" style="text-align:center;">No vendors — add one below.</td></tr>';
  tb.querySelectorAll('[data-vdel]').forEach(b=> b.addEventListener('click', async()=>{
    if(!confirm(`Delete ${b.dataset.vdel}?`)) return;
    await BDB_DB.del('vendors', b.dataset.vdel); renderVendors(); toast('Deleted');
  }));
}
$('#v_add').addEventListener('click', async()=>{
  const name=($('#v_name').value||'').trim(); if(!name){ toast('Name required'); return; }
  const id='v_'+name.toLowerCase().replace(/[^a-z0-9]+/g,'_').slice(0,24);
  const doc={ id, supplier_id:$('#v_sup').value.trim()||'amrod_bw', name, type:$('#v_type').value, status:$('#v_status').value, assets:$('#v_assets').value.split(',').map(s=>s.trim()).filter(Boolean), notes:$('#v_notes').value.trim(), content_items:0, last_sync:new Date().toISOString().slice(0,10), _created_at:new Date().toISOString() };
  await BDB_DB.put('vendors', doc); $('#v_name').value=''; $('#v_notes').value=''; renderVendors(); refreshDash(); toast('Vendor added');
});
$('#v_export').addEventListener('click', async()=>{ $('#ex_out').value = await BDB_DB.exportStore('vendors'); switchPanel('import'); });

// --- Quotes & Orders ---
let quoteCache=[];
async function renderQuotes(){
  let items = await BDB_DB.getAll('quotes');
  // also include orders for unified view? Keep separate but show quotes count
  quoteCache = items;
  applyQuoteFilter();
}
function applyQuoteFilter(){
  const q=($('#qSearch').value||'').toLowerCase();
  const st=$('#qStatus').value;
  let list = quoteCache.filter(r=>{
    const hitQ=!q || r.id.toLowerCase().includes(q) || (r.customer||'').toLowerCase().includes(q) || (r.sku||'').toLowerCase().includes(q);
    const hitS=!st || r.status===st;
    return hitQ && hitS;
  });
  list.sort((a,b)=> (b.created_at||'').localeCompare(a.created_at||''));
  const tb=$('#quoteTable tbody');
  tb.innerHTML = list.map(r=>`
    <tr>
      <td><span class="kbd">${esc(r.id)}</span></td>
      <td>${esc(r.customer||'—')}</td>
      <td>${esc(r.sku||'—')}</td>
      <td>${r.qty||0}</td>
      <td>${money(r.total_ex_vat||r.total||0)}</td>
      <td>${r.margin!=null? (Number(r.margin)*100).toFixed(1)+'%':'—'} ${r.margin!=null && Number(r.margin)<0.28?'<span class="badge warn">below floor</span>':''}</td>
      <td><span class="badge ${r.status==='approved'?'live':''}">${esc(r.status)}</span></td>
      <td class="tiny">${fmtDate(r.created_at)}</td>
      <td><button class="btn ghost" data-qedit="${esc(r.id)}">Edit</button></td>
    </tr>`).join('') || '<tr><td colspan="9" class="tiny" style="text-align:center;">No quotes yet. Capture from storefront or add manually.</td></tr>';
  tb.querySelectorAll('[data-qedit]').forEach(b=> b.addEventListener('click',()=> openQuoteEditor(b.dataset.qedit)));
  $('#qCount').textContent = `${list.length} / ${quoteCache.length}`;
}
$('#qSearch').addEventListener('input', applyQuoteFilter);
$('#qStatus').addEventListener('change', applyQuoteFilter);
let editingQId=null;
function openQuoteEditor(id){
  const r=quoteCache.find(x=>x.id===id); if(!r) return;
  editingQId=id; $('#qEditorTitle').textContent=`Edit ${id}`;
  $('#q_customer').value=r.customer||''; $('#q_sku').value=r.sku||''; $('#q_qty').value=r.qty||100; $('#q_total').value=r.total_ex_vat||r.total||0; $('#q_margin').value=r.margin||''; $('#q_status').value=r.status||'draft'; $('#q_zone').value=r.zone||'Gaborone';
  $('#qEditor').hidden=false; $('#q_delete').hidden=false;
}
$('#qAdd').addEventListener('click',()=>{
  editingQId=null; $('#qEditorTitle').textContent='Add quote / order';
  $('#q_customer').value=''; $('#q_sku').value='c01'; $('#q_qty').value='100'; $('#q_total').value=''; $('#q_margin').value='0.38'; $('#q_status').value='draft'; $('#q_zone').value='Gaborone';
  $('#qEditor').hidden=false; $('#q_delete').hidden=true;
});
$('#q_cancel').addEventListener('click',()=> $('#qEditor').hidden=true);
$('#q_delete').addEventListener('click', async()=>{
  if(!editingQId) return; if(!confirm(`Delete ${editingQId}?`)) return;
  await BDB_DB.del('quotes', editingQId); $('#qEditor').hidden=true; renderQuotes(); refreshDash(); toast('Deleted');
});
$('#q_save').addEventListener('click', async()=>{
  const customer=($('#q_customer').value||'').trim(); if(!customer){ toast('Customer required'); return; }
  const sku=($('#q_sku').value||'').trim()||'c01';
  const qty=Math.max(1, Number($('#q_qty').value)||1);
  const total=Number($('#q_total').value)||0;
  const margin=Number($('#q_margin').value);
  const id = editingQId || `Q-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  const doc={ id, customer, sku, qty, total_ex_vat: total, total, margin, status:$('#q_status').value, zone:$('#q_zone').value, created_at: editingQId ? (quoteCache.find(x=>x.id===editingQId)?.created_at || new Date().toISOString()) : new Date().toISOString(), _updated_at:new Date().toISOString() };
  await BDB_DB.put('quotes', doc);
  $('#qEditor').hidden=true; renderQuotes(); refreshDash(); toast('Quote saved — offline queue updated');
});
$('#qExport').addEventListener('click', async()=>{ $('#ex_out').value = await BDB_DB.exportStore('quotes'); switchPanel('import'); });

// --- Customers ---
async function renderCustomers(){
  const cs = await BDB_DB.getAll('customers');
  const tb=$('#customerTable tbody');
  tb.innerHTML = cs.map(c=>`<tr><td><strong>${esc(c.name||c.id)}</strong><br/><span class="tiny">${esc(c.contact||'')}</span></td><td><span class="tiny">${esc((c.vault||'').slice(0,80))}${(c.vault||'').length>80?'…':''}</span></td><td>${c.stores||0}</td><td class="tiny">${fmtDate(c.last_order||c._updated_at)}</td><td><button class="btn ghost" data-cdel="${esc(c.id)}">Delete</button></td></tr>`).join('') || '<tr><td colspan="5" class="tiny" style="text-align:center;">No customers — add one below.</td></tr>';
  tb.querySelectorAll('[data-cdel]').forEach(b=> b.addEventListener('click', async()=>{ if(!confirm(`Delete ${b.dataset.cdel}?`)) return; await BDB_DB.del('customers', b.dataset.cdel); renderCustomers(); }));
}
$('#c_add').addEventListener('click', async()=>{
  const name=($('#c_name').value||'').trim(); if(!name){ toast('Customer name required'); return; }
  const id='c_'+name.toLowerCase().replace(/[^a-z0-9]+/g,'_').slice(0,24);
  const existing = await BDB_DB.get('customers', id) || {id, name, stores:0};
  const doc={ ...existing, name, contact:$('#c_contact').value.trim(), vault:$('#c_vault').value.trim(), last_order: existing.last_order||new Date().toISOString(), _updated_at:new Date().toISOString()};
  await BDB_DB.put('customers', doc); $('#c_name').value=''; $('#c_contact').value=''; $('#c_vault').value=''; renderCustomers(); toast('Customer saved');
});
$('#c_export').addEventListener('click', async()=>{ $('#ex_out').value = await BDB_DB.exportStore('customers'); switchPanel('import'); });

// --- Partners ---
async function renderPartners(){
  const ps=await BDB_DB.getAll('partners');
  const tb=$('#partnerTable tbody');
  tb.innerHTML = ps.map(p=>`<tr><td><strong>${esc(p.name)}</strong><br/><span class="tiny">${esc(p.machines||'')}</span></td><td>${esc(p.town)}</td><td>${p.capacity||0}</td><td>${p.on_time!=null?p.on_time+'%':'—'}</td><td>${p.defect!=null?p.defect+'%':'—'}</td><td><span class="badge ${p.status==='active'?'live':''}">${esc(p.status||'active')}</span></td><td><button class="btn ghost" data-pdel="${esc(p.id)}">Delete</button></td></tr>`).join('') || '<tr><td colspan="7" class="tiny" style="text-align:center;">No partners — add 3–5 with trial jobs (BDB-017/018).</td></tr>';
  tb.querySelectorAll('[data-pdel]').forEach(b=> b.addEventListener('click', async()=>{ if(!confirm(`Delete ${b.dataset.pdel}?`)) return; await BDB_DB.del('partners', b.dataset.pdel); renderPartners(); refreshDash(); }));
}
$('#p_add').addEventListener('click', async()=>{
  const name=($('#p_name').value||'').trim(); if(!name){ toast('Name required'); return; }
  const id='p_'+name.toLowerCase().replace(/[^a-z0-9]+/g,'_').slice(0,20);
  const doc={ id, name, town:$('#p_town').value, machines:$('#p_machines').value.trim(), capacity: Number($('#p_cap').value)||0, on_time:95, defect:1.5, status:'active', _created_at:new Date().toISOString()};
  await BDB_DB.put('partners', doc); $('#p_name').value=''; $('#p_machines').value=''; $('#p_cap').value=''; renderPartners(); refreshDash(); toast('Partner added');
});

// --- Certificates ---
async function renderCerts(){
  const cs=await BDB_DB.getAll('certificates');
  const tb=$('#certTable tbody');
  tb.innerHTML = cs.map(c=>`<tr><td><span class="kbd">${esc(c.sku)}</span></td><td>${esc(c.cert_id||c.id)}</td><td>${esc(c.issuer)}</td><td>${esc(c.standard)}</td><td>${esc(c.expiry||'—')}</td><td>${c.file?`<a href="${esc(c.file)}" target="_blank">Drive</a>`:'—'}</td><td><button class="btn ghost" data-certdel="${esc(c.id)}">Delete</button></td></tr>`).join('') || '<tr><td colspan="7" class="tiny" style="text-align:center;">No certificates — add per SKU (BDB-022, &lt;4 min attach).</td></tr>';
  tb.querySelectorAll('[data-certdel]').forEach(b=> b.addEventListener('click', async()=>{ if(!confirm(`Delete ${b.dataset.certdel}?`)) return; await BDB_DB.del('certificates', b.dataset.certdel); renderCerts(); }));
}
$('#cert_add').addEventListener('click', async()=>{
  const sku=($('#cert_sku').value||'').trim().toLowerCase(); if(!sku){ toast('SKU required'); return; }
  const id=`cert_${sku}_${Date.now().toString(36)}`;
  const doc={ id, sku, cert_id:$('#cert_id').value.trim()||id, issuer:$('#cert_issuer').value.trim(), standard:$('#cert_std').value.trim(), expiry:$('#cert_exp').value, file:$('#cert_file').value.trim(), _created_at:new Date().toISOString()};
  await BDB_DB.put('certificates', doc); $('#cert_sku').value=''; $('#cert_id').value=''; $('#cert_std').value=''; $('#cert_exp').value=''; $('#cert_file').value=''; renderCerts(); toast('Certificate added');
});

// --- Pricing editor ---
async function loadPricingEditor(){
  const cfg = await BDB_DB.get('settings','config');
  const del = await BDB_DB.get('settings','delivery');
  let config = cfg?.value; let delivery = del?.value;
  if(!config || !delivery){
    try{ const res=await fetch('data/catalogue.json'); const cat=await res.json(); config=cat.config; delivery=cat.delivery; }catch{}
  }
  if(!config) return;
  $('#pr_vat').value = config.vat_rate; $('#pr_free').value=config.free_delivery_threshold; $('#pr_min').value=config.min_order_value; $('#pr_rush').value=config.rush_surcharge; $('#pr_c30').value=config.credit_surcharge?.days30||0.02; $('#pr_c60').value=config.credit_surcharge?.days60||0.04; $('#pr_floor').value=config.decoration_margin_floor||0.5;
  $('#pr_tiers').value = JSON.stringify(config.margin_tiers, null, 2);
  $('#pr_zones').value = JSON.stringify(delivery, null, 2);
}
$('#pr_reset').addEventListener('click', loadPricingEditor);
$('#pr_export').addEventListener('click', async()=>{
  const cfg = await BDB_DB.get('settings','config'); $('#ex_out').value = JSON.stringify(cfg?.value||{}, null, 2); switchPanel('import');
});
$('#pr_save').addEventListener('click', async()=>{
  try{
    const tiers=JSON.parse($('#pr_tiers').value); const zones=JSON.parse($('#pr_zones').value);
    const config={ vat_rate:Number($('#pr_vat').value), free_delivery_threshold:Number($('#pr_free').value), min_order_value:Number($('#pr_min').value), rush_surcharge:Number($('#pr_rush').value), credit_surcharge:{ prepay:0, days30:Number($('#pr_c30').value), days60:Number($('#pr_c60').value)}, margin_tiers:tiers, decoration_margin_floor:Number($('#pr_floor').value), quote_validity_days:14, rush_days_threshold:3 };
    await BDB_DB.put('settings', {key:'config', value:config}); await BDB_DB.put('settings', {key:'delivery', value:zones});
    // also update catalogue.json in DB for export
    const products = await BDB_DB.getAll('products');
    // we keep catalogue.json as the export artifact — no live overwrite here, user exports via Import/Export
    toast('Pricing saved to IndexedDB — export via Import/Export → commit to catalogue.json');
    loadPricingEditor();
  }catch(e){ toast('Invalid JSON: '+e.message); }
});

// --- Stock ---
async function renderStock(){
  const stock = await BDB_DB.getAll('settings').then(rows=> { const s=rows.find(r=>r.key==='stock'); return s?.value || []; });
  // derive from products with channel local_stock as fallback
  let products = await BDB_DB.getAll('products');
  let buffer = products.filter(p=>p.channel==='local_stock');
  const tb=$('#stockTable tbody');
  // merge stock quantities if present
  const stockMap = new Map((Array.isArray(stock)?stock:[]).map(s=>[s.sku, s]));
  const rows = buffer.map(p=>{
    const s=stockMap.get(p.id) || {sku:p.id, on_hand:0, demand:2};
    const cover = s.demand>0 ? (s.on_hand/s.demand).toFixed(1) : '—';
    const reorder = s.demand>0 && s.on_hand / s.demand < 14 ? '⚠️ reorder' : 'ok';
    return `<tr><td><span class="kbd">${esc(p.id)}</span></td><td>${esc(p.name)}</td><td>${s.on_hand}</td><td>${cover} d</td><td>${reorder}</td><td><button class="btn ghost" data-stedit="${esc(p.id)}">Edit</button></td></tr>`;
  }).join('') || '<tr><td colspan="6" class="tiny" style="text-align:center;">No buffer SKUs — set channel <code>local_stock</code> on fast movers (≤50 SKUs).</td></tr>';
  tb.innerHTML = rows;
}
$('#st_add').addEventListener('click', async()=>{
  const sku=($('#st_sku').value||'').trim().toLowerCase(); const qty=Number($('#st_qty').value); const demand=Number($('#st_demand').value)||2;
  if(!sku){ toast('SKU required'); return; }
  let stock = (await BDB_DB.get('settings','stock'))?.value || [];
  if(!Array.isArray(stock)) stock=[];
  const idx=stock.findIndex(s=>s.sku===sku);
  const entry={sku, on_hand:qty, demand, updated_at:new Date().toISOString()};
  if(idx>=0) stock[idx]=entry; else stock.push(entry);
  await BDB_DB.put('settings', {key:'stock', value:stock}); $('#st_sku').value=''; $('#st_qty').value=''; $('#st_demand').value=''; renderStock(); toast('Stock updated');
});

// --- Import / Export ---
$('#im_sample').addEventListener('click',()=>{
  $('#im_paste').value = 'id,name,category,unit,landed_cost,moq,lead_days,channel,decor\nc16,Softshell vest,Corporate clothing,each,290,15,14,sa_trade,embroidery\nw15,Nitrile gloves box,Workwear & PPE,box,98,10,7,sa_trade,\nm13,Bucket hat — local CMT,Headwear,each,52,100,14,local,embroidery|dtf_a5';
  $('#im_target').value='products'; $('#im_mode').value='merge';
});
$('#im_run').addEventListener('click', async()=>{
  const raw=($('#im_paste').value||'').trim(); if(!raw){ toast('Paste JSON or CSV'); return; }
  const target=$('#im_target').value; const mode=$('#im_mode').value;
  let items=[];
  if(raw.startsWith('[') || raw.startsWith('{')){
    try{
      const data=JSON.parse(raw);
      items = Array.isArray(data) ? data : (data.products || data.suppliers || data.vendors || data.quotes || data[target] || [data]);
    }catch(e){ toast('Invalid JSON: '+e.message); return; }
  } else {
    // CSV
    const lines=raw.split('\n').map(l=>l.trim()).filter(Boolean);
    const header=lines[0].split(',').map(h=>h.trim().toLowerCase());
    for(let i=1;i<lines.length;i++){
      const cols=lines[i].split(',').map(c=>c.trim());
      const obj={}; header.forEach((h,idx)=> obj[h]=cols[idx]||'');
      if(!obj.id) continue;
      obj.landed_cost = Number(obj.landed_cost)||0; obj.moq=Number(obj.moq)||1; obj.lead_days=Number(obj.lead_days)||7;
      obj.decor = (obj.decor||'').split('|').map(s=>s.trim()).filter(Boolean);
      obj._imported_at = new Date().toISOString();
      items.push(obj);
    }
  }
  if(!items.length){ toast('No items parsed'); return; }
  if(mode==='replace') await BDB_DB.clear(target);
  // normalize key
  const keyMap={products:'id',suppliers:'id',vendors:'id',quotes:'id',customers:'id',partners:'id'};
  const key=keyMap[target]||'id';
  for(const it of items){ if(!it[key]) it[key]=it.id||`imp_${Date.now().toString(36)}`; await BDB_DB.put(target, it); }
  toast(`Imported ${items.length} → ${target} (${mode})`);
  refreshAll();
});
$$('[data-export]').forEach(b=> b.addEventListener('click', async()=>{
  const store=b.dataset.export;
  const json = await BDB_DB.exportStore(store);
  $('#ex_out').value=json;
  toast(`${store} exported`);
}));
$('#exAll').addEventListener('click', async()=>{
  $('#ex_out').value = await BDB_DB.exportAll();
  toast('Full dump ready');
});
$('#exCopy').addEventListener('click', async()=>{
  try{ await navigator.clipboard.writeText($('#ex_out').value); toast('Copied'); }catch{ toast('Copy failed — select manually'); }
});
$('#exDownload').addEventListener('click',()=>{
  const blob=new Blob([$('#ex_out').value||'{}'],{type:'application/json'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`bdb-export-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
});

// --- System ---
$('#sys_pin_save').addEventListener('click',()=>{
  const pin=($('#sys_pin').value||'').trim(); if(pin.length<4){ toast('PIN ≥4 chars'); return; }
  localStorage.setItem(PIN_KEY, pin); $('#sys_pin').value=''; toast('PIN saved on this device');
});
$('#sys_pin_clear').addEventListener('click',()=>{ localStorage.removeItem(PIN_KEY); toast('PIN cleared — default 2026'); });
async function checkStorage(){
  if(navigator.storage && navigator.storage.estimate){
    const est=await navigator.storage.estimate();
    const used=Math.round((est.usage||0)/1024/1024);
    const quota=Math.round((est.quota||0)/1024/1024);
    const pct= est.quota? Math.round(est.usage/est.quota*100):0;
    $('#sysStorage').textContent = `${used} MB used / ${quota} MB quota (${pct}%) — IndexedDB ${DB_NAME} v${BDB_DB.DB_VERSION}`;
  } else $('#sysStorage').textContent = 'Storage estimate not available in this browser.';
  if('serviceWorker' in navigator){
    const reg=await navigator.serviceWorker.getRegistration();
    $('#sysSW').textContent = reg ? `Service worker: ${reg.active? 'active' : 'installing'} — ${reg.scope}` : 'No service worker registered';
    if(reg) $('#sysSW').textContent += ` · updateViaCache: ${reg.updateViaCache}`;
  }
  if('caches' in window){
    const keys=await caches.keys();
    let total=0;
    for(const k of keys){ const c=await caches.open(k); const reqs=await c.keys(); total+=reqs.length; }
    $('#sysCache').textContent = `Caches: ${keys.join(', ')||'none'} · ${total} entries`;
  }
}
$('#sysCheckStorage').addEventListener('click', checkStorage);
$('#sysUpdateSW').addEventListener('click', async()=>{
  if('serviceWorker' in navigator){
    const reg=await navigator.serviceWorker.getRegistration();
    if(reg){ await reg.update(); toast('SW update requested'); checkStorage(); } else toast('No SW registered');
  }
});
$('#sysClearCache').addEventListener('click', async()=>{
  if('caches' in window){ const keys=await caches.keys(); await Promise.all(keys.map(k=>caches.delete(k))); toast('Caches cleared — reload'); checkStorage(); }
});
$('#sysExportAll').addEventListener('click', async()=>{ $('#ex_out').value = await BDB_DB.exportAll(); switchPanel('import'); toast('Backup ready — save to Drive/GitHub'); });
$('#sysWipe').addEventListener('click', async()=>{
  if(!confirm('Wipe ALL IndexedDB data on THIS device? GitHub JSON remains. This cannot be undone.')) return;
  const db = await BDB_DB.openDB();
  db.close();
  await new Promise((res,rej)=>{ const req=indexedDB.deleteDatabase(BDB_DB.DB_NAME); req.onsuccess=()=>res(); req.onerror=()=>rej(req.error); });
  toast('Wiped — reload and re-seed');
  setTimeout(()=> location.reload(), 900);
});
$('#sysWipe').addEventListener('dblclick',()=>{}); // guard

// initial storage check (non-blocking)
checkStorage();

// --- expose for storefront offline quote capture ---
window.BDB_ADMIN = { refreshAll, renderCatalogue, renderSuppliers };
