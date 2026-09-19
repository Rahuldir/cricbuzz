import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Local high-resolution transparent PNG logos for 100% offline & clean rendering
const LOCAL_TEAM_LOGOS = {
  CSK: require('../../assets/team_logos/CSK.png'),
  GT: require('../../assets/team_logos/GT.png'),
  RCB: require('../../assets/team_logos/RCB.png'),
  MI: require('../../assets/team_logos/MI.png'),
  DC: require('../../assets/team_logos/DC.png'),
  KKR: require('../../assets/team_logos/KKR.png'),
  LSG: require('../../assets/team_logos/LSG.png'),
  SRH: require('../../assets/team_logos/SRH.png'),
  RR: require('../../assets/team_logos/RR.png'),
  PBKS: require('../../assets/team_logos/PBKS.png'),
};

const IPL_TEAMS_LIST = [
  { code: 'MI', name: 'Mumbai Indians', logo: LOCAL_TEAM_LOGOS.MI },
  { code: 'CSK', name: 'Chennai Super Kings', logo: LOCAL_TEAM_LOGOS.CSK },
  { code: 'DC', name: 'Delhi Capitals', logo: LOCAL_TEAM_LOGOS.DC },
  { code: 'GT', name: 'Gujarat Titans', logo: LOCAL_TEAM_LOGOS.GT },
  { code: 'KKR', name: 'Kolkata Knight Riders', logo: LOCAL_TEAM_LOGOS.KKR },
  { code: 'LSG', name: 'Lucknow Super Giants', logo: LOCAL_TEAM_LOGOS.LSG },
  { code: 'RCB', name: 'Royal Challengers Bengaluru', logo: LOCAL_TEAM_LOGOS.RCB },
  { code: 'RR', name: 'Rajasthan Royals', logo: LOCAL_TEAM_LOGOS.RR },
  { code: 'SRH', name: 'Sunrisers Hyderabad', logo: LOCAL_TEAM_LOGOS.SRH },
  { code: 'PBKS', name: 'Punjab Kings', logo: LOCAL_TEAM_LOGOS.PBKS },
];

