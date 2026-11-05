# Pinebound multiplayer server

Complete Pinebound 0.9.1 server and optimized game data for the Siren Pines launcher.

The server uses Node's built-in libraries: no external npm packages or keys are required. The large public assets and regression tests are in game-data.tar.part001 onward to fit browser upload limits. Keep EVERY part plus game-data-manifest.json. restore-data.mjs checks SHA-256 hashes and extracts the original public/ and test/ directories. The parts are real game data, not download links.

## Run
Requires Node >=22 and tar (included in the Docker image and modern Windows).

    node restore-data.mjs
    node server.mjs --public

Or use npm start, which restores automatically. npm test restores then runs tests.

## Deploy
Use the supplied Dockerfile as the hosting platform's Docker build. It restores all game data during build and starts the polling multiplayer server on PORT (3000 by default). No npm install or build command is needed. For a native Node deployment use build command node restore-data.mjs and start command node server.mjs --public.

Set PUBLIC_URL to the permanent HTTPS origin and keep exactly ONE always-on instance. All launcher players must use the same server URL. See DEPLOYMENT.md for environment, health, proxy, launcher migration and operational details. Hosting is not provisioned merely by uploading this repository.

Rooms and sessions are in memory and end on restart. Multi-instance scaling and persistent worlds are not implemented. Load-test capacity before wide release. Read EXPORT-VALIDATION.txt for known test and deployment verification limits.

Bundled default changes do not replace existing saved launcher server overrides; those players must change Server settings or receive a separate migration.

Asset inventories and third-party notes are retained. No extra redistribution rights are granted by this repository.
