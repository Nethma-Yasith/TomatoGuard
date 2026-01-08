import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

// --- 1. Growth Tracker (Same as before - Because it's logical) ---
const GrowthTracker = () => {
    const daysPassed = 45; 
    const totalDays = 90;
    const progress = daysPassed / totalDays;

    return (
        <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="text-lg font-black text-gray-800">Crop Timeline</Text>
                    <Text className="text-xs text-gray-500 font-medium">Season 2025 - Cycle #01</Text>
                </View>
                <View className="bg-red-50 px-3 py-1 rounded-full border border-red-100">
                    <Text className="text-red-600 font-bold text-xs">Day {daysPassed}</Text>
                </View>
            </View>

            {/* Stage Info - More Detailed */}
            <View className="flex-row items-center bg-gray-50 p-4 rounded-2xl mb-4 border border-gray-100">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                    <MaterialCommunityIcons name="sprout" size={24} color="#16A34A" />
                </View>
                <View className="flex-1">
                    <Text className="text-base font-bold text-gray-800">Vegetative Stage</Text>
                    <Text className="text-xs text-gray-500 leading-4 mt-1">
                        Rapid leaf growth. Plants need high Nitrogen now. Watch out for early blight signs.
                    </Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View>
                <View className="flex-row justify-between mb-2">
                    <Text className="text-xs font-bold text-gray-400">Planted (Oct 10)</Text>
                    <Text className="text-xs font-bold text-gray-400">Harvest (Jan 10)</Text>
                </View>
                <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <LinearGradient
                        colors={['#22C55E', '#EF4444']} 
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="h-full rounded-full"
                        style={{ width: `${progress * 100}%` }}
                    />
                </View>
            </View>
        </View>
    );
};

// --- 2. NEW: Weather & Smart Advisory Card ---
const WeatherCard = () => {
    return (
        <View className="flex-row justify-between space-x-3 mb-6">
            {/* Weather Block */}
            <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                className="flex-1 rounded-3xl p-4 relative overflow-hidden"
            >
                <MaterialCommunityIcons name="weather-partly-cloudy" size={40} color="white" style={{ opacity: 0.8 }} />
                <View className="mt-4">
                    <Text className="text-white/70 text-xs font-bold">WEATHER</Text>
                    <Text className="text-white text-2xl font-black">28°C</Text>
                    <Text className="text-white/90 text-xs font-medium mt-1">Rain expected at 4 PM.</Text>
                </View>
            </LinearGradient>

            {/* AI Advice Block */}
            <View className="flex-1 bg-white rounded-3xl p-4 border border-gray-100 justify-between">
                <View className="flex-row justify-between items-start">
                    <FontAwesome5 name="robot" size={20} color="#EF4444" />
                    <View className="bg-red-50 px-2 py-0.5 rounded-md">
                        <Text className="text-[10px] text-red-500 font-bold">AI ALERT</Text>
                    </View>
                </View>
                <View>
                    <Text className="text-gray-800 text-sm font-bold leading-5">
                        "Skip watering today due to expected rain."
                    </Text>
                </View>
            </View>
        </View>
    );
};

// --- 3. NEW: Market Price Card ---
const MarketPriceCard = () => (
    <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
        <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
                <View className="w-8 h-8 bg-yellow-100 rounded-full items-center justify-center mr-3">
                    <FontAwesome5 name="coins" size={14} color="#D97706" />
                </View>
                <Text className="text-base font-bold text-gray-800">Market Price</Text>
            </View>
            <Text className="text-xs text-gray-400">Dambulla Eco Center</Text>
        </View>
        <View className="flex-row items-end justify-between bg-gray-50 p-4 rounded-2xl">
            <View>
                <Text className="text-gray-500 text-xs font-bold uppercase mb-1">Tomato (Grade A)</Text>
                <Text className="text-3xl font-black text-gray-900">Rs. 320<Text className="text-sm font-medium text-gray-500">/kg</Text></Text>
            </View>
            <View className="flex-row items-center mb-1">
                <FontAwesome5 name="arrow-up" size={12} color="#16A34A" />
                <Text className="text-green-600 font-bold text-sm ml-1">+12%</Text>
            </View>
        </View>
    </View>
);

