# Static landing page served by Caddy.
# Railway was failing to build this repo because it contains only static
# files — Nixpacks can't generate a build plan without a package.json or
# similar. A Dockerfile makes the build explicit and trivial.
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY public /srv
