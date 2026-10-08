/* Ronbo Admin Web — app.js
   Firebase v10 modular SDK via import maps.
   Collections: users, products, bundles, discounts, settings
*/
import { initializeApp } from "firebase/app";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc,
  updateDoc, deleteDoc, query, orderBy, serverTimestamp
} from "firebase/firestore";

/* ---------------- Firebase config (provided) ---------------- */
const firebaseConfig = {
  apiKey: "AIzaSyCGE8t2Rz_ty9fC3cRctoQ7pNEVlS2ow3w",
  authDomain: "ronbo-store-admin.firebaseapp.com",
  projectId: "ronbo-store-admin",
  storageBucket: "ronbo-store-admin.firebasestorage.app",
  messagingSenderId: "413083237162",
  appId: "1:413083237162:web:3a17f678a4377a026d3c53"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ---------------- i18n ---------------- */
const STR = {
  en: {
    brand_tag: "Peace • Balance • Wellness",
    login: "Log in", register: "Create account", logout: "Log out",
    email: "Email", password: "Password", name: "Name",
    login_title: "Welcome back", register_title: "Create your account",
    login_sub: "Ronbo Store administration",
    register_sub: "First account registered becomes the owner",
    need_account: "No account?", have_account: "Already have one?",
    auth_error: "Authentication failed. Check your credentials.",
    products: "Products", bundles: "Bundles", discounts: "Discounts",
    financials: "Financials", users: "Users", settings: "Settings",
    add_product: "+ Add product", edit_product: "Edit product",
    product_name: "Product name", sale_price: "Sale price (USD)",
    photo_url: "Photo URL", description: "Description",
    supplier: "Supplier", supplier_cost: "Supplier cost (USD)",
    shipping_cost: "Shipping cost (USD)", stock: "Stock",
    supplier_cj: "CJ Dropshipping", supplier_zen: "Zendrop",
    supplier_eprolo: "EPROLO", supplier_other: "Other",
    save: "Save", cancel: "Cancel", del: "Delete", edit: "Edit",
    confirm_delete: "Delete this item? This cannot be undone.",
    search_ph: "Search products…",
    no_products: "No products yet. Add your first one.",
    total_cost: "Total cost", net_profit: "Net profit", margin: "Margin",
    commission: "TikTok commission", tax: "Tax",
    add_bundle: "+ New bundle", edit_bundle: "Edit bundle",
    bundle_name: "Bundle name", bundle_price: "Bundle price (USD)",
    select_products: "Select products in this bundle",
    discount_pct: "Discount %",
    no_bundles: "No bundles yet.",
    add_discount: "+ New code", edit_discount: "Edit code",
    code: "Code", type: "Type", percent: "Percent %", fixed: "Fixed USD",
    expires: "Expires", usage_limit: "Usage limit", used: "Used",
    no_discounts: "No discount codes yet.",
    add_user: "+ New user", edit_user: "Edit user",
    role: "Role", role_admin: "Admin", role_pm: "Product manager", role_viewer: "Viewer",
    created: "Created", actions: "Actions",
    no_users: "No users.",
    settings_title: "Store settings",
    commission_rate: "TikTok Shop commission %", tax_rate: "Sales tax %",
    save_settings: "Save settings",
    kpi_products: "Products", kpi_stock_value: "Inventory cost value",
    kpi_avg_margin: "Avg. margin", kpi_bundles: "Bundles", kpi_codes: "Active codes",
    owner_note: "You are the owner of this workspace.",
    items: "items", in_stock: "in stock", out_of_stock: "Out of stock",
    photo_hint: "Paste an image URL (https://…)",
    saved: "Saved ✓", deleted: "Deleted ✓", copied: "Copied ✓",
    invalid_form: "Please complete the required fields.",
    email_in_use: "This email is already registered. Try logging in.",
    weak_password: "Password must be at least 6 characters.",
    user_created: "User created. Share the login with your manager.",
    role_updated: "Role updated.",
    cannot_delete_self: "You cannot delete your own account.",
    lang_note: "Language",
  },
  es: {
    brand_tag: "Paz • Equilibrio • Bienestar",
    login: "Entrar", register: "Crear cuenta", logout: "Salir",
    email: "Correo", password: "Contraseña", name: "Nombre",
    login_title: "Bienvenido de nuevo", register_title: "Crea tu cuenta",
    login_sub: "Administración de Ronbo Store",
    register_sub: "La primera cuenta registrada será la propietaria",
    need_account: "¿Sin cuenta?", have_account: "¿Ya tienes una?",
    auth_error: "Falló la autenticación. Revisa tus datos.",
    products: "Productos", bundles: "Combos", discounts: "Descuentos",
    financials: "Finanzas", users: "Usuarios", settings: "Ajustes",
    add_product: "+ Agregar producto", edit_product: "Editar producto",
    product_name: "Nombre del producto", sale_price: "Precio de venta (USD)",
    photo_url: "URL de foto", description: "Descripción",
    supplier: "Proveedor", supplier_cost: "Costo del proveedor (USD)",
    shipping_cost: "Costo de envío (USD)", stock: "Inventario",
    supplier_cj: "CJ Dropshipping", supplier_zen: "Zendrop",
    supplier_eprolo: "EPROLO", supplier_other: "Otro",
    save: "Guardar", cancel: "Cancelar", del: "Eliminar", edit: "Editar",
    confirm_delete: "¿Eliminar esto? No se puede deshacer.",
    search_ph: "Buscar productos…",
    no_products: "Aún no hay productos. Agrega el primero.",
    total_cost: "Costo total", net_profit: "Ganancia neta", margin: "Margen",
    commission: "Comisión TikTok", tax: "Impuesto",
    add_bundle: "+ Nuevo combo", edit_bundle: "Editar combo",
    bundle_name: "Nombre del combo", bundle_price: "Precio del combo (USD)",
    select_products: "Selecciona los productos del combo",
    discount_pct: "Descuento %",
    no_bundles: "Aún no hay combos.",
    add_discount: "+ Nuevo código", edit_discount: "Editar código",
    code: "Código", type: "Tipo", percent: "Porcentaje %", fixed: "Monto fijo USD",
    expires: "Vence", usage_limit: "Límite de usos", used: "Usados",
    no_discounts: "Aún no hay códigos de descuento.",
    add_user: "+ Nuevo usuario", edit_user: "Editar usuario",
    role: "Rol", role_admin: "Administrador", role_pm: "Gestor de productos", role_viewer: "Lector",
    created: "Creado", actions: "Acciones",
    no_users: "Sin usuarios.",
    settings_title: "Ajustes de la tienda",
    commission_rate: "Comisión TikTok Shop %", tax_rate: "Impuesto sobre ventas %",
    save_settings: "Guardar ajustes",
    kpi_products: "Productos", kpi_stock_value: "Valor de inventario (costo)",
    kpi_avg_margin: "Margen prom.", kpi_bundles: "Combos", kpi_codes: "Códigos activos",
    owner_note: "Eres el propietario de este espacio.",
    items: "artículos", in_stock: "en inventario", out_of_stock: "Agotado",
    photo_hint: "Pega la URL de una imagen (https://…)",
    saved: "Guardado ✓", deleted: "Eliminado ✓", copied: "Copiado ✓",
    invalid_form: "Completa los campos requeridos.",
    email_in_use: "Este correo ya está registrado. Intenta entrar.",
    weak_password: "La contraseña debe tener al menos 6 caracteres.",
    user_created: "Usuario creado. Comparte el acceso con tu gestor.",
    role_updated: "Rol actualizado.",
    cannot_delete_self: "No puedes eliminar tu propia cuenta.",
    lang_note: "Idioma",
  }
};

let LANG = (navigator.language || "en").toLowerCase().startsWith("es") ? "es" : "en";
const t = (k) => (STR[LANG] && STR[LANG][k]) || STR.en[k] || k;

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  document.documentElement.lang = LANG;
  document.querySelectorAll(".lang-toggle button").forEach(b => {
    b.classList.toggle("active", b.dataset.lang === LANG);
  });
}
function setLang(l) { LANG = l; applyI18n(); render(); }

