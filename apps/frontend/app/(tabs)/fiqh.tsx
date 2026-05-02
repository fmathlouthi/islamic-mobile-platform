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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/api/client';
import { useAuthStore } from '@/hooks/useAuthStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function FiqhScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!query.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: query,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      text: '',
      sender: 'ai',
    };

    setMessages((prev) => [...prev, aiMessage]);

    try {
      await apiClient.streamFiqhAsk(query, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      });
    } catch (error) {
      console.error('Error asking fiqh:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, text: msg.text + `\n\n[${t('fiqh.error')}]` }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === 'user' ? styles.userText : styles.aiText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  const getMadhabLabel = (madhab?: string) => {
    if (!madhab) return t('fiqh.maliki');
    return t(`fiqh.${madhab}`);
  };

  const getDialectLabel = (dialect?: string) => {
    if (!dialect) return t('fiqh.tunisian');
    return t(`fiqh.${dialect}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('fiqh.title')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('fiqh.madhab')} {getMadhabLabel(user?.madhab)} - {t('fiqh.dialect')} {getDialectLabel(user?.dialect)}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder={t('fiqh.placeholder')}
            placeholderTextColor="#aaa"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !query.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!query.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="send" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  messageList: {
    padding: 16,
    paddingBottom: 32,
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
    textAlign: 'right',
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#eee',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#2a2a3e',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    color: '#fff',
    fontSize: 16,
    maxHeight: 120,
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
  sendButtonDisabled: {
    backgroundColor: '#3a3a4e',
  },
});
