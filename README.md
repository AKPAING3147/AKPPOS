# MGYPOS - Modern Point of Sale System

A full-stack POS application built with Next.js, TypeScript, Prisma, PostgreSQL, and Cloudinary.

## Features

- 🔐 **Authentication**: JWT-based auth with role-based access (Admin, Staff)
- 📦 **Product Management**: CRUD operations with image uploads via Cloudinary
- 🛒 **POS Terminal**: Interactive sales interface with cart management
- 📊 **Admin Dashboard**: Real-time sales statistics and analytics
- 📝 **Invoice System**: Customizable invoices with company branding
- 🖼️ **Image Uploads**: Cloudinary integration for product images and logos
- ⚙️ **Settings**: Admin panel to customize company information
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Cloudinary account (free tier works)

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Get from Neon)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-here"

# Cloudinary (Get from cloudinary.com dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Getting Cloudinary Credentials:

1. Sign up at https://cloudinary.com (free tier available)
2. Go to your Dashboard
3. Copy your:
   - **Cloud Name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Seed database:**
   ```bash
   npx tsx prisma/seed.ts
   ```

## Running the App

```bash
npm run dev
```

Visit `http://localhost:3000`

## Default Login

- **Email**: `admin@example.com`
- **Password**: `admin123`

## Features Breakdown

### Admin Features (`/admin`)
- Dashboard with sales analytics
- Product management (add, edit, delete with image upload)
- Order history viewing
- **Settings page** - Customize company info, logo, tax rate
- Invoice customization

### POS Features (`/pos`)
- Product grid with category filtering
- Search by name or barcode
- Cart management with quantity controls
- Stock validation
- **Alert system** for errors and confirmations
- **Invoice generation** with print functionality
- Automatic stock deduction

### Invoice Features
- Customizable company information
- Logo display (uploaded via Cloudinary)
- Printable receipts
- Dynamic tax rates
- Order details with itemized list

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (Prisma ORM v7)
- **Image Storage**: Cloudinary
- **Authentication**: JWT with HTTP-only cookies
- **Styling**: Tailwind CSS with custom gradients

## Project Structure

```
MGYPOS/
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts             # Seed data
│   └── migrations/         # Database migrations
├── src/
│   ├── app/
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── pos/            # POS terminal
│   │   ├── api/            # API routes
│   │   └── login/          # Auth pages
│   ├── components/
│   │   ├── ui/             # shadcn components
│   │   └── Invoice.tsx     # Invoice component
│   └── lib/
│       ├── prisma.ts       # Prisma client
│       ├── auth.ts         # JWT utilities
│       └── utils.ts        # Helper functions
└── .env                    # Environment variables
```

## Database Schema

- **User**: Admin and staff accounts
- **Product**: Product catalog with images
- **Category**: Product categories
- **Order**: Sales transactions
- **OrderItem**: Order line items
- **InventoryLog**: Stock movement tracking
- **Settings**: Company/invoice settings

## License

MIT

---

Built with ❤️ using Next.js and modern web technologies
