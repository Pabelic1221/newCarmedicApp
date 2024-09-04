import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from "react-native";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import { getAddressFromCoordinates } from "../helpers/maps/getAddress";

const ShopRegisterScreen = ({ navigation }) => {
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  var location = useSelector((state) => state.userLocation.currentLocation);
  const [markerLocation, setMarkerLocation] = useState(null);

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    setMarkerLocation(coordinate);

    const address = await getAddressFromCoordinates(
      coordinate.latitude,
      coordinate.longitude
    );
    setAddress(address);
  };

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;

        // Send verification email
        await sendEmailVerification(user);

        // Add shop to Firestore

        await setDoc(doc(db, "shops", user.uid), {
          shopName: shopName,
          email: email,
          address: address,
          role: "Shop",
          verified: false,
          latitude: markerLocation.latitude,
          longitude: markerLocation.longitude,
        });

        // Alert and navigate back to login
        Alert.alert(
          "Registration Successful",
          "Verification email sent! Please verify your account before logging in.",
          [{ text: "OK", onPress: () => navigation.replace("Login") }]
        );
      })
      .catch((error) => alert(error.message));
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.appBar}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Register Auto Repair Shop</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={shopName}
            onChangeText={setShopName}
            placeholder="Shop Name"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
          />
          {location && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                showsUserLocation={true}
                onPress={handleMapPress}
                region={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                {markerLocation && (
                  <Marker
                    coordinate={markerLocation}
                    title="Selected Auto Repair Shop Location"
                    pinColor="red"
                  />
                )}
              </MapView>
            </View>
          )}

          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.signInText}>
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ShopRegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  mapContainer: {
    alignSelf: "center",
    padding: 20,
    width: 300,
    height: 400,
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f8f8f8",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 10,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  inputContainer: {
    marginTop: 60,
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  registerButton: {
    height: 50,
    backgroundColor: "#000",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  signInText: {
    color: "#777",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginVertical: 10,
  },
});
