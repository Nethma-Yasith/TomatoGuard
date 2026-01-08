import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

// Firebase Import (මේවා වෙනස් වෙන්නේ නෑ)
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseConfig'; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (email === '' || password === '') {
        Alert.alert("Error", "Please enter both email and password.");
        return;
    }

    setLoading(true);

    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Login Success!");
        navigation.replace('Dashboard');
    } catch (error) {
        console.log(error.message);
        let errorMessage = "Login failed. Please check your credentials.";
        if (error.code === 'auth/invalid-email') errorMessage = "Invalid email address.";
        if (error.code === 'auth/user-not-found') errorMessage = "No user found with this email.";
        if (error.code === 'auth/wrong-password') errorMessage = "Incorrect password.";
        Alert.alert("Login Failed", errorMessage);
    } finally {
        setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      {/* 🎨 Theme Change: කොළ පාට වෙනුවට තක්කාලි රතු පාට දැම්මා */}
      <View className="absolute top-0 left-0 right-0 h-80 bg-red-600 rounded-b-[50px] overflow-hidden">
        <LinearGradient
          colors={['#EF4444', '#DC2626']} // Red Gradient
          className="absolute inset-0"
        />
        <View className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <View className="absolute top-20 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      </View>

      <View className="flex-1 justify-center px-8 pt-20">
        
        {/* Title Section */}
        <View className="bg-white p-8 rounded-3xl shadow-2xl shadow-red-900/20 mb-8">
          <View className="items-center mb-6">
            {/* Icon Change: Leaf එක තියෙනවා, හැබැයි පාට මාරු කළා */}
            <View className="w-16 h-16 bg-red-50 rounded-2xl items-center justify-center mb-4 transform -rotate-6 border border-red-100">
              {/* තක්කාලි ගෙඩියක් නිරූපණය කරන්න රතු පාට පාවිච්චි කළා */}
              <FontAwesome5 name="carrot" size={32} color="#EF4444" /> 
              {/* Note: FontAwesome5 Free එකේ 'tomato' icon එක නෑ, ඒක නිසා carrot හෝ leaf පාවිච්චි කරන්න පුළුවන්. 
                 නැත්නම් 'leaf' දාලා කොළ පාට කරන්නත් පුළුවන් ලස්සනට Contrast වෙන්න. */}
            </View>
            
            <Text className="text-3xl font-black text-gray-800">TomatoGuard</Text>
            <Text className="text-gray-500 font-medium text-center mt-2">Smart IoT & AI Solutions for Modern Farming</Text>
          </View>

          {/* Input Fields (පාටවල් පොඩ්ඩක් වෙනස් කළා Focus වෙද්දි ලස්සන වෙන්න) */}
          <View className="space-y-4">
            <View className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 flex-row items-center focus:border-red-500">
              <FontAwesome5 name="envelope" size={18} color="#F87171" />
              <TextInput 
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-3 text-gray-800 font-medium"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 flex-row items-center">
              <FontAwesome5 name="lock" size={18} color="#F87171" />
              <TextInput 
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="flex-1 ml-3 text-gray-800 font-medium"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        {/* Login Button (Red Gradient) */}
        <TouchableOpacity 
          onPress={handleLogin}
          disabled={loading}
          className="mt-4 shadow-xl shadow-red-200 active:scale-95 transition-transform"
        >
          <LinearGradient
            colors={['#EF4444', '#B91C1C']} // Lighter Red to Darker Red
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 rounded-2xl items-center flex-row justify-center space-x-2"
          >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text className="text-white font-bold text-lg tracking-wide">Get Started</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Footer */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-400 font-medium">Portfolio Demo Project</Text>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}