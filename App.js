import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import UserRegisterScreen from './screens/UserRegisterScreen';
import ShopRegisterScreen from './screens/ShopRegisterScreen';
import DrawerNavigator from './DrawerNavigator'; // Import DrawerNavigator for main app navigation

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide headers for stack screens
        }}
      >
        {/* Authentication Stack */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
        <Stack.Screen name="ShopRegister" component={ShopRegisterScreen} />
        
        {/* Main App Navigation */}
        <Stack.Screen name="Main" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
