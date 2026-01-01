# Multi-Tenant Testing Guide

## System Status: ✅ READY

Your AKPPOS system has been successfully transformed into a multi-tenant SaaS platform!

### What's Running:
- ✅ Dev server: http://localhost:3000
- ✅ Database: Seeded with demo tenant
- ✅ All Prisma types: Regenerated

### Default Test Account (Demo Tenant)
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Tenant**: "Demo Store"
- **Role**: ADMIN

---

## Testing Scenarios

### Scenario 1: Test Default Admin Login
1. Go to http://localhost:3000/login
2. Login with `admin@example.com` / `admin123`
3. **Expected**: You should see the admin dashboard with products/categories from "Demo Store" tenant

### Scenario 2: Create a New Tenant (First User Auto-Admin)
1. **Reset database** (to test fresh signup):
   ```bash
   npx prisma migrate reset --force
   ```

2. Go to http://localhost:3000/signup
3. Sign up with:
   - Name: "John's Store Owner"
   - Email: "john@mystore.com"
   - Password: "SecurePass123"

4. **Expected**:
   - System creates "John's Store Owner's Store" tenant
   - John becomes ADMIN automatically
   - He should see an empty dashboard (no products yet)

### Scenario 3: Test Tenant Isolation
1. **Login as Admin** (demo tenant)
2. Add a product:
   - Name: "Demo Product"
   - Category: "Beverages"
   - Price: $5.00

3. **Logout** and create a new account:
   - Name: "Sarah"
   - Email: "sarah@bakery.com"  
   - Password: "SecurePass123"

4. **Expected**:
   - Sarah gets her own tenant ("Sarah's Store")
   - She should NOT see "Demo Product"
   - Her product list should be empty

### Scenario 4: Test POS Workflow
1. Login as any admin
2. Create some products
3. Go to `/pos` (POS Terminal)
4. Add products to cart and checkout
5. Go to Admin → Orders
6. **Expected**: Only see orders from your own tenant

---

## Tenant Data Flow

```
Registration (First Time)
    ↓
Create Tenant "User's Store"
    ↓
User becomes ADMIN of that tenant
    ↓
All data (products/orders) linked to tenant
    ↓
JWT contains tenantId
    ↓
All API calls filter by tenantId
```

---

## Known Limitations (To Be Implemented)

### Current Behavior:
- ✅ First user creates a new tenant
- ⚠️  Second user also creates a new tenant (not ideal)

### Planned Improvement:
We need to implement an **Invitation System** where:
- Admins can invite staff to join their existing tenant
- New signups require an invitation code
- Or build a "Join Existing Tenant" flow

---

## API Endpoints Updated for Multi-Tenancy

✅ **Products**
- `GET /api/products` - Returns only tenant's products
- `POST /api/products` - Auto-assigns tenantId
- `PUT /api/products/[id]` - Verifies ownership
- `DELETE /api/products/[id]` - Verifies ownership

✅ **Categories**
- `GET /api/categories` - Returns only tenant's categories
- `POST /api/categories` - Auto-assigns tenantId

✅ **Orders**
- `GET /api/orders` - Returns only tenant's orders
- `POST /api/orders` - Verifies all products belong to tenant

✅ **Authentication**
- `POST /api/auth/register` - Creates tenant for first user
- `POST /api/auth/login` - Returns tenantId in JWT

---

## Troubleshooting

### "Unauthorized" errors
- Make sure you're logged in
- Check that your JWT token contains `tenantId`

### Products not showing
- Verify you're logged in to the correct account
- Check that products were created under your tenant

### Database seems empty
- Run: `npx prisma db seed` to populate demo data
- Or create data manually through the admin panel

---

## Next Steps

1. ✅ Test basic login/registration
2. ✅ Test product creation and isolation
3. ✅ Test POS workflow
4. 🚧 Implement invitation system for multi-user tenants
5. 🚧 Add tenant switching for super-admins
6. 🚧 Update remaining admin APIs (Users, Settings, Dashboard)
