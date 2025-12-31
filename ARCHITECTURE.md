# MGYPOS Architecture & Documentation

## 1. System Architecture
MGYPOS is a full-stack Next.js application designed for performance and scalability.

- **Frontend**: Next.js 15+ (App Router) with React Server Components (RSC) and Client Components. Styled with Tailwind CSS v4 and a custom Design System inspired by Shadcn UI.
- **Backend**: Next.js API Routes (Serverless functions) handling business logic.
- **Database**: PostgreSQL accessed via Prisma ORM v7.
- **Authentication**: JWT-based stateless authentication stored in HTTP-only cookies.
- **State Management**: React Context (`AuhtContext`) for user session, local state for POS cart.

## 2. Database Schema (Prisma)
The database schema is defined in `prisma/schema.prisma`. Key models:
- **User**: Stores Admin/Staff credentials and roles.
- **Product**: Inventory items with price, stock, and relations to Category.
- **Category**: Product classification.
- **Order**: transactional sales data.
- **OrderItem**: Line items for each order (snapshots price at time of sale).
- **InventoryLog**: Audit trail for stock changes (Initial, Sale, Adjustment).

## 3. API Design
RESTful endpoints located in `src/app/api`.
- `auth/login`: Authenticates user and sets JWT cookie.
- `products`: GET (list), POST (create - Admin only).
- `categories`: GET (list), POST (create - Admin only).
- `orders`: POST (transactional order creation with stock deduction).
- `dashboard/stats`: Aggregated metrics for Admin Dashboard.

## 4. Frontend Structure
- `/login`: Public login page.
- `/pos`: Protected Sales Terminal for Staff/Admin.
  - Interactive Product Grid with Category Filter.
  - Real-time Cart management.
- `/admin`: Protected Admin Dashboard.
  - `/admin/products`: Product management (CRUD).
  - `/admin/orders`: Order history.
- `src/components/ui`: Reusable UI components (Button, Card, Input).

## 5. Deployment
- **Build**: `npm run build` generates the optimized production build.
- **Database**: Ensure `DATABASE_URL` is set in environment variables. Run `npx prisma migrate deploy` to sync schema.
- **Start**: `npm start` launches the production server.
