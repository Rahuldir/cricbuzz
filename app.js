/* ============================================================
   CRICBUZZ WEB - Mock Data + App Logic + Real API + Streaming
   ASCII-safe build. No hidden Unicode.
   ============================================================ */

/* ---- MOCK DATA (fallback when API unavailable) ------------- */
const TEAMS = {
  IND: { name: 'India',                 abbr: 'IND', color: '#0a4cff', bg: '#0a4cff' },
  AUS: { name: 'Australia',             abbr: 'AUS', color: '#ffcc00', bg: '#ffcc00' },
  ENG: { name: 'England',               abbr: 'ENG', color: '#c8102e', bg: '#c8102e' },
  PAK: { name: 'Pakistan',              abbr: 'PAK', color: '#01411c', bg: '#01411c' },
  SA:  { name: 'South Africa',          abbr: 'SA',  color: '#007749', bg: '#007749' },
  NZ:  { name: 'New Zealand',           abbr: 'NZ',  color: '#000000', bg: '#111111' },
  WI:  { name: 'West Indies',           abbr: 'WI',  color: '#7b0041', bg: '#7b0041' },
  SL:  { name: 'Sri Lanka',             abbr: 'SL',  color: '#00539c', bg: '#00539c' },
  BAN: { name: 'Bangladesh',            abbr: 'BAN', color: '#006a4e', bg: '#006a4e' },
  AFG: { name: 'Afghanistan',           abbr: 'AFG', color: '#0066cc', bg: '#0066cc' },
  MI:  { name: 'Mumbai Indians',        abbr: 'MI',  color: '#004ba0', bg: '#004ba0' },
  CSK: { name: 'Chennai Super Kings',   abbr: 'CSK', color: '#f9cd05', bg: '#f9cd05' },
  RCB: { name: 'Royal Challengers',     abbr: 'RCB', color: '#d11a2a', bg: '#d11a2a' },
  KKR: { name: 'Kolkata Knight Riders', abbr: 'KKR', color: '#3a225d', bg: '#3a225d' },
  DC:  { name: 'Delhi Capitals',        abbr: 'DC',  color: '#17479e', bg: '#17479e' },
  SRH: { name: 'Sunrisers Hyderabad',   abbr: 'SRH', color: '#f26522', bg: '#f26522' },
  RR:  { name: 'Rajasthan Royals',      abbr: 'RR',  color: '#ea1a7f', bg: '#ea1a7f' },
  PBKS:{ name: 'Punjab Kings',          abbr: 'PBKS',color: '#d71920', bg: '#d71920' },
  GT:  { name: 'Gujarat Titans',        abbr: 'GT',  color: '#1b2133', bg: '#1b2133' },
  LSG: { name: 'Lucknow Super Giants',  abbr: 'LSG', color: '#0057e2', bg: '#0057e2' }
};

/* ---- MOCK MATCHES (used if API fails) ---------------------- */
const MOCK_MATCHES = [
  {
    id: 'mock-m1',
    status: 'live',
    series: 'World Cup 2026 - Super 8',
    venue: 'Wankhede Stadium, Mumbai',
    format: 'ODI',
    teamA: { code: 'IND', runs: 287, wkts: 4, overs: '42.3' },
    teamB: { code: 'AUS', runs: 0,   wkts: 0, overs: '' },
    statusText: 'India need 42 runs from 45 balls'
  },
  {
    id: 'mock-m2',
    status: 'live',
    series: 'IPL 2026 - Match 42',
    venue: 'M. Chinnaswamy Stadium, Bengaluru',
    format: 'T20',
    teamA: { code: 'RCB', runs: 178, wkts: 6, overs: '20' },
    teamB: { code: 'CSK', runs: 124, wkts: 4, overs: '14.2' },
    statusText: 'CSK need 55 runs from 34 balls'
  },
  {
    id: 'mock-m3',
    status: 'upcoming',
    series: 'Border-Gavaskar Trophy',
    venue: 'MCG, Melbourne',
    format: 'TEST',
    teamA: { code: 'AUS' },
    teamB: { code: 'IND' },
    startsIn: '2h 15m'
  },
  {
    id: 'mock-m4',
    status: 'result',
    series: 'World Cup 2026 - Super 8',
    venue: 'Eden Gardens, Kolkata',
    format: 'ODI',
    teamA: { code: 'WI', runs: 245, wkts: 9, overs: '50' },
    teamB: { code: 'NZ', runs: 246, wkts: 5, overs: '47.2' },
    result: 'New Zealand won by 5 wickets'
  }
];

