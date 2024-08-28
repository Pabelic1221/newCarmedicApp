import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import DrawerNavigator from './DrawerNavigator';
import UserRegisterScreen from './screens/UserRegisterScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShopRegisterScreen from './screens/ShopRegisterScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Ensure headers are hidden here
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name="DrawerNavigator" 
          component={DrawerNavigator} 
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
