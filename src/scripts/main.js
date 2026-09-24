import { GAMES, NETWORK_STATUS_DEFAULT } from "./games-config.js";
import { createGameCard } from "../components/game-card.js";

const els = {
  gameGrid: document.getElementById("game-grid"),
  playNow: document.getElementById("play-now-btn"),
  statusDot: document.getElementById("status-dot"),
  statusActive: document.getElementById("status-active"),
  statusPlayers: document.getElementById("status-players"),
  statusAvailable: document.getElementById("status-available"),
  navButtons: document.querySelectorAll("[data-nav]"),
  main: document.getElementById("app-main"),
  homeSections: document.getElementById("home-sections"),
};

/**
 * Extremely small hash-based router. Cybatis Games is intended to
 * run as a single-page app behind the Cloudflare Worker, so this
 * avoids a full-page reload when the user selects a game.
 *
 * Routes:
 *   #/            -> home (game selection)
 *   #/games/<id>  -> game view (placeholder until the game ships)
 */
function navigate(route) {
  const hash = route ? `#${route}` : "#/";
  if (window.location.hash === hash) {
    render();
  } else {
    window.location.hash = hash;
  }
}

function render() {
  const hash = window.location.hash || "#/";
  const match = hash.match(/^#\/games\/([a-z0-9-]+)$/);

  if (match) {
    renderGameView(match[1]);
  } else {
    renderHome();
  }
}

function renderHome() {
  els.homeSections.style.display = "";
  clearGameView();
  renderGameGrid();
  setNavActive("home");
}

function renderGameView(gameId) {
  els.homeSections.style.display = "none";
  clearGameView();

  const game = GAMES.find((g) => g.id === gameId);

  const view = document.createElement("section");
  view.className = "game-view hud-panel";
  view.id = "game-view";

  if (!game) {
    view.innerHTML = `
      <div class="game-view__back" id="back-link">&larr; Back to Minigames</div>
      <h2 class="game-view__title">Unknown Game</h2>
      <p class="game-view__desc">No minigame is registered with the id "${escapeHtml(gameId)}".</p>
    `;
  } else {
    view.innerHTML = `
      <div class="game-view__back" id="back-link">&larr; Back to Minigames</div>
      <h2 class="game-view__title">${escapeHtml(game.name)}</h2>
      <div class="game-view__status">COMING SOON &mdash; GAME CLIENT NOT YET IMPLEMENTED</div>
      <p class="game-view__desc">${escapeHtml(game.description)}<br><br>
        This route (${escapeHtml(game.route)}) is wired up and ready — drop the
        real game client for "${escapeHtml(game.id)}" into
        <code>src/games/${escapeHtml(game.id)}/</code> and load it from here.
      </p>
    `;
  }

  els.main.appendChild(view);
  document.getElementById("back-link").addEventListener("click", () => navigate("/"));
}

function clearGameView() {
  const existing = document.getElementById("game-view");
  if (existing) existing.remove();
}

function renderGameGrid() {
  els.gameGrid.innerHTML = "";
  GAMES.forEach((game) => {
    const card = createGameCard(game, (route) => {
      if (route) navigate(route);
    });
    els.gameGrid.appendChild(card);
  });
}

function setNavActive(name) {
  els.navButtons.forEach((btn) => {
    if (btn.dataset.nav === name) {
      btn.setAttribute("aria-current", "page");
    } else {
      btn.removeAttribute("aria-current");
    }
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Renders the network status strip from static defaults.
 * Replace this with a real fetch("/api/game-status") call once
 * the Worker implements that endpoint — see worker/index.js.
 * Intentionally NOT faking live numbers in the meantime.
 */
function renderNetworkStatus(stats) {
  els.statusDot.textContent = stats.online ? "● ONLINE" : "● OFFLINE";
  els.statusDot.style.color = stats.online ? "var(--green)" : "var(--magenta)";
  els.statusActive.textContent = stats.activeGames;
  els.statusPlayers.textContent = stats.playersOnline;
  els.statusAvailable.textContent = stats.gamesAvailable;
}

async function loadNetworkStatus() {
  try {
    const res = await fetch("/api/game-status");
    if (!res.ok) throw new Error("status endpoint not available yet");
    const data = await res.json();
    renderNetworkStatus(data);
  } catch {
    // Endpoint isn't implemented yet — fall back to static defaults
    // rather than inventing numbers.
    renderNetworkStatus(NETWORK_STATUS_DEFAULT);
  }
}

function wireNav() {
  els.navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.nav;
      if (target === "home") navigate("/");
      // "games", "leaderboards", "profile", "settings" are placeholders
      // until those sections/routes exist — intentionally no-op for now.
    });
  });

  els.playNow.addEventListener("click", () => {
    document.getElementById("games-section").scrollIntoView({ behavior: "smooth" });
  });

  window.addEventListener("hashchange", render);
}

function init() {
  wireNav();
  render();
  loadNetworkStatus();
}

init();
