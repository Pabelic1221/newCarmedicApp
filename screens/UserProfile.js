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
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { auth, db, storage } from "../firebase";
import Icon from "react-native-vector-icons/Ionicons";
import { doc, updateDoc } from "firebase/firestore";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { useSelector } from "react-redux";
import { launchImageLibrary } from "react-native-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AppBar from "./AppBar";

const UserProfile = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const currentUser  = useSelector((state) => state.user.currentUser );

  useEffect(() => {
    const user = auth.currentUser ;
    if (user && currentUser .role === "User ") {
      setFirstName(currentUser .firstName);
      setLastName(currentUser .lastName);
      setEmail(currentUser .email);
      setAddress(currentUser .address);
      setProfileImage(currentUser .profileImage);
    }
  }, [currentUser ]);

  const handleUpdateProfile = async () => {
    const user = auth.currentUser ;
    const userDocRef = doc(db, "users", user.uid);

    try {
      if (oldPassword && newPassword) {
        const credential = EmailAuthProvider.credential(
          user.email,
          oldPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
      }

      await updateDoc(userDocRef, {
        firstName,
        lastName,
        address,
        phone,
        profileImage,
      });
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleImageUpload = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
      console.log("User  cancelled image picker");
      return;
    } else if (result.error) {
      console.log("ImagePicker Error: ", result.error);
      return;
    }

    const uri = result.assets[0].uri;
    const response = await fetch(uri);
    const blob = await response.blob();
    const user = auth.currentUser ;

    const storageRef = ref(storage, `profileImages/${user.uid}`);
    uploadBytes(storageRef, blob).then(async (snapshot) => {
      const downloadURL = await getDownloadURL(snapshot.ref);
      setProfileImage(downloadURL);
      await updateDoc(doc(db, "users", user.uid), { profileImage: downloadURL });
      Alert.alert("Success", "Profile picture updated successfully.");
    }).catch(error => {
      Alert.alert("Error", error.message);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppBar />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={handleImageUpload}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Upload Image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value ={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={false} // Make email read-only
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
        
        {/* Button to navigate to UserRequestLogScreen */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('UserRequestLog')}
        >
          <Text style={styles.buttonText}>View Request Log</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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
    borderRadius: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UserProfile;