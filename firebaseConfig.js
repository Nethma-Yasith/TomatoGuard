import { initializeApp } from "firebase/app";
// වෙනස්කම 1: getAuth වෙනුවට මේ දෙක ගන්නවා 👇
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// වෙනස්කම 2: Storage එක import කරනවා 👇
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// ඔයාගේ Config එක (මේක වෙනස් කරන්න එපා)
const firebaseConfig = {
  apiKey: " ",
  authDomain: "tomatoguard-8eda5.firebaseapp.com",
  projectId: "tomatoguard-8eda5",
  storageBucket: "tomatoguard-8eda5.firebasestorage.app",
  messagingSenderId: "658386899934",
  appId: "1:658386899934:web:f759e4d1080f91c2e5834f",
  measurementId: "G-721S71ME8W"
};

const app = initializeApp(firebaseConfig);

// වෙනස්කම 3: Auth එක හදන්නේ මෙහෙමයි (එතකොට Login එක ෆෝන් එකේ Save වෙනවා) 👇
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);
