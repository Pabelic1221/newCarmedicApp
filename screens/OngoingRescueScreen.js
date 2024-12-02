import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView, Modal, Button, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../redux/map/userLocation";
import EndTicket from "../components/modals/endTicketModal";
// Helper to calculate distance using Haversine formula
const getDistance = (coord1, coord2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371000; // Earth's radius in meters
  const lat1 = toRad(coord1.latitude);
  const lon1 = toRad(coord1.longitude);
  const lat2 = toRad(coord2.latitude);
  const lon2 = toRad(coord2.longitude);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const OngoingRequestScreen = ({ route, navigation }) => {
  const { request } = route.params;
  const dispatch = useDispatch();

  const userLocation = useSelector(
    (state) => state.userLocation.currentLocation
  );
  const rescueRoute = useSelector((state) => state.requests.rescueRoute);
  const requestLocation = useSelector(
    (state) => state.requests.requestLocation
  );
  const shopLocation = useSelector((state) => state.requests.shopLocation);
  const destination =
    Object.keys(requestLocation).length > 0
      ? requestLocation
      : Object.keys(shopLocation).length > 0
      ? shopLocation
      : {};
  const [isModalVisible, setModalVisible] = useState(false);
  const lastLocation = useRef(userLocation); // Track the last location for distance calculations

  useEffect(() => {
    if (!destination || !Object.keys(destination).length) {
      navigation.goBack();
      return;
    }

    // Start listening to the user's location
    const watchId = Geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };

        // Calculate the distance from the last location
        const distance = getDistance(lastLocation.current, newLocation);

        if (distance > 100) {
          // Update the Redux store with the new user location
          dispatch(actions.setCurrentLocation(newLocation));

          // Update Firestore
          try {
            await firestore().collection("ongoingShopRescue").add({
              longitude,
              latitude,
              requestId: request.id,
              shopId: auth().currentUser.uid,
            });
            console.log("Location updated in Firestore");
          } catch (error) {
            console.error("Error posting location to Firestore:", error);
          }

          // Recalculate the rescue route
          const start = `${longitude},${latitude}`;
          const end = `${destination.longitude},${destination.latitude}`;
          const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

          try {
            const response = await axios.get(url);
            const updatedRoute =
              response.data.routes[0].geometry.coordinates.map(
                ([lon, lat]) => ({
                  latitude: lat,
                  longitude: lon,
                })
              );

            // Update the Redux store with the new route
            dispatch(actions.setRescueRoute(updatedRoute));
          } catch (error) {
            console.error("Error updating rescue route:", error);
          }

          // Update the last location
          lastLocation.current = newLocation;
        }
      },
      (error) => console.error("Error watching position:", error),
      { enableHighAccuracy: true, distanceFilter: 10 }
    );

    // Cleanup: Stop location tracking when component unmounts
    return () => Geolocation.clearWatch(watchId);
  }, [dispatch, destination]);

  const handleEndRequest = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={userLocation}
          title="Your Location"
          pinColor="blue"
        />
        <Marker
          coordinate={destination}
          title={request.firstName}
          description={request.specificProblem}
          pinColor="purple"
        />
        <Polyline
          coordinates={rescueRoute}
          strokeWidth={4}
          strokeColor="blue"
        />
      </MapView>
      <Button title="End Request" onPress={handleEndRequest} />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <EndTicket request={request} onClose={handleCloseModal} />
      </Modal>
    </SafeAreaView>
  );
};

export default OngoingRequestScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
