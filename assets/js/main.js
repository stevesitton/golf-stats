/* ============================================================
   Golf Majors Statistics — main.js
   Fetches data/majors.json and renders all three tab views.
   ============================================================ */

const TOURNAMENT_ORDER = ['masters', 'pga', 'usopen', 'theopen'];

// ── Bootstrap ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  loadData();
});

// ── Tabs ─────────────────────────────────────────────────────
function initTabs() {
  const buttons = document.querySelectorAll('.tabs__btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      buttons.forEach(b => {
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });

      document.querySelectorAll('.tabs__panel').forEach(panel => {
        panel.setAttribute('aria-hidden', panel.id !== `panel-${target}` ? 'true' : 'false');
      });
    });
  });
}

// ── Data loading ─────────────────────────────────────────────
async function loadData() {
  try {
    const res = await fetch('./data/majors.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    renderSummaryStats(data);
    renderAllResults(data);
    renderByMajor(data);
    renderLeaderboard(data);
  } catch (err) {
    console.error('Failed to load majors data:', err);
    document.querySelectorAll('.state-loading').forEach(el => {
      el.className = 'state-error';
      el.textContent = 'Could not load data. Please run this site via a local server (e.g. npx serve .).';
    });
  }
}

// ── Helpers ──────────────────────────────────────────────────
function fmtScore(scoreToPar) {
  if (scoreToPar === 0) return { text: 'E', cls: 'score--even' };
  if (scoreToPar > 0)  return { text: `+${scoreToPar}`, cls: 'score--over' };
  return { text: `${scoreToPar}`, cls: 'score--under' };
}

function scoreCell(scoreToPar) {
  const { text, cls } = fmtScore(scoreToPar);
  return `<td class="center"><span class="score ${cls}">${text}</span></td>`;
}

function tournamentLogo(key, tournaments) {
  const fileMap = { masters: 'masters', pga: 'pga', usopen: 'usopen', theopen: 'the-open' };
  const t = tournaments[key];
  return `<img src="assets/images/logos/${fileMap[key]}.svg"
               alt="${t.name}"
               class="tournament-logo"
               loading="lazy">`;
}

function winnerCell(result) {
  return `<td>
    <span class="winner__name">${result.winner}</span>${result.playoff ? ' <sup title="Won in playoff">*</sup>' : ''}
    <br><span class="winner__country">${result.flag} ${result.country}</span>
  </td>`;
}

// ── Summary stats ─────────────────────────────────────────────
function renderSummaryStats(data) {
  const played   = data.results.filter(r => !r.cancelled);
  const winners  = [...new Set(played.map(r => r.winner))];
  const lowest   = played.slice().sort((a, b) => a.scoreToPar - b.scoreToPar)[0];
  const highest  = played.slice().sort((a, b) => b.scoreToPar - a.scoreToPar)[0];

  // Top winner by count
  const counts = {};
  played.forEach(r => { counts[r.winner] = (counts[r.winner] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [topPlayer, topWins] = sorted[0];

  document.getElementById('stat-played').textContent   = played.length;
  document.getElementById('stat-winners').textContent  = winners.length;
  document.getElementById('stat-top-name').textContent = topPlayer;
  document.getElementById('stat-top-wins').textContent = topWins;
  document.getElementById('stat-lowest').textContent   = fmtScore(lowest.scoreToPar).text;
  document.getElementById('stat-highest').textContent  = fmtScore(highest.scoreToPar).text;
  document.getElementById('stat-cancelled').textContent = data.results.filter(r => r.cancelled).length;
}

// ── All Results tab ───────────────────────────────────────────
function renderAllResults(data) {
  const { results, tournaments } = data;

  // Sort: year desc, then by canonical tournament order within year
  const sorted = [...results].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return TOURNAMENT_ORDER.indexOf(a.tournament) - TOURNAMENT_ORDER.indexOf(b.tournament);
  });

  const rows = sorted.map(r => {
    if (r.cancelled) {
      return `<tr class="row--cancelled">
        <td><span class="year-badge">${r.year}</span></td>
        <td>${tournamentLogo(r.tournament, tournaments)}</td>
        <td colspan="4">Cancelled — ${r.cancellationReason}</td>
      </tr>`;
    }
    return `<tr>
      <td><span class="year-badge">${r.year}</span></td>
      <td>${tournamentLogo(r.tournament, tournaments)}</td>
      ${winnerCell(r)}
      ${scoreCell(r.scoreToPar)}
      <td>${r.venue}</td>
      <td>${r.location}</td>
    </tr>`;
  }).join('');

  document.getElementById('all-results-body').innerHTML = rows;
  document.getElementById('panel-all').querySelector('.state-loading')?.remove();
}

// ── By Major tab ──────────────────────────────────────────────
function renderByMajor(data) {
  const { results, tournaments } = data;
  const container = document.getElementById('by-major-container');
  container.innerHTML = '';

  const headerClass = { masters: 'masters', pga: 'pga', usopen: 'usopen', theopen: 'theopen' };

  TOURNAMENT_ORDER.forEach(key => {
    const t = tournaments[key];
    const tResults = results
      .filter(r => r.tournament === key)
      .sort((a, b) => b.year - a.year);

    const venueNote = t.fixedVenue
      ? `${t.fixedVenue} · ${t.fixedLocation} · Par 72`
      : `Rotates venues · Played in ${t.month}`;

    const rows = tResults.map(r => {
      if (r.cancelled) {
        return `<tr class="row--cancelled">
          <td>${r.year}</td>
          <td colspan="4">Cancelled — ${r.cancellationReason}</td>
        </tr>`;
      }
      return `<tr>
        <td>${r.year}</td>
        ${winnerCell(r)}
        ${scoreCell(r.scoreToPar)}
        <td>${r.venue || t.fixedVenue}</td>
        <td>${r.location || t.fixedLocation}</td>
      </tr>`;
    }).join('');

    container.insertAdjacentHTML('beforeend', `
      <section class="tournament-block" aria-label="${t.name}">
        <div class="tournament-block__header tournament-block__header--${headerClass[key]}">
          <img src="assets/images/logos/${{ masters:'masters', pga:'pga', usopen:'usopen', theopen:'the-open' }[key]}.svg"
               alt="${t.name}" class="tournament-block__logo">
          <div class="tournament-block__info">
            <div class="tournament-block__name">${t.name}</div>
            <div class="tournament-block__meta">${venueNote}</div>
          </div>
        </div>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr>
              <th>Year</th>
              <th>Winner</th>
              <th class="center">Score</th>
              <th>Venue</th>
              <th>Location</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <p style="font-size:0.72rem;color:var(--colour-muted);padding:0.35rem 0.75rem;font-style:italic">* Won in playoff</p>
      </section>
    `);
  });
}

// ── Leaderboard tab ───────────────────────────────────────────
function renderLeaderboard(data) {
  const played = data.results.filter(r => !r.cancelled);

  renderMostWins(played);
  renderWinsByCountry(played);
  renderLowestScores(played, data.tournaments);
  renderRecords(data.records, data.tournaments);
}

function renderMostWins(played) {
  const counts = {};
  const details = {};

  played.forEach(r => {
    counts[r.winner] = (counts[r.winner] || 0) + 1;
    if (!details[r.winner]) details[r.winner] = [];
    details[r.winner].push(r.tournament);
  });

  const tournamentAbbr = { masters: 'Masters', pga: 'PGA', usopen: 'US Open', theopen: 'The Open' };

  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const rows = top.map(([name, count]) => {
    const majors = details[name].map(t => tournamentAbbr[t]).join(', ');
    return `<div class="leader-entry">
      <div class="leader-entry__text">
        <div class="leader-entry__name">${name}</div>
        <div class="leader-entry__detail">${majors}</div>
      </div>
      <span class="leader-entry__badge">${count}</span>
    </div>`;
  }).join('');

  document.getElementById('leaderboard-most-wins').innerHTML = rows;
}

function renderWinsByCountry(played) {
  const counts = {};
  const flags  = {};

  played.forEach(r => {
    counts[r.country] = (counts[r.country] || 0) + 1;
    flags[r.country] = r.flag;
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  const rows = sorted.map(([country, count]) => {
    return `<div class="leader-entry">
      <div class="leader-entry__text">
        <div class="leader-entry__name">${flags[country]} ${country}</div>
      </div>
      <span class="leader-entry__badge">${count}</span>
    </div>`;
  }).join('');

  document.getElementById('leaderboard-by-country').innerHTML = rows;
}

function renderLowestScores(played, tournaments) {
  const sorted = played.slice().sort((a, b) => a.scoreToPar - b.scoreToPar).slice(0, 6);

  const tournamentNames = { masters: 'Masters', pga: 'PGA Championship', usopen: 'US Open', theopen: 'The Open' };

  const rows = sorted.map(r => {
    const { text, cls } = fmtScore(r.scoreToPar);
    return `<div class="leader-entry">
      <div class="leader-entry__text">
        <div class="leader-entry__name">${r.winner}</div>
        <div class="leader-entry__detail">${tournamentNames[r.tournament]} ${r.year} · ${r.venue}</div>
      </div>
      <span class="score ${cls}" style="font-size:1rem">${text}</span>
    </div>`;
  }).join('');

  document.getElementById('leaderboard-lowest-scores').innerHTML = rows;
}

function renderRecords(records) {
  const rows = records.map(rec => `
    <div class="leader-entry" style="align-items:flex-start">
      <div class="leader-entry__text">
        <div class="leader-entry__name">${rec.title} <span style="color:var(--colour-muted);font-weight:normal;font-size:0.8rem">${rec.year}</span></div>
        <div class="leader-entry__detail">${rec.detail}</div>
      </div>
    </div>
  `).join('');

  document.getElementById('leaderboard-records').innerHTML = rows;
}
