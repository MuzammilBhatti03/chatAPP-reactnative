// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   SafeAreaView,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   Modal,
//   Alert,
// } from "react-native";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import io from "socket.io-client";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { useNavigation } from "@react-navigation/native";
// import { ipurl } from "../../../constants/constant";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// import axios from "axios";
// import { styles } from "./Style";
// import QRScreen from "../QRScreen/QRScreen";
// import { fetchDataFromDb } from "../SQLiteScreen";

// const socket = io(ipurl); // Adjust to your server

// // Bottom Tab Navigator
// const Tab = createBottomTabNavigator();
// function generateUniqueId() {
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let id = "";
//   for (let i = 0; i < 8; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     id += characters.charAt(randomIndex);
//   }
//   return id;
// }
// const TopicsScreen = ({ route }) => {
//   const { userN, userarr } = route.params;
//   const navigation = useNavigation();
//   const [data, setData] = useState([]);
//   const [connectedUsers, setConnectedUsers] = useState(userarr);

//   async function fetchForumData() {
//     try {
//       const response = await fetch(`${ipurl}/api/forums`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch forum data");
//       }

//       const forumData = await response.json();
//       setData(forumData);
//     } catch (error) {
//       console.error("Error fetching forum data:", error.message);
//     }
//   }
//   useEffect(() => {
//     fetchForumData(); // Fetch data when the component mounts
//   }, []);
//   // Forums Screen
//   const ForumsScreen = () => (
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={data}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.itemContainer}
//             onPress={() =>
//               navigation.navigate("Chat", {
//                 username: userN,
//                 imgurl: item.image,
//                 topic: item.title,
//                 description: item.description,
//                 forumid: item._id,
//                 userid: "111111",
//               })
//             }
//           >
//             <Image source={{ uri: item.image }} style={styles.itemImage} />
//             <View style={styles.textContainer}>
//               <Text style={styles.title}>{item.title}</Text>
//               <Text style={styles.description}>{item.description}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item) => item._id}
//         style={styles.list}
//       />
//     </SafeAreaView>
//   );

//   // Connected Users Screen

//   const UsersScreen = () => {
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [newUsername, setNewUsername] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [connectedUsers, setConnectedUsers] = useState([]); // State to hold connected users
//     // Replace with actual username or prop

//     useEffect(() => {
//       const fetchConnectedUsers = async () => {
//         try {
//           const response = await axios.get(`${ipurl}/connected-users/${userN}`); // Adjust to your API endpoint
//           // console.log("response is fetch connected user ",response);

//           if (response.data && response.data.connectedUsers) {
//             setConnectedUsers(response.data.connectedUsers);
//           }
//         } catch (error) {
//           console.error("Error fetching connected users:", error);
//           Alert.alert("Error", "Could not fetch connected users.");
//         }
//       };

//       fetchConnectedUsers();
//     }, []);

//     const addUser = async () => {
//       if (newUsername.trim() === userN) {
//         Alert.alert("Error", "You cannot add yourself!");
//         return;
//       }

//       try {
//         setLoading(true);
//         console.log("newusr name ", newUsername, "  user", userN);
//         // Check if the user exists in the database
//         const res = await axios.get(`${ipurl}/getuser/${newUsername.trim()}`);

//         if (res.data) {
//           const conn_userid = res.data.user._id;
//           // console.log("get user api res ", res.data," conn id ",conn_userid);
//           // Post the new connected user to the server
//           await axios.post(`${ipurl}/add-connected-user`, {
//             username: userN, // The username of the current user
//             userIDToAdd: conn_userid, // The ID of the user to be added
//           });

//           // Update the state to include the new connected user
//           setConnectedUsers((prevConnectedUsers) => [
//             ...prevConnectedUsers,
//             res.data.user, // Add the user object or just conn_userid if preferred
//           ]);

//           Alert.alert("Success", `${newUsername} has been added!`);
//           setIsModalVisible(false);
//         } else {
//           Alert.alert("Error", "User does not exist.");
//         }
//       } catch (error) {
//         console.error("Error checking user:", error);
//         Alert.alert("Error", "Could not validate user. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     const socketRef = socket;
//     useEffect(() => {
//       const setupMessageListener = async () => {
//         // console.log("Setting up socket in UsersScreen...");

//         try {
//           // Fetch the userID for the current user
//           const res = await axios.get(`${ipurl}/getuser/${userN.trim()}`);
//           const userID = res.data.user._id;
//           // console.log("User id is ",userID);

//           // Initialize socket connection with userID authentication
//           socketRef.current = io(ipurl, {
//             auth: { userID }, // Pass userID for server-side validation
//             fetched_userName: userN,
//           });
//           // Check connection status
//           socketRef.current.on("connection", (socketRef) => {
//             console.log(`Socket connected: ${socketRef.current.userID}`);
//           });

