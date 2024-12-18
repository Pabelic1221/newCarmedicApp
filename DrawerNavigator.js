import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar, Platform } from "react-native";
import { useSelector } from "react-redux";

// Screens
import HomeScreen from "./screens/HomeScreen";
import RequestRescueScreen from "./screens/RequestRescueScreen";
import AutoRepairShopScreen from "./screens/AutoRepairShopScreen";
import ReviewsScreen from "./screens/ReviewsScreen";
import FeedbackScreen from "./screens/FeedbackScreen";
import DrawerContent from "./screens/DrawerContent";
import ShopDrawerContent from "./screens/ShopDrawerContent"; // Import ShopDrawerContent
import UserProfile from "./screens/UserProfile";
import ARSHomeScreen from "./screens/ARSHomeScreen";
import ShopListScreen from "./screens/ShopListScreen";
import AppBar from "./screens/AppBar";
import TicketListener from "./components/map/Shops/TicketListener";
import Chat from "./screens/ChatScreen";
import ChatList from "./components/chat/ChatList";
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Drawer.Navigator
      // Conditionally choose between ShopDrawerContent and DrawerContent
      drawerContent={(props) =>
        currentUser?.role === "Shop" ? (
          <ShopDrawerContent {...props} />
        ) : (
          <DrawerContent {...props} />
        )
      }
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
      {/* Conditionally load screens based on the user's role */}
      <Drawer.Screen
        name="Home"
        component={
          currentUser?.role === "Shop"
            ? () => (
                <TicketListener>
                  <ARSHomeScreen />
                </TicketListener>
              )
            : HomeScreen
        }
      />
      {currentUser?.role !== "Shop" && (
        <Drawer.Screen name="Request" component={RequestRescueScreen} />
      )}
      <Drawer.Screen name="Auto Repair Shops" component={ShopListScreen} />
      <Drawer.Screen name="Reviews" component={ReviewsScreen} />
      <Drawer.Screen name="Auto Repair Shop" component={AutoRepairShopScreen} />
      <Drawer.Screen name="Feedback" component={FeedbackScreen} />
      <Drawer.Screen name="Chat Screen" component={Chat} />
      <Drawer.Screen name="Chat List" component={ChatList} />
      <Drawer.Screen name="Profile" component={UserProfile} />
      <Drawer.Screen name="AppBar" component={AppBar} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
