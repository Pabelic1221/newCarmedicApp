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
import { auth, firestore } from "../firebase"; // Ensure you have firestore imported
import { signOut } from "firebase/auth";
import { actions } from "../redux/user/user";
import { useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods

const DrawerContent = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({ firstName: "", lastName: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid; // Get the current user ID
      if (userId) {
        const userDoc = doc(firestore, "users", userId); // Adjust the collection name if necessary
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setUserData({ firstName: data.firstName, lastName: data.lastName });
        }
      }
    };
    fetchUserData();
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
          <Text style={styles.userName}>
            {userData.firstName} {userData.lastName}
          </Text>
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
    justifyContent: "center",
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
  userName: {
    fontSize: 18,
    color: "#808080",
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
    fontSize: 21,
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

export default DrawerContent;
