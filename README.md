# Cybatis Games — Minigame Network

The home page / game-selection portal for **Cybatis Games**, the gaming
division of Cybatis Systems. Users arrive here after launching Cybatis
Games from Discord, pick a minigame, and get routed into it.

```
Discord → Cybatis Games → Minigames Home Page → Game Interface
```

This is a lightweight, dependency-free front-end (no framework) served
by a Cloudflare Worker, structured to be developed and deployed the
same way as the existing Cybatis Systems project.

## Folder structure

```
cybatis-games/
│
├── src/
│   ├── index.html          # Home page shell
│   ├── styles/main.css     # Cyberpunk theme (cyan/blue/purple/magenta)
│   ├── scripts/
│   │   ├── main.js         # Rendering, routing, nav wiring
│   │   └── games-config.js # Game data — the single source of truth
│   ├── components/
│   │   └── game-card.js    # Reusable game-card builder
│   └── games/
│       ├── cyber-roulette/
│       ├── mystery-wheel/
│       ├── reaction-test/
│       └── number-clash/   # One folder per game, currently placeholders
│
├── assets/
│   ├── images/
│   └── icons/
│
├── worker/
│   └── index.js            # Cloudflare Worker: serves src/, hosts /api/*
│
├── package.json
├── wrangler.toml
├── .env.example
└── README.md
```

## How it works

- `src/scripts/games-config.js` defines every minigame as data: id,
  name, description, player count, status, and route. The home page
  builds its game grid entirely from this array — **adding a new
  game never requires touching `index.html` or the rendering code.**
- `main.js` is a tiny hash-based router (`#/`, `#/games/<id>`) so
  selecting a game doesn't reload the page.
- Games that don't have real logic yet render a "coming soon" view
  instead of pretending to be playable — see `src/games/<id>/README.md`
  in each game folder for how to plug in the real client once it's built.
- The network status strip (`Active Games`, `Players Online`, etc.)
  shows static placeholder values and calls `/api/game-status` for
  live data. Until that endpoint is implemented, it falls back to the
  placeholders rather than inventing numbers.

## Local development

Requires Node.js 18 or later (Wrangler v4's minimum supported version).

```bash
npm install
npm run dev
```

This runs `wrangler dev`, which serves `src/` as static assets and
runs `worker/index.js` for anything under `/api/*`, matching how it
behaves once deployed.

## Deploying to Cloudflare Workers

```bash
npm run deploy
```

This runs `wrangler deploy`, which pushes both the static assets
(`src/`) and the Worker script (`worker/index.js`) using the
configuration in `wrangler.toml`.

### Required environment variables

None are required yet. `.env.example` lists variables reserved for
future Discord Activity integration (`DISCORD_CLIENT_ID`,
`DISCORD_CLIENT_SECRET`). For production, set secrets with:

```bash
wrangler secret put DISCORD_CLIENT_SECRET
```

Never commit real secrets — `.env` is git-ignored, and
`worker/index.js` never hard-codes credentials.

## Adding a new minigame

1. Add an entry to the `GAMES` array in `src/scripts/games-config.js`
   (id, name, description, players, status, route, icon). The card
   grid picks it up automatically.
2. Create `src/games/<id>/` for the game's own client code.
3. Once the game is playable, update `main.js`'s `renderGameView` to
   load the real client instead of the placeholder, and flip the
   game's `status` to `"ONLINE"`.
4. If the game needs server state (multiplayer turns, scores), add a
   handler in `worker/index.js` under `/api/*` and a real storage
   binding (KV / D1 / Durable Objects) in `wrangler.toml`.

## GitHub → Cloudflare deployment

This repo is structured to connect to Cloudflare the same way as the
existing Cybatis Systems project: push to the connected branch (or run
`wrangler deploy` in CI) and Cloudflare builds and serves `src/` +
`worker/index.js` per `wrangler.toml`. No project-specific CI config is
included here — wire it up the same way the Cybatis Systems repo's
GitHub → Cloudflare pipeline is configured.

## What's intentionally not implemented yet

Per project rules, this build does not fake functionality that
doesn't exist:

- No games have real client logic — all four route correctly and show
  an honest "coming soon" state.
- `/api/games`, `/api/game-status`, `/api/leaderboard`, `/api/profile`,
  and `/api/session` all exist as routed placeholders returning
  `501 Not Implemented` with a clear message, not fabricated data.
- Discord Activity integration is not wired in — the app doesn't
  depend on any Discord-specific API, so it works as a normal web app
  today and can gain Discord-specific behavior later without a rebuild.
