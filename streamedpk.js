/* ============================================================
   CRICBUZZ WEB - streamed.pk Cricket Streams
   Endpoint: https://streamed.pk/api/matches/cricket/popular
   With CORS proxy fallback via allorigins
   ============================================================ */

const StreamedPK = (function () {
  'use strict';

  /* ==========================================================
     CONFIG
     ========================================================== */
  const PRIMARY_URL = 'https://streamed.pk/api/matches/cricket/popular';

  /* Fallback endpoints (in case primary is not cricket-specific) */
  const FALLBACK_URLS = [
    'https://streamed.pk/api/matches/cricket/popular',
    'https://streamed.pk/api/matches/cricket',
    'https://streamed.pk/api/live',
    'https://streamed.pk/api/popular'
  ];

  /* CORS proxies (used only if direct fetch fails) */
  const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?url='
  ];

  const CACHE_MS = 3 * 60 * 1000;

  /* ==========================================================
     STATE
     ========================================================== */
  let cachedStreams = null;
  let lastFetch = 0;
  let workingUrl = null;

  /* ==========================================================
     PARSE streamed.pk RESPONSE
     Handles multiple possible response shapes
     ========================================================== */
  function parseStreams(json) {
    if (!json) return [];

    /* Find the array of matches in the response */
    let raw = [];
    if (Array.isArray(json)) raw = json;
    else if (Array.isArray(json.matches)) raw = json.matches;
    else if (Array.isArray(json.data)) raw = json.data;
    else if (Array.isArray(json.streams)) raw = json.streams;
    else if (json.data && Array.isArray(json.data.matches)) raw = json.data.matches;
    else if (json.data && Array.isArray(json.data.streams)) raw = json.data.streams;
    else {
      console.warn('[StreamedPK] Unknown response shape:', Object.keys(json || {}));
      return [];
    }

    /* Filter to cricket only (in case API returns mixed sports) */
    const cricketMatches = raw.filter(function (item) {
      const cat = String(item.category || item.sport || item.league || '').toLowerCase();
      const title = String(item.title || item.name || '').toLowerCase();
      /* Accept if category explicitly says cricket OR no category filter */
      return !cat || cat.indexOf('cricket') >= 0 || title.indexOf('cricket') >= 0;
    });

    return cricketMatches.map(function (item) {
      /* Extract team names if present */
      let displayName = item.title || item.name || item.match || 'Cricket Stream';
      let teamA = '', teamB = '';

      if (item.teams) {
        teamA = (item.teams.home && item.teams.home.name) || item.teams.home || '';
        teamB = (item.teams.away && item.teams.away.name) || item.teams.away || '';
        if (teamA && teamB) displayName = teamA + ' vs ' + teamB;
      }

      /* Extract logo/poster */
      let logo = item.poster || item.thumbnail || item.image || '';
      if (!logo && item.teams) {
        const homeLogo = item.teams.home && item.teams.home.badge;
        if (homeLogo) logo = homeLogo;
      }

      /* Extract streams */
      let streams = [];
      if (Array.isArray(item.sources)) {
        streams = item.sources.map(function (s) {
          return {
            name: s.source || s.name || 'Stream',
            id: s.id || '',
            url: s.url || s.embed || ''
          };
        });
      } else if (Array.isArray(item.streams)) {
        streams = item.streams;
      }

      return {
        id: item.id || item.slug || '',
        name: displayName,
        category: 'Cricket',
        logo: logo,
        live: item.live === true || item.status === 'live' || item.isLive === true,
        time: item.date ? formatDate(item.date) : (item.time || ''),
        streams: streams,
        url: item.url || '',
        raw: item
      };
    });
  }

  function formatDate(ts) {
    try {
      const d = new Date(ts * 1000);
      if (isNaN(d.getTime())) return '';
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      if (isToday) return 'Today ' + hh + ':' + mm;
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return dd + '/' + mo + ' ' + hh + ':' + mm;
    } catch (e) {
      return '';
    }
  }

  /* ==========================================================
     FETCH STREAMS
     ========================================================== */
  function fetchStreams(force) {
    if (!force && cachedStreams && (Date.now() - lastFetch) < CACHE_MS) {
      return Promise.resolve(cachedStreams);
    }

    if (workingUrl) {
      return tryFetchWithFallback(workingUrl).then(function (streams) {
        if (streams.length > 0) {
          cachedStreams = streams;
          lastFetch = Date.now();
          return streams;
        }
        throw new Error('Empty from cached URL');
      }).catch(function () {
        workingUrl = null;
        return tryAll();
      });
    }

    return tryAll();
  }

  function tryAll() {
    const urlsToTry = FALLBACK_URLS.slice();
    /* Move PRIMARY_URL to front */
    const primaryIdx = urlsToTry.indexOf(PRIMARY_URL);
    if (primaryIdx > 0) {
      urlsToTry.splice(primaryIdx, 1);
      urlsToTry.unshift(PRIMARY_URL);
    }

    function tryNext(idx) {
      if (idx >= urlsToTry.length) {
        console.warn('[StreamedPK] All endpoints failed');
        cachedStreams = [];
        return Promise.resolve([]);
      }

      const url = urlsToTry[idx];
      console.log('[StreamedPK] Trying: ' + url);

      return tryFetchWithFallback(url)
        .then(function (streams) {
          if (streams.length === 0) throw new Error('Empty result');
          workingUrl = url;
          console.log('[StreamedPK] ✅ Working: ' + url + ' (' + streams.length + ' streams)');
          cachedStreams = streams;
          lastFetch = Date.now();
          return streams;
        })
        .catch(function (err) {
          console.warn('[StreamedPK] ✗ ' + url + ' → ' + err.message);
          return tryNext(idx + 1);
        });
    }

    return tryNext(0);
  }

  /* Try direct fetch first, then CORS proxies */
  function tryFetchWithFallback(url) {
    return directFetch(url).catch(function (err) {
      console.warn('[StreamedPK] Direct fetch failed, trying proxy...');
      return tryProxies(url, 0);
    });
  }

  function directFetch(url) {
    return fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(parseStreams);
  }

  function tryProxies(url, idx) {
    if (idx >= CORS_PROXIES.length) {
      throw new Error('All proxies failed');
    }
    const proxied = CORS_PROXIES[idx] + encodeURIComponent(url);
    return fetch(proxied, {
      method: 'GET',
      cache: 'no-cache'
    }).then(function (res) {
      if (!res.ok) throw new Error('Proxy HTTP ' + res.status);
      return res.json();
    }).then(parseStreams)
      .catch(function (err) {
        console.warn('[StreamedPK] Proxy ' + idx + ' failed: ' + err.message);
        return tryProxies(url, idx + 1);
      });
  }

  /* ==========================================================
     RENDER INTO CONTAINER
     ========================================================== */
  function renderInto(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '<div class="stream-loading">Loading cricket streams from streamed.pk...</div>';

    fetchStreams().then(function (streams) {
      if (streams.length === 0) {
        container.innerHTML =
          '<div class="empty-state">' +
          '<div class="empty-icon">🏏</div>' +
          '<div class="empty-title">No cricket streams available</div>' +
          '<div class="empty-text">streamed.pk returned no cricket matches right now. Try again in a few minutes.</div>' +
          '</div>';
        return;
      }

      let html = '<div class="ls-cards">';

      streams.forEach(function (s, idx) {
        const logo = s.logo
          ? '<img class="ls-logo" src="' + s.logo + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" />'
            + '<div class="ls-logo-fallback" style="display:none;">🏏</div>'
          : '<div class="ls-logo-fallback">🏏</div>';

        const liveBadge = s.live ? '<span class="ls-live-badge">LIVE</span>' : '';
        const timeText = s.time ? (s.time + ' • ') : '';

        html += '<div class="ls-card">'
          + '<div class="ls-card-head">'
            + logo
            + '<div class="ls-card-text">'
              + liveBadge
              + '<div class="ls-name">' + escapeHtml(s.name) + '</div>'
              + '<div class="ls-meta">' + timeText + escapeHtml(s.category) + '</div>'
            + '</div>'
          + '</div>'
          + '<button class="ls-play" onclick="StreamedPK.play(' + idx + ')">▶ WATCH</button>'
        + '</div>';
      });

      html += '</div>';
      container.innerHTML = html;
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  /* ==========================================================
     PLAY A STREAM
     ========================================================== */
  function play(idx) {
    const streams = cachedStreams || [];
    const s = streams[idx];
    if (!s) return;

    console.log('[StreamedPK] Playing:', s.name);

    /* If streamed.pk provides a stream list, use it */
    if (s.streams && s.streams.length > 0) {
      const firstStream = s.streams[0];
      const streamUrl = firstStream.url || firstStream.embed;
      if (streamUrl) {
        if (/\.m3u8|\.mp4/i.test(streamUrl)) {
          openPlayer(s.name, streamUrl);
        } else {
          /* External embed or unknown — open the source page */
          openStreamedPage(s);
        }
        return;
      }
    }

    /* Otherwise, open the streamed.pk page for this match */
    openStreamedPage(s);
  }

  function openStreamedPage(s) {
    /* streamed.pk URL pattern: /watch/{id} or /stream/{slug} */
    let pageUrl = s.url || '';
    if (!pageUrl && s.id) {
      pageUrl = 'https://streamed.pk/watch/' + s.id;
    }
    if (!pageUrl && s.raw && s.raw.slug) {
      pageUrl = 'https://streamed.pk/watch/' + s.raw.slug;
    }

    if (pageUrl) {
      window.open(pageUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('No playable URL found for this stream');
    }
  }

  /* ==========================================================
     IN-APP PLAYER (reuses the existing player modal)
     ========================================================== */
  function openPlayer(title, url) {
    let modal = document.getElementById('playerModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'playerModal';
      modal.className = 'player-modal';
      modal.innerHTML =
        '<div class="player-inner">'
          + '<div class="player-head">'
            + '<div class="player-title" id="playerTitle">Stream</div>'
            + '<button class="player-close" onclick="StreamedPK.close()">✕</button>'
          + '</div>'
          + '<div class="player-frame">'
            + '<video id="playerVideo" controls playsinline autoplay></video>'
          + '</div>'
          + '<div class="player-foot">'
            + '<a class="player-open" id="playerOpen" href="#" target="_blank" rel="noopener">Open in new tab ↗</a>'
            + '<span class="player-note">If playback fails, try another stream</span>'
          + '</div>'
        + '</div>';
      modal.addEventListener('click', function (e) {
        if (e.target === modal) close();
      });
      document.body.appendChild(modal);
    }

    document.getElementById('playerTitle').textContent = title;
    document.getElementById('playerOpen').href = url;

    const video = document.getElementById('playerVideo');

    if (window.__streamedHls) {
      try { window.__streamedHls.destroy(); } catch (e) {}
      window.__streamedHls = null;
    }

    video.pause();
    video.removeAttribute('src');
    video.load();

    modal.classList.add('open');

    const isM3U8 = /\.m3u8(\?|$)/i.test(url);

    if (isM3U8 && window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({ enableWorker: true });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      hls.on(window.Hls.Events.ERROR, function (e, data) {
        if (data.fatal) console.warn('[StreamedPK] HLS fatal:', data.type);
      });
      window.__streamedHls = hls;
    } else {
      video.src = url;
      video.play().catch(function () {});
    }
  }

  function close() {
    const modal = document.getElementById('playerModal');
    if (modal) modal.classList.remove('open');

    const video = document.getElementById('playerVideo');
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }

    if (window.__streamedHls) {
      try { window.__streamedHls.destroy(); } catch (e) {}
      window.__streamedHls = null;
    }
  }

  /* ==========================================================
     PUBLIC API
     ========================================================== */
  return {
    fetchStreams: fetchStreams,
    renderInto: renderInto,
    play: play,
    close: close,
    all: function () { return cachedStreams || []; },
    debug: function () {
      console.log('Working URL:', workingUrl);
      console.log('Cached streams:', cachedStreams ? cachedStreams.length : 0);
      if (cachedStreams && cachedStreams[0]) console.log('First:', cachedStreams[0]);
    }
  };

})();
