import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';

const ChatScreen = ({ chatId }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const db = getFirestore();
    const messagesRef = collection(db, `chats/${chatId}/messages`);

    useEffect(() => {
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, []);

    const sendMessage = async () => {
        if (input.trim()) {
            await addDoc(messagesRef, {
                text: input,
                senderId: 'currentUserId', // Replace with actual current user/shop ID
                timestamp: new Date(),
            });
            setInput('');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Text style={{ textAlign: item.senderId === 'currentUserId' ? 'right' : 'left' }}>
                        {item.text}
                    </Text>
                )}
            />
            <TextInput value={input} onChangeText={setInput} />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};

export default ChatScreen;
