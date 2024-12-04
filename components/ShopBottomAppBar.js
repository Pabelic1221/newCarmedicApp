import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ShopBottomAppBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("ShopHome")}
      >
        <Ionicons name="home" size={24} color="#fff" />
        <Text style={styles.iconText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("ChatList")}
      >
        <Ionicons name="chatbubbles" size={24} color="#fff" />
        <Text style={styles.iconText}>Messages</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("Reviews")}
      >
        <Ionicons name="star" size={24} color="#fff" />
        <Text style={styles.iconText}>Reviews</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("Feedback")}
      >
        <Ionicons name="megaphone" size={24} color="#fff" />
        <Text style={styles.iconText}>Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#000",
    height: 60,
    paddingVertical: 10,
    position: "absolute", // Fixes it to a position
    bottom: 0, // Anchors to the bottom
    width: "100%", // Full width
  },
  iconContainer: {
    alignItems: "center",
  },
  iconText: {
    color: "#fff",
    fontSize: 12,
  },
});

export default ShopBottomAppBar;
