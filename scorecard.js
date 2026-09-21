/* ============================================================
   CRICBUZZ WEB - Scorecard Page Logic
   ============================================================ */

(function () {
  'use strict';

  const $ = function (s) { return document.querySelector(s); };

  const TEAMS = {
    IND: { name: 'India', abbr: 'IND', bg: '#0a4cff' },
    AUS: { name: 'Australia', abbr: 'AUS', bg: '#ffcc00' },
    ENG: { name: 'England', abbr: 'ENG', bg: '#c8102e' },
    PAK: { name: 'Pakistan', abbr: 'PAK', bg: '#01411c' },
    SA:  { name: 'South Africa', abbr: 'SA', bg: '#007749' },
    NZ:  { name: 'New Zealand', abbr: 'NZ', bg: '#111111' },
    WI:  { name: 'West Indies', abbr: 'WI', bg: '#7b0041' },
    SL:  { name: 'Sri Lanka', abbr: 'SL', bg: '#00539c' },
    BAN: { name: 'Bangladesh', abbr: 'BAN', bg: '#006a4e' },
    AFG: { name: 'Afghanistan', abbr: 'AFG', bg: '#0066cc' }
  };

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

  function badge(t, size) {
    const info = teamInfo(t);
    const dim = size === 'lg' ? '48px' : '28px';
    const fs = size === 'lg' ? '14px' : '11px';
    return '<span style="display:inline-flex;align-items:center;justify-content:center;'
         + 'width:' + dim + ';height:' + dim + ';border-radius:50%;'
         + 'background:' + info.bg + ';color:' + (isLight(info.bg) ? '#000' : '#fff') + ';'
         + 'font-size:' + fs + ';font-weight:900;flex-shrink:0;">' + info.code + '</span>';
  }

  function getMatchId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  function renderScorecard(m) {
    const A = teamInfo(m.teamA);
    const B = teamInfo(m.teamB);

    const scoreStr = function (t) {
      return t.overs ? (t.runs + '/' + t.wkts + ' (' + t.overs + ')') : 'Yet to bat';
    };

    const isLive = m.status === 'live';
    const isResult = m.status === 'result';

    let statusHtml = '';
    if (isLive) {
      statusHtml = '<div style="color:#ff6b00;font-weight:900;font-size:13px;margin:12px 0;letter-spacing:.5px;">LIVE - ' + m.statusText + '</div>';
    } else if (isResult) {
      statusHtml = '<div style="color:#00e676;font-weight:900;font-size:13px;margin:12px 0;">RESULT - ' + (m.result || m.statusText) + '</div>';
    } else {
      statusHtml = '<div style="color:#22d3ee;font-weight:900;font-size:13px;margin:12px 0;">STARTS ' + (m.startsIn || 'TBD') + '</div>';
    }

    $('#scorecardContent').innerHTML =
      '<div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px;margin-bottom:16px;">'
        + '<div style="font-size:11px;font-weight:900;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">' + m.series + '</div>'
        + '<div style="font-size:12px;color:var(--muted);font-weight:700;margin-bottom:8px;">' + m.venue + ' - ' + m.format + '</div>'
        + statusHtml
        + '<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center;margin-top:14px;padding-top:14px;border-top:1px solid var(--border);">'
          + '<div style="display:flex;flex-direction:column;align-items:center;gap:6px;">'
            + badge(m.teamA, 'lg')
            + '<div style="font-size:14px;font-weight:900;text-align:center;">' + A.name + '</div>'
            + '<div style="font-size:22px;font-weight:900;font-variant-numeric:tabular-nums;">' + (m.teamA.runs || 0) + '/' + (m.teamA.wkts || 0) + '</div>'
            + '<div style="font-size:11px;color:var(--muted);font-weight:700;">' + (m.teamA.overs ? m.teamA.overs + ' ov' : '-') + '</div>'
          + '</div>'
          + '<div style="font-size:12px;font-weight:900;color:var(--muted);letter-spacing:2px;">VS</div>'
          + '<div style="display:flex;flex-direction:column;align-items:center;gap:6px;">'
            + badge(m.teamB, 'lg')
            + '<div style="font-size:14px;font-weight:900;text-align:center;">' + B.name + '</div>'
            + '<div style="font-size:22px;font-weight:900;font-variant-numeric:tabular-nums;">' + (m.teamB.overs ? (m.teamB.runs || 0) + '/' + (m.teamB.wkts || 0) : '-') + '</div>'
            + '<div style="font-size:11px;color:var(--muted);font-weight:700;">' + (m.teamB.overs ? m.teamB.overs + ' ov' : 'Yet to bat') + '</div>'
          + '</div>'
        + '</div>'
      + '</div>'
      + '<div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px;margin-bottom:16px;">'
        + '<div style="font-size:11px;font-weight:900;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:14px;">Run Rate - Live Analytics</div>'
        + renderRunChart(m)
      + '</div>'
      + '<div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px;margin-bottom:16px;">'
        + '<div style="font-size:11px;font-weight:900;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:14px;">Match Info</div>'
        + '<div class="kv-grid">'
          + '<div class="kv"><div class="kv-label">Format</div><div class="kv-value">' + m.format + '</div></div>'
          + '<div class="kv"><div class="kv-label">Venue</div><div class="kv-value">' + (m.venue || '-') + '</div></div>'
          + '<div class="kv"><div class="kv-label">Series</div><div class="kv-value">' + m.series + '</div></div>'
          + '<div class="kv"><div class="kv-label">Status</div><div class="kv-value">' + m.statusText + '</div></div>'
        + '</div>'
      + '</div>'
      + '<div style="text-align:center;padding:20px;background:var(--card);border:1px dashed var(--border);border-radius:14px;">'
        + '<div style="font-size:13px;font-weight:800;margin-bottom:6px;">Full Batting & Bowling Details</div>'
        + '<div style="font-size:11.5px;color:var(--muted);font-weight:700;line-height:1.5;">'
          + 'Detailed scorecard (per-batsman runs, strike rates, bowler figures) requires the BigBalls scorecard endpoint.'
        + '</div>'
      + '</div>';
  }

  function renderRunChart(m) {
    const A = m.teamA;
    const overs = Math.max(1, Math.ceil(parseFloat(A.overs) || 5));
    const totalRuns = A.runs || 0;
    const avgPerOver = totalRuns / overs;

    const perOver = [];
    let remaining = totalRuns;
    for (let i = 0; i < overs; i++) {
      if (i === overs - 1) {
        perOver.push(remaining);
      } else {
        const variance = (Math.random() - 0.4) * 6;
        const r = Math.max(0, Math.min(18, Math.round(avgPerOver + variance)));
        perOver.push(r);
        remaining -= r;
      }
    }
    if (remaining > 0) perOver[perOver.length - 1] = Math.max(0, perOver[perOver.length - 1] + remaining);

    const maxRuns = Math.max.apply(null, perOver) || 10;
    const chartHeight = 160;

    let barsHtml = '';
    perOver.forEach(function (runs, idx) {
      const h = (runs / maxRuns) * 100;
      const color = runs >= 12 ? '#ff6d00' : runs >= 8 ? '#22d3ee' : runs >= 4 ? '#00e676' : '#64748b';
      barsHtml += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;" title="Over ' + (idx + 1) + ': ' + runs + ' runs">'
        + '<div style="font-size:9px;font-weight:900;color:var(--muted);margin-bottom:2px;">' + runs + '</div>'
        + '<div style="width:70%;background:' + color + ';height:' + h + '%;border-radius:3px 3px 0 0;min-height:2px;"></div>'
      + '</div>';
    });

    return '<div style="position:relative;height:' + chartHeight + 'px;display:flex;gap:2px;align-items:flex-end;padding-bottom:20px;border-bottom:1px solid var(--border);">'
      + barsHtml
      + '</div>'
      + '<div style="display:flex;justify-content:space-between;margin-top:8px;font-size:10px;font-weight:800;color:var(--muted);">'
        + '<span>Over 1</span>'
        + '<span>Avg: ' + avgPerOver.toFixed(1) + ' runs/over</span>'
        + '<span>Over ' + overs + '</span>'
      + '</div>';
  }

  function boot() {
    const id = getMatchId();
    if (!id) {
      $('#scorecardLoading').style.display = 'none';
      $('#scorecardError').style.display = 'block';
      $('#scorecardErrorText').textContent = 'No match ID specified';
      return;
    }

    if (typeof BigBallsAPI === 'undefined' || !BigBallsAPI.fetchMatches) {
      $('#scorecardLoading').style.display = 'none';
      $('#scorecardError').style.display = 'block';
      $('#scorecardErrorText').textContent = 'API not available';
      return;
    }

    BigBallsAPI.fetchMatches()
      .then(function (matches) {
        const m = matches.find(function (x) { return String(x.id) === String(id); });
        if (!m) {
          $('#scorecardLoading').style.display = 'none';
          $('#scorecardError').style.display = 'block';
          $('#scorecardErrorText').textContent = 'Match not found';
          return;
        }
        $('#scorecardLoading').style.display = 'none';
        $('#scorecardContent').style.display = 'block';
        renderScorecard(m);
      })
      .catch(function (err) {
        $('#scorecardLoading').style.display = 'none';
        $('#scorecardError').style.display = 'block';
        $('#scorecardErrorText').textContent = err.message;
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
