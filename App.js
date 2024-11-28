import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UserRegisterScreen from "./screens/UserRegisterScreen";
import ShopRegisterScreen from "./screens/ShopRegisterScreen";
import DrawerNavigator from "./DrawerNavigator";
import UserProfile from "./screens/UserProfile";
import ChatScreen from "./screens/ChatScreen";
import ChatList from "./components/chat/ChatList";
import UserRequestLogScreen from "./screens/UserRequestLogScreen";
import ShopProfile from "./screens/ShopProfile";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import GeoLocator from "./components/GeoLocator";
import { View, Text } from "react-native";
import { auth } from "./firebase"; // Assuming you're using Firebase for authentication

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const role = await getUserRole(user.uid); // Fetch the user role
        setUserRole(role);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    ); // Show a loading screen while checking user role
  }

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View>
            <Text>Loading...</Text>
          </View>
        }
        persistor={persistor}
      >
        <GeoLocator>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false, // Hide headers for stack screens
              }}
            >
              {/* Authentication Stack */}
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen
                name="UserRegister"
                component={UserRegisterScreen}
              />
              <Stack.Screen
                name="ShopRegister"
                component={ShopRegisterScreen}
              />
              <Stack.Screen name="ShopProfile" component={ShopProfile} /> 
              {/* Main App Navigation */}
              {userRole === "shop" && (
                <Stack.Screen name="Main" component={DrawerNavigator} />
              )}
              {userRole === "user" && (
                <Stack.Screen name="UserProfile" component={UserProfile} />
              )}

              {/* Chat Screen */}
              <Stack.Screen name="ChatScreen" component={ChatScreen} />
              <Stack.Screen name="ChatList" component={ChatList} />
              <Stack.Screen
                name="UserRequestLog"
                component={UserRequestLogScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GeoLocator>
      </PersistGate>
    </Provider>
  );
}

// Function to get user role from your database
async function getUserRole(uid) {
  // Implement your logic to fetch the user role from your database
  // This is a placeholder function
  // You would typically query your database here and return the role
  return "shop"; // or "user" based on the user's role
}
