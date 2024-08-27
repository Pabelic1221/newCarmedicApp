import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import UserRegisterScreen from './screens/UserRegisterScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShopRegisterScreen from './screens/ShopRegisterScreen';
import RequestServiceScreen from './screens/RequestServiceScreen';
import ShopListScreen from './screens/ShopListScreen';
import ReviewsScreen from './screens/ReviewsScreen';
import FeedbackScreen from './screens/FeedbackScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,  
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
          name="ShopRegister"  
          component={ShopRegisterScreen} 
        />
        <Stack.Screen 
          name="RequestService"  
          component={RequestServiceScreen} 
        />
        <Stack.Screen 
          name="ShopList"  
          component={ShopListScreen} 
        />
        <Stack.Screen 
          name="Reviews"  
          component={ReviewsScreen} 
        />
        <Stack.Screen 
          name="Feedback"  
          component={FeedbackScreen} 
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
