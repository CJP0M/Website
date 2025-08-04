const API_BASE = "https://website-1kj4.onrender.com";

const button = document.getElementById("mozzarella-button");
const countryText = document.getElementById("your-country");
const countryClicks = document.getElementById("country-clicks");
const globalClicks = document.getElementById("global-clicks");
const leaderboardList = document.getElementById("leaderboard-list");

function updateStats(data) {
  countryText.textContent = data.country;
  countryClicks.textContent = data.yourCountryClicks;
  globalClicks.textContent = data.globalClicks;
}

async function loadLeaderboard() {
  try {
    const res = await fetch(`${API_BASE}/top100`);
    const top = await res.json();
    leaderboardList.innerHTML = "";
    top.forEach((entry, index) => {
      const li = document.createElement("li");
      li.textContent = `#${index + 1} ${entry.country}: ${entry.clicks} clicks`;
      leaderboardList.appendChild(li);
    });
  } catch (err) {
    console.error("Leaderboard load failed:", err);
  }
}

async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await res.json();
    updateStats(data);
  } catch (err) {
    console.error("Failed to load stats:", err);
  }
}

async function sendClick() {
  try {
    const res = await fetch(`${API_BASE}/click`, {
      method: "POST",
    });
    const data = await res.json();
    updateStats(data);
    loadLeaderboard();
  } catch (err) {
    console.error("Click failed:", err);
  }
}

button.addEventListener("click", sendClick);
loadStats();
loadLeaderboard();
