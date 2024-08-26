import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import UserRegisterScreen from './screens/UserRegisterScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShopRegisterScreen from './screens/ShopRegisterScreen'; // Import the ShopRegisterScreen

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,  // Hide the header for all screens
        }}>
        <Stack.Screen 
          options={{ headerShown: false }} 
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
        <Stack.Screen 
          name="Register"  
          component={RegisterScreen} 
        />
        <Stack.Screen 
          name="UserRegister"  
          component={UserRegisterScreen} 
        />
        <Stack.Screen 
          name="ShopRegister"  // Add the ShopRegisterScreen
          component={ShopRegisterScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
