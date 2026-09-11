"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SourcingLogo } from "@/components/brand/sourcing-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

function safeNextPath(raw: string | null): string {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  if (raw.startsWith("/login")) return "/dashboard";
  return raw;
}

export function LoginForm({ nextPath }: { nextPath: string | null }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error || "Invalid username or password");
        setPending(false);
        return;
      }
      router.replace(safeNextPath(nextPath));
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <SourcingLogo size="nav" />
          <span className="hidden text-[10px] text-muted sm:block">Admin</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Seven Color Trading
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
          Admin login
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to the Sourcing Center admin desk.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-3xl border border-line bg-paper-elevated p-6 shadow-sm">
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-muted">
              Username
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none ring-accent focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-muted">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none ring-accent focus:ring-2"
            />
          </div>

          {error ? (
            <p className="rounded-2xl bg-accent-soft px-3 py-2 text-sm text-accent" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-60 dark:bg-accent"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </main>
    </div>
  );
}
