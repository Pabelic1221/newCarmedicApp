import React, { useEffect } from "react";
import { Modal, SafeAreaView } from "react-native"; // Import AppBar component
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import RequestForm from "../components/modals/RequestForm";
import { useState } from "react";
import AppBar from "./AppBar";
const AutoRepairShopsScreen = () => {
  const route = useRoute();
  const [isModalVisible, setModalVisible] = useState(false);
  const handleOpenRequestModal = () => {
    setModalVisible(true);
  };

  const handleCloseRequestModal = () => {
    setModalVisible(false);
  };
  const shop = route.params.item;
  useEffect(() => {
    console.log(route.params);
  });

  return (
    <View style={styles.container}>
      <AppBar />
      <View style={styles.contentContainer}>
        <View style={styles.shopInfo}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/80" }} // Placeholder Image
              style={styles.shopImage}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.shopName}>{shop.shopName}</Text>
            <Text style={styles.shopAddress}>
              <Ionicons name="location-outline" size={16} color="gray" />
              {shop.address}
            </Text>
          </View>
        </View>
        {/** Dummy Data starts here*/}
        <View style={styles.detailsContainer}>
          <View style={styles.servicesContainer}>
            <Text style={styles.sectionTitle}>Services</Text>
            <Text style={styles.serviceItem}>Oil Change</Text>
            <Text style={styles.serviceItem}>Brake Repair</Text>
            <Text style={styles.serviceItem}>Engine Diagnostics</Text>
            <Text style={styles.serviceItem}>Tire Rotation</Text>
          </View>
          <View style={styles.reviewsContainer}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={18} color="gold" />
              <Ionicons name="star" size={18} color="gold" />
              <Ionicons name="star" size={18} color="gold" />
              <Ionicons name="star" size={18} color="gold" />
              <Ionicons name="star-half" size={18} color="gold" />
              <Text style={styles.ratingText}> 0</Text>
            </View>
            <Text style={styles.reviewCount}>(0 reviews)</Text>
          </View>
        </View>

        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text>
            <Ionicons name="call-outline" size={16} color="gray" /> (+63)
            123-1234
          </Text>
          {/** email*/}
          <Text>{shop.email}</Text>
        </View>
        {/**More Dummy Data */}
        <View style={styles.hoursContainer}>
          <Text style={styles.sectionTitle}>Hours</Text>
          <Text>
            <Ionicons name="time-outline" size={16} color="gray" /> Mon-Fri: 8am
            - 6pm
          </Text>
          <Text>Sat: 9am - 3pm</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.chatButton}>
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => handleOpenRequestModal()}
          >
            <Text style={styles.requestButtonText}>Request</Text>
          </TouchableOpacity>

          {/* Modal for Request Form */}

          <Modal
            visible={isModalVisible}
            onBackdropPress={handleCloseRequestModal}
            transparent={true}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <ScrollView>
                  <RequestForm shop={shop} onClose={handleCloseRequestModal} />
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#000", // Dark header background
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  contentContainer: {
    marginTop: 15,
    marginHorizontal: 10,
    flex: 1,
    padding: 16,
  },
  shopInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  imageContainer: {
    marginRight: 15,
  },
  shopImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ccc",
  },
  infoContainer: {
    flex: 1,
  },
  shopName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  shopAddress: {
    color: "gray",
    marginTop: 5,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  servicesContainer: {
    flex: 1,
  },
  reviewsContainer: {
    flex: 1,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  serviceItem: {
    color: "gray",
    marginBottom: 5,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
  },
  reviewCount: {
    color: "gray",
  },
  contactContainer: {
    marginBottom: 20,
  },
  hoursContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chatButton: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  chatButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  requestButton: {
    backgroundColor: "black",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    flex: 1,
  },
  requestButtonText: {
    color: "white",
    fontWeight: "bold",
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
export default AutoRepairShopsScreen;
