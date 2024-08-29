import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import AppBar from './AppBar'; // Import AppBar component

const HomeScreen = () => {
  const navigation = useNavigation(); // Initialize navigation

  return (
    <SafeAreaView style={styles.container}>
      <AppBar />
      <View style={styles.content}>
        <Ionicons name="car-sport" size={100} color="#D9534F" />
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate('Request')} // Navigate to RequestScreen
          >
            <Text style={styles.gridTitle}>Request</Text>
            <Text style={styles.gridSubtitle}>Request a Service</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate('Auto Repair Shops')} // Navigate to AutoRepairShopScreen
          >
            <Text style={styles.gridTitle}>Auto Repair Shops</Text>
            <Text style={styles.gridSubtitle}>Browse and compare repair shops</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate('Reviews')} // Navigate to ReviewsScreen
          >
            <Text style={styles.gridTitle}>Reviews</Text>
            <Text style={styles.gridSubtitle}>Read and Write reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate('Feedback')} // Navigate to FeedbackScreen
          >
            <Text style={styles.gridTitle}>Feedback</Text>
            <Text style={styles.gridSubtitle}>Submit feedback about the app</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '45%',
    marginVertical: 10,
    elevation: 2,
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  gridSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