//           socketRef.current.on("connect_error", (error) => {
//             console.error("Socket connection error:", error);
//           });

//           // Listen for private messages
//           socketRef.current.on(
//             "private message",
//             async ({ content, from, createdAt, room }) => {
//               console.log("Private message received:", { content, from, room });

//               // Fetch sender details
//               const resp = await axios.get(`${ipurl}/getuser/${from.trim()}`);
//               const fromUsername = resp.data.user.username;

//               // Construct the new message object
//               const newMessage = {
//                 _id: generateUniqueId(),
//                 content,
//                 username: fromUsername,
//                 createdAt,
//                 roomid: room, // Room ID for group/forum messages
//               };

//               console.log("New message to save in DB:", newMessage);

//               // Save the message to the database
//               await addDataToDb(newMessage);
//             }
//           );

//           // Fetch connected users when requested (optional)
//           // socketRef.current.on("users", (users) => {
//           //   console.log("Connected users:", users);
//           // });

//           // Example: Emit a request for users (optional)
//           // socketRef.current.emit("fetch users");
//         } catch (error) {
//           console.error("Error setting up message listener:", error);
//         }
//       };

//       setupMessageListener();

//       // Cleanup socket connection on component unmount
//       // return () => {
//       //   if (socketRef.current) {
//       //     socketRef.current.disconnect();
//       //     console.log("Socket disconnected");
//       //   }
//       // };
//     }, []);

//     const [lastMessages, setLastMessages] = useState({}); // Store last messages for each user
//     const [lasttime, setlasttime] = useState({});
//     // Fetch last messages for all connected users
//     const fetchLastMessages = async () => {
//       try {
//         const lastMessagesMap = {};
//         const lasttimap = {};
//         for (const user of connectedUsers) {
//           const receiverid = user._id;
//           const res1 = await axios.get(`${ipurl}/getuser/${userN.trim()}`);
//           const privateRoom = [res1.data.user._id, receiverid].sort().join("-");
//           const res = await fetchDataFromDb(privateRoom);

//           if (res && res.length > 0) {
//             lastMessagesMap[receiverid] = res[res.length - 1].content; // Store last message content2
//             lasttimap[receiverid] = new Date(
//               res[res.length - 1].createdAt
//             ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false  });
//           } else {
//             lastMessagesMap[receiverid] = "No messages yet";
//             lasttimap[receiverid] = "";
//           }
//         }
//         setlasttime(lasttimap);
//         setLastMessages(lastMessagesMap); // Update state with all last messages
//       } catch (error) {
//         console.error("Error fetching last messages:", error);
//       }
//     };

//     useEffect(() => {
//       fetchLastMessages();
//     }, [connectedUsers]);
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text style={styles.title}>Connected Users</Text>

//         {connectedUsers.length > 0 ? (
//           <FlatList
//           data={connectedUsers.sort((a, b) => {
//             const lastMessageA = lasttime[a._id] ? new Date(lasttime[a._id]) : new Date(0); // Default to 0 if no message
//             const lastMessageB = lasttime[b._id] ? new Date(lasttime[b._id]) : new Date(0); // Default to 0 if no message
//             return lastMessageB - lastMessageA; // Sort descending: latest message first
//           })}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.userItem}
//               onPress={() => {
//                 navigation.navigate("Chat", {
//                   username: userN,
//                   description: "send message to chat with him",
//                   topic: item.username,
//                   receiverid: item._id,
//                   recievename: item.username,
//                 });
//               }}
//             >
//               <Text style={styles.userName}>{item.username}</Text>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   width: "100%",
//                 }}
//               >
//                 <Text style={{ flex: 1, paddingRight: 10 }} numberOfLines={1}>
//                   {lastMessages[item._id] || "Loading..."}
//                 </Text>
//                 <Text>{lasttime[item._id]}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//           keyExtractor={(item) => item._id}
//           style={styles.list}
//         />
//         ) : (
//           <Text style={{ color: "white" }}>No users present</Text>
//         )}

//         {/* Add Button */}
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={() => setIsModalVisible(true)}
//         >
//           <FontAwesome6 name="add" size={85} color="green" />
//         </TouchableOpacity>

