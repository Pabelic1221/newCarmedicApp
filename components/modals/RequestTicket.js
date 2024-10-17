import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView, { Polyline, Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import axios from "axios";
import Constants from "expo-constants";

const GOOGLE_MAPS_API_KEY = Constants.expoConfig.extra.googleMapsApiKey;

export default function RequestTicket({ request, onClose }) {
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  // Fetch current user location from Redux
  const userLocation = useSelector(
    (state) => state.userLocation.currentLocation
  );

  // Function to fetch the route from OSRM
  const fetchRouteFromOSRM = async (origin, destination) => {
    const start = `${origin.longitude},${origin.latitude}`;
    const end = `${destination.longitude},${destination.latitude}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

    try {
      const response = await axios.get(url);
      const route = response.data.routes[0].geometry.coordinates;

      // Convert OSRM response [longitude, latitude] into Google Maps format {latitude, longitude}
      const coordinates = route.map(([lon, lat]) => ({
        latitude: lat,
        longitude: lon,
      }));

      setRouteCoordinates(coordinates);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  // Start navigation
  const handleAcceptRequest = () => {
    setIsNavigating(true);
    const destination = {
      latitude: request.latitude,
      longitude: request.longitude,
    };
    fetchRouteFromOSRM(userLocation, destination);
  };

  // Re-fetch route when userLocation changes
  useEffect(() => {
    if (isNavigating && userLocation) {
      const destination = {
        latitude: request.latitude,
        longitude: request.longitude,
      };
      fetchRouteFromOSRM(userLocation, destination);
    }
  }, [userLocation, isNavigating]);

  // Cancel navigation
  const handleCancelNavigation = async () => {
    setLoading(true);
    try {
      const requestDocRef = doc(db, "requests", request.id);
      await updateDoc(requestDocRef, { state: "pending" });
      setIsNavigating(false);
    } catch (error) {
      console.error(`Error updating request: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // End navigation
  const handleEndNavigation = async () => {
    setLoading(true);
    try {
      const requestDocRef = doc(db, "requests", request.id);
      await updateDoc(requestDocRef, { state: "accepted" });
      setIsNavigating(false);
      onClose();
    } catch (error) {
      console.error(`Error updating request: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Decline the request
  const handleDeclineRequest = async () => {
    setLoading(true);
    try {
      const requestDocRef = doc(db, "requests", request.id);
      await updateDoc(requestDocRef, { state: "declined" });
      onClose();
    } catch (error) {
      console.error(`Error declining request: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={true}
      onRequestClose={onClose}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.modalHeader}>Request Ticket</Text>
          <Text style={styles.label}>
            Name: {request.firstname} {request.lastname}
          </Text>
          <Text style={styles.label}>
            Car: {request.carBrand} {request.carModel}
          </Text>
          <Text style={styles.label}>Concern: {request.specificProblem}</Text>

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
                onPress={handleDeclineRequest}
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
                showsUserLocation={true}
              >
                <Marker
                  coordinate={{
                    latitude: request.latitude,
                    longitude: request.longitude,
                  }}
                  title="Destination"
                />

                {routeCoordinates.length > 0 && (
                  <Polyline
                    coordinates={routeCoordinates}
                    strokeColor="blue"
                    strokeWidth={3}
                  />
                )}
              </MapView>

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
