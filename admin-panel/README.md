# SUOS Admin Panel

This folder is the local `@suos/admin-panel` feature package. It contains the
dashboard UI, interactive editors, route-level screens, navigation, and package
styles in one place.

## Structure

- `components/` — shared navigation, dashboard widgets, tables, dialogs, and
  product, collection, category, customer, order, and discount editors.
- `screens/` — the complete screen tree mirrored by the `/dashboard` routes.
- `routes.ts` — typed public route manifest.
- `styles.css` — scoped admin theme, focus treatment, and reduced-motion rules.
- `index.ts` — public component exports.

The files in `app/dashboard/**` are intentionally thin Next.js route adapters.
They re-export screens from this package so the URL structure remains a normal
App Router route tree while all implementation stays here.

## Included screens

- Overview and sales analytics
- Reports
- Orders, draft orders, abandoned checkouts, and checkout detail/printing
- Order composer with product and custom-item pickers
- Products, product creation, inventory, collections, and categories
- Customers and customer detail actions
- Discounts and amount-off, buy-X-get-Y, and free-shipping editors

## Host requirements

This is a local package for the SUOS application rather than a standalone app.
It intentionally consumes the host's `@/components/ui` primitives, fonts,
authentication DAL, Prisma services, and public product images. The route layout
continues to enforce `requireAdmin()` on the server before rendering any screen.

Import the public surface with:

```tsx
import { AppSidebar, adminRoutes } from "@/admin-panel"
```
