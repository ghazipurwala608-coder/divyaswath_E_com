# Divya Swasth Ecommerce

A production-oriented MERN storefront for Divya Swasth, built from the supplied website brief. The frontend uses React, Vite and Tailwind CSS. The backend uses Express, MongoDB/Mongoose and signed JWT bearer authentication.

## Included experience

- Animated, responsive premium botanical homepage
- Exact planned catalog: Lean Shape, Sugar Shield, Vital Infinity, Divya Swasth Wellness and Diabetic Care
- Detailed product pages with benefits, ingredients, specifications, usage, safety and image-status notices
- Product search, category filters, cart, checkout and order confirmation
- Registration, login, JWT-protected account/order history and role-protected admin dashboard
- Standardised API success and error envelopes with HTTP status codes and messages
- Contact form persisted through the API with abuse rate limiting
- Ingredients library, About, Wellness Centre, FAQ, Shipping, Returns, Privacy and Terms pages
- Regulatory-safe pre-launch language with no invented reviews or unverified certification marks

## Run locally

Requirements: Node.js 18+ and MongoDB.

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run seed
npm run dev
```

The seed command is non-destructive: it upserts the five planned products, archives legacy active products and preserves existing users and orders.

In a second terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

- Storefront: `http://localhost:5173`
- API health: `http://localhost:5000/api/health`

Keep both terminals running. Wait for the backend's `API running` message before using the frontend; the API starts after MongoDB connects. Vite's `ECONNREFUSED` proxy error means the backend is not listening at the configured target.

For local API development, set `VITE_API_URL=/api` in `frontend/.env.development.local`. The Vite proxy defaults to `http://127.0.0.1:5000`; if the backend uses another port, set `API_PROXY_TARGET=http://127.0.0.1:YOUR_PORT` in that same file and restart Vite. Keep production API settings in the production environment.

## API response contract

### Production page refresh / direct links

The frontend uses React Router. Hosting must serve `index.html` for client routes such as `/admin`, `/account`, and `/shop`.

- Vercel: committed `vercel.json` files support either the repository root or `frontend` as the project's Root Directory. Redeploy to apply the rewrite.
- Netlify: `frontend/public/_redirects` is copied into `frontend/dist` by Vite. Publish `frontend/dist` (or `dist` when the base directory is `frontend`).
- Render Static Site: in **Redirects/Rewrites**, add Source `/*`, Destination `/index.html`, Action **Rewrite**. Render requires this hosting setting; it does not use the Netlify `_redirects` file.

These are frontend-only fallbacks. Set the production `VITE_API_URL` to the separately hosted backend's full `/api` URL. After deploying, open and refresh `/shop`, `/login`, and `/admin` directly. The admin route still requires authentication.

## API response examples

Successful response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products fetched successfully",
  "data": {},
  "meta": {}
}
```

Error response:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation message",
  "data": null
}
```

JWTs are returned by login/register as bearer tokens and include issuer, audience, subject and expiry claims. Protected endpoints require `Authorization: Bearer <token>`.

## API routes

```text
GET    /api/health
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile             authenticated
GET    /api/products
GET    /api/products/:slug
POST   /api/products                 admin
PUT    /api/products/id/:id          admin
DELETE /api/products/id/:id          admin (soft archive)
POST   /api/orders                   authenticated
GET    /api/orders/my                authenticated
GET    /api/orders/:id               owner/admin
GET    /api/orders/admin/all         admin
PUT    /api/orders/:id/status        admin
GET    /api/admin/dashboard          admin
POST   /api/contact
```

## Local demo accounts

- Admin: `admin@divyaswasth.in` / `Admin@123`
- Customer: `customer@example.com` / `Customer@123`

Change or remove demo credentials before deployment. Use a long random `JWT_SECRET`, HTTPS and an approved production origin.

## Required before launch

- Replace every concept/placeholder product image with approved high-resolution final photography or renders.
- Confirm product classification, formula, quantities, directions, claims, MRP, stock and batch details against each final label.
- Add certification marks only after the business proves that the approval is current and use is permitted.
- Replace policy drafts with legally reviewed business policies and verified official contact/social details.
- Connect and verify a live payment provider and webhook before enabling online payment collection.
- Publish only genuine permission-backed customer reviews.

The generated `botanical-hero-bg.png` is decorative only; it contains no product, person, label or certification and is not a product representation.
