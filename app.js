/* ══════════════════════════════════════════════════════════
   CRICBUZZ WEB — Mock Data + App Logic
   ══════════════════════════════════════════════════════════ */

/* ─── MOCK DATA ───────────────────────────────────────────── */
const TEAMS = {
  IND: { name: 'India',          abbr: 'IND', color: '#0a4cff', flag: '🇮🇳' },
  AUS: { name: 'Australia',      abbr: 'AUS', color: '#ffcc00', flag: '🇦🇺' },
 ENG: { name: 'England', abbr: 'ENG', color: '#c8102e', flag: '🏴' },
  PAK: { name: 'Pakistan',       abbr: 'PAK', color: '#01411c', flag: '🇵🇰' },
  SA:  { name: 'South Africa',   abbr: 'SA',  color: '#007749', flag: '🇿🇦' },
  NZ:  { name: 'New Zealand',    abbr: 'NZ',  color: '#000000', flag: '🇳🇿' },
  WI:  { name: 'West Indies',    abbr: 'WI',  color: '#7b0041', flag: '🏝️' },
  SL:  { name: 'Sri Lanka',      abbr: 'SL',  color: '#00539c', flag: '🇱🇰' },
  BAN: { name: 'Bangladesh',     abbr: 'BAN', color: '#006a4e', flag: '🇧🇩' },
  AFG: { name: 'Afghanistan',    abbr: 'AFG', color: '#0066cc', flag: '🇦🇫' },
  MI:  { name: 'Mumbai Indians', abbr: 'MI',  color: '#004ba0', flag: '🔵' },
  CSK: { name: 'Chennai Super Kings', abbr: 'CSK', color: '#f9cd05', flag: '🟡' },
  RCB: { name: 'Royal Challengers',  abbr: 'RCB', color: '#d11a2a', flag: '🔴' },
  KKR: { name: 'Kolkata Knight Riders', abbr: 'KKR', color: '#3a225d', flag: '🟣' }
};

const MATCHES = [
  {
    id: 'm1',
    status: 'live',
    series: 'World Cup 2026 · Super 8',
    venue: 'Wankhede Stadium, Mumbai',
    format: 'ODI',
    teamA: { code: 'IND', runs: 287, wkts: 4, overs: '42.3' },
    teamB: { code: 'AUS', runs: 0,   wkts: 0, overs: '' },
    statusText: 'India need 42 runs from 45 balls',
    lastBall: '4'
  },
  {
    id: 'm2',
    status: 'live',
    series: 'IPL 2026 · Match 42',
    venue: 'M. Chinnaswamy Stadium, Bengaluru',
    format: 'T20',
    teamA: { code: 'RCB', runs: 178, wkts: 6, overs: '20' },
    teamB: { code: 'CSK', runs: 124, wkts: 4, overs: '14.2' },
    statusText: 'CSK need 55 runs from 34 balls',
    lastBall: '6'
  },
  {
    id: 'm3',
    status: 'live',
    series: 'T20 World Cup · Group B',
    venue: "Lord's, London",
    format: 'T20',
    teamA: { code: 'ENG', runs: 156, wkts: 3, overs: '16.4' },
    teamB: { code: 'PAK', runs: 155, wkts: 8, overs: '20' },
    statusText: 'England need 0 runs to win',
    lastBall: '1'
  },
  {
    id: 'm4',
    status: 'upcoming',
    series: 'Border-Gavaskar Trophy',
    venue: 'MCG, Melbourne',
    format: 'TEST',
    teamA: { code: 'AUS' },
    teamB: { code: 'IND' },
    startsIn: '2h 15m'
  },
  {
    id: 'm5',
    status: 'upcoming',
    series: 'Tri-Series Final',
    venue: 'Newlands, Cape Town',
    format: 'ODI',
    teamA: { code: 'SA' },
    teamB: { code: 'NZ' },
    startsIn: 'Tomorrow · 6:30 PM'
  },
  {
    id: 'm6',
    status: 'upcoming',
    series: 'Asia Cup',
    venue: 'R. Premadasa, Colombo',
    format: 'T20',
    teamA: { code: 'SL' },
    teamB: { code: 'BAN' },
    startsIn: 'Sat · 2:00 PM'
  },
  {
    id: 'm7',
    status: 'result',
    series: 'World Cup 2026 · Super 8',
    venue: 'Eden Gardens, Kolkata',
    format: 'ODI',
    teamA: { code: 'WI', runs: 245, wkts: 9, overs: '50' },
    teamB: { code: 'NZ', runs: 246, wkts: 5, overs: '47.2' },
    result: 'New Zealand won by 5 wickets'
  },
  {
    id: 'm8',
    status: 'result',
    series: 'IPL 2026 · Match 41',
    venue: 'Chepauk, Chennai',
    format: 'T20',
    teamA: { code: 'MI', runs: 189, wkts: 4, overs: '20' },
    teamB: { code: 'KKR', runs: 172, wkts: 8, overs: '20' },
    result: 'Mumbai Indians won by 17 runs'
  }
];

