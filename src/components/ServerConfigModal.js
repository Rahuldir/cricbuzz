import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getServerUrl, setServerUrl, testServerConnection, isDemoMode, setDemoMode } from '../services/cricketApi';

export default function ServerConfigModal({ visible, onClose, onServerUpdated }) {
  const { theme, isDarkMode } = useTheme();
  const [urlInput, setUrlInput] = useState(getServerUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, msg: string }
  const [demoState, setDemoState] = useState(isDemoMode());

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await testServerConnection(urlInput);
    setTesting(false);
    if (result.success) {
      setTestResult({ success: true, msg: `Connected successfully! (HTTP ${result.status})` });
    } else {
      setTestResult({
        success: false,
        msg: `Connection failed: ${result.error || 'Check if server is running on ' + urlInput}`,
      });
    }
  };

  const handleSave = () => {
    setServerUrl(urlInput);
    setDemoMode(demoState);
    if (onServerUpdated) onServerUpdated();
    onClose();
  };

  const setPreset = (presetUrl) => {
    setUrlInput(presetUrl);
    setTestResult(null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/70 justify-center items-center px-4">
        <View
          style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
          className="w-full max-w-md rounded-2xl border p-5 shadow-2xl"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center pb-3 border-b" style={{ borderColor: theme.divider }}>
            <View className="flex-row items-center space-x-2">
              <View className="w-8 h-8 rounded-full bg-emerald-500/20 items-center justify-center mr-2">
                <Ionicons name="server" size={18} color={theme.accent} />
              </View>
              <Text style={{ color: theme.text }} className="font-black text-base">
                API Server Settings
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={{ color: theme.textSecondary }} className="text-xs mt-3 leading-4">
            Connect your local Postman/Express backend (<Text className="font-mono text-emerald-500">http://localhost:3000</Text>) or customize the URL. If the server is offline, high-quality Cricbuzz fallback data is automatically used.
          </Text>

          {/* Quick Presets */}
          <Text style={{ color: theme.textMuted }} className="text-[11px] font-bold uppercase mt-4 mb-2">
            Quick Presets
          </Text>
          <View className="flex-row flex-wrap gap-1.5 mb-3">
            {[
              { label: 'Localhost (3000)', url: 'http://localhost:3000' },
              { label: 'Android Emulator', url: 'http://10.0.2.2:3000' },
              { label: 'Local IP (Port 3000)', url: 'http://192.168.1.100:3000' },
            ].map((p, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setPreset(p.url)}
                style={{
                  backgroundColor: urlInput === p.url ? theme.accent + '25' : theme.inputBg,
                  borderColor: urlInput === p.url ? theme.accent : theme.cardBorder,
                }}
                className="px-2.5 py-1.5 rounded-lg border mr-1.5 mb-1.5"
              >
                <Text
                  style={{ color: urlInput === p.url ? theme.accent : theme.textSecondary }}
                  className="text-xs font-semibold"
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Server URL Input */}
          <Text style={{ color: theme.textMuted }} className="text-[11px] font-bold uppercase mb-1">
            Server Endpoint URL
          </Text>
          <View
            style={{ backgroundColor: theme.inputBg, borderColor: theme.inputBorder }}
            className="flex-row items-center border rounded-xl px-3 py-2"
          >
            <Ionicons name="link-outline" size={18} color={theme.textMuted} style={{ marginRight: 6 }} />
            <TextInput
              value={urlInput}
              onChangeText={(t) => {
                setUrlInput(t);
                setTestResult(null);
              }}
              placeholder="http://localhost:3000"
              placeholderTextColor={theme.textMuted}
              style={{ color: theme.text }}
              className="flex-1 text-sm font-mono py-0"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Test connection button */}
          <View className="flex-row items-center justify-between mt-3">
            <TouchableOpacity
              onPress={handleTest}
              disabled={testing}
              style={{ backgroundColor: theme.inputBg, borderColor: theme.inputBorder }}
              className="flex-row items-center px-3 py-2 rounded-lg border"
            >
              {testing ? (
                <ActivityIndicator size="small" color={theme.accent} style={{ marginRight: 6 }} />
              ) : (
                <Ionicons name="pulse" size={16} color={theme.accent} style={{ marginRight: 6 }} />
              )}
              <Text style={{ color: theme.text }} className="text-xs font-bold">
                {testing ? 'Pinging...' : 'Test Connection'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDemoState(!demoState)}
              className="flex-row items-center"
            >
              <Ionicons
                name={demoState ? 'checkbox' : 'square-outline'}
                size={18}
                color={demoState ? theme.accent : theme.textMuted}
                style={{ marginRight: 4 }}
              />
              <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold">
                Force Demo Mock
              </Text>
            </TouchableOpacity>
          </View>

          {/* Test Result Message */}
          {testResult && (
            <View
              className="mt-3 p-2.5 rounded-xl border flex-row items-center"
              style={{
                backgroundColor: testResult.success ? '#065F4625' : '#991B1B25',
                borderColor: testResult.success ? '#10B981' : '#EF4444',
              }}
            >
              <Ionicons
                name={testResult.success ? 'checkmark-circle' : 'alert-circle'}
                size={18}
                color={testResult.success ? '#10B981' : '#EF4444'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{ color: testResult.success ? '#10B981' : '#EF4444' }}
                className="text-xs font-medium flex-1"
              >
                {testResult.msg}
              </Text>
            </View>
          )}

          {/* Action buttons */}
          <View className="flex-row space-x-3 mt-5 pt-3 border-t" style={{ borderColor: theme.divider }}>
            <TouchableOpacity
              onPress={onClose}
              style={{ backgroundColor: theme.inputBg, borderColor: theme.cardBorder }}
              className="flex-1 py-2.5 rounded-xl items-center border mr-2"
            >
              <Text style={{ color: theme.textSecondary }} className="text-xs font-bold">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={{ backgroundColor: theme.accent }}
              className="flex-1 py-2.5 rounded-xl items-center shadow-md ml-2"
            >
              <Text className="text-white text-xs font-extrabold tracking-wide">
                Save & Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
