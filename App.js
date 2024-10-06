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

import { Provider } from "react-redux";
import { store } from "./redux/store"; // Removed PersistGate for testing
import GeoLocator from "./components/GeoLocator";
import { View, Text } from "react-native";
import TicketListener from "./components/map/Shops/TicketListener";

import { auth } from "./firebase"; // Firebase Auth import
import { onAuthStateChanged, signOut } from "firebase/auth"; // Firebase Auth state listener
import { useDispatch } from "react-redux"; 
import { getCurrentUser, updateUserStatus } from "./redux/user/userActions";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true); // To handle first auth check
  const [user, setUser] = useState(null); // Store the authenticated user
 // const dispatch = useDispatch();

  useEffect(() => {
    // Auth state change listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        if (user.emailVerified) {
          setUser(user); // Set user if email is verified
          //dispatch(getCurrentUser());
          //dispatch(updateUserStatus(user.uid, "online")); // Mark user as online
        } else {
          // If email is not verified, sign the user out
          signOut(auth);
          setUser(null); // Set no user
        }
      } else {
        // No user is signed in
        setUser(null);
      }
      if (initializing) setInitializing(false); // Finish initialization
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, [initializing]);

  // While checking the user's auth state, show loading
  if (initializing) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <GeoLocator>
        <TicketListener>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false, // Hide headers for stack screens
              }}
            >
              {/* Authentication Stack */}
              {!user ? (
                <>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                  <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
                  <Stack.Screen name="ShopRegister" component={ShopRegisterScreen} />
                </>
              ) : (
                <>
                  {/* Main App Navigation */}
                  <Stack.Screen name="Main" component={DrawerNavigator} />
                  
                  {/* User Profile Screen */}
                  <Stack.Screen name="UserProfile" component={UserProfile} />
                  
                  {/* Chat Screen */}
                  <Stack.Screen name="ChatScreen" component={ChatScreen} />
                  <Stack.Screen name="ChatList" component={ChatList} /> 
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </TicketListener>
      </GeoLocator>
    </Provider>
  );
}
