import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { GoogleGenerativeAI } from "@google/generative-ai";
// Firebase imports
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 
import { db, auth } from '../firebaseConfig'; 

// ⚠️ Ensure your API Key is valid
const API_KEY = " "; 

export default function ChatScreen({ route, navigation }) {
  const { diagnosisData, savedSession } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const scrollViewRef = useRef();

  // Model Setup
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  useEffect(() => {
    if (savedSession) {
      setMessages(savedSession.messages || []);
    } else if (diagnosisData) {
      startChat();
    }
  }, [diagnosisData, savedSession]);

  const startChat = async () => {
    setLoading(true);
    try {
      // 🍅 Context updated for TomatoGuard
      const context = `Tomato Plant Disease: ${diagnosisData.disease}, Severity: ${diagnosisData.severity}, Description: ${diagnosisData.description}`;
      
      const initialHistory = [
        { role: "user", parts: [{ text: `You are an expert Tomato Farming Consultant. Help me with this diagnosis: ${context}. Keep answers short and practical.` }] },
        { role: "model", parts: [{ text: `Hello! I see your tomato plant has ${diagnosisData.disease}. How can I assist you with treatment or prevention?` }] },
      ];

      const chat = model.startChat({ history: initialHistory });
      setChatSession(chat);
      setMessages([{ id: 1, type: 'ai', text: `I analyzed your tomato plant. It seems to have ${diagnosisData.disease}. Ask me anything about treatment!` }]);
    } catch (error) {
      console.error("Chat Error:", error);
      Alert.alert("Error", "Failed to connect to AI.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !chatSession) return;
    
    const userMsg = inputText;
    setInputText('');
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const result = await chatSession.sendMessage(userMsg);
      const responseText = result.response.text();
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: responseText }]);
    } catch (error) {
      console.error("Message Error:", error);
      Alert.alert("Error", "Failed to get response.");
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "Please login first.");
      return;
    }

    if (!db) {
      Alert.alert("Error", "Database connection failed.");
      return;
    }

    try {
      await addDoc(collection(db, "history"), {
        userId: auth.currentUser.uid,
        disease: diagnosisData.disease,
        confidence: diagnosisData.confidence,
        severity: diagnosisData.severity,
        messages: messages, 
        createdAt: serverTimestamp()
      });

      Alert.alert("Success", "Saved to History!");
    } catch (error) {
      console.error("Save Error:", error);
      Alert.alert("Save Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-gray-50">
      
      {/* Header - Updated to Red Theme */}
      <View className="bg-white pt-12 pb-4 px-6 shadow-sm z-10 flex-row items-center justify-between border-b border-gray-100">
        <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                <FontAwesome5 name="arrow-left" size={20} color="#374151" />
            </TouchableOpacity>
            <View>
                <Text className="text-xl font-black text-gray-900">AI Consultant</Text>
                <View className="flex-row items-center">
                    <View className={`w-2 h-2 rounded-full mr-1.5 ${savedSession ? 'bg-gray-400' : 'bg-green-500 animate-pulse'}`} />
                    <Text className="text-xs text-gray-500 font-bold">{savedSession ? 'HISTORY VIEW' : 'TOMATO EXPERT'}</Text>
                </View>
            </View>
        </View>

        {!savedSession && (
            <TouchableOpacity onPress={saveToHistory} className="bg-gray-50 p-2 rounded-xl">
                {/* Save Icon Color Changed to Red */}
                <FontAwesome5 name="save" size={20} color="#EF4444" />
            </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        ref={scrollViewRef} 
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        className="flex-1 px-4 pt-4"
      >
        {messages.map((msg, index) => (
          <View key={index} className={`mb-4 flex-row ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <View 
                className={`px-5 py-3.5 rounded-2xl max-w-[85%] shadow-sm ${
                    msg.type === 'user' 
                    ? 'bg-red-500 rounded-br-none' // User Color -> Red
                    : 'bg-white border border-gray-100 rounded-bl-none' // AI Color -> White
                }`}
            >
              <Text className={`text-sm leading-5 ${msg.type === 'user' ? 'text-white font-medium' : 'text-gray-700'}`}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
        {loading && (
            <View className="flex-row justify-start mb-4">
                <View className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 flex-row items-center space-x-2">
                    <ActivityIndicator size="small" color="#EF4444" />
                    <Text className="text-gray-400 text-xs">AI is typing...</Text>
                </View>
            </View>
        )}
      </ScrollView>

      {!savedSession && (
          <View className="p-4 bg-white border-t border-gray-100 flex-row space-x-3 items-center pb-8">
            <View className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 flex-row items-center focus:border-red-400 focus:bg-white transition-all">
                <TextInput 
                    value={inputText} 
                    onChangeText={setInputText} 
                    placeholder="Ask about your tomato plant..." 
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 text-gray-800 text-base" 
                />
            </View>
            
            {/* Send Button -> Red Gradient Style */}
            <TouchableOpacity 
                onPress={sendMessage} 
                disabled={!inputText.trim() || loading}
                className={`w-12 h-12 rounded-2xl items-center justify-center shadow-lg shadow-red-200 ${!inputText.trim() ? 'bg-gray-300' : 'bg-red-500'}`}
            >
                <FontAwesome5 name="paper-plane" size={18} color="white" />
            </TouchableOpacity>
          </View>
      )}
    </KeyboardAvoidingView>
  );
}
