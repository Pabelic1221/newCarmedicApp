import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ShopListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to Shop List Screen</Text>
    </View>
  );
};

export default ShopListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
