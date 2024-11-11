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
import { auth, db, storage } from "../firebase"; // Make sure to import storage
import Icon from "react-native-vector-icons/Ionicons";
import { doc, updateDoc } from "firebase/firestore";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { useSelector } from "react-redux";
import { getAddressFromCoordinates } from "../helpers/maps/getAddress";
import { launchImageLibrary } from "react-native-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UserProfile = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const currentUser  = useSelector((state) => state.user.currentUser );
  const { longitude, latitude } = useSelector(
    (state) => state.userLocation.currentLocation
  );

  useEffect(() => {
    const user = auth.currentUser ;
    if (user && currentUser .role === "User ") {
      setFirstName(currentUser .firstName);
      setLastName(currentUser .lastName);
      setEmail(currentUser .email);
      setAddress(currentUser .address);
      setProfileImage(currentUser .profileImage); // Assuming you have a profileImage field
    }
  }, []);

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

      // Update user profile data
      await updateDoc(userDocRef, {
        firstName,
        lastName,
        address,
        phone,
        profileImage, // Add profile image URL here
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name ="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>User  Profile</Text>
        </View>
        <TouchableOpacity onPress={handleImageUpload}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>Upload Image</Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
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
          editable={false}
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
        />
        <TextInput
          style={styles.input}
          placeholder="Old Password"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={handleUpdateProfile} style={styles.button}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholderText: {
    color: "#888",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UserProfile;