import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ReviewsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to Reviews Screen</Text>
    </View>
  );
};

export default ReviewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