//         {/* Modal for adding user */}
//         <Modal
//           transparent={true}
//           visible={isModalVisible}
//           onRequestClose={() => setIsModalVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Add User</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter username"
//                 value={newUsername}
//                 onChangeText={setNewUsername}
//                 autoCapitalize="none"
//               />
//               <View style={styles.buttonContainer}>
//                 <TouchableOpacity
//                   style={styles.button}
//                   onPress={addUser}
//                   disabled={loading}
//                 >
//                   <Text style={styles.buttonText}>
//                     {loading ? "Loading..." : "Submit"}
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.button, styles.cancelButton]}
//                   onPress={() => setIsModalVisible(false)}
//                 >
//                   <Text style={styles.buttonText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </SafeAreaView>
//     );
//   };
//   // Profile Screen
//   const ProfileScreen = () => (
//     <QRScreen username={userN} navigation={navigation} />
//   );

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName;
//           if (route.name === "Forums") {
//             iconName = "comments";
//           } else if (route.name === "Users") {
//             iconName = "users";
//           } else if (route.name === "Profile") {
//             iconName = "user";
//           }
//           return <FontAwesome name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "#fff",
//         tabBarInactiveTintColor: "gray",
//         tabBarStyle: { backgroundColor: "#333B56" },
//       })}
//     >
//       <Tab.Screen name="Forums" component={ForumsScreen} />
//       <Tab.Screen name="Users" component={UsersScreen} />
//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{ headerShown: false }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default TopicsScreen;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Alert,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import io from "socket.io-client";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { ipurl } from "../../../constants/constant";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import axios from "axios";
import { styles } from "./Style";
import QRScreen from "../QRScreen/QRScreen";
import {
  addDataToDb,
  fetchDataFromDb,
  fetchLastMessageForRoom,
} from "../SQLiteScreen";

