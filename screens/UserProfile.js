import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import Icon from 'react-native-vector-icons/Ionicons';

const UserProfile = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const nameParts = user.displayName ? user.displayName.split(' ') : ['', ''];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts[1] || '');
      setEmail(user.email || '');
      // Fetch address and phone from Firestore if needed
    }
  }, []);

  const handleUpdateProfile = () => {
    // Implement update logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>User Profile</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
          />
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
          />
          <TextInput
            style={styles.input}
            value={email}
            editable={false} // Email shouldn't be editable
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
          />
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
          />
          <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  innerContainer: {
    flex: 1,
    padding: 10,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 60, // Increased height
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  button: {
    height: 60, // Increased height to match input fields
    backgroundColor: '#000',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default UserProfile;
