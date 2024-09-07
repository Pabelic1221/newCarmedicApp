import PropTypes from "prop-types";
import * as Location from "expo-location";
import { actions as userLocationActions } from "../redux/map/userLocation";
import { useDispatch } from "react-redux";
import { Alert } from "react-native";
import { useEffect } from "react";
export default function GeoLocator({ children }) {
  const dispatch = useDispatch();
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
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          dispatch(userLocationActions.setCurrentLocation(newLocation.coords));
        }
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [dispatch]);
  return children;
}
GeoLocator.propTypes = {
  children: PropTypes.node.isRequired,
};
