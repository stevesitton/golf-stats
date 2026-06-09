# ⛳ Golf Majors Statistics 2016–2025

A clean, static landing page showcasing a decade of men's golf major championship data — winners, scores, venues, and records across all four majors.

## Live Site

> Hosted on cPanel: [golf-stats.stevesitton.com](https://golf-stats.stevesitton.com)

---

## What's Covered

**10 years of data (2016–2025) across all four men's majors:**

| Major | Held | Venue |
|---|---|---|
| 🟡 The Masters | April | Augusta National GC, Georgia |
| 🔵 PGA Championship | May | Rotates |
| 🩵 US Open | June | Rotates |
| 🟢 The Open Championship | July | Rotates (British Isles links) |

**39 tournaments** — including the 2020 Open Championship which was cancelled due to COVID-19.

---

## Features

- **Summary stats** — headline numbers at a glance (total majors, most wins, best/worst winning scores)
- **All Results tab** — full chronological table with colour-coded tournament pills, winner, country, score, and venue
- **By Major tab** — each of the four majors broken out into its own table
- **Leaderboard tab** — most wins by player, wins by country, lowest winning scores, and notable records & firsts

### Key Stats Highlighted

- **Brooks Koepka** — 5 majors in the period (US Open ×2, PGA ×3)
- **Scottie Scheffler** — 4 majors (Masters ×2, PGA, The Open)
- **Dustin Johnson 2020** — Masters record of −20, five shots clear
- **Phil Mickelson 2021** — oldest major winner ever, aged 50
- **Hideki Matsuyama 2021** — first Japanese-born Masters champion
- **Rory McIlroy 2025** — completes Career Grand Slam at The Masters

---

## Tech Stack

- Pure **HTML / CSS / JavaScript** — no frameworks, no build step
- Single `index.html` file — fully self-contained
- Responsive layout using CSS Grid and media queries
- Zero dependencies — opens directly in any browser

---

## Running Locally

Just open the file in a browser — no server required:

```bash
open index.html
```

Or serve it locally with any static server:

```bash
npx serve .
```

---

## Data Sources

- [The Masters — masters.com](https://www.masters.com)
- [PGA Championship — pgachampionship.com](https://www.pgachampionship.com)
- [US Open — usopen.com](https://www.usopen.com)
- [The Open Championship — theopen.com](https://www.theopen.com)
- [PGA Tour results](https://www.pgatour.com)
- [Golf News Net — winners by year](https://thegolfnewsnet.com/list-of-mens-golf-major-championship-winners-by-year/)
