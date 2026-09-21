/* ============================================================
   CRICBUZZ WEB - Live Streams from strmd.link m3u playlist
   Reads: https://raw.githubusercontent.com/Rahuldir/livetv.m3u/main/livematches.m3u
   Plays: .m3u8 HLS streams via hls.js
   ============================================================ */

const LiveStreams = (function () {
  'use strict';

  const M3U_URL = 'https://raw.githubusercontent.com/Rahuldir/livetv.m3u/main/livematches.m3u';
  const CACHE_MS = 5 * 60 * 1000;

  let allStreams = [];
  let lastFetch = 0;
  let hlsInstance = null;

  /* ==========================================================
     PARSE M3U PLAYLIST
     ========================================================== */
  function parseM3U(text) {
    const lines = text.split(/\r?\n/);
    const result = [];
    let current = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.indexOf('#EXTINF:') === 0) {
        const info = line.substring(8);
        const commaIdx = info.lastIndexOf(',');
        const attrs = commaIdx >= 0 ? info.substring(0, commaIdx) : info;
        const name = commaIdx >= 0 ? info.substring(commaIdx + 1).trim() : 'Stream';

        const getAttr = function (key) {
          const re = new RegExp(key + '="([^"]*)"');
          const m = attrs.match(re);
          return m ? m[1] : '';
        };

        current = {
          name: name,
          logo: getAttr('tvg-logo'),
          group: getAttr('group-title') || 'Live',
          id: getAttr('tvg-id') || '',
          url: ''
        };
      } else if (line.charAt(0) === '#') {
        continue;
      } else if (current) {
        current.url = line;
        /* Validate URL */
        if (line.indexOf('http') === 0) {
          result.push(current);
        }
        current = null;
      }
    }

    return result;
  }

  /* ==========================================================
     FETCH PLAYLIST
     ========================================================== */
  function fetchStreams(force) {
    if (!force && allStreams.length > 0 && (Date.now() - lastFetch) < CACHE_MS) {
      return Promise.resolve(allStreams);
    }

    console.log('[LiveStreams] Fetching m3u playlist...');

    return fetch(M3U_URL, { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (text) {
        allStreams = parseM3U(text);
        lastFetch = Date.now();
        console.log('[LiveStreams] Loaded ' + allStreams.length + ' streams');
        return allStreams;
      })
      .catch(function (err) {
        console.warn('[LiveStreams] Fetch failed:', err.message);
        return [];
      });
  }

  /* ==========================================================
     RENDER LIST
     ========================================================== */
  function renderInto(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '<div class="stream-loading">Loading live streams...</div>';

    fetchStreams().then(function (streams) {
      if (streams.length === 0) {
        container.innerHTML =
          '<div class="empty-state">' +
          '<div class="empty-icon">TV</div>' +
          '<div class="empty-title">No live streams available</div>' +
          '<div class="empty-text">The playlist is empty or failed to load.</div>' +
          '</div>';
        return;
      }

      /* Group by category */
      const groups = {};
      streams.forEach(function (s) {
        const g = s.group || 'Other';
        if (!groups[g]) groups[g] = [];
        groups[g].push(s);
      });

      /* Cricket first, then everything else */
      const groupNames = Object.keys(groups).sort(function (a, b) {
        const aIsCricket = /cricket/i.test(a);
        const bIsCricket = /cricket/i.test(b);
        if (aIsCricket && !bIsCricket) return -1;
        if (!aIsCricket && bIsCricket) return 1;
        return 0;
      });

      let html = '';
      let globalIdx = 0;

      groupNames.forEach(function (gName) {
        const list = groups[gName];
        const isCricket = /cricket/i.test(gName);

        html += '<div class="ls-group">';
        html += '<div class="ls-group-title">' + (isCricket ? '🏏 ' : '📺 ') + gName + ' <span class="ls-group-count">(' + list.length + ')</span></div>';
        html += '<div class="ls-cards">';

        list.forEach(function (s) {
          const idx = streams.indexOf(s);
          html += renderCard(s, idx);
        });

        html += '</div></div>';
      });

      container.innerHTML = html;
    });
  }

  function renderCard(s, idx) {
    const logo = s.logo
      ? '<img class="ls-logo" src="' + s.logo + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" />'
        + '<div class="ls-logo-fallback" style="display:none;">📺</div>'
      : '<div class="ls-logo-fallback">📺</div>';

    const safeName = escapeHtml(s.name);
    const safeGroup = escapeHtml(s.group);

    return '<div class="ls-card">'
      + '<div class="ls-card-head">' + logo
        + '<div class="ls-card-text">'
          + '<div class="ls-name">' + safeName + '</div>'
          + '<div class="ls-meta">' + safeGroup + '</div>'
        + '</div>'
      + '</div>'
      + '<button class="ls-play" onclick="LiveStreams.play(' + idx + ')">▶ WATCH</button>'
    + '</div>';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  /* ==========================================================
     PLAY STREAM — HLS.js for .m3u8, native for others
     ========================================================== */
  function play(idx) {
    const s = allStreams[idx];
    if (!s) return;

    console.log('[LiveStreams] Playing:', s.name, s.url);

    /* Ensure modal exists */
    let modal = document.getElementById('playerModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'playerModal';
      modal.className = 'player-modal';
      modal.innerHTML =
        '<div class="player-inner">'
          + '<div class="player-head">'
            + '<div class="player-title" id="playerTitle">Stream</div>'
            + '<button class="player-close" onclick="LiveStreams.close()">✕</button>'
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

    document.getElementById('playerTitle').textContent = s.name;
    document.getElementById('playerOpen').href = s.url;

    const video = document.getElementById('playerVideo');

    /* Destroy previous hls instance */
    if (hlsInstance) {
      try { hlsInstance.destroy(); } catch (e) {}
      hlsInstance = null;
    }
    video.pause();
    video.removeAttribute('src');
    video.load();

    /* Show modal first */
    modal.classList.add('open');

    /* Choose player strategy */
    const isM3U8 = /\.m3u8(\?|$)/i.test(s.url);

    if (isM3U8) {
      /* Use hls.js */
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hlsInstance.loadSource(s.url);
        hlsInstance.attachMedia(video);

        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });

        hlsInstance.on(window.Hls.Events.ERROR, function (e, data) {
          if (data.fatal) {
            console.warn('[LiveStreams] HLS error:', data.type, data.details);
            /* Try recovery */
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hlsInstance.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hlsInstance.recoverMediaError();
            } else {
              hlsInstance.destroy();
              showError(video, 'Playback failed — try another stream or open in new tab');
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        /* Native HLS (Safari / iOS) */
        video.src = s.url;
        video.play().catch(function () {});
      } else {
        showError(video, 'HLS not supported in this browser');
      }
    } else {
      /* Direct MP4 or other format */
      video.src = s.url;
      video.play().catch(function () {
        showError(video, 'Autoplay blocked — click play to start');
      });
    }
  }

  function showError(video, msg) {
    const parent = video.parentElement;
    let err = parent.querySelector('.player-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'player-error';
      parent.appendChild(err);
    }
    err.textContent = msg;
    err.style.display = 'block';
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

    if (hlsInstance) {
      try { hlsInstance.destroy(); } catch (e) {}
      hlsInstance = null;
    }

    /* Remove any error overlay */
    const err = document.querySelector('.player-error');
    if (err) err.remove();
  }

  /* ==========================================================
     PUBLIC API
     ========================================================== */
  return {
    fetchStreams: fetchStreams,
    renderInto: renderInto,
    play: play,
    close: close,
    all: function () { return allStreams; }
  };

})();
