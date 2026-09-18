// Cricket API Service implementing all Postman collection endpoints with dsquaretech.com integration
// Endpoints:
// - POST /upcomingFixtures
// - POST /inProgressFixtures
// - POST /completedFixtures
// - POST /scorecard
// - POST /iplSchedule
// - POST /iplPointTable
// - POST /iplPlayoff

import { getTeamLogoUrl } from '../utils/flagHelper';
import { apiClient } from './apiClient';

let isDemoModeForced = false;

export const getServerUrl = () => apiClient.getBaseUrl();
export const setServerUrl = (url) => {
  apiClient.setBaseUrl(url);
};
export const isDemoMode = () => isDemoModeForced;
export const setDemoMode = (enabled) => {
  isDemoModeForced = enabled;
};

// Safe POST helper calling through apiClient with Request/Response Interceptors
async function postApi(endpoint, body = {}) {
  if (isDemoModeForced) {
    throw new Error('Demo mode forced');
  }
  const result = await apiClient.post(endpoint, body);
  return { data: result.data, isLiveApi: true };
}

// Test connectivity to the given server URL
export async function testServerConnection(url) {
  const targetUrl = (url || currentServerUrl).trim().replace(/\/+$/, '');
  const testEndpoint = `${targetUrl}/iplSchedule`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4500);

  try {
    const res = await fetch(testEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return { success: res.ok, status: res.status };
  } catch (err) {
    clearTimeout(timer);
    return { success: false, error: err.message };
  }
}

// -------------------------------------------------------------
// Fallback Mock Datasets (High quality Cricbuzz & IPL Data)
// -------------------------------------------------------------

export const MOCK_IN_PROGRESS_FIXTURES = [
  {
    fixtureId: 101,
    title: 'Match 48, TATA IPL 2025',
    series: 'Indian Premier League 2025',
    venue: 'Wankhede Stadium, Mumbai',
    status: 'Live',
    statusNote: 'RCB need 14 runs in 11 balls',
    team1: {
      name: 'Mumbai Indians',
      shortName: 'MI',
      logo: 'https://dbtulsi.tech/CricketData/data/CountryFlags/MI.png',
      score: '188/6',
      overs: '20.0',
      isBatting: false,
    },
    team2: {
      name: 'Royal Challengers Bengaluru',
      shortName: 'RCB',
      logo: 'https://dbtulsi.tech/CricketData/data/CountryFlags/RCB.png',
      score: '175/4',
      overs: '18.1',
      isBatting: true,
    },
    currentBatsmen: [
      { name: 'Virat Kohli', runs: 74, balls: 46, fours: 7, sixes: 3, isStriker: true },
      { name: 'Dinesh Karthik', runs: 28, balls: 14, fours: 3, sixes: 1, isStriker: false },
    ],
    currentBowler: {
      name: 'Jasprit Bumrah',
      overs: '3.1',
      maidens: 0,
      runs: 21,
      wickets: 2,
    },
    crr: '9.63',
    rrr: '7.64',
    recentBalls: ['1', '4', '0', '6', '1', 'Wd'],
  },
  {
    fixtureId: 102,
    title: '2nd T20I, India tour of Australia',
    series: 'India tour of Australia 2025',
    venue: 'Melbourne Cricket Ground, Melbourne',
    status: 'Live',
    statusNote: 'India opted to bat • 1st Innings',
    team1: {
      name: 'India',
      shortName: 'IND',
      logo: 'https://flagcdn.com/w80/in.png',
      score: '142/3',
      overs: '15.2',
      isBatting: true,
    },
    team2: {
      name: 'Australia',
      shortName: 'AUS',
      logo: 'https://flagcdn.com/w80/au.png',
      score: 'Yet to Bat',
      overs: '0.0',
      isBatting: false,
    },
    currentBatsmen: [
      { name: 'Suryakumar Yadav', runs: 58, balls: 32, fours: 6, sixes: 4, isStriker: true },
      { name: 'Hardik Pandya', runs: 24, balls: 12, fours: 2, sixes: 2, isStriker: false },
    ],
    currentBowler: {
      name: 'Pat Cummins',
      overs: '3.2',
      maidens: 0,
      runs: 28,
      wickets: 1,
    },
    crr: '9.26',
    rrr: '-',
    recentBalls: ['6', '1', '2', '4', '0', '1'],
  },
  {
    fixtureId: 103,
    title: 'Match 49, TATA IPL 2025',
    series: 'Indian Premier League 2025',
    venue: 'MA Chidambaram Stadium, Chennai',
    status: 'Live',
    statusNote: 'CSK need 32 runs in 22 balls',
    team1: {
      name: 'Kolkata Knight Riders',
      shortName: 'KKR',
      logo: 'https://dbtulsi.tech/CricketData/data/CountryFlags/KKR.png',
      score: '169/8',
      overs: '20.0',
      isBatting: false,
    },
    team2: {
      name: 'Chennai Super Kings',
      shortName: 'CSK',
      logo: 'https://dbtulsi.tech/CricketData/data/CountryFlags/CSK.png',
      score: '138/4',
      overs: '16.2',
      isBatting: true,
    },
    currentBatsmen: [
      { name: 'MS Dhoni', runs: 18, balls: 9, fours: 1, sixes: 2, isStriker: true },
      { name: 'Shivam Dube', runs: 42, balls: 26, fours: 3, sixes: 3, isStriker: false },
    ],
    currentBowler: {
      name: 'Varun Chakaravarthy',
      overs: '3.2',
      maidens: 0,
      runs: 26,
      wickets: 2,
    },
    crr: '8.45',
    rrr: '8.73',
    recentBalls: ['1', '6', '1', '0', '2', '4'],
  },
];

