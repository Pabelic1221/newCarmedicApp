import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, SafeAreaView } from 'react-native';
import { auth, db } from '../../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import ShopAppBar from '../../screens/ShopAppBar';

const ChatList = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const shopId = user.uid; // Get authenticated user's (shop) ID
        fetchChats(shopId);
      } else {
        console.error("User is not authenticated");
      }
    });

    // Unsubscribe from the auth listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const fetchChats = async (shopId) => {
    try {
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('shopId', '==', shopId),
        orderBy('latestMessageTimestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const chatList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setChats(chatList);
    } catch (error) {
      console.error("Error fetching chat data: ", error);
    }
  };

  const renderChatItem = ({ item }) => {
    return (
      <SafeAreaView style={styles.container}>
        <ShopAppBar />
        <View style={styles.chatItem}>
          <Image source={{ uri: item.userPhotoUrl }} style={styles.profileImage} />
          <View style={styles.chatDetails}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.latestMessage}>{item.latestMessage}</Text>
          </View>
          <Text style={styles.time}>{new Date(item.latestMessageTimestamp?.toDate()).toLocaleTimeString()}</Text>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={renderChatItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatDetails: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  latestMessage: {
    color: '#888',
  },
  time: {
    color: '#888',
  },
});

export default ChatList;