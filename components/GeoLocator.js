import * as Location from "expo-location";
import { Alert } from "react-native";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { actions as userLocationActions } from "../redux/map/userLocation";

export default function GeoLocator({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    let subscription;

    (async () => {
      // Request permission to access location
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

      // Start watching the position
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          if (newLocation.coords) {
            // Dispatch the new location to Redux store
            dispatch(userLocationActions.setCurrentLocation(newLocation.coords));
          } else {
            Alert.alert("Location Error", "Unable to retrieve location.");
          }
        }
      );
    })();

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [dispatch]);

  return children; // Render children components
}