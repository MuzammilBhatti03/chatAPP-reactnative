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
  Keyboard,
  Alert,
  Pressable,
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
  } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const flatListRef = useRef(null); // Ref to the FlatList
  const socketRef = useRef(); // Ref to store the socket connection
  const [shotime, setshotime] = useState(false);

  const fetchForumMessages = async (forumID) => {
    try {
      const response = await axios.get(`${ipurl}/forums/${forumID}/messages`);

      if (response.status === 200) {
        // console.log("Fetched messages successfully:", response.data);
        setMessages(response.data.reverse()); // Update the state with fetched messages
        // flatListRef.current.scrollToEnd({ animated: true })
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchForumMessages(forumid); // Call the function when component mounts
  }, [forumid]);
  // Send message to the room or individual
  const handleSendMessage = async () => {
    if (messageContent.trim() && socketRef.current) {
      const newMessage = {
        content: messageContent,
        room: topic,
        from: username,
        createdAt: new Date(),
      };

      if (receiverid) {
        console.log("Sending message to individual user:", receiverid);
        // Emit to the server for individual messaging
        socketRef.current.emit("individual message", {
          content: messageContent,
          to: receiverid, // Use receiver's username
        });
      } else {
        console.log(
          "Sending message to the room:",
          topic,
          "  forum id is: ",
          forumid
        );
        // Emit the message to the server (for this specific room)
        socketRef.current.emit("private message", newMessage);
      }

      try {
        const apiMessage = {
          userID: socketRef.current.id, // Add the appropriate user ID
          username: username, // User's name
          content: messageContent, // Message content
          forumID: forumid, // This should be the forum/topic ID
          createdAt: new Date(),
        };
        // console.log("api message is : ",apiMessage);

        const response = await axios.post(
          `${ipurl}/forums/${forumid}/messages`,
          apiMessage
        ); // Corrected URL

        if (response.status === 201) {
          console.log("Message saved successfully:", response.data);
        } else {
          console.error("Failed to save message:", response.data);
        }
      } catch (error) {
        console.error("Error saving message to the database:", error);
      }

      setMessageContent(""); // Clear the input after sending
      fetchForumMessages(forumid);
    }
  };
  useEffect(() => {
    socketRef.current = io(ipurl, {
      auth: { fetched_userName: username },
    });

    // Join the appropriate room based on whether there's a receiver
    if (receiverid) {
    } else {
      socketRef.current.emit("join room", topic);
    }

    // Listen for incoming messages in the room
    socketRef.current.on("private message", ({ content, from }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: String(prevMessages.length + 1), user: from, content },
      ]);
    });
    return () => {
      socketRef.current.off("private message");
      // socketRef.current.off("individual message");
    };
  }, [username, topic, receiverid]);
  const filterDate = (time) => {
    const tim = new Date(time);
    return tim.toLocaleDateString();
  };
  const filtertime = (time) => {
    const tim = new Date(time);
    return tim.toLocaleTimeString();
  };
  const shouldShowDate = (currentItem, nextItem) => {
    if (!nextItem) return true; // Always show for the last item in an inverted list

    const currentDate = new Date(currentItem.createdAt).toDateString();
    const nextDate = new Date(nextItem.createdAt).toDateString();
    return currentDate !== nextDate; // Return true if the date has changed
  };

  const [selectedMessageId, setSelectedMessageId] = useState(null); // Store the id of the pressed message

  // Toggle time display for the pressed message
  const showtime = (messageId) => {
    // console.log("mssage id is =>", messageId);

    if (selectedMessageId === messageId) {
      setSelectedMessageId(null); // If the same message is clicked again, hide the time
    } else {
      setSelectedMessageId(messageId); // Set the id of the clicked message
    }
  };

  const renderItem = ({ item, index }) => {
    const isUserMessage = item.username === username; // Check if the message is from the current user
    const nextItem = messages[index + 1]; // Get the next item in the list
    const showDate = shouldShowDate(item, nextItem); // Check if the date should be shown
    const isSelectedMessage = selectedMessageId === item._id; // Check if the current message is the selected one

    return (
      <View>
        {showDate && (
          <View style={styles.date}>
            {showDate && (
              <Text style={{ color: "darkgray" }}>
                {filterDate(item.createdAt)}
              </Text>
            )}
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
              onPress={() => showtime(item._id)} // Pass the message id to the showtime function
            >
              {item.content}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.userMessageContainer,
            isUserMessage
              ? styles.userMessageContainer
              : styles.otherMessageContainer,
          ]}
        >
          <Text style={{ color: "white", backgroundColor: "#22283F" }}>
            {isSelectedMessage ? filtertime(item.createdAt) : ""}
          </Text>
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
            <Ionicons name="chevron-back" size={20} color="white" />
          </TouchableOpacity>

          <Image source={{ uri: imgurl }} style={styles.itemImage} />
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
