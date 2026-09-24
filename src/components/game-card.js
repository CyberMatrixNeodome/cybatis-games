/**
 * game-card.js
 * ------------------------------------------------------------------
 * Builds a single game card DOM node from a game config entry.
 * Kept framework-free on purpose (no React/Vue) to keep the app
 * lightweight, per project requirements.
 */

/**
 * @param {object} game - one entry from GAMES in games-config.js
 * @param {(routeOrNull: string|null, game: object) => void} onPlay
 * @returns {HTMLElement}
 */
export function createGameCard(game, onPlay) {
  const card = document.createElement("article");
  card.className = "game-card";
  card.dataset.status = game.status;
  card.dataset.gameId = game.id;

  const statusLabel = statusText(game.status);

  card.innerHTML = `
    <div class="game-card__glow" aria-hidden="true"></div>
    <div class="game-card__icon">${game.icon}</div>
    <div class="game-card__body">
      <h3 class="game-card__name">${escapeHtml(game.name)}</h3>
      <p class="game-card__desc">${escapeHtml(game.description)}</p>
      <div class="game-card__meta">
        <span class="game-card__players">Players: ${escapeHtml(game.players)}</span>
        <span class="game-card__status game-card__status--${game.status.toLowerCase()}">${statusLabel}</span>
      </div>
    </div>
    <button class="game-card__play" type="button" ${game.route ? "" : "disabled"}>
      ${game.route ? "Play" : "Coming Soon"}
    </button>
  `;

  const playBtn = card.querySelector(".game-card__play");
  playBtn.addEventListener("click", () => onPlay(game.route, game));

  return card;
}

function statusText(status) {
  switch (status) {
    case "ONLINE":
      return "● ONLINE";
    case "OFFLINE":
      return "● OFFLINE";
    default:
      return "COMING SOON";
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
