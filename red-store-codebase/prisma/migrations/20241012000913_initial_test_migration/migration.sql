/*
  Warnings:

  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `emp_id` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `emp_name` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `emp_phone` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `emp_status` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `store_id` on the `Employee` table. All the data in the column will be lost.
  - The primary key for the `Inventory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `inv_additional` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `inv_created_date` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `inv_id` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `inv_item` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `inv_item_barcode` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `inv_item_brand` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `inv_item_price` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `inv_item_size` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `inv_item_stock` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `inv_item_type` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `store_id` on the `Inventory` table. All the data in the column will be lost.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_id` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `role_type` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the `Sales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[roleId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdAt` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empName` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empPhone` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empStatus` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invCreatedDate` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invItem` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invItemBarcode` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invItemBrand` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invItemPrice` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invItemSize` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invItemStock` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invItemType` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleType` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_role_id_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_store_id_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_store_id_fkey";

-- DropForeignKey
ALTER TABLE "Sales" DROP CONSTRAINT "Sales_inv_id_fkey";

-- DropForeignKey
ALTER TABLE "Sales" DROP CONSTRAINT "Sales_store_id_fkey";

-- DropForeignKey
ALTER TABLE "Stores" DROP CONSTRAINT "Stores_store_manager_id_fkey";

-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
DROP COLUMN "created_at",
DROP COLUMN "emp_id",
DROP COLUMN "emp_name",
DROP COLUMN "emp_phone",
DROP COLUMN "emp_status",
DROP COLUMN "role_id",
DROP COLUMN "store_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "empId" BIGSERIAL NOT NULL,
ADD COLUMN     "empName" TEXT NOT NULL,
ADD COLUMN     "empPhone" TEXT NOT NULL,
ADD COLUMN     "empStatus" BOOLEAN NOT NULL,
ADD COLUMN     "roleId" BIGINT NOT NULL,
ADD COLUMN     "storeId" BIGINT NOT NULL,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("empId");

-- AlterTable
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_pkey",
DROP COLUMN "inv_additional",
DROP COLUMN "inv_created_date",
DROP COLUMN "inv_id",
DROP COLUMN "inv_item",
DROP COLUMN "inv_item_barcode",
DROP COLUMN "inv_item_brand",
DROP COLUMN "inv_item_price",
DROP COLUMN "inv_item_size",
DROP COLUMN "inv_item_stock",
DROP COLUMN "inv_item_type",
DROP COLUMN "store_id",
ADD COLUMN     "invAdditional" JSONB,
ADD COLUMN     "invCreatedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "invId" BIGSERIAL NOT NULL,
ADD COLUMN     "invItem" TEXT NOT NULL,
ADD COLUMN     "invItemBarcode" INTEGER NOT NULL,
ADD COLUMN     "invItemBrand" TEXT NOT NULL,
ADD COLUMN     "invItemPrice" INTEGER NOT NULL,
ADD COLUMN     "invItemSize" INTEGER NOT NULL,
ADD COLUMN     "invItemStock" INTEGER NOT NULL,
ADD COLUMN     "invItemType" TEXT NOT NULL,
ADD COLUMN     "storeId" BIGINT NOT NULL,
ADD CONSTRAINT "Inventory_pkey" PRIMARY KEY ("invId");

-- AlterTable
ALTER TABLE "Role" DROP CONSTRAINT "Role_pkey",
DROP COLUMN "role_id",
DROP COLUMN "role_type",
ADD COLUMN     "roleId" BIGSERIAL NOT NULL,
ADD COLUMN     "roleType" TEXT NOT NULL,
ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("roleId");

-- DropTable
DROP TABLE "Sales";

-- DropTable
DROP TABLE "Stores";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Store" (
    "storeId" BIGSERIAL NOT NULL,
    "storeName" TEXT NOT NULL,
    "storeLocation" TEXT NOT NULL,
    "storeManagerId" TEXT NOT NULL,
    "storeStatus" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("storeId")
);

-- CreateTable
CREATE TABLE "Sale" (
    "saleId" BIGSERIAL NOT NULL,
    "storeId" BIGINT NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL,
    "invId" BIGINT NOT NULL,
    "saleQuantity" BIGINT NOT NULL,
    "salePrice" BIGINT NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("saleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_roleId_key" ON "Employee"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_storeId_key" ON "Inventory"("storeId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("storeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_storeManagerId_fkey" FOREIGN KEY ("storeManagerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("storeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_invId_fkey" FOREIGN KEY ("invId") REFERENCES "Inventory"("invId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("storeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;
