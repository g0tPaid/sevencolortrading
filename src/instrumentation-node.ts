export async function registerNodeInstrumentation() {
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  if (process.env.TRACKING_SCHEDULER === "0") return;
  const { startTrackingScheduler } = await import("@/lib/tracking/worker");
  startTrackingScheduler();
}

void registerNodeInstrumentation();
