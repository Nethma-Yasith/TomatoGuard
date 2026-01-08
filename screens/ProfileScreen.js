import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  
  const MenuItem = ({ icon, title, color = "gray", onPress }) => (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center bg-white p-4 rounded-2xl mb-3 border border-gray-100 shadow-sm active:bg-gray-50"
    >
      <View className={`w-10 h-10 rounded-xl bg-${color}-50 items-center justify-center mr-4`}>
        <FontAwesome5 name={icon} size={18} color={color === "gray" ? "#6B7280" : color} />
      </View>
      <Text className="flex-1 text-gray-700 font-bold text-base">{title}</Text>
      <FontAwesome5 name="chevron-right" size={14} color="#D1D5DB" />
    </TouchableOpacity>
  );

  const handleLogout = () => {
    // පස්සේ මෙතනට Firebase Logout එනවා
    navigation.replace('Login');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Background */}
      <View className="h-72 bg-white relative overflow-hidden">
        <LinearGradient
          colors={['#16A34A', '#15803D']}
          className="absolute inset-0 rounded-b-[40px]"
        />
        
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="absolute top-12 left-6 w-10 h-10 bg-white/20 rounded-full items-center justify-center z-10 backdrop-blur-md"
        >
          <FontAwesome5 name="arrow-left" size={18} color="white" />
        </TouchableOpacity>

        {/* Profile Info */}
        <View className="flex-1 items-center justify-center pt-10">
          <View className="w-28 h-28 rounded-full border-4 border-white/30 p-1 shadow-2xl">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop' }} 
              className="w-full h-full rounded-full bg-gray-200"
            />
            <View className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full items-center justify-center shadow-md">
                <FontAwesome5 name="camera" size={12} color="#16A34A" />
            </View>
          </View>
          <Text className="text-white font-black text-2xl mt-4">Nethma Yasith</Text>
          <Text className="text-green-100 font-medium">Software Engineer • Farmer</Text>
        </View>
      </View>

      {/* Settings List */}
      <ScrollView 
        className="flex-1 px-6 -mt-10" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="text-gray-500 font-bold text-xs mb-3 ml-2 uppercase tracking-wider">Account</Text>
        <MenuItem icon="user" title="Personal Information" color="blue" />
        <MenuItem icon="bell" title="Notifications" color="orange" />
        <MenuItem icon="lock" title="Security & Privacy" color="purple" />

        <Text className="text-gray-500 font-bold text-xs mb-3 ml-2 mt-4 uppercase tracking-wider">Farm Settings</Text>
        <MenuItem icon="wifi" title="IoT Connection" color="green" />
        <MenuItem icon="database" title="Data Export" color="gray" />

        <TouchableOpacity 
          onPress={handleLogout}
          className="mt-6 flex-row items-center justify-center bg-red-50 py-4 rounded-2xl border border-red-100"
        >
          <FontAwesome5 name="sign-out-alt" size={16} color="#EF4444" />
          <Text className="ml-2 text-red-600 font-bold">Log Out</Text>
        </TouchableOpacity>
        
        <Text className="text-center text-gray-400 text-xs mt-6">Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}