const socket = io(ipurl); // Adjust to your server

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();
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
const TopicsScreen = ({ route }) => {
  const { userN, userarr } = route.params;
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState(userarr);

  async function fetchForumData() {
    try {
      const response = await fetch(`${ipurl}/api/forums`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch forum data");
      }

      const forumData = await response.json();
      setData(forumData);
    } catch (error) {
      console.error("Error fetching forum data:", error.message);
    }
  }
  useEffect(() => {
    fetchForumData(); // Fetch data when the component mounts
  }, []);
  const socketRef = useRef(null);
  useEffect(() => {
    const setupMessageListener = async () => {
      // console.log("Setting up socket in UsersScreen...");

      try {
        // Fetch the userID for the current user
        const res = await axios.get(`${ipurl}/getuser/${userN.trim()}`);
        const userID = await res.data.user._id;
        // console.log("User id is ",userID);

        // Initialize socket connection with userID authentication
        socketRef.current = io(ipurl, {
          auth: { userID }, // Pass userID for server-side validation
          fetched_userName: userN,
        });
        // Check connection status
        socketRef.current.on("connection", (socketRef) => {
          // console.log(`Socket connected: ${socketRef.current.userID}`);
        });

        socketRef.current.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
        });

        // Remove the existing private message listener
        // socketRef.current.off("private message");

        // Add the new listener for the inbox_update event
        socketRef.current.on(
          "inbox_update",
          async ({ content, from, createdAt, room }) => {
            // console.log("Inbox update received:", { content, from, room });
            const receiverid = room.split("-").find((id) => id !== from);
            // console.log("user id is ",userID,"  recieve ius ",receiverid);
            const resp = await axios.get(`${ipurl}/getuser/${from.trim()}`);
            const fromUsername = resp.data.user.username;
            if (receiverid === userID) {
              Alert.alert("message is ", content + " from " + fromUsername);
            } else {
              if (from != userID) {
                Alert.alert("message is ", content + " from " + room);
              }
            }
            // Fetch sender details

            // Construct the new message object
            const newMessage = {
              _id: generateUniqueId(),
              content,
              username: fromUsername,
              createdAt,
              roomid: room, // Room ID for group/forum messages
            };

            // console.log("New message to save in DB:", newMessage);

            // Save the message to the database
            if (receiverid === userID) {
              await addDataToDb(newMessage);
              const lastMessage = await fetchLastMessageForRoom(room);
              // console.log("last is ",lastMessage);

              if (lastMessage) {
                setLastMessages((prevLastMessages) => ({
                  ...prevLastMessages,
                  [receiverid]: lastMessage.content, // Update only this room's last message
                }));

                setlasttime((prevLastTime) => ({
                  ...prevLastTime,
                  [receiverid]: new Date(
                    lastMessage.createdAt
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }), // Update only this room's last message time
                }));
              }
            } else {
              if (from != userID) {
                await addDataToDb(newMessage);
              }
            }
          }
        );

        // Fetch connected users when requested (optional)
        // socketRef.current.on("users", (users) => {
        //   console.log("Connected users:", users);
        // });

        // Example: Emit a request for users (optional)
        // socketRef.current.emit("fetch users");
      } catch (error) {
        console.error("Error setting up message listener:", error);
      }
    };

    setupMessageListener();

    // Cleanup socket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, []);
  // Forums Screen
  const ForumsScreen = () => (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() =>
              navigation.navigate("Chat", {
                username: userN,
                imgurl: item.image,
                topic: item.title,
                description: item.description,
                forumid: item._id,
                userid: "111111",
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        style={styles.list}
      />
    </SafeAreaView>
  );

  // Connected Users Screen

  const UsersScreen = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState([]); // State to hold connected users
    // Replace with actual username or prop

    useEffect(() => {
      const fetchConnectedUsers = async () => {
        try {
          const response = await axios.get(`${ipurl}/connected-users/${userN}`); // Adjust to your API endpoint
          // console.log("response is fetch connected user ",response);

          if (response.data && response.data.connectedUsers) {
            setConnectedUsers(response.data.connectedUsers);
          }
        } catch (error) {
          console.error("Error fetching connected users:", error);
          Alert.alert("Error", "Could not fetch connected users.");
        }
      };

      fetchConnectedUsers();
    }, []);

    const addUser = async () => {
      if (newUsername.trim() === userN) {
        Alert.alert("Error", "You cannot add yourself!");
        return;
      }

      try {
        setLoading(true);
        console.log("newusr name ", newUsername, "  user", userN);
        // Check if the user exists in the database
        const res = await axios.get(`${ipurl}/getuser/${newUsername.trim()}`);

        if (res.data) {
          const conn_userid = res.data.user._id;
          // console.log("get user api res ", res.data," conn id ",conn_userid);
          // Post the new connected user to the server
          await axios.post(`${ipurl}/add-connected-user`, {
            username: userN, // The username of the current user
            userIDToAdd: conn_userid, // The ID of the user to be added
          });

          // Update the state to include the new connected user
          setConnectedUsers((prevConnectedUsers) => [
            ...prevConnectedUsers,
            res.data.user, // Add the user object or just conn_userid if preferred
          ]);

          Alert.alert("Success", `${newUsername} has been added!`);
          setIsModalVisible(false);
        } else {
          Alert.alert("Error", "User does not exist.");
        }
      } catch (error) {
        console.error("Error checking user:", error);
        Alert.alert("Error", "Could not validate user. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const [lastMessages, setLastMessages] = useState({}); // Store last messages for each user
    const [lasttime, setlasttime] = useState({});
    // Fetch last messages for all connected users
    const fetchLastMessages = async () => {
      try {
        const lastMessagesMap = {};
        const lasttimap = {};
        for (const user of connectedUsers) {
          const receiverid = user._id;
          const res1 = await axios.get(`${ipurl}/getuser/${userN.trim()}`);
          const privateRoom = [res1.data.user._id, receiverid].sort().join("-");
          const res = await fetchDataFromDb(privateRoom);

          if (res && res.length > 0) {
            lastMessagesMap[receiverid] = res[res.length - 1].content; // Store last message content2
            lasttimap[receiverid] = new Date(
              res[res.length - 1].createdAt
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
          } else {
            lastMessagesMap[receiverid] = "No messages yet";
            lasttimap[receiverid] = "";
          }
        }
        setlasttime(lasttimap);
        setLastMessages(lastMessagesMap); // Update state with all last messages
      } catch (error) {
        console.error("Error fetching last messages:", error);
      }
    };

    useEffect(() => {
      fetchLastMessages();
    }, [connectedUsers, lasttime]);
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Connected Users</Text>
        {connectedUsers.length > 0 ? (
          <FlatList
            data={connectedUsers.sort((a, b) => {
              const lastMessageA = lasttime[a._id]
                ? new Date(lasttime[a._id])
                : new Date(0); // Default to 0 if no message
              const lastMessageB = lasttime[b._id]
                ? new Date(lasttime[b._id])
                : new Date(0); // Default to 0 if no message
              return lastMessageB - lastMessageA; // Sort descending: latest message first
            })}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => {
                  navigation.navigate("Chat", {
                    username: userN,
                    description: "send message to chat with him",
                    topic: item.username,
                    receiverid: item._id,
                    recievename: item.username,
                  });
                }}
              >
                <Text style={styles.userName}>{item.username}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Text style={{ flex: 1, paddingRight: 10 }} numberOfLines={1}>
                    {lastMessages[item._id] || "Loading..."}
                  </Text>
                  <Text>{lasttime[item._id]}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
            style={styles.list}
          />
        ) : (
          <Text style={{ color: "white" }}>No users present</Text>
        )}

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <FontAwesome6 name="add" size={85} color="green" />
        </TouchableOpacity>

        {/* Modal for adding user */}
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add User</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={newUsername}
                onChangeText={setNewUsername}
                autoCapitalize="none"
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={addUser}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Loading..." : "Submit"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  };
  // Profile Screen
  const ProfileScreen = () => (
    <QRScreen username={userN} navigation={navigation} />
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Forums") {
            iconName = "comments";
          } else if (route.name === "Users") {
            iconName = "users";
          } else if (route.name === "Profile") {
            iconName = "user";
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#333B56" },
      })}
    >
      <Tab.Screen name="Forums" component={ForumsScreen} />
      <Tab.Screen name="Users" component={UsersScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default TopicsScreen;
