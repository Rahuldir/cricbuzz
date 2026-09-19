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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function WelcomeQuizModal({ visible, onClose, initialStep = 'quiz' }) {
  const [questionIndex, setQuestionIndex] = useState(1);
  const [selectedOption, setSelectedOption] = useState('A');

  if (!visible) return null;

  const quizQuestions = [
    {
      id: 1,
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
      question: 'Select your favourite player..?',
      options: [
        { id: 'A', text: 'Virat Kohli' },
        { id: 'B', text: 'MS Dhoni' },
        { id: 'C', text: 'Faf Du Plessis' },
        { id: 'D', text: 'Travis Head' },
      ],
    },
  ];

  const currentQuiz = quizQuestions[questionIndex - 1] || quizQuestions[0];

  const handleNextQuiz = () => {
    if (questionIndex < quizQuestions.length) {
      setQuestionIndex(questionIndex + 1);
      setSelectedOption('A');
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (questionIndex > 1) {
      setQuestionIndex(questionIndex - 1);
      setSelectedOption('A');
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor="#007A3B" />

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
                <Ionicons name="baseball" size={22} color="#DC2626" />
                <View style={styles.adTagPill}>
                  <Text style={styles.adTagText}>AD</Text>
                </View>
              </View>
            </View>

            <View style={styles.adTextBox}>
              <Text style={styles.adTitle} numberOfLines={1}>IPL Live Matches</Text>
              <Text style={styles.adSubtitle} numberOfLines={1}>Watch live Cricket matches on your phone. Don't</Text>
            </View>

            <TouchableOpacity style={styles.installButton} activeOpacity={0.85}>
              <Text style={styles.installButtonText}>Install</Text>
            </TouchableOpacity>
          </View>

          {/* Question Title Header: Quetion 1 / Quetion 2 */}
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

          {/* Multiple Choice Options (A, B, C, D) */}
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

          {/* Next Button (Matching Green Image 1 & 4) */}
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
            <View style={styles.adTrophyCircle}>
              <Ionicons name="trophy" size={20} color="#D97706" />
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
    paddingBottom: 20,
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
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
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
    paddingVertical: 26,
    paddingHorizontal: 20,
    marginBottom: 22,
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
  adTrophyCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
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
