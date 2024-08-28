import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen'; 
import RequestScreen from './screens/RequestScreen';
import AutoRepairShopScreen from './screens/AutoRepairShopScreen';
import ReviewsScreen from './screens/ReviewsScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import DrawerContent from './screens/DrawerContent'; 

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator 
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // Hide headers
        drawerType: 'front', // Drawer overlays on top of the screen
        drawerStyle: {
          width: 250, // Adjust width as needed
          backgroundColor: '#fff',
          position: 'absolute', // Ensure drawer is positioned absolutely
        },
        overlayColor: 'rgba(0,0,0,0.5)', // Optional: Color of the overlay behind the drawer
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Request" component={RequestScreen} />
      <Drawer.Screen name="Auto Repair Shops" component={AutoRepairShopScreen} />
      <Drawer.Screen name="Reviews" component={ReviewsScreen} />
      <Drawer.Screen name="Feedback" component={FeedbackScreen} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
