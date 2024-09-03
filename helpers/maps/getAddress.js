import * as Location from "expo-location";

export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const addressArray = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    if (addressArray.length > 0) {
      const addressInfo = addressArray[0];
      const address =
        `${addressInfo.name ? addressInfo.name + ", " : ""}` +
        `${addressInfo.street ? addressInfo.street + ", " : ""}` +
        `${addressInfo.city ? addressInfo.city + ", " : ""}` +
        `${addressInfo.region ? addressInfo.region + ", " : ""}` +
        `${addressInfo.postalCode ? addressInfo.postalCode + ", " : ""}` +
        `${addressInfo.country ?? ""}`;
      const formattedAddress = address.trim().replace(/,\s*$/, "");
      return formattedAddress;
    } else {
      return "Address not found";
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error fetching address";
  }
};
