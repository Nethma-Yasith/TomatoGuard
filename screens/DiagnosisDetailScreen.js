import React, { useMemo } from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// --- Knowledge Base (Tomato Diseases) ---
const DISEASE_INFO = {
  "Blight": {
    severity: "High",
    description: "Fungal infection causing concentric rings on older leaves. Can lead to severe defoliation if untreated.",
    tags: ["Concentric Rings", "Yellow Halo", "Defoliation"],
    treatments: [
      "Apply Chlorothalonil or Copper fungicide.",
      "Remove infected lower leaves immediately.",
      "Avoid overhead watering to reduce moisture.",
      "Stake plants to improve air circulation."
    ]
  },
  "Phylosticta": { // Tomato Bacterial Spot ලෙස සිතමු (නම වෙනස් නොකරමි Logic එක හරි යන්න)
    severity: "Medium",
    description: "Small water-soaked spots on leaves and fruits. Often spreads through splashing rain.",
    tags: ["Water-soaked Spots", "Fruit Rot", "Leaf Drop"],
    treatments: [
      "Spray copper-based bactericides.",
      "Remove infected plant debris.",
      "Practice crop rotation (2-3 years).",
      "Use pathogen-free seeds."
    ]
  },
  "Healthy": {
    severity: "Low",
    description: "Your tomato plant looks vigorous and disease-free! The leaves are green and the stem is strong.",
    tags: ["Vigorous Growth", "No Lesions", "Good Color"],
    treatments: [
      "Water regularly at the base of the plant.",
      "Apply tomato-specific fertilizer (High K).",
      "Prune suckers for better fruit size.",
      "Monitor for pests like hornworms."
    ]
  },
  "Unknown": {
    severity: "Low",
    description: "Unable to identify a specific disease. However, monitor the plant closely for any changes.",
    tags: ["Unknown Condition"],
    treatments: ["Consult an agricultural officer.", "Isolate the plant if possible."]
  }
};

export default function DiagnosisDetailScreen({ route, navigation }) {
  const { diagnosisData } = route.params || {};
  const detectedDisease = diagnosisData?.disease || "Unknown";
  const diseaseInfo = DISEASE_INFO[detectedDisease] || DISEASE_INFO["Unknown"];

  const data = {
    disease: detectedDisease,
    confidence: diagnosisData?.confidence || 0,
    severity: diseaseInfo.severity, 
    description: diseaseInfo.description,
    tags: diseaseInfo.tags,
    treatments: diseaseInfo.treatments
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'High': return '#EF4444';   // Red
      case 'Medium': return '#F97316'; // Orange
      case 'Low': return '#22C55E';    // Green
      default: return '#6B7280';       // Gray
    }
  };

  const severityColor = getSeverityColor(data.severity);

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Top Image Banner - 🍅 Tomato Image Added Here */}
        <View className="h-96 relative">
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=1200&fit=crop' }} 
            className="w-full h-full"
          >
            {/* Gradient Overlay */}
            <LinearGradient
              colors={['rgba(0,0,0,0.2)', 'rgba(17, 24, 39, 0.9)']}
              className="absolute inset-0"
            />
            
            {/* Nav Buttons */}
            <View className="absolute top-12 left-5 right-5 flex-row justify-between z-10">
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                className="w-12 h-12 bg-black/30 rounded-full items-center justify-center backdrop-blur-xl border border-white/10"
              >
                <FontAwesome5 name="arrow-left" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="w-12 h-12 bg-black/30 rounded-full items-center justify-center backdrop-blur-xl border border-white/10">
                <FontAwesome5 name="share-alt" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Content Container */}
        <View className="bg-white rounded-t-[40px] -mt-16 px-6 pt-10 pb-10 min-h-screen shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)]">
          
          {/* Title Header */}
          <View className="flex-row justify-between items-start mb-8">
            <View className="flex-1 mr-4">
              <Text className="text-3xl font-black text-gray-900 leading-tight mb-3">{data.disease}</Text>
              <View className="flex-row space-x-3">
                <View className="bg-green-50 pl-2 pr-3 py-1.5 rounded-full flex-row items-center border border-green-100">
                  <FontAwesome5 name="check-circle" size={14} color="#15803D" />
                  <Text className="text-green-700 font-bold text-sm ml-1.5">{data.confidence}% Match</Text>
                </View>
              </View>
            </View>
            
            <View className={`p-4 rounded-2xl items-center justify-center shadow-sm border-2`} style={{ backgroundColor: severityColor + '15', borderColor: severityColor + '30' }}>
              <FontAwesome5 name="exclamation-triangle" size={28} color={severityColor} />
            </View>
          </View>

          {/* Severity Bar */}
          <View className="bg-gray-50 p-5 rounded-3xl border border-gray-100 mb-8">
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-500 font-extrabold text-xs uppercase tracking-wider">Risk Assessment</Text>
              <Text style={{ color: severityColor }} className="font-black text-sm uppercase">{data.severity} Risk</Text>
            </View>
            <View className="h-4 bg-gray-200 rounded-full overflow-hidden p-1">
              <LinearGradient
                colors={[severityColor, severityColor]} 
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                className="h-full rounded-full shadow-sm"
                style={{ width: data.severity === 'High' ? '90%' : data.severity === 'Medium' ? '60%' : '30%' }}
              />
            </View>
          </View>

          {/* Diagnosis & Tags */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
               <Text className="text-xl font-black text-gray-900">Diagnosis Report</Text>
            </View>
            <Text className="text-gray-600 text-base leading-7 mb-4 font-medium">
              {data.description}
            </Text>
            
            <View className="flex-row flex-wrap">
                {data.tags.map((tag, index) => (
                    <View key={index} style={{ backgroundColor: severityColor + '20' }} className="px-4 py-2 rounded-full mr-2 mb-2">
                        <Text style={{ color: severityColor }} className="text-xs font-bold">
                            #{tag}
                        </Text>
                    </View>
                ))}
            </View>
          </View>

          {/* Treatment */}
          <View className="mb-8">
            <View className="flex-row items-center mb-6">
              <Text className="text-xl font-black text-gray-900">Recommended Actions</Text>
            </View>
            
            <View className="bg-gray-50 rounded-3xl p-2 border border-gray-100">
            {data.treatments.map((item, index) => (
                <View key={index} className="flex-row p-4 items-start bg-white rounded-2xl mb-2 shadow-sm border border-gray-50">
                    <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-4">
                        <FontAwesome5 name="seedling" size={14} color="#16A34A" />
                    </View>
                    <Text className="text-gray-700 flex-1 leading-6 font-medium text-base">{item}</Text>
                </View>
            ))}
            </View>
          </View>

          {/* AI Consultant Button */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Chat', { diagnosisData: data })}
            className="w-full rounded-3xl shadow-xl shadow-blue-300/50 active:scale-95 transition-transform overflow-hidden"
          >
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="py-5 flex-row items-center justify-center space-x-3"
            >
                <MaterialCommunityIcons name="robot-happy" size={24} color="white" />
                <Text className="text-white font-black text-xl">Ask AI Assistant</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}