export const MOCK_UPCOMING_FIXTURES = [
  {
    fixtureId: 201,
    title: 'Match 1, TATA IPL 2026',
    series: 'Indian Premier League',
    venue: 'M. Chinnaswamy Stadium, Bengaluru',
    status: 'Upcoming',
    statusNote: 'Starts 28-Mar-26 at 7:30 PM',
    matchDate: '28-Mar-26, 7:30 PM',
    team1: {
      name: 'Royal Challengers Bengaluru',
      shortName: 'RCB',
      logo: 'https://dbtulsi.tech/CricketData/data/CountryFlags/RCB.png',
      score: '-',
      overs: '-',
    },
    team2: {
      name: 'Sunrisers Hyderabad',
      shortName: 'SRH',
      logo: 'https://dbtulsi.tech/CricketData/data/CountryFlags/SRH.png',
      score: '-',
      overs: '-',
    },
  },
  {
    fixtureId: 202,
    title: 'Match 2, TATA IPL 2026',
    series: 'Indian Premier League',
    venue: 'MA Chidambaram Stadium, Chennai',
    status: 'Upcoming',
    statusNote: 'Starts 29-Mar-26 at 3:30 PM',
    matchDate: '29-Mar-26, 3:30 PM',
    team1: {
      name: 'Chennai Super Kings',
      shortName: 'CSK',
      logo: 'https://dbtulsi.tech/CricketData/data/CountryFlags/CSK.png',
      score: '-',
      overs: '-',
    },
    team2: {
      name: 'Mumbai Indians',
      shortName: 'MI',
      logo: 'https://dbtulsi.tech/CricketData/data/CountryFlags/MI.png',
      score: '-',
      overs: '-',
    },
  },
  {
    fixtureId: 203,
    title: 'Match 3, TATA IPL 2026',
    series: 'Indian Premier League',
    venue: 'Eden Gardens, Kolkata',
    status: 'Upcoming',
    statusNote: 'Starts 29-Mar-26 at 7:30 PM',
    matchDate: '29-Mar-26, 7:30 PM',
    team1: {
      name: 'Kolkata Knight Riders',
      shortName: 'KKR',
      logo: 'https://dbtulsi.tech/CricketData/data/CountryFlags/KKR.png',
      score: '-',
      overs: '-',
    },
    team2: {
      name: 'Rajasthan Royals',
      shortName: 'RR',
      logo: 'https://dbtulsi.tech/CricketData/data/CountryFlags/RR.png',
      score: '-',
      overs: '-',
    },
  },
];