/* ============================================================
   LIVE STREAMING CONFIG
   Add your streaming links here. Each entry:
     matchId    - id of the match (from API or mock)
     platform   - display name
     url        - stream URL (direct video or embed URL)
     embed      - true = iframe in modal, false = open in new tab
   ============================================================ */
const STREAMS = [
  /* EXAMPLE — replace with your real links */
  {
    matchId: 'mock-m1',
    platform: 'Star Sports / Hotstar',
    url: 'https://www.hotstar.com/sports/cricket',
    embed: false
  },
  {
    matchId: 'mock-m1',
    platform: 'Sky Sports Cricket',
    url: 'https://www.skysports.com/cricket',
    embed: false
  },
  {
    matchId: 'mock-m2',
    platform: 'JioCinema',
    url: 'https://www.jiocinema.com/sports',
    embed: false
  },
  {
    matchId: 'mock-m3',
    platform: 'SonyLIV',
    url: 'https://www.sonyliv.com/sports',
    embed: false
  }
];

/* ---- RUNTIME STATE ---------------------------------------- */
let MATCHES = [];       /* filled by API or mock */
let usingLiveApi = false;

const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function team(code) {
  return TEAMS[code] || { name: code, abbr: code, color: '#444444', bg: '#444444' };
}

function badge(code, size) {
  const t = team(code);
  const fs = size === 'sm' ? '10px' : '11px';
  const dim = size === 'sm' ? '22px' : '26px';
  return '<span style="display:inline-flex;align-items:center;justify-content:center;'
       + 'width:' + dim + ';height:' + dim + ';border-radius:50%;'
       + 'background:' + t.bg + ';color:' + (isLight(t.bg) ? '#000' : '#fff') + ';'
       + 'font-size:' + fs + ';font-weight:900;flex-shrink:0;letter-spacing:-0.3px;">'
       + t.abbr + '</span>';
}

function isLight(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substr(0, 2), 16);
  const g = parseInt(h.substr(2, 2), 16);
  const b = parseInt(h.substr(4, 2), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) > 180;
}

/* ---- Get streams for a match ------------------------------ */
function getStreamsFor(matchId) {
  return STREAMS.filter(function (s) { return s.matchId === matchId; });
}

/* ============================================================
   RENDERING
   ============================================================ */

/* ---- FEATURED MATCH --------------------------------------- */
function renderFeatured() {
  const m = MATCHES.find(function (x) { return x.status === 'live'; });
  const el = $('#featuredMatch');
  if (!el) return;
  if (!m) {
    el.innerHTML = '<div style="color:var(--muted);padding:20px;">No live match right now</div>';
    return;
  }

  const A = team(m.teamA.code);
  const B = team(m.teamB.code);
  const aScore = m.teamA.runs + '/' + m.teamA.wkts;
  const bScore = m.teamB.overs ? (m.teamB.runs + '/' + m.teamB.wkts) : '-';
  const bOvers = m.teamB.overs ? (m.teamB.overs + ' overs') : 'Yet to bat';

  el.innerHTML =
    '<div class="featured-badge">LIVE NOW</div>'
    + '<div class="featured-teams">'
      + '<div class="featured-team">'
        + '<div class="featured-flag" style="background:' + A.bg + ';color:' + (isLight(A.bg) ? '#000' : '#fff') + ';border-color:' + A.bg + ';">' + A.abbr + '</div>'
        + '<div class="featured-team-name">' + A.name + '</div>'
        + '<div class="featured-team-score">' + aScore + '</div>'
        + '<div class="featured-team-overs">' + m.teamA.overs + ' overs</div>'
      + '</div>'
      + '<div class="featured-vs">VS</div>'
      + '<div class="featured-team right">'
        + '<div class="featured-flag" style="background:' + B.bg + ';color:' + (isLight(B.bg) ? '#000' : '#fff') + ';border-color:' + B.bg + ';">' + B.abbr + '</div>'
        + '<div class="featured-team-name">' + B.name + '</div>'
        + '<div class="featured-team-score">' + bScore + '</div>'
        + '<div class="featured-team-overs">' + bOvers + '</div>'
      + '</div>'
    + '</div>'
    + '<div class="featured-meta">'
      + '<span>' + m.series + ' - ' + m.format + '</span>'
      + '<span class="featured-status">' + m.statusText + '</span>'
    + '</div>';

  el.onclick = function () { openMatch(m.id); };
}

