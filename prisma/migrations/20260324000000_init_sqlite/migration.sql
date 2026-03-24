-- CreateTable
CREATE TABLE "StoreAdministrator" (
    "storeId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storeName" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STORE_ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StoreAdministrator_user_key" ON "StoreAdministrator"("user");

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "storeId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "StoreAdministrator" ("storeId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Category_storeId_idx" ON "Category"("storeId");

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "measureUnit" TEXT NOT NULL,
    "stock" REAL NOT NULL DEFAULT 0,
    "storeId" INTEGER NOT NULL,
    "categoryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "StoreAdministrator" ("storeId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Product_storeId_idx" ON "Product"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_storeId_code_key" ON "Product"("storeId", "code");
