import Link from "next/link";
import { Clock, Eye, Factory, Globe2, Users } from "lucide-react";
import { formatDuration, getStats } from "@/lib/analytics-store";
import { listApplications } from "@/lib/factory-applications-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COUNTRY_NAMES: Record<string, string> = {
  AE: "United Arab Emirates",
  AU: "Australia",
  BR: "Brazil",
  CA: "Canada",
  CN: "China",
  DE: "Germany",
  EG: "Egypt",
  ES: "Spain",
  FR: "France",
  GB: "United Kingdom",
  HK: "Hong Kong",
  IN: "India",
  IT: "Italy",
  JP: "Japan",
  KR: "South Korea",
  NL: "Netherlands",
  PK: "Pakistan",
  RU: "Russia",
  SA: "Saudi Arabia",
  SG: "Singapore",
  TR: "Turkey",
  US: "United States",
  ZZ: "Unknown",
};

function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

function flagEmoji(code: string): string {
  if (!code || code === "ZZ" || code.length !== 2) return "🌐";
  const upper = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return "🌐";
  const chars = [...upper].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...chars);
}

function countryLabel(code: string): string {
  return COUNTRY_NAMES[code] || code;
}

function relativeTime(iso: string): string {
  const ts = Date.parse(iso);
  if (!Number.isFinite(ts)) return iso;
  const deltaSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (deltaSec < 60) return "just now";
  if (deltaSec < 3600) return `${Math.floor(deltaSec / 60)}m ago`;
  if (deltaSec < 86400) return `${Math.floor(deltaSec / 3600)}h ago`;
  return `${Math.floor(deltaSec / 86400)}d ago`;
}

export default async function DashboardHomePage() {
  const [stats, applications] = await Promise.all([getStats(), listApplications()]);
  const pendingFactories = applications.filter((row) => row.status === "pending").length;

  const periods = [
    { label: "Today", pageviews: stats.today.pageviews, uniques: stats.today.uniques },
    { label: "Last 7 days", pageviews: stats.week.pageviews, uniques: stats.week.uniques },
    { label: "All time", pageviews: stats.allTime.pageviews, uniques: stats.allTime.uniques },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Admin</h1>
        <p className="mt-2 text-sm text-muted">Website pageviews and factory vendor applications.</p>
      </div>

      <section className="rounded-3xl border border-line bg-paper-elevated p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Traffic</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink">Page views</h2>
          </div>
          <Users className="h-5 w-5 text-accent" aria-hidden />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {periods.map((period) => (
            <div key={period.label} className="rounded-2xl border border-line bg-paper p-4">
              <p className="text-sm text-muted">{period.label}</p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-ink">
                  {formatCount(period.pageviews)}
                </span>
                <span className="text-xs text-muted">pageviews</span>
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-ink">
                <Eye className="h-3.5 w-3.5 text-accent" aria-hidden />
                <span className="font-medium">{formatCount(period.uniques)}</span>
                <span className="text-muted">unique visitors</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-line bg-paper p-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Clock className="h-4 w-4 text-accent" aria-hidden />
            <span>Avg time on site</span>
          </div>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold text-ink">
              {formatDuration(stats.avgDurationSeconds)}
            </span>
            <span className="text-xs text-muted">
              across {formatCount(stats.sessionCount)}{" "}
              {stats.sessionCount === 1 ? "session" : "sessions"}
            </span>
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-accent" aria-hidden />
              <h3 className="text-sm font-semibold text-ink">Top countries</h3>
            </div>
            {stats.countries.length === 0 ? (
              <p className="rounded-2xl border border-line bg-paper px-4 py-6 text-sm text-muted">
                No country data yet.
              </p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-line bg-paper">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
                    <tr>
                      <th className="px-4 py-2 font-medium">Country</th>
                      <th className="px-4 py-2 font-medium">Visits</th>
                      <th className="px-4 py-2 font-medium">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.countries.map((row) => (
                      <tr key={row.code} className="border-b border-line last:border-0">
                        <td className="px-4 py-2.5">
                          <span className="mr-2" aria-hidden>
                            {flagEmoji(row.code)}
                          </span>
                          <span className="font-medium text-ink">{row.code}</span>
                          <span className="ml-2 text-muted">{countryLabel(row.code)}</span>
                        </td>
                        <td className="px-4 py-2.5 text-ink">{formatCount(row.visits)}</td>
                        <td className="px-4 py-2.5 text-ink">{formatCount(row.pageviews)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">Recent visitors</h3>
            {stats.recentSessions.length === 0 ? (
              <p className="rounded-2xl border border-line bg-paper px-4 py-6 text-sm text-muted">
                No recent sessions yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {stats.recentSessions.map((session, index) => (
                  <li
                    key={`${session.lastSeen}-${session.country}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-ink">
                        <span className="mr-1.5" aria-hidden>
                          {flagEmoji(session.country)}
                        </span>
                        {session.country}{" "}
                        <span className="font-normal text-muted">{countryLabel(session.country)}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {formatDuration(session.durationSeconds)} · {formatCount(session.pageviews)}{" "}
                        {session.pageviews === 1 ? "page" : "pages"}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs text-muted">{relativeTime(session.lastSeen)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className="mt-4 text-xs text-muted">
          Counts public marketing pages only. Stored on the server. Periods use UTC calendar days.
        </p>
      </section>

      <Link
        href="/dashboard/factory-applications"
        className="flex items-center justify-between gap-4 rounded-3xl border border-line bg-paper-elevated p-6 transition hover:border-accent/40"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Vendors</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink">Factory applications</h2>
          <p className="mt-2 text-sm text-muted">
            {pendingFactories === 0
              ? "No pending factory applications."
              : `${pendingFactories} pending ${pendingFactories === 1 ? "application" : "applications"} to review.`}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-semibold text-ink">{formatCount(pendingFactories)}</p>
          <p className="mt-1 text-xs text-muted">pending</p>
          <Factory className="ml-auto mt-3 h-5 w-5 text-accent" aria-hidden />
        </div>
      </Link>
    </div>
  );
}
