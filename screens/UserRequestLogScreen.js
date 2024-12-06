import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";
import AppBar from "./AppBar";
import { useNavigation } from "@react-navigation/native";
import { actions } from "../redux/requests/requests";

const UserRequestLogScreen = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleAcceptedRequest = async (item) => {
    try {
      const docRef = doc(db, "shopOnRescue", item.id);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const shopData = docSnapshot.data();
        if (shopData.state === "ongoing") {
          dispatch(actions.setShopLocation(shopData));
          navigation.navigate("OngoingRequest", { request: item });
        } else {
          console.log("The shop rescue is not ongoing.");
        }
      } else {
        console.log("No shop rescue found for this request ID.");
      }
    } catch (error) {
      console.error("Error fetching shop location:", error);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    // Listen for real-time updates to the user's requests
    const requestsRef = collection(db, "requests");
    const q = query(requestsRef, where("userId", "==", currentUser.id));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const fetchedRequests = [];

      for (const docSnap of querySnapshot.docs) {
        const requestData = docSnap.data();

        // Fetch shopName using the storeId
        const shopDocRef = doc(db, "shops", requestData.storeId);
        const shopDocSnap = await getDoc(shopDocRef);
        const shopName = shopDocSnap.exists()
          ? shopDocSnap.data().shopName
          : "Unknown Shop";

        fetchedRequests.push({
          id: docSnap.id,
          ...requestData,
          shopName, // Add the shopName to the request object
        });
      }

      // Sort requests by timestamp in descending order
      fetchedRequests.sort((a, b) => b.timestamp - a.timestamp);

      setRequests(fetchedRequests);
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, [currentUser]);

  const renderRequestItem = ({ item }) => (
    <TouchableOpacity
      style={styles.requestItem}
      onPress={async () => {
        if (item.state === "accepted") {
          await handleAcceptedRequest(item);
          return;
        }

        setSelectedRequest(item);
      }}
    >
      <Text style={styles.requestTitle}>{item.specificProblem} Request</Text>
      <Text style={styles.requestDate}>Shop: {item.shopName}</Text>
      <Text style={styles.requestDate}>
        Date: {new Date(item.timestamp).toLocaleDateString()}{" "}
        {new Date(item.timestamp).toLocaleTimeString()}
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
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No previous requests found.</Text>
        }
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
                <Text style={styles.modalText}>
                  Car Brand: {selectedRequest.carBrand}
                </Text>
                <Text style={styles.modalText}>
                  Car Model: {selectedRequest.carModel}
                </Text>
                <Text style={styles.modalText}>
                  Description: {selectedRequest.description}
                </Text>
                <Text style={styles.modalText}>
                  Specific Problem: {selectedRequest.specificProblem}
                </Text>
                <Text style={styles.modalText}>
                  Shop: {selectedRequest.shopName}
                </Text>
                <Text style={styles.modalText}>
                  Status: {selectedRequest.state}
                </Text>
                <Text style={styles.modalText}>
                  Date:{" "}
                  {new Date(selectedRequest.timestamp).toLocaleDateString()}{" "}
                  {new Date(selectedRequest.timestamp).toLocaleTimeString()}
                </Text>
              </>
            )}
            <TouchableOpacity
              onPress={() => {
                setSelectedRequest(null);
              }}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Same styles as before
});

export default UserRequestLogScreen;
