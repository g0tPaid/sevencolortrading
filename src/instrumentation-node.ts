export async function registerNodeInstrumentation() {
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const dbPath = process.env.SHOPIFY_DB_PATH;
  if (dbPath) {
    const { ShopifyOrderStore } = await import("@/lib/shopify/order-store");
    const purge = () => {
      let store: InstanceType<typeof ShopifyOrderStore> | undefined;
      try {
        store = new ShopifyOrderStore(dbPath);
        store.purgeExpiredRecords();
      } catch {
        console.error("Shopify retention cleanup failed");
      } finally { store?.close(); }
    };
    // Keep a single timer per process even if instrumentation is imported again.
    const runtime = globalThis as typeof globalThis & { shopifyRetentionTimer?: ReturnType<typeof setInterval> };
    if (!runtime.shopifyRetentionTimer) {
      purge();
      runtime.shopifyRetentionTimer = setInterval(purge, 60 * 60 * 1000);
      runtime.shopifyRetentionTimer.unref();
    }
  }
  if (process.env.TRACKING_SCHEDULER === "0") return;
  const { startTrackingScheduler } = await import("@/lib/tracking/worker");
  startTrackingScheduler();
}

void registerNodeInstrumentation();