export default function WelcomeQuizModal({ visible, onClose, initialStep = 'quiz' }) {
  const [questionIndex, setQuestionIndex] = useState(1);
  const [selectedOption, setSelectedOption] = useState('A');
  const [selectedTeam, setSelectedTeam] = useState('MI');

  if (!visible) return null;

  const quizQuestions = [
    {
      id: 1,
      type: 'options',
      question: 'What do you most like in Cricket..?',
      options: [
        { id: 'A', text: 'Batting' },
        { id: 'B', text: 'Bowling' },
        { id: 'C', text: 'Fielding' },
        { id: 'D', text: 'Keeping' },
      ],
    },
    {
      id: 2,
      type: 'options',
      question: 'Select your favourite player..?',
      options: [
        { id: 'A', text: 'Virat Kohli' },
        { id: 'B', text: 'MS Dhoni' },
        { id: 'C', text: 'Faf Du Plessis' },
        { id: 'D', text: 'Travis Head' },
      ],
    },
    {
      id: 3,
      type: 'teams',
      question: 'Which is your favorite IPL Team?',
      teams: IPL_TEAMS_LIST,
    },
  ];

  const currentQuiz = quizQuestions[questionIndex - 1] || quizQuestions[0];

  const handleNextQuiz = () => {
    if (questionIndex < quizQuestions.length) {
      setQuestionIndex(questionIndex + 1);
      if (questionIndex + 1 === 3) {
        setSelectedTeam('MI');
      } else {
        setSelectedOption('A');
      }
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (questionIndex > 1) {
      setQuestionIndex(questionIndex - 1);
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Top Header Bar matching exact screenshot */}
        <View style={styles.topHeaderBar}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#000000" />
          </TouchableOpacity>

          {/* Top Right Circular AD Badge */}
          <View style={styles.topRightAdBadge}>
            <View style={styles.adBadgeBlueCircle}>
              <View style={styles.adRedBall} />
              <View style={styles.adSmallPill}>
                <Text style={styles.adSmallPillText}>AD</Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
          {/* Top Ad Banner Card */}
          <View style={styles.adBannerCard}>
            <View style={styles.adIconBox}>
              <View style={styles.adCricketBallCircle}>
                <Ionicons name="trophy" size={22} color="#D97706" />
                <View style={styles.adTagPill}>
                  <Text style={styles.adTagText}>AD</Text>
                </View>
              </View>
            </View>

            <View style={styles.adTextBox}>
              <Text style={styles.adTitle} numberOfLines={1}>IPL News</Text>
              <Text style={styles.adSubtitle} numberOfLines={1}>Stay updated with the latest IPL news and</Text>
            </View>

            <TouchableOpacity style={styles.installButton} activeOpacity={0.85}>
              <Text style={styles.installButtonText}>Install</Text>
            </TouchableOpacity>
          </View>

          {/* Question Title Header: Quetion 1 / Quetion 2 / Quetion 3 */}
          <View style={styles.quetionHeaderBox}>
            <Text style={styles.quetionHeaderText}>
              Quetion {questionIndex}
            </Text>
            <View style={styles.quetionHeaderUnderline} />
          </View>

          {/* Question Box Card (Light Purple Tinted Box) */}
          <View style={styles.questionCardBox}>
            <Text style={styles.questionText}>
              {currentQuiz.question}
            </Text>
          </View>

          {/* TYPE 1 & 2: Multiple Choice Options A, B, C, D */}
          {currentQuiz.type === 'options' && (
            <View style={styles.optionsContainer}>
              {currentQuiz.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setSelectedOption(opt.id)}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      ({opt.id})   {opt.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* TYPE 3: IPL Teams Grid with Local Transparent PNG Logos (CSK, GT, RCB, MI at top) */}
          {currentQuiz.type === 'teams' && (
            <View style={styles.teamsGridContainer}>
              {currentQuiz.teams.map((team) => {
                const isSelected = selectedTeam === team.code;
                return (
                  <TouchableOpacity
                    key={team.code}
                    onPress={() => setSelectedTeam(team.code)}
                    style={[
                      styles.teamGridCard,
                      isSelected && styles.teamGridCardSelected,
                    ]}
                    activeOpacity={0.85}
                  >
                    <View style={styles.teamLogoWrapper}>
                      <Image
                        source={team.logo}
                        style={styles.teamLogoImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={[styles.teamCodeText, isSelected && styles.teamCodeTextSelected]}>
                      {team.code}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Next Button (Matching Green Image 1, 4 & 5) */}
          <View style={styles.nextButtonContainer}>
            <TouchableOpacity
              onPress={handleNextQuiz}
              style={styles.nextButton}
              activeOpacity={0.85}
            >
              <View style={{ width: 32 }} />
              <Text style={styles.nextButtonText}>Next</Text>
              <View style={styles.nextIconCircle}>
                <Ionicons name="chevron-forward-sharp" size={16} color="#007A3B" style={{ marginLeft: -1 }} />
                <Ionicons name="chevron-forward-sharp" size={16} color="#007A3B" style={{ marginLeft: -8 }} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Ad Banner */}
        <View style={styles.bottomAdBanner}>
          <View style={styles.adIconBox}>
            <View style={styles.adBallRedCircle}>
              <Ionicons name="baseball" size={20} color="#DC2626" />
              <View style={styles.adTagPillGreen}>
                <Text style={styles.adTagText}>AD</Text>
              </View>
            </View>
          </View>

          <View style={styles.adTextBox}>
            <Text style={styles.adTitle} numberOfLines={1}>IPL News</Text>
            <Text style={styles.adSubtitle} numberOfLines={1}>Stay updated with the latest IPL news and</Text>
          </View>

          <TouchableOpacity style={styles.installButton} activeOpacity={0.85}>
            <Text style={styles.installButtonText}>Install</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeaderBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  topRightAdBadge: {
    padding: 4,
  },
  adBadgeBlueCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  adRedBall: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
  },
  adSmallPill: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#38BDF8',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 6,
  },
  adSmallPillText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollInner: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  adBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  adIconBox: {
    marginRight: 10,
  },
  adCricketBallCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  adTagPill: {
    position: 'absolute',
    top: -3,
    left: -3,
    backgroundColor: '#16A34A',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
  },
  adTagText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  adTextBox: {
    flex: 1,
    marginRight: 8,
  },
  adTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  adSubtitle: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  installButton: {
    backgroundColor: '#008000',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },
  installButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  quetionHeaderBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  quetionHeaderText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
  },
  quetionHeaderUnderline: {
    width: 110,
    height: 2.5,
    backgroundColor: '#000000',
    marginTop: 2,
  },
  questionCardBox: {
    backgroundColor: '#EDEBF5',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  optionItemSelected: {
    borderColor: '#008000',
    backgroundColor: '#E6F4EA',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  optionTextSelected: {
    color: '#008000',
  },

  /* Quetion 3: Teams Grid Styles */
  teamsGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  teamGridCard: {
    width: '48%',
    height: 115,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    padding: 8,
  },
  teamGridCardSelected: {
    borderColor: '#008000',
    backgroundColor: '#E6F4EA',
  },
  teamLogoWrapper: {
    width: 80,
    height: 56,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  teamLogoImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  teamCodeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
  teamCodeTextSelected: {
    color: '#008000',
  },

  nextButtonContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  nextButton: {
    width: width * 0.65,
    height: 48,
    backgroundColor: '#007A3B',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  nextIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomAdBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  adBallRedCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  adTagPillGreen: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#16A34A',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
  },
});
