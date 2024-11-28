import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, Modal, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import AppBar from "./AppBar";

const UserRequestLogScreen = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const currentUser  = useSelector((state) => state.user.currentUser );

  useEffect(() => {
    const fetchRequests = async () => {
      if (currentUser ) {
        const requestsRef = collection(db, "requests");
        const q = query(requestsRef, where("userId", "==", currentUser .id));
        const querySnapshot = await getDocs(q);

        // Fetch requests and sort them by timestamp
        const fetchedRequests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort requests by timestamp in descending order
        fetchedRequests.sort((a, b) => b.timestamp - a.timestamp);

        setRequests(fetchedRequests);
      }
    };

    fetchRequests();
  }, [currentUser ]);

  const renderRequestItem = ({ item }) => (
    <TouchableOpacity style={styles.requestItem} onPress={() => setSelectedRequest(item)}>
      <Text style={styles.requestTitle}>Requests Tickets</Text>
      <Text style={styles.requestDate}>
        Date: {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppBar />
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequestItem}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No previous requests found.</Text>}
      />

      {/* Modal for Request Details */}
      <Modal
        visible={selectedRequest !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedRequest(null)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedRequest && (
              <>
                <Text style={styles.modalHeader}>Request Details</Text>
                <Text style={styles.modalText}>Car Brand: {selectedRequest.carBrand}</Text>
                <Text style={styles.modalText}>Car Model: {selectedRequest.carModel}</Text>
                <Text style={styles.modalText}>Description: {selectedRequest.description}</Text>
                <Text style={styles.modalText}>Specific Problem: {selectedRequest.specificProblem}</Text>
                <Text style={styles.modalText}>Status: {selectedRequest.state}</Text>
                <Text style={styles.modalText}>Date: {new Date(selectedRequest.timestamp).toLocaleDateString()} {new Date(selectedRequest.timestamp).toLocaleTimeString()}</Text>
              </>
            )}
            <TouchableOpacity onPress={() => setSelectedRequest(null)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  requestItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  requestDate: {
    fontSize: 12,
    color: "#777",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
 modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UserRequestLogScreen;