/* ---------------- State ---------------- */
let currentUser = null;   // firebase auth user
let userRole = null;      // admin | product_manager | viewer
let isOwner = false;
let products = [];
let bundles = [];
let discounts = [];
let users = [];
let settings = { commission: 6, tax: 0 };
let searchQ = "";
let editingId = null;

/* ---------------- Helpers ---------------- */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money = (n) => "$" + Number(n || 0).toFixed(2);

function toast(msg, isErr) {
  const el = $("toast");
  el.textContent = msg;
  el.className = "toast show" + (isErr ? " err" : "");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2600);
}

function openModal(html) {
  $("modal-body").innerHTML = html;
  $("modal-back").classList.add("on");
}
function closeModal() {
  $("modal-back").classList.remove("on");
  $("modal-body").innerHTML = "";
  editingId = null;
}
$("modal-back").addEventListener("click", (e) => {
  if (e.target.id === "modal-back") closeModal();
});

function canWrite() { return userRole === "admin" || userRole === "product_manager"; }
function isAdmin() { return userRole === "admin"; }

/* Financials: total cost = supplier + shipping + commission% of price + tax% of price */
function financials(p) {
  const price = Number(p.salePrice) || 0;
  const comm = price * (Number(settings.commission) || 0) / 100;
  const tax = price * (Number(settings.tax) || 0) / 100;
  const total = (Number(p.supplierCost) || 0) + (Number(p.shippingCost) || 0) + comm + tax;
  const profit = price - total;
  const margin = price > 0 ? (profit / price) * 100 : 0;
  return { comm, tax, total, profit, margin };
}

