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
  collectionGroup,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AppBar from "../../screens/AppBar";
import ShopAppBar from "../../screens/ShopAppBar";

const ChatList = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

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
      const seenUserIds = new Set();

      // Fetch all messages where the user is either the sender or receiver
      const messagesRef = collectionGroup(db, "messages");
      const allMessagesQuery = query(messagesRef, orderBy("createdAt", "desc"));
      const allMessagesSnapshot = await getDocs(allMessagesQuery);

      // Loop through each message
      for (const msgDoc of allMessagesSnapshot.docs) {
        const messageData = msgDoc.data();
        const senderId = messageData.user._id; // Sender's ID
        const receiverId = msgDoc.ref.parent.parent.id; // Receiver's ID

        // Determine if current user is sender or receiver
        const isUserSender = senderId === userId;
        const chatPartnerId = isUserSender ? receiverId : senderId;

        // Skip if this chat partner is already processed
        if (seenUserIds.has(chatPartnerId)) continue;

        seenUserIds.add(chatPartnerId);

        // Check if currentUser exists before accessing its role
        if (!currentUser) {
          console.error("Current user is not defined");
          return;
        }

        // Fetch chat partner profile
        const partnerRef =
          currentUser.role === "Shop"
            ? doc(db, "users", chatPartnerId)
            : doc(db, "shops", chatPartnerId);

        const partnerSnap = await getDoc(partnerRef);

        if (partnerSnap.exists()) {
          const partnerData = partnerSnap.data();
          chatList.push({
            id: chatPartnerId,
            userName: partnerData.firstName
              ? `${partnerData.firstName} ${partnerData.lastName}`
              : partnerData.shopName,
            userPhotoUrl: partnerData.photoUrl || "",
            latestMessage: isUserSender
              ? `You: ${messageData.text}`
              : messageData.text,
            latestMessageTimestamp: messageData.createdAt,
          });
        }
      }

      // Sort chatList by latestMessageTimestamp in descending order
      chatList.sort(
        (a, b) =>
          b.latestMessageTimestamp.toMillis() -
          a.latestMessageTimestamp.toMillis()
      );

      setChats(chatList);
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        console.log(item.id);
        navigation.navigate("Chat Screen", { receiverId: item.id });
      }}
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
      {/* Check if currentUser is defined before rendering AppBar */}
      <View style={{ zIndex: 999 }}>
        {currentUser.role === "Shop" ? <ShopAppBar /> : <AppBar />}
      </View>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