/* ---- LIVE MATCHES ----------------------------------------- */
function renderLive() {
  const live = MATCHES.filter(function (m) { return m.status === 'live'; });
  const el = $('#liveMatches');
  if (!el) return;

  if (live.length === 0) {
    el.innerHTML = '<div style="color:var(--muted);padding:14px;font-size:13px;">No live matches</div>';
    return;
  }

  el.innerHTML = live.map(function (m) {
    const A = team(m.teamA.code);
    const B = team(m.teamB.code);
    const aScore = m.teamA.runs + '/' + m.teamA.wkts;
    const bScore = m.teamB.overs ? (m.teamB.runs + '/' + m.teamB.wkts) : '-';
    const streams = getStreamsFor(m.id);
    const watchBtn = streams.length > 0
      ? '<div class="match-card-watch">WATCH LIVE</div>'
      : '';

    return '<div class="match-card" onclick="openMatch(\'' + m.id + '\')">'
      + '<div class="match-card-live">LIVE</div>'
      + '<div class="match-card-info">' + m.format + ' - ' + (m.series || '').substring(0, 30) + '</div>'
      + '<div class="match-card-team">'
        + badge(m.teamA.code, 'sm')
        + '<span class="mc-team-name">' + A.abbr + '</span>'
        + '<span class="mc-team-score">' + aScore + '</span>'
      + '</div>'
      + '<div class="match-card-team">'
        + badge(m.teamB.code, 'sm')
        + '<span class="mc-team-name">' + B.abbr + '</span>'
        + '<span class="mc-team-score">' + bScore + '</span>'
      + '</div>'
      + '<div class="match-card-status">' + m.statusText + '</div>'
      + watchBtn
    + '</div>';
  }).join('');
}

/* ---- UPCOMING --------------------------------------------- */
function renderUpcoming() {
  const up = MATCHES.filter(function (m) { return m.status === 'upcoming'; });
  const el = $('#upcomingMatches');
  if (!el) return;
  if (up.length === 0) { el.innerHTML = '<div style="color:var(--muted);padding:14px;font-size:13px;">No upcoming matches</div>'; return; }

  el.innerHTML = up.map(function (m) {
    const A = team(m.teamA.code);
    const B = team(m.teamB.code);
    return '<div class="match-row" onclick="openMatch(\'' + m.id + '\')">'
      + '<div class="match-row-head">'
        + '<span class="match-row-series">' + m.series + '</span>'
        + '<span class="match-row-status">' + (m.startsIn || 'TBD') + '</span>'
      + '</div>'
      + '<div class="match-row-teams">'
        + '<div class="mr-team"><div class="mr-team-left">' + badge(m.teamA.code) + '<span class="mr-team-name">' + A.name + '</span></div></div>'
        + '<div class="mr-team"><div class="mr-team-left">' + badge(m.teamB.code) + '<span class="mr-team-name">' + B.name + '</span></div></div>'
      + '</div>'
    + '</div>';
  }).join('');
}

/* ---- RECENT RESULTS --------------------------------------- */
function renderRecent() {
  const res = MATCHES.filter(function (m) { return m.status === 'result'; });
  const el = $('#recentMatches');
  if (!el) return;
  if (res.length === 0) { el.innerHTML = '<div style="color:var(--muted);padding:14px;font-size:13px;">No results yet</div>'; return; }

  el.innerHTML = res.map(function (m) {
    const A = team(m.teamA.code);
    const B = team(m.teamB.code);
    const bWon = (m.result || m.statusText || '').toLowerCase().indexOf(B.name.toLowerCase()) >= 0;
    const aClass = bWon ? 'loss' : 'win';
    const bClass = bWon ? 'win' : 'loss';
    const aScore = m.teamA.runs + '/' + m.teamA.wkts;
    const bScore = m.teamB.overs ? (m.teamB.runs + '/' + m.teamB.wkts) : '-';

    return '<div class="match-row" onclick="openMatch(\'' + m.id + '\')">'
      + '<div class="match-row-head">'
        + '<span class="match-row-series">' + m.series + '</span>'
        + '<span class="match-row-status result">RESULT</span>'
      + '</div>'
      + '<div class="match-row-teams">'
        + '<div class="mr-team">'
          + '<div class="mr-team-left">' + badge(m.teamA.code) + '<span class="mr-team-name">' + A.name + '</span></div>'
          + '<span class="mr-team-score ' + aClass + '">' + aScore + '</span>'
        + '</div>'
        + '<div class="mr-team">'
          + '<div class="mr-team-left">' + badge(m.teamB.code) + '<span class="mr-team-name">' + B.name + '</span></div>'
          + '<span class="mr-team-score ' + bClass + '">' + bScore + '</span>'
        + '</div>'
      + '</div>'
      + '<div class="match-row-result">' + (m.result || m.statusText) + '</div>'
    + '</div>';
  }).join('');
}

