import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './firebase'; // Ensure you have imported your Firebase auth instance

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false); // Stop loading once the auth state is determined
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  if (loading) {
    // Show a loading spinner or screen until the auth state is determined
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
            <Stack.Screen name="RequestService" component={RequestScreen} />
            <Stack.Screen name="ShopList" component={ShopListScreen} />
            <Stack.Screen name="Reviews" component={ReviewsScreen} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
            <Stack.Screen name="ShopRegister" component={ShopRegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
