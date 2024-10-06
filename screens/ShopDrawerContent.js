import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { actions } from "../redux/user/user";
import { useDispatch } from "react-redux";
import { db } from "../firebase"; // Firestore database instance
import { doc, getDoc } from "firebase/firestore"; // Firestore functions

const ShopDrawerContent = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [shopName, setShopName] = useState(""); // State to hold shopName

  useEffect(() => {
    // Fetch the shopName from Firestore
    const fetchShopName = async () => {
      try {
        const shopDoc = await getDoc(doc(db, "shops", auth.currentUser.uid));
        if (shopDoc.exists()) {
          const shopData = shopDoc.data();
          setShopName(shopData.shopName); // Set shopName from Firestore
        }
      } catch (error) {
        console.error("Error fetching shopName: ", error);
      }
    };

    fetchShopName();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(actions.resetUser());
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: "https://via.placeholder.com/80" }}
          style={styles.profileImage}
        />
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate("UserProfile")}
        >
          {/* Replace email with shopName */}
          <Text style={styles.shopName}>{shopName || "Shop Name"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.drawerItemsContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.drawerItem}
        >
          <Text style={styles.drawerItemText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Request")}
          style={styles.drawerItem}
        >
          <Text style={styles.drawerItemText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Auto Repair Shops")}
          style={styles.drawerItem}
        >
          <Text style={styles.drawerItemText}>Auto Repair Shops</Text>
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
      <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
