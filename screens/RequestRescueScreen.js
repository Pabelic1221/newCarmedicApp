import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AppBar from "./AppBar";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import { getAllShops } from "../redux/shops/shopsActions";
import { MapComponent } from "../components/map/MapComponent";
import { useNavigation } from "@react-navigation/native";
import { Marker, Polyline } from "react-native-maps";
import { debounce } from "lodash"; // Import lodash for debouncing

const RequestRescueScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedShop, setSelectedShop] = useState(null);
  const flatListRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]); // State for route coordinates
  const [isRequestAccepted, setIsRequestAccepted] = useState(false); // State to track if the request is accepted

  // Fetch all shops when the component is mounted and when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getAllShops());
    });

    // Initial fetch when the component mounts
    dispatch(getAllShops());

    return unsubscribe; // Cleanup the listener on unmount
  }, [navigation, dispatch]);

  const shops = useSelector((state) => state.shops.shops);
  const userLocation = useSelector((state) => state.userLocation.currentLocation); // Get user's current location

  // Debounce the map update function
  const updateMap = debounce(() => {
    // Logic to update the map with the current location
    // This could be a function that updates the state or triggers a re-render
  }, 1000); // Adjust the delay as needed

  useEffect(() => {
    if (userLocation) {
      updateMap(); // Call the debounced function
    }
  }, [userLocation]);

  // Handle marker press event
  const handleMarkerPress = (shop) => {
    setSelectedShop(shop);

    // Find the index of the selected shop in the shops array
    const index = shops.findIndex((s) => s.id === shop.id);

    // Scroll to the corresponding index in the FlatList
    if (flatListRef.current && index !== -1) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  // Render each shop item
  const renderItem = ({ item }) => (
    <View style={styles.shopItem}>
      <View style={styles.shopInfo}>
        <Image
          source={{ uri: "https://via.placeholder.com/50" }}
          style={styles.shopImage}
        />
        <View style={styles.shopDetails}>
          <Text style={styles.shopName}>{item.shopName}</Text>
          <Text style={styles.shopAddress}>{item.address}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.shopRating}>
              {item.averageRating?.toFixed(1) || "0.0"} ({item.reviewCount || 0}{" "}
              {item.reviewCount <= 2 ? "review" : "reviews"})
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.navigateButton}
        onPress={() => navigation.navigate("Auto Repair Shop", { item })}
      >
        <Ionicons name="arrow-forward" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppBar title="Request Rescue" />
      <MapComponent
        userLocation={userLocation}
        shops={shops}
        onMarkerPress={handleMarkerPress}
        routeCoordinates={routeCoordinates}
      />
      <FlatList
        ref={flatListRef}
        data={shops}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.shopList}
      />
    </SafeAreaView>
  );
};

export default RequestRescueScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  shopItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  shopInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  shopImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  shopAddress: {
    fontSize: 14,
    color: "#777",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  shopRating: {
    marginLeft: 5,
    fontSize: 14,
    color: "#777",
  },
  navigateButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
    marginLeft: 40,
  },
  shopList: {
    margin: 15,
  },
});