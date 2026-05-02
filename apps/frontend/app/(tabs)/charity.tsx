import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/api/client';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useZakat } from '@/hooks/useZakat';
import { ZakatAssetType } from '@tariq/shared';

const { width } = Dimensions.get('window');

export default function CharityScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calculator' | 'donations' | 'ai'>('dashboard');
  const { summary, loading, addAsset, logSadaqah, fetchSummary } = useZakat();
  const { user } = useAuthStore();

  // Calculator State
  const [assetType, setAssetType] = useState<ZakatAssetType>(ZakatAssetType.CASH);
  const [assetName, setAssetName] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [addingAsset, setAddingAsset] = useState(false);

  // Donation State
  const [donationAmount, setDonationAmount] = useState('');
  const [donationCategory, setDonationCategory] = useState('Sadaqah');
  const [isZakat, setIsZakat] = useState(false);
  const [loggingDonation, setLoggingDonation] = useState(false);

  // AI State
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleAddAsset = async () => {
    if (!assetValue || isNaN(Number(assetValue))) return;
    setAddingAsset(true);
    await addAsset({
      type: assetType,
      name: assetName || assetType,
      value: Number(assetValue),
      currency: 'USD',
    });
    setAddingAsset(false);
    setAssetName('');
    setAssetValue('');
    Alert.alert('Success', 'Asset added successfully');
  };

  const handleLogDonation = async () => {
    if (!donationAmount || isNaN(Number(donationAmount))) return;
    setLoggingDonation(true);
    await logSadaqah({
      amount: Number(donationAmount),
      currency: 'USD',
      category: donationCategory,
      date: new Date().toISOString().split('T')[0],
      isZakat,
    });
    setLoggingDonation(false);
    setDonationAmount('');
    Alert.alert('Success', 'Donation logged successfully');
  };

  const handleSendAi = async () => {
    if (!query.trim() || aiLoading) return;

    const userMessage = { id: Date.now().toString(), text: query, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setAiLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: aiMessageId, text: '', sender: 'ai' }]);

    try {
      await apiClient.streamZakatAsk(query, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      });
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, text: msg.text + '\n[Error]' } : msg
        )
      );
    } finally {
      setAiLoading(false);
    }
  };

  const renderDashboard = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Zakat Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Assets</Text>
          <Text style={styles.summaryValue}>${summary?.totalAssets?.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Zakat Due</Text>
          <Text style={[styles.summaryValue, { color: '#4CAF50', fontSize: 24 }]}>
            ${summary?.zakatDue?.toFixed(2) || '0.00'}
          </Text>
        </View>
        <View style={[styles.nisabBadge, { backgroundColor: summary?.isNisabReached ? '#4CAF50' : '#f44336' }]}>
          <Text style={styles.nisabText}>
            {summary?.isNisabReached ? 'Nisab Reached' : 'Nisab Not Reached'}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Hawl Cycle</Text>
        <View style={styles.progressContainer}>
           <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${Math.min(100, (354 - (summary?.hawlDaysRemaining || 0)) / 354 * 100)}%` }
                ]} 
              />
           </View>
           <Text style={styles.progressText}>
              {summary?.hawlDaysRemaining || 0} days remaining in cycle
           </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Charity Impact</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Sadaqah (Year)</Text>
          <Text style={styles.summaryValue}>${summary?.totalSadaqahYear?.toFixed(2) || '0.00'}</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderCalculator = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add Zakat Asset</Text>
        
        <Text style={styles.label}>Asset Type</Text>
        <View style={styles.typeContainer}>
          {Object.values(ZakatAssetType).map((type) => (
            <TouchableOpacity 
              key={type}
              style={[styles.typeButton, assetType === type && styles.typeButtonActive]}
              onPress={() => setAssetType(type)}
            >
              <Text style={[styles.typeButtonText, assetType === type && styles.typeButtonTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Asset Name</Text>
        <TextInput 
          style={styles.input}
          value={assetName}
          onChangeText={setAssetName}
          placeholder="e.g. Bank Account, Gold Ring"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Value (USD)</Text>
        <TextInput 
          style={styles.input}
          value={assetValue}
          onChangeText={setAssetValue}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor="#666"
        />

        <TouchableOpacity 
          style={styles.button}
          onPress={handleAddAsset}
          disabled={addingAsset}
        >
          {addingAsset ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add Asset</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderDonations = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Log Donation</Text>
        
        <Text style={styles.label}>Amount (USD)</Text>
        <TextInput 
          style={styles.input}
          value={donationAmount}
          onChangeText={setDonationAmount}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Category</Text>
        <TextInput 
          style={styles.input}
          value={donationCategory}
          onChangeText={setDonationCategory}
          placeholder="e.g. Mosque, Food Bank"
          placeholderTextColor="#666"
        />

        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => setIsZakat(!isZakat)}
          >
            {isZakat && <Ionicons name="checkmark" size={18} color="#4CAF50" />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>This is a Zakat payment</Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogDonation}
          disabled={loggingDonation}
        >
          {loggingDonation ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log Donation</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderAiAssistant = () => (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.aiContainer}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.messageText, item.sender === 'user' ? styles.userText : styles.aiText]}>
              {item.text}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.aiInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Ask about Zakat..."
          placeholderTextColor="#aaa"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendAi} disabled={aiLoading || !query.trim()}>
          {aiLoading ? <ActivityIndicator color="#fff" /> : <Ionicons name="send" size={24} color="#fff" />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Ionicons name="stats-chart" size={20} color={activeTab === 'dashboard' ? '#4CAF50' : '#aaa'} />
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'calculator' && styles.activeTab]}
          onPress={() => setActiveTab('calculator')}
        >
          <Ionicons name="calculator" size={20} color={activeTab === 'calculator' ? '#4CAF50' : '#aaa'} />
          <Text style={[styles.tabText, activeTab === 'calculator' && styles.activeTabText]}>Assets</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'donations' && styles.activeTab]}
          onPress={() => setActiveTab('donations')}
        >
          <Ionicons name="heart" size={20} color={activeTab === 'donations' ? '#4CAF50' : '#aaa'} />
          <Text style={[styles.tabText, activeTab === 'donations' && styles.activeTabText]}>Log</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'ai' && styles.activeTab]}
          onPress={() => setActiveTab('ai')}
        >
          <Ionicons name="chatbubble" size={20} color={activeTab === 'ai' ? '#4CAF50' : '#aaa'} />
          <Text style={[styles.tabText, activeTab === 'ai' && styles.activeTabText]}>AI</Text>
        </TouchableOpacity>
      </View>

      {loading && activeTab !== 'ai' ? (
        <ActivityIndicator style={{ flex: 1 }} color="#4CAF50" />
      ) : (
        <>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'calculator' && renderCalculator()}
          {activeTab === 'donations' && renderDonations()}
          {activeTab === 'ai' && renderAiAssistant()}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#2a2a3e',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  activeTab: {
    backgroundColor: '#3a3a4e',
  },
  tabText: {
    color: '#aaa',
    fontSize: 12,
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#2a2a3e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#aaa',
    fontSize: 16,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nisabBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  nisabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  label: {
    color: '#aaa',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  typeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  typeButtonText: {
    color: '#4CAF50',
    fontSize: 12,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    color: '#eee',
  },
  aiContainer: {
    flex: 1,
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a3e',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userText: {
    color: '#fff',
    textAlign: 'right',
  },
  aiText: {
    color: '#eee',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#2a2a3e',
    alignItems: 'flex-end',
  },
  aiInput: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#fff',
    maxHeight: 100,
    textAlign: 'right',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