/* ---- LIVE STREAMING TAB ----------------------------------- */
function renderStreamingTab() {
  const el = $('#streamList');
  if (!el) return;

  /* Group streams by match */
  const byMatch = {};
  STREAMS.forEach(function (s) {
    if (!byMatch[s.matchId]) byMatch[s.matchId] = [];
    byMatch[s.matchId].push(s);
  });

  const matchIds = Object.keys(byMatch);
  if (matchIds.length === 0) {
    el.innerHTML = '<div style="color:var(--muted);padding:20px;text-align:center;">No streams configured yet.<br>Add links to the STREAMS array in app.js</div>';
    return;
  }

  el.innerHTML = matchIds.map(function (mid) {
    const m = MATCHES.find(function (x) { return x.id === mid; });
    if (!m) return '';
    const A = team(m.teamA.code);
    const B = team(m.teamB.code);
    const streams = byMatch[mid];

    const streamButtons = streams.map(function (s, i) {
      return '<button class="stream-btn" onclick="playStream(\'' + mid + '\',' + i + ')">'
        + '&#9654; ' + s.platform
        + '</button>';
    }).join('');

    return '<div class="stream-card">'
      + '<div class="stream-match-head">'
        + badge(m.teamA.code)
        + '<div class="stream-match-title">'
          + '<div style="font-weight:800;font-size:13px;">' + A.abbr + ' vs ' + B.abbr + '</div>'
          + '<div style="font-size:11px;color:var(--muted);">' + m.series + '</div>'
        + '</div>'
        + (m.status === 'live' ? '<span class="live-pill">LIVE</span>' : '')
      + '</div>'
      + '<div class="stream-buttons">' + streamButtons + '</div>'
    + '</div>';
  }).join('');
}

/* ---- PLAY STREAM ------------------------------------------ */
function playStream(matchId, streamIdx) {
  const streams = getStreamsFor(matchId);
  const s = streams[streamIdx];
  if (!s) return;

  if (s.embed) {
    /* Show in modal iframe */
    $('#modalBody').innerHTML =
      '<div style="font-size:14px;font-weight:800;margin-bottom:12px;">' + s.platform + '</div>'
      + '<div class="stream-frame-wrap">'
        + '<iframe src="' + s.url + '" allowfullscreen allow="autoplay; encrypted-media" frameborder="0"></iframe>'
      + '</div>';
    $('#matchModal').classList.add('open');
  } else {
    /* Open in new tab */
    window.open(s.url, '_blank', 'noopener,noreferrer');
  }
}

/* ---- SERIES / TEAMS / RANKINGS / NEWS (unchanged) -------- */
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
        const t = team(tc);
        return '<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;background:var(--card-2);border-radius:12px;font-size:11px;font-weight:800;">' + t.abbr + '</span>';
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

  const o = $('#ongoingSeries'); if (o) o.innerHTML = renderList(SERIES.filter(function (s) { return s.ongoing; }));
  const u = $('#upcomingSeries'); if (u) u.innerHTML = renderList(SERIES.filter(function (s) { return !s.ongoing; }));
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
    html += '<tr>'
      + '<td class="pos">' + r.pos + '</td>'
      + '<td class="name">' + badge(r.team, 'sm') + '<span>' + r.name + '</span></td>'
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

