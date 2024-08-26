import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !user.emailVerified) {
        // If the user is registered but not verified, sign them out
        signOut(auth);
        Alert.alert("Email not verified", "Please verify your email before logging in.");
      } else if (user && user.emailVerified) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      // Check if email is verified
      if (user.emailVerified) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().verified === false) {
          // Update Firestore to set verified to true
          await updateDoc(userDocRef, { verified: true });
        }

        console.log('Logged in with:', user.email);
        navigation.replace("Home");

      } else {
        Alert.alert("Email not verified", "Please verify your email before logging in.");
        signOut(auth); // Sign out the user if not verified
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignUpNavigation = () => {
    navigation.navigate("Register");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUpNavigation}
          style={styles.signUpTextContainer}
        >
          <Text style={styles.signUpText}>
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 5,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  signUpTextContainer: {
    marginTop: 20,
  },
  signUpText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
});
