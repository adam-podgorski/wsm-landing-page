// Cloudflare Pages Function: serves westernstrategicminerals.com/rackla/* from the
// platform app's /racka/* route, so the address keeps the company's spelling. The
// page, its data and the password check all live on the platform (private repo);
// nothing confidential is in this public repo. The 401 + WWW-Authenticate response
// passes through untouched, so the browser's sign-in prompt appears here.
const PLATFORM = 'https://platform.westernstrategicminerals.com';

export async function onRequest({ request }) {
  const url = new URL(request.url);
  if (url.pathname === '/rackla') {
    return Response.redirect(`${url.origin}/rackla/${url.search}`, 301); // the page loads its data relative to the trailing slash
  }
  const headers = new Headers(request.headers);
  headers.delete('host');
  const upstream = await fetch(PLATFORM + url.pathname.replace(/^\/rackla/, '/racka') + url.search, {
    method: request.method,
    headers,
    redirect: 'manual',
  });
  return new Response(upstream.body, upstream);
}
