import { startTrackingScheduler } from "../src/lib/tracking/worker";

// Dedicated process for a single replica. The Railway web process also starts
// this scheduler from src/instrumentation.ts unless TRACKING_SCHEDULER=0.
startTrackingScheduler({ keepAlive: true });