// --- 4. Task Item ---
const TaskItem = ({ title, sub, completed, onToggle }) => (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7} className="flex-row items-center bg-white p-4 rounded-2xl mb-3 border border-gray-100 shadow-sm">
        <View className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${completed ? 'bg-red-500 border-red-500' : 'border-gray-300'}`}>
            {completed && <FontAwesome5 name="check" size={12} color="white" />}
        </View>
        <View className="flex-1">
            <Text className={`font-bold text-gray-800 text-base ${completed ? 'line-through text-gray-400' : ''}`}>{title}</Text>
            <Text className="text-xs text-gray-400 mt-0.5">{sub}</Text>
        </View>
    </TouchableOpacity>
);

// --- MAIN DASHBOARD ---
export default function DashboardScreen({ navigation }) {
    
    // Tasks State
    const [tasks, setTasks] = useState([
        { id: 1, title: "Inspect for Early Blight", sub: "Check lower leaves for spots", completed: true },
        { id: 2, title: "Apply Calcium Nitrate", sub: "Prevent blossom end rot", completed: false },
        { id: 3, title: "Update Harvest Log", sub: "Record today's yield", completed: false },
    ]);

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                
                {/* Header */}
                <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                    className="pt-12 pb-4 px-6 rounded-b-3xl shadow-sm z-50 sticky top-0"
                >
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center space-x-3">
                            <LinearGradient colors={['#EF4444', '#B91C1C']} className="w-12 h-12 rounded-2xl items-center justify-center shadow-lg shadow-red-200">
                                <FontAwesome5 name="carrot" size={20} color="white" />
                            </LinearGradient>
                            <View>
                                <Text className="text-xl font-black text-gray-800">TomatoGuard</Text>
                                <Text className="text-xs font-bold text-gray-400 tracking-wider">FARM INSIGHTS</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('History')} className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center border border-gray-200">
                            <FontAwesome5 name="bell" size={16} color="gray" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                <View className="px-5 mt-6">

                    {/* Quick Scan Button */}
                    <TouchableOpacity onPress={() => navigation.navigate('Scan')} activeOpacity={0.9} className="mb-6">
                        <LinearGradient
                            colors={['#EF4444', '#DC2626']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="rounded-3xl p-6 shadow-xl shadow-red-200 flex-row items-center justify-between"
                        >
                            <View className="flex-row items-center space-x-4">
                                <View className="w-14 h-14 bg-white/20 rounded-2xl items-center justify-center backdrop-blur-md">
                                    <FontAwesome5 name="camera" size={24} color="white" />
                                </View>
                                <View>
                                    <Text className="text-2xl font-black text-white">New Scan</Text>
                                    <Text className="text-white/80 font-medium">Identify Diseases Instantly</Text>
                                </View>
                            </View>
                            <View className="bg-white/20 w-10 h-10 rounded-full items-center justify-center">
                                <FontAwesome5 name="arrow-right" size={16} color="white" />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* 1. Growth Tracker (Logical) */}
                    <GrowthTracker />

                    {/* 2. Weather & AI Advice (Smart Feature) */}
                    <WeatherCard />

                    {/* 3. Market Price (Business Feature) */}
                    <MarketPriceCard />

                    {/* 4. Priority Tasks */}
                    <View className="mb-8">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-black text-gray-900">Priority Tasks</Text>
                            <Text className="text-xs font-bold text-gray-400">{tasks.filter(t => t.completed).length}/{tasks.length} Done</Text>
                        </View>
                        {tasks.map(task => (
                            <TaskItem key={task.id} {...task} onToggle={() => toggleTask(task.id)} />
                        ))}
                    </View>

                    {/* 5. Yield Chart */}
                    <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-8">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold text-gray-800">Harvest Forecast</Text>
                            <FontAwesome5 name="chart-line" size={16} color="#9CA3AF" />
                        </View>
                        <LineChart
                            data={{ labels: ["W1", "W2", "W3", "W4"], datasets: [{ data: [150, 230, 180, 320] }] }}
                            width={screenWidth - 70} height={180}
                            chartConfig={{ 
                                backgroundColor: "#ffffff", 
                                backgroundGradientFrom: "#ffffff", 
                                backgroundGradientTo: "#ffffff", 
                                decimalPlaces: 0, 
                                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, 
                                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`, 
                                style: { borderRadius: 16 }, 
                                propsForDots: { r: "4", strokeWidth: "2", stroke: "#DC2626" } 
                            }}
                            bezier style={{ marginVertical: 8, borderRadius: 16 }}
                        />
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}