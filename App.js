// App.js උඩින්ම දාන්න
global.Buffer = global.Buffer || require('buffer').Buffer;
global.process = global.process || require('process');
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens Import කරන්න
import DashboardScreen from './screens/DashboardScreen';
import ScanScreen from './screens/ScanScreen';
import DiagnosisDetailScreen from './screens/DiagnosisDetailScreen';
import ChatScreen from './screens/ChatScreen';
import HistoryScreen from './screens/HistoryScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* initialRouteName="Login" මගින් ඇප් එක පටන් ගන්න Screen එක දෙනවා */}
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }} >

        {/* Auth Screens (මේක Comment අයින් කළා) */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Main App */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="DiagnosisDetail" component={DiagnosisDetailScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}