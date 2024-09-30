import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const ShopAppBar = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>CarMedic</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('ChatList')}>
          <Ionicons name="chatbubble-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <View style={styles.container}>
      <ShopAppBar />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#000",
    zIndex: 1, // Ensure the app bar stays on top of other content
  },
  appBar: {
    position: "absolute", // Positioning the app bar at the top
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#000",
  },
  appTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    marginBottom: 40,
  },
  scrollViewContent: {
    paddingTop: Platform.OS === "android" ? 75 : 100, // Add padding to avoid content overlap
    paddingHorizontal: 20,
  },
  content: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
});

export default App;
