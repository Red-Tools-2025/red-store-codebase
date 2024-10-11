-- CreateTable
CREATE TABLE "Role" (
    "role_id" BIGSERIAL NOT NULL,
    "role_type" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Users" (
    "user_id" BIGSERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_role" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "user_phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "session_token" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "inv_id" BIGSERIAL NOT NULL,
    "store_id" BIGINT NOT NULL,
    "inv_item" TEXT NOT NULL,
    "inv_item_brand" TEXT NOT NULL,
    "inv_item_stock" INTEGER NOT NULL,
    "inv_item_price" INTEGER NOT NULL,
    "inv_item_type" TEXT NOT NULL,
    "inv_created_date" TIMESTAMP(3) NOT NULL,
    "inv_item_barcode" INTEGER NOT NULL,
    "inv_item_size" INTEGER NOT NULL,
    "inv_additional" JSONB,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("inv_id")
);

-- CreateTable
CREATE TABLE "Stores" (
    "store_id" BIGSERIAL NOT NULL,
    "store_name" TEXT NOT NULL,
    "store_location" TEXT NOT NULL,
    "store_manager_id" BIGINT NOT NULL,
    "store_status" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stores_pkey" PRIMARY KEY ("store_id")
);

-- CreateTable
CREATE TABLE "Sales" (
    "sales_id" BIGSERIAL NOT NULL,
    "store_id" BIGINT NOT NULL,
    "sale_date" TIMESTAMP(3) NOT NULL,
    "inv_id" BIGINT NOT NULL,
    "sale_quantity" BIGINT NOT NULL,
    "sale_price" BIGINT NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("sales_id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "emp_id" BIGSERIAL NOT NULL,
    "store_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "emp_name" TEXT NOT NULL,
    "emp_phone" TEXT NOT NULL,
    "emp_status" BOOLEAN NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("emp_id")
);

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Stores"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stores" ADD CONSTRAINT "Stores_store_manager_id_fkey" FOREIGN KEY ("store_manager_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Stores"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_inv_id_fkey" FOREIGN KEY ("inv_id") REFERENCES "Inventory"("inv_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Stores"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;
