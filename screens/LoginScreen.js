import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  AppState,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../redux/user/userActions";
import { actions } from "../redux/user/user";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  // Function to update user status in Firestore
  const updateUserStatus = async (userId, status) => {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { status });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!user.emailVerified) {
          signOut(auth).then(() => {
            dispatch(actions.resetUser());
            Alert.alert("Email not verified", "Please verify your email before logging in.");
            navigation.replace("Login");
          });
        } else {
          dispatch(getCurrentUser(user));
          updateUserStatus(user.uid, "online"); // Set status to 'online' when the user is logged in
        }
      }
    });

    // AppState listener to track app background/foreground state
    const appStateListener = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        if (auth.currentUser) {
          updateUserStatus(auth.currentUser.uid, "offline"); // Set status to 'offline' when app is in background or inactive
        }
      } else if (nextAppState === "active") {
        if (auth.currentUser) {
          updateUserStatus(auth.currentUser.uid, "online"); // Set status to 'online' when app comes to foreground
        }
      }
    });

    if (currentUser) {
      navigation.replace("Main");
    }

    return () => {
      unsubscribe();
      appStateListener.remove(); // Remove app state listener
    };
  }, [navigation, dispatch, currentUser]);

  const handleLogin = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
  
      if (user.emailVerified) {
        // Check first in the 'users' collection
        let userDocRef = doc(db, "users", user.uid);
        let userDoc = await getDoc(userDocRef);
  
        if (!userDoc.exists()) {
          // If not found, check in the 'shops' collection
          userDocRef = doc(db, "shops", user.uid);
          userDoc = await getDoc(userDocRef);
        }
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User Data:", userData); // Log user data for debugging
  
          // Handle verification logic based on user role
          if (userData.role === "User") {
            if (!userData.verified) {
              Alert.alert("Account not verified", "Please verify your account before logging in.");
              await signOut(auth); // Sign out if not verified
              return; // Early exit
            }
          } else if (userData.role === "Shop") {
            // Additional logic for shops can go here if needed
            // e.g., you can update shop-specific fields or do other actions.
            // Ensure that the shop is verified if required
            if (!userData.verified) {
              Alert.alert("Shop account not verified", "Please verify your shop account before logging in.");
              await signOut(auth); // Sign out if not verified
              return; // Early exit
            }
          }
  
          await updateUserStatus(user.uid, "online"); // Set status to 'online'
          console.log("Logged in with:", user.email);
          navigation.replace("Main");
        } else {
          Alert.alert("User not found", "No user data found in Firestore.");
        }
      } else {
        Alert.alert("Email not verified", "Please verify your email before logging in.");
        await signOut(auth); // Ensure sign out completes
      }
    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message);
    }
  };
  
  
  const handleSignOut = async () => {
    if (auth.currentUser) {
      await updateUserStatus(auth.currentUser.uid, "offline"); // Update status to 'offline' on sign out
      await signOut(auth);
      dispatch(actions.resetUser());
      navigation.replace("Login");
    }
  };

  const handleSignUpNavigation = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/AutoRepairTransparent.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Sign In</Text>
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUpNavigation}
          style={styles.signUpTextContainer}
        >
          <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F7F7F7",
  },
  image: {
    width: 250,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  inputWrapper: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 5,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  signUpTextContainer: {
    marginTop: 20,
  },
  signUpText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
});
