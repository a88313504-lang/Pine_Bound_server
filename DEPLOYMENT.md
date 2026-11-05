# Pinebound 0.9.1: complete multiplayer hosting handoff

This ZIP contains the backend AND the full optimized browser client/assets. Exporting it does not provision hosting or change the live launcher update feed.

## Source and dependencies
- server.mjs: HTTP API, rooms/sessions, 30 Hz simulation scheduler, snapshots, SSE/poll transports and static/gzip model delivery.
- simulation.mjs: authoritative game modes, players, vehicles, combat and collision simulation.
- rail-service.mjs: train service simulation (included in the corrected Dockerfile).
- public/: shared world, rail kinematics, connected scene/collision data, browser game, vendored libraries/decoders, models and textures. Keep this entire directory.
- test/: automated simulation and HTTP multiplayer tests.
- package.json / package-lock.json: Node >=22; zero external npm dependencies. No node_modules, database, Redis, API keys or build step required. Browser dependencies are vendored in public/vendor/. Retain included asset inventories and third-party attribution; no additional asset redistribution rights are granted by this export.

## Run locally
From this extracted directory with Node >=22 installed:

    node --test
    node server.mjs --public

Open http://localhost:3000. --public selects polling snapshots; the normal npm start command selects SSE. Both are implemented. Do not run two servers on the same port.

## Permanent host requirements
Use ONE always-on Node process/container at a stable HTTPS origin. Set both minimum and maximum replicas to 1. Rooms and session tokens live in that process's memory: multiple workers/instances split rooms, and sticky sessions alone do not solve joining. Static hosting or per-request serverless functions cannot run this simulation unchanged. Avoid overlapping instances receiving traffic during updates.

Set these in the service environment:

    NODE_ENV=production
    HOST=0.0.0.0
    PORT=3000
    PUBLIC_URL=https://YOUR-ACTUAL-PERMANENT-HOSTNAME

PUBLIC_URL is an HTTPS origin without a path. TLS terminates at the hosting platform/proxy; Node speaks HTTP internally. Direct Node does not automatically read .env; set the process environment or use node --env-file=.env server.mjs --public. Docker Compose reads .env for substitution.

Start: node server.mjs --public
Health: GET /health should return ok:true plus rooms/players counts.

Forward /api/*, /health and static paths to this same service. Preserve the original public Host and Authorization headers. POST Origin must match Host; rewriting Host to an internal address will reject browser/launcher requests. Disable idle sleep. When using SSE, allow long-lived /api/events responses and disable proxy buffering. Polling avoids this SSE requirement.

The 100-room limit is a guard, NOT a measured capacity promise. Load-test expected usage and monitor CPU, memory, tick delay and API failures. The join limiter uses the socket peer IP: behind a proxy its 30 joins/minute can apply globally. Revise/test trusted-proxy-aware limiting before promising higher join volume.

## Docker deployment
Copy .env.example to .env and replace PUBLIC_URL with your real HTTPS origin:

    docker compose up -d --build
    docker compose logs --tail=100 pinebound
    curl -f http://127.0.0.1:3000/health

Compose binds port 3000 to host loopback. Run an HTTPS reverse proxy on the host; Caddyfile.example gives a minimal configuration. Replace its example hostname, configure DNS and allow TCP 80/443. These files do not install a proxy, register a domain or purchase hosting.

For managed containers: build Dockerfile, route the platform's HTTPS endpoint to PORT=3000, set PUBLIC_URL and /health, and use exactly one always-on replica. The Compose loopback binding is for a self-managed host, not the managed service definition.

Restart policy recovers exited containers. Docker marking a running container unhealthy does not itself restart it; configure monitoring. Node/Docker/platform deployment was not tested on a public host in this export task.

## Connect the Siren Pines launcher
1. Deploy and verify the permanent HTTPS server first, including /health and the root game page from an outside network.
2. Existing players: close Pinebound, open Server settings in the launcher, save the permanent HTTPS origin and Check connection. Everyone must use the SAME origin.
3. Next launcher release: set resources/app/pinebound-defaults.json serverURL to that origin. Existing user overrides in Pinebound/server.json take precedence: those users must change Server settings, or a separately implemented migration is required. Changing only the bundled default will not migrate saved temporary addresses.
4. Keep the launcher's bundled frontend compatible with this server/world version 0.9.1. Test two actual players: create/join the same room, confirm both names, move/drive, and leave. Publish the launcher update only after the shared server and verified launcher download work.

The launcher serves client assets locally but sends /api/* and /health to this shared host. Do not run one backend per player. The old temporary trycloudflare address is not permanent hosting.

## Implemented limits and recovery
A permanent address does NOT mean persistent rooms. Restarts/redeploys/rollbacks end rooms and sessions; players must create fresh rooms. Persistent world saves and multi-server coordination are not implemented. There are no application account credentials included. Treat session tokens as secrets and avoid logging complete /api/events query strings. Room codes are invitations, not account authentication.

Keep previous source/image for rollback and back up assets/configuration. No world database exists to back up. Hosting credentials belong outside source control. Historical README/UPDATE notes may reference old temporary hosting; this file is the current deployment handoff. EXPORT-VALIDATION.txt records checks actually completed.
