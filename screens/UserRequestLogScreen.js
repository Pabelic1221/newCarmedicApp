import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native"; // Import SafeAreaView
import { useSelector } from "react-redux";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import AppBar from "./AppBar";

const UserRequestLogScreen = () => {
  const [requests, setRequests] = useState([]);
  const currentUser   = useSelector((state) => state.user.currentUser  );

  useEffect(() => {
    const fetchRequests = async () => {
      if (currentUser  ) {
        const requestsRef = collection(db, "requests");
        const q = query(requestsRef, where("userId", "==", currentUser  .id));
        const querySnapshot = await getDocs(q);

        const fetchedRequests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRequests(fetchedRequests);
      }
    };

    fetchRequests();
  }, [currentUser  ]);

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>Car Brand: {item.carBrand}</Text>
      <Text style={styles.requestText}>Car Model: {item.carModel}</Text>
      <Text style={styles.requestText}>Description: {item.description}</Text>
      <Text style={styles.requestText}>Specific Problem: {item.specificProblem}</Text>
      <Text style={styles.requestText}>Status: {item.state}</Text>
      <Text style={styles.requestText}>Date: {new Date(item.timestamp).toLocaleDateString()}</Text>
      <Text style={styles.requestText}>Location: {item.latitude}, {item.longitude}</Text>
    </View>
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
  requestText: {
    fontSize: 16,
    color: "#333",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginTop: 20,
  },
});

export default UserRequestLogScreen;