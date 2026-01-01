# Multi-Tenant Refactoring Implementation Plan

## Status: IN PROGRESS

### ✅ Completed Steps

1. **Database Schema Refactoring**
   - ✅ Added `Tenant` model to schema
   - ✅ Added `tenantId` foreign key to all main models (User, Category, Product, Order, Settings)
   - ✅ Updated unique constraints to be tenant-scoped
   - ✅ Added cascade delete rules
   - ✅ Created migration

2. **Seed Script**
   - ✅ Updated to create default tenant
   - ✅ Associates all seed data with tenant

3. **Authentication**
   - ✅ Updated registration to create tenant for first user
   - ✅ Updated login to include tenantId in JWT
   - ✅ Created tenant context helper utilities

### 🚧 Remaining Steps

#### Phase 1: Core API Routes (CRITICAL)
All API routes must be updated to filter by tenantId. Priority order:

1. **Products API** (`/api/products/route.ts` and `/api/products/[id]/route.ts`)
   - [ ] GET: Filter products by tenantId
   - [ ] POST: Auto-assign tenantId when creating
   - [ ] PUT/PATCH: Verify product belongs to tenant
   - [ ] DELETE: Verify product belongs to tenant

2. **Categories API** (`/api/categories/route.ts`)
   - [ ] GET: Filter categories by tenantId
   - [ ] POST: Auto-assign tenantId when creating

3. **Orders API** (`/api/orders/route.ts`)
   - [ ] GET: Filter orders by tenantId
   - [ ] POST: Auto-assign tenantId when creating

4. **Users API** (`/api/users/route.ts` and `/api/users/[id]/route.ts`)
   - [ ] GET: Filter users by tenantId
   - [ ] POST: Auto-assign tenantId (only allow same tenant)
   - [ ] DELETE: Verify user belongs to tenant

5. **Settings API** (`/api/settings/route.ts`)
   - [ ] GET: Filter by tenantId
   - [ ] PUT: Verify settings belong to tenant

6. **Dashboard Stats** (`/api/dashboard/stats/route.ts`)
   - [ ] Filter all stats by tenantId

7. **Reports** (`/api/reports/*`)
   - [ ] Filter all reports by tenantId

#### Phase 2: Admin UI Updates
- [ ] Update all list pages to show tenant-scoped data
- [ ] Ensure create forms auto-assign tenant
- [ ] Add tenant switching UI (future enhancement)

#### Phase 3: Testing
- [ ] Test registration creates new tenant
- [ ] Test users can only see their tenant's data
- [ ] Test admin functions work within tenant scope
- [ ] Test POS only shows tenant's products

### Implementation Pattern

For each API route, follow this pattern:

```typescript
import { getUserFromRequest } from '@/lib/tenant'

export async function GET(request: NextRequest) {
    const user = await getUserFromRequest(request)
    
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Filter by tenantId
    const data = await prisma.model.findMany({
        where: { tenantId: user.tenantId }
    })
    
    return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
    const user = await getUserFromRequest(request)
    
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Auto-assign tenantId
    const created = await prisma.model.create({
        data: {
            ...body,
            tenantId: user.tenantId
        }
    })
    
    return NextResponse.json(created, { status: 201 })
}
```

### Security Considerations

1. **Data Isolation**: Never allow cross-tenant data access
2. **Tenant Verification**: Always verify resources belong to requesting tenant before modification
3. **JWT Security**: Ensure tenantId cannot be tampered with in JWT
4. **Cascade Deletes**: Deleting a tenant will delete all associated data

### Future Enhancements

- [ ] Super Admin role to manage multiple tenants
- [ ] Tenant invitation system
- [ ] Subdomain-based tenant routing
- [ ] Tenant billing/subscription management
- [ ] Tenant customization (themes, logos, etc.)
