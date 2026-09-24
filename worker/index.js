/**
 * Cybatis Games — Cloudflare Worker entry point
 * ------------------------------------------------------------------
 * Responsibilities:
 *   1. Serve the static front-end (src/) via the Workers "assets"
 *      binding configured in wrangler.toml.
 *   2. Host the API surface under /api/* — currently placeholders
 *      that return honest "not implemented yet" responses rather
 *      than fabricated data, per project rules.
 *
 * As real functionality is added (auth, matchmaking, persistence),
 * implement the corresponding handler below and wire it up to a
 * real data store (KV, D1, Durable Objects, etc.) via bindings in
 * wrangler.toml + environment variables — never hard-coded secrets.
 */

const routes = {
  "/api/games": handleGames,
  "/api/game-status": handleGameStatus,
  "/api/leaderboard": handleLeaderboard,
  "/api/profile": handleProfile,
  "/api/session": handleSession,
};

export default {
  /**
   * @param {Request} request
   * @param {{ ASSETS: Fetcher }} env
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      const handler = routes[url.pathname];
      if (handler) {
        return handler(request, env, ctx);
      }
      return json({ error: "Not found" }, 404);
    }

    // With run_worker_first = ["/api/*"] in wrangler.toml, this Worker
    // only actually runs for /api/* in normal operation — everything
    // else (index.html, styles, scripts, game routes handled
    // client-side via the SPA's hash router) is served directly from
    // static assets without ever reaching this function. This
    // ASSETS.fetch() call is kept as a safety net in case that
    // routing config changes.
    return env.ASSETS.fetch(request);
  },
};

/** GET /api/games — list configured minigames.
 * NOTE: the front-end currently renders games from
 * src/scripts/games-config.js directly. This endpoint is a
 * placeholder for when that config should be served/edited
 * server-side instead (e.g. from KV or D1). */
async function handleGames() {
  return json(
    { implemented: false, message: "Game list is currently client-side only. See src/scripts/games-config.js." },
    501
  );
}

/** GET /api/game-status — live network/game status.
 * The front-end already calls this endpoint and falls back to
 * static defaults on failure — implement this to return real
 * counts (e.g. from Durable Objects tracking active sessions). */
async function handleGameStatus() {
  return json(
    { implemented: false, message: "Live game/player counts are not wired up yet." },
    501
  );
}

/** GET /api/leaderboard — per-game leaderboards. Placeholder. */
async function handleLeaderboard() {
  return json({ implemented: false, message: "Leaderboards are not implemented yet." }, 501);
}

/** GET/POST /api/profile — user profile data. Placeholder.
 * Will need auth (e.g. Discord OAuth) before this can return
 * anything real — do not stub in fake user data. */
async function handleProfile() {
  return json({ implemented: false, message: "Profiles are not implemented yet." }, 501);
}

/** POST /api/session — create/validate a play session (e.g. for a
 * Discord Activity launch). Placeholder. */
async function handleSession() {
  return json({ implemented: false, message: "Session handling is not implemented yet." }, 501);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
