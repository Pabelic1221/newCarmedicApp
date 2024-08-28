import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import AppBar from './AppBar'; // Import AppBar component

const AutoRepairShopsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AppBar/>
      <View style={styles.content}>
        < Text>Welcome to Auto Repair Shop Screen</Text>
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
});
export default AutoRepairShopsScreen;
