import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// Firebase imports
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from '../firebaseConfig';

export default function HistoryScreen({ navigation }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data ganna function eka
  const fetchHistory = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, "history"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const docs = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({ 
            id: doc.id, 
            ...data,
            // Date Format eka lassana karanna
            date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toDateString() : "Just now",
            time: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "" 
        });
      });
      setHistoryList(docs);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHistory();
    });
    return unsubscribe;
  }, [navigation]);

  // --- UI Helpers ---
  const getStatusColor = (severity) => {
    if (severity === 'High') return '#EF4444'; // Red
    if (severity === 'Medium') return '#F97316'; // Orange
    if (severity === 'Low') return '#22C55E'; // Green
    return '#9CA3AF'; // Gray
  };

  const getStatusIcon = (disease) => {
    if (disease.includes('Healthy')) return 'smile-beam';
    if (disease.includes('Blight')) return 'biohazard';
    return 'leaf';
  };

  // --- Render Item (Card Design) ---
  const renderItem = ({ item }) => {
    const statusColor = getStatusColor(item.severity);

    return (
      <TouchableOpacity 
        className="bg-white rounded-3xl mb-4 shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform"
        onPress={() => navigation.navigate('Chat', { savedSession: item })}
      >
        <View className="flex-row p-4">
          
          {/* Left Side: Status Icon */}
          <View 
            className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
            style={{ backgroundColor: statusColor + '15' }} // 15% Opacity
          >
            <FontAwesome5 name={getStatusIcon(item.disease)} size={24} color={statusColor} />
          </View>
          
          {/* Middle: Details */}
          <View className="flex-1 justify-center">
            <View className="flex-row justify-between items-start">
                <Text className="text-lg font-black text-gray-800 mb-1">{item.disease}</Text>
                {/* Severity Badge */}
                <View className="px-2 py-0.5 rounded-md border" style={{ borderColor: statusColor, backgroundColor: statusColor + '10' }}>
                    <Text style={{ color: statusColor }} className="text-[10px] font-bold uppercase">{item.severity} Risk</Text>
                </View>
            </View>
            
            <View className="flex-row items-center space-x-3 mt-1">
                <View className="flex-row items-center">
                    <FontAwesome5 name="calendar-alt" size={10} color="#9CA3AF" />
                    <Text className="text-gray-400 text-xs ml-1.5 font-medium">{item.date}</Text>
                </View>
                <View className="w-1 h-1 bg-gray-300 rounded-full" />
                <Text className="text-gray-400 text-xs font-medium">{item.time}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Strip: Chat Info */}
        <View className="bg-gray-50 px-4 py-3 flex-row justify-between items-center border-t border-gray-100">
            <View className="flex-row items-center">
                <MaterialCommunityIcons name="robot-outline" size={16} color="#6B7280" />
                <Text className="text-gray-500 text-xs font-bold ml-2">
                    {item.messages ? item.messages.length : 0} Interactions Recorded
                </Text>
            </View>
            <View className="flex-row items-center">
                <Text className="text-red-500 text-xs font-bold mr-1">Review</Text>
                <FontAwesome5 name="chevron-right" size={10} color="#EF4444" />
            </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      
      {/* Header Section */}
      <View className="pt-14 pb-6 px-6 bg-white border-b border-gray-100">
        <View className="flex-row justify-between items-end">
            <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Diagnosis Records</Text>
                <Text className="text-3xl font-black text-gray-900">Scan History</Text>
            </View>
            <View className="bg-red-50 px-4 py-2 rounded-2xl border border-red-100">
                <Text className="text-red-600 font-black text-xl">{historyList.length}</Text>
                <Text className="text-red-400 text-[10px] font-bold uppercase">Total Scans</Text>
            </View>
        </View>
      </View>

      {/* Content List */}
      <View className="flex-1 px-5 pt-6">
        {loading ? (
          <View className="mt-20 items-center">
            <ActivityIndicator size="large" color="#EF4444" />
            <Text className="text-gray-400 mt-4 font-medium">Loading records...</Text>
          </View>
        ) : (
          <FlatList
            data={historyList}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={
              <View className="items-center justify-center mt-20 opacity-60">
                <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-4">
                    <FontAwesome5 name="history" size={40} color="#9CA3AF" />
                </View>
                <Text className="text-xl font-bold text-gray-500">No History Yet</Text>
                <Text className="text-gray-400 text-center mt-2 w-2/3">
                    Start scanning your tomato plants to build a diagnosis history.
                </Text>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Scan')}
                    className="mt-6 bg-red-500 px-6 py-3 rounded-full shadow-lg shadow-red-200"
                >
                    <Text className="text-white font-bold">Start New Scan</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}