import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  Alert,
  StatusBar,
} from "react-native";
import { styles } from "./Style";
import Ionicons from "@expo/vector-icons/Ionicons";
import io from "socket.io-client";
import axios from "axios";
import { ipurl } from "../../../constants/constant";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { addDataToDb, fetchDataFromDb } from "../SQLiteScreen";
import { v4 as uuidv4 } from "uuid";
import { useNavigation } from "@react-navigation/native";

const ChatScreen = ({ route }) => {
  const {
    username,
    imgurl,
    topic,
    description,
    receiverid,
    recievename,
    forumid,
    userid,
  } = route.params;

  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const flatListRef = useRef(null); // Ref to the FlatList
  const socketRef = useRef(); // Ref to store the socket connection
  const [selectedMessageId, setSelectedMessageId] = useState(null); // Track selected message for timestamp
  const [seenderid, setsenderid] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    // getMessagesFromDatabase((fetchedMessages) => {
    //   setMessages(fetchedMessages.reverse());
    // });
  }, []);
  const fetchfromSqlite = async (roomid) => {
    let res = await fetchDataFromDb(roomid);
    // console.log("res is ",res);
    if (res) {
      setMessages(res.reverse());
    }
  };
  // Fetch forum messages (group or private) from the API
  const fetchForumMessages = async (forumID) => {
    try {
      const response = await axios.get(`${ipurl}/forums/${forumID}/messages`);
      if (response.status === 200) {
        setMessages(response.data.reverse());
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchIndividualMessages = async (receiverid) => {
    try {
      const resp = await axios.get(`${ipurl}/getuser/${username.trim()}`);
      const userID = resp.data.user._id;
      setsenderid(userID);
      const res = await axios.get(
        `${ipurl}/api/messages/${userID}/${receiverid}`
      );
      const individualMessages = res.data.messages.reverse(); // Extract the messages from the response
      // console.log("individual message is ",individualMessages);

      setMessages(individualMessages);

      if (individualMessages.length > 0) {
        // Process the messages (you can set them in the state or do whatever you need with them)
        setMessages(individualMessages);
      } else {
        console.log("No messages found between the two users.");
      }
    } catch (error) {
      console.error("Error fetching individual messages:", error);
      Alert.alert("Error", "Could not fetch messages. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!receiverid) return; // Exit early if receiverid is null
      try {
        const res = await axios.get(`${ipurl}/getuser/${username.trim()}`);
        const userID = res.data.user._id;
        const privateRoom = [userID, receiverid].sort().join("-");
        fetchfromSqlite(privateRoom);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [receiverid, ipurl, username]);

  useEffect(() => {
    if (!forumid) return; // Exit early if forumid is null
    fetchfromSqlite(topic);
  }, [forumid]);
  function generateUniqueId() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters.charAt(randomIndex);
    }
    return id;
  }

  const handleSendMessage = async () => {
    try {
      const res = await axios.get(`${ipurl}/getuser/${username.trim()}`);
      const userID = res.data.user._id;

      if (messageContent.trim() && userID) {
        const timestamp = new Date().toISOString();
        // console.log("conetgis isb ",userID,receiverid,messageContent,username,timestamp);
        let Room = "";
        if (receiverid) {
          Room = [userID, receiverid].sort().join("-");
        } else {
          Room = topic;
        }
        const newMessage = {
          _id: generateUniqueId(), // Generate a unique ID
          content: messageContent,
          username: username,
          createdAt: timestamp,
          isFailed: false,
          roomid: Room, // Room ID for group/forum message
        };
        //  console.log("new message iis ",newMessage);

        // Save message to SQLite
        // addMessageToDatabase(newMessage);
        await addDataToDb(newMessage);
        // Clear message input
        setMessageContent("");

        if (receiverid) {
          const privateRoom = [userID, receiverid].sort().join("-"); // Create unique room

          // Emit private message
          socketRef.current.emit("private message", {
            content: messageContent,
            room: privateRoom,
            createdAt: timestamp,
            recipient: receiverid,
          });

          // Save private message to the database
          const privateMessage = {
            senderID: userID,
            receiverID: receiverid,
            content: messageContent,
            createdAt: timestamp,
          };

          // Append the new message to the messages state
          setMessages((prevMessages) => [newMessage, ...prevMessages]);
          setMessageContent(""); // Clear input
          // Save message to the API
          // await axios.post(`${ipurl}/api/messages/send`, privateMessage);
        } else {
          // Emit message to group chat
          // console.log("before socketg ");
          socketRef.current.emit("private message", {
            content: messageContent,
            room: topic,
            createdAt: timestamp,
          });

          // Save forum message to the database (separate API for forum messages)
          const forumMessage = {
            userID: userID,
            username: username,
            content: messageContent,
            forumID: forumid,
            createdAt: timestamp,
          };

          // Append the new message to the messages state
          if (messages) {
            setMessages((prevMessages) => [newMessage, ...prevMessages]);
          } else {
            setMessages(newMessage);
            console.log(messages);
          }
          setMessageContent(""); // Clear input
          // await axios.post(`${ipurl}/forums/${forumid}/messages`, forumMessage);
        }

        setMessageContent(""); // Clear input
      }
    } catch (error) {
      console.error("Error sending message: ", error);
      if (messages) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === newMessage.id ? { ...msg, isFailed: true } : msg
          )
        );
      }
    }
  };
  const setupSocket = async () => {
    try {
      const res = await axios.get(`${ipurl}/getuser/${username.trim()}`);
      const userID = res.data.user._id;

      socketRef.current = io(ipurl, {
        auth: {
          userID: userID,
          fetched_userName: username,
        },
      });

      // Join private or group room based on receiverid
      if (receiverid) {
        const privateRoom = [userID, receiverid].sort().join("-");
        console.log("in join room");
        socketRef.current.emit("join room", privateRoom);
      } else {
        socketRef.current.emit("join room", topic);
        console.log("in join room");
      }

      // Listen for incoming messages
      socketRef.current.on(
        "private message",
        async ({ content, from, createdAt,room }) => {
          console.log("in recieving message");
          const resp = await axios.get(`${ipurl}/getuser/${from.trim()}`);
          const from11 = resp.data.user.username;
          setMessages((prevMessages) => [
            {
              id: String(prevMessages.length + 1),
              _id: from,
              content,
              createdAt,
              username: from11,
            }, // New message at the start
            ...prevMessages, // Existing messages
          ]);

          // let room = "";
          // if (receiverid) {
          //   room = [userID, receiverid].sort().join("-");
          //   // console.log("rooom  is ",room);
          // }
          // if (forumid) {
          //   room = topic;
          // }
          // console.log("frommm11 is ",from11);
          
          const newMessage = {
            _id: generateUniqueId(), // Generate a unique ID
            content: content,
            username: await from11,
            createdAt: createdAt,
            isFailed: false,
            roomid: room, // Room ID for group/forum message
          };
          // console.log("new message is ", newMessage);

          await addDataToDb(newMessage);
        }
      );
    } catch (error) {
      console.error("Error during socket setup:", error);
    }
  };

  useEffect(() => {
    setupSocket();
    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [username, topic, receiverid]);

  // Render chat messages
  const renderItem = ({ item, index }) => {
    const isUserMessage =
      item.username === username || item.senderID === seenderid;
    const nextItem = messages[index + 1];
    const showDate =
      new Date(item.createdAt).toDateString() !==
      (nextItem ? new Date(nextItem.createdAt).toDateString() : "");

    return (
      <View>
        {showDate ? (
          <View style={styles.date}>
            <Text style={{ color: "darkgray" }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ) : null}
        <View
          style={[
            styles.messageContainer,
            isUserMessage
              ? styles.userMessageContainer
              : styles.otherMessageContainer,
          ]}
        >
          {!isUserMessage ? (
            <Text style={styles.userName}>{item.username}</Text>
          ) : null}
          <View style={{ flexDirection: "row" }}>
            {item.isFailed ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: "white", marginRight: 2 }}>Resend</Text>
                <TouchableOpacity onPress={() => handleSendMessage(item)}>
                  <MaterialCommunityIcons
                    name="send-outline"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            ) : null}
            <View
              style={[
                styles.messageContent,
                isUserMessage
                  ? styles.userMessageContent
                  : styles.otherMessageContent,
              ]}
            >
              <Text
                style={{ color: "white" }}
                onPress={() => setSelectedMessageId(item._id)}
              >
                {item.content}
              </Text>
            </View>
          </View>
          {selectedMessageId === item._id ? (
            <Text style={{ color: "white", backgroundColor: "#22283F" }}>
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="white" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={40} color="white" />
          </TouchableOpacity>
          {!imgurl ? null : (
            <Image source={{ uri: imgurl }} style={styles.itemImage} />
          )}
          <View style={{ marginHorizontal: 5 }}>
            <Text style={styles.topicTitle}>{topic}</Text>
            <Text numberOfLines={1} style={styles.topicDescription}>
              {description}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, padding: 15 }}>
          <FlatList
            inverted
            showsVerticalScrollIndicator={false}
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
              <Ionicons
                name="send"
                size={24}
                color="white"
                style={styles.sendButton}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
