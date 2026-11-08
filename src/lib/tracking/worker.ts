import { hostname } from "os";
import { MSG } from "@/lib/tracking/messages";
import { enqueueStalePublic, failQueuedPublicAsUnavailable, runPublicPump } from "@/lib/tracking/public-cache";
import { processShipment } from "@/lib/tracking/refresh";
import { liveScraperClient, type ScraperClient } from "@/lib/tracking/scraper-client";
import {
  claimQueued,
  countAdminDue,
  enqueueDue,
  getSettings,
  postponeDue,
  writeProviderLog,
} from "@/lib/tracking/store";
import { getDb } from "@/lib/tracking/db";

const CLAIM_TTL_MS = 120_000;
let ticking = false;

function workerId(): string {
  return process.env.TRACKING_WORKER_ID?.trim() || `${hostname()}:${process.pid}`;
}

function tickMs(): number {
  const raw = Number(process.env.TRACKING_TICK_MS ?? "60000");
  if (!Number.isFinite(raw)) return 60_000;
  return Math.min(10 * 60 * 1000, Math.max(5_000, Math.round(raw)));
}

export async function runSchedulerTick(opts?: {
  client?: ScraperClient;
  now?: Date;
  workerId?: string;
  checkHealth?: boolean;
}): Promise<{ claimed: number; postponed: boolean; publicClaimed: number }> {
  const now = opts?.now ?? new Date();
  const client = opts?.client ?? liveScraperClient();
  const settings = getSettings();
  if (opts?.checkHealth !== false) {
    const healthy = await client.health();
    if (!healthy) {
      postponeDue(now, 15 * 60 * 1000, MSG.unavailable);
      failQueuedPublicAsUnavailable(now);
      writeProviderLog({
        shipmentId: null,
        carrierId: null,
        outcome: "unavailable",
        httpStatus: null,
        durationMs: null,
        errorKind: "unavailable",
        now,
      });
      return { claimed: 0, postponed: true, publicClaimed: 0 };
    }
  }
  enqueueDue(now);
  const ids = claimQueued(
    settings.globalConcurrency,
    opts?.workerId ?? workerId(),
    now,
    CLAIM_TTL_MS,
    settings.perCarrierConcurrency,
  );
  for (const id of ids) {
    await processShipment(id, { client, now });
  }
  let publicClaimed = 0;
  if (countAdminDue(now) <= settings.globalConcurrency) {
    enqueueStalePublic(now);
    publicClaimed = await runPublicPump({ client, now, ignoreAdminBacklog: true });
  }
  return { claimed: ids.length, postponed: false, publicClaimed };
}

export function startTrackingScheduler(opts?: { keepAlive?: boolean }): void {
  if (process.env.TRACKING_SCHEDULER === "0") return;
  const state = globalThis as typeof globalThis & { __scTrackingTimer?: ReturnType<typeof setInterval> };
  if (state.__scTrackingTimer) return;
  try {
    getDb();
  } catch {
    console.warn("[tracking] scheduler not started");
    return;
  }
  const run = () => {
    if (ticking) return;
    ticking = true;
    void runSchedulerTick()
      .catch(() => {
        console.error("[tracking] tick failed");
      })
      .finally(() => {
        ticking = false;
      });
  };
  const timer = setInterval(run, tickMs());
  if (!opts?.keepAlive) timer.unref();
  state.__scTrackingTimer = timer;
  console.warn("[tracking] scheduler started");
  run();
}
