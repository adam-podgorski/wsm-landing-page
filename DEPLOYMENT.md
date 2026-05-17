# WSM Deployment Guide

## Architecture

```
westernstrategicminerals.com          → Cloudflare Pages (this repo - static landing page)
platform.westernstrategicminerals.com → Railway (your existing React app + backend + DB)
```

## Part 1: Landing Page on Cloudflare Pages

### 1.1 Create the Git repo

```bash
cd wsm-landing
git init
git add .
git commit -m "Initial landing page"
```

Push to GitHub (or GitLab):

```bash
gh repo create wsm-landing --public --push --source=.
```

### 1.2 Set up Cloudflare Pages

1. Go to https://dash.cloudflare.com → **Workers & Pages** → **Create**
2. Select **Pages** → **Connect to Git**
3. Authorise GitHub and select the `wsm-landing` repo
4. Configure the build:
   - **Build command:** (leave blank — no build needed)
   - **Build output directory:** `public`
   - **Root directory:** `/`
5. Click **Save and Deploy**

Cloudflare will give you a `*.pages.dev` URL immediately. Verify the site looks right.

### 1.3 Add your custom domain

1. In the Cloudflare dashboard, go to your Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `westernstrategicminerals.com`
4. Cloudflare will prompt you to add the domain to Cloudflare DNS (if not already there)
5. Also add: `www.westernstrategicminerals.com` (the `_redirects` file handles the 301 to apex)

### 1.4 Transfer DNS to Cloudflare (if domain is registered elsewhere)

1. In Cloudflare dashboard → **Add a site** → enter `westernstrategicminerals.com`
2. Select the Free plan
3. Cloudflare gives you two nameservers (e.g., `ada.ns.cloudflare.com`, `bob.ns.cloudflare.com`)
4. Go to your domain registrar and update the nameservers to the Cloudflare ones
5. Wait for propagation (usually 15 min – 24 hours)

---

## Part 2: Platform on Railway (subdomain)

### 2.1 Add subdomain in Railway

1. Go to your Railway project → **Settings** → **Networking** → **Custom Domains**
2. Add: `platform.westernstrategicminerals.com`
3. Railway will give you a CNAME target (something like `your-project.up.railway.app`)

### 2.2 Add DNS record in Cloudflare

1. In Cloudflare dashboard → **DNS** → **Records**
2. Add a new record:
   - **Type:** CNAME
   - **Name:** `platform`
   - **Target:** `your-project.up.railway.app` (the value Railway gave you)
   - **Proxy status:** DNS only (grey cloud) — Railway handles its own SSL
3. Save

### 2.3 Update your Railway app's environment

If your React app has any hardcoded references to `wolframexploration.com`, update them:

- `REACT_APP_API_URL` or similar env vars → point to `platform.westernstrategicminerals.com`
- Any CORS allowed origins → add `westernstrategicminerals.com` and `platform.westernstrategicminerals.com`
- Any OAuth callback URLs → update to new domain

### 2.4 Remove old domain

Once everything is working on the new domain:

1. Remove `wolframexploration.com` from Railway custom domains
2. Optionally set up a redirect from `wolframexploration.com` to `westernstrategicminerals.com` (if you want to keep the old domain for a transition period)

---

## Part 3: Platform screenshot for landing page

Once the platform is live on the new subdomain, take a clean screenshot and:

1. Save it as `public/platform-screenshot.png` (optimise to ~200KB with tinypng.com)
2. In `public/index.html`, find the `platform-mock` div and replace it with:

```html
<div class="platform-screenshot">
    <img src="platform-screenshot.png" alt="WSM Intelligence Platform — live SGU permit data, satellite imagery and AI-assisted viability analysis" loading="lazy">
</div>
```

3. Commit and push — Cloudflare auto-deploys.

---

## Deployment checklist

- [ ] Domain `westernstrategicminerals.com` registered and nameservers pointed to Cloudflare
- [ ] Cloudflare Pages project created, linked to `wsm-landing` repo
- [ ] Landing page live at `westernstrategicminerals.com`
- [ ] `www` redirect working (301 to apex)
- [ ] Railway custom domain added: `platform.westernstrategicminerals.com`
- [ ] CNAME record added in Cloudflare DNS for `platform` subdomain
- [ ] Railway env vars updated (API URLs, CORS origins)
- [ ] SSL working on both domains
- [ ] Old `wolframexploration.com` domain redirected or removed
- [ ] Platform screenshot added to landing page
- [ ] Team section populated with real names and bios
- [ ] Email `info@westernstrategicminerals.com` set up (Cloudflare Email Routing or external provider)

---

## File structure

```
wsm-landing/
├── DEPLOYMENT.md          ← this file
└── public/
    ├── index.html         ← landing page
    ├── _headers           ← Cloudflare security headers
    ├── _redirects         ← www → apex redirect
    ├── robots.txt         ← search engine config
    └── sitemap.xml        ← SEO sitemap
```

## Future updates

Just edit `public/index.html` and push to GitHub. Cloudflare auto-deploys in ~30 seconds.
