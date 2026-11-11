# Northline — Hoodie Store

An elegant, responsive React storefront for a winter hoodie collection.

## Included
- Responsive storefront with collection, brand story, product quick-view, size selection and cart drawer.
- EGP pricing and editable sample products.
- Express API with SQLite order persistence and server-side cart validation.
- Newsletter interaction (front-end demo only).
- Vite development server and production build.

## Requirements
- Node.js 20 or newer
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:5173. The Express API runs on http://localhost:4000.

## Production build
```bash
npm run build
npm start
```
Open http://localhost:4000.

## Before taking real orders
This is a starter storefront, not a production payment system. Before launch:
1. Replace the sample product copy, prices, sizes, and images in `src/main.jsx`.
2. Add customer details, delivery address, stock checks, shipping rules, and an admin order workflow.
3. Integrate a payment provider available in your market; never collect card data directly.
4. Add privacy, returns, shipping, and terms pages.
5. Configure HTTPS, environment variables, database backups, logging, and deployment secrets.
6. Replace the example email and connect the newsletter form to an email marketing provider.

## Branding
The sample brand is **NORTHLINE**. All product names, copy, prices and imagery are placeholders intended to be customized.
