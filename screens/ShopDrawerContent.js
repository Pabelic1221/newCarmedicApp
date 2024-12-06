import React, { memo, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { actions } from "../redux/user/user";
import { useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import {
  actions as requestActions,
  resetRequests,
} from "../redux/requests/requests";
import { actions as userLocationActions } from "../redux/map/userLocation";
import { resetShops, actions as shopsActions } from "../redux/shops/shops";

const ShopDrawerContent = memo((props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [shopName, setShopName] = useState(""); // State to hold shopName
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [shop, setShop] = useState({});
  useEffect(() => {
    const fetchShopName = async () => {
      const currentUser = auth.currentUser; // Get current user
      if (currentUser) {
        try {
          const shopDoc = await getDoc(doc(db, "shops", currentUser.uid));
          if (shopDoc.exists()) {
            const shopData = shopDoc.data();
            setShop((prev) => ({ ...prev, ...shopData }));
            setShopName(shopData.shopName); // Set shopName from Firestore
          }
        } catch (error) {
          console.error("Error fetching shopName: ", error);
        } finally {
          setLoading(false); // Stop loading after the fetch attempt
        }
      } else {
        setLoading(false); // Stop loading if no user is logged in
      }
    };

    fetchShopName();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(actions.resetUser());
        dispatch(resetRequests());
        dispatch(userLocationActions.resetLocation());
        dispatch(resetShops());
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          source={{
            uri: shop.profilePicUrl
              ? shop.profilePicUrl
              : "https://via.placeholder.com/80",
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate("ShopProfile")}
        >
          <Text style={styles.shopName}>{shopName || "Shop Name"}</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      ) : (
        <View style={styles.drawerItemsContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.drawerItem}
          >
            <Text style={styles.drawerItemText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Chat List")}
            style={styles.drawerItem}
          >
            <Text style={styles.drawerItemText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Reviews")}
            style={styles.drawerItem}
          >
            <Text style={styles.drawerItemText}>Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Feedback")}
            style={styles.drawerItem}
          >
            <Text style={styles.drawerItemText}>Feedback</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
});
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  userInfo: {
    marginBottom: 20,
    alignItems: "center",
  },
  profileImage: {
    marginTop: 50,
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  shopName: {
    fontSize: 20,
    color: "#000000",
  },
  drawerItemsContainer: {
    flex: 0,
    justifyContent: "center",
    marginHorizontal: 20,
  },
  drawerItem: {
    paddingVertical: 15,
    alignItems: "flex-start",
  },
  drawerItemText: {
    fontSize: 15,
    color: "#808080",
    textAlign: "left",
  },
  logoutButton: {
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 5,
    margin: 100,
    alignSelf: "center",
    width: "80%",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ShopDrawerContent;
