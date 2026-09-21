/* ============================================================
   CRICBUZZ WEB - BigBalls Sports API Integration
   Endpoint: https://api.bigballsdata.com/v1/matches
   Auth: Bearer token in header
   ============================================================ */

const BigBallsAPI = (function () {
  'use strict';

  /* ==========================================================
     ⚙️ CONFIG
     ========================================================== */
  const API_KEY = 'bbs_live_00000QiC3quffRrdRw0nO2SZQKjsXt7q3TtJt42ez3S0nAGr';
  const BASE_URL = 'https://api.bigballsdata.com';
  const MATCHES_PATH = '/v1/matches';

  /* Query parameters — tweak to filter what you want */
  const DEFAULT_PARAMS = {
    sport: 'cricket',
    limit: 40
    /* Uncomment any of these to narrow the scope:
       league: 't20i',
       league: 'ipl',
       status: 'live',
       from: '2026-01-01'
    */
  };

  const CACHE_MS = 60 * 1000;
  let cache = { data: null, time: 0 };

  /* ==========================================================
     TEAM NAME -> CODE
     ========================================================== */
  function toCode(name) {
    if (!name) return '???';
    const n = String(name).toLowerCase();

    if (n.indexOf('india')     >= 0 && n.indexOf('women') < 0) return 'IND';
    if (n.indexOf('australia') >= 0) return 'AUS';
    if (n.indexOf('england')   >= 0) return 'ENG';
    if (n.indexOf('pakistan')  >= 0) return 'PAK';
    if (n.indexOf('south africa') >= 0) return 'SA';
    if (n.indexOf('new zealand')  >= 0) return 'NZ';
    if (n.indexOf('west indies')  >= 0) return 'WI';
    if (n.indexOf('sri lanka')    >= 0) return 'SL';
    if (n.indexOf('bangladesh')   >= 0) return 'BAN';
    if (n.indexOf('afghanistan')  >= 0) return 'AFG';
    if (n.indexOf('zimbabwe')     >= 0) return 'ZIM';
    if (n.indexOf('ireland')      >= 0) return 'IRE';

    if (n.indexOf('mumbai')    >= 0) return 'MI';
    if (n.indexOf('chennai')   >= 0) return 'CSK';
    if (n.indexOf('royal challengers') >= 0 || n.indexOf('bengaluru') >= 0) return 'RCB';
    if (n.indexOf('kolkata')   >= 0) return 'KKR';
    if (n.indexOf('delhi')     >= 0) return 'DC';
    if (n.indexOf('hyderabad') >= 0) return 'SRH';
    if (n.indexOf('rajasthan') >= 0) return 'RR';
    if (n.indexOf('punjab')    >= 0) return 'PBKS';
    if (n.indexOf('gujarat')   >= 0) return 'GT';
    if (n.indexOf('lucknow')   >= 0) return 'LSG';

    return String(name).substring(0, 3).toUpperCase();
  }

  /* ==========================================================
     HELPER - find a field in an object using multiple possible keys
     ========================================================== */
  function pick(obj, keys) {
    if (!obj) return undefined;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return undefined;
  }

  /* ==========================================================
     PARSE SCORE OBJECT - handles many possible shapes
     ========================================================== */
  function parseScore(s) {
    if (!s && s !== 0) return { runs: 0, wkts: 0, overs: '' };

    if (typeof s === 'number') return { runs: s, wkts: 0, overs: '' };

    if (typeof s === 'string') {
      const m = s.match(/(\d+)\s*\/\s*(\d+)\s*(?:\(([\d.]+)\))?/);
      if (m) return { runs: parseInt(m[1]) || 0, wkts: parseInt(m[2]) || 0, overs: m[3] || '' };
      const n = parseInt(s);
      return { runs: isNaN(n) ? 0 : n, wkts: 0, overs: '' };
    }

    if (typeof s === 'object') {
      return {
        runs:  pick(s, ['runs', 'r', 'score', 'total', 'run']) || 0,
        wkts:  pick(s, ['wickets', 'w', 'wkts', 'out']) || 0,
        overs: String(pick(s, ['overs', 'o', 'over']) || '')
      };
    }

    return { runs: 0, wkts: 0, overs: '' };
  }

  /* ==========================================================
     CONVERT BigBalls match object -> internal format
     ========================================================== */
  function convertMatch(raw) {
    if (!raw) return null;

    /* Find the two teams. Field name variants we handle:
       - teams
       - teamInfo
       - homeTeam + awayTeam
       - home + away
       - participants
       - competitors                                              */
    let team1 = null;
    let team2 = null;

    if (Array.isArray(raw.teams) && raw.teams.length >= 2) {
      team1 = raw.teams[0];
      team2 = raw.teams[1];
    } else if (Array.isArray(raw.teamInfo) && raw.teamInfo.length >= 2) {
      team1 = raw.teamInfo[0];
      team2 = raw.teamInfo[1];
    } else if (raw.homeTeam && raw.awayTeam) {
      team1 = raw.homeTeam;
      team2 = raw.awayTeam;
    } else if (raw.home && raw.away) {
      team1 = raw.home;
      team2 = raw.away;
    } else if (Array.isArray(raw.participants) && raw.participants.length >= 2) {
      team1 = raw.participants[0];
      team2 = raw.participants[1];
    } else if (Array.isArray(raw.competitors) && raw.competitors.length >= 2) {
      team1 = raw.competitors[0];
      team2 = raw.competitors[1];
    }

    /* If team is a string, wrap it into an object */
    if (typeof team1 === 'string') team1 = { name: team1 };
    if (typeof team2 === 'string') team2 = { name: team2 };
    team1 = team1 || {};
    team2 = team2 || {};

    const name1 = pick(team1, ['name', 'teamName', 'fullName', 'title', 'displayName']) || '';
    const name2 = pick(team2, ['name', 'teamName', 'fullName', 'title', 'displayName']) || '';

    const short1 = pick(team1, ['shortName', 'shortname', 'abbr', 'abbreviation', 'code']);
    const short2 = pick(team2, ['shortName', 'shortname', 'abbr', 'abbreviation', 'code']);

    const codeA = short1 ? String(short1).toUpperCase() : toCode(name1);
    const codeB = short2 ? String(short2).toUpperCase() : toCode(name2);

    /* Find scores — several possible shapes */
    let scoreA = null;
    let scoreB = null;

    /* Shape 1: raw.score = [ {teamA:...}, {teamB:...} ] or [ obj, obj ] */
    const scoreArr = pick(raw, ['score', 'scores', 'innings']);
    if (Array.isArray(scoreArr)) {
      /* Try to match by team id/name */
      const idA = pick(team1, ['id', 'teamId', '_id']);
      const idB = pick(team2, ['id', 'teamId', '_id']);

      scoreArr.forEach(function (s, idx) {
        const sid = pick(s, ['teamId', 'id', 'team']);
        const sname = String(pick(s, ['teamName', 'inning', 'name']) || '').toLowerCase();

        if (idA && sid && String(sid) === String(idA)) { scoreA = s; return; }
        if (idB && sid && String(sid) === String(idB)) { scoreB = s; return; }

        if (sname && name1 && sname.indexOf(name1.toLowerCase()) >= 0) { scoreA = s; return; }
        if (sname && name2 && sname.indexOf(name2.toLowerCase()) >= 0) { scoreB = s; return; }

        if (idx === 0 && !scoreA) scoreA = s;
        else if (idx === 1 && !scoreB) scoreB = s;
      });
    }

    /* Shape 2: score is directly on the team object */
    if (!scoreA) scoreA = pick(team1, ['score', 'runs', 'total', 'runsScored']);
    if (!scoreB) scoreB = pick(team2, ['score', 'runs', 'total', 'runsScored']);

    /* Shape 3: top-level fields like team1Score, homeScore */
    if (!scoreA) scoreA = pick(raw, ['team1Score', 'homeScore', 'scoreA']);
    if (!scoreB) scoreB = pick(raw, ['team2Score', 'awayScore', 'scoreB']);

    const sA = parseScore(scoreA);
    const sB = parseScore(scoreB);

    /* Status */
    let statusText = String(
      pick(raw, ['status', 'matchStatus', 'state', 'statusText', 'description']) || 'Match yet to begin'
    );

    const statusRaw = String(
      pick(raw, ['status', 'state', 'matchStatus']) || ''
    ).toLowerCase();

    let status = 'upcoming';
    if (statusRaw.indexOf('live') >= 0 || statusRaw.indexOf('progress') >= 0 ||
        statusRaw.indexOf('innings break') >= 0 || statusRaw.indexOf('rain') >= 0) {
      status = 'live';
    } else if (statusRaw.indexOf('finish') >= 0 || statusRaw.indexOf('complete') >= 0 ||
               statusRaw.indexOf('result') >= 0 || statusRaw.indexOf('abandon') >= 0 ||
               statusRaw.indexOf('won') >= 0 || statusRaw.indexOf('draw') >= 0) {
      status = 'result';
    } else if (statusRaw.indexOf('schedul') >= 0 || statusRaw.indexOf('upcoming') >= 0 ||
               statusRaw.indexOf('toss') >= 0) {
      status = 'upcoming';
    } else {
      /* Fallback: use matchEnded / matchStarted flags */
      const ended = pick(raw, ['matchEnded', 'ended', 'isFinished', 'finished', 'isComplete']);
      const started = pick(raw, ['matchStarted', 'started', 'isLive', 'live', 'inProgress']);
      if (ended === true) status = 'result';
      else if (started === true) status = 'live';
    }

    /* Format / type */
    const fmtRaw = pick(raw, ['matchType', 'format', 'type', 'gameType']) || 'T20';
    const fmt = String(fmtRaw).toUpperCase();

    /* Series / tournament */
    const series = pick(raw, ['series', 'seriesName', 'tournament', 'competition', 'league', 'leagueName']) ||
                   pick(raw, ['name', 'title']) || 'Match';

    /* Venue */
    const venue = pick(raw, ['venue', 'stadium', 'location', 'ground', 'place']) || '';

    /* Start time */
    const startTime = pick(raw, ['startTime', 'dateTimeGMT', 'dateTime', 'date', 'startDate', 'startsAt']) || '';

    /* Build result string for completed matches */
    let result = '';
    if (status === 'result') result = statusText;

    return {
      id: String(pick(raw, ['id', '_id', 'matchId', 'eventId', 'fixtureId']) || ''),
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
      startsIn: status === 'upcoming' ? formatTime(startTime) : '',
      raw: raw
    };
  }

  function formatTime(iso) {
    if (!iso) return 'TBD';
    try {
      const d = new Date(iso);
      const diff = d - Date.now();
      if (isNaN(diff)) return 'TBD';
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
     FETCH MATCHES
     ========================================================== */
  function fetchMatches(customParams) {
    return new Promise(function (resolve, reject) {

      if (!API_KEY) {
        reject(new Error('No API key configured'));
        return;
      }

      if (cache.data && (Date.now() - cache.time) < CACHE_MS) {
        console.log('[BigBalls] Returning cached matches');
        resolve(cache.data);
        return;
      }

      const params = Object.assign({}, DEFAULT_PARAMS, customParams || {});
      const qs = new URLSearchParams();
      Object.keys(params).forEach(function (k) {
        if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
          qs.append(k, params[k]);
        }
      });

      const url = BASE_URL + MATCHES_PATH + '?' + qs.toString();
      console.log('[BigBalls] GET', url);

      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + API_KEY,
          'Accept': 'application/json'
        }
      })
        .then(function (res) {
          console.log('[BigBalls] HTTP', res.status);
          if (!res.ok) {
            return res.text().then(function (txt) {
              throw new Error('HTTP ' + res.status + ': ' + txt.substring(0, 200));
            });
          }
          return res.json();
        })
        .then(function (json) {
          console.log('[BigBalls] Response keys:', Object.keys(json || {}));

          /* Log a sample so we can see the shape */
          const arr = json && json.data;
          if (Array.isArray(arr) && arr.length > 0) {
            console.log('[BigBalls] Sample match:', arr[0]);
          }

          if (!Array.isArray(arr)) {
            console.warn('[BigBalls] No data array in response. Full response:');
            console.warn(json);
            reject(new Error('Response is not an array'));
            return;
          }

          const converted = arr
            .map(convertMatch)
            .filter(function (m) { return m && m.id; });

          console.log('[BigBalls] Converted', converted.length, 'matches');

          cache.data = converted;
          cache.time = Date.now();
          resolve(converted);
        })
        .catch(function (err) {
          console.warn('[BigBalls] Fetch failed:', err.message);
          reject(err);
        });
    });
  }

  /* ==========================================================
     TEST - run from console: BigBallsAPI.test()
     ========================================================== */
  function test() {
    console.log('=== BigBalls API Test ===');
    console.log('Key:', API_KEY.substring(0, 16) + '...');
    console.log('URL:', BASE_URL + MATCHES_PATH);

    cache.data = null;
    cache.time = 0;

    fetchMatches()
      .then(function (matches) {
        console.log('✅ SUCCESS — got', matches.length, 'matches');
        console.table(matches.slice(0, 5).map(function (m) {
          return {
            id: m.id,
            status: m.status,
            A: m.teamA.code + ' ' + m.teamA.runs + '/' + m.teamA.wkts,
            B: m.teamB.code + ' ' + m.teamB.runs + '/' + m.teamB.wkts,
            series: m.series
          };
        }));
      })
      .catch(function (err) {
        console.error('❌ FAILED:', err.message);
      });
  }

  /* ==========================================================
     PUBLIC API
     ========================================================== */
  return {
    fetchMatches: fetchMatches,
    toCode: toCode,
    test: test,
    hasApiKey: function () { return !!API_KEY; },
    clearCache: function () { cache = { data: null, time: 0 }; },
    setParams: function (p) {
      Object.keys(p).forEach(function (k) { DEFAULT_PARAMS[k] = p[k]; });
      cache = { data: null, time: 0 };
    }
  };

})();
