// Cricket API Service implementing all Postman collection endpoints with fallback support
// Endpoints:
// - POST /inProgressFixtures
// - POST /upcomingFixtures
// - POST /completedFixtures
// - POST /scorecard
// - POST /iplSchedule
// - POST /iplPointTable
// - POST /iplPlayoff

let currentServerUrl = 'http://localhost:3000';
let isDemoModeForced = false;

export const getServerUrl = () => currentServerUrl;
export const setServerUrl = (url) => {
  currentServerUrl = url ? url.trim().replace(/\/$/, '') : 'http://localhost:3000';
};
export const isDemoMode = () => isDemoModeForced;
export const setDemoMode = (enabled) => {
  isDemoModeForced = enabled;
};

// Safe POST helper with timeout
async function postApi(endpoint, body = {}, timeoutMs = 3500) {
  if (isDemoModeForced) {
    throw new Error('Demo mode enabled');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${currentServerUrl}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { data, isLiveApi: true };
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// Check if current server is reachable
export async function testServerConnection(url) {
  const targetUrl = url ? url.trim().replace(/\/$/, '') : currentServerUrl;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(`${targetUrl}/inProgressFixtures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ InProgressFixturesCount: 1 }),
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
      flag: '💙',
      score: '188/6',
      overs: '20.0',
      isBatting: false,
    },
    team2: {
      name: 'Royal Challengers Bengaluru',
      shortName: 'RCB',
      flag: '❤️',
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
      flag: '🇮🇳',
      score: '142/3',
      overs: '15.2',
      isBatting: true,
    },
    team2: {
      name: 'Australia',
      shortName: 'AUS',
      flag: '🇦🇺',
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
      flag: '💜',
      score: '169/8',
      overs: '20.0',
      isBatting: false,
    },
    team2: {
      name: 'Chennai Super Kings',
      shortName: 'CSK',
      flag: '💛',
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
    title: 'Match 50, TATA IPL 2025',
    series: 'Indian Premier League 2025',
    venue: 'Narendra Modi Stadium, Ahmedabad',
    status: 'Upcoming',
    statusNote: 'Starts Today at 7:30 PM IST',
    matchDate: 'Today, 7:30 PM',
    team1: {
      name: 'Gujarat Titans',
      shortName: 'GT',
      flag: '🔷',
      score: '-',
      overs: '-',
    },
    team2: {
      name: 'Rajasthan Royals',
      shortName: 'RR',
      flag: '💖',
      score: '-',
      overs: '-',
    },
  },
  {
    fixtureId: 202,
    title: 'Match 51, TATA IPL 2025',
    series: 'Indian Premier League 2025',
    venue: 'Arun Jaitley Stadium, Delhi',
    status: 'Upcoming',
    statusNote: 'Starts Tomorrow at 3:30 PM IST',
    matchDate: 'Tomorrow, 3:30 PM',
    team1: {
      name: 'Delhi Capitals',
      shortName: 'DC',
      flag: '🔴',
      score: '-',
      overs: '-',
    },
    team2: {
      name: 'Sunrisers Hyderabad',
      shortName: 'SRH',
      flag: '🧡',
      score: '-',
      overs: '-',
    },
  },
  {
    fixtureId: 203,
    title: 'Match 52, TATA IPL 2025',
    series: 'Indian Premier League 2025',
    venue: 'Ekana Stadium, Lucknow',
    status: 'Upcoming',
    statusNote: 'Tomorrow at 7:30 PM IST',
    matchDate: 'Tomorrow, 7:30 PM',
    team1: {
      name: 'Lucknow Super Giants',
      shortName: 'LSG',
      flag: '💠',
      score: '-',
      overs: '-',
    },
    team2: {
      name: 'Punjab Kings',
      shortName: 'PBKS',
      flag: '🦁',
      score: '-',
      overs: '-',
    },
  },
  {
    fixtureId: 204,
    title: '3rd T20I, India tour of Australia',
    series: 'India tour of Australia 2025',
    venue: 'Sydney Cricket Ground, Sydney',
    status: 'Upcoming',
    statusNote: 'Sunday at 1:40 PM IST',
    matchDate: 'Sunday, 1:40 PM',
    team1: {
      name: 'Australia',
      shortName: 'AUS',
      flag: '🇦🇺',
      score: '-',
      overs: '-',
    },
    team2: {
      name: 'India',
      shortName: 'IND',
      flag: '🇮🇳',
      score: '-',
      overs: '-',
    },
  },
];

export const MOCK_COMPLETED_FIXTURES = [
  {
    fixtureId: 301,
    title: 'Match 47, TATA IPL 2025',
    series: 'Indian Premier League 2025',
    venue: 'Eden Gardens, Kolkata',
    status: 'Completed',
    statusNote: 'KKR won by 18 runs 🏆',
    matchDate: 'Yesterday',
    team1: {
      name: 'Kolkata Knight Riders',
      shortName: 'KKR',
      flag: '💜',
      score: '204/5',
      overs: '20.0',
    },
    team2: {
      name: 'Sunrisers Hyderabad',
      shortName: 'SRH',
      flag: '🧡',
      score: '186/8',
      overs: '20.0',
    },
    playerOfTheMatch: 'Andre Russell (54* & 2/22)',
  },
  {
    fixtureId: 302,
    title: 'Match 46, TATA IPL 2025',
    series: 'Indian Premier League 2025',
    venue: 'M. Chinnaswamy Stadium, Bengaluru',
    status: 'Completed',
    statusNote: 'CSK won by 6 wickets (with 4 balls remaining) 🏆',
    matchDate: '2 days ago',
    team1: {
      name: 'Royal Challengers Bengaluru',
      shortName: 'RCB',
      flag: '❤️',
      score: '196/7',
      overs: '20.0',
    },
    team2: {
      name: 'Chennai Super Kings',
      shortName: 'CSK',
      flag: '💛',
      score: '197/4',
      overs: '19.2',
    },
    playerOfTheMatch: 'Ruturaj Gaikwad (82 off 48)',
  },
  {
    fixtureId: 303,
    title: '1st T20I, India tour of Australia',
    series: 'India tour of Australia 2025',
    venue: 'The Gabba, Brisbane',
    status: 'Completed',
    statusNote: 'India won by 12 runs 🏆',
    matchDate: '15 Sep 2025',
    team1: {
      name: 'India',
      shortName: 'IND',
      flag: '🇮🇳',
      score: '182/6',
      overs: '20.0',
    },
    team2: {
      name: 'Australia',
      shortName: 'AUS',
      flag: '🇦🇺',
      score: '170/9',
      overs: '20.0',
    },
    playerOfTheMatch: 'Jasprit Bumrah (3/16 in 4 ov)',
  },
];

export const MOCK_IPL_POINTS_TABLE = [
  { rank: 1, team: 'Kolkata Knight Riders', shortName: 'KKR', flag: '💜', played: 12, won: 9, lost: 3, nrr: '+1.120', points: 18, form: ['W', 'W', 'W', 'L', 'W'] },
  { rank: 2, team: 'Rajasthan Royals', shortName: 'RR', flag: '💖', played: 12, won: 8, lost: 4, nrr: '+0.540', points: 16, form: ['W', 'L', 'W', 'W', 'L'] },
  { rank: 3, team: 'Sunrisers Hyderabad', shortName: 'SRH', flag: '🧡', played: 12, won: 7, lost: 5, nrr: '+0.410', points: 14, form: ['L', 'W', 'W', 'L', 'W'] },
  { rank: 4, team: 'Royal Challengers Bengaluru', shortName: 'RCB', flag: '❤️', played: 12, won: 7, lost: 5, nrr: '+0.387', points: 14, form: ['W', 'W', 'W', 'W', 'L'] },
  { rank: 5, team: 'Chennai Super Kings', shortName: 'CSK', flag: '💛', played: 12, won: 6, lost: 6, nrr: '+0.150', points: 12, form: ['W', 'L', 'W', 'L', 'W'] },
  { rank: 6, team: 'Delhi Capitals', shortName: 'DC', flag: '🔴', played: 12, won: 6, lost: 6, nrr: '-0.120', points: 12, form: ['L', 'W', 'L', 'W', 'L'] },
  { rank: 7, team: 'Lucknow Super Giants', shortName: 'LSG', flag: '💠', played: 12, won: 5, lost: 7, nrr: '-0.240', points: 10, form: ['L', 'L', 'W', 'L', 'W'] },
  { rank: 8, team: 'Gujarat Titans', shortName: 'GT', flag: '🔷', played: 12, won: 5, lost: 7, nrr: '-0.380', points: 10, form: ['W', 'L', 'L', 'W', 'L'] },
  { rank: 9, team: 'Punjab Kings', shortName: 'PBKS', flag: '🦁', played: 12, won: 4, lost: 8, nrr: '-0.420', points: 8, form: ['L', 'L', 'L', 'W', 'L'] },
  { rank: 10, team: 'Mumbai Indians', shortName: 'MI', flag: '💙', played: 12, won: 3, lost: 9, nrr: '-0.560', points: 6, form: ['L', 'L', 'W', 'L', 'L'] },
];

export const MOCK_IPL_SCHEDULE = [
  { matchNo: 50, date: 'Today, 18 Sep', time: '7:30 PM IST', team1: 'Gujarat Titans', team2: 'Rajasthan Royals', venue: 'Narendra Modi Stadium, Ahmedabad' },
  { matchNo: 51, date: 'Tomorrow, 19 Sep', time: '3:30 PM IST', team1: 'Delhi Capitals', team2: 'Sunrisers Hyderabad', venue: 'Arun Jaitley Stadium, Delhi' },
  { matchNo: 52, date: 'Tomorrow, 19 Sep', time: '7:30 PM IST', team1: 'Lucknow Super Giants', team2: 'Punjab Kings', venue: 'Ekana Stadium, Lucknow' },
  { matchNo: 53, date: '20 Sep 2025', time: '7:30 PM IST', team1: 'Chennai Super Kings', team2: 'Mumbai Indians', venue: 'MA Chidambaram Stadium, Chennai' },
  { matchNo: 54, date: '21 Sep 2025', time: '3:30 PM IST', team1: 'Kolkata Knight Riders', team2: 'Rajasthan Royals', venue: 'Eden Gardens, Kolkata' },
  { matchNo: 55, date: '21 Sep 2025', time: '7:30 PM IST', team1: 'Royal Challengers Bengaluru', team2: 'Gujarat Titans', venue: 'M. Chinnaswamy Stadium, Bengaluru' },
  { matchNo: 56, date: '22 Sep 2025', time: '7:30 PM IST', team1: 'Sunrisers Hyderabad', team2: 'Lucknow Super Giants', venue: 'Rajiv Gandhi Stadium, Hyderabad' },
];

export const MOCK_IPL_PLAYOFFS = [
  {
    stage: 'Qualifier 1',
    date: '24 Sep 2025 • 7:30 PM',
    venue: 'Narendra Modi Stadium, Ahmedabad',
    team1: 'KKR (Rank 1)',
    team2: 'RR (Rank 2)',
    status: 'Upcoming',
    note: 'Winner goes directly to Final, Loser to Qualifier 2',
  },
  {
    stage: 'Eliminator',
    date: '25 Sep 2025 • 7:30 PM',
    venue: 'Narendra Modi Stadium, Ahmedabad',
    team1: 'SRH (Rank 3)',
    team2: 'RCB (Rank 4)',
    status: 'Upcoming',
    note: 'Winner goes to Qualifier 2, Loser eliminated',
  },
  {
    stage: 'Qualifier 2',
    date: '27 Sep 2025 • 7:30 PM',
    venue: 'MA Chidambaram Stadium, Chennai',
    team1: 'Loser of Q1',
    team2: 'Winner of Eliminator',
    status: 'Upcoming',
    note: 'Winner advances to Final',
  },
  {
    stage: 'Grand Final',
    date: '29 Sep 2025 • 7:30 PM',
    venue: 'MA Chidambaram Stadium, Chennai',
    team1: 'Winner of Q1',
    team2: 'Winner of Q2',
    status: 'Upcoming',
    note: 'TATA IPL 2025 Championship Match 🏆',
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
        { name: 'Romario Shepherd', status: 'b Ferguson', runs: 1, balls: 2, fours: 0, sixes: 0, sr: 50.0 },
      ],
      bowling: [
        { name: 'Mohammed Siraj', overs: '4.0', maidens: 0, runs: 37, wickets: 2, economy: 9.25 },
        { name: 'Yash Dayal', overs: '4.0', maidens: 0, runs: 35, wickets: 1, economy: 8.75 },
        { name: 'Lockie Ferguson', overs: '4.0', maidens: 0, runs: 34, wickets: 2, economy: 8.50 },
        { name: 'Cameron Green', overs: '4.0', maidens: 0, runs: 42, wickets: 1, economy: 10.50 },
        { name: 'Glenn Maxwell', overs: '4.0', maidens: 0, runs: 36, wickets: 0, economy: 9.00 },
      ],
      fallOfWickets: [
        { wicket: 1, runs: 58, over: '5.4', batsman: 'Ishan Kishan' },
        { wicket: 2, runs: 85, over: '8.2', batsman: 'Rohit Sharma' },
        { wicket: 3, runs: 135, over: '14.1', batsman: 'Tilak Varma' },
        { wicket: 4, runs: 168, over: '17.3', batsman: 'Suryakumar Yadav' },
        { wicket: 5, runs: 175, over: '18.4', batsman: 'Hardik Pandya' },
        { wicket: 6, runs: 180, over: '19.1', batsman: 'Romario Shepherd' },
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
        { name: 'Will Jacks', status: 'b Coetzee', runs: 15, balls: 11, fours: 2, sixes: 0, sr: 136.3 },
        { name: 'Rajat Patidar', status: 'c Kishan b Bumrah', runs: 19, balls: 15, fours: 2, sixes: 1, sr: 126.6 },
        { name: 'Dinesh Karthik (WK)', status: 'batting *', runs: 28, balls: 14, fours: 3, sixes: 1, sr: 200.0 },
      ],
      bowling: [
        { name: 'Jasprit Bumrah', overs: '3.1', maidens: 0, runs: 21, wickets: 2, economy: 6.63 },
        { name: 'Gerald Coetzee', overs: '4.0', maidens: 0, runs: 42, wickets: 1, economy: 10.50 },
        { name: 'Hardik Pandya', overs: '4.0', maidens: 0, runs: 38, wickets: 0, economy: 9.50 },
        { name: 'Piyush Chawla', overs: '4.0', maidens: 0, runs: 39, wickets: 1, economy: 9.75 },
        { name: 'Nuwan Thushara', overs: '3.0', maidens: 0, runs: 32, wickets: 0, economy: 10.66 },
      ],
      fallOfWickets: [
        { wicket: 1, runs: 52, over: '5.2', batsman: 'Faf du Plessis' },
        { wicket: 2, runs: 79, over: '8.3', batsman: 'Will Jacks' },
        { wicket: 3, runs: 128, over: '14.2', batsman: 'Rajat Patidar' },
      ],
    },
  ],
  commentary: [
    { over: '18.1', text: '1 run, Bumrah fires in a 144kph yorker right at the base of off stump! Kohli jams his bat down and scampers through for a quick single.', type: 'run' },
    { over: '17.6', text: 'FOUR! Slashed away through backward point! Dinesh Karthik gets width from Coetzee and carves it with perfection to the fence.', type: 'four' },
    { over: '17.5', text: 'SIX! Into the stands! Length ball on middle, DK walks across and scoops it clean over fine leg for a mammoth maximum!', type: 'six' },
    { over: '17.4', text: 'Dot ball. Good bouncer outside off, Karthik tries the upper cut but is beaten for pace.', type: 'dot' },
    { over: '17.3', text: '2 runs. Driven down the ground to long-off, aggressive running turns 1 into 2!', type: 'run' },
    { over: '17.2', text: '1 run. Full toss on the pads, clipped towards deep midwicket by Kohli for one.', type: 'run' },
    { over: '17.1', text: 'Wide ball! Slipped down leg by Coetzee. Umpire signals wide.', type: 'extra' },
    { over: '16.6', text: 'WICKET! In the air and caught! Patidar looks for the big heave over midwicket, mistimes it completely and Tim David takes a calm catch.', type: 'wicket' },
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
// Public API Calls
// -------------------------------------------------------------

export async function getInProgressFixtures(count = 10) {
  try {
    const res = await postApi('inProgressFixtures', { InProgressFixturesCount: count });
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return { fixtures: res.data, isLiveApi: true };
    }
    if (res.data && res.data.fixtures && Array.isArray(res.data.fixtures)) {
      return { fixtures: res.data.fixtures, isLiveApi: true };
    }
    return { fixtures: MOCK_IN_PROGRESS_FIXTURES, isLiveApi: false };
  } catch (err) {
    return { fixtures: MOCK_IN_PROGRESS_FIXTURES, isLiveApi: false, error: err.message };
  }
}

export async function getUpcomingFixtures(count = 10) {
  try {
    const res = await postApi('upcomingFixtures', { UpcomingFixturesCount: count });
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return { fixtures: res.data, isLiveApi: true };
    }
    if (res.data && res.data.fixtures && Array.isArray(res.data.fixtures)) {
      return { fixtures: res.data.fixtures, isLiveApi: true };
    }
    return { fixtures: MOCK_UPCOMING_FIXTURES, isLiveApi: false };
  } catch (err) {
    return { fixtures: MOCK_UPCOMING_FIXTURES, isLiveApi: false, error: err.message };
  }
}

export async function getCompletedFixtures(count = 10) {
  try {
    // Some backends use completedFixtures, some inProgressFixtures with completed flag
    let res;
    try {
      res = await postApi('completedFixtures', { InProgressFixturesCount: count });
    } catch {
      res = await postApi('inProgressFixtures', { InProgressFixturesCount: count });
    }

    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      return { fixtures: res.data, isLiveApi: true };
    }
    if (res?.data && res.data.fixtures && Array.isArray(res.data.fixtures)) {
      return { fixtures: res.data.fixtures, isLiveApi: true };
    }
    return { fixtures: MOCK_COMPLETED_FIXTURES, isLiveApi: false };
  } catch (err) {
    return { fixtures: MOCK_COMPLETED_FIXTURES, isLiveApi: false, error: err.message };
  }
}

export async function getScorecard(fixtureId) {
  try {
    const res = await postApi('scorecard', { fixtureId: Number(fixtureId) || 10 });
    if (res.data && (res.data.innings || res.data.matchTitle || res.data.fixtureId)) {
      return { scorecard: res.data, isLiveApi: true };
    }
    return { scorecard: MOCK_DETAILED_SCORECARD, isLiveApi: false };
  } catch (err) {
    return { scorecard: MOCK_DETAILED_SCORECARD, isLiveApi: false, error: err.message };
  }
}

export async function getIplSchedule() {
  try {
    const res = await postApi('iplSchedule', {});
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return { schedule: res.data, isLiveApi: true };
    }
    if (res.data && res.data.schedule && Array.isArray(res.data.schedule)) {
      return { schedule: res.data.schedule, isLiveApi: true };
    }
    return { schedule: MOCK_IPL_SCHEDULE, isLiveApi: false };
  } catch (err) {
    return { schedule: MOCK_IPL_SCHEDULE, isLiveApi: false, error: err.message };
  }
}

export async function getIplPointTable() {
  try {
    const res = await postApi('iplPointTable', {});
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return { pointsTable: res.data, isLiveApi: true };
    }
    if (res.data && res.data.pointsTable && Array.isArray(res.data.pointsTable)) {
      return { pointsTable: res.data.pointsTable, isLiveApi: true };
    }
    return { pointsTable: MOCK_IPL_POINTS_TABLE, isLiveApi: false };
  } catch (err) {
    return { pointsTable: MOCK_IPL_POINTS_TABLE, isLiveApi: false, error: err.message };
  }
}

export async function getIplPlayoff() {
  try {
    const res = await postApi('iplPlayoff', {});
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return { playoffs: res.data, isLiveApi: true };
    }
    if (res.data && res.data.playoffs && Array.isArray(res.data.playoffs)) {
      return { playoffs: res.data.playoffs, isLiveApi: true };
    }
    return { playoffs: MOCK_IPL_PLAYOFFS, isLiveApi: false };
  } catch (err) {
    return { playoffs: MOCK_IPL_PLAYOFFS, isLiveApi: false, error: err.message };
  }
}
