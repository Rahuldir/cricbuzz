/* ============================================================
   CRICBUZZ WEB - App Logic
   ============================================================ */

const TEAMS = {
  IND: { name: 'India',                 abbr: 'IND', bg: '#0a4cff' },
  AUS: { name: 'Australia',             abbr: 'AUS', bg: '#ffcc00' },
  ENG: { name: 'England',               abbr: 'ENG', bg: '#c8102e' },
  PAK: { name: 'Pakistan',              abbr: 'PAK', bg: '#01411c' },
  SA:  { name: 'South Africa',          abbr: 'SA',  bg: '#007749' },
  NZ:  { name: 'New Zealand',           abbr: 'NZ',  bg: '#111111' },
  WI:  { name: 'West Indies',           abbr: 'WI',  bg: '#7b0041' },
  SL:  { name: 'Sri Lanka',             abbr: 'SL',  bg: '#00539c' },
  BAN: { name: 'Bangladesh',            abbr: 'BAN', bg: '#006a4e' },
  AFG: { name: 'Afghanistan',           abbr: 'AFG', bg: '#0066cc' },
  MI:  { name: 'Mumbai Indians',        abbr: 'MI',  bg: '#004ba0' },
  CSK: { name: 'Chennai Super Kings',   abbr: 'CSK', bg: '#f9cd05' },
  RCB: { name: 'Royal Challengers',     abbr: 'RCB', bg: '#d11a2a' },
  KKR: { name: 'Kolkata Knight Riders', abbr: 'KKR', bg: '#3a225d' }
};

const MOCK_MATCHES = [
  {
    id: 'mock-m1', status: 'live',
    series: 'World Cup 2026 - Super 8', venue: 'Wankhede Stadium',
    format: 'ODI',
    teamA: { code: 'IND', name: 'India', runs: 287, wkts: 4, overs: '42.3' },
    teamB: { code: 'AUS', name: 'Australia', runs: 0, wkts: 0, overs: '' },
    statusText: 'India need 42 runs from 45 balls'
  },
  {
    id: 'mock-m2', status: 'upcoming',
    series: 'Border-Gavaskar Trophy', venue: 'MCG',
    format: 'TEST',
    teamA: { code: 'AUS', name: 'Australia' },
    teamB: { code: 'IND', name: 'India' },
    startsIn: '2h 15m'
  },
  {
    id: 'mock-m3', status: 'result',
    series: 'World Cup 2026', venue: 'Eden Gardens',
    format: 'ODI',
    teamA: { code: 'WI', name: 'West Indies', runs: 245, wkts: 9, overs: '50' },
    teamB: { code: 'NZ', name: 'New Zealand', runs: 246, wkts: 5, overs: '47.2' },
    result: 'New Zealand won by 5 wickets'
  }
];

let MATCHES = [];
let usingLiveApi = false;

const $  = function (s) { return document.querySelector(s); };
const $$ = function (s) { return document.querySelectorAll(s); };

function teamInfo(t) {
  if (!t) return { code: '???', name: 'Unknown', bg: '#444' };

  const code = t.code || '???';
  const known = TEAMS[code];
  const name = t.name || (known && known.name) || code;

  let bg = known && known.bg;
  if (!bg) {
    let hash = 0;
    for (let i = 0; i < code.length; i++) hash = code.charCodeAt(i) + ((hash << 5) - hash);
    const h = Math.abs(hash) % 360;
    bg = 'hsl(' + h + ', 55%, 40%)';
  }

  return { code: code, name: name, bg: bg };
}

