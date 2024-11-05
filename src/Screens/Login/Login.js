// import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
// import React, { useState } from "react";

// // Import useNavigation hook from React Navigation
// import { useNavigation } from '@react-navigation/native';

// const Login = () => {
//   const [name, setName] = useState("");
//   const navigation = useNavigation(); // Get navigation object

//   const handleSubmit = () => {
//     // Navigate to Home screen upon form submission
//     if (name.trim()) {
//       navigation.navigate('Home', { user: name }); // Pass the name as a parameter if needed
//     } else {
//       // Handle the case when the name is empty, e.g., show an alert or error message
//       alert("Please enter your name.");
//     }
//   };

//   return (
//     <View style={{ backgroundColor: "black", flex: 1, padding: 20 }}>
//       <View style={{ justifyContent: "flex-end" }}>
//         <View
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Image
//             style={{
//               width: 250,
//               height: 150,
//             }}
//             source={require("../assets/messagelogo.png")}
//           />
//         </View>
//         <View
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             marginTop: 0,
//           }}
//         >
//           <Text style={{ fontSize: 40, color: "white" }}>Talk anonymously</Text>
//           <Text
//             style={{
//               fontSize: 20,
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               textAlign: "center",
//               color: "white",
//             }}
//           >
//             Discuss about diverse topics with anonymous people
//           </Text>
//         </View>
//       </View>
//       <View>
//         <View>
//           <TextInput
//             style={{
//               height: 40,
//               borderColor: "white",
//               backgroundColor: "white",
//               borderWidth: 1,
//               paddingHorizontal: 10,
//               borderRadius: 20,
//               marginTop: 35,
//             }}
//             placeholder="Enter your name"
//             value={name}
//             onChangeText={(text) => setName(text)} // Update state with the input value
//           />
//         </View>
//         <View
//           style={{
//             justifyContent: "center",
//             alignItems: "center",
//             marginTop: 15,
//           }}
//         >
//           <TouchableOpacity
//             style={{
//               height: 40,
//               width: "100%",
//               backgroundColor: "rgb(254,44,120)",
//               borderWidth: 1,
//               paddingHorizontal: 10,
//               borderRadius: 20,
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//             onPress={handleSubmit} // Call handleSubmit on press
//           >
//             <Text style={{ color: "white" }}>
//               Continue
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default Login;

import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import io from "socket.io-client";
import { ipurl } from "../../../constants/constant";
import axios from "axios";
import * as Application from "expo-application";
import { styles } from "./Style";

const Login = () => {
  const [name, setName] = useState("");
  const navigation = useNavigation(); // Get navigation object
  const [connectedUsers, setConnectedUsers] = useState([]);

  const getDeviceId = () => {
    return Application.getAndroidId();
  };

  const handleSubmit = async () => {
    try {
      // Step 1: Check if the user exists
      const res = await axios.get(`${ipurl}/getuser/${name.trim()}`);

      if (res.data.user._id && res.data.user.deviceId) {
        // Step 2: Compare device ID
        if (res.data.user.deviceId === getDeviceId()) {
          // Device ID matches, proceed with login and socket connection
          const userID = res.data.user._id;
          console.log("Existing user ID:", userID);

          // Establish socket connection
          const socket = io(ipurl, {
            auth: {
              userID: userID,
              fetched_userName: name, // Send the username and userID
            },
          });

          socket.on("connect", () => {
            console.log("Connected to the server with userID:", userID);
            // Navigate to Home screen
            navigation.navigate("Home", {
              userN: name,
              socket,
            });
          });

          socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
            alert("Failed to connect to the server. Please try again.");
          });

          return; // Exit after successful login
        } else {
          // Step 3: Device ID does not match
          Alert.alert("Login not allowed from this device.");
          return;
        }
      }
    } catch (error) {
      // Step 4: If user does not exist in the DB (error 404), create a new user
      if (error.response && error.response.status === 404) {
        try {
          const deviceId = await getDeviceId(); // Fetch device ID
          // Step 5: Create a new user with the device ID
          const addUserRes = await axios.post(`${ipurl}/addnewuser`, {
            username: name.trim(),
            deviceId,
          });

          if (addUserRes.status === 201) {
            // Step 6: Fetch the newly created user’s data to get the userID
            const res = await axios.get(`${ipurl}/getuser/${name.trim()}`);
            const userID = res.data.user._id;
            console.log("Newly created user ID:", userID);

            // Step 7: Establish socket connection for the new user
            const socket = io(ipurl, {
              auth: {
                fetched_userName: name,
                userID: userID, // Send the newly created userID
              },
            });

            socket.on("connect", () => {
              console.log("Connected to the server with new userID:", socket.id);
              // Navigate to Home screen
              navigation.navigate("Home", {
                userN: name,
                socket,
              });
            });

            socket.on("connect_error", (err) => {
              console.error("Socket connection error:", err);
              alert("Failed to connect to the server. Please try again.");
            });
          }
        } catch (addUserError) {
          console.error("Error adding new user:", addUserError.message);
          alert("Failed to add new user. Please try again.");
        }
      } else {
        console.error("Error checking user existence:", error.message);
        alert("Failed to check user. Please try again");
      }
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.messageLogoView} >
        <Image
          style={styles.image}
          source={require("../../../Images/Icons/messagelogo.png")}
        />
      </View>
      <View
        style={styles.textView}>
        <Text style={styles.talkText}>Talk anonymously</Text>
        <Text
          style={styles.discussText}>
          Discuss about diverse topics with anonymous people
        </Text>
      </View>
      <View>
        <View>
          <TextInput
            style={styles.textInput1}
            placeholder="Enter your name"
            value={name}
            onChangeText={(text) => setName(text)} // Update state with the input value
          />
        </View>
        <View
          style={styles.buttonView}
        >
          <TouchableOpacity
            style={styles.opacity}
            onPress={handleSubmit} // Call handleSubmit on press
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
