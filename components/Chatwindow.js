// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   Image,
//   Platform,
//   StatusBar,
// } from "react-native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// // import Ionicons from '@expo/vector-icons/Ionicons';

// const ChatScreen = ({ route }) => {
//   const { name, imgurl, topic, description } = route.params; // Get topic and description from route params

//   const [messages, setMessages] = useState([
//     { id: "1", user: "John", content: "Hey, How are you doing?" },
//     {
//       id: "2",
//       user: "Peter",
//       content:
//         "All good here in Texas. We are following all the safety measures.",
//     },
//     {
//       id: "3",
//       user: "Peter",
//       content:
//         "Hope there is a quick resolution soon so that we can be happy again.",
//     },
//     {
//       id: "4",
//       user: "Williams",
//       content:
//         "All good here in Texas. We are following all the safety measures.",
//     },
//     {
//       id: "5",
//       user: "Williams",
//       content:
//         "Hope there is a quick resolution soon so that we can be happy again.",
//     },
//     { id: "6", user: "Sandra", content: "Hey all, How are you doing?" },
//   ]);

//   const [messageContent, setMessageContent] = useState("");

//   const handleSendMessage = () => {
//     if (messageContent.trim()) {
//       const newMessage = {
//         id: String(messages.length + 1),
//         user: name,
//         content: messageContent,
//       };
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//       setMessageContent(""); // Clear the input field
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.messageContainer}>
//       <Text style={styles.userName}>{item.user}</Text>
//       <View style={styles.messageContent}>
//         <Text style={{ color: "white" }}>{item.content}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity>
//           <Ionicons name="chevron-back" size={20} color="white" />
//         </TouchableOpacity>
//         <Image source={imgurl} style={styles.itemImage} />

//         <View style={{ marginHorizontal: 5 }}>
//           <Text style={styles.topicTitle}>{topic}</Text>
//           <Text numberOfLines={1} style={styles.topicDescription}>
//             {description}
//           </Text>
//         </View>
//       </View>
//       <View style={{ flex: 1, padding: 15}}>
//         <FlatList
//           data={messages}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id}
//           style={styles.messagesList}
//         />
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Type your message..."
//             placeholderTextColor={"white"}
//             value={messageContent}
//             onChangeText={setMessageContent}
//             multiline
//             numberOfLines={3}
//           />

