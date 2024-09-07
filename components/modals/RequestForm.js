import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import RNPickerSelect from "react-native-picker-select";
import { auth, db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
export default function RequestForm({ shop, onClose }) {
  const [problem, setProblem] = useState("");
  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  const [description, setDescription] = useState("");
  const { longitude, latitude } = useSelector(
    (state) => state.userLocation.currentLocation
  );
  const handleSubmit = async () => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    try {
      // Reference to the 'requests' collection
      const requestsRef = collection(db, "requests");

      // Add a new document with a generated ID
      await addDoc(requestsRef, {
        userId,
        storeId: shop.id,
        specificProblem: problem,
        carBrand,
        carModel,
        description,
        state: "pending",
        longitude,
        latitude,
        timestamp: new Date().toISOString(),
      });

      Alert.alert("Request submitted successfully!");
      onClose();
    } catch (error) {
      Alert.alert("Error submitting request: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="close" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Request</Text>

      <Text style={styles.label}>Select Specific Problem</Text>
      <RNPickerSelect
        onValueChange={(value) => setProblem(value)}
        items={[
          { label: "Engine Issue", value: "engine" },
          { label: "Brake Issue", value: "brake" },
          { label: "Transmission Issue", value: "transmission" },
          // Add more items here
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: "Select", value: null }}
      />

      <Text style={styles.label}>Type of Car</Text>
      <TextInput
        style={styles.input}
        placeholder="Car Brand"
        value={carBrand}
        onChangeText={setCarBrand}
      />
      <TextInput
        style={styles.input}
        placeholder="Car Model"
        value={carModel}
        onChangeText={setCarModel}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Please Add Description..."
        value={description}
        onChangeText={setDescription}
        multiline={true}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Request</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "#000",
  },
  inputAndroid: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "#000",
  },
});
