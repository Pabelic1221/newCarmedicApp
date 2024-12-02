import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Marker } from "react-native-maps";
import { MapComponent } from "../components/map/MapComponent";
import { uploadImageToCloudinary } from "../helpers/cloudinary";
import { getAddressFromCoordinates } from "../helpers/maps/getAddress";
import { Switch } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import ShopAppBar from "./ShopAppBar";
const predefinedSpecialties = [
  "Towing",
  "Jump Start",
  "Battery Delivery",
  "Flat Tire",
  "Fuel",
  "Overheating",
  "Brake Problem",
  "Lockout",
  "Change Oil",
  "Vehicle Maintenance",
];

const ShopProfile = () => {
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [ownerIdPic, setOwnerIdPic] = useState(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState({});
  const [customSpecialty, setCustomSpecialty] = useState("");
  const [customSpecialties, setCustomSpecialties] = useState([]);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const loadShopData = async () => {
      try {
        const shopId = auth.currentUser.uid;
        const shopDoc = await getDoc(doc(db, "shops", shopId));
        if (shopDoc.exists()) {
          const shopData = shopDoc.data();
          setShopName(shopData.shopName || "");
          setEmail(shopData.email || "");
          setAddress(shopData.address || "");
          setLatitude(shopData.latitude || null);
          setLongitude(shopData.longitude || null);
          setProfilePic(shopData.profilePicUrl || null);
          setOwnerIdPic(shopData.ownerIdPicUrl || null);

          const specialties = shopData.specialties || [];
          const initialSpecialties = {};
          const initialCustomSpecialties = [];

          specialties.forEach((spec) => {
            if (predefinedSpecialties.includes(spec)) {
              initialSpecialties[spec] = true;
            } else {
              initialCustomSpecialties.push(spec);
            }
          });

          setSelectedSpecialties(initialSpecialties);
          setCustomSpecialties(initialCustomSpecialties);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load shop data.");
      }
    };

    loadShopData();
  }, []);

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    setLatitude(coordinate.latitude);
    setLongitude(coordinate.longitude);

    const addr = await getAddressFromCoordinates(
      coordinate.latitude,
      coordinate.longitude
    );
    setAddress(addr);
    setIsEdited(true);
  };

  const handleImageUpload = async (setImage) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.didCancel && !result.error) {
      const uri = result.assets[0].uri;
      try {
        const uploadedUrl = await uploadImageToCloudinary(uri);
        setImage(uploadedUrl);
        setIsEdited(true);
      } catch (uploadError) {
        Alert.alert("Error", "Failed to upload image.");
      }
    }
  };

  const toggleSpecialty = (specialty) => {
    setSelectedSpecialties((prev) => ({
      ...prev,
      [specialty]: !prev[specialty],
    }));
    setIsEdited(true);
  };

  const addCustomSpecialty = () => {
    if (customSpecialty.trim()) {
      if (!customSpecialties.includes(customSpecialty)) {
        setCustomSpecialties((prev) => [...prev, customSpecialty]);
        setCustomSpecialty("");
        setIsEdited(true);
      } else {
        Alert.alert("Duplicate Specialty", "This specialty already exists.");
      }
    }
  };

  const handleUpdateProfile = async () => {
    const shopId = auth.currentUser.uid;
    try {
      const specialties = [
        ...Object.keys(selectedSpecialties).filter(
          (key) => selectedSpecialties[key]
        ),
        ...customSpecialties,
      ];
      await updateDoc(doc(db, "shops", shopId), {
        shopName,
        address,
        latitude,
        longitude,
        profilePicUrl: profilePic,
        ownerIdPicUrl: ownerIdPic,
        specialties,
      });

      Alert.alert("Success", "Shop profile updated successfully.");
      setIsEdited(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ShopAppBar />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={() => handleImageUpload(setProfilePic)}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Text>Upload Profile Pic</Text>
              </View>
            )}
            <View style={styles.imageLabel}>
              <Text>Profile Pic</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImageUpload(setOwnerIdPic)}>
            {ownerIdPic ? (
              <Image source={{ uri: ownerIdPic }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Text>Upload Owner ID Pic</Text>
              </View>
            )}
            <View style={styles.imageLabel}>
              <Text>ID Pic</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Shop Name"
          value={shopName}
          onChangeText={(value) => {
            setShopName(value);
            setIsEdited(true);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          editable={false}
        />
        <MapComponent onPress={handleMapPress}>
          {latitude && longitude && (
            <Marker
              coordinate={{ latitude, longitude }}
              title="Shop Location"
              pinColor="red"
            />
          )}
        </MapComponent>

        {/* Specialties Section */}
        <Text style={styles.sectionTitle}>Specialties</Text>
        {predefinedSpecialties.map((specialty) => (
          <View key={specialty} style={styles.specialtyRow}>
            <Text>{specialty}</Text>
            <Switch
              value={selectedSpecialties[specialty] || false}
              onValueChange={() => toggleSpecialty(specialty)}
            />
          </View>
        ))}
        <TextInput
          style={styles.input}
          placeholder="Add custom specialty"
          value={customSpecialty}
          onChangeText={setCustomSpecialty}
        />
        <TouchableOpacity style={styles.addButton} onPress={addCustomSpecialty}>
          <Text style={styles.addButtonText}>Add Specialty</Text>
        </TouchableOpacity>

        {/* Save Button */}
        {isEdited && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdateProfile}
          >
            <Text style={styles.saveButtonText}>SAVE</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContainer: {
    padding: 20,
  },
  imageSection: {
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,

    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    margin: 10,
  },
  placeholder: {
    width: 100,
    height: 100,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  imageLabel: {
    textAlign: "center",
    alignSelf: "center",
  },
  specialtyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ShopProfile;
