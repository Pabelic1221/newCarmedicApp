import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Car Icon */}
      <Image
        source={require('../assets/AutoRepairTransparent.png')}
        style={styles.icon}
      />

      {/* Register Text */}
      <Text style={styles.registerText}>Register</Text>

      {/* Register as Vehicle Owner Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserRegistration')}
      >
        <Text style={styles.buttonText}>Register as a Vehicle Owner</Text>
      </TouchableOpacity>

      {/* Register as Auto Repair Shop Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ShopRegistration')}
      >
        <Text style={styles.buttonText}>Register as an Auto Repair Shop</Text>
      </TouchableOpacity>

      {/* Sign In Text */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signInText}>Dont have an Account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0', // Light grey background
  },
  icon: {
    width: 400, // Adjust to your needs
    height: 400, // Adjust to your needs
    marginBottom: 20,
    borderRadius: 5
  },
  registerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
  signInText: {
    color: 'black',
    marginTop: 20,
  },
});

export default RegisterScreen;
