import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function LoginModal({ visible, onClose }) {
  const { theme } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!visible) return null;

  const handleLogin = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      Alert.alert('Welcome', 'You are logged in to Cricbuzz!');
      onClose();
    }, 800);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-center items-center px-4">
        <View
          style={{ backgroundColor: theme.card }}
          className="w-full max-w-sm rounded-3xl p-6 shadow-2xl"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-emerald-500/20 items-center justify-center mr-2">
                <Ionicons name="baseball" size={18} color="#009270" />
              </View>
              <Text style={{ color: theme.text }} className="font-black text-lg">
                Log In to <Text className="text-emerald-600">cricbuzz</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={{ color: theme.textSecondary }} className="text-xs mb-4 leading-relaxed">
            Get personalized match notifications, ball-by-ball commentary, and exclusive video highlights.
          </Text>

          {/* Mobile input */}
          <View className="mb-4">
            <Text style={{ color: theme.textMuted }} className="text-[11px] font-bold uppercase mb-1.5">
              Mobile Number
            </Text>
            <View
              style={{
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
              }}
              className="flex-row items-center px-3.5 py-2.5 rounded-xl border"
            >
              <Text style={{ color: theme.text }} className="font-bold mr-2 text-sm">
                +91
              </Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter 10-digit mobile number"
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
                maxLength={10}
                style={{ color: theme.text }}
                className="flex-1 text-sm font-semibold"
              />
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isSubmitted}
            style={{ backgroundColor: theme.accent }}
            className="py-3.5 rounded-xl items-center shadow-md mb-3"
            activeOpacity={0.8}
          >
            <Text className="text-white font-extrabold text-sm">
              {isSubmitted ? 'SENDING OTP...' : 'CONTINUE'}
            </Text>
          </TouchableOpacity>

          <Text style={{ color: theme.textMuted }} className="text-[10px] text-center">
            By continuing, you agree to Cricbuzz Terms of Use and Privacy Policy.
          </Text>
        </View>
      </View>
    </Modal>
  );
}
