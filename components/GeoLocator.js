import PropTypes from "prop-types";
import * as Location from "expo-location";
import { actions as userLocationActions } from "../redux/map/userLocation";
import { useDispatch } from "react-redux";
import { Alert } from "react-native";
import { useEffect } from "react";

export default function GeoLocator({ children }) {
  const dispatch = useDispatch();
  let previousLatitude = null;
  let previousLongitude = null;

  useEffect(() => {
    let subscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Error",
          "Permission to access location was denied",
          [{ text: "OK" }]
        );
        dispatch(userLocationActions.resetLocation());
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 5, // Update every 10 meters
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;

          // Check if the location has changed significantly
          if (
            latitude !== previousLatitude ||
            longitude !== previousLongitude
          ) {
            dispatch(userLocationActions.setCurrentLocation(newLocation.coords));
            previousLatitude = latitude; // Update previous latitude
            previousLongitude = longitude; // Update previous longitude
          }
        }
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove(); // Clean up the subscription on unmount
      }
    };
  }, [dispatch]);

  return children; // Render children components
}

GeoLocator.propTypes = {
  children: PropTypes.node.isRequired,
};