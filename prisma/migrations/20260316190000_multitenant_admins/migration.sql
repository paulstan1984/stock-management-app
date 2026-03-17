-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'STORE_ADMIN');

-- CreateTable
CREATE TABLE "StoreAdministrator" (
    "storeId" SERIAL NOT NULL,
    "storeName" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'STORE_ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StoreAdministrator_pkey" PRIMARY KEY ("storeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoreAdministrator_user_key" ON "StoreAdministrator"("user");

-- Seed a default tenant so existing products/categories can be backfilled safely.
INSERT INTO "StoreAdministrator" ("storeName", "user", "password", "role", "updatedAt")
VALUES ('Magazin implicit', 'default_admin', md5('admin'), 'STORE_ADMIN', CURRENT_TIMESTAMP)
ON CONFLICT ("user") DO NOTHING;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN "storeId" INTEGER;
ALTER TABLE "Product" ADD COLUMN "storeId" INTEGER;

-- Backfill existing records
UPDATE "Category"
SET "storeId" = (SELECT "storeId" FROM "StoreAdministrator" WHERE "user" = 'default_admin' LIMIT 1)
WHERE "storeId" IS NULL;

UPDATE "Product"
SET "storeId" = (SELECT "storeId" FROM "StoreAdministrator" WHERE "user" = 'default_admin' LIMIT 1)
WHERE "storeId" IS NULL;

-- Make required
ALTER TABLE "Category" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "Product" ALTER COLUMN "storeId" SET NOT NULL;

-- Replace global unique code with per-store unique code
DROP INDEX IF EXISTS "Product_code_key";
CREATE UNIQUE INDEX "Product_storeId_code_key" ON "Product"("storeId", "code");

-- Add indexes
CREATE INDEX "Category_storeId_idx" ON "Category"("storeId");
CREATE INDEX "Product_storeId_idx" ON "Product"("storeId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_storeId_fkey"
FOREIGN KEY ("storeId") REFERENCES "StoreAdministrator"("storeId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Product" ADD CONSTRAINT "Product_storeId_fkey"
FOREIGN KEY ("storeId") REFERENCES "StoreAdministrator"("storeId") ON DELETE CASCADE ON UPDATE CASCADE;
