import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import AppBar from './AppBar'; // Import AppBar component

const RequestScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AppBar/>
      <View style={styles.content}>
        < Text>Welcome to Request Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default RequestScreen;

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
