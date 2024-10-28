/*
  Warnings:

  - The primary key for the `Inventory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `invId` on the `Inventory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `storeId` on the `Inventory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `roleId` on the `Role` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Sale` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `saleId` on the `Sale` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `storeId` on the `Sale` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `invId` on the `Sale` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `saleQuantity` on the `Sale` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `salePrice` on the `Sale` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Store` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `roleType` on the `Role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('SALES', 'MANAGER', 'INVENTORY_STAFF', 'STORE_MANAGER');

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_invId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_storeManagerId_fkey";

-- AlterTable
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_pkey",
ALTER COLUMN "invId" SET DATA TYPE SERIAL,
ALTER COLUMN "storeId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Inventory_pkey" PRIMARY KEY ("invId");

-- AlterTable
ALTER TABLE "Role" DROP CONSTRAINT "Role_pkey",
ALTER COLUMN "roleId" SET DATA TYPE SERIAL,
DROP COLUMN "roleType",
ADD COLUMN     "roleType" "RoleType" NOT NULL,
ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("roleId");

-- AlterTable
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_pkey",
ALTER COLUMN "saleId" SET DATA TYPE SERIAL,
ALTER COLUMN "storeId" SET DATA TYPE INTEGER,
ALTER COLUMN "invId" SET DATA TYPE INTEGER,
ALTER COLUMN "saleQuantity" SET DATA TYPE INTEGER,
ALTER COLUMN "salePrice" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Sale_pkey" PRIMARY KEY ("saleId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Employee";

-- DropTable
DROP TABLE "Store";

-- CreateTable
CREATE TABLE "store" (
    "storeid" SERIAL NOT NULL,
    "storename" TEXT NOT NULL,
    "storelocation" TEXT NOT NULL,
    "storeManagerId" TEXT NOT NULL,
    "storestatus" BOOLEAN NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_pkey" PRIMARY KEY ("storeid")
);

-- CreateTable
CREATE TABLE "employee" (
    "empId" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empName" VARCHAR(255) NOT NULL,
    "empPhone" VARCHAR(50) NOT NULL,
    "empStatus" BOOLEAN NOT NULL,
    "storeManagerId" VARCHAR(255) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("empId")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_storeid_storeManagerId_key" ON "store"("storeid", "storeManagerId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_storeManagerId_empId_key" ON "employee"("storeManagerId", "empId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("storeid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_storeManagerId_fkey" FOREIGN KEY ("storeManagerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("storeid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_invId_fkey" FOREIGN KEY ("invId") REFERENCES "Inventory"("invId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_storeId_storeManagerId_fkey" FOREIGN KEY ("storeId", "storeManagerId") REFERENCES "store"("storeid", "storeManagerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;
