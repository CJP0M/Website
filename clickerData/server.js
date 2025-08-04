const express = require("express");
const fs = require("fs");
const geoip = require("geoip-lite");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

let clicks = {};

try {
  clicks = JSON.parse(fs.readFileSync("clicks.json", "utf8"));
} catch {
  clicks = {};
}

app.use(cors());
app.use(express.json());

app.post("/click", (req, res) => {
  const countryFromClient = req.body.country;
  let country = "US";

  if (countryFromClient && typeof countryFromClient === "string") {
    country = countryFromClient;
  } else {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);
    if (geo?.country) country = geo.country;
  }

  clicks[country] = (clicks[country] || 0) + 1;
  fs.writeFileSync("clicks.json", JSON.stringify(clicks, null, 2));

  const totalClicks = Object.values(clicks).reduce((a, b) => a + b, 0);

  res.json({
    country,
    yourCountryClicks: clicks[country],
    globalClicks: totalClicks,
  });
});

app.get("/top100", (req, res) => {
  const sorted = Object.entries(clicks)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100)
    .map(([country, clicks]) => ({ country, clicks }));

  res.json(sorted);
});

app.get("/stats", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  const geo = geoip.lookup(ip);
  const country = geo?.country || "US";

  const yourClicks = clicks[country] || 0;
  const globalClicks = Object.values(clicks).reduce((a, b) => a + b, 0);

  res.json({
    country,
    yourCountryClicks: yourClicks,
    globalClicks,
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