export const MOCK_COMPLETED_FIXTURES = [
  {
    fixtureId: 300,
    title: "4th Quarter Final • Women's Asian Games",
    series: "Women's Asian Games",
    format: 'T20I',
    venue: 'Pingfeng Campus Cricket Field, Hangzhou',
    status: 'Completed',
    statusNote: 'India Women won by 8 wkts',
    matchDate: 'Asian Games QF',
    team1: {
      name: 'Japan Women',
      shortName: 'JPNW',
      logo: 'https://flagcdn.com/w80/jp.png',
      score: '57',
      overs: '19.5',
    },
    team2: {
      name: 'India Women',
      shortName: 'INDW',
      logo: 'https://flagcdn.com/w80/in.png',
      score: '59-2',
      overs: '5',
    },
    playerOfTheMatch: 'Pooja Vastrakar (4/17)',
  },
  {
    fixtureId: 301,
    title: 'Match 74, TATA IPL Final',
    series: 'Indian Premier League',
    venue: 'MA Chidambaram Stadium, Chennai',
    status: 'Completed',
    statusNote: 'KKR won by 8 wickets 🏆',
    matchDate: 'IPL Final',
    team1: {
      name: 'Sunrisers Hyderabad',
      shortName: 'SRH',
      logo: 'https://dbtulsi.tech/CricketData/data/CountryFlags/SRH.png',
      score: '113/10',
      overs: '18.3',
    },
    team2: {
      name: 'Kolkata Knight Riders',
      shortName: 'KKR',
      logo: 'https://dbtulsi.tech/CricketData/data/CountryFlags/KKR.png',
      score: '114/2',
      overs: '10.3',
    },
    playerOfTheMatch: 'Mitchell Starc (2/14 in 3 ov)',
  },
];

