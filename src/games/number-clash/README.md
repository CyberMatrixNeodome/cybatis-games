# number-clash

Placeholder directory for the "number-clash" game client.

This game is registered in `src/scripts/games-config.js` and already
routes correctly from the home page (`/games/number-clash`), but no real game
logic lives here yet — the route currently renders a "coming soon" view.

## Adding the real game

1. Build the game's UI/logic as its own module (plain JS, or a small
   framework if the game genuinely needs one).
2. Export an `init(container)` function that mounts the game into a
   DOM node.
3. Update `main.js`'s `renderGameView` to import and call that
   `init()` instead of showing the placeholder, once this game is
   ready to ship.
4. Flip this game's `status` in `games-config.js` from
   `"COMING_SOON"` to `"ONLINE"`.
5. If the game needs server-side state (e.g. multiplayer turns),
   add the corresponding endpoint under `worker/` — see
   `worker/index.js` for the placeholder API structure.
