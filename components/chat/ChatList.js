import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { auth, db } from '../../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

const ChatList = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const shopId = auth.currentUser.uid; // Assuming the shop is authenticated
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('shopId', '==', shopId), orderBy('latestMessageTimestamp', 'desc'));

      const querySnapshot = await getDocs(q);
      const chatList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setChats(chatList);
    };

    fetchChats();
  }, []);

  const renderChatItem = ({ item }) => {
    return (
      <View style={styles.chatItem}>
        <Image source={{ uri: item.userPhotoUrl }} style={styles.profileImage} />
        <View style={styles.chatDetails}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.latestMessage}>{item.latestMessage}</Text>
        </View>
        <Text style={styles.time}>{new Date(item.latestMessageTimestamp?.toDate()).toLocaleTimeString()}</Text>
      </View>
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