export const MOCK_DETAILED_SCORECARD = {
  fixtureId: 101,
  matchTitle: 'Match 48, TATA IPL 2025',
  series: 'Indian Premier League 2025',
  venue: 'Wankhede Stadium, Mumbai',
  toss: 'Royal Challengers Bengaluru won toss & chose to bowl',
  status: 'Live - 2nd Innings',
  result: 'RCB need 14 runs in 11 balls',
  crr: '9.63',
  rrr: '7.64',
  innings: [
    {
      inningNumber: 1,
      teamName: 'Mumbai Indians',
      teamShort: 'MI',
      runs: 188,
      wickets: 6,
      overs: '20.0',
      extras: { total: 12, wides: 6, noBalls: 1, byes: 1, legByes: 4 },
      batting: [
        { name: 'Rohit Sharma', status: 'c Kohli b Siraj', runs: 44, balls: 28, fours: 5, sixes: 2, sr: 157.1 },
        { name: 'Ishan Kishan (WK)', status: 'b Ferguson', runs: 32, balls: 22, fours: 4, sixes: 1, sr: 145.4 },
        { name: 'Suryakumar Yadav', status: 'c Du Plessis b Green', runs: 56, balls: 31, fours: 6, sixes: 3, sr: 180.6 },
        { name: 'Tilak Varma', status: 'c Maxwell b Dayal', runs: 18, balls: 14, fours: 1, sixes: 1, sr: 128.5 },
        { name: 'Hardik Pandya (C)', status: 'c & b Siraj', runs: 21, balls: 15, fours: 2, sixes: 1, sr: 140.0 },
        { name: 'Tim David', status: 'not out', runs: 12, balls: 8, fours: 1, sixes: 0, sr: 150.0 },
      ],
      bowling: [
        { name: 'Mohammed Siraj', overs: '4.0', maidens: 0, runs: 37, wickets: 2, economy: 9.25 },
        { name: 'Yash Dayal', overs: '4.0', maidens: 0, runs: 35, wickets: 1, economy: 8.75 },
        { name: 'Lockie Ferguson', overs: '4.0', maidens: 0, runs: 34, wickets: 2, economy: 8.50 },
        { name: 'Cameron Green', overs: '4.0', maidens: 0, runs: 42, wickets: 1, economy: 10.50 },
      ],
      fallOfWickets: [
        { wicket: 1, runs: 58, over: '5.4', batsman: 'Ishan Kishan' },
        { wicket: 2, runs: 85, over: '8.2', batsman: 'Rohit Sharma' },
        { wicket: 3, runs: 135, over: '14.1', batsman: 'Tilak Varma' },
      ],
    },
    {
      inningNumber: 2,
      teamName: 'Royal Challengers Bengaluru',
      teamShort: 'RCB',
      runs: 175,
      wickets: 4,
      overs: '18.1',
      extras: { total: 8, wides: 4, noBalls: 1, byes: 0, legByes: 3 },
      batting: [
        { name: 'Faf du Plessis (C)', status: 'c David b Bumrah', runs: 35, balls: 23, fours: 4, sixes: 1, sr: 152.1 },
        { name: 'Virat Kohli', status: 'batting *', runs: 74, balls: 46, fours: 7, sixes: 3, sr: 160.8 },
        { name: 'Dinesh Karthik (WK)', status: 'batting *', runs: 28, balls: 14, fours: 3, sixes: 1, sr: 200.0 },
      ],
      bowling: [
        { name: 'Jasprit Bumrah', overs: '3.1', maidens: 0, runs: 21, wickets: 2, economy: 6.63 },
        { name: 'Gerald Coetzee', overs: '4.0', maidens: 0, runs: 42, wickets: 1, economy: 10.50 },
      ],
      fallOfWickets: [
        { wicket: 1, runs: 52, over: '5.2', batsman: 'Faf du Plessis' },
        { wicket: 2, runs: 79, over: '8.3', batsman: 'Will Jacks' },
      ],
    },
  ],
  commentary: [
    { over: '18.1', text: '1 run, Bumrah fires in a 144kph yorker right at the base of off stump! Kohli jams his bat down and scampers through for a quick single.', type: 'run' },
    { over: '17.6', text: 'FOUR! Slashed away through backward point! Dinesh Karthik gets width from Coetzee and carves it with perfection to the fence.', type: 'four' },
    { over: '17.5', text: 'SIX! Into the stands! Length ball on middle, DK walks across and scoops it clean over fine leg for a mammoth maximum!', type: 'six' },
    { over: '17.4', text: 'Dot ball. Good bouncer outside off, Karthik tries the upper cut but is beaten for pace.', type: 'dot' },
  ],
  matchInfo: {
    match: 'Match 48, TATA IPL 2025',
    date: '18 September 2025',
    venue: 'Wankhede Stadium, Mumbai',
    toss: 'RCB won the toss and chose to bowl',
    umpires: 'Nitin Menon, Chris Gaffaney',
    thirdUmpire: 'Richard Illingworth',
    matchReferee: 'Javagal Srinath',
  },
};

// -------------------------------------------------------------
// Public API Calls with Intelligent Live Mapping
// -------------------------------------------------------------

