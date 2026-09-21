/* ============================================================
   CRICBUZZ WEB - Real Match Data via BigBalls Sports API
   Primary: BigBalls Sports
   Fallback: Mock data (in app.js)
   ============================================================ */

const BigBallsAPI = (function () {
  'use strict';

  /* ==========================================================
     ⚙️ CONFIGURATION - EDIT THIS SECTION IF NEEDED
     ========================================================== */

  /* Your API key */
  const API_KEY = 'bbs_live_00000QiC3quffRrdRw0nO2SZQKjsXt7q3TtJt42ez3S0nAGr';

  /* Base URL - change if the docs say something different */
  const BASE_URL = 'https://api.bigballsdata.com';

  /* Endpoint path - change if the docs say something different */
  const MATCHES_PATH = '/v1/cricket/matches';

  /* Alternative paths to try if primary fails (for debugging) */
  const FALLBACK_PATHS = [
    '/v1/cricket/matches/live',
    '/cricket/matches',
    '/v1/matches'
  ];

  /* How long to cache results (in milliseconds) */
  const CACHE_MS = 60 * 1000;

  /* ==========================================================
     INTERNAL STATE
     ========================================================== */
  let cache = { data: null, time: 0 };
  let workingPath = null; /* remembers which path succeeded */

  /* ==========================================================
     TEAM NAME -> SHORT CODE MAPPING
     ========================================================== */
  function toCode(name) {
    if (!name) return '???';
    const n = String(name).toLowerCase();

    /* International teams */
    if (n.indexOf('india') >= 0 && n.indexOf('women') < 0) return 'IND';
    if (n.indexOf('australia') >= 0) return 'AUS';
    if (n.indexOf('england') >= 0) return 'ENG';
    if (n.indexOf('pakistan') >= 0) return 'PAK';
    if (n.indexOf('south africa') >= 0) return 'SA';
    if (n.indexOf('new zealand') >= 0) return 'NZ';
    if (n.indexOf('west indies') >= 0) return 'WI';
    if (n.indexOf('sri lanka') >= 0) return 'SL';
    if (n.indexOf('bangladesh') >= 0) return 'BAN';
    if (n.indexOf('afghanistan') >= 0) return 'AFG';
    if (n.indexOf('zimbabwe') >= 0) return 'ZIM';
    if (n.indexOf('ireland') >= 0) return 'IRE';
    if (n.indexOf('scotland') >= 0) return 'SCO';
    if (n.indexOf('netherlands') >= 0) return 'NED';

    /* IPL / League teams */
    if (n.indexOf('mumbai') >= 0) return 'MI';
    if (n.indexOf('chennai') >= 0) return 'CSK';
    if (n.indexOf('royal challengers') >= 0 || n.indexOf('bengaluru') >= 0) return 'RCB';
    if (n.indexOf('kolkata') >= 0) return 'KKR';
    if (n.indexOf('delhi') >= 0) return 'DC';
    if (n.indexOf('hyderabad') >= 0) return 'SRH';
    if (n.indexOf('rajasthan') >= 0) return 'RR';
    if (n.indexOf('punjab') >= 0) return 'PBKS';
    if (n.indexOf('gujarat') >= 0) return 'GT';
    if (n.indexOf('lucknow') >= 0) return 'LSG';

    /* Fallback: first 3 letters uppercase */
    return String(name).substring(0, 3).toUpperCase();
  }

  /* ==========================================================
     HELPER - Pick first available field name
     Useful when API schemas vary between products
     ========================================================== */
  function pickField(obj, keys) {
    if (!obj) return undefined;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return undefined;
  }

  /* ==========================================================
     CONVERT BigBalls match -> Our internal format
     Handles multiple possible response schemas
     ========================================================== */
  function convertMatch(raw) {
    if (!raw) return null;

    /* Try to get teams array - various possible field names */
    const teamsRaw =
      pickField(raw, ['teamInfo', 'teams', 'competitors', 'participants']) || [];

    /* Try to get scores array */
    const scoresRaw =
      pickField(raw, ['score', 'scores', 'innings', 'teamScores']) || [];

    /* Extract two team objects */
    const team1 = teamsRaw[0] || {};
    const team2 = teamsRaw[1] || {};

    /* Team names - various possible field names */
    const name1 = pickField(team1, ['name', 'teamName', 'fullName', 'title']) || '';
    const name2 = pickField(team2, ['name', 'teamName', 'fullName', 'title']) || '';

    /* Try to get short names directly from API if available */
    const short1 = pickField(team1, ['shortname', 'shortName', 'abbr', 'code']);
    const short2 = pickField(team2, ['shortname', 'shortName', 'abbr', 'code']);

    const codeA = short1 ? String(short1).toUpperCase() : toCode(name1);
    const codeB = short2 ? String(short2).toUpperCase() : toCode(name2);

    /* Parse scores - match by team name or index */
    let scoreA = null;
    let scoreB = null;

    if (Array.isArray(scoresRaw) && scoresRaw.length > 0) {
      scoresRaw.forEach(function (s, idx) {
        const inning = String(pickField(s, ['inning', 'team', 'teamName']) || '').toLowerCase();
        if (name1 && inning && inning.indexOf(name1.toLowerCase()) >= 0) {
          scoreA = s;
        } else if (name2 && inning && inning.indexOf(name2.toLowerCase()) >= 0) {
          scoreB = s;
        } else if (idx === 0 && !scoreA) {
          scoreA = s;
        } else if (idx === 1 && !scoreB) {
          scoreB = s;
        }
      });
    }

    /* Also try direct team score fields */
    if (!scoreA) scoreA = pickField(team1, ['score', 'runs', 'total']);
    if (!scoreB) scoreB = pickField(team2, ['score', 'runs', 'total']);

    /* Extract numeric values from score objects */
    function extractScore(s) {
      if (!s) return { runs: 0, wkts: 0, overs: '' };
      if (typeof s === 'string') {
        /* Parse strings like "287/4 (42.3)" */
        const m = s.match(/(\d+)\s*\/\s*(\d+)\s*(?:\(([\d.]+)\))?/);
        if (m) return { runs: parseInt(m[1]) || 0, wkts: parseInt(m[2]) || 0, overs: m[3] || '' };
        return { runs: parseInt(s) || 0, wkts: 0, overs: '' };
      }
      if (typeof s === 'object') {
        return {
          runs:  pickField(s, ['r', 'runs', 'total', 'score']) || 0,
          wkts:  pickField(s, ['w', 'wickets', 'wkts']) || 0,
          overs: String(pickField(s, ['o', 'overs', 'over']) || '')
        };
      }
      return { runs: 0, wkts: 0, overs: '' };
    }

    const sA = extractScore(scoreA);
    const sB = extractScore(scoreB);

    /* Determine status */
    let status = 'upcoming';
    let statusText = pickField(raw, ['status', 'matchStatus', 'state', 'statusText']) || 'Match yet to begin';

    const ended = pickField(raw, ['matchEnded', 'ended', 'isFinished', 'finished']);
    const started = pickField(raw, ['matchStarted', 'started', 'isLive', 'live']);

    if (ended === true || ended === 'true') {
      status = 'result';
    } else if (started === true || started === 'true' || statusText.toLowerCase().indexOf('live') >= 0) {
      status = 'live';
    }

    /* Format */
    const fmtRaw = pickField(raw, ['matchType', 'format', 'type']) || 'T20';
    const fmt = String(fmtRaw).toUpperCase();

    /* Series name */
    const series = pickField(raw, ['name', 'series', 'tournament', 'seriesName', 'competition']) || 'Match';

    /* Venue */
    const venue = pickField(raw, ['venue', 'location', 'stadium']) || '';

    /* Date/time */
    const dateTime = pickField(raw, ['dateTimeGMT', 'startTime', 'date', 'startDate']) || '';

    /* Build result string */
    let result = '';
    if (status === 'result') {
      result = statusText;
    }

    return {
      id: String(pickField(raw, ['id', '_id', 'matchId', 'eventId']) || Math.random()),
      status: status,
      series: series,
      venue: venue,
      format: fmt,
      teamA: {
        code: codeA,
        runs: sA.runs,
        wkts: sA.wkts,
        overs: sA.overs
      },
      teamB: {
        code: codeB,
        runs: sB.runs,
        wkts: sB.wkts,
        overs: sB.overs
      },
      statusText: statusText,
      result: result,
      startsIn: status === 'upcoming' ? formatTime(dateTime) : '',
      raw: raw
    };
  }

  /* ==========================================================
     FORMAT TIME - Converts ISO date to "2h 15m" style
     ========================================================== */
  function formatTime(iso) {
    if (!iso) return 'TBD';
    try {
      const d = new Date(iso);
      const diff = d - Date.now();
      if (diff < 0) return 'Started';
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      if (h > 24) return Math.floor(h / 24) + 'd ' + (h % 24) + 'h';
      if (h > 0) return h + 'h ' + m + 'm';
      return m + 'm';
    } catch (e) {
      return 'TBD';
    }
  }

  /* ==========================================================
     BUILD REQUEST URL - Supports different auth patterns
     ========================================================== */
  function buildUrl(path) {
    /* Try query param style (most common) */
    const sep = path.indexOf('?') >= 0 ? '&' : '?';
    return BASE_URL + path + sep + 'apikey=' + encodeURIComponent(API_KEY);
  }

  /* ==========================================================
     FETCH FROM A SINGLE URL
     ========================================================== */
  function tryFetch(url) {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        /* Also send key in header - some APIs use this */
        'X-API-Key': API_KEY,
        'Authorization': 'Bearer ' + API_KEY
      }
    })
      .then(function (res) {
        if (!res.ok) {
          return res.text().then(function (txt) {
            throw new Error('HTTP ' + res.status + ': ' + txt.substring(0, 120));
          });
        }
        return res.json();
      });
  }

  /* ==========================================================
     MAIN FETCH FUNCTION
     ========================================================== */
  function fetchMatches() {
    return new Promise(function (resolve, reject) {

      if (!API_KEY || API_KEY.indexOf('YOUR_') === 0) {
        reject(new Error('No API key configured'));
        return;
      }

      /* Return cache if fresh */
      if (cache.data && (Date.now() - cache.time) < CACHE_MS) {
        console.log('[BigBalls] Returning cached matches');
        resolve(cache.data);
        return;
      }

      /* If we know the working path, use it directly */
      if (workingPath) {
        fetchFromPath(workingPath).then(resolve).catch(reject);
        return;
      }

      /* Otherwise, try paths in order until one works */
      const pathsToTry = [MATCHES_PATH].concat(FALLBACK_PATHS);

      function tryNextPath(idx) {
        if (idx >= pathsToTry.length) {
          reject(new Error('All endpoint paths failed'));
          return;
        }

        const path = pathsToTry[idx];
        console.log('[BigBalls] Trying endpoint:', path);

        fetchFromPath(path)
          .then(function (data) {
            workingPath = path;
            console.log('[BigBalls] OK - working path:', path);
            resolve(data);
          })
          .catch(function (err) {
            console.warn('[BigBalls] Path failed:', path, '-', err.message);
            tryNextPath(idx + 1);
          });
      }

      tryNextPath(0);
    });
  }

  /* ==========================================================
     FETCH FROM A SPECIFIC PATH
     ========================================================== */
  function fetchFromPath(path) {
    return new Promise(function (resolve, reject) {
      const url = buildUrl(path);
      console.log('[BigBalls] GET', url.replace(API_KEY, 'KEY_HIDDEN'));

      tryFetch(url)
        .then(function (json) {
          /* Debug: log the raw response shape */
          console.log('[BigBalls] Response keys:', Object.keys(json || {}));

          /* Try multiple possible data locations */
          let dataArr = null;

          if (Array.isArray(json)) {
            dataArr = json;
          } else if (json && Array.isArray(json.data)) {
            dataArr = json.data;
          } else if (json && Array.isArray(json.matches)) {
            dataArr = json.matches;
          } else if (json && Array.isArray(json.results)) {
            dataArr = json.results;
          } else if (json && json.data && Array.isArray(json.data.matches)) {
            dataArr = json.data.matches;
          }

          if (!dataArr) {
            /* Log entire response to help debug */
            console.warn('[BigBalls] Unexpected response shape. Full response:');
            console.warn(JSON.stringify(json).substring(0, 500));
            reject(new Error('Could not find matches array in response'));
            return;
          }

          /* Check for API error status */
          if (json && json.status && json.status !== 'success' && json.status !== 200) {
            reject(new Error('API error: ' + (json.reason || json.message || 'unknown')));
            return;
          }

          console.log('[BigBalls] Found', dataArr.length, 'matches');

          /* Convert each match */
          const converted = dataArr
            .map(convertMatch)
            .filter(function (m) { return m !== null; });

          /* Save to cache */
          cache.data = converted;
          cache.time = Date.now();

          /* Log API quota info if present */
          if (json.info) {
            console.log('[BigBalls] Info:', json.info);
          }

          resolve(converted);
        })
        .catch(reject);
    });
  }

  /* ==========================================================
     DEBUG - Test the connection manually
     Call from console: BigBallsAPI.test()
     ========================================================== */
  function test() {
    console.log('=== BigBalls API Test ===');
    console.log('Key:', API_KEY.substring(0, 20) + '...');
    console.log('Base URL:', BASE_URL);
    console.log('Primary path:', MATCHES_PATH);

    const url = buildUrl(MATCHES_PATH);
    console.log('Full URL:', url);

    fetchMatches()
      .then(function (matches) {
        console.log('SUCCESS - Got', matches.length, 'matches');
        console.log('First match:', matches[0]);
      })
      .catch(function (err) {
        console.error('FAILED:', err.message);
        console.log('Try these alternatives in console:');
        console.log('  BigBallsAPI.setBaseUrl("https://api.bigballsports.com")');
        console.log('  BigBallsAPI.setPath("/v1/matches")');
      });
  }

  /* ==========================================================
     PUBLIC API
     ========================================================== */
  return {
    fetchMatches: fetchMatches,
    toCode: toCode,
    test: test,
    hasApiKey: function () {
      return API_KEY && API_KEY.indexOf('YOUR_') !== 0;
    },
    /* Manual overrides for debugging */
    setBaseUrl: function (url) { BASE_URL = url; cache = { data: null, time: 0 }; workingPath = null; },
    setPath: function (path) { MATCHES_PATH = path; cache = { data: null, time: 0 }; workingPath = null; },
    getWorkingPath: function () { return workingPath; },
    clearCache: function () { cache = { data: null, time: 0 }; }
  };

})();
