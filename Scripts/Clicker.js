const button = document.getElementById("mozzarella-button");
const countryText = document.getElementById("your-country");
const countryClicks = document.getElementById("country-clicks");
const globalClicks = document.getElementById("global-clicks");
const leaderboardList = document.getElementById("leaderboard-list");

async function sendClick() {
  try {
    const res = await fetch("http://localhost:3000/click", {
      method: "POST",
    });
    const data = await res.json();
    updateStats(data);
    loadLeaderboard();
  } catch (err) {
    console.error("Click failed:", err);
  }
}

function updateStats(data) {
  countryText.textContent = data.country;
  countryClicks.textContent = data.yourCountryClicks;
  globalClicks.textContent = data.globalClicks;
}

async function loadLeaderboard() {
  try {
    const res = await fetch("http://localhost:3000/top100");
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

button.addEventListener("click", () => {
  sendClick();
});

loadLeaderboard();
