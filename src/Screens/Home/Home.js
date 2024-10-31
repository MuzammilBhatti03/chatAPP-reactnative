// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TextInput,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
// } from "react-native";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import { useNavigation } from '@react-navigation/native';

// const data = [
//   {
//     id: "1",
//     title: "Covid19",
//     description: "Trends, precautionary measures and vaccine information",
//     image: require("../assets/messagelogo.png"),
//   },
//   {
//     id: "2",
//     title: "Netflix Dark",
//     description: "Lorem ipsum mollit non deserunt ullamco est sit aliqua dolor do",
//     image: require("../assets/messagelogo.png"),
//   },
//   {
//     id: "3",
//     title: "IPL 2020",
//     description: "Lorem ipsum mollit non deserunt ullamco est sit aliqua dolor do",
//     image: require("../assets/messagelogo.png"),
//   },
//   {
//     id: "4",
//     title: "Black Lives Matter",
//     description: "Lorem ipsum mollit non deserunt ullamco est sit aliqua dolor do",
//     image: require("../assets/messagelogo.png"),
//   },
//   {
//     id: "5",
//     title: "Nolan’s Tenet",
//     description: "Lorem ipsum mollit non deserunt ullamco est sit aliqua dolor do",
//     image: require("../assets/messagelogo.png"),
//   },
// ];

// const TopicsScreen = ({route}) => {
//   const {user}=route.params;
//   const [search, setSearch] = useState("");
//   const navigation = useNavigation();

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.itemContainer}
//       onPress={() => navigation.navigate('Chat', {name:user, imgurl:item.image,topic: item.title, description: item.description })} // Pass both topic and description
//     >
//       <Image source={item.image} style={styles.itemImage} />
//       <View style={styles.textContainer}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.description}>{item.description}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.searchContainer}>
//         <FontAwesome
//           name="search"
//           size={16}
//           color="gray"
//           style={{ paddingRight: 10 }}
//         />
//         <TextInput
//           style={{ ...styles.searchInput, flex: 0.9 }}
//           placeholder="Search a topic"
//           value={search}
//           onChangeText={setSearch}
//           placeholderTextColor={"gray"}
//         />
//       </View>

//       <FlatList
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         style={styles.list}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#22283F",
//     color: "gray",
//     paddingHorizontal: 20,
//     // paddingTop: 20,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#333B56",
//     paddingVertical: 10,
//     borderRadius: 10,
//     marginVertical: 20,
//   },
//   searchInput: {
//     color: "gray",

//   },
//   list: {
//     flex: 1,
//   },
//   itemContainer: {
//     flexDirection: "row",
//     backgroundColor: "#333B56",
//     padding: 15,
//     paddingBottom: 25,
//     borderRadius: 10,
//     marginBottom: 15,
//     alignItems: "center",
//   },
//   itemImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   description: {
//     fontSize: 14,
//     color: "#bbb",
//   },
// });

// export default TopicsScreen;

import React, { useState, useEffect } from "react";
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

const socket = io(ipurl); // Adjust to your server

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

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

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Connected Users</Text>

        {connectedUsers.length > 0 ? (
          <FlatList
            data={connectedUsers}
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
                <Text></Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
            style={styles.list}
          />
        ) : (
          <Text>No users present</Text>
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
      <Tab.Screen name="Profile" component={ProfileScreen} 
      options={{headerShown:false}}/>
    </Tab.Navigator>
  );
};

export default TopicsScreen;