const SERIES = [
  { name: 'ICC World Cup 2026', host: '🇮🇳 India', matches: 48, ongoing: true, teams: ['IND','AUS','ENG','PAK','SA','NZ'] },
  { name: 'Indian Premier League 2026', host: '🇮🇳 India', matches: 74, ongoing: true, teams: ['MI','CSK','RCB','KKR'] },
  { name: 'Border-Gavaskar Trophy', host: '🇦🇺 Australia', matches: 5, ongoing: false, teams: ['AUS','IND'] },
  { name: 'T20 World Cup 2026', host: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', matches: 45, ongoing: true, teams: ['ENG','PAK','SA','NZ'] },
  { name: 'Asia Cup 2026', host: '🇱🇰 Sri Lanka', matches: 15, ongoing: false, teams: ['SL','BAN','PAK','IND','AFG'] }
];

const RANKINGS = {
  batting: [
    { pos: 1, name: 'Babar Azam',    team: 'PAK', rating: 892 },
    { pos: 2, name: 'Virat Kohli',   team: 'IND', rating: 875 },
    { pos: 3, name: 'Steve Smith',   team: 'AUS', rating: 863 },
    { pos: 4, name: 'Joe Root',      team: 'ENG', rating: 845 },
    { pos: 5, name: 'Kane Williamson', team: 'NZ', rating: 831 }
  ],
  bowling: [
    { pos: 1, name: 'Jasprit Bumrah', team: 'IND', rating: 905 },
    { pos: 2, name: 'Shaheen Afridi', team: 'PAK', rating: 872 },
    { pos: 3, name: 'Pat Cummins',    team: 'AUS', rating: 858 },
    { pos: 4, name: 'Trent Boult',    team: 'NZ',  rating: 840 },
    { pos: 5, name: 'Kagiso Rabada',  team: 'SA',  rating: 828 }
  ],
  allround: [
    { pos: 1, name: 'Shakib Al Hasan', team: 'BAN', rating: 410 },
    { pos: 2, name: 'Ravindra Jadeja', team: 'IND', rating: 395 },
    { pos: 3, name: 'Ben Stokes',      team: 'ENG', rating: 380 },
    { pos: 4, name: 'Marcus Stoinis',  team: 'AUS', rating: 362 },
    { pos: 5, name: 'Mitchell Santner', team: 'NZ', rating: 348 }
  ],
  teams: [
    { pos: 1, name: 'India',        team: 'IND', rating: 121 },
    { pos: 2, name: 'Australia',    team: 'AUS', rating: 118 },
    { pos: 3, name: 'England',      team: 'ENG', rating: 112 },
    { pos: 4, name: 'Pakistan',     team: 'PAK', rating: 108 },
    { pos: 5, name: 'South Africa', team: 'SA',  rating: 105 }
  ]
};

const NEWS = [
  { emoji: '🏆', title: 'India storm into semifinals with dominant win over Australia', meta: '2 hours ago · World Cup', excerpt: 'Kohli\'s masterclass and Bumrah\'s four-wicket haul seal a memorable victory at Wankhede.' },
  { emoji: '🔥', title: 'Bumrah becomes fastest Indian to 300 ODI wickets', meta: '5 hours ago · Records', excerpt: 'The pace spearhead reached the milestone in just his 189th match.' },
  { emoji: '⚡', title: 'IPL 2026: RCB clinch thriller against CSK in last over', meta: '1 day ago · IPL', excerpt: 'A last-ball six from Maxwell sealed one of the best chases of the season.' },
  { emoji: '🎯', title: 'Shaheen Afridi ruled out of Asia Cup with knee injury', meta: '1 day ago · Injury', excerpt: 'Pakistan will miss their premier fast bowler for the upcoming tournament.' },
  { emoji: '🌟', title: 'Sachin Tendulkar inducted into ICC Hall of Fame', meta: '2 days ago · ICC', excerpt: 'The Little Master joins an elite list of cricketing legends.' }
];

/* ─── HELPERS ─────────────────────────────────────────────── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function team(code) {
  return TEAMS[code] || { name: code, abbr: code, flag: '🏏', color: '#444' };
}

/* ══════════════════════════════════════════════════════════
   RENDER: FEATURED MATCH
   ══════════════════════════════════════════════════════════ */
function renderFeatured() {
  const m = MATCHES.find(x => x.status === 'live');
  const el = $('#featuredMatch');
  if (!m) { el.innerHTML = '<div style="color:var(--muted)">No live match right now</div>'; return; }

  const A = team(m.teamA.code);
  const B = team(m.teamB.code);

  el.innerHTML = `
    <div class="featured-badge">LIVE NOW</div>
    <div class="featured-teams">
      <div class="featured-team">
        <div class="featured-flag">${A.flag}</div>
        <div class="featured-team-name">${A.name}</div>
        <div class="featured-team-score">${m.teamA.runs}/${m.teamA.wkts}</div>
        <div class="featured-team-overs">${m.teamA.overs} overs</div>
      </div>
      <div class="featured-vs">VS</div>
      <div class="featured-team right">
        <div class="featured-flag">${B.flag}</div>
        <div class="featured-team-name">${B.name}</div>
        <div class="featured-team-score">${m.teamB.overs ? m.teamB.runs + '/' + m.teamB.wkts : '—'}</div>
        <div class="featured-team-overs">${m.teamB.overs ? m.teamB.overs + ' overs' : 'Yet to bat'}</div>
      </div>
    </div>
    <div class="featured-meta">
      <span>${m.series} · ${m.format}</span>
      <span class="featured-status">${m.statusText}</span>
    </div>
  `;
  el.onclick = () => openMatch(m.id);
}

/* ══════════════════════════════════════════════════════════
   RENDER: LIVE STRIP
   ══════════════════════════════════════════════════════════ */
function renderLive() {
  const live = MATCHES.filter(m => m.status === 'live');
  const el = $('#liveMatches');
  el.innerHTML = live.map(m => {
    const A = team(m.teamA.code);
    const B = team(m.teamB.code);
    return `
      <div class="match-card" onclick="openMatch('${m.id}')">
        <div class="match-card-live">LIVE</div>
        <div class="match-card-info">${m.format} · ${m.series.split('·')[0].trim()}</div>
        <div class="match-card-team">
          <span class="mc-team-flag">${A.flag}</span>
          <span class="mc-team-name">${A.abbr}</span>
          <span class="mc-team-score">${m.teamA.runs}/${m.teamA.wkts}</span>
        </div>
        <div class="match-card-team">
          <span class="mc-team-flag">${B.flag}</span>
          <span class="mc-team-name">${B.abbr}</span>
          <span class="mc-team-score">${m.teamB.overs ? m.teamB.runs + '/' + m.teamB.wkts : '—'}</span>
        </div>
        <div class="match-card-status">${m.statusText}</div>
      </div>
    `;
  }).join('');
}

/* ══════════════════════════════════════════════════════════
   RENDER: UPCOMING
   ══════════════════════════════════════════════════════════ */
function renderUpcoming() {
  const up = MATCHES.filter(m => m.status === 'upcoming');
  const el = $('#upcomingMatches');
  el.innerHTML = up.map(m => {
    const A = team(m.teamA.code);
    const B = team(m.teamB.code);
    return `
      <div class="match-row" onclick="openMatch('${m.id}')">
        <div class="match-row-head">
          <span class="match-row-series">${m.series}</span>
          <span class="match-row-status">${m.startsIn}</span>
        </div>
        <div class="match-row-teams">
          <div class="mr-team">
            <div class="mr-team-left">
              <span class="mr-team-flag">${A.flag}</span>
              <span class="mr-team-name">${A.name}</span>
            </div>
          </div>
          <div class="mr-team">
            <div class="mr-team-left">
              <span class="mr-team-flag">${B.flag}</span>
              <span class="mr-team-name">${B.name}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ══════════════════════════════════════════════════════════
   RENDER: RECENT RESULTS
   ══════════════════════════════════════════════════════════ */
function renderRecent() {
  const res = MATCHES.filter(m => m.status === 'result');
  const el = $('#recentMatches');
  el.innerHTML = res.map(m => {
    const A = team(m.teamA.code);
    const B = team(m.teamB.code);
    const bWon = m.result.includes(B.name);
    return `
      <div class="match-row" onclick="openMatch('${m.id}')">
        <div class="match-row-head">
          <span class="match-row-series">${m.series}</span>
          <span class="match-row-status result">RESULT</span>
        </div>
        <div class="match-row-teams">
          <div class="mr-team">
            <div class="mr-team-left">
              <span class="mr-team-flag">${A.flag}</span>
              <span class="mr-team-name">${A.name}</span>
            </div>
            <span class="mr-team-score ${!bWon ? 'win' : 'loss'}">${m.teamA.runs}/${m.teamA.wkts}</span>
          </div>
          <div class="mr-team">
            <div class="mr-team-left">
              <span class="mr-team-flag">${B.flag}</span>
              <span class="mr-team-name">${B.name}</span>
            </div>
            <span class="mr-team-score ${bWon ? 'win' : 'loss'}">${m.teamB.runs}/${m.teamB.wkts}</span>
          </div>
        </div>
        <div class="match-row-result">${m.result}</div>
      </div>
    `;
  }).join('');
}

/* ══════════════════════════════════════════════════════════
   RENDER: SERIES
   ══════════════════════════════════════════════════════════ */
function renderSeries() {
  const ongoing = SERIES.filter(s => s.ongoing);
  const upcoming = SERIES.filter(s => !s.ongoing);

  const render = (list) => list.map(s => `
    <div class="match-row">
      <div class="match-row-head">
        <span class="match-row-series">${s.host}</span>
        <span class="match-row-status">${s.matches} matches</span>
      </div>
      <div style="font-size:15px;font-weight:800;margin:2px 0 8px;">${s.name}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${s.teams.map(tc => {
          const t = team(tc);
          return `<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;background:var(--card-2);border-radius:12px;font-size:11px;font-weight:800;">${t.flag} ${t.abbr}</span>`;
        }).join('')}
      </div>
    </div>
  `).join('');

  $('#ongoingSeries').innerHTML = render(ongoing);
  $('#upcomingSeries').innerHTML = render(upcoming);
}

/* ══════════════════════════════════════════════════════════
   RENDER: TEAMS
   ══════════════════════════════════════════════════════════ */
function renderTeams() {
  const el = $('#teamsGrid');
  el.innerHTML = Object.values(TEAMS).map(t => `
    <div class="team-tile">
      <div class="team-tile-flag">${t.flag}</div>
      <div class="team-tile-name">${t.name}</div>
      <div class="team-tile-rank">${t.abbr}</div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════════════════
   RENDER: RANKINGS
   ══════════════════════════════════════════════════════════ */
function renderRankings(cat) {
  const rows = RANKINGS[cat] || [];
  const isTeam = cat === 'teams';
  const metric = cat === 'batting' ? 'Rating' : cat === 'bowling' ? 'Rating' : cat === 'allround' ? 'Rating' : 'Points';

  $('#rankingsTable').innerHTML = `
    <table class="rank-table">
      <thead>
        <tr>
          <th>#</th>
          <th>${isTeam ? 'Team' : 'Player'}</th>
          <th style="text-align:right;">${metric}</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => {
          const t = team(r.team);
          return `
            <tr>
              <td class="pos">${r.pos}</td>
              <td class="name">
                <span class="rank-flag">${t.flag}</span>
                <span>${r.name}</span>
              </td>
              <td class="stat">${r.rating}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

/* ══════════════════════════════════════════════════════════
   RENDER: NEWS
   ══════════════════════════════════════════════════════════ */
function renderNews() {
  $('#newsList').innerHTML = NEWS.map(n => `
    <div class="news-item">
      <div class="news-thumb">${n.emoji}</div>
      <div class="news-body">
        <div class="news-title">${n.title}</div>
        <div class="news-meta">${n.meta}</div>
        <div class="news-excerpt">${n.excerpt}</div>
      </div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════════════════
   MATCH MODAL
   ══════════════════════════════════════════════════════════ */
function openMatch(id) {
  const m = MATCHES.find(x => x.id === id);
  if (!m) return;
  const A = team(m.teamA.code);
  const B = team(m.teamB.code);

  const scoreStr = (t) => t.overs ? `${t.runs}/${t.wkts} (${t.overs})` : 'Yet to bat';

  $('#modalBody').innerHTML = `
    <div style="font-size:11px;font-weight:900;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">${m.series}</div>
    <div style="font-size:13px;color:var(--muted);font-weight:700;margin-bottom:20px;">${m.venue} · ${m.format}</div>

    <div style="background:var(--card-2);border-radius:12px;padding:18px;margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:22px;">${A.flag}</span>
          <span style="font-size:15px;font-weight:800;">${A.name}</span>
        </div>
        <span style="font-size:18px;font-weight:900;">${scoreStr(m.teamA)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:22px;">${B.flag}</span>
          <span style="font-size:15px;font-weight:800;">${B.name}</span>
        </div>
        <span style="font-size:18px;font-weight:900;">${scoreStr(m.teamB)}</span>
      </div>
    </div>

    ${m.status === 'live' ? `<div style="color:var(--orange);font-weight:800;font-size:13px;margin-bottom:16px;">🔴 ${m.statusText}</div>` : ''}
    ${m.status === 'result' ? `<div style="color:var(--accent);font-weight:800;font-size:13px;margin-bottom:16px;">✅ ${m.result}</div>` : ''}
    ${m.status === 'upcoming' ? `<div style="color:var(--cyan);font-weight:800;font-size:13px;margin-bottom:16px;">⏰ Starts in ${m.startsIn}</div>` : ''}

    <div style="font-size:11px;color:var(--muted);font-weight:700;text-align:center;padding-top:14px;border-top:1px solid var(--border);">
      Full scorecard coming soon · Live commentary · Ball-by-ball updates
    </div>
  `;

  $('#matchModal').classList.add('open');
}

$('#modalClose').onclick = () => $('#matchModal').classList.remove('open');
$('#matchModal').onclick = (e) => {
  if (e.target.id === 'matchModal') $('#matchModal').classList.remove('open');
};

/* ══════════════════════════════════════════════════════════
   TAB SWITCHING
   ══════════════════════════════════════════════════════════ */
function switchTab(name) {
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  $$('.bnav').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  $$('.pane').forEach(p => p.classList.remove('active'));
  const pane = $('#pane-' + name);
  if (pane) pane.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$$('.tab, .bnav').forEach(el => {
  el.onclick = () => switchTab(el.dataset.tab);
});

/* Rankings sub-tabs */
$$('.rank-tab').forEach(el => {
  el.onclick = () => {
    $$('.rank-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    renderRankings(el.dataset.rank);
  };
});

/* ══════════════════════════════════════════════════════════
   THEME TOGGLE
   ══════════════════════════════════════════════════════════ */
const themeBtn = $('#themeBtn');
const savedTheme = localStorage.getItem('cb_theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
themeBtn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

themeBtn.onclick = () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('cb_theme', next);
  themeBtn.textContent = next === 'dark' ? '🌙' : '☀️';
};

/* ══════════════════════════════════════════════════════════
   SEARCH (basic)
   ══════════════════════════════════════════════════════════ */
$('#searchInput').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) return;
  // Simple demo: log matches
  const hits = MATCHES.filter(m =>
    m.series.toLowerCase().includes(q) ||
    m.teamA.code.toLowerCase().includes(q) ||
    m.teamB.code.toLowerCase().includes(q) ||
    team(m.teamA.code).name.toLowerCase().includes(q) ||
    team(m.teamB.code).name.toLowerCase().includes(q)
  );
  console.log('[Search]', q, '→', hits.length, 'matches');
});

/* ══════════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════════ */
renderFeatured();
renderLive();
renderUpcoming();
renderRecent();
renderSeries();
renderTeams();
renderRankings('batting');
renderNews();
