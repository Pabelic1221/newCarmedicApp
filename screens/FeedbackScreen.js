import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const FeedbackScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to Feedback Screen</Text>
    </View>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
