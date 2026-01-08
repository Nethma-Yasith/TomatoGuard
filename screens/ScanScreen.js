import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { loadTensorflowModel } from 'react-native-fast-tflite';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import jpeg from 'jpeg-js';

export default function ScanScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState([]);
  const [isModelReady, setIsModelReady] = useState(false);

  useEffect(() => {
    const setupModel = async () => {
      try {
        console.log("📥 Loading assets...");
        // ⚠️ NOTE: ඔයා අලුත් Tomato Model එක Train කළාම ඒ ෆයිල් වල නම් මෙතනට දාන්න.
        // දැනට පරණ නමම තියනවා Error එන එක නවත්තන්න.
        const modelAsset = Asset.fromModule(require('../assets/model/tomato_model.tflite'));
        const labelsAsset = Asset.fromModule(require('../assets/model/labels.txt'));

        await modelAsset.downloadAsync();
        await labelsAsset.downloadAsync();

        const modelUri = modelAsset.localUri || modelAsset.uri;
        const labelsUri = labelsAsset.localUri || labelsAsset.uri;

        if (!modelUri) throw new Error("Model file not found!");

        const loadedModel = await loadTensorflowModel({ url: modelUri });
        setModel(loadedModel);
        
        const labelsContent = await FileSystem.readAsStringAsync(labelsUri);
        setLabels(labelsContent.split('\n').filter(item => item.trim() !== ''));
        
        setIsModelReady(true);
        console.log("✅ Model Ready! Buttons should be enabled.");
      } catch (err) {
        console.error("❌ Model Error:", err);
        Alert.alert("Error", "Failed to load AI Model: " + err.message);
      }
    };
    setupModel();
  }, []);

  const processImage = async (uri) => {
    console.log("⚙️ Processing Image...");
    try {
      if (!model) return;

      const manipResult = await ImageManipulator.manipulateAsync(
        uri, [{ resize: { width: 224, height: 224 } }], { format: ImageManipulator.SaveFormat.JPEG }
      );

      const imgB64 = await FileSystem.readAsStringAsync(manipResult.uri, { encoding: FileSystem.EncodingType.Base64 });
      const imgBuffer = Uint8Array.from(atob(imgB64), c => c.charCodeAt(0));
      const { data } = jpeg.decode(imgBuffer, { useTArray: true });

      const input = new Float32Array(224 * 224 * 3);
      for (let i = 0; i < 224 * 224; i++) {
        input[i * 3 + 0] = data[i * 4 + 0] / 255.0;
        input[i * 3 + 1] = data[i * 4 + 1] / 255.0;
        input[i * 3 + 2] = data[i * 4 + 2] / 255.0;
      }

      const output = await model.run([input]);
      const results = output[0];

      let maxScore = 0;
      let maxIndex = 0;
      results.forEach((score, index) => {
        if (score > maxScore) { maxScore = score; maxIndex = index; }
      });

      const detectedDisease = labels[maxIndex] || "Unknown";
      const confidence = (maxScore * 100).toFixed(1);
      console.log(`🎯 Prediction: ${detectedDisease}`);

      navigation.navigate('DiagnosisDetail', {
        diagnosisData: {
          disease: detectedDisease,
          confidence: confidence,
          severity: maxScore > 0.8 ? "High" : "Medium",
          description: getDescription(detectedDisease)
        }
      });

    } catch (error) {
      console.error("❌ Analysis Error:", error);
      Alert.alert("Error", "Analysis Failed: " + error.message);
    } finally {
      setScanning(false);
    }
  };

  // 🍅 තක්කාලි ලෙඩ වලට ගැලපෙන විදිහට Description වෙනස් කළා
  const getDescription = (d) => {
    const disease = d.toLowerCase();
    if (disease.includes("early blight")) return "Fungal infection causing concentric rings on older leaves. Needs fungicide.";
    if (disease.includes("late blight")) return "Severe water-soaked spots. Requires immediate removal of infected parts.";
    if (disease.includes("bacterial")) return "Small water-soaked spots on leaves. Avoid overhead watering.";
    if (disease.includes("healthy")) return "Your tomato plant looks vigorous and healthy!";
    
    // Fallback for old model labels (Cardamom) just in case
    if (disease.includes("blight")) return "Fungal infection detected. Monitor moisture levels.";
    if (disease.includes("phylosticta")) return "Leaf spot disease detected.";
    
    return "Unknown condition. Please consult an expert.";
  };

  // --- 📸 Camera Function ---
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Camera access is required.");
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setScanning(true);
        setTimeout(() => processImage(result.assets[0].uri), 100);
      }
    } catch (e) {
      Alert.alert("Camera Error", e.message);
    }
  };

  // --- 🖼️ Gallery Function ---
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Gallery access is required.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setScanning(true);
        setTimeout(() => processImage(result.assets[0].uri), 100);
      }
    } catch (e) {
      Alert.alert("Gallery Error", e.message);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-6 shadow-sm z-10 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <FontAwesome5 name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-black text-gray-900">Tomato Scan</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        {!image ? (
          <View className="items-center space-y-6">
            
            {/* 🎨 Theme Change: Red Circle & Icon */}
            <View className="w-64 h-64 bg-red-50 rounded-full items-center justify-center border-4 border-dashed border-red-200 mb-6">
               <FontAwesome5 name="carrot" size={64} color="#EF4444" />
            </View>
            
            <Text className="text-center text-gray-500 mb-4">{isModelReady ? "AI Ready! Capture a leaf." : "Loading AI Model..."}</Text>
            
            {/* Camera Button (Red) */}
            <TouchableOpacity 
                onPress={takePhoto} 
                disabled={!isModelReady} 
                className={`w-full py-4 rounded-2xl shadow-lg flex-row justify-center items-center space-x-3 ${isModelReady ? 'bg-[#EF4444]' : 'bg-gray-400'}`}
            >
              <FontAwesome5 name="camera" size={20} color="white" />
              <Text className="text-white font-bold text-lg">Take Photo</Text>
            </TouchableOpacity>

            {/* Gallery Button */}
            <TouchableOpacity 
                onPress={pickImage} 
                disabled={!isModelReady} 
                className="w-full bg-white border border-gray-200 py-4 rounded-2xl flex-row justify-center items-center space-x-3"
            >
              <FontAwesome5 name="images" size={20} color="#374151" />
              <Text className="text-gray-700 font-bold text-lg">Upload from Gallery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="items-center justify-center flex-1">
            <View className="relative w-72 h-72 rounded-3xl overflow-hidden shadow-2xl mb-8">
              <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
              
              {/* Scanning Overlay (Red Spinner) */}
              {scanning && (
                <View className="absolute inset-0 bg-black/40 items-center justify-center">
                    <ActivityIndicator size="large" color="#EF4444" />
                    <Text className="text-white font-bold mt-4 animate-pulse">Analyzing...</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}