import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions"; // To show the path
import { useSelector } from "react-redux";
import Constants from "expo-constants";
const GOOGLE_MAPS_API_KEY = Constants.expoConfig.extra.googleMapsApiKey;

export default function RequestTicket({ request, onClose }) {
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false); // Track if the navigation has started

  // Fetch current user location from Redux (assuming you're using it)
  const userLocation = useSelector(
    (state) => state.userLocation.currentLocation
  );

  // Start navigation, but don't update the status in Firestore yet
  const handleAcceptRequest = () => {
    setIsNavigating(true); // Start navigation
    console.log("Navigation started. Status not yet updated.");
  };

  // Cancel navigation and revert to pending status
  const handleCancelNavigation = async () => {
    setLoading(true);
    try {
      const requestDocRef = doc(db, "requests", request.id);
      await updateDoc(requestDocRef, { state: "pending" }); // Revert to pending
      setIsNavigating(false); // Stop navigation
      console.log("Navigation canceled and request reverted to pending");
    } catch (error) {
      console.error(`Error updating request: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // End navigation and then mark the request as accepted in Firestore
  const handleEndNavigation = async () => {
    setLoading(true);
    try {
      const requestDocRef = doc(db, "requests", request.id);
      await updateDoc(requestDocRef, { state: "accepted" }); // Mark as accepted
      setIsNavigating(false); // Stop navigation
      console.log("Navigation ended and request accepted");
      onClose(); // Close the modal after finishing navigation and updating status
    } catch (error) {
      console.error(`Error updating request: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Decline the request and update its state to 'declined' in Firestore
  const handleDeclineRequest = async () => {
    setLoading(true);
    try {
      const requestDocRef = doc(db, "requests", request.id);
      await updateDoc(requestDocRef, { state: "declined" }); // Set status to declined
      console.log("Request declined");
      onClose(); // Close the modal after declining
    } catch (error) {
      console.error(`Error declining request: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={true} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.modalHeader}>Request Ticket</Text>

          <Text style={styles.label}>
            Name:{" "}
            <Text style={styles.value}>
              {request.firstname} {request.lastname}
            </Text>
          </Text>
          <Text style={styles.label}>
            Car:{" "}
            <Text style={styles.value}>
              {request.carBrand} {request.carModel}
            </Text>
          </Text>
          <Text style={styles.label}>
            Concern:{" "}
            <Text style={styles.problemBadge}>{request.specificProblem}</Text>
          </Text>

          {!isNavigating ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={handleAcceptRequest}
                disabled={loading}
              >
                <Text style={styles.acceptButtonText}>Start Navigation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={handleDeclineRequest} // Decline request
                disabled={loading}
              >
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                {/* Show directions from current location to request location */}
                <MapViewDirections
                  origin={userLocation}
                  destination={{
                    latitude: request.latitude,
                    longitude: request.longitude,
                  }}
                  apikey={GOOGLE_MAPS_API_KEY}
                  strokeWidth={3}
                  strokeColor="blue"
                />
              </MapView>

              {/* Cancel/End Navigation Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={handleCancelNavigation}
                  disabled={loading}
                >
                  <Text style={styles.declineButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={handleEndNavigation}
                  disabled={loading}
                >
                  <Text style={styles.acceptButtonText}>End & Accept</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  value: {
    fontWeight: "bold",
    color: "#000",
  },
  problemBadge: {
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#FF6961",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "green",
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  declineButton: {
    flex: 1,
    backgroundColor: "red",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  declineButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  map: {
    width: "100%",
    height: 300,
    marginTop: 20,
  },
});
