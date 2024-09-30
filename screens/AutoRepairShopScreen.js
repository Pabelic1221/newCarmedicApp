import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import RequestForm from "../components/modals/RequestForm";
import ShopAppBar from "./ShopAppBar";

const AutoRepairShopsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
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

  const handleChatPress = () => {
    navigation.navigate('ChatScreen', { shopId: shop.id }); // Assuming each shop has a unique id
  };

  return (
    <View style={styles.container}>
      <ShopAppBar />
      <View style={styles.contentContainer}>
        <View style={styles.shopInfo}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/80" }}
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
        {/* Rest of the component code */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.requestButton}
            onPress={handleOpenRequestModal}
          >
            <Text style={styles.requestButtonText}>Request</Text>
          </TouchableOpacity>
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