//           <TouchableOpacity onPress={handleSendMessage}>
//             <Ionicons
//               name="send"
//               size={24}
//               color="white"
//               style={styles.sendButton}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#22283F",
//     paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
//   },
//   header: {
//     flexDirection: "row",
//     backgroundColor: "#333B56",
//     alignItems: "center",
//     padding: 10,
//   },
//   topicTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   topicDescription: {
//     fontSize: 14,
//     color: "#bbb",
//   },
//   messagesList: {
//     flex: 1,
//     marginBottom: 10,
//   },
//   messageContainer: {
//     marginVertical: 7,
//     // padding: 10,
//     borderRadius: 10,
//     // backgroundColor: "#333B56",
//     alignSelf: "flex-start",
//   },
//   itemImage: {
//     marginLeft: 5,
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   userName: {
//     paddingLeft: 10,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   messageContent: {
//     color: "#bbb",
//     alignSelf: "flex-start",
//     marginTop: 5,
//     padding: 10,
//     backgroundColor: "#333B56",
//     borderRadius: 25,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   input: {
//     flex: 1,
//     borderColor: "#bbb",
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginRight: 10,
//     color: "white",
//     backgroundColor: "rgb(31,35,47)",
//     maxHeight: 150,
//     minHeight: 50
//   },
//   sendButton: {
//     backgroundColor: "rgb(254,44,120)",
//     padding: 8,
//     borderRadius: 10,
//   },
// });

// export default ChatScreen;
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import io from "socket.io-client";
import axios from "axios";
import { ipurl } from "../constants/constant";

const ChatScreen = ({ route, navigation }) => {
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
  const [seenderid,setsenderid]=useState("");
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
      const res = await axios.get(`${ipurl}/api/messages/${userID}/${receiverid}`);
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
    if (receiverid) {
      fetchIndividualMessages(receiverid);
    }
  }, [receiverid]);
  
  useEffect(() => {
    if (forumid) {
      fetchForumMessages(forumid);
    }
  }, [forumid]);
  

  // Send message to the room or individual
  const handleSendMessage = async () => {
    try {
      const res = await axios.get(`${ipurl}/getuser/${username.trim()}`);
      const userID = res.data.user._id;
  
      if (messageContent.trim() && userID) {
        const newMessage = {
          content: messageContent,
          from: username,
          createdAt: new Date(),
        };
  
        // Check if it's a private message (receiverid is present)
        if (receiverid) {
          const privateRoom = [userID, receiverid].sort().join("-"); // Create unique room
          console.log("Receiver name is ", recievename);
  
          // Check if receiver is connected before sending a message
          axios
            .get(`${ipurl}/connected-users/${recievename}`)
            .then(async (res) => {
              const receiverConnectedUsers = res.data.connectedUsers;
              console.log(
                "Connected user API response: ",
                res.data.connectedUsers
              );
  
              // Check if sender is in the receiver's connected user list
              const isSenderConnected = receiverConnectedUsers.some(
                (user) => user._id === userID
              );
  
              if (!isSenderConnected) {
                // Add sender to the receiver's connected user list
                await axios.post(`${ipurl}/add-connected-user`, {
                  username: receiverid,
                  userIDToAdd: userID,
                });
              }
  
              // Emit private message
              socketRef.current.emit("private message", {
                content: messageContent,
                room: privateRoom,
                createdAt: new Date(),
              });
  
              // Save private message to the database (separate API for private messages)
              const privateMessage = {
                senderID: userID,
                receiverID: receiverid,
                content: messageContent,
                createdAt: new Date(),
              };
  
              const response = await axios.post(
                `${ipurl}/api/messages/send`,
                privateMessage
              );
  
              if (response.status === 201) {
                console.log(response.data);
                setMessageContent(""); // Clear input
                // Optionally fetch the private messages again here, if necessary
                fetchIndividualMessages(receiverid);
              }
            })
            .catch((error) => {
              console.error(
                "Error fetching receiver's connected users: ",
                error
              );
              Alert.alert("Error", "Could not send message. Please try again.");
            });
        } else {
          // Emit message to group chat
          socketRef.current.emit("private message", {
            content: messageContent,
            room: topic,
            createdAt: new Date(),
          });
  
          // Save forum message to the database (separate API for forum messages)
          const forumMessage = {
            userID: userID,
            username: username,
            content: messageContent,
            forumID: forumid,
            createdAt: new Date(),
          };
  
          const response = await axios.post(
            `${ipurl}/forums/${forumid}/messages`,
            forumMessage
          );
  
          if (response.status === 201) {
            setMessageContent(""); // Clear input
            fetchForumMessages(forumid); // Fetch new messages after sending
          }
        }
      }
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };
  
  useEffect(() => {
    const setupSocket = async () => {
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
        socketRef.current.emit("join room", privateRoom);
      } else {
        socketRef.current.emit("join room", topic);
      }
  
      // Listen for incoming messages
      socketRef.current.on("private message",async ({ content, from,createdAt }) => {
        // Ensure the incoming message is displayed in the correct format
        const resp = await axios.get(`${ipurl}/getuser/${from.trim()}`);
      const from11 = resp.data.user.username;
        setMessages((prevMessages) => [
          { id: String(prevMessages.length + 1), _id: from, content, createdAt,username:from11 }, // New message at the start
          ...prevMessages, // Existing messages
        ]);        
  
        // Optional: Log the incoming message for debugging
        // console.log("New message received: ", { content, from });
      });
    };
  
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

    const isUserMessage = item.username === username||item.senderID===seenderid;
    const nextItem = messages[index + 1];
    const showDate =
      new Date(item.createdAt).toDateString() !==
      (nextItem ? new Date(nextItem.createdAt).toDateString() : "");

    return (
      <View>
        {showDate && (
          <View style={styles.date}>
            <Text style={{ color: "darkgray" }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.messageContainer,
            isUserMessage
              ? styles.userMessageContainer
              : styles.otherMessageContainer,
          ]}
        >
          {!isUserMessage && (
            <Text style={styles.userName}>{item.username}</Text>
          )}
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
          {selectedMessageId === item._id && (
            <Text style={{ color: "white", backgroundColor: "#22283F" }}>
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          )}
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
  },
  topicDescription: {
    fontSize: 14,
    color: "#bbb",
  },
  messagesList: {
    flex: 1,
    marginBottom: 0,
    paddingBottom: 50,
  },
  messageContainer: {
    marginVertical: 7,
    maxWidth: "80%", // Limit message width
  },
  userMessageContainer: {
    alignSelf: "flex-end", // Align user messages to the right
  },
  otherMessageContainer: {
    alignSelf: "flex-start", // Align other messages to the left
  },
  itemImage: {
    marginLeft: 5,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    paddingLeft: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  messageContent: {
    padding: 10,
    borderRadius: 25,
  },
  userMessageContent: {
    backgroundColor: "#4A90E2", // User message background color
  },
  otherMessageContent: {
    backgroundColor: "#333B56", // Other messages background color
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
  date: {
    justifyContent: "center",
    marginLeft: "34%",
    maxWidth: 100,
    minWidth: 100,
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
    backgroundColor: "#333B56",
  },
});

export default ChatScreen;
