import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_TEAMS, INITIAL_INNINGS_STATE, DISMISSAL_TYPES } from '../utils/cricketConstants';

const CricketContext = createContext();

export const CricketProvider = ({ children }) => {
  // Match configuration
  const [matchConfig, setMatchConfig] = useState({
    team1: DEFAULT_TEAMS.team1,
    team2: DEFAULT_TEAMS.team2,
    totalOvers: 10,
    tossWinner: 'India',
    tossDecision: 'Bat', // 'Bat' | 'Bowl'
  });

  // Current match state
  const [currentInningsIndex, setCurrentInningsIndex] = useState(1); // 1 or 2
  const [firstInnings, setFirstInnings] = useState(() =>
    INITIAL_INNINGS_STATE(DEFAULT_TEAMS.team1, DEFAULT_TEAMS.team2)
  );
  const [secondInnings, setSecondInnings] = useState(() =>
    INITIAL_INNINGS_STATE(DEFAULT_TEAMS.team2, DEFAULT_TEAMS.team1)
  );

  // Match status: 'live' | 'innings_break' | 'completed'
  const [matchStatus, setMatchStatus] = useState('live');
  const [matchResult, setMatchResult] = useState('');
  const [freeHit, setFreeHit] = useState(false);

  // Undo history stack
  const [historyStack, setHistoryStack] = useState([]);

  // Match list history for past games
  const [matchHistoryList, setMatchHistoryList] = useState([]);

  const currentInnings = currentInningsIndex === 1 ? firstInnings : secondInnings;
  const targetRuns = currentInningsIndex === 2 ? firstInnings.runs + 1 : null;

  // Save state snapshot for Undo
  const saveSnapshot = () => {
    const snapshot = {
      currentInningsIndex,
      firstInnings: JSON.parse(JSON.stringify(firstInnings)),
      secondInnings: JSON.parse(JSON.stringify(secondInnings)),
      matchStatus,
      matchResult,
      freeHit,
    };
    setHistoryStack(prev => [...prev.slice(-30), snapshot]);
  };

  // Undo previous ball
  const undoLastBall = () => {
    if (historyStack.length === 0) return false;
    const previous = historyStack[historyStack.length - 1];
    setHistoryStack(prev => prev.slice(0, prev.length - 1));
    setCurrentInningsIndex(previous.currentInningsIndex);
    setFirstInnings(previous.firstInnings);
    setSecondInnings(previous.secondInnings);
    setMatchStatus(previous.matchStatus);
    setMatchResult(previous.matchResult);
    setFreeHit(previous.freeHit);
    return true;
  };

  // Helper to update current innings safely
  const updateCurrentInnings = (updater) => {
    if (currentInningsIndex === 1) {
      setFirstInnings(prev => updater(prev));
    } else {
      setSecondInnings(prev => updater(prev));
    }
  };

  // Switch striker and non-striker
  const rotateStrike = () => {
    updateCurrentInnings(inn => ({
      ...inn,
      strikerIndex: inn.nonStrikerIndex,
      nonStrikerIndex: inn.strikerIndex,
    }));
  };

  // Select next bowler
  const selectBowler = (bowlerIndex) => {
    updateCurrentInnings(inn => ({
      ...inn,
      activeBowlerIndex: bowlerIndex,
    }));
  };

  // Select next batsman when someone gets out
  const selectNextBatsman = (batsmanIndex) => {
    updateCurrentInnings(inn => {
      const nextBatsmen = [...inn.batsmen];
      nextBatsmen[batsmanIndex] = {
        ...nextBatsmen[batsmanIndex],
        status: 'batting',
      };
      return {
        ...inn,
        batsmen: nextBatsmen,
        strikerIndex: batsmanIndex,
      };
    });
  };

  // Record a delivery (Runs, Extras, Wicket)
  const recordBall = ({
    runs = 0,
    isExtra = false,
    extraType = null, // 'WD', 'NB', 'B', 'LB'
    isWicket = false,
    dismissalType = DISMISSAL_TYPES.CAUGHT,
    nextBatsmanIndex = null,
  }) => {
    if (matchStatus === 'completed') return;

    saveSnapshot();

    let newFreeHit = false;
    const isLegalBall = extraType !== 'WD' && extraType !== 'NB';

    updateCurrentInnings(inn => {
      let updatedRuns = inn.runs;
      let updatedWickets = inn.wickets;
      let updatedBalls = inn.balls;
      let updatedOvers = inn.overs;
      let updatedLegalBalls = inn.totalLegalBalls;
      let updatedExtras = { ...inn.extras };

      let updatedBatsmen = inn.batsmen.map(b => ({ ...b }));
      let updatedBowlers = inn.bowlers.map(bw => ({ ...bw }));
      let currentOverBalls = [...inn.currentOverBalls];
      let allOvers = [...inn.allOvers];
      let fallOfWickets = [...inn.fallOfWickets];

      let striker = updatedBatsmen[inn.strikerIndex];
      let bowler = updatedBowlers[inn.activeBowlerIndex];

      let ballLabel = '';
      let ballColor = 'default';

      if (isWicket) {
        // Record Wicket
        updatedWickets += 1;
        striker.isOut = true;
        striker.status = 'out';
        striker.balls += 1;
        striker.strikeRate = striker.balls > 0 ? Number(((striker.runs / striker.balls) * 100).toFixed(1)) : 0;
        striker.dismissalText = `${dismissalType} b ${bowler?.name || 'Bowler'}`;

        bowler.wickets += 1;
        bowler.balls += 1;
        updatedBalls += 1;
        updatedLegalBalls += 1;

        ballLabel = 'W';
        ballColor = 'wicket';

        fallOfWickets.push({
          wicketNumber: updatedWickets,
          score: updatedRuns,
          over: `${updatedOvers}.${updatedBalls}`,
          batsmanName: striker.name,
        });

        // Next batsman comes in if provided
        if (nextBatsmanIndex !== null && updatedBatsmen[nextBatsmanIndex]) {
          updatedBatsmen[nextBatsmanIndex].status = 'batting';
        }
      } else if (extraType === 'WD') {
        // Wide ball: 1 run penalty + any bye/run scored
        const wideRuns = 1 + runs;
        updatedRuns += wideRuns;
        updatedExtras.wides += wideRuns;
        updatedExtras.total += wideRuns;

        bowler.runs += wideRuns;
        bowler.wides += 1;

        ballLabel = runs > 0 ? `${runs + 1}Wd` : 'Wd';
        ballColor = 'extra';
      } else if (extraType === 'NB') {
        // No ball: 1 run penalty + bat runs
        const nbRuns = 1 + runs;
        updatedRuns += nbRuns;
        updatedExtras.noBalls += 1;
        updatedExtras.total += 1;

        striker.runs += runs;
        striker.balls += 1;
        if (runs === 4) striker.fours += 1;
        if (runs === 6) striker.sixes += 1;
        striker.strikeRate = Number(((striker.runs / striker.balls) * 100).toFixed(1));

        bowler.runs += nbRuns;
        bowler.noBalls += 1;

        ballLabel = runs > 0 ? `${runs}Nb` : 'Nb';
        ballColor = 'extra';
        newFreeHit = true;
      } else if (extraType === 'B' || extraType === 'LB') {
        // Bye or Leg Bye: legal ball, bowler conceded 0, bat runs 0
        updatedRuns += runs;
        if (extraType === 'B') updatedExtras.byes += runs;
        if (extraType === 'LB') updatedExtras.legByes += runs;
        updatedExtras.total += runs;

        striker.balls += 1;
        bowler.balls += 1;
        updatedBalls += 1;
        updatedLegalBalls += 1;

        ballLabel = `${runs}${extraType}`;
        ballColor = 'extra';
      } else {
        // Standard bat runs (0, 1, 2, 3, 4, 6)
        updatedRuns += runs;
        striker.runs += runs;
        striker.balls += 1;
        if (runs === 4) striker.fours += 1;
        if (runs === 6) striker.sixes += 1;
        striker.strikeRate = Number(((striker.runs / striker.balls) * 100).toFixed(1));

        bowler.runs += runs;
        bowler.balls += 1;
        updatedBalls += 1;
        updatedLegalBalls += 1;

        ballLabel = runs === 0 ? '•' : `${runs}`;
        if (runs === 4) ballColor = 'four';
        else if (runs === 6) ballColor = 'six';
        else if (runs === 0) ballColor = 'dot';
        else ballColor = 'run';
      }

      currentOverBalls.push({
        id: `ball_${Date.now()}_${Math.random()}`,
        label: ballLabel,
        color: ballColor,
        runs,
        isLegalBall,
      });

      // Update bowler economy and overs
      const totalBowlerOversFloat = Math.floor(bowler.balls / 6) + (bowler.balls % 6) / 10;
      bowler.overs = totalBowlerOversFloat;
      const bowlerTotalOversDec = bowler.balls / 6;
      bowler.economy = bowlerTotalOversDec > 0 ? Number((bowler.runs / bowlerTotalOversDec).toFixed(2)) : 0;

      let nextStrikerIndex = inn.strikerIndex;
      let nextNonStrikerIndex = inn.nonStrikerIndex;

      // Strike rotation on odd runs (1, 3, 5)
      if (runs % 2 !== 0 && !isWicket) {
        const temp = nextStrikerIndex;
        nextStrikerIndex = nextNonStrikerIndex;
        nextNonStrikerIndex = temp;
      }

      // Check if over completed (6 legal balls)
      if (isLegalBall && updatedBalls === 6) {
        const overRuns = currentOverBalls.reduce((acc, b) => acc + (b.runs || 0), 0);
        allOvers.push({
          overNumber: updatedOvers + 1,
          balls: [...currentOverBalls],
          bowlerName: bowler.name,
          runs: overRuns,
        });

        updatedOvers += 1;
        updatedBalls = 0;
        currentOverBalls = [];

        // Rotate strike at the end of the over
        const temp = nextStrikerIndex;
        nextStrikerIndex = nextNonStrikerIndex;
        nextNonStrikerIndex = temp;

        // Auto select next bowler in line
        const nextBowlerIdx = (inn.activeBowlerIndex + 1) % inn.bowlers.length;
        inn.activeBowlerIndex = nextBowlerIdx;
      }

      // If wicket fell, set new striker
      if (isWicket && nextBatsmanIndex !== null) {
        nextStrikerIndex = nextBatsmanIndex;
      }

      return {
        ...inn,
        runs: updatedRuns,
        wickets: updatedWickets,
        overs: updatedOvers,
        balls: updatedBalls,
        totalLegalBalls: updatedLegalBalls,
        extras: updatedExtras,
        batsmen: updatedBatsmen,
        bowlers: updatedBowlers,
        strikerIndex: nextStrikerIndex,
        nonStrikerIndex: nextNonStrikerIndex,
        currentOverBalls,
        allOvers,
        fallOfWickets,
      };
    });

    setFreeHit(newFreeHit);
  };

  // Check end of innings / match
  useEffect(() => {
    const totalOvers = matchConfig.totalOvers;

    // Check 1st innings completion
    if (currentInningsIndex === 1 && matchStatus === 'live') {
      const isOversDone = firstInnings.overs >= totalOvers;
      const isAllOut = firstInnings.wickets >= firstInnings.batsmen.length - 1;

      if (isOversDone || isAllOut) {
        setMatchStatus('innings_break');
      }
    }

    // Check 2nd innings completion
    if (currentInningsIndex === 2 && matchStatus === 'live') {
      const target = firstInnings.runs + 1;
      const isTargetReached = secondInnings.runs >= target;
      const isOversDone = secondInnings.overs >= totalOvers;
      const isAllOut = secondInnings.wickets >= secondInnings.batsmen.length - 1;

      if (isTargetReached) {
        const remainingWickets = (secondInnings.batsmen.length - 1) - secondInnings.wickets;
        const resultStr = `${secondInnings.teamName} won by ${remainingWickets} wicket${remainingWickets > 1 ? 's' : ''}! 🏆`;
        setMatchResult(resultStr);
        setMatchStatus('completed');
        recordMatchToHistory(resultStr);
      } else if (isOversDone || isAllOut) {
        if (secondInnings.runs === firstInnings.runs) {
          const resultStr = `Match Tied! A thrilling Super Over is needed! 🤝`;
          setMatchResult(resultStr);
          setMatchStatus('completed');
          recordMatchToHistory(resultStr);
        } else {
          const runDiff = firstInnings.runs - secondInnings.runs;
          const resultStr = `${firstInnings.teamName} won by ${runDiff} run${runDiff > 1 ? 's' : ''}! 🏆`;
          setMatchResult(resultStr);
          setMatchStatus('completed');
          recordMatchToHistory(resultStr);
        }
      }
    }
  }, [firstInnings, secondInnings, currentInningsIndex, matchStatus, matchConfig.totalOvers]);

  // Start second innings
  const startSecondInnings = () => {
    setCurrentInningsIndex(2);
    setMatchStatus('live');
  };

  // Save completed match into history
  const recordMatchToHistory = (result) => {
    const matchRecord = {
      id: `match_${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      team1: firstInnings.teamName,
      team1Score: `${firstInnings.runs}/${firstInnings.wickets} (${firstInnings.overs}.${firstInnings.balls} ov)`,
      team2: secondInnings.teamName,
      team2Score: `${secondInnings.runs}/${secondInnings.wickets} (${secondInnings.overs}.${secondInnings.balls} ov)`,
      result,
      overs: matchConfig.totalOvers,
    };
    setMatchHistoryList(prev => [matchRecord, ...prev]);
  };

  // Reset & Start a brand new match
  const startNewMatch = (newConfig) => {
    const cfg = newConfig || matchConfig;
    setMatchConfig(cfg);

    // Determine who bats first based on toss
    const team1BatsFirst =
      (cfg.tossWinner === cfg.team1.name && cfg.tossDecision === 'Bat') ||
      (cfg.tossWinner === cfg.team2.name && cfg.tossDecision === 'Bowl');

    const battingFirstTeam = team1BatsFirst ? cfg.team1 : cfg.team2;
    const bowlingFirstTeam = team1BatsFirst ? cfg.team2 : cfg.team1;

    setFirstInnings(INITIAL_INNINGS_STATE(battingFirstTeam, bowlingFirstTeam));
    setSecondInnings(INITIAL_INNINGS_STATE(bowlingFirstTeam, battingFirstTeam));
    setCurrentInningsIndex(1);
    setMatchStatus('live');
    setMatchResult('');
    setFreeHit(false);
    setHistoryStack([]);
  };

  return (
    <CricketContext.Provider
      value={{
        matchConfig,
        currentInningsIndex,
        currentInnings,
        firstInnings,
        secondInnings,
        matchStatus,
        matchResult,
        targetRuns,
        freeHit,
        canUndo: historyStack.length > 0,
        recordBall,
        undoLastBall,
        rotateStrike,
        selectBowler,
        selectNextBatsman,
        startSecondInnings,
        startNewMatch,
        matchHistoryList,
      }}
    >
      {children}
    </CricketContext.Provider>
  );
};

export const useCricket = () => useContext(CricketContext);