/* ---------------- Auth ---------------- */
async function ensureUserDoc(uid, email, name) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    // Bootstrap: first user ever becomes admin/owner
    const all = await getDocs(collection(db, "users"));
    const first = all.empty;
    await setDoc(ref, {
      email, name: name || email.split("@")[0],
      role: first ? "admin" : "viewer",
      isOwner: first,
      createdAt: serverTimestamp()
    });
    return { role: first ? "admin" : "viewer", isOwner: first };
  }
  const d = snap.data();
  return { role: d.role || "viewer", isOwner: !!d.isOwner };
}

$("tab-login").onclick = () => switchAuthTab("login");
$("tab-register").onclick = () => switchAuthTab("register");
function switchAuthTab(which) {
  $("tab-login").classList.toggle("active", which === "login");
  $("tab-register").classList.toggle("active", which === "register");
  $("form-login").style.display = which === "login" ? "" : "none";
  $("form-register").style.display = which === "register" ? "" : "none";
  $("auth-error").classList.remove("show");
}
function showAuthError(msg) {
  const el = $("auth-error");
  el.textContent = msg;
  el.classList.add("show");
}

$("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("login-email").value.trim();
  const pw = $("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, pw);
  } catch (err) {
    showAuthError(t("auth_error"));
  }
});

$("form-register").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("reg-name").value.trim();
  const email = $("reg-email").value.trim();
  const pw = $("reg-password").value;
  if (pw.length < 6) return showAuthError(t("weak_password"));
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pw);
    await ensureUserDoc(cred.user.uid, email, name);
  } catch (err) {
    showAuthError(err.code === "auth/email-already-in-use" ? t("email_in_use") : t("auth_error"));
  }
});

$("btn-logout").onclick = () => signOut(auth);

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if (!user) {
    $("auth-view").style.display = "";
    $("app-view").classList.remove("on");
    return;
  }
  const info = await ensureUserDoc(user.uid, user.email, "");
  userRole = info.role; isOwner = info.isOwner;
  $("auth-view").style.display = "none";
  $("app-view").classList.add("on");
  $("who-email").textContent = user.email;
  $("who-role").textContent = t("role_" + (userRole === "product_manager" ? "pm" : userRole));
  // Show/hide admin-only nav
  document.querySelectorAll("[data-admin-only]").forEach(el => {
    el.style.display = isAdmin() ? "" : "none";
  });
  await loadAll();
  showSection("products");
});

/* ---------------- Data loading ---------------- */
async function loadAll() {
  const [pSnap, bSnap, dSnap, uSnap, sSnap] = await Promise.all([
    getDocs(query(collection(db, "products"), orderBy("createdAt", "desc"))).catch(() => ({ forEach: () => {} })),
    getDocs(query(collection(db, "bundles"), orderBy("createdAt", "desc"))).catch(() => ({ forEach: () => {} })),
    getDocs(query(collection(db, "discounts"), orderBy("createdAt", "desc"))).catch(() => ({ forEach: () => {} })),
    getDocs(collection(db, "users")).catch(() => ({ forEach: () => {} })),
    getDoc(doc(db, "settings", "store")).catch(() => null),
  ]);
  products = []; pSnap.forEach(d => products.push({ id: d.id, ...d.data() }));
  bundles = []; bSnap.forEach(d => bundles.push({ id: d.id, ...d.data() }));
  discounts = []; dSnap.forEach(d => discounts.push({ id: d.id, ...d.data() }));
  users = []; uSnap.forEach(d => users.push({ id: d.id, ...d.data() }));
  if (sSnap && sSnap.exists()) {
    const s = sSnap.data();
    settings.commission = Number(s.commission ?? 6);
    settings.tax = Number(s.tax ?? 0);
  }
  render();
}

