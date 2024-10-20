import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import Login from './components/Login';
import Chatwindow from './components/Chatwindow';
import Home from './components/Home';
import UsersPanel from './components/UsersPanel';
import Forums from './components/Forums';
import UserChatScreen from './components/UserChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
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
          options={{ title: 'Home',
            headerStyle:{backgroundColor: '#333B56',color: "white"},
            headerTintColor: "white"
           }} 
        />
        <Stack.Screen 
          name="Chat" 
          component={Chatwindow} 
          options={{ title: 'Chat',headerShown: false  }} 
        />
         <Stack.Screen name="UsersPanel" component={UsersPanel} />
         <Stack.Screen name="Forums" component={Forums} />
         <Stack.Screen name="UserChat" component={UserChatScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'rgb(41,47,63)',
    // alignItems: 'center',
    // justifyContent: 'center',
    // color: "white",
  },
});