/* ---- MATCH MODAL (with streaming buttons) ----------------- */
function openMatch(id) {
  const m = MATCHES.find(function (x) { return x.id === id; });
  if (!m) return;
  const A = team(m.teamA.code);
  const B = team(m.teamB.code);

  const scoreStr = function (t) {
    return t.overs ? (t.runs + '/' + t.wkts + ' (' + t.overs + ')') : 'Yet to bat';
  };

  let statusHtml = '';
  if (m.status === 'live') {
    statusHtml = '<div style="color:var(--orange);font-weight:800;font-size:13px;margin-bottom:16px;">LIVE - ' + m.statusText + '</div>';
  } else if (m.status === 'result') {
    statusHtml = '<div style="color:var(--accent);font-weight:800;font-size:13px;margin-bottom:16px;">RESULT - ' + (m.result || m.statusText) + '</div>';
  } else {
    statusHtml = '<div style="color:var(--cyan);font-weight:800;font-size:13px;margin-bottom:16px;">Starts in ' + (m.startsIn || 'TBD') + '</div>';
  }

  /* Streaming buttons */
  const streams = getStreamsFor(m.id);
  let streamHtml = '';
  if (streams.length > 0) {
    streamHtml = '<div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border);">'
      + '<div style="font-size:10.5px;font-weight:900;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Watch Live On</div>'
      + '<div style="display:flex;flex-direction:column;gap:8px;">'
      + streams.map(function (s, i) {
          return '<button class="stream-btn" onclick="playStream(\'' + m.id + '\',' + i + ')">&#9654; ' + s.platform + '</button>';
        }).join('')
      + '</div></div>';
  }

  $('#modalBody').innerHTML =
    '<div style="font-size:11px;font-weight:900;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">' + m.series + '</div>'
    + '<div style="font-size:13px;color:var(--muted);font-weight:700;margin-bottom:20px;">' + m.venue + ' - ' + m.format + '</div>'
    + '<div style="background:var(--card-2);border-radius:12px;padding:18px;margin-bottom:16px;">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">'
        + '<div style="display:flex;align-items:center;gap:10px;">' + badge(m.teamA.code) + '<span style="font-size:15px;font-weight:800;">' + A.name + '</span></div>'
        + '<span style="font-size:18px;font-weight:900;">' + scoreStr(m.teamA) + '</span>'
      + '</div>'
      + '<div style="display:flex;justify-content:space-between;align-items:center;">'
        + '<div style="display:flex;align-items:center;gap:10px;">' + badge(m.teamB.code) + '<span style="font-size:15px;font-weight:800;">' + B.name + '</span></div>'
        + '<span style="font-size:18px;font-weight:900;">' + scoreStr(m.teamB) + '</span>'
      + '</div>'
    + '</div>'
    + statusHtml
    + streamHtml;

  $('#matchModal').classList.add('open');
}

/* ---- TAB SWITCHING ---------------------------------------- */
function switchTab(name) {
  $$('.tab').forEach(function (t) { t.classList.toggle('active', t.dataset.tab === name); });
  $$('.bnav').forEach(function (t) { t.classList.toggle('active', t.dataset.tab === name); });
  $$('.pane').forEach(function (p) { p.classList.remove('active'); });
  const pane = $('#pane-' + name);
  if (pane) pane.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- LOAD MATCHES (API or fallback) ----------------------- */
function loadMatches() {
  /* Show loading state */
  const el = $('#liveMatches');
  if (el) el.innerHTML = '<div style="color:var(--muted);padding:14px;font-size:13px;">Loading live matches...</div>';

if (typeof BigBallsAPI !== 'undefined' && BigBallsAPI.hasApiKey()) {
    BigBallsAPI.fetchMatches()
      .then(function (matches) {
        if (matches.length === 0) throw new Error('API returned 0 matches');
        MATCHES = matches;
        usingLiveApi = true;
        console.log('[Cricbuzz] Loaded', matches.length, 'real matches from CricAPI');
        refreshAll();
      })
      .catch(function (err) {
        console.warn('[Cricbuzz] API failed, using mock data:', err.message);
        MATCHES = MOCK_MATCHES.slice();
        usingLiveApi = false;
        refreshAll();
      });
  } else {
    console.info('[Cricbuzz] No API key set - using mock data');
    MATCHES = MOCK_MATCHES.slice();
    usingLiveApi = false;
    refreshAll();
  }
}

function refreshAll() {
  renderFeatured();
  renderLive();
  renderUpcoming();
  renderRecent();
  renderStreamingTab();
}

/* ---- BOOT ------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  /* Modal close */
  const closeBtn = document.getElementById('modalClose');
  const modal = document.getElementById('matchModal');
  if (closeBtn) closeBtn.onclick = function () { modal.classList.remove('open'); };
  if (modal) modal.onclick = function (e) { if (e.target.id === 'matchModal') modal.classList.remove('open'); };

  /* Tabs */
  $$('.tab, .bnav').forEach(function (el) {
    el.onclick = function () { switchTab(el.dataset.tab); };
  });

  /* Rankings sub-tabs */
  $$('.rank-tab').forEach(function (el) {
    el.onclick = function () {
      $$('.rank-tab').forEach(function (t) { t.classList.remove('active'); });
      el.classList.add('active');
      renderRankings(el.dataset.rank);
    };
  });

  /* Theme */
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

  /* Static sections */
  renderSeries();
  renderTeams();
  renderRankings('batting');
  renderNews();

  /* Live matches (API or mock) */
  loadMatches();

  /* Auto-refresh every 90 seconds */
  setInterval(function () {
    if (usingLiveApi) {
   BigBallsAPI.fetchMatches().then(function (m) {
        MATCHES = m;
        refreshAll();
      }).catch(function () {});
    }
  }, 90000);

  console.log('[Cricbuzz] App booted successfully');
});