/* ---------------- Navigation ---------------- */
document.querySelectorAll(".side-nav button[data-sec]").forEach(b => {
  b.onclick = () => showSection(b.dataset.sec);
});
function showSection(sec) {
  document.querySelectorAll(".side-nav button[data-sec]").forEach(b =>
    b.classList.toggle("active", b.dataset.sec === sec));
  document.querySelectorAll(".section").forEach(s =>
    s.classList.toggle("on", s.id === "sec-" + sec));
  if (sec === "financials") renderFinancials();
  if (sec === "users") renderUsers();
  if (sec === "settings") renderSettings();
}

/* ---------------- Render ---------------- */
function render() {
  renderProducts();
  renderBundles();
  renderDiscounts();
  if ($("sec-financials").classList.contains("on")) renderFinancials();
  if ($("sec-users").classList.contains("on")) renderUsers();
  if ($("sec-settings").classList.contains("on")) renderSettings();
}

function filteredProducts() {
  const q = searchQ.trim().toLowerCase();
  if (!q) return products;
  return products.filter(p =>
    (p.name || "").toLowerCase().includes(q) ||
    (p.description || "").toLowerCase().includes(q) ||
    (p.supplier || "").toLowerCase().includes(q));
}

function supplierLabel(s) {
  return { cj: t("supplier_cj"), zendrop: t("supplier_zen"), eprolo: t("supplier_eprolo") }[s]
    || t("supplier_other") + (s && !["cj","zendrop","eprolo","other"].includes(s) ? `: ${esc(s)}` : "");
}

function renderProducts() {
  const list = filteredProducts();
  const w = canWrite();
  let html = `<div class="cards">`;
  if (!list.length) html += `<div class="empty">${esc(t("no_products"))}</div>`;
  for (const p of list) {
    const f = financials(p);
    html += `<div class="card">
      ${p.photoUrl ? `<img class="thumb" src="${esc(p.photoUrl)}" alt="" loading="lazy" onerror="this.style.display='none'">` : ""}
      <h3>${esc(p.name)}</h3>
      <div class="meta">${esc(supplierLabel(p.supplier))} · ${Number(p.stock) > 0 ? `${esc(p.stock)} ${esc(t("in_stock"))}` : `<b style="color:var(--danger)">${esc(t("out_of_stock"))}</b>`}</div>
      <div class="fin-grid">
        <div class="fin-cell">${esc(t("sale_price"))}<b>${money(p.salePrice)}</b></div>
        <div class="fin-cell cost">${esc(t("total_cost"))}<b>${money(f.total)}</b></div>
        <div class="fin-cell profit">${esc(t("net_profit"))}<b>${money(f.profit)}</b></div>
        <div class="fin-cell">${esc(t("margin"))}<b>${f.margin.toFixed(1)}%</b></div>
      </div>
      ${p.description ? `<div class="meta">${esc(p.description.slice(0, 120))}${p.description.length > 120 ? "…" : ""}</div>` : ""}
      ${w ? `<div class="actions">
        <button class="btn btn-ghost btn-sm" onclick="openProductModal('${p.id}')">${esc(t("edit"))}</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('products','${p.id}')">${esc(t("del"))}</button>
      </div>` : ""}
    </div>`;
  }
  html += `</div>`;
  $("products-list").innerHTML = html;
  $("btn-add-product").style.display = w ? "" : "none";
}

/* ---------- Product modal ---------- */
window.openProductModal = function (id) {
  const p = id ? products.find(x => x.id === id) : null;
  editingId = id || null;
  openModal(`
    <h2>${esc(id ? t("edit_product") : t("add_product"))}</h2>
    <div class="field"><label>${esc(t("product_name"))} *</label>
      <input id="f-name" value="${esc(p?.name || "")}"></div>
    <div class="field-row">
      <div class="field"><label>${esc(t("sale_price"))} *</label>
        <input id="f-price" type="number" step="0.01" min="0" value="${p?.salePrice ?? ""}"></div>
      <div class="field"><label>${esc(t("stock"))}</label>
        <input id="f-stock" type="number" step="1" min="0" value="${p?.stock ?? 0}"></div>
    </div>
    <div class="field"><label>${esc(t("photo_url"))}</label>
      <input id="f-photo" value="${esc(p?.photoUrl || "")}" placeholder="https://…">
      <div class="hint">${esc(t("photo_hint"))}</div></div>
    <div class="field"><label>${esc(t("description"))}</label>
      <textarea id="f-desc">${esc(p?.description || "")}</textarea></div>
    <div class="field"><label>${esc(t("supplier"))}</label>
      <select id="f-supplier">
        <option value="cj" ${p?.supplier === "cj" ? "selected" : ""}>${esc(t("supplier_cj"))}</option>
        <option value="zendrop" ${p?.supplier === "zendrop" ? "selected" : ""}>${esc(t("supplier_zen"))}</option>
        <option value="eprolo" ${p?.supplier === "eprolo" ? "selected" : ""}>${esc(t("supplier_eprolo"))}</option>
        <option value="other" ${!p || p?.supplier === "other" || !["cj","zendrop","eprolo"].includes(p?.supplier) ? "selected" : ""}>${esc(t("supplier_other"))}</option>
      </select></div>
    <div class="field-row">
      <div class="field"><label>${esc(t("supplier_cost"))}</label>
        <input id="f-scost" type="number" step="0.01" min="0" value="${p?.supplierCost ?? ""}"></div>
      <div class="field"><label>${esc(t("shipping_cost"))}</label>
        <input id="f-hcost" type="number" step="0.01" min="0" value="${p?.shippingCost ?? ""}"></div>
    </div>
    <div class="foot">
      <button class="btn btn-ghost" onclick="closeModal()">${esc(t("cancel"))}</button>
      <button class="btn btn-primary" onclick="saveProduct()">${esc(t("save"))}</button>
    </div>`);
};

