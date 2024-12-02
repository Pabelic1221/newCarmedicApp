import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { useSelector } from "react-redux";
export const MapComponent = ({ children, ...props }) => {
  const { latitude, longitude } = useSelector(
    (state) => state.userLocation.currentLocation
  );
  if (!longitude || !latitude) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading map...</Text>
      </View>
    );
  }
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        {...props}
      >
        {children}
      </MapView>
    </View>
  );
};

MapComponent.propTypes = {
  children: PropTypes.node,
};

const styles = StyleSheet.create({
  mapContainer: {
    alignSelf: "center",
    width: 300,
    height: 400,
    margin: 30,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
