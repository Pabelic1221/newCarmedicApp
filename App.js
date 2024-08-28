import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import DrawerNavigator from './DrawerNavigator';
import UserRegisterScreen from './screens/UserRegisterScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShopRegisterScreen from './screens/ShopRegisterScreen'; 
import RequestScreen from './screens/RequestScreen';
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
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
        <Stack.Screen name="ShopRegister" component={ShopRegisterScreen} />
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        <Stack.Screen name="RequestService" component={RequestScreen} />
        <Stack.Screen name="ShopList" component={ShopListScreen} />
        <Stack.Screen name="Reviews" component={ReviewsScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