window.saveProduct = async function () {
  const data = {
    name: $("f-name").value.trim(),
    salePrice: Number($("f-price").value) || 0,
    stock: Number($("f-stock").value) || 0,
    photoUrl: $("f-photo").value.trim(),
    description: $("f-desc").value.trim(),
    supplier: $("f-supplier").value,
    supplierCost: Number($("f-scost").value) || 0,
    shippingCost: Number($("f-hcost").value) || 0,
    updatedAt: serverTimestamp(),
  };
  if (!data.name || !data.salePrice) return toast(t("invalid_form"), true);
  try {
    if (editingId) await updateDoc(doc(db, "products", editingId), data);
    else { data.createdAt = serverTimestamp(); await addDoc(collection(db, "products"), data); }
    closeModal(); await loadAll(); toast(t("saved"));
  } catch (e) { toast(e.message, true); }
};

window.deleteItem = async function (col, id) {
  if (!confirm(t("confirm_delete"))) return;
  try { await deleteDoc(doc(db, col, id)); await loadAll(); toast(t("deleted")); }
  catch (e) { toast(e.message, true); }
};

/* ---------- Bundles ---------- */
function renderBundles() {
  const w = canWrite();
  let html = `<div class="cards">`;
  if (!bundles.length) html += `<div class="empty">${esc(t("no_bundles"))}</div>`;
  for (const b of bundles) {
    const items = (b.items || []).map(pid => products.find(p => p.id === pid)).filter(Boolean);
    const sum = items.reduce((a, p) => a + (Number(p.salePrice) || 0), 0);
    html += `<div class="card gold">
      <h3>${esc(b.name)}</h3>
      <div class="meta">${items.length} ${esc(t("items"))} · ${esc(t("discount_pct"))}: ${Number(b.discountPct) || 0}%</div>
      ${items.map(p => `<div class="bundle-item">• ${esc(p.name)} — ${money(p.salePrice)}</div>`).join("")}
      <div class="fin-grid">
        <div class="fin-cell">${esc(t("sale_price"))}<b>${money(sum)}</b></div>
        <div class="fin-cell profit">${esc(t("bundle_price"))}<b>${money(b.bundlePrice)}</b></div>
      </div>
      ${w ? `<div class="actions">
        <button class="btn btn-ghost btn-sm" onclick="openBundleModal('${b.id}')">${esc(t("edit"))}</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('bundles','${b.id}')">${esc(t("del"))}</button>
      </div>` : ""}
    </div>`;
  }
  html += `</div>`;
  $("bundles-list").innerHTML = html;
  $("btn-add-bundle").style.display = w ? "" : "none";
}

