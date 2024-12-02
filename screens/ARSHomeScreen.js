import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import RequestTicket from "../components/modals/RequestTicket";
import EndTicket from "../components/modals/endTicketModal";
import ShopAppBar from "./ShopAppBar";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { getAllRequests } from "../redux/requests/requestsActions";
import { useNavigation } from "@react-navigation/native";
import TicketListener from "../components/map/Shops/TicketListener";
import { actions } from "../redux/requests/requests";
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid, Platform } from "react-native";

const ARSHomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const mapRef = useRef(null); // Step 1: Create the mapRef
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const requests = useSelector((state) => state.requests.requests);
  const userLocation = useSelector(
    (state) => state.userLocation.currentLocation
  );

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error("Location permission denied");
          return;
        }
      }

      Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(actions.setCurrentLocation({ latitude, longitude }));
        },
        (error) => console.error("Error watching position", error),
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
        }
      );
    };

    requestPermissions();
    dispatch(getAllRequests());

    return () => {
      Geolocation.stopObserving();
    };
  }, [dispatch]);

  const handleRequestPress = async (request) => {
    if (request.state === "accepted") {
      const destination = {
        latitude: request.latitude,
        longitude: request.longitude,
      };

      if (userLocation) {
        const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.longitude},${userLocation.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;

        try {
          const response = await axios.get(url);
          const route = response.data.routes[0].geometry.coordinates.map(
            ([lon, lat]) => ({
              latitude: lat,
              longitude: lon,
            })
          );

          dispatch(actions.setRequestLocation(destination));
          dispatch(actions.setRescueRoute(route));

          // Use mapRef to focus on the route
          mapRef.current.fitToCoordinates(route, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });

          navigation.navigate("OngoingRequest", { request });
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      } else {
        console.error("User location is not available");
      }
    } else {
      setSelectedRequest(request);
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRequest(null);
  };

  const renderMapView = () => {
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      return (
        <Text>Map loading... Please ensure location services are enabled.</Text>
      );
    }

    return (
      <MapView
        ref={mapRef} // Step 2: Attach mapRef
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
        moveOnMarkerPress={false}
        showsCompass={true}
        showsPointsOfInterest={false}
        provider="google"
      >
        {requests.map((request) => (
          <Marker
            key={request.id}
            coordinate={{
              latitude: request.latitude,
              longitude: request.longitude,
            }}
            title={request.firstName}
            description={request.specificProblem}
            pinColor="purple"
            onPress={() => handleRequestPress(request)}
          />
        ))}
      </MapView>
    );
  };

  return (
    <TicketListener>
      <SafeAreaView style={styles.container}>
        <ShopAppBar />
        {renderMapView()}
        <Text style={styles.heading}>Pending Requests</Text>
        <FlatList
          style={styles.requestList}
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <View style={styles.requestInfo}>
                <Image
                  source={{ uri: "https://via.placeholder.com/50" }}
                  style={styles.requestImage}
                />
                <View style={styles.requestDetails}>
                  <Text style={styles.requestName}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text style={styles.problemText}>
                    Concern: {item.specificProblem}
                  </Text>
                  <Text style={styles.statusText}>{item.state}</Text>
                </View>
              </View>
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
        <Modal
          visible={isModalVisible}
          onRequestClose={handleCloseModal}
          transparent={true}
          animationType="slide"
        >
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
        </Modal>
      </SafeAreaView>
    </TicketListener>
  );
};

export default ARSHomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  map: {
    alignSelf: "center",
    width: 300,
    height: 400,
    margin: 30,
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
