import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore"; // Firestore update function
import Ionicons from "react-native-vector-icons/Ionicons";
export default function RequestTicket({ request, onClose }) {
  const [loading, setLoading] = useState(false);

  // Accept the request and update its state in Firestore

  // Reject the request and update its state in Firestore
  const handleRequest = async (state) => {
    setLoading(true);
    try {
      const requestDocRef = doc(db, "requests", request.id);
      await updateDoc(requestDocRef, {
        state,
      });
      console.log("Request rejected");
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error rejecting request: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={true} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {/* Close button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          {/* Modal Header */}
          <Text style={styles.modalHeader}>Request Ticket</Text>

          {/* Request Details */}
          <Text style={styles.label}>
            Name:{" "}
            <Text style={styles.value}>
              {request.firstname} {request.lastname}
            </Text>
          </Text>
          <Text style={styles.label}>
            Contact: <Text style={styles.value}>{request.phone || "N/A"}</Text>
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
          <Text style={styles.label}>
            Other Description:{" "}
            <Text style={styles.value}>{request.description || "N/A"}</Text>
          </Text>
          <Text style={styles.label}>
            Status: <Text style={styles.statusBadge}>{request.state}</Text>
          </Text>

          {/* Accept and Decline Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleRequest("accepted")}
              disabled={loading}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={handleRequest("declined")}
              disabled={loading}
            >
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
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
  statusBadge: {
    fontWeight: "bold",
    color: "orange",
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
});
