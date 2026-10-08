# Ronbo Admin Web — Multi-User Store Management

Private administration panel for the **Ronbo** wellness brand (crystal bracelets, chakra kits, sage kits).
Static frontend (GitHub Pages) + Firebase backend (Authentication + Firestore). Free tier.

## Features

- **Login** with Firebase Authentication (email/password). The first account registered becomes the **owner/admin**.
- **User management** (admin only): create manager accounts, assign roles —
  `admin` (full access), `product_manager` (products/bundles/discounts), `viewer` (read-only).
- **Products**: add/edit/delete with name, sale price, photo URL, description, supplier
  (CJ Dropshipping, Zendrop, EPROLO, Other), supplier cost, shipping cost, stock.
- **Financial dashboard**: per product —
  `supplier cost + shipping + TikTok commission % + tax % = total cost`;
  `sale price − total cost = net profit + margin %`.
  Commission and tax rates are configurable in Settings (admin only).
- **Bundle builder**: combine products into packages with a special bundle price and discount %.
- **Discount codes**: code, percent or fixed amount, expiration date, usage limit.
- **Product search** on the Products tab.
- **Bilingual**: English base, auto-detects Spanish browsers (`navigator.language`), manual EN/ES toggle.
- Brand colors: teal `#0D7377` + gold `#C9A227`.

## Firebase project setup (one time, ~10 minutes)

The Firebase project **`ronbo-store-admin`** already exists and its config is embedded
in `app.js`. You only need to enable the services and deploy the rules:

### 1. Enable Authentication
1. Go to [console.firebase.google.com](https://console.firebase.google.com) → select **ronbo-store-admin**.
2. **Build → Authentication → Get started**.
3. **Sign-in method** tab → enable **Email/Password** → Save.

### 2. Create Firestore Database
1. **Build → Firestore Database → Create database**.
2. Choose **Production mode** (we deploy custom rules next).
3. Select the closest region (e.g. `us-central1`).

### 3. Deploy security rules
1. In Firestore, open the **Rules** tab.
2. Replace the contents with the full text of [`firestore.rules`](firestore.rules) in this repo.
3. Click **Publish**.

### 4. Create the owner account
1. Open the deployed admin page (see below).
2. Click **Create account**, register with the owner's email.
   The **first** registered user automatically becomes `admin` + owner.
   Everyone who registers afterwards starts as `viewer` until an admin upgrades them.

## Deploy to GitHub Pages

Option A — manual upload:
1. In the repo `ronbo-store/ronbo.store` (or a new repo, e.g. `ronbo-admin`),
   upload `index.html`, `app.js`, `styles.css` to the repo root.
2. Repo **Settings → Pages** → Deploy from branch `main`, folder `/ (root)`.
3. Open `https://<user>.github.io/<repo>/`.

Option B — git:
```bash
git clone https://github.com/ronbo-store/ronbo.store.git
cp index.html app.js styles.css ronbo.store/admin/
cd ronbo.store && git add admin && git commit -m "Add admin panel" && git push
```
Then enable Pages as above; the panel lives at `https://<user>.github.io/ronbo.store/admin/`.

> Keep the admin URL private — share it only with your managers.
> For extra safety, enable **Authentication → Settings → Authorized domains**
> and remove any domain you don't use.

## Firestore collections

| Collection  | Purpose |
|-------------|---------|
| `users`     | `{ email, name, role, isOwner, createdAt }` — one doc per Auth UID |
| `products`  | `{ name, salePrice, photoUrl, description, supplier, supplierCost, shippingCost, stock, createdAt, updatedAt }` |
| `bundles`   | `{ name, bundlePrice, discountPct, items: [productIds], createdAt, updatedAt }` |
| `discounts` | `{ code, kind: percent\|fixed, value, usageLimit, usedCount, expiresAt, createdAt, updatedAt }` |
| `settings`  | doc `store`: `{ commission, tax, updatedAt }` |

## Roles & permissions (enforced by `firestore.rules`)

| Action | admin | product_manager | viewer |
|---|---|---|---|
| Read everything | ✅ | ✅ | ✅ |
| Products/bundles/discounts CRUD | ✅ | ✅ | ❌ |
| Change settings (commission/tax) | ✅ | ❌ | ❌ |
| Create users / change roles | ✅ | ❌ | ❌ |
| Delete users | ✅ | ❌ | ❌ |

## U.S. compliance notes

- Sales tax: the configurable tax % is an **estimate helper**, not tax advice.
  Configure per-state rates as you sell; consult a tax professional.
- Product claims: do not publish unverified health claims (FDA/FTC).
- Privacy: customer data is **not** stored by this panel (by design).

## Tech

- Firebase JS SDK v10 (modular) via CDN import maps — no build step.
- No frameworks; vanilla JS + Firestore.
- Works on GitHub Pages (pure static hosting).
