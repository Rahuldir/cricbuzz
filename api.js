/* ============================================================
   CRICBUZZ WEB - Real Match Data via CricAPI
   Free tier: 100 requests/day
   Sign up: https://cricapi.com/register
   ============================================================ */

const CricAPI = (function () {

  /* ⚠️ PUT YOUR API KEY HERE ⚠️
     Get it free at: https://cricapi.com/register */
  const API_KEY = 'YOUR_CRICAPI_KEY_HERE';

  const BASE = 'https://api.cricapi.com/v1';
  const CACHE_MS = 60 * 1000; /* cache for 60s to save API calls */

  let cache = { matches: null, time: 0 };

  /* ---- Map CricAPI team names to short codes ---------------- */
  function toCode(name) {
    if (!name) return '???';
    const n = name.toLowerCase();
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
    return name.substring(0, 3).toUpperCase();
  }

  /* ---- Convert CricAPI match to our internal format --------- */
  function convertMatch(raw) {
    const teamInfo = raw.teamInfo || [];
    const teams = raw.teams || [];

    const codeA = toCode(teamInfo[0] ? teamInfo[0].shortname : teams[0]);
    const codeB = toCode(teamInfo[1] ? teamInfo[1].shortname : teams[1]);

    /* Parse scores */
    let scoreA = null, scoreB = null;
    if (Array.isArray(raw.score)) {
      raw.score.forEach(function (s) {
        if (s.inning && s.inning.toLowerCase().indexOf((teams[0] || '').toLowerCase()) >= 0) {
          scoreA = s;
        } else if (s.inning && s.inning.toLowerCase().indexOf((teams[1] || '').toLowerCase()) >= 0) {
          scoreB = s;
        }
      });
    }

    /* Determine status */
    let status = 'upcoming';
    let statusText = raw.status || 'Match yet to begin';
    if (raw.matchEnded) {
      status = 'result';
    } else if (raw.matchStarted) {
      status = 'live';
    }

    /* Format */
    const fmt = (raw.matchType || 'T20').toUpperCase();

    return {
      id: raw.id,
      status: status,
      series: raw.name || 'Match',
      venue: raw.venue || '',
      format: fmt,
      teamA: {
        code: codeA,
        runs: scoreA ? scoreA.r : 0,
        wkts: scoreA ? scoreA.w : 0,
        overs: scoreA ? String(scoreA.o) : ''
      },
      teamB: {
        code: codeB,
        runs: scoreB ? scoreB.r : 0,
        wkts: scoreB ? scoreB.w : 0,
        overs: scoreB ? String(scoreB.o) : ''
      },
      statusText: statusText,
      result: status === 'result' ? statusText : '',
      startsIn: status === 'upcoming' ? formatTime(raw.dateTimeGMT) : '',
      raw: raw
    };
  }

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
    } catch (e) { return 'TBD'; }
  }

  /* ---- Fetch matches from API ------------------------------- */
  function fetchMatches() {
    return new Promise(function (resolve, reject) {
      if (!API_KEY || API_KEY === 'YOUR_CRICAPI_KEY_HERE') {
        reject(new Error('No API key configured'));
        return;
      }

      /* Return cached if fresh */
      if (cache.matches && (Date.now() - cache.time) < CACHE_MS) {
        resolve(cache.matches);
        return;
      }

      const url = BASE + '/currentMatches?apikey=' + encodeURIComponent(API_KEY) + '&offset=0';

      fetch(url)
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json.status !== 'success' || !Array.isArray(json.data)) {
            reject(new Error('API returned no data'));
            return;
          }
          const converted = json.data
            .filter(function (m) { return m && m.id; })
            .map(convertMatch);

          cache.matches = converted;
          cache.time = Date.now();

          /* Log quota info */
          if (json.info) {
            console.log('[CricAPI] Hits today:', json.info.hitsToday, '/', json.info.hitsLimit);
          }

          resolve(converted);
        })
        .catch(function (err) {
          console.warn('[CricAPI] Fetch failed:', err.message);
          reject(err);
        });
    });
  }

  return {
    fetchMatches: fetchMatches,
    toCode: toCode,
    formatTime: formatTime,
    hasApiKey: function () { return API_KEY && API_KEY !== 'YOUR_CRICAPI_KEY_HERE'; }
  };

})();
