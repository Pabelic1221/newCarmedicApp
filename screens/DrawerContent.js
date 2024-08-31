import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const DrawerContent = (props) => {
  const navigation = useNavigation();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch(error => alert(error.message));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => navigation.navigate("UserProfile")}
      >
        <Text style={styles.email}>
          {auth.currentUser?.email}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Request")}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>Request</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Auto Repair Shops")}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>Auto Repair Shops</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Reviews")}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>Reviews</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Feedback")}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  userInfo: {
    marginBottom: 20,
    alignItems: 'center',
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#808080',
  },
  drawerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  drawerItemText: {
    fontSize: 18,
    color: '#808080',
    textAlign: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#f00',
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DrawerContent;
