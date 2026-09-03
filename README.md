# LuckyZone

LuckyZone is a full-stack electronics showcase platform inspired by the premium layout style of Handsfree.lk, rebranded around the LuckyZone logo colors and tailored for browsing and admin-managed catalog publishing without checkout.

## Projects

- `apps/web` - customer-facing React + Tailwind storefront
- `apps/admin` - admin dashboard for catalog and homepage management
- `server` - ASP.NET Core 8 API for content, auth, uploads, and product management
- `database` - Microsoft SQL Server schema, seed notes, and query scripts

## Catalog Features

- Branded homepage with premium hero sections and category highlights
- Dynamic Apple, Samsung, and accessory categories
- Category, product list, and color-aware product detail pages
- Search and filter support
- Admin login and dashboard
- Category and product CRUD with publish/draft controls
- Percentage discounts with calculated final customer pricing
- Multiple colors per product with matching image galleries
- Homepage featured section management
- MSSQL-backed API with JWT authentication

## Suggested Setup

1. Install frontend dependencies for `apps/web` and `apps/admin`.
2. Confirm the SQL Server settings in `server/appsettings.json`.
3. Run the SQL schema in `database/schema.sql`.
4. Start the .NET 8 API with `dotnet run --project server/LuckyZone.Api.csproj`.
5. Start the web and admin apps in parallel when needed.

## Initial Routes

- Website:
  - `/`
  - `/categories/:slug`
  - `/products/:slug`
- Admin:
  - `/login`
  - `/dashboard`
  - `/products`
  - `/categories`
  - `/banners`

## Notes

- This starter intentionally omits checkout and payment flow.
- The first implementation uses mock content on the frontend and API structure on the backend to speed up phase one delivery.
