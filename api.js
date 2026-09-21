/* ============================================================
   CRICBUZZ WEB - BigBalls Sports API (Cricket Only)
   Matches actual BigBalls response schema
   ============================================================ */

const BigBallsAPI = (function () {
  'use strict';

  /* ==========================================================
     ⚙️ CONFIG
     ========================================================== */
  const API_KEY = 'bbs_live_00000vagmD6JXzLp8sWuI4JT2Bg3UGg1CThmiOAhOUwbJxFw';
  const BASE_URL = 'https://api.bigballsdata.com';
  const MATCHES_PATH = '/v1/matches';

  const DEFAULT_PARAMS = {
    sport: 'cricket',
    limit: 60
  };

  const CACHE_MS = 60 * 1000;
  let cache = { data: null, time: 0 };

  /* ==========================================================
     TEAM NAME → SHORT CODE
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
    if (n.indexOf('scotland')     >= 0) return 'SCO';
    if (n.indexOf('netherlands')  >= 0) return 'NED';
    if (n.indexOf('nepal')        >= 0) return 'NEP';
    if (n.indexOf('oman')         >= 0) return 'OMA';
    if (n.indexOf('united arab') >= 0 || n === 'uae') return 'UAE';
    if (n.indexOf('namibia')      >= 0) return 'NAM';
    if (n.indexOf('cayman')       >= 0) return 'CAY';
    if (n.indexOf('bermuda')      >= 0) return 'BMUDA';
    if (n.indexOf('canada')       >= 0) return 'CAN';
    if (n.indexOf('usa')          >= 0 || n.indexOf('united states') >= 0) return 'USA';
    if (n.indexOf('hong kong')    >= 0) return 'HK';
    if (n.indexOf('papua')        >= 0) return 'PNG';
    if (n.indexOf('kenya')        >= 0) return 'KEN';
    if (n.indexOf('uganda')       >= 0) return 'UGA';

    /* IPL */
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
     HELPERS
     ========================================================== */
  function pick(obj, keys) {
    if (!obj) return undefined;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return undefined;
  }

  function parseScore(s) {
    if (s === null || s === undefined) return { runs: 0, wkts: 0, overs: '' };

    if (typeof s === 'number') return { runs: s, wkts: 0, overs: '' };

    if (typeof s === 'string') {
      const m = s.match(/(\d+)\s*(?:\/\s*(\d+))?\s*(?:\(?\s*([\d.]+)\s*\)?)?/);
      if (m) {
        return {
          runs:  parseInt(m[1]) || 0,
          wkts:  parseInt(m[2]) || 0,
          overs: m[3] || ''
        };
      }
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

  function detectFormat(league) {
    if (!league) return 'CRICKET';
    const l = String(league).toUpperCase();
    if (l.indexOf('T20I') >= 0 || l.indexOf('T20 INTERNATIONAL') >= 0) return 'T20I';
    if (l.indexOf('T20') >= 0) return 'T20';
    if (l.indexOf('ODI') >= 0 || l.indexOf('ONE DAY') >= 0) return 'ODI';
    if (l.indexOf('TEST') >= 0) return 'TEST';
    if (l.indexOf('IPL') >= 0) return 'IPL';
    if (l.indexOf('BBL') >= 0) return 'BBL';
    if (l.indexOf('PSL') >= 0) return 'PSL';
    return 'CRICKET';
  }

  /* ==========================================================
     CONVERT BigBalls match → internal format
     ========================================================== */
  function convertMatch(raw) {
    if (!raw) return null;

    const sport = String(raw.sport || '').toLowerCase();
    if (sport && sport !== 'cricket') return null;

    /* Teams */
    const homeTeam = raw.home || {};
    const awayTeam = raw.away || {};

    const name1 = homeTeam.name || '';
    const name2 = awayTeam.name || '';
    const short1 = homeTeam.short_name || '';
    const short2 = awayTeam.short_name || '';

    const codeA = short1 ? String(short1).toUpperCase() : toCode(name1);
    const codeB = short2 ? String(short2).toUpperCase() : toCode(name2);

    /* Score */
    const scoreObj = raw.score || {};
    let sA = parseScore(scoreObj.home);
    let sB = parseScore(scoreObj.away);

    const linescore = raw.linescore;
    if (linescore) {
      const linescoreArr = Array.isArray(linescore) ? linescore : [linescore];
      linescoreArr.forEach(function (ls) {
        if (!ls) return;
        const lsTeamId = pick(ls, ['teamId', 'team_id', 'team', 'id']);
        const lsSide = pick(ls, ['side', 'position', 'teamType']);
        const lsRuns = pick(ls, ['runs', 'r', 'score', 'total']);
        const lsWkts = pick(ls, ['wickets', 'w', 'wkts']);
        const lsOvers = pick(ls, ['overs', 'o', 'over']);

        if (lsRuns !== undefined) {
          if (lsTeamId && homeTeam.id && String(lsTeamId) === String(homeTeam.id)) {
            sA = { runs: lsRuns, wkts: lsWkts || 0, overs: String(lsOvers || '') };
          } else if (lsTeamId && awayTeam.id && String(lsTeamId) === String(awayTeam.id)) {
            sB = { runs: lsRuns, wkts: lsWkts || 0, overs: String(lsOvers || '') };
          } else if (lsSide === 'home') {
            sA = { runs: lsRuns, wkts: lsWkts || 0, overs: String(lsOvers || '') };
          } else if (lsSide === 'away') {
            sB = { runs: lsRuns, wkts: lsWkts || 0, overs: String(lsOvers || '') };
          }
        }
      });
    }

    /* ---- Status (FIXED) ---- */
    const rawStatus = String(raw.status || '').toLowerCase();
    let status = 'upcoming';
    let statusText = 'Upcoming';

    if (rawStatus === 'live' || rawStatus === 'in_play' || rawStatus === 'inprogress' || rawStatus === 'progress') {
      status = 'live';
      statusText = 'Live';
    } else if (rawStatus === 'completed' || rawStatus === 'finished' || rawStatus === 'ended' ||
               rawStatus === 'final' || rawStatus === 'ft' || rawStatus === 'result') {
      status = 'result';
      statusText = 'Completed';
    } else if (rawStatus === 'cancelled' || rawStatus === 'postponed' ||
               rawStatus === 'abandoned' || rawStatus === 'suspended') {
      status = 'result';
      statusText = rawStatus.charAt(0).toUpperCase() + rawStatus.substring(1);
    }

    /* Auto-detect if status is upcoming but kickoff time has passed */
    if (status === 'upcoming' && raw.kickoff_utc) {
      const kickoffTime = new Date(raw.kickoff_utc).getTime();
      const now = Date.now();
      if (now > kickoffTime + 2 * 3600 * 1000) {
        status = 'result';
        statusText = 'Completed';
      } else if (now > kickoffTime) {
        status = 'live';
        statusText = 'Live';
      }
    }

    /* Series / format */
    const series = raw.league || 'Cricket Match';
    const format = detectFormat(series);
    const startTime = raw.kickoff_utc || '';

    return {
      id: String(raw.id || ''),
      status: status,
      series: series,
      venue: '',
      format: format,
      teamA: {
        code: codeA,
        name: name1,
        runs: sA.runs,
        wkts: sA.wkts,
        overs: sA.overs
      },
      teamB: {
        code: codeB,
        name: name2,
        runs: sB.runs,
        wkts: sB.wkts,
        overs: sB.overs
      },
      statusText: statusText,
      result: status === 'result' ? statusText : '',
      startsIn: status === 'upcoming' ? formatTime(startTime) : '',
      kickoff: startTime,
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
      if (h > 0)  return h + 'h ' + m + 'm';
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
        console.log('[BigBalls] Returning ' + cache.data.length + ' cached matches');
        resolve(cache.data);
        return;
      }

      const params = Object.assign({}, DEFAULT_PARAMS, customParams || {});
      params.sport = 'cricket';

      const qs = new URLSearchParams();
      Object.keys(params).forEach(function (k) {
        if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
          qs.append(k, params[k]);
        }
      });

      const url = BASE_URL + MATCHES_PATH + '?' + qs.toString();
      console.log('[BigBalls] GET ' + url);

      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + API_KEY,
          'Accept': 'application/json'
        }
      })
      .then(function (res) {
        console.log('[BigBalls] HTTP ' + res.status);
        if (!res.ok) {
          return res.text().then(function (txt) {
            throw new Error('HTTP ' + res.status + ': ' + txt.substring(0, 200));
          });
        }
        return res.json();
      })
      .then(function (json) {
        console.log('[BigBalls] Response keys:', Object.keys(json || {}));

        let arr = null;
        if (Array.isArray(json))              arr = json;
        else if (Array.isArray(json.data))    arr = json.data;
        else if (Array.isArray(json.matches)) arr = json.matches;
        else if (json && json.data && Array.isArray(json.data.matches)) arr = json.data.matches;

        if (!arr) {
          console.warn('[BigBalls] No array found:', json);
          reject(new Error('Could not find matches array'));
          return;
        }

        console.log('[BigBalls] Sample raw match:', arr[0]);

        const converted = arr
          .map(convertMatch)
          .filter(function (m) { return m && m.id; });

        console.log('[BigBalls] Converted ' + converted.length + ' cricket matches');

        cache.data = converted;
        cache.time = Date.now();
        resolve(converted);
      })
      .catch(function (err) {
        console.warn('[BigBalls] Fetch failed: ' + err.message);
        reject(err);
      });
    });
  }

  /* ==========================================================
     TEST
     ========================================================== */
  function test() {
    console.log('=== BigBalls API Test ===');
    cache.data = null;
    cache.time = 0;

    fetchMatches()
      .then(function (matches) {
        console.log('✅ SUCCESS — got ' + matches.length + ' cricket matches');
        console.table(matches.slice(0, 10).map(function (m) {
          return {
            status: m.status,
            A: m.teamA.code + ' ' + (m.teamA.overs ? m.teamA.runs + '/' + m.teamA.wkts : '-'),
            B: m.teamB.code + ' ' + (m.teamB.overs ? m.teamB.runs + '/' + m.teamB.wkts : '-'),
            format: m.format,
            series: m.series.substring(0, 30)
          };
        }));
      })
      .catch(function (err) {
        console.error('❌ FAILED: ' + err.message);
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
    setLeague: function (league) {
      if (league) DEFAULT_PARAMS.league = league;
      else delete DEFAULT_PARAMS.league;
      cache = { data: null, time: 0 };
    },
    setLimit: function (n) {
      DEFAULT_PARAMS.limit = n;
      cache = { data: null, time: 0 };
    }
  };

})();
