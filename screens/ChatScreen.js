import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { View, Text, AppState, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Appbar from './AppBar';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [shopName, setShopName] = useState('');
  const [shopStatus, setShopStatus] = useState('offline');
  const route = useRoute();
  const { shopId } = route.params;

  const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  useLayoutEffect(() => {
    if (!shopId) return;
    const shopRef = doc(db, 'shops', shopId);
    const unsubscribe = onSnapshot(shopRef, (docSnap) => {
      if (docSnap.exists()) {
        const shopData = docSnap.data();
        setShopName(shopData.shopName);
        setShopStatus(shopData.status);
      } else {
        console.log('No such shop found!');
      }
    });
    return () => unsubscribe();
  }, [shopId]);

  useLayoutEffect(() => {
    if (!shopId) return;
    const collectionRef = collection(db, 'chats', shopId, 'messages');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
    return unsubscribe;
  }, [shopId]);

  const onSend = useCallback((messages = []) => {
    if (!shopId) return;
    const newMessages = messages.filter(message => message.text.trim() !== ''); // Filter valid messages
    if (newMessages.length === 0) return; // Prevent sending empty messages
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );

    const { _id, createdAt, text, user } = newMessages[0];
    addDoc(collection(db, 'chats', shopId, 'messages'), {
      _id,
      createdAt,
      text,
      user,
    });
  }, [shopId]);

  const getStatusIcon = () => {
    switch (shopStatus) {
      case 'online':
        return <FontAwesome name="circle" size={12} color="green" />;
      case 'busy':
        return <FontAwesome name="circle" size={12} color="red" />;
      default:
        return <FontAwesome name="circle" size={12} color="gray" />;
    }
  };

  const handleAppStateChange = async (nextAppState) => {
    const shopRef = doc(db, 'shops', shopId);
    if (nextAppState === 'active') {
      await updateDoc(shopRef, {
        status: 'online',
      });
    } else {
      await updateDoc(shopRef, {
        status: 'offline',
      });
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar />
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.shopName}>{shopName}</Text>
          <View style={styles.statusIcon}>{getStatusIcon()}</View>
        </View>
        <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={false}
          showUserAvatar={false}
          onSend={messages => onSend(messages)}
          messagesContainerStyle={styles.messagesContainer}
          textInputStyle={styles.textInput}
          user={{
            _id: auth?.currentUser?.uid,
            avatar: 'https://i.pravatar.cc/300',
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  shopName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  statusIcon: {
    marginLeft: 10,
  },
  messagesContainer: {
    backgroundColor: '#fff',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
  },
});