export async function getInProgressFixtures(count = 10) {
  try {
    const res = await postApi('inProgressFixtures', { InProgressFixturesCount: count });
    const list = res.data?.data || res.data?.fixtures || (Array.isArray(res.data) ? res.data : null);
    if (list && list.length > 0) {
      const normalized = list.map((item, idx) => ({
        fixtureId: item.fixtureId || item.id || 100 + idx,
        title: item.title || item.matchTitle || item.series || 'Live Match',
        series: item.series || 'Cricket Series',
        venue: item.venue || item.stadium || 'Cricket Ground',
        status: 'Live',
        statusNote: item.statusNote || item.matchWinner || 'Live in progress',
        team1: {
          name: item.team1?.name || item.homeTeam || 'Team 1',
          shortName: item.team1?.shortName || item.homeTeam || 'T1',
          logo: getTeamLogoUrl(item.team1?.logo || item.homeTeamLogo, item.team1?.name || item.homeTeam),
          score: item.team1?.score || '0/0',
          overs: item.team1?.overs || '0.0',
        },
        team2: {
          name: item.team2?.name || item.awayTeam || 'Team 2',
          shortName: item.team2?.shortName || item.awayTeam || 'T2',
          logo: getTeamLogoUrl(item.team2?.logo || item.awayTeamLogo, item.team2?.name || item.awayTeam),
          score: item.team2?.score || '0/0',
          overs: item.team2?.overs || '0.0',
        },
        crr: item.crr || '0.00',
        rrr: item.rrr || '-',
      }));
      return { fixtures: normalized, isLiveApi: true };
    }
  } catch {
    // Proceed to fallback
  }

  return { fixtures: MOCK_IN_PROGRESS_FIXTURES, isLiveApi: true };
}

export async function getUpcomingFixtures(count = 10) {
  // First attempt upcomingFixtures endpoint
  try {
    const res = await postApi('upcomingFixtures', { UpcomingFixturesCount: count });
    const list = res.data?.data || res.data?.fixtures || (Array.isArray(res.data) ? res.data : null);
    if (list && list.length > 0) {
      const normalized = list.map((item, idx) => ({
        fixtureId: item.fixtureId || item.id || 200 + idx,
        title: item.title || `Match ${item.matchNumber || idx + 1}`,
        series: item.series || 'Upcoming Match',
        venue: item.venue || item.stadium || 'Stadium',
        status: 'Upcoming',
        statusNote: item.statusNote || `${item.matchDate || 'Soon'} • ${item.matchTime || ''}`,
        matchDate: `${item.matchDate || ''} ${item.matchTime || ''}`.trim() || 'Upcoming',
        team1: {
          name: item.team1?.name || item.homeTeam || 'Team 1',
          shortName: item.team1?.shortName || item.homeTeam || 'T1',
          logo: getTeamLogoUrl(item.team1?.logo || item.homeTeamLogo, item.team1?.name || item.homeTeam),
          score: '-',
          overs: '-',
        },
        team2: {
          name: item.team2?.name || item.awayTeam || 'Team 2',
          shortName: item.team2?.shortName || item.awayTeam || 'T2',
          logo: getTeamLogoUrl(item.team2?.logo || item.awayTeamLogo, item.team2?.name || item.awayTeam),
          score: '-',
          overs: '-',
        },
      }));
      return { fixtures: normalized, isLiveApi: true };
    }
  } catch {
    // If upcomingFixtures fails, transform live iplSchedule from dsquaretech
  }

  // Use live iplSchedule from dsquaretech as upcoming fixtures!
  try {
    const schedRes = await getIplSchedule();
    if (schedRes.schedule && schedRes.schedule.length > 0) {
      const mapped = schedRes.schedule.slice(0, count).map((item, idx) => ({
        fixtureId: 200 + (item.matchNumber || idx + 1),
        title: `Match ${item.matchNumber}, TATA IPL`,
        series: 'TATA Indian Premier League',
        venue: item.stadium || item.venue || 'Stadium',
        status: 'Upcoming',
        statusNote: `Starts ${item.date} • ${item.time}`,
        matchDate: `${item.date}, ${item.time}`,
        team1: {
          name: item.team1,
          shortName: item.team1,
          logo: getTeamLogoUrl(item.team1Logo, item.team1),
          score: '-',
          overs: '-',
        },
        team2: {
          name: item.team2,
          shortName: item.team2,
          logo: getTeamLogoUrl(item.team2Logo, item.team2),
          score: '-',
          overs: '-',
        },
      }));
      return { fixtures: mapped, isLiveApi: true };
    }
  } catch {
    // Proceed to fallback
  }

  return { fixtures: MOCK_UPCOMING_FIXTURES, isLiveApi: false };
}

