CREATE TABLE "WarehouseNotification" (
  "shop" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "receivedAt" TEXT NOT NULL,
  PRIMARY KEY ("shop", "kind")
);
