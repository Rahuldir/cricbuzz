import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function WelcomeQuizModal({ visible, onClose }) {
  const { theme } = useTheme();
  const [step, setStep] = useState('welcome'); // 'welcome' | 'quiz' | 'finished'
  const [selectedOption, setSelectedOption] = useState('A');
  const [questionIndex, setQuestionIndex] = useState(1);

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
      question: 'Which is your favorite Cricket format?',
      options: [
        { id: 'A', text: 'T20 International / IPL' },
        { id: 'B', text: 'One Day International (ODI)' },
        { id: 'C', text: 'Test Cricket' },
        { id: 'D', text: 'Domestic T20 Leagues' },
      ],
    },
  ];

  const currentQuiz = quizQuestions[questionIndex - 1] || quizQuestions[0];

  const handleNextQuiz = () => {
    if (questionIndex < quizQuestions.length) {
      setQuestionIndex(questionIndex + 1);
      setSelectedOption('A');
    } else {
      setStep('finished');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={{ backgroundColor: theme.bg }} className="flex-1">
        {/* Top Header Bar */}
        <View className="bg-emerald-700 dark:bg-emerald-900 px-4 pt-12 pb-3.5 flex-row items-center justify-between shadow-md">
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text className="text-white font-extrabold text-base tracking-tight">
            {step === 'welcome' ? 'Live Cricket TV HD' : `Fan Zone • Question ${questionIndex}`}
          </Text>

          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* STEP 1: WELCOME SCREEN (IMAGE 1 EXACT MATCH) */}
        {step === 'welcome' && (
          <ScrollView className="flex-1 px-6 pt-4 pb-8" showsVerticalScrollIndicator={false}>
            {/* Top Ad Banner Simulation */}
            <View className="bg-slate-100 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6 shadow-xs">
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center mr-2">
                  <Ionicons name="baseball" size={18} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-black text-slate-800 dark:text-slate-100">
                    Live Match Stats
                  </Text>
                  <Text className="text-[10px] text-slate-500 dark:text-slate-400">
                    Get real-time stats & commentary for every Cricket match
                  </Text>
                </View>
              </View>

              {/* Banner Graphic */}
              <View className="bg-emerald-800 rounded-xl p-4 items-center justify-center my-2 shadow-sm">
                <Text className="text-white font-black text-xs uppercase tracking-widest mb-1 text-center">
                  LATEST CRICKET UPDATE
                </Text>
                <Text className="text-emerald-200 font-extrabold text-sm text-center mb-2">
                  STAY UPDATED • ALL MATCHES LATEST SCORE
                </Text>
                <View className="bg-red-600 px-3 py-1 rounded-full">
                  <Text className="text-white text-[10px] font-black uppercase">LIVE SCORECARD</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setStep('quiz')}
                className="bg-emerald-700 py-2.5 rounded-xl items-center mt-2 shadow-xs"
              >
                <Text className="text-white font-black text-xs uppercase tracking-wide">
                  View Stats
                </Text>
              </TouchableOpacity>
            </View>

            {/* Cricket Graphic */}
            <View className="items-center justify-center my-4 py-4">
              <View className="w-36 h-36 rounded-full bg-emerald-500/15 items-center justify-center border-4 border-emerald-500/20 shadow-inner">
                <Ionicons name="trophy" size={68} color="#007A3B" />
              </View>
            </View>

            {/* Welcome Titles */}
            <View className="items-center mb-8">
              <Text style={{ color: theme.text }} className="text-2xl font-black text-center">
                Welcome To,
              </Text>
              <Text className="text-3xl font-black text-emerald-600 text-center tracking-tight">
                Live Cricket <Text className="underline text-emerald-700">TV HD</Text>
              </Text>

              <Text style={{ color: theme.textMuted }} className="text-xs text-center leading-relaxed mt-3 px-4 font-medium">
                Highly engaging and entertaining ball-by-ball commentary and real-time live score updates.
              </Text>
            </View>

            {/* Get Started Button */}
            <TouchableOpacity
              onPress={() => setStep('quiz')}
              className="bg-emerald-700 py-3.5 px-6 rounded-2xl flex-row items-center justify-center shadow-md mb-8"
              activeOpacity={0.85}
            >
              <Text className="text-white font-black text-base mr-3 tracking-wide">
                Get Started
              </Text>
              <View className="w-7 h-7 rounded-lg bg-emerald-800 items-center justify-center">
                <Ionicons name="baseball-outline" size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* STEP 2: CRICKET FAN QUIZ (IMAGE 4 EXACT MATCH) */}
        {step === 'quiz' && (
          <ScrollView className="flex-1 px-6 pt-6 pb-8" showsVerticalScrollIndicator={false}>
            {/* Ad Bar */}
            <View className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-2xl flex-row justify-between items-center mb-6">
              <View className="flex-row items-center flex-1 mr-2">
                <Ionicons name="trophy-outline" size={20} color="#007A3B" style={{ marginRight: 8 }} />
                <View className="flex-1">
                  <Text className="text-xs font-black text-slate-800 dark:text-slate-100">IPL Live Matches</Text>
                  <Text className="text-[10px] text-slate-500">Watch live Cricket matches on your phone.</Text>
                </View>
              </View>
              <TouchableOpacity className="bg-emerald-700 px-3 py-1.5 rounded-lg">
                <Text className="text-white text-[11px] font-bold">Install</Text>
              </TouchableOpacity>
            </View>

            {/* Question Header */}
            <Text className="text-center font-black text-lg text-slate-900 dark:text-slate-100 mb-4 underline">
              Question {questionIndex}
            </Text>

            {/* Question Box Card */}
            <View className="bg-slate-100 dark:bg-slate-800 p-6 rounded-3xl mb-6 shadow-xs border border-slate-200 dark:border-slate-700">
              <Text className="text-center font-extrabold text-base text-slate-900 dark:text-slate-100 leading-snug">
                {currentQuiz.question}
              </Text>
            </View>

            {/* Multiple Choice Options A, B, C, D */}
            <View className="space-y-3.5 mb-8">
              {currentQuiz.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setSelectedOption(opt.id)}
                    style={{
                      borderColor: isSelected ? '#007A3B' : theme.cardBorder,
                      backgroundColor: isSelected ? (theme.isDarkMode ? '#064E3B40' : '#E6F4EA') : theme.card,
                    }}
                    className="p-4 rounded-2xl border-2 flex-row items-center shadow-2xs mb-3"
                    activeOpacity={0.8}
                  >
                    <Text
                      style={{ color: isSelected ? '#007A3B' : theme.text }}
                      className="font-black text-sm tracking-wide flex-1"
                    >
                      ({opt.id})   {opt.text}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#007A3B" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Next Button (Matching Green Image 4) */}
            <TouchableOpacity
              onPress={handleNextQuiz}
              className="bg-emerald-700 py-3.5 px-6 rounded-2xl flex-row items-center justify-between shadow-md"
              activeOpacity={0.85}
            >
              <View />
              <Text className="text-white font-black text-base tracking-wider">
                Next
              </Text>
              <Ionicons name="chevron-forward-circle" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* STEP 3: QUIZ COMPLETE / REDIRECT */}
        {step === 'finished' && (
          <View className="flex-1 items-center justify-center p-6 text-center">
            <View className="w-20 h-20 rounded-full bg-emerald-500/20 items-center justify-center mb-4">
              <Ionicons name="checkmark-done-circle" size={48} color="#007A3B" />
            </View>
            <Text style={{ color: theme.text }} className="text-xl font-black text-center mb-2">
              Setup Complete!
            </Text>
            <Text style={{ color: theme.textMuted }} className="text-xs text-center leading-relaxed mb-6">
              Your fan preferences have been saved. Enjoy fast live line scores and telemetry updates!
            </Text>

            <TouchableOpacity
              onPress={onClose}
              className="bg-emerald-700 py-3 px-8 rounded-2xl shadow-md"
            >
              <Text className="text-white font-black text-sm uppercase">
                Go to Live Score
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}