window.openBundleModal = function (id) {
  const b = id ? bundles.find(x => x.id === id) : null;
  editingId = id || null;
  const sel = new Set(b?.items || []);
  openModal(`
    <h2>${esc(id ? t("edit_bundle") : t("add_bundle"))}</h2>
    <div class="field"><label>${esc(t("bundle_name"))} *</label>
      <input id="fb-name" value="${esc(b?.name || "")}"></div>
    <div class="field-row">
      <div class="field"><label>${esc(t("bundle_price"))} *</label>
        <input id="fb-price" type="number" step="0.01" min="0" value="${b?.bundlePrice ?? ""}"></div>
      <div class="field"><label>${esc(t("discount_pct"))}</label>
        <input id="fb-disc" type="number" step="1" min="0" max="100" value="${b?.discountPct ?? 0}"></div>
    </div>
    <div class="field"><label>${esc(t("select_products"))}</label>
      <div style="max-height:220px;overflow:auto;border:1px solid var(--line);border-radius:8px;padding:.5rem .8rem;">
      ${products.map(p => `
        <label class="bundle-item"><input type="checkbox" class="fb-item" value="${p.id}" ${sel.has(p.id) ? "checked" : ""}>
        ${esc(p.name)} — ${money(p.salePrice)}</label>`).join("") || `<span class="hint">${esc(t("no_products"))}</span>`}
      </div></div>
    <div class="foot">
      <button class="btn btn-ghost" onclick="closeModal()">${esc(t("cancel"))}</button>
      <button class="btn btn-primary" onclick="saveBundle()">${esc(t("save"))}</button>
    </div>`);
};

window.saveBundle = async function () {
  const items = [...document.querySelectorAll(".fb-item:checked")].map(c => c.value);
  const data = {
    name: $("fb-name").value.trim(),
    bundlePrice: Number($("fb-price").value) || 0,
    discountPct: Number($("fb-disc").value) || 0,
    items, updatedAt: serverTimestamp(),
  };
  if (!data.name || !data.bundlePrice || !items.length) return toast(t("invalid_form"), true);
  try {
    if (editingId) await updateDoc(doc(db, "bundles", editingId), data);
    else { data.createdAt = serverTimestamp(); await addDoc(collection(db, "bundles"), data); }
    closeModal(); await loadAll(); toast(t("saved"));
  } catch (e) { toast(e.message, true); }
};

/* ---------- Discounts ---------- */
function renderDiscounts() {
  const w = canWrite();
  const now = new Date();
  let rows = discounts.map(d => {
    const exp = d.expiresAt ? new Date(d.expiresAt) : null;
    const active = (!exp || exp > now) && (Number(d.usageLimit) || 0) > (Number(d.usedCount) || 0);
    return `<tr>
      <td><b>${esc(d.code)}</b></td>
      <td>${d.kind === "fixed" ? money(d.value) + " " + esc(t("fixed")).split(" ")[0] : esc(d.value) + "%"}</td>
      <td>${exp ? exp.toLocaleDateString() : "—"}</td>
      <td>${Number(d.usedCount) || 0} / ${Number(d.usageLimit) || "∞"}</td>
      <td><span class="pill ${active ? "ok" : "low"}">${active ? "●" : "○"}</span></td>
      ${w ? `<td>
        <button class="btn btn-ghost btn-sm" onclick="openDiscountModal('${d.id}')">${esc(t("edit"))}</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('discounts','${d.id}')">${esc(t("del"))}</button>
      </td>` : ""}
    </tr>`;
  }).join("");
  $("discounts-list").innerHTML = discounts.length
    ? `<table class="data"><thead><tr><th>${esc(t("code"))}</th><th>${esc(t("type"))}</th><th>${esc(t("expires"))}</th><th>${esc(t("used"))}</th><th></th>${w ? `<th>${esc(t("actions"))}</th>` : ""}</tr></thead><tbody>${rows}</tbody></table>`
    : `<div class="empty">${esc(t("no_discounts"))}</div>`;
  $("btn-add-discount").style.display = w ? "" : "none";
}

window.openDiscountModal = function (id) {
  const d = id ? discounts.find(x => x.id === id) : null;
  editingId = id || null;
  openModal(`
    <h2>${esc(id ? t("edit_discount") : t("add_discount"))}</h2>
    <div class="field-row">
      <div class="field"><label>${esc(t("code"))} *</label>
        <input id="fd-code" value="${esc(d?.code || "")}" placeholder="RONBO10" style="text-transform:uppercase"></div>
      <div class="field"><label>${esc(t("type"))}</label>
        <select id="fd-kind">
          <option value="percent" ${d?.kind !== "fixed" ? "selected" : ""}>${esc(t("percent"))}</option>
          <option value="fixed" ${d?.kind === "fixed" ? "selected" : ""}>${esc(t("fixed"))}</option>
        </select></div>
    </div>
    <div class="field-row">
      <div class="field"><label>${esc(t("type"))} *</label>
        <input id="fd-value" type="number" step="0.01" min="0" value="${d?.value ?? ""}"></div>
      <div class="field"><label>${esc(t("usage_limit"))}</label>
        <input id="fd-limit" type="number" step="1" min="0" value="${d?.usageLimit ?? ""}" placeholder="∞"></div>
    </div>
    <div class="field"><label>${esc(t("expires"))}</label>
      <input id="fd-exp" type="date" value="${d?.expiresAt ? d.expiresAt.slice(0, 10) : ""}"></div>
    <div class="foot">
      <button class="btn btn-ghost" onclick="closeModal()">${esc(t("cancel"))}</button>
      <button class="btn btn-primary" onclick="saveDiscount()">${esc(t("save"))}</button>
    </div>`);
};

