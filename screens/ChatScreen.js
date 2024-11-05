import React, {
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
} from "react";
import { View, Text, AppState, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Appbar from "./AppBar";
import { useSelector } from "react-redux";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [shopName, setRecieverName] = useState("");
  const [shopStatus, setRecieverStatus] = useState("offline");
  const route = useRoute();
  const { recieverId } = route.params;
  const { currentUser } = useSelector((state) => state.user);
  const senderId = auth.currentUser.uid;

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  // Fetch receiver's name and status
  useLayoutEffect(() => {
    if (!recieverId) return;

    const recieverRef =
      currentUser?.role === "Shop"
        ? doc(db, "users", recieverId)
        : doc(db, "shops", recieverId);

    const unsubscribe = onSnapshot(recieverRef, (docSnap) => {
      if (docSnap.exists()) {
        const recieverData = docSnap.data();
        const name =
          currentUser?.role === "Shop"
            ? `${recieverData.firstName} ${recieverData.lastName}`
            : recieverData.shopName;
        setRecieverName(name);
        setRecieverStatus(recieverData.status);
      } else {
        console.log("No such shop found!");
      }
    });

    return () => unsubscribe();
  }, [recieverId, currentUser?.role]);

  // Fetch messages for the chat with this receiver
  useLayoutEffect(() => {
    if (!recieverId) return;

    const senderMessagesRef = collection(db, "chats", senderId, "messages");
    const receiverMessagesRef = collection(db, "chats", recieverId, "messages");

    const qSender = query(senderMessagesRef, orderBy("createdAt", "desc"));
    const qReceiver = query(receiverMessagesRef, orderBy("createdAt", "desc"));

    const unsubscribeSender = onSnapshot(qSender, (querySnapshot) => {
      const senderMessagesData = querySnapshot.docs.map((doc) => ({
        _id: `sender_${doc.id}`, // Prefix with "sender_"
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      }));
      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, senderMessagesData)
      );
    });

    const unsubscribeReceiver = onSnapshot(qReceiver, (querySnapshot) => {
      const receiverMessagesData = querySnapshot.docs.map((doc) => ({
        _id: `receiver_${doc.id}`, // Prefix with "receiver_"
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      }));
      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, receiverMessagesData)
      );
    });

    return () => {
      unsubscribeSender();
      unsubscribeReceiver();
    };
  }, [recieverId]);

  // Send message to both sender and receiver's messages collections
  const onSend = useCallback(
    (messages = []) => {
      if (!recieverId) return;

      messages.forEach((msg) => {
        const { _id, createdAt, text, user } = msg;
        const messageData = {
          _id,
          createdAt,
          text,
          user,
        };
        addDoc(collection(db, "chats", recieverId, "messages"), messageData);
      });

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [recieverId, senderId]
  );

  const getStatusIcon = () => {
    const color =
      shopStatus === "online"
        ? "green"
        : shopStatus === "busy"
        ? "red"
        : "gray";
    return <FontAwesome name="circle" size={12} color={color} />;
  };

  const handleAppStateChange = async (nextAppState) => {
    const currentUserId = auth?.currentUser?.uid;
    if (!currentUserId) return;

    const userRole = currentUser?.role;
    const userDocRef =
      userRole === "Shop"
        ? doc(db, "shops", currentUserId)
        : doc(db, "users", currentUserId);

    await updateDoc(userDocRef, {
      status: nextAppState === "active" ? "online" : "offline",
    });
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
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
          onSend={(newMessages) => onSend(newMessages)}
          user={{
            _id: senderId,
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
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f2f2f2",
  },
  shopName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  statusIcon: {
    marginLeft: 10,
  },
});
