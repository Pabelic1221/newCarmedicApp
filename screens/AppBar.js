import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const AppBar = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>CarMedic</Text>
        <TouchableOpacity onPress={() => { /* Add Search Functionality */ }}>
          <Ionicons name="search" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Add padding for Android devices
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  appTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AppBar;