window.saveDiscount = async function () {
  const data = {
    code: $("fd-code").value.trim().toUpperCase(),
    kind: $("fd-kind").value,
    value: Number($("fd-value").value) || 0,
    usageLimit: Number($("fd-limit").value) || 0,
    usedCount: 0,
    expiresAt: $("fd-exp").value ? new Date($("fd-exp").value + "T23:59:59").toISOString() : null,
    updatedAt: serverTimestamp(),
  };
  if (!data.code || !data.value) return toast(t("invalid_form"), true);
  try {
    if (editingId) { const { usedCount, ...rest } = data; await updateDoc(doc(db, "discounts", editingId), rest); }
    else { data.createdAt = serverTimestamp(); await addDoc(collection(db, "discounts"), data); }
    closeModal(); await loadAll(); toast(t("saved"));
  } catch (e) { toast(e.message, true); }
};

/* ---------- Financials ---------- */
function renderFinancials() {
  let totCost = 0, totProfit = 0, totPrice = 0;
  const rows = products.map(p => {
    const f = financials(p);
    totCost += f.total * (Number(p.stock) || 0);
    totProfit += f.profit; totPrice += Number(p.salePrice) || 0;
    return `<tr>
      <td><b>${esc(p.name)}</b><br><span class="hint">${esc(supplierLabel(p.supplier))}</span></td>
      <td>${money(p.supplierCost)} + ${money(p.shippingCost)}</td>
      <td>${money(f.comm)} (${Number(settings.commission)}%)</td>
      <td>${money(f.tax)} (${Number(settings.tax)}%)</td>
      <td><b>${money(f.total)}</b></td>
      <td>${money(p.salePrice)}</td>
      <td style="color:var(--ok);font-weight:700">${money(f.profit)}</td>
      <td><b>${f.margin.toFixed(1)}%</b></td>
    </tr>`;
  }).join("");
  const avgMargin = products.length ? (products.reduce((a, p) => a + financials(p).margin, 0) / products.length) : 0;
  $("kpi-products").textContent = products.length;
  $("kpi-stockval").textContent = money(totCost);
  $("kpi-margin").textContent = avgMargin.toFixed(1) + "%";
  $("kpi-bundles").textContent = bundles.length;
  const now = new Date();
  $("kpi-codes").textContent = discounts.filter(d => {
    const exp = d.expiresAt ? new Date(d.expiresAt) : null;
    return (!exp || exp > now) && (Number(d.usageLimit) || 0) > (Number(d.usedCount) || 0);
  }).length;
  $("financials-table").innerHTML = products.length
    ? `<table class="data"><thead><tr><th>${esc(t("products"))}</th><th>${esc(t("supplier_cost"))} + ${esc(t("shipping_cost"))}</th><th>${esc(t("commission"))}</th><th>${esc(t("tax"))}</th><th>${esc(t("total_cost"))}</th><th>${esc(t("sale_price"))}</th><th>${esc(t("net_profit"))}</th><th>${esc(t("margin"))}</th></tr></thead><tbody>${rows}</tbody></table>`
    : `<div class="empty">${esc(t("no_products"))}</div>`;
}

