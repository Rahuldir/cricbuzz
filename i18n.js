/* ============================================================
   CRICBUZZ WEB - Internationalization (EN + HI)
   ============================================================ */

const I18N = (function () {
  'use strict';

  const TRANSLATIONS = {
    en: {
      searchPlaceholder: 'Search players, matches, series...',
      matches: 'Matches', liveTV: 'Live TV', series: 'Series',
      teams: 'Teams', rankings: 'Rankings', news: 'News',
      liveNow: 'Live Now', upcoming: 'Upcoming', recentResults: 'Recent Results',
      seeAll: 'See all', ongoingSeries: 'Ongoing Series', upcomingSeries: 'Upcoming Series',
      topStories: 'Top Stories', internationalTeams: 'International Teams',
      availableMatches: 'Available Matches (IDs)',
      live: 'LIVE', result: 'RESULT', yetToBat: 'Yet to bat',
      overs: 'overs', matchesCount: 'matches',
      batting: 'Batting', bowling: 'Bowling', allround: 'All-rounder',
      rating: 'Rating', points: 'Points',
      addStream: 'Add Stream', watchLive: 'Watch Live',
      streamUrl: 'Stream URL', platformName: 'Platform Name',
      matchId: 'Match ID', save: 'Save Stream', cancel: 'Cancel',
      delete: 'Remove', noStreams: 'No streams added yet',
      scorecard: 'Scorecard', commentary: 'Commentary',
      info: 'Info', partnership: 'Partnership', fallOfWickets: 'Fall of Wickets',
      bowler: 'Bowler', batsman: 'Batsman',
      runs: 'Runs', balls: 'Balls', fours: '4s', sixes: '6s',
      sr: 'SR', eco: 'Eco', wkts: 'Wkts', maidens: 'Mdns',
      venue: 'Venue', startsIn: 'Starts in',
      backToMatches: 'Back to Matches',
      broadcastMode: 'Broadcast', exitBroadcast: 'Exit Broadcast'
    },
    hi: {
      searchPlaceholder: 'खिलाड़ी, मैच, सीरीज़ खोजें...',
      matches: 'मैच', liveTV: 'लाइव टीवी', series: 'सीरीज़',
      teams: 'टीमें', rankings: 'रैंकिंग', news: 'समाचार',
      liveNow: 'अभी लाइव', upcoming: 'आगामी', recentResults: 'हाल के नतीजे',
      seeAll: 'सभी देखें', ongoingSeries: 'चल रही सीरीज़', upcomingSeries: 'आगामी सीरीज़',
      topStories: 'मुख्य खबरें', internationalTeams: 'अंतर्राष्ट्रीय टीमें',
      availableMatches: 'उपलब्ध मैच (आईडी)',
      live: 'लाइव', result: 'नतीजा', yetToBat: 'बल्लेबाजी बाकी',
      overs: 'ओवर', matchesCount: 'मैच',
      batting: 'बल्लेबाजी', bowling: 'गेंदबाजी', allround: 'ऑलराउंडर',
      rating: 'रेटिंग', points: 'अंक',
      addStream: 'स्ट्रीम जोड़ें', watchLive: 'लाइव देखें',
      streamUrl: 'स्ट्रीम URL', platformName: 'प्लेटफ़ॉर्म का नाम',
      matchId: 'मैच आईडी', save: 'स्ट्रीम सेव करें', cancel: 'रद्द करें',
      delete: 'हटाएं', noStreams: 'कोई स्ट्रीम नहीं जोड़ी गई',
      scorecard: 'स्कोरकार्ड', commentary: 'कमेंट्री',
      info: 'जानकारी', partnership: 'साझेदारी', fallOfWickets: 'विकेट पतन',
      bowler: 'गेंदबाज', batsman: 'बल्लेबाज',
      runs: 'रन', balls: 'गेंद', fours: 'चौके', sixes: 'छक्के',
      sr: 'स्ट्राइक रेट', eco: 'इकॉनमी', wkts: 'विकेट', maidens: 'मेडन',
      venue: 'स्थान', startsIn: 'शुरू होगा',
      backToMatches: 'मैच पर वापस',
      broadcastMode: 'ब्रॉडकास्ट', exitBroadcast: 'ब्रॉडकास्ट बंद करें'
    }
  };

  let currentLang = localStorage.getItem('cb_lang') || 'en';

  function t(key) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }

  function setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem('cb_lang', lang);
    applyToDOM();
    window.dispatchEvent(new CustomEvent('cb:lang-change', { detail: lang }));
  }

  function getLang() { return currentLang; }

  function applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', t(key));
    });
    document.documentElement.setAttribute('lang', currentLang);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(applyToDOM, 100);
  });

  return {
    t: t,
    setLang: setLang,
    getLang: getLang,
    applyToDOM: applyToDOM,
    languages: Object.keys(TRANSLATIONS)
  };

})();

window.t = function (k) { return I18N.t(k); };
