import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UserRegisterScreen from "./screens/UserRegisterScreen";
import ShopRegisterScreen from "./screens/ShopRegisterScreen";
import DrawerNavigator from "./DrawerNavigator"; // Import DrawerNavigator for main app navigation
import UserProfile from "./screens/UserProfile"; // Import UserProfile
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import GeoLocator from "./components/GeoLocator";
import AutoRepairShopsScreen from "./screens/AutoRepairShopScreen";
import { View, Text } from "react-native";
import TicketListener from "./components/map/Shops/TicketListener";
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
          <TicketListener>
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
                {/* Main App Navigation */}
                <Stack.Screen name="Main" component={DrawerNavigator} />

                {/* User Profile Screen */}
                <Stack.Screen name="UserProfile" component={UserProfile} />
              </Stack.Navigator>
            </NavigationContainer>
          </TicketListener>
        </GeoLocator>
      </PersistGate>
    </Provider>
  );
}
