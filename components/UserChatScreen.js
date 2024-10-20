import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import io from "socket.io-client";

const UserChatScreen = ({ route, navigation }) => {
  const { name, receiverid, recievename } = route.params; // Get the user info from route params
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const flatListRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    // Connect to the server
    socketRef.current = io("http://192.168.0.110:4200");

    // Listen for individual messages from the server
    socketRef.current.on("individual message", ({ content, from }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: String(prevMessages.length + 1), user: from, content },
      ]);
    });

    return () => {
      socketRef.current.off("individual message");
    };
  }, []);

  const handleSendMessage = () => {
    if (messageContent.trim() && socketRef.current) {
      // Emit the message to the individual user
      socketRef.current.emit("individual message", {
        content: messageContent,
        to: receiverid,
        from: name,
      });
      setMessageContent(""); // Clear input after sending
    }
  };

  // Scroll to the latest message automatically
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderItem = ({ item }) => {
    const isUserMessage = item.user === name;
    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage ? styles.userMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageContent,
            isUserMessage ? styles.userMessageContent : styles.otherMessageContent,
          ]}
        >
          <Text style={{ color: "white" }}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.topicTitle}>{recievename}</Text>
        </View>
        <View style={{ flex: 1, padding: 15 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor={"white"}
              value={messageContent}
              onChangeText={setMessageContent}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity onPress={handleSendMessage}>
              <Ionicons name="send" size={24} color="white" style={styles.sendButton} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#22283F",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#333B56",
    alignItems: "center",
    padding: 10,
  },
  topicTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  messagesList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    marginVertical: 7,
    maxWidth: "80%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
  },
  messageContent: {
    padding: 10,
    borderRadius: 25,
  },
  userMessageContent: {
    backgroundColor: "#4A90E2",
  },
  otherMessageContent: {
    backgroundColor: "#333B56",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    color: "white",
    backgroundColor: "rgb(31,35,47)",
    maxHeight: 150,
    minHeight: 50,
  },
  sendButton: {
    backgroundColor: "rgb(254,44,120)",
    padding: 8,
    borderRadius: 10,
  },
});

export default UserChatScreen;
