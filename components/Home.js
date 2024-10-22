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
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import io from "socket.io-client";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { ipurl } from "../constants/constant";

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

  const connecteduser = () => {
    socket.emit("fetch users");

    socket.on("users", (users) => {
      if (users && users.length > 0) {
        const validUsers = users.filter(
          (user) => user.userID && user.username !== userN
        );
        setConnectedUsers(validUsers);
      }
    });

    return () => {
      socket.off("users");
    };
  };

  useEffect(() => {
    fetchForumData();
    connecteduser();
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
  const UsersScreen = () => (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={connectedUsers.filter((user) => user.username)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() =>
              navigation.navigate("UserChat", {
                name: userN,
                receiverid: item.userID,
                recievename: item.username,
              })
            }
          >
            <Text style={styles.userName}>{item.username}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.userID}
        style={styles.list}
      />
    </SafeAreaView>
  );

  // Profile Screen
  const ProfileScreen = () => (
    <SafeAreaView style={styles.container}>
      <Text style={styles.profileText}>This is the Profile screen for {userN}</Text>
    </SafeAreaView>
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
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#22283F",
    paddingHorizontal: 20,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#333B56",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  description: {
    fontSize: 14,
    color: "#bbb",
  },
  userItem: {
    backgroundColor: "#333B56",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
  },
  profileText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default TopicsScreen;
