import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../../Screens/Login/Login';
import Chatwindow from '../../Screens/Chatwindow/ChatWindow';
import Home from '../../Screens/Home/Home';
import UsersPanel from '../../Screens/UsersPanel/UsersPanel';
import Forums from '../../Screens/Forums/Forums';
import UserChatScreen from '../../Screens/UserChatScreen/UserChatScreen';
import QRScreen from '../../Screens/QRScreen/QRScreen';
import ScannerScreen from '../../Screens/ScannerScreen/ScannerScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} // Hide header if desired
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Home',
            headerStyle: { backgroundColor: '#333B56', color: "white" },
            headerTintColor: "white",
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Chat"
          component={Chatwindow}
          options={{ title: 'Chat', headerShown: false }}
        />
        <Stack.Screen name="UsersPanel" component={UsersPanel} />
        <Stack.Screen name="Forums" component={Forums} />
        <Stack.Screen name="UserChat" component={UserChatScreen} />
        <Stack.Screen name="QR" component={QRScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name='Scanner' component={ScannerScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
