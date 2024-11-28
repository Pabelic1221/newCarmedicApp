import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase"; // Ensure you have your Firebase setup
import { useSelector } from "react-redux";
import { launchImageLibrary } from "react-native-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import AppBar from "./AppBar"; // Import your AppBar component

const ShopProfile = () => {
  const navigation = useNavigation();
  const [shopName, setShopName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isEdited, setIsEdited] = useState(false); // State to track if fields are edited
  const currentUser  = useSelector((state) => state.user.currentUser ); // Get current user from Redux

  useEffect(() => {
    // Load current shop data if available
    if (currentUser ) {
      setProfileImage(currentUser .profileImage || null);
      setShopName(currentUser .shopName || "");
      setContact(currentUser .contact || "");
      setAddress(currentUser .address || "");
    }
  }, [currentUser ]);

  const handleImageUpload = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 1,
    });

    if (!result.didCancel && !result.error) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      setIsEdited(true); // Mark as edited
    }
  };

  const handleUpdateProfile = async () => {
    const shopDocRef = doc(db, "shops", auth.currentUser .uid);
    try {
      await updateDoc(shopDocRef, {
        shopName,
        contact,
        address,
        profileImage,
      });
      Alert.alert("Success", "Profile updated successfully.");
      setIsEdited(false); // Reset edited state after saving
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Function to handle input changes and set edited state
  const handleInputChange = (setter) => (value) => {
    setter(value);
    setIsEdited(true); // Mark as edited
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppBar /> {/* Include the AppBar at the top */}
  
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.innerContainer}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={handleImageUpload}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                {/* Ensure this text is wrapped in a <Text> component */}
                <Text style={styles.placeholderText}>Upload Image</Text>
              </View>
            )}
          </TouchableOpacity>
          {/* Wrap any other strings in <Text> components */}
          <Text style={styles.placeholderText}>Profile Picture: Tap to change</Text>
        </View>
        
        {/* Input Fields */}
        <TextInput style={styles.input} placeholder="Shop Name" value={shopName} onChangeText={handleInputChange(setShopName)} />
        <TextInput style={styles.input} placeholder="Contact" value={contact} onChangeText={handleInputChange(setContact)} />
        <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={handleInputChange(setAddress)} />
        
        {/* Conditionally render the Save Button */}
        {isEdited && (
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>SAVE</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    padding: 16,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  placeholderText: {
    color: "#888",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ShopProfile;