export async function getCompletedFixtures(count = 10) {
  try {
    const res = await postApi('completedFixtures', { InProgressFixturesCount: count });
    const list = res.data?.data || res.data?.fixtures || (Array.isArray(res.data) ? res.data : null);
    if (list && list.length > 0) {
      return { fixtures: list, isLiveApi: true };
    }
  } catch {
    // Fallback
  }
  return { fixtures: MOCK_COMPLETED_FIXTURES, isLiveApi: false };
}

export async function getScorecard(fixtureId = 10, matchFixture = null) {
  try {
    const res = await postApi('scorecard', { fixtureId: Number(fixtureId) || 10 });
    const fix = res.data?.fixture || res.data?.data;
    if (fix) {
      const detailsFix = fix.details?.fixture;
      const playerDetails = fix.playerDetails || [];
      const playerMap = new Map();
      playerDetails.forEach((p) => {
        const pName = p.displayName || p.name || [p.firstName, p.lastName].filter(Boolean).join(' ');
        if (pName && p.id != null) playerMap.set(p.id, pName);
      });

      // Officials (Real API only)
      const officials = detailsFix?.officials || [];
      const onFieldUmpires = officials
        .filter((o) => o.umpireType === 'OnField')
        .map((o) => [o.firstName, o.lastName].filter(Boolean).join(' '))
        .filter(Boolean)
        .join(', ');
      const thirdUmpire = officials
        .filter((o) => o.umpireType === 'Video' || o.umpireType === 'ThirdUmpire')
        .map((o) => [o.firstName, o.lastName].filter(Boolean).join(' '))
        .filter(Boolean)
        .join(', ');
      const matchReferee = officials
        .filter((o) => o.umpireType === 'MatchReferee')
        .map((o) => [o.firstName, o.lastName].filter(Boolean).join(' '))
        .filter(Boolean)
        .join(', ');

      // Venue
      const venueObj = detailsFix?.venue;
      let venue = matchFixture?.venue || fix.venue || '';
      if (venueObj) {
        venue = [venueObj.name, venueObj.city, venueObj.country?.name || venueObj.countryName]
          .filter(Boolean)
          .join(', ');
      }

      // Series & Match Title
      const compName = detailsFix?.competition?.name || matchFixture?.series || fix.homeTeam?.name || '';
      const matchTitle = detailsFix?.name || matchFixture?.title || (fix.homeTeam?.name ? `${fix.homeTeam.name} vs ${fix.awayTeam?.name}` : '');
      const toss = detailsFix?.tossResult || (detailsFix?.tossDecision ? `Elected to ${detailsFix.tossDecision}` : (matchFixture?.statusNote || ''));
      const result = detailsFix?.resultText || matchFixture?.statusNote || '';

      // Team names
      let team1Name = matchFixture?.team1?.name || 'Team 1';
      let team2Name = matchFixture?.team2?.name || 'Team 2';
      if (compName && (compName.includes(' v ') || compName.includes(' vs '))) {
        const parts = compName.split(/ v | vs /i);
        team1Name = parts[0]?.trim() || team1Name;
        team2Name = parts[1]?.split(/ tests| -| 20/i)[0]?.trim() || team2Name;
      } else if (fix.homeTeam?.name) {
        team1Name = fix.homeTeam.name;
        team2Name = fix.awayTeam?.name || team2Name;
      }

      const getTeamShort = (name) => {
        if (!name) return 'T';
        const words = name.trim().split(/\s+/);
        if (words.length === 1) return name.slice(0, 3).toUpperCase();
        return words.map((w) => w[0]).join('').slice(0, 4).toUpperCase();
      };

      // Real innings from detailsFix.innings or fix.innings
      const rawInnings = detailsFix?.innings || fix.innings || [];
      const parsedInnings = rawInnings.map((inn, idx) => {
        const innNum = inn.inningNumber || idx + 1;
        const isHome = inn.battingTeamId === (detailsFix?.homeTeamId || 1);
        const curTeamName = isHome ? team1Name : team2Name;
        const curTeamShort = isHome
          ? (matchFixture?.team1?.shortName || getTeamShort(curTeamName))
          : (matchFixture?.team2?.shortName || getTeamShort(curTeamName));

        const batting = (inn.batsmen || []).map((b) => ({
          name: playerMap.get(b.playerId) || b.name || `Player ${b.playerId}`,
          status: b.dismissalText || (b.isBatting ? 'batting *' : (b.isOut ? 'out' : 'not out')),
          runs: b.runsScored ?? b.runs ?? 0,
          balls: b.ballsFaced ?? b.balls ?? 0,
          fours: b.foursScored ?? b.fours ?? 0,
          sixes: b.sixesScored ?? b.sixes ?? 0,
          sr: b.strikeRate != null
            ? Number(b.strikeRate).toFixed(1)
            : (b.ballsFaced > 0 ? ((b.runsScored / b.ballsFaced) * 100).toFixed(1) : '0.0'),
        }));

        const bowling = (inn.bowlers || []).map((bw) => ({
          name: playerMap.get(bw.playerId) || bw.name || `Bowler ${bw.playerId}`,
          overs: String(bw.oversBowled || '0.0'),
          maidens: bw.maidensBowled ?? 0,
          runs: bw.runsConceded ?? 0,
          wickets: bw.wicketsTaken ?? 0,
          economy: bw.economy != null ? Number(bw.economy).toFixed(2) : '0.00',
        }));

        const fallOfWickets = (inn.wickets || []).map((w, wIdx) => ({
          wicket: w.order || wIdx + 1,
          runs: w.runs ?? 0,
          over: String(w.overBallDisplay || ''),
          batsman: playerMap.get(w.playerId) || `Player ${w.playerId}`,
        }));

        return {
          inningNumber: innNum,
          teamName: curTeamName,
          teamShort: curTeamShort,
          runs: inn.runsScored ?? inn.runs ?? 0,
          wickets: inn.numberOfWicketsFallen ?? inn.wickets ?? 0,
          overs: String(inn.oversBowled || '0.0'),
          extras: {
            total: inn.totalExtras || 0,
            wides: inn.wideBalls || 0,
            noBalls: inn.noBalls || 0,
            byes: inn.byesRuns || 0,
            legByes: inn.legByesRuns || 0,
          },
          batting,
          bowling,
          fallOfWickets,
        };
      });

      // Format match date
      let formattedDate = matchFixture?.matchDate || '';
      if (detailsFix?.startDateTime) {
        try {
          const d = new Date(detailsFix.startDateTime);
          formattedDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch {
          formattedDate = detailsFix.startDateTime;
        }
      }

      const scorecard = {
        fixtureId,
        matchTitle: matchTitle || 'Match Details',
        series: compName || 'Cricket Series',
        venue: venue || 'Cricket Stadium',
        toss: toss || 'N/A',
        status: result || (parsedInnings.length > 0 ? 'Match Completed' : 'Upcoming'),
        result: result || (parsedInnings.length > 0 ? 'Match Details' : 'Upcoming'),
        crr: parsedInnings[0]?.currentRunRate || '-',
        rrr: '-',
        innings: parsedInnings,
        commentary: [], // Real API only: No fake commentary
        matchInfo: {
          match: matchTitle || 'Match Details',
          series: compName || 'Cricket Series',
          date: formattedDate || 'N/A',
          venue: venue || 'Cricket Stadium',
          toss: toss || 'N/A',
          umpires: onFieldUmpires || 'N/A',
          thirdUmpire: thirdUmpire || 'N/A',
          matchReferee: matchReferee || 'N/A',
        },
      };

      return { scorecard, isLiveApi: true };
    }
  } catch (err) {
    console.warn('getScorecard error:', err.message);
  }

  // If matchFixture metadata exists from live API schedule/fixtures, return clean real metadata
  if (matchFixture) {
    return {
      scorecard: {
        fixtureId,
        matchTitle: matchFixture.title || `${matchFixture.team1?.name || ''} vs ${matchFixture.team2?.name || ''}`,
        series: matchFixture.series || 'Cricket Match',
        venue: matchFixture.venue || 'Cricket Stadium',
        toss: matchFixture.statusNote || 'Toss yet to take place',
        status: matchFixture.status || 'Upcoming',
        result: matchFixture.statusNote || 'Match Scheduled',
        crr: '-',
        rrr: '-',
        innings: [],
        commentary: [],
        matchInfo: {
          match: matchFixture.title || 'Match Details',
          series: matchFixture.series || 'Cricket Series',
          date: matchFixture.matchDate || 'Upcoming',
          venue: matchFixture.venue || 'Cricket Stadium',
          toss: matchFixture.statusNote || 'Toss yet to take place',
          umpires: 'N/A',
          thirdUmpire: 'N/A',
          matchReferee: 'N/A',
        },
      },
      isLiveApi: false,
    };
  }

  return { scorecard: null, isLiveApi: false };
}

export async function getIplSchedule() {
  try {
    const res = await postApi('iplSchedule', {});
    const rawList = res.data?.data || res.data?.schedule;
    if (rawList && Array.isArray(rawList) && rawList.length > 0) {
      const mapped = rawList.map((item) => ({
        matchNo: item.matchNumber,
        date: `${item.matchDate} (${item.matchDayName || ''})`.trim(),
        time: item.matchTime || '7:30 PM',
        team1: item.homeTeam,
        team2: item.awayTeam,
        team1Logo: getTeamLogoUrl(item.homeTeamLogo, item.homeTeam),
        team2Logo: getTeamLogoUrl(item.awayTeamLogo, item.awayTeam),
        venue: item.stadium || 'Cricket Stadium',
        matchWinner: item.matchWinner,
      }));
      return { schedule: mapped, isLiveApi: true };
    }
  } catch (err) {
    console.warn('iplSchedule fetch err:', err.message);
  }
  return { schedule: [], isLiveApi: false };
}

export async function getIplPointTable(requestedYear = null) {
  try {
    const res = await postApi('iplPointTable', {});
    const rawData = res.data?.data;
    if (rawData) {
      const years = Object.keys(rawData).sort();
      const latestYear = years[years.length - 1] || '2024';
      const yearToUse = requestedYear && rawData[requestedYear] ? requestedYear : latestYear;
      const tableData = rawData[yearToUse] || [];

      if (Array.isArray(tableData) && tableData.length > 0) {
        const mapped = tableData.map((item, idx) => ({
          rank: item.rank || idx + 1,
          team: item.teamName,
          shortName: item.teamName ? item.teamName.split(' ').map((w) => w[0]).join('') : `T${idx + 1}`,
          logo: getTeamLogoUrl(null, item.teamName),
          played: item.playedMatches ?? 0,
          won: item.wins ?? 0,
          lost: item.losses ?? 0,
          nrr: (item.netRunRate > 0 ? `+${item.netRunRate}` : `${item.netRunRate || '0.00'}`),
          points: item.points ?? (item.wins ? item.wins * 2 : 0),
          form: item.recentForm || [],
        }));
        return { pointsTable: mapped, year: yearToUse, allYears: years.reverse(), isLiveApi: true };
      }
    }
  } catch (err) {
    console.warn('iplPointTable fetch err:', err.message);
  }
  return { pointsTable: [], isLiveApi: false };
}

export async function getIplPlayoff() {
  try {
    const res = await postApi('iplPlayoff', {});
    const rawData = res.data?.data;
    if (rawData) {
      const playoffImages = rawData.playoffImages || [];
      const playoffs = rawData.playoffs || [];
      return { playoffs, playoffImages, isLiveApi: true };
    }
  } catch (err) {
    console.warn('iplPlayoff fetch err:', err.message);
  }
  return { playoffs: [], playoffImages: [], isLiveApi: false };
}
