import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar, Platform } from "react-native";

import HomeScreen from "./screens/HomeScreen";
import RequestRescueScreen from "./screens/RequestRescueScreen";
import AutoRepairShopScreen from "./screens/AutoRepairShopScreen";
import ReviewsScreen from "./screens/ReviewsScreen";
import FeedbackScreen from "./screens/FeedbackScreen";
import DrawerContent from "./screens/DrawerContent";
import UserProfile from "./screens/UserProfile";
import { useSelector } from "react-redux";
import ARSHomeScreen from "./screens/ARSHomeScreen";
import ShopListScreen from "./screens/ShopListScreen";

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // Hide headers for all drawer screens
        drawerType: "front",
        drawerStyle: {
          width: 250,
          backgroundColor: "#fff",
          marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // Add margin for Android
        },
        overlayColor: "rgba(0,0,0,0.5)",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={currentUser?.role === "Shop" ? ARSHomeScreen : HomeScreen}
      />
      {currentUser?.role !== "Shop" ? (
        <Drawer.Screen name="Request" component={RequestRescueScreen} />
      ) : null}
      <Drawer.Screen name="Auto Repair Shops" component={ShopListScreen} />
      <Drawer.Screen name="Reviews" component={ReviewsScreen} />
      <Drawer.Screen name="Auto Repair Shop" component={AutoRepairShopScreen} />
      <Drawer.Screen name="Feedback" component={FeedbackScreen} />
      <Drawer.Screen name="Profile" component={UserProfile} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
