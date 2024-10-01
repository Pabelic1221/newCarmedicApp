import React from "react";
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
const DrawerContent = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

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
          <Text style={styles.email}>{auth.currentUser?.email}</Text>
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
          <Text style={styles.drawerItemText}>Request</Text>
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
    justifyContent: "center", // Centers items vertically
  },
  userInfo: {
    marginBottom: 30,
    alignItems: "center",
  },
  profileImage: {
    marginTop: 30,
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: "#808080",
  },
  drawerItemsContainer: {
    flex: 0, // Change to 1 If you Want Good Spacing
    justifyContent: "center",
    marginHorizontal: 20,
  },
  drawerItem: {
    paddingVertical: 15,
    alignItems: "flex-start", // Align items to the left
    // borderBottomWidth: 1, // Removed separator lines
    // borderBottomColor: "#ddd",
  },
  drawerItemText: {
    fontSize: 21,
    color: "#808080",
    textAlign: "left", // Align text to the left
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

export default DrawerContent;
