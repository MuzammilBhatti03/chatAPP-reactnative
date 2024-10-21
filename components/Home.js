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
import { useNavigation } from "@react-navigation/native";
import { ipurl } from "../constants/constant";
// const data = [
//   {
//     id: "1",
//     title: "Covid19",
//     description: "Trends, precautionary measures, and vaccine information",
//     image: require("../assets/messagelogo.png"),
//   },
//   {
//     id: "2",
//     title: "Netflix Dark",
//     description:
//       "Lorem ipsum mollit non deserunt ullamco est sit aliqua dolor do",
//     image: require("../assets/messagelogo.png"),
//   },
//   {
//     id: "3",
//     title: "IPL 2020",
//     description:
//       "Lorem ipsum mollit non deserunt ullamco est sit aliqua dolor do",
//     image: require("../assets/messagelogo.png"),
//   },
//   {
//     id: "4",
//     title: "Black Lives Matter",
//     description:
//       "Lorem ipsum mollit non deserunt ullamco est sit aliqua dolor do",
//     image: require("../assets/messagelogo.png"),
//   },
//   {
//     id: "5",
//     title: "Nolan’s Tenet",
//     description:
//       "Lorem ipsum mollit non deserunt ullamco est sit aliqua dolor do",
//     image: require("../assets/messagelogo.png"),
//   },
// ];

const socket = io(ipurl); // Adjust to your server

const TopicsScreen = ({ route }) => {
  const { userN, userarr } = route.params;
  const [search, setSearch] = useState("");
  const navigation = useNavigation();
  const [selectedView, setSelectedView] = useState("forums");
  const [connectedUsers, setConnectedUsers] = useState(userarr);

  const [data, setdata] = useState([]);
  async function fetchForumData() {
    try {
      // Call the API to get the forum data
      const response = await fetch(`${ipurl}/api/forums`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Failed to fetch forum data");
      }

      // Parse the response JSON data
      const forumData = await response.json();

      // Add the fetched data to the `data` array
      setdata(forumData); // Spread the existing data and new data
      // console.log("Forum data successfully added:", data);
    } catch (error) {
      console.error("Error fetching forum data:", error.message);
    }
  }
  const connecteduser = () => {
    console.log("Selected view changed to users");
    setSelectedView("users");
  
    // Emit 'fetch users' to request the list of users from the server
    socket.emit("fetch users");
  
    // Listen for the updated users list from the server
    socket.on("users", (users) => {
      console.log("Connected users received are:", users); // Log the users received
      if (users == null || users.length === 0) {
        console.log("No users connected");
      } else {
        const validUsers = users.filter(
          (user) => user.userID && user.username !== userN // Exclude the current user
        );
        console.log("Valid connected users:", validUsers); // Log valid users
        setConnectedUsers(validUsers); // Update state with valid users
      }
    });
  };
  

  // Fetch connected users when "Connected Users" is selected
  useEffect(() => {
    if (selectedView === "forums") {
      fetchForumData();
    }
    // console.log("useEffect triggered with selectedView:", selectedView); // Log for debugging
    if (selectedView == "users") {
      // console.log("Requesting connected users from server..."); // Log for debugging
      // Emit the event to fetch users
      socket.emit("fetch users");
      // Listen for the updated users list
      socket.on("users", (users) => {
        console.log("Connected users received:", users); // Log the users received
        if (users == null || users.length === 0) {
          console.log("No users connected");
        } else {
          const validUsers = users.filter(
            (user) => user.userID && user.username !== userN // Exclude the current user
          );
          // console.log("Valid connected users:", validUsers); // Log valid users
          setConnectedUsers(validUsers); // Update state with valid users
        }
      });

      // Clean up the event listener on unmount
      return () => {
        console.log("Cleaning up 'users' listener"); // Log for debugging
        socket.off("users");
      };
    }
  }, [selectedView]);

  // Renders the forum list
  const renderForumItem = ({ item }) => (
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
  );

  // Renders the connected user list
  const renderUserItem = ({ item }) => (
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
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome
          name="search"
          size={16}
          color="gray"
          style={{ paddingRight: 10 }}
        />
        <TextInput
          style={{ ...styles.searchInput, flex: 0.9 }}
          placeholder="Search a topic"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={"gray"}
        />
      </View>

      {/* Buttons for toggling between views */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedView === "users" ? styles.activeButton : null,
          ]}
          onPress={connecteduser}
        >
          <Text style={styles.buttonText}>Connected Users</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedView === "forums" ? styles.activeButton : null,
          ]}
          onPress={() => setSelectedView("forums")}
        >
          <Text style={styles.buttonText}>Forums</Text>
        </TouchableOpacity>
      </View>

      {/* Conditionally render based on selected view */}
      {selectedView === "forums" ? (
        <FlatList
          data={data}
          renderItem={renderForumItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      ) : (
        <FlatList
          data={connectedUsers.filter((user) => user.username)}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.userID}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#22283F",
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333B56",
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
  searchInput: {
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#333B56",
    padding: 15,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#555B76", // Highlight the active button
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
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
});

export default TopicsScreen;
