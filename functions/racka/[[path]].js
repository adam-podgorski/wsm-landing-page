// Cloudflare Pages Function: serves westernstrategicminerals.com/racka/* from the
// platform app on Railway, so the address stays on this domain. The page, its data
// and the password check all live on the platform (private repo); nothing
// confidential is in this public repo. The 401 + WWW-Authenticate response passes
// through untouched, so the browser's sign-in prompt appears here.
const PLATFORM = 'https://platform.westernstrategicminerals.com';

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const headers = new Headers(request.headers);
  headers.delete('host');
  const upstream = await fetch(PLATFORM + url.pathname + url.search, {
    method: request.method,
    headers,
    redirect: 'manual', // keep the /racka -> /racka/ redirect relative to this domain
  });
  return new Response(upstream.body, upstream);
}
