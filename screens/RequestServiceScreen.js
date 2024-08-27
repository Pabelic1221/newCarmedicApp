import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const RequestServiceScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to Request Service Screen</Text>
    </View>
  );
};

export default RequestServiceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
