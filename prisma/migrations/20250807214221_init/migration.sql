-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "generation" TEXT,
    "year" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "transmission" TEXT NOT NULL,
    "fuel" TEXT NOT NULL,
    "drive" TEXT NOT NULL,
    "bodyType" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "power" INTEGER NOT NULL,
    "engineVolume" REAL NOT NULL,
    "euroStandard" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "customs" BOOLEAN NOT NULL,
    "vat" BOOLEAN NOT NULL,
    "owners" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "negotiable" BOOLEAN NOT NULL,
    "city" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photos" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "adminId" TEXT NOT NULL,
    CONSTRAINT "Car_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Car_vin_key" ON "Car"("vin");
