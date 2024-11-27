import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import ShopAppBar from "./ShopAppBar"; // Import AppBar component
import React, { useEffect, useState } from "react";
import { Marker, Polyline } from "react-native-maps"; // Import Polyline
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import RequestTicket from "../components/modals/RequestTicket";
import { MapComponent } from "../components/map/MapComponent";
import { getAllRequests } from "../redux/requests/requestsActions";
import EndTicket from "../components/modals/endTicketModal";
import axios from "axios"; // Import axios for API requests
import { useIsFocused } from '@react-navigation/native';

const ARSHomeScreen = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]); // State for route coordinates

  useEffect(() => {
    dispatch(getAllRequests());
  }, [dispatch]);

  const requests = useSelector((state) => state.requests.requests);
  const userLocation = useSelector((state) => state.userLocation.currentLocation); // Get user's current location

  const handleRequestPress = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRequest(null);
    setRouteCoordinates([]); // Reset route coordinates when closing the modal
  };

  // Function to fetch route coordinates
  const fetchRouteCoordinates = async (origin, destination) => {
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

      setRouteCoordinates(coordinates); // Update state with new route coordinates
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  // Accept request and fetch route coordinates
  const handleAcceptRequest = () => {
    if (selectedRequest) {
      const destination = {
        latitude: selectedRequest.latitude,
        longitude: selectedRequest.longitude,
      };
      fetchRouteCoordinates(userLocation, destination); // Fetch route coordinates
      setModalVisible(false); // Close the modal
    }
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={{ zIndex: 999 }}>
        <ShopAppBar />
      </View>

      <MapComponent>
        {requests.map((request) => {
          const { longitude, latitude } = request;
          if (longitude && latitude) {
            return (
              <Marker
                key={request.id}
                coordinate={{ longitude, latitude }}
                title={request.firstName}
                description={request.specificProblem}
                pinColor="purple"
                onPress={() => handleRequestPress(request)} // Open modal on marker press
              />
            );
          }
          return null;
        })}
        {/* Render polyline if routeCoordinates are available */}
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeColor="blue" strokeWidth={3} />
        )}
      </MapComponent>

      <Text style={styles.heading}>Pending Requests</Text>

      <FlatList
        style={styles.requestList}
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <View style={styles.requestInfo}>
              {/* Circular Placeholder for Avatar */}
              <Image
                source={{ uri: "https://via.placeholder.com/50" }}
                style={styles.requestImage}
              />
              <View style={styles.requestDetails}>
                {/* User's Name */}
                <Text style={styles.requestName}>
                  {item.firstName} {item.lastName}
                </Text>

                {/* Problem Description */}
                <Text style={styles.problemText}>
                  Concern: {item.specificProblem}
                </Text>

                {/* Request Status */}
                <Text style={styles.statusText}>{item.state}</Text>
              </View>
            </View>

            {/* Button to Navigate to Request Details */}
            <TouchableOpacity
              style={styles.navigateButton}
              onPress={() => {
                handleRequestPress(item);
              }}
            >
              <Ionicons name="arrow-forward" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal for Request Form */}
      <Modal
        visible={isModalVisible}
        onRequestClose={handleCloseModal} // This ensures that the modal can be closed by back press on Android
        transparent={true}
        animationType="slide"
      >
        {/* Render modal content only if a request is selected */}
        {selectedRequest ? (
          selectedRequest.state === "accepted" ? (
            <EndTicket request={selectedRequest} onClose={handleCloseModal} />
          ) : (
            <RequestTicket
              request={selectedRequest}
              onClose={handleCloseModal}
              onAcceptRequest={handleAcceptRequest} // Pass the accept function to RequestTicket
            />
          )
        ) : (
          <View>
            <Text>No request selected</Text>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default ARSHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  map: {
    height: 200,
    width: "100%",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "#333",
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  requestInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  requestImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  requestDetails: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  problemText: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  statusText: {
    fontSize: 14,
    color: "orange", // You can change the color based on status (e.g., 'pending', 'resolved')
    marginTop: 4,
  },
  navigateButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
    marginLeft: 10,
  },
  requestList: {
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background with opacity
  },
  modalContent: {
    height: "70%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    overflow: "scroll",
  },
});