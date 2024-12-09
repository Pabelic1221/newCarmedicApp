import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  StatusBar,
  Platform,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";

// Screens
import HomeScreen from "./screens/HomeScreen";
import RequestRescueScreen from "./screens/RequestRescueScreen";
import AutoRepairShopScreen from "./screens/AutoRepairShopScreen";
import ReviewsScreen from "./screens/ReviewsScreen";
import FeedbackScreen from "./screens/FeedbackScreen";
import DrawerContent from "./screens/DrawerContent";
import ShopDrawerContent from "./screens/ShopDrawerContent";
import UserProfile from "./screens/UserProfile";
import ARSHomeScreen from "./screens/ARSHomeScreen";
import ShopListScreen from "./screens/ShopListScreen";
import OngoingRequestScreen from "./screens/OngoingRescueScreen";
import Chat from "./screens/ChatScreen";
import ChatList from "./components/chat/ChatList";
import UserRequestLogScreen from "./screens/UserRequestLogScreen";
import ShopProfile from "./screens/ShopProfile";

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { currentUser, status } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(status === "loading");
  }, [status]);
  if (isLoading || !currentUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading... User data</Text>
      </View>
    );
  }

  return (
    <Drawer.Navigator
      detachInactiveScreens={false}
      drawerContent={(props) =>
        currentUser?.role === "Shop" ? (
          <ShopDrawerContent {...props} />
        ) : currentUser?.role === "User" ? (
          <DrawerContent {...props} />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Loading...</Text>
          </View>
        )
      }
      screenOptions={{
        headerShown: false, // Hide headers for all drawer screens
        drawerType: "front",
        unmountOnBlur: false,
        drawerStyle: {
          width: 250,
          backgroundColor: "#fff",
          marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
        overlayColor: "rgba(0,0,0,0.5)",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={
          currentUser?.role === "Shop"
            ? ARSHomeScreen
            : currentUser?.role === "User"
            ? HomeScreen
            : null // Prevent rendering while loading
        }
      />
      <Drawer.Screen name="Request" component={RequestRescueScreen} />
      <Drawer.Screen name="Auto Repair Shops" component={ShopListScreen} />
      <Drawer.Screen name="Reviews" component={ReviewsScreen} />
      <Drawer.Screen name="Auto Repair Shop" component={AutoRepairShopScreen} />
      <Drawer.Screen name="Feedback" component={FeedbackScreen} />
      <Drawer.Screen name="Chat Screen" component={Chat} />
      <Drawer.Screen name="Chat List" component={ChatList} />
      <Drawer.Screen name="UserProfile" component={UserProfile} />
      <Drawer.Screen name="ShopProfile" component={ShopProfile} />
      <Drawer.Screen name="UserRequestLog" component={UserRequestLogScreen} />
      <Drawer.Screen name="OngoingRequest" component={OngoingRequestScreen} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
