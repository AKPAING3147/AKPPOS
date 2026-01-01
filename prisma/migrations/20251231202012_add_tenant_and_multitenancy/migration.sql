/*
  Warnings:

  - A unique constraint covering the columns `[name,tenantId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barcode,tenantId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenantId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InventoryLog" DROP CONSTRAINT "InventoryLog_productId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropIndex
DROP INDEX "Category_name_key";

-- DropIndex
DROP INDEX "Product_barcode_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL DEFAULT 'MGYPOS',
    "companyAddress" TEXT DEFAULT '123 Business Street, City, State 12345',
    "companyPhone" TEXT DEFAULT '(555) 123-4567',
    "companyEmail" TEXT,
    "companyLogo" TEXT,
    "taxRate" DECIMAL(65,30) NOT NULL DEFAULT 0.10,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_tenantId_key" ON "Settings"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_tenantId_key" ON "Category"("name", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_tenantId_key" ON "Product"("barcode", "tenantId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
