import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import AppBar from "./AppBar"; // Import AppBar component
import React, { useEffect, useState } from "react";
import { Marker } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import { getAllShops } from "../redux/shops/shopsActions";
import { MapComponent } from "../components/map/MapComponent";
import { useNavigation } from "@react-navigation/native";
const RequestRescueScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedShop, setSelectedShop] = useState(null);
  const handleShopPress = (shop) => {
    setSelectedShop(shop);
  };

  useEffect(() => {
    dispatch(getAllShops());
  }, [dispatch]);

  const shops = useSelector((state) => state.shops.shops);

  return (
    <SafeAreaView style={styles.container}>
      <AppBar />
      <MapComponent>
        {shops.map((shop) => {
          const { longitude, latitude } = shop;
          if (longitude && latitude) {
            return (
              <Marker
                key={shop.id}
                coordinate={{ longitude, latitude }}
                title={shop.shopName}
                description={shop.address}
                pinColor="purple"
              />
            );
          }
          return null;
        })}
      </MapComponent>
      <FlatList
        style={styles.shopList}
        data={shops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.shopItem}>
            <View style={styles.shopInfo}>
              <Image
                source={{ uri: "https://via.placeholder.com/50" }}
                style={styles.shopImage}
              />
              <View style={styles.shopDetails}>
                <Text style={styles.shopName}>{item.shopName}</Text>
                {/*need to style overflow*/}
                <Text style={styles.shopAddress}>{item.address}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={18} color="#FFD700" />

                  <Text style={styles.shopRating}>
                    {item.rating ?? 0.0} ({item.reviews ?? 0} reviews)
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.navigateButton}
              onPress={() => {
                navigation.navigate("Auto Repair Shop", {
                  item,
                });
              }}
            >
              <Ionicons name="arrow-forward" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        )}
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background with opacity
  },
  modalContent: {
    height: "70%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    overflow: "scroll",
  },
});
