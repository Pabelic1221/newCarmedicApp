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
import { Marker } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import RequestTicket from "../components/modals/RequestTicket";
import { MapComponent } from "../components/map/MapComponent";
import { signOut } from "firebase/auth"; // Import signOut if needed
import { firestore } from "../firebase"; // Import Firestore instance
import { collection, onSnapshot } from "firebase/firestore"; // Import Firestore functions
import EndTicket from "../components/modals/endTicketModal";

const ARSHomeScreen = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]); // Local state for requests

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, "requests"), (snapshot) => {
      const requestList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(requestList); // Update state with new requests
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleRequestPress = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRequest(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ShopAppBar />

      <MapComponent>
        {requests.map((request) => {
          const { longitude, latitude } = request;
          if (longitude && latitude) {
            return (
              <Marker
                key={request.id}
                coordinate={{ longitude, latitude }}
                title={request.firstName} // Fixed typo from 'firs' to 'firstName'
                description={request.address}
                pinColor="purple"
              />
            );
          }
          return null;
        })}
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
        <ScrollView>
          {/* Render modal content only if a request is selected */}
          {selectedRequest ? (
            selectedRequest.state === "accepted" ? (
              <EndTicket request={selectedRequest} onClose={handleCloseModal} />
            ) : (
              <RequestTicket
                request={selectedRequest}
                onClose={handleCloseModal}
              />
            )
          ) : (
            <View>
              <Text>No request selected</Text>
            </View>
          )}
        </ScrollView>
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
