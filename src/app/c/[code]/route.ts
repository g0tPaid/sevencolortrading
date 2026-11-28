const portalOrigin = 'https://soloflow.practicalthings.store';
const previewImage = 'https://sourcing.center/sourcing-center-logo.png';
const previewTitle = 'Your private order dashboard | Sourcing Center';
const previewDescription = 'Track your sourcing orders, quality checks and shipments with Seven Color Trading Co Ltd.';
export const dynamic = 'force-dynamic';
const privacyHeaders = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'private, no-store',
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
};
const previewMeta = '<meta property="og:type" content="website"><meta property="og:site_name" content="Sourcing Center"><meta property="og:title" content="' + previewTitle + '"><meta property="og:description" content="' + previewDescription + '"><meta property="og:image" content="' + previewImage + '"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1536"><meta property="og:image:height" content="1024"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="' + previewTitle + '"><meta name="twitter:description" content="' + previewDescription + '"><meta name="twitter:image" content="' + previewImage + '">';
function genericPage(status: number, message: string) {
  return new Response('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + previewTitle + '</title>' + previewMeta + '</head><body><h1>Sourcing Center</h1><p>' + message + '</p></body></html>', { status, headers: { ...privacyHeaders, 'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'" } });
}
export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^[A-Za-z0-9_-]{22}$/.test(code)) return genericPage(404, 'This private link is unavailable.');
  // Preview services get branding only, never the customer's invoices or identity.
  if (/WhatsApp|facebookexternalhit|Facebot|Twitterbot|TelegramBot|Slackbot|Discordbot|LinkedInBot|SkypeUriPreview|Googlebot|bingbot|Applebot|preview/i.test(request.headers.get('user-agent') || '')) {
    return genericPage(200, 'Open your private order dashboard in your browser.');
  }
  const query = new URL(request.url).searchParams;
  const url = new URL('/api/v1/partner-shipments/' + code, portalOrigin);
  if (query.get('view') === 'grid') url.searchParams.set('view', 'grid');
  if (query.get('enriched') === '1') url.searchParams.set('enriched', '1');
  try {
    const requestHeaders = new Headers();
    const etag = request.headers.get('if-none-match');
    if (etag) requestHeaders.set('if-none-match', etag);
    const upstream = await fetch(url, { headers: requestHeaders, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(60000) });
    const headers = new Headers(privacyHeaders);
    for (const key of ['content-security-policy', 'etag']) {
      const value = upstream.headers.get(key);
      if (value) headers.set(key, value);
    }
    if (upstream.status === 304) return new Response(null, { status: 304, headers });
    if (!upstream.ok) return genericPage(upstream.status === 404 ? 404 : 503, upstream.status === 404 ? 'This private link is unavailable.' : 'Your dashboard is temporarily unavailable. Please try again.');
    const html = (await upstream.text())
      .replace('<title>', previewMeta + '<title>')
      .replace(/(src="|url\(')(\/(?:icons|uploads)\/)/g, '$1' + portalOrigin + '$2');
    return new Response(html, { status: 200, headers });
  } catch {
    return genericPage(503, 'Your dashboard is temporarily unavailable. Please try again.');
  }
}
