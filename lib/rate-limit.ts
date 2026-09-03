type Bucket = { count: number; resetAt: number };

// Module-scope map: persists for the lifetime of a warm serverless
// instance, reset on cold start and not shared across instances/regions.
// A soft deterrent against casual abuse, not a hard guarantee.
const buckets = new Map<string, Bucket>();

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  cleanup(now);

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const };
  }
  if (bucket.count >= limit) {
    return { ok: false as const, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  bucket.count++;
  return { ok: true as const };
}

export function getClientIp(headers: Headers | Record<string, any> | null | undefined): string {
  const get = (name: string): string | undefined => {
    if (!headers) return undefined;
    if (headers instanceof Headers) return headers.get(name) ?? undefined;
    return headers[name] ?? headers[name.toLowerCase()];
  };
  const fwd = get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}
