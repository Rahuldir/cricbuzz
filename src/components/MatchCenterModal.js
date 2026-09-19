import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getScorecard, getTeamDetail, getTeamForm, getTeamMatches } from '../services/cricketApi';
import { TeamFlag } from '../utils/flagHelper';

export default function MatchCenterModal({ visible, fixture, onClose }) {
  const { theme, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'scorecard' | 'teams' | 'info'
  const [scorecardData, setScorecardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInningTab, setSelectedInningTab] = useState(1);

  // Teams & Squad Tab State
  const [selectedTeamTab, setSelectedTeamTab] = useState('team1'); // 'team1' | 'team2'
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [teamDetail, setTeamDetail] = useState(null);
  const [teamForm, setTeamForm] = useState([]);
  const [teamRecentMatches, setTeamRecentMatches] = useState([]);

  useEffect(() => {
    if (visible && fixture) {
      loadScorecard();
    }
  }, [visible, fixture]);

  useEffect(() => {
    if (visible && fixture && activeTab === 'teams') {
      loadTeamInfo();
    }
  }, [visible, fixture, activeTab, selectedTeamTab]);

  const loadScorecard = async () => {
    setLoading(true);
    const res = await getScorecard(fixture?.fixtureId || fixture?.id, fixture);
    setScorecardData(res.scorecard);
    setLoading(false);
  };

  const loadTeamInfo = async () => {
    const activeTeamObj = selectedTeamTab === 'team1' ? fixture?.team1 : fixture?.team2;
    if (!activeTeamObj?.id) {
      setTeamDetail(null);
      setTeamForm([]);
      setTeamRecentMatches([]);
      return;
    }

    setLoadingTeam(true);
    try {
      const [detailRes, formRes, matchRes] = await Promise.all([
        getTeamDetail(activeTeamObj.id),
        getTeamForm(activeTeamObj.id),
        getTeamMatches(activeTeamObj.id),
      ]);

      setTeamDetail(detailRes);
      setTeamForm(formRes || []);
      setTeamRecentMatches(matchRes || []);
    } catch (err) {
      console.warn('Team detail fetch err:', err.message);
    } finally {
      setLoadingTeam(false);
    }
  };

  if (!visible || !fixture) return null;

  const currentInning = scorecardData?.innings?.find((inn) => inn.inningNumber === selectedInningTab) || scorecardData?.innings?.[0];
  const activeTeamObj = selectedTeamTab === 'team1' ? fixture?.team1 : fixture?.team2;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ backgroundColor: theme.bg }} className="flex-1">
        {/* Top Header Bar */}
        <View
          style={{ backgroundColor: theme.headerBg }}
          className="px-4 pt-12 pb-3 flex-row items-center justify-between shadow-md"
        >
          <TouchableOpacity onPress={onClose} className="p-1 -ml-1 flex-row items-center">
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            <Text className="text-white text-xs font-semibold ml-1">Back</Text>
          </TouchableOpacity>

          <View className="items-center flex-1 mx-2">
            <Text className="text-white font-extrabold text-sm tracking-wide" numberOfLines={1}>
              {fixture.series || 'Match Center'}
            </Text>
            <Text className="text-emerald-200 text-[11px] font-medium" numberOfLines={1}>
              {fixture.title || fixture.venue}
            </Text>
          </View>

          <TouchableOpacity onPress={loadScorecard} className="p-1">
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Match Summary Mini Card */}
        <View
          style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
          className="mx-4 mt-3 p-3.5 rounded-2xl border shadow-sm"
        >
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center space-x-1.5">
              <View
                style={{
                  backgroundColor: fixture.status === 'Live' ? '#EF444415' : theme.accentLight,
                }}
                className="px-2 py-0.5 rounded-full flex-row items-center mr-2"
              >
                {fixture.status === 'Live' && (
                  <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-pulse" />
                )}
                <Text
                  style={{
                    color: fixture.status === 'Live' ? '#EF4444' : theme.accent,
                  }}
                  className="text-[10px] font-black uppercase"
                >
                  {fixture.status}
                </Text>
              </View>
              <Text style={{ color: theme.textMuted }} className="text-[11px]">
                {fixture.venue}
              </Text>
            </View>
          </View>

          {/* Teams and Scores */}
          <View className="space-y-1.5 py-1">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center space-x-2 flex-1 mr-2">
                <TeamFlag
                  logo={fixture.team1?.logo}
                  teamName={fixture.team1?.name}
                  countryCode={fixture.team1?.shortName}
                  size={24}
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: theme.text }} className="font-extrabold text-sm flex-1" numberOfLines={1}>
                  {fixture.team1?.name}
                </Text>
              </View>
              <Text style={{ color: theme.text }} className="font-mono font-black text-sm">
                {fixture.team1?.score}{' '}
                {fixture.team1?.overs && fixture.team1.overs !== '-' && (
                  <Text style={{ color: theme.textMuted }} className="text-xs font-normal">
                    ({fixture.team1?.overs} ov)
                  </Text>
                )}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center space-x-2 flex-1 mr-2">
                <TeamFlag
                  logo={fixture.team2?.logo}
                  teamName={fixture.team2?.name}
                  countryCode={fixture.team2?.shortName}
                  size={24}
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: theme.text }} className="font-extrabold text-sm flex-1" numberOfLines={1}>
                  {fixture.team2?.name}
                </Text>
              </View>
              <Text style={{ color: theme.text }} className="font-mono font-black text-sm">
                {fixture.team2?.score}{' '}
                {fixture.team2?.overs && fixture.team2.overs !== '-' && (
                  <Text style={{ color: theme.textMuted }} className="text-xs font-normal">
                    ({fixture.team2?.overs} ov)
                  </Text>
                )}
              </Text>
            </View>
          </View>

          {/* Match Status Note */}
          <View className="mt-2 pt-2 border-t flex-row items-center" style={{ borderColor: theme.divider }}>
            <Ionicons name="information-circle-outline" size={14} color={theme.accent} style={{ marginRight: 4 }} />
            <Text style={{ color: theme.accent }} className="text-xs font-bold flex-1" numberOfLines={1}>
              {fixture.statusNote || fixture.matchDate || 'Match in progress'}
            </Text>
          </View>
        </View>

        {/* Cricbuzz Segment Tabs */}
        <View className="flex-row mx-4 mt-3 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-xl">
          {[
            { id: 'live', label: 'Live & Commentary', icon: 'flash' },
            { id: 'scorecard', label: 'Scorecard', icon: 'document-text' },
            { id: 'teams', label: 'Teams & Playing XI', icon: 'people' },
            { id: 'info', label: 'Match Info', icon: 'information-circle' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? theme.card : 'transparent',
              }}
              className="flex-1 py-2 rounded-lg items-center flex-row justify-center shadow-xs"
            >
              <Ionicons
                name={tab.icon}
                size={13}
                color={activeTab === tab.id ? theme.accent : theme.textMuted}
                style={{ marginRight: 3 }}
              />
              <Text
                style={{
                  color: activeTab === tab.id ? theme.text : theme.textMuted,
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                }}
                className="text-[11px]"
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content Body */}
        {loading ? (
          <View className="flex-1 justify-center items-center py-12">
            <ActivityIndicator size="large" color={theme.accent} />
            <Text style={{ color: theme.textMuted }} className="text-xs font-semibold mt-3">
              Loading Match Center...
            </Text>
          </View>
        ) : (
          <ScrollView className="flex-1 px-4 mt-3" showsVerticalScrollIndicator={false}>
            {/* 1. LIVE & COMMENTARY TAB */}
            {activeTab === 'live' && (
              <View className="space-y-3 pb-8">
                {/* Active Batsmen & Bowler Live Strip */}
                {fixture.currentBatsmen && (
                  <View
                    style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
                    className="p-3.5 rounded-2xl border shadow-sm"
                  >
                    <Text style={{ color: theme.textMuted }} className="text-[10px] font-black uppercase mb-2">
                      Current Batters & Bowler
                    </Text>

                    {/* Batsmen table */}
                    <View className="flex-row justify-between pb-1 border-b" style={{ borderColor: theme.divider }}>
                      <Text style={{ color: theme.textMuted }} className="text-xs font-semibold flex-1">
                        Batter
                      </Text>
                      <Text style={{ color: theme.textMuted }} className="text-xs font-semibold w-8 text-right">R</Text>
                      <Text style={{ color: theme.textMuted }} className="text-xs font-semibold w-8 text-right">B</Text>
                      <Text style={{ color: theme.textMuted }} className="text-xs font-semibold w-8 text-right">4s</Text>
                      <Text style={{ color: theme.textMuted }} className="text-xs font-semibold w-8 text-right">6s</Text>
                      <Text style={{ color: theme.textMuted }} className="text-xs font-semibold w-12 text-right">SR</Text>
                    </View>

                    {fixture.currentBatsmen.map((b, idx) => {
                      const sr = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0';
                      return (
                        <View key={idx} className="flex-row justify-between items-center py-1.5">
                          <Text style={{ color: theme.text }} className="text-xs font-bold flex-1" numberOfLines={1}>
                            {b.name} {b.isStriker ? <Text style={{ color: theme.accent }}>*</Text> : ''}
                          </Text>
                          <Text style={{ color: theme.text }} className="text-xs font-extrabold w-8 text-right">{b.runs}</Text>
                          <Text style={{ color: theme.textSecondary }} className="text-xs w-8 text-right">{b.balls}</Text>
                          <Text style={{ color: theme.textSecondary }} className="text-xs w-8 text-right">{b.fours}</Text>
                          <Text style={{ color: theme.textSecondary }} className="text-xs w-8 text-right">{b.sixes}</Text>
                          <Text style={{ color: theme.accent }} className="text-xs font-bold w-12 text-right">{sr}</Text>
                        </View>
                      );
                    })}

                    {/* Bowler info */}
                    {fixture.currentBowler && (
                      <View className="mt-2 pt-2 border-t flex-row justify-between items-center" style={{ borderColor: theme.divider }}>
                        <Text style={{ color: theme.text }} className="text-xs font-bold">
                          Bowler: <Text style={{ color: theme.accent }}>{fixture.currentBowler.name}</Text>
                        </Text>
                        <Text style={{ color: theme.textSecondary }} className="text-xs font-mono">
                          {fixture.currentBowler.wickets}/{fixture.currentBowler.runs} ({fixture.currentBowler.overs} ov)
                        </Text>
                      </View>
                    )}

                    {/* Recent balls pill */}
                    {fixture.recentBalls && (
                      <View className="mt-2 pt-2 border-t flex-row items-center" style={{ borderColor: theme.divider }}>
                        <Text style={{ color: theme.textMuted }} className="text-[11px] font-semibold mr-2">
                          Recent:
                        </Text>
                        <View className="flex-row space-x-1.5">
                          {fixture.recentBalls.map((ball, bIdx) => {
                            let badgeBg = theme.inputBg;
                            let badgeColor = theme.text;
                            if (ball === 'W') {
                              badgeBg = theme.wicketBadge;
                              badgeColor = '#FFFFFF';
                            } else if (ball === '4') {
                              badgeBg = theme.fourBadge;
                              badgeColor = '#FFFFFF';
                            } else if (ball === '6') {
                              badgeBg = theme.sixBadge;
                              badgeColor = '#FFFFFF';
                            }
                            return (
                              <View
                                key={bIdx}
                                style={{ backgroundColor: badgeBg }}
                                className="w-6 h-6 rounded-full items-center justify-center mr-1"
                              >
                                <Text style={{ color: badgeColor }} className="text-[10px] font-black">
                                  {ball}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    )}
                  </View>
                )}

                {/* Cricbuzz Ball-by-ball Commentary Feed */}
                <View
                  style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
                  className="p-3.5 rounded-2xl border shadow-sm"
                >
                  <View className="flex-row items-center justify-between pb-2 border-b" style={{ borderColor: theme.divider }}>
                    <Text style={{ color: theme.text }} className="font-extrabold text-sm">
                      Ball by Ball Commentary
                    </Text>
                    <View className="flex-row items-center">
                      <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />
                      <Text style={{ color: theme.accent }} className="text-xs font-semibold">Live Feed</Text>
                    </View>
                  </View>

                  {(scorecardData?.commentary && scorecardData.commentary.length > 0) ? (
                    scorecardData.commentary.map((comm, cIdx) => {
                      return (
                        <View
                          key={cIdx}
                          className="py-2.5 border-b flex-row"
                          style={{ borderColor: theme.cardBorderSubtle }}
                        >
                          <View className="w-11 mr-2 pt-0.5">
                            <Text style={{ color: theme.accent }} className="font-bold text-xs font-mono">
                              {comm.over}
                            </Text>
                          </View>
                          <View className="flex-1">
                            <Text style={{ color: theme.text }} className="text-xs leading-5">
                              {comm.text}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <View className="py-6 items-center justify-center">
                      <Ionicons name="chatbubbles-outline" size={28} color={theme.textMuted} style={{ marginBottom: 6 }} />
                      <Text style={{ color: theme.textMuted }} className="text-xs font-semibold text-center">
                        Live ball-by-ball commentary will start when match is in progress.
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* 2. FULL SCORECARD TAB */}
            {activeTab === 'scorecard' && (
              <View className="space-y-3 pb-8">
                {(!currentInning || !scorecardData?.innings || scorecardData.innings.length === 0) ? (
                  <View
                    style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
                    className="p-6 rounded-2xl border items-center justify-center my-2 shadow-xs"
                  >
                    <Ionicons name="document-text-outline" size={38} color={theme.textMuted} style={{ marginBottom: 10 }} />
                    <Text style={{ color: theme.text }} className="text-sm font-extrabold text-center mb-1">
                      Match Scheduled / Scorecard Not Available
                    </Text>
                    <Text style={{ color: theme.textMuted }} className="text-xs text-center leading-relaxed">
                      Detailed live scorecard will update automatically when the match starts.
                    </Text>
                  </View>
                ) : (
                  <>
                    {/* Innings selector tabs */}
                    {scorecardData?.innings && scorecardData.innings.length > 1 && (
                      <View className="flex-row bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-xl mb-1">
                        {scorecardData.innings.map((inn) => (
                          <TouchableOpacity
                            key={inn.inningNumber}
                            onPress={() => setSelectedInningTab(inn.inningNumber)}
                            style={{
                              backgroundColor: selectedInningTab === inn.inningNumber ? theme.accent : 'transparent',
                            }}
                            className="flex-1 py-1.5 rounded-lg items-center"
                          >
                            <Text
                              style={{
                                color: selectedInningTab === inn.inningNumber ? '#FFFFFF' : theme.textSecondary,
                                fontWeight: selectedInningTab === inn.inningNumber ? 'bold' : 'normal',
                              }}
                              className="text-xs"
                            >
                              {inn.teamShort} ({inn.runs}/{inn.wickets})
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {/* Batting Card */}
                    <View
                      style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
                      className="p-3.5 rounded-2xl border shadow-sm"
                    >
                      <View className="flex-row justify-between pb-2 border-b" style={{ borderColor: theme.divider }}>
                        <Text style={{ color: theme.accent }} className="font-extrabold text-xs uppercase">
                          Batting - {currentInning?.teamName}
                        </Text>
                        <Text style={{ color: theme.textMuted }} className="text-[11px] font-semibold">
                          R (B) • 4s • 6s • SR
                        </Text>
                      </View>

                      {currentInning?.batting?.map((b, idx) => (
                        <View
                          key={idx}
                          className="py-2 border-b flex-row justify-between items-center"
                          style={{ borderColor: theme.cardBorderSubtle }}
                        >
                          <View className="flex-1 mr-2">
                            <Text style={{ color: theme.text }} className="font-bold text-xs">
                              {b.name}
                            </Text>
                            <Text style={{ color: theme.textMuted }} className="text-[10px] mt-0.5">
                              {b.status}
                            </Text>
                          </View>
                          <View className="flex-row items-center space-x-2">
                            <Text style={{ color: theme.text }} className="font-black text-xs w-10 text-right">
                              {b.runs} <Text style={{ color: theme.textMuted }} className="font-normal text-[10px]">({b.balls})</Text>
                            </Text>
                            <Text style={{ color: theme.textSecondary }} className="text-xs w-6 text-center">{b.fours}</Text>
                            <Text style={{ color: theme.textSecondary }} className="text-xs w-6 text-center">{b.sixes}</Text>
                            <Text style={{ color: theme.accent }} className="text-xs font-bold w-10 text-right">{b.sr}</Text>
                          </View>
                        </View>
                      ))}

                      {/* Extras and Total */}
                      <View className="pt-2.5 pb-1 flex-row justify-between items-center border-t" style={{ borderColor: theme.divider }}>
                        <Text style={{ color: theme.textSecondary }} className="text-xs font-medium">Extras</Text>
                        <Text style={{ color: theme.text }} className="text-xs font-bold">
                          {currentInning?.extras?.total || 0}
                        </Text>
                      </View>
                      <View className="pt-2 flex-row justify-between items-center border-t" style={{ borderColor: theme.divider }}>
                        <Text style={{ color: theme.text }} className="text-sm font-extrabold">Total Score</Text>
                        <Text style={{ color: theme.accent }} className="text-base font-black">
                          {currentInning?.runs}/{currentInning?.wickets} <Text style={{ color: theme.textMuted }} className="text-xs font-normal">({currentInning?.overs} ov)</Text>
                        </Text>
                      </View>
                    </View>

                    {/* Bowling Card */}
                    <View
                      style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
                      className="p-3.5 rounded-2xl border shadow-sm"
                    >
                      <View className="flex-row justify-between pb-2 border-b" style={{ borderColor: theme.divider }}>
                        <Text style={{ color: theme.accent }} className="font-extrabold text-xs uppercase">
                          Bowling
                        </Text>
                        <Text style={{ color: theme.textMuted }} className="text-[11px] font-semibold">
                          O • M • R • W • ECO
                        </Text>
                      </View>

                      {currentInning?.bowling?.map((bw, idx) => (
                        <View
                          key={idx}
                          className="py-2 border-b flex-row justify-between items-center"
                          style={{ borderColor: theme.cardBorderSubtle }}
                        >
                          <Text style={{ color: theme.text }} className="font-bold text-xs flex-1">
                            {bw.name}
                          </Text>
                          <View className="flex-row items-center space-x-2">
                            <Text style={{ color: theme.textSecondary }} className="text-xs w-7 text-center">{bw.overs}</Text>
                            <Text style={{ color: theme.textSecondary }} className="text-xs w-5 text-center">{bw.maidens}</Text>
                            <Text style={{ color: theme.textSecondary }} className="text-xs w-7 text-center">{bw.runs}</Text>
                            <Text style={{ color: theme.accent }} className="text-xs font-extrabold w-6 text-center">{bw.wickets}</Text>
                            <Text style={{ color: theme.text }} className="text-xs font-mono w-10 text-right">{bw.economy}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>
            )}

            {/* 3. TEAMS & PLAYING XI / SQUADS TAB (REAL BIGBALLSDATA API DATA) */}
            {activeTab === 'teams' && (
              <View className="space-y-4 pb-8">
                {/* Team Selector Pills */}
                <View className="flex-row bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-xl">
                  <TouchableOpacity
                    onPress={() => setSelectedTeamTab('team1')}
                    style={{
                      backgroundColor: selectedTeamTab === 'team1' ? theme.accent : 'transparent',
                    }}
                    className="flex-1 py-2 rounded-lg items-center flex-row justify-center"
                  >
                    <TeamFlag
                      logo={fixture.team1?.logo}
                      teamName={fixture.team1?.name}
                      countryCode={fixture.team1?.shortName}
                      size={20}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        color: selectedTeamTab === 'team1' ? '#FFFFFF' : theme.text,
                        fontWeight: selectedTeamTab === 'team1' ? 'bold' : '600',
                      }}
                      className="text-xs"
                      numberOfLines={1}
                    >
                      {fixture.team1?.name}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSelectedTeamTab('team2')}
                    style={{
                      backgroundColor: selectedTeamTab === 'team2' ? theme.accent : 'transparent',
                    }}
                    className="flex-1 py-2 rounded-lg items-center flex-row justify-center"
                  >
                    <TeamFlag
                      logo={fixture.team2?.logo}
                      teamName={fixture.team2?.name}
                      countryCode={fixture.team2?.shortName}
                      size={20}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        color: selectedTeamTab === 'team2' ? '#FFFFFF' : theme.text,
                        fontWeight: selectedTeamTab === 'team2' ? 'bold' : '600',
                      }}
                      className="text-xs"
                      numberOfLines={1}
                    >
                      {fixture.team2?.name}
                    </Text>
                  </TouchableOpacity>
                </View>

                {loadingTeam ? (
                  <View className="py-12 items-center justify-center">
                    <ActivityIndicator size="small" color={theme.accent} />
                    <Text style={{ color: theme.textMuted }} className="text-xs font-semibold mt-2">
                      Loading Team & Playing XI...
                    </Text>
                  </View>
                ) : (
                  <>
                    {/* Team Overview Card */}
                    <View
                      style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
                      className="p-4 rounded-2xl border shadow-sm"
                    >
                      <View className="flex-row items-center justify-between pb-3 border-b" style={{ borderColor: theme.divider }}>
                        <View className="flex-row items-center flex-1 mr-2">
                          <TeamFlag
                            logo={teamDetail?.logo_url || activeTeamObj?.logo}
                            teamName={activeTeamObj?.name}
                            countryCode={teamDetail?.short_name || activeTeamObj?.shortName}
                            size={38}
                            style={{ marginRight: 10 }}
                          />
                          <View className="flex-1">
                            <Text style={{ color: theme.text }} className="font-black text-base" numberOfLines={1}>
                              {teamDetail?.name || activeTeamObj?.name}
                            </Text>
                            <Text style={{ color: theme.textMuted }} className="text-xs">
                              {teamDetail?.league || 'International Cricket'} • {teamDetail?.short_name || activeTeamObj?.shortName}
                            </Text>
                          </View>
                        </View>

                        <View className="px-2.5 py-1 bg-emerald-500/20 rounded-full">
                          <Text className="text-emerald-500 font-black text-[10px] uppercase">
                            OFFICIAL TEAM
                          </Text>
                        </View>
                      </View>

                      {/* Real API Team Statistics */}
                      {teamDetail?.stats && (
                        <View className="pt-3 grid grid-cols-2 gap-2">
                          <View className="flex-row justify-between py-1 border-b" style={{ borderColor: theme.cardBorderSubtle }}>
                            <Text style={{ color: theme.textMuted }} className="text-xs">Matches Played</Text>
                            <Text style={{ color: theme.text }} className="text-xs font-bold">{teamDetail.stats.matches_played || 0}</Text>
                          </View>
                          <View className="flex-row justify-between py-1 border-b" style={{ borderColor: theme.cardBorderSubtle }}>
                            <Text style={{ color: theme.textMuted }} className="text-xs">Wins / Losses</Text>
                            <Text style={{ color: theme.accent }} className="text-xs font-bold">
                              {teamDetail.stats.wins || 0}W / {teamDetail.stats.losses || 0}L
                            </Text>
                          </View>
                          {teamDetail.stats.avg_goals_scored && (
                            <View className="flex-row justify-between py-1 border-b" style={{ borderColor: theme.cardBorderSubtle }}>
                              <Text style={{ color: theme.textMuted }} className="text-xs">Avg Team Score</Text>
                              <Text style={{ color: theme.text }} className="text-xs font-extrabold">{teamDetail.stats.avg_goals_scored}</Text>
                            </View>
                          )}
                          {teamDetail.stats.form_string && (
                            <View className="flex-row justify-between items-center py-1">
                              <Text style={{ color: theme.textMuted }} className="text-xs">Recent Form</Text>
                              <View className="flex-row space-x-1">
                                {teamDetail.stats.form_string.split('').map((char, fIdx) => (
                                  <View
                                    key={fIdx}
                                    className={`w-5 h-5 rounded-full items-center justify-center mr-0.5 ${
                                      char === 'W' ? 'bg-emerald-500' : char === 'L' ? 'bg-red-500' : 'bg-amber-500'
                                    }`}
                                  >
                                    <Text className="text-white text-[9px] font-black">{char}</Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                    {/* Team Form History (Real Matches from BigBallsData API) */}
                    {teamForm && teamForm.length > 0 && (
                      <View
                        style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
                        className="p-4 rounded-2xl border shadow-sm"
                      >
                        <Text style={{ color: theme.accent }} className="font-extrabold text-xs uppercase mb-3 tracking-wide">
                          Recent Match Results (Real API History)
                        </Text>
                        {teamForm.slice(0, 5).map((fm, idx) => (
                          <View
                            key={idx}
                            className="py-2 border-b flex-row justify-between items-center"
                            style={{ borderColor: theme.cardBorderSubtle }}
                          >
                            <View className="flex-1 mr-2">
                              <Text style={{ color: theme.text }} className="font-bold text-xs" numberOfLines={1}>
                                {fm.home} vs {fm.away}
                              </Text>
                              <Text style={{ color: theme.textMuted }} className="text-[10px]">
                                {fm.competition || 'International Tour'}
                              </Text>
                            </View>
                            <View className="items-end">
                              <Text style={{ color: theme.text }} className="font-mono text-xs font-bold">
                                {fm.home_score} - {fm.away_score}
                              </Text>
                              <View
                                className={`px-1.5 py-0.2 rounded mt-0.5 ${
                                  fm.result === 'W' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                                }`}
                              >
                                <Text
                                  className={`text-[9px] font-black ${
                                    fm.result === 'W' ? 'text-emerald-500' : 'text-red-500'
                                  }`}
                                >
                                  {fm.result === 'W' ? 'WON' : 'LOST'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </>
                )}
              </View>
            )}

            {/* 4. MATCH INFO TAB */}
            {activeTab === 'info' && (
              <View className="space-y-3 pb-8">
                <View
                  style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
                  className="p-3.5 rounded-2xl border shadow-sm"
                >
                  <Text style={{ color: theme.accent }} className="font-extrabold text-xs uppercase mb-3">
                    Match Details
                  </Text>

                  {[
                    { label: 'Series', val: scorecardData?.matchInfo?.series || fixture.series || 'N/A' },
                    { label: 'Match', val: scorecardData?.matchInfo?.match || fixture.title || 'N/A' },
                    { label: 'Date', val: scorecardData?.matchInfo?.date || fixture.statusNote || fixture.matchDate || 'N/A' },
                    { label: 'Venue', val: scorecardData?.matchInfo?.venue || fixture.venue || 'N/A' },
                    { label: 'Match ID', val: fixture.id || fixture.fixtureId },
                  ].map((item, idx) => (
                    <View
                      key={idx}
                      className="py-2 border-b flex-row justify-between items-center"
                      style={{ borderColor: theme.cardBorderSubtle }}
                    >
                      <Text style={{ color: theme.textMuted }} className="text-xs font-medium w-28">
                        {item.label}
                      </Text>
                      <Text style={{ color: theme.text }} className="text-xs font-bold flex-1 text-right">
                        {item.val}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}
