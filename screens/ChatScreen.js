import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { View, Text, AppState } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/native';  // Added useRoute to get shopId from navigation params
import { AntDesign, FontAwesome } from '@expo/vector-icons';  // For status icon

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [shopName, setShopName] = useState('');
  const [shopStatus, setShopStatus] = useState('offline');  // Default to offline
  const navigation = useNavigation();
  const route = useRoute();  // Get route parameters

  // Fetch shopId from route params (ensure the screen navigating here passes the shopId)
  const { shopId } = route.params;

  const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  // Real-time listener for shop's name and status
  useLayoutEffect(() => {
    if (!shopId) return; // Prevent running without shopId

    const shopRef = doc(db, 'shops', shopId);

    const unsubscribe = onSnapshot(shopRef, (docSnap) => {
      if (docSnap.exists()) {
        const shopData = docSnap.data();
        setShopName(shopData.shopName);  // Update the shop's name
        setShopStatus(shopData.status);  // Update the shop's status in real-time
      } else {
        console.log('No such shop found!');
      }
    });

    return () => unsubscribe();  // Cleanup the listener when the component unmounts
  }, [shopId]);

  // Handle chat messages
  useLayoutEffect(() => {
    if (!shopId) return; // Ensure shopId is present before fetching messages

    const collectionRef = collection(db, 'chats', shopId, 'messages');  // Organized by shopId
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
    if (!shopId) return; // Prevent sending if shopId is missing

    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );
    
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(db, 'chats', shopId, 'messages'), {  // Save to a subcollection under shopId
      _id,
      createdAt,
      text,
      user,
    });
  }, [shopId]);

  // Function to get the status icon based on shop status
  const getStatusIcon = () => {
    switch (shopStatus) {
      case 'online':
        return <FontAwesome name="circle" size={12} color="green" />;  // Green for online
      case 'busy':
        return <FontAwesome name="circle" size={12} color="red" />;  // Red for busy
      default:
        return <FontAwesome name="circle" size={12} color="gray" />;  // Gray for offline
    }
  };

  // Update shop status based on app state
  const handleAppStateChange = async (nextAppState) => {
    const shopRef = doc(db, 'shops', shopId);
    if (nextAppState === 'active') {
      await updateDoc(shopRef, {
        status: 'online',
      });
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      await updateDoc(shopRef, {
        status: 'offline',
      });
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Clean up the listener when component unmounts
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Header with Shop's Name and Status */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#f2f2f2' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{shopName}</Text>
        <View style={{ marginLeft: 10 }}>{getStatusIcon()}</View>
      </View>

      {/* Chat Messages */}
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        onSend={messages => onSend(messages)}
        messagesContainerStyle={{ backgroundColor: '#fff' }}
        textInputStyle={{ backgroundColor: '#fff', borderRadius: 20 }}
        user={{
          _id: auth?.currentUser?.uid,  // Using UID instead of email for better identification
          avatar: 'https://i.pravatar.cc/300',  // Placeholder avatar, can be customized
        }}
      />
    </View>
  );
}
