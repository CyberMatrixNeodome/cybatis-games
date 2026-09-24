/**
 * games-config.js
 * ------------------------------------------------------------------
 * Central, data-driven registry of Cybatis Games minigames.
 *
 * The home page renders its game grid entirely from this array —
 * to add a new game, add an object here. No changes to index.html
 * or main.js are required for a new card to appear.
 *
 * Fields:
 *   id          - unique slug, also used in the route (/games/<id>)
 *   name        - display name
 *   description - one-line description shown on the card
 *   players     - human-readable player count range, e.g. "2-10"
 *   status      - "ONLINE" | "OFFLINE" | "COMING_SOON"
 *                 This describes whether the game is playable yet.
 *                 It is currently set by hand below. Once the Worker
 *                 exposes GET /api/game-status, this should be
 *                 replaced by that live response instead of the
 *                 hard-coded values here (see loadLiveStatus below).
 *   route       - client-side route the Play button navigates to
 *   icon        - single glyph/emoji placeholder for the card art
 *                 (swap for a real asset in assets/icons/ later)
 */

export const GAMES = [
  {
    id: "cyber-roulette",
    name: "Cyber Roulette",
    description: "A fast multiplayer chance-based game.",
    players: "2-10",
    status: "COMING_SOON",
    route: "/games/cyber-roulette",
    icon: "◎",
  },
  {
    id: "mystery-wheel",
    name: "Mystery Wheel",
    description: "Spin the wheel and discover the outcome.",
    players: "1-10",
    status: "COMING_SOON",
    route: "/games/mystery-wheel",
    icon: "◈",
  },
  {
    id: "reaction-test",
    name: "Reaction Test",
    description: "Test how quickly you can react.",
    players: "1-10",
    status: "COMING_SOON",
    route: "/games/reaction-test",
    icon: "◇",
  },
  {
    id: "number-clash",
    name: "Number Clash",
    description: "Compete against other players using numbers and strategy.",
    players: "2-10",
    status: "COMING_SOON",
    route: "/games/number-clash",
    icon: "◆",
  },
  {
    id: "coming-soon",
    name: "Coming Soon",
    description: "Reserved space for future Cybatis Games.",
    players: "—",
    status: "COMING_SOON",
    route: null,
    icon: "▢",
  },
];

/**
 * Placeholder network stats shown in the system status panel.
 * These are intentionally static zeros/defaults — they must NOT be
 * fabricated to look "live". Once worker/index.js implements
 * /api/game-status, fetchNetworkStatus() in main.js should replace
 * this object with the real response.
 */
export const NETWORK_STATUS_DEFAULT = {
  online: true,
  activeGames: 0,
  playersOnline: 0,
  gamesAvailable: GAMES.filter((g) => g.route).length,
};