function isLight(color) {
  if (!color) return false;
  const hslM = color.match(/hsl\([\d.]+\s*,\s*[\d.]+%\s*,\s*([\d.]+)%/);
  if (hslM) return parseFloat(hslM[1]) > 65;
  if (color.charAt(0) === '#') {
    const h = color.substring(1);
    if (h.length === 6) {
      const r = parseInt(h.substr(0, 2), 16);
      const g = parseInt(h.substr(2, 2), 16);
      const b = parseInt(h.substr(4, 2), 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) > 180;
    }
  }
  return false;
}

function scoreShort(t) {
  if (t.overs && t.overs !== '') return t.runs + '/' + t.wkts;
  if (t.runs > 0 || t.wkts > 0) return t.runs + '/' + t.wkts;
  return '-';
}

function renderFeatured() {
  const m = MATCHES.find(function (x) { return x.status === 'live'; });
  const el = $('#featuredMatch');
  if (!el) return;

  if (!m) {
    el.innerHTML = '<div style="color:var(--muted);padding:20px;">No live match right now</div>';
    return;
  }

  const A = teamInfo(m.teamA);
  const B = teamInfo(m.teamB);

  el.innerHTML =
    '<div class="featured-badge">LIVE NOW</div>'
    + '<div class="featured-teams">'
      + '<div class="featured-team">'
        + '<div class="featured-flag" style="background:' + A.bg + ';color:' + (isLight(A.bg) ? '#000' : '#fff') + ';border-color:' + A.bg + ';">' + A.code + '</div>'
        + '<div class="featured-team-name">' + A.name + '</div>'
        + '<div class="featured-team-score">' + scoreShort(m.teamA) + '</div>'
        + '<div class="featured-team-overs">' + (m.teamA.overs ? m.teamA.overs + ' overs' : (m.teamA.runs > 0 ? 'in progress' : 'Yet to bat')) + '</div>'
      + '</div>'
      + '<div class="featured-vs">VS</div>'
      + '<div class="featured-team right">'
        + '<div class="featured-flag" style="background:' + B.bg + ';color:' + (isLight(B.bg) ? '#000' : '#fff') + ';border-color:' + B.bg + ';">' + B.code + '</div>'
        + '<div class="featured-team-name">' + B.name + '</div>'
        + '<div class="featured-team-score">' + scoreShort(m.teamB) + '</div>'
        + '<div class="featured-team-overs">' + (m.teamB.overs ? m.teamB.overs + ' overs' : (m.teamB.runs > 0 ? 'in progress' : 'Yet to bat')) + '</div>'
      + '</div>'
    + '</div>'
    + '<div class="featured-meta">'
      + '<span>' + m.series + ' - ' + m.format + '</span>'
      + '<span class="featured-status">' + (m.statusText || 'Live').toUpperCase() + '</span>'
    + '</div>';

  el.onclick = function () { openMatch(m.id); };
}

function renderLive() {
  const live = MATCHES.filter(function (m) { return m.status === 'live'; });
  const el = $('#liveMatches');
  if (!el) return;

  if (live.length === 0) {
    el.innerHTML = '<div style="color:var(--muted);padding:14px;font-size:13px;">No live matches</div>';
    return;
  }

  el.innerHTML = live.map(function (m) {
    const A = teamInfo(m.teamA);
    const B = teamInfo(m.teamB);

    return '<div class="match-card" onclick="openMatch(\'' + m.id + '\')">'
      + '<div class="match-card-live">LIVE</div>'
      + '<div class="match-card-info">' + m.format + ' - ' + (m.series || '').substring(0, 30) + '</div>'
      + '<div class="match-card-team">'
        + '<span class="mc-team-flag" style="background:' + A.bg + ';color:' + (isLight(A.bg) ? '#000' : '#fff') + ';">' + A.code + '</span>'
        + '<span class="mc-team-name">' + A.name + '</span>'
        + '<span class="mc-team-score">' + scoreShort(m.teamA) + '</span>'
      + '</div>'
      + '<div class="match-card-team">'
        + '<span class="mc-team-flag" style="background:' + B.bg + ';color:' + (isLight(B.bg) ? '#000' : '#fff') + ';">' + B.code + '</span>'
        + '<span class="mc-team-name">' + B.name + '</span>'
        + '<span class="mc-team-score">' + scoreShort(m.teamB) + '</span>'
      + '</div>'
      + '<div class="match-card-status">' + (m.statusText || 'Live').toUpperCase() + '</div>'
    + '</div>';
  }).join('');
}

function renderUpcoming() {
  const up = MATCHES.filter(function (m) { return m.status === 'upcoming'; });
  const el = $('#upcomingMatches');
  if (!el) return;

  if (up.length === 0) {
    el.innerHTML = '<div style="color:var(--muted);padding:14px;font-size:13px;">No upcoming matches</div>';
    return;
  }

  el.innerHTML = up.map(function (m) {
    const A = teamInfo(m.teamA);
    const B = teamInfo(m.teamB);

    return '<div class="match-row" onclick="openMatch(\'' + m.id + '\')">'
      + '<div class="match-row-head">'
        + '<span class="match-row-series">' + m.series + '</span>'
        + '<span class="match-row-status">' + (m.startsIn || 'TBD') + '</span>'
      + '</div>'
      + '<div class="match-row-teams">'
        + '<div class="mr-team">'
          + '<div class="mr-team-left">'
            + '<span class="mr-team-flag" style="background:' + A.bg + ';color:' + (isLight(A.bg) ? '#000' : '#fff') + ';">' + A.code + '</span>'
            + '<span class="mr-team-name">' + A.name + '</span>'
          + '</div>'
        + '</div>'
        + '<div class="mr-team">'
          + '<div class="mr-team-left">'
            + '<span class="mr-team-flag" style="background:' + B.bg + ';color:' + (isLight(B.bg) ? '#000' : '#fff') + ';">' + B.code + '</span>'
            + '<span class="mr-team-name">' + B.name + '</span>'
          + '</div>'
        + '</div>'
      + '</div>'
    + '</div>';
  }).join('');
}

function renderRecent() {
  const res = MATCHES.filter(function (m) { return m.status === 'result'; });
  const el = $('#recentMatches');
  if (!el) return;

  if (res.length === 0) {
    el.innerHTML = '<div style="color:var(--muted);padding:14px;font-size:13px;">No results yet</div>';
    return;
  }

  el.innerHTML = res.map(function (m) {
    const A = teamInfo(m.teamA);
    const B = teamInfo(m.teamB);
    const resultText = m.result || m.statusText || 'Match completed';
    const bWon = resultText.toLowerCase().indexOf(B.name.toLowerCase()) >= 0;
    const aClass = bWon ? 'loss' : 'win';
    const bClass = bWon ? 'win' : 'loss';

    return '<div class="match-row" onclick="openMatch(\'' + m.id + '\')">'
      + '<div class="match-row-head">'
        + '<span class="match-row-series">' + m.series + '</span>'
        + '<span class="match-row-status result">RESULT</span>'
      + '</div>'
      + '<div class="match-row-teams">'
        + '<div class="mr-team">'
          + '<div class="mr-team-left">'
            + '<span class="mr-team-flag" style="background:' + A.bg + ';color:' + (isLight(A.bg) ? '#000' : '#fff') + ';">' + A.code + '</span>'
            + '<span class="mr-team-name">' + A.name + '</span>'
          + '</div>'
          + '<span class="mr-team-score ' + aClass + '">' + scoreShort(m.teamA) + '</span>'
        + '</div>'
        + '<div class="mr-team">'
          + '<div class="mr-team-left">'
            + '<span class="mr-team-flag" style="background:' + B.bg + ';color:' + (isLight(B.bg) ? '#000' : '#fff') + ';">' + B.code + '</span>'
            + '<span class="mr-team-name">' + B.name + '</span>'
          + '</div>'
          + '<span class="mr-team-score ' + bClass + '">' + scoreShort(m.teamB) + '</span>'
        + '</div>'
      + '</div>'
      + '<div class="match-row-result">' + resultText + '</div>'
    + '</div>';
  }).join('');
}

function renderSeries() {
  const SERIES = [
    { name: 'ICC World Cup 2026', host: 'India', matches: 48, ongoing: true, teams: ['IND','AUS','ENG','PAK','SA','NZ'] },
    { name: 'Indian Premier League 2026', host: 'India', matches: 74, ongoing: true, teams: ['MI','CSK','RCB','KKR'] },
    { name: 'Border-Gavaskar Trophy', host: 'Australia', matches: 5, ongoing: false, teams: ['AUS','IND'] },
    { name: 'T20 World Cup 2026', host: 'England', matches: 45, ongoing: true, teams: ['ENG','PAK','SA','NZ'] },
    { name: 'Asia Cup 2026', host: 'Sri Lanka', matches: 15, ongoing: false, teams: ['SL','BAN','PAK','IND','AFG'] }
  ];

  function renderList(list) {
    return list.map(function (s) {
      const tags = s.teams.map(function (tc) {
        const t = teamInfo({ code: tc });
        return '<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;background:var(--card-2);border-radius:12px;font-size:11px;font-weight:800;">' + t.code + '</span>';
      }).join('');
      return '<div class="match-row">'
        + '<div class="match-row-head">'
          + '<span class="match-row-series">' + s.host + '</span>'
          + '<span class="match-row-status">' + s.matches + ' matches</span>'
        + '</div>'
        + '<div style="font-size:15px;font-weight:800;margin:2px 0 8px;">' + s.name + '</div>'
        + '<div style="display:flex;gap:6px;flex-wrap:wrap;">' + tags + '</div>'
      + '</div>';
    }).join('');
  }

  const o = $('#ongoingSeries');
  if (o) o.innerHTML = renderList(SERIES.filter(function (s) { return s.ongoing; }));
  const u = $('#upcomingSeries');
  if (u) u.innerHTML = renderList(SERIES.filter(function (s) { return !s.ongoing; }));
}

function renderTeams() {
  const el = $('#teamsGrid');
  if (!el) return;
  el.innerHTML = Object.keys(TEAMS).map(function (code) {
    const t = TEAMS[code];
    return '<div class="team-tile">'
      + '<div class="team-tile-flag" style="background:' + t.bg + ';color:' + (isLight(t.bg) ? '#000' : '#fff') + ';border-color:' + t.bg + ';">' + t.abbr + '</div>'
      + '<div class="team-tile-name">' + t.name + '</div>'
      + '<div class="team-tile-rank">' + t.abbr + '</div>'
    + '</div>';
  }).join('');
}

function renderRankings(cat) {
  const RANKINGS = {
    batting: [
      { pos: 1, name: 'Babar Azam',      team: 'PAK', rating: 892 },
      { pos: 2, name: 'Virat Kohli',     team: 'IND', rating: 875 },
      { pos: 3, name: 'Steve Smith',     team: 'AUS', rating: 863 },
      { pos: 4, name: 'Joe Root',        team: 'ENG', rating: 845 },
      { pos: 5, name: 'Kane Williamson', team: 'NZ',  rating: 831 }
    ],
    bowling: [
      { pos: 1, name: 'Jasprit Bumrah', team: 'IND', rating: 905 },
      { pos: 2, name: 'Shaheen Afridi', team: 'PAK', rating: 872 },
      { pos: 3, name: 'Pat Cummins',    team: 'AUS', rating: 858 },
      { pos: 4, name: 'Trent Boult',    team: 'NZ',  rating: 840 },
      { pos: 5, name: 'Kagiso Rabada',  team: 'SA',  rating: 828 }
    ],
    allround: [
      { pos: 1, name: 'Shakib Al Hasan',  team: 'BAN', rating: 410 },
      { pos: 2, name: 'Ravindra Jadeja',  team: 'IND', rating: 395 },
      { pos: 3, name: 'Ben Stokes',       team: 'ENG', rating: 380 },
      { pos: 4, name: 'Marcus Stoinis',   team: 'AUS', rating: 362 },
      { pos: 5, name: 'Mitchell Santner', team: 'NZ',  rating: 348 }
    ],
    teams: [
      { pos: 1, name: 'India',        team: 'IND', rating: 121 },
      { pos: 2, name: 'Australia',    team: 'AUS', rating: 118 },
      { pos: 3, name: 'England',      team: 'ENG', rating: 112 },
      { pos: 4, name: 'Pakistan',     team: 'PAK', rating: 108 },
      { pos: 5, name: 'South Africa', team: 'SA',  rating: 105 }
    ]
  };

  const rows = RANKINGS[cat] || [];
  const isTeam = cat === 'teams';
  const metric = isTeam ? 'Points' : 'Rating';

  let html = '<table class="rank-table"><thead><tr><th>#</th><th>' + (isTeam ? 'Team' : 'Player') + '</th><th style="text-align:right;">' + metric + '</th></tr></thead><tbody>';
  rows.forEach(function (r) {
    const t = teamInfo({ code: r.team });
    html += '<tr>'
      + '<td class="pos">' + r.pos + '</td>'
      + '<td class="name"><span class="rank-flag" style="background:' + t.bg + ';color:' + (isLight(t.bg) ? '#000' : '#fff') + ';">' + t.code + '</span><span>' + r.name + '</span></td>'
      + '<td class="stat">' + r.rating + '</td>'
    + '</tr>';
  });
  html += '</tbody></table>';
  const el = $('#rankingsTable');
  if (el) el.innerHTML = html;
}

function renderNews() {
  const NEWS = [
    { tag: 'WC',  title: 'India storm into semifinals with dominant win over Australia', meta: '2 hours ago - World Cup', excerpt: 'Kohlis masterclass and Bumrahs four-wicket haul seal a memorable victory at Wankhede.' },
    { tag: 'REC', title: 'Bumrah becomes fastest Indian to 300 ODI wickets', meta: '5 hours ago - Records', excerpt: 'The pace spearhead reached the milestone in just his 189th match.' },
    { tag: 'IPL', title: 'IPL 2026: RCB clinch thriller against CSK in last over', meta: '1 day ago - IPL', excerpt: 'A last-ball six from Maxwell sealed one of the best chases of the season.' },
    { tag: 'INJ', title: 'Shaheen Afridi ruled out of Asia Cup with knee injury', meta: '1 day ago - Injury', excerpt: 'Pakistan will miss their premier fast bowler for the upcoming tournament.' },
    { tag: 'ICC', title: 'Sachin Tendulkar inducted into ICC Hall of Fame', meta: '2 days ago - ICC', excerpt: 'The Little Master joins an elite list of cricketing legends.' }
  ];
  const el = $('#newsList');
  if (!el) return;
  el.innerHTML = NEWS.map(function (n) {
    return '<div class="news-item">'
      + '<div class="news-thumb">' + n.tag + '</div>'
      + '<div class="news-body">'
        + '<div class="news-title">' + n.title + '</div>'
        + '<div class="news-meta">' + n.meta + '</div>'
        + '<div class="news-excerpt">' + n.excerpt + '</div>'
      + '</div>'
    + '</div>';
  }).join('');
}

function openMatch(id) {
  if (!id) return;
  window.location.href = 'scorecard.html?id=' + encodeURIComponent(id);
}

function switchTab(name) {
  $$('.tab').forEach(function (t) { t.classList.toggle('active', t.dataset.tab === name); });
  $$('.bnav').forEach(function (t) { t.classList.toggle('active', t.dataset.tab === name); });
  $$('.pane').forEach(function (p) { p.classList.remove('active'); });
  const pane = $('#pane-' + name);
  if (pane) pane.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Lazy-load CricketData widgets when tab is opened
  if (name === 'widgets') {
    if (typeof window.initCricketDataWidgets === 'function') {
      window.initCricketDataWidgets();
    }
  }
}

function loadMatches() {
  const el = $('#liveMatches');
  if (el) el.innerHTML = '<div style="color:var(--muted);padding:14px;font-size:13px;">Loading matches...</div>';

  if (typeof BigBallsAPI !== 'undefined' && BigBallsAPI.hasApiKey()) {
    BigBallsAPI.fetchMatches()
      .then(function (matches) {
        if (matches.length === 0) throw new Error('API returned 0 matches');
        MATCHES = matches;
        usingLiveApi = true;
        window.MATCHES = MATCHES;
        console.log('[Cricbuzz] Loaded ' + matches.length + ' matches');
        refreshAll();
      })
      .catch(function (err) {
        console.warn('[Cricbuzz] API failed, using mock data:', err.message);
        MATCHES = MOCK_MATCHES.slice();
        usingLiveApi = false;
        window.MATCHES = MATCHES;
        refreshAll();
      });
  } else {
    MATCHES = MOCK_MATCHES.slice();
    usingLiveApi = false;
    window.MATCHES = MATCHES;
    refreshAll();
  }
}

function refreshAll() {
  window.MATCHES = MATCHES;
  renderFeatured();
  renderLive();
  renderUpcoming();
  renderRecent();
  if (typeof window.refreshStreamsList === 'function') window.refreshStreamsList();
  if (typeof window.refreshMatchIdsList === 'function') window.refreshMatchIdsList();
}

document.addEventListener('DOMContentLoaded', function () {
  const closeBtn = document.getElementById('modalClose');
  const modal = document.getElementById('matchModal');
  if (closeBtn) closeBtn.onclick = function () { modal.classList.remove('open'); };
  if (modal) modal.onclick = function (e) { if (e.target.id === 'matchModal') modal.classList.remove('open'); };

  $$('.tab, .bnav').forEach(function (el) {
    el.onclick = function () { switchTab(el.dataset.tab); };
  });

  $$('.rank-tab').forEach(function (el) {
    el.onclick = function () {
      $$('.rank-tab').forEach(function (t) { t.classList.remove('active'); });
      el.classList.add('active');
      renderRankings(el.dataset.rank);
    };
  });

  const themeBtn = document.getElementById('themeBtn');
  const savedTheme = localStorage.getItem('cb_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (themeBtn) themeBtn.textContent = savedTheme === 'dark' ? 'Dark' : 'Light';
  if (themeBtn) {
    themeBtn.onclick = function () {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('cb_theme', next);
      themeBtn.textContent = next === 'dark' ? 'Dark' : 'Light';
    };
  }

  renderSeries();
  renderTeams();
  renderRankings('batting');
  renderNews();

  loadMatches();

  setInterval(function () {
    if (usingLiveApi && typeof BigBallsAPI !== 'undefined') {
      BigBallsAPI.fetchMatches().then(function (m) {
        MATCHES = m;
        window.MATCHES = m;
        refreshAll();
      }).catch(function () {});
    }
  }, 90000);

  console.log('[Cricbuzz] App booted successfully');
});

window.MATCHES = MATCHES;
window.TEAMS = TEAMS;
window.refreshAll = refreshAll;
window.openMatch = openMatch;
