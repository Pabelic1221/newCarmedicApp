import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase';
import { signOut } from "firebase/auth";

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch(error => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('RequestService')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Request Service</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('ShopList')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Auto Repair Shops</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Reviews')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Reviews</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Feedback')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Feedback</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSignOut}
        style={[styles.button, { backgroundColor: 'red' }]}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