/* ---------- Users (admin) ---------- */
function renderUsers() {
  const rows = users.map(u => `
    <tr>
      <td><b>${esc(u.name || u.email)}</b><br><span class="hint">${esc(u.email)}</span>
        ${u.isOwner ? `<br><span class="pill admin">${esc(t("owner_note"))}</span>` : ""}</td>
      <td><span class="pill ${u.role}">${esc(t("role_" + (u.role === "product_manager" ? "pm" : u.role)))}</span></td>
      <td>${u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : "—"}</td>
      <td>
        ${u.id !== currentUser.uid ? `
        <select class="role-sel" data-uid="${u.id}" style="padding:.4rem;border:1px solid var(--line);border-radius:6px;">
          <option value="admin" ${u.role === "admin" ? "selected" : ""}>${esc(t("role_admin"))}</option>
          <option value="product_manager" ${u.role === "product_manager" ? "selected" : ""}>${esc(t("role_pm"))}</option>
          <option value="viewer" ${u.role === "viewer" ? "selected" : ""}>${esc(t("role_viewer"))}</option>
        </select>
        <button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}')">${esc(t("del"))}</button>` : "—"}
      </td>
    </tr>`).join("");
  $("users-list").innerHTML = users.length
    ? `<table class="data"><thead><tr><th>${esc(t("name"))}</th><th>${esc(t("role"))}</th><th>${esc(t("created"))}</th><th>${esc(t("actions"))}</th></tr></thead><tbody>${rows}</tbody></table>`
    : `<div class="empty">${esc(t("no_users"))}</div>`;
  document.querySelectorAll(".role-sel").forEach(sel => {
    sel.onchange = async () => {
      try {
        await updateDoc(doc(db, "users", sel.dataset.uid), { role: sel.value });
        toast(t("role_updated")); await loadAll();
      } catch (e) { toast(e.message, true); }
    };
  });
}

window.openUserModal = function () {
  openModal(`
    <h2>${esc(t("add_user"))}</h2>
    <p class="hint" style="margin-bottom:1rem">${esc(t("user_created"))}</p>
    <div class="field"><label>${esc(t("name"))}</label><input id="fu-name"></div>
    <div class="field"><label>${esc(t("email"))} *</label><input id="fu-email" type="email"></div>
    <div class="field"><label>${esc(t("password"))} *</label><input id="fu-pw" type="password" autocomplete="new-password"></div>
    <div class="field"><label>${esc(t("role"))}</label>
      <select id="fu-role">
        <option value="product_manager">${esc(t("role_pm"))}</option>
        <option value="viewer">${esc(t("role_viewer"))}</option>
        <option value="admin">${esc(t("role_admin"))}</option>
      </select></div>
    <div class="foot">
      <button class="btn btn-ghost" onclick="closeModal()">${esc(t("cancel"))}</button>
      <button class="btn btn-primary" onclick="createManagedUser()">${esc(t("save"))}</button>
    </div>`);
};

/* Creating a user via secondary auth instance would sign out the admin,
   so we create the Firestore record and let the user complete signup.
   Simpler robust flow: admin creates the Auth user with a temp password
   using a detached app instance. */
import { initializeApp as init2 } from "firebase/app";
import { getAuth as getAuth2, createUserWithEmailAndPassword as create2 } from "firebase/auth";

window.createManagedUser = async function () {
  const name = $("fu-name").value.trim();
  const email = $("fu-email").value.trim();
  const pw = $("fu-pw").value;
  const role = $("fu-role").value;
  if (!email || pw.length < 6) return toast(t("invalid_form"), true);
  try {
    const app2 = init2(firebaseConfig, "secondary-" + Date.now());
    const auth2 = getAuth2(app2);
    const cred = await create2(auth2, email, pw);
    await setDoc(doc(db, "users", cred.user.uid), {
      email, name: name || email.split("@")[0], role,
      isOwner: false, createdAt: serverTimestamp()
    });
    const { deleteApp } = await import("firebase/app");
    await deleteApp(app2);
    closeModal(); await loadAll(); toast(t("user_created"));
  } catch (e) {
    toast(e.code === "auth/email-already-in-use" ? t("email_in_use") : e.message, true);
  }
};

window.deleteUser = async function (uid) {
  if (uid === currentUser.uid) return toast(t("cannot_delete_self"), true);
  if (!confirm(t("confirm_delete"))) return;
  try { await deleteDoc(doc(db, "users", uid)); await loadAll(); toast(t("deleted")); }
  catch (e) { toast(e.message, true); }
};

/* ---------- Settings ---------- */
function renderSettings() {
  $("set-commission").value = settings.commission;
  $("set-tax").value = settings.tax;
}
window.saveSettings = async function () {
  settings.commission = Number($("set-commission").value) || 0;
  settings.tax = Number($("set-tax").value) || 0;
  try {
    await setDoc(doc(db, "settings", "store"), {
      commission: settings.commission, tax: settings.tax, updatedAt: serverTimestamp()
    });
    toast(t("saved")); renderFinancials();
  } catch (e) { toast(e.message, true); }
};

/* ---------------- Wiring ---------------- */
$("btn-add-product").onclick = () => openProductModal(null);
$("btn-add-bundle").onclick = () => openBundleModal(null);
$("btn-add-discount").onclick = () => openDiscountModal(null);
$("btn-add-user").onclick = () => openUserModal();
$("search").addEventListener("input", (e) => { searchQ = e.target.value; renderProducts(); });
document.querySelectorAll(".lang-toggle button").forEach(b => {
  b.onclick = () => setLang(b.dataset.lang);
});
window.closeModal = closeModal;

/* init */
applyI18n();
