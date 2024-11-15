import "dotenv/config";

export default ({ config }) => ({
  ...config,
  android: {
    package: "com.capstone.carmedic", // Replace with your actual package name
  },
  extra: {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    apiUrl: process.env.API_URL,
    eas: {
      projectId: "1bdb80db-1c2f-4058-8e0a-3cbcb3bf9c64"
    },
  },
});
