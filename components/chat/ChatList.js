import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  collectionGroup,
  doc,
  getDoc,
  limit,
} from "firebase/firestore";
import { useSelector } from "react-redux";

import AppBar from "../../screens/AppBar"; // Import AppBar component
import { useNavigation } from "@react-navigation/native";

const ChatList = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const { currentUser } = useSelector((state) => state.user); // Access current user from Redux
  useEffect(() => {
    const loadChats = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        await fetchChats(userId);
      } else {
        console.error("User is not authenticated");
      }
    };
    loadChats();
  }, []);
  const fetchChats = async (userId) => {
    try {
      const chatList = [];
      const seenReceiverIds = new Set(); // Track unique receiver IDs

      // Reference to the "messages" collection group
      const messagesRef = collectionGroup(db, "messages"); // Target all "messages" subcollections

      // Retrieve all documents in the "messages" collection groups
      const querySnapshot = await getDocs(messagesRef);

      for (const chatDoc of querySnapshot.docs) {
        const receiverId =
          currentUser.role === "Shop"
            ? chatDoc.data().user._id
            : chatDoc.ref.parent.parent.id;

        // Skip if we've already processed this receiverId
        if (seenReceiverIds.has(receiverId)) {
          continue;
        }

        // Add receiverId to the set of seen IDs
        seenReceiverIds.add(receiverId);

        // Fetch the latest message from the `messages` sub-collection
        const messagesRef = collection(
          db,
          `chats/${
            currentUser.role === "Shop" ? auth.currentUser?.uid : receiverId
          }/messages`
        );
        const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));
        const messageSnapshot = await getDocs(q);

        if (!messageSnapshot.empty) {
          const latestMessageDoc = messageSnapshot.docs[0];
          const latestMessageData = latestMessageDoc.data();

          // Prefix "You: " if the message was sent by the current user
          const messageText =
            latestMessageData.user._id === userId
              ? `You: ${latestMessageData.text}`
              : latestMessageData.text;

          // Retrieve receiver's details from the appropriate collection based on role
          const receiverRef =
            currentUser?.role === "Shop"
              ? doc(db, "users", receiverId)
              : doc(db, "shops", receiverId);

          const receiverSnap = await getDoc(receiverRef);

          if (receiverSnap.exists()) {
            const receiverData = receiverSnap.data();
            chatList.push({
              id: receiverId, // Unique ID for each chat item
              userName: receiverData.firstName
                ? `${receiverData.firstName} ${receiverData.lastName}`
                : receiverData.shopName,
              userPhotoUrl: receiverData.photoUrl || "",
              latestMessage: messageText,
              latestMessageTimestamp: latestMessageData.createdAt,
            });
          }
        }
      }

      setChats(chatList);
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Chat Screen", { recieverId: item.id })
      }
    >
      <View style={styles.chatItem}>
        <Image
          source={{ uri: item.userPhotoUrl }}
          style={styles.profileImage}
        />
        <View style={styles.chatDetails}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.latestMessage}>{item.latestMessage}</Text>
        </View>
        <Text style={styles.time}>
          {new Date(item.latestMessageTimestamp?.toDate()).toLocaleTimeString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <AppBar />
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    fontWeight: "bold",
    fontSize: 16,
  },
  latestMessage: {
    color: "#888",
  },
  time: {
    color: "#888",
  },
});

export default ChatList;
