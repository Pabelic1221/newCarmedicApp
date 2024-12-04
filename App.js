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
import ARSHomeScreen from "./screens/ARSHomeScreen";
import SpecialtiesScreen from "./screens/SpecialtiesScreen";
import Chat from "./screens/ChatScreen";
import FeedbackScreen from "./screens/FeedbackScreen";
import AutoRepairShopsScreen from "./screens/AutoRepairShopScreen";
import ReviewsScreen from "./screens/ReviewsScreen";
import ShopListScreen from "./screens/ShopListScreen";
import OngoingRequestScreen from "./screens/OngoingRescueScreen";
import RequestRescueScreen from "./screens/RequestRescueScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
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
              <Stack.Screen name="ShopHome" component={ARSHomeScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="ChatList" component={ChatList} />
              <Stack.Screen name="Specialties" component={SpecialtiesScreen} />
              <Stack.Screen name="Request" component={RequestRescueScreen} />
              <Stack.Screen name="AutoRepairShops" component={ShopListScreen} />
              <Stack.Screen name="Reviews" component={ReviewsScreen} />
              <Stack.Screen
                name="AutoRepairShop"
                component={AutoRepairShopsScreen}
              />
              <Stack.Screen name="Feedback" component={FeedbackScreen} />
              <Stack.Screen name="Chat" component={Chat} />
              <Stack.Screen name="UserProfile" component={UserProfile} />
              <Stack.Screen name="ShopProfile" component={ShopProfile} />
              <Stack.Screen
                name="UserRequestLog"
                component={UserRequestLogScreen}
              />
              <Stack.Screen
                name="OngoingRequest"
                component={OngoingRequestScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GeoLocator>
      </PersistGate>
    </Provider>
  );
}
