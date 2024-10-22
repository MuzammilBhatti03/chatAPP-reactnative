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
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import io from "socket.io-client";
import { ipurl } from "../constants/constant";
import axios from "axios";
import * as Application from "expo-application";
const Login = () => {
  const [name, setName] = useState("");
  const navigation = useNavigation(); // Get navigation object
  const [connectedUsers, setConnectedUsers] = useState([]);

  const getDeviceId = () => {
    return Application.getAndroidId();
  };

  const handleSubmit = async () => {
    try {
      // Check if the user exists
      const res = await axios.get(`${ipurl}/getuser/${name.trim()}`);

      // Assuming 'res' is your response object
      // console.log(
      //   "response is ",
      //   res.data.user._id,
      //   " ",
      //   res.data.user.deviceId
      // );

      if (res.data.user._id && res.data.user.deviceId) {
        // Check if the device ID matches
        // console.log("ghjk");

        if (res.data.user.deviceId === getDeviceId()) {
          // console.log("comparing ", res.data.deviceId === getDeviceId());
          const userID=res.data.user._id;
          // Device ID matches, allow login and navigate to Home
          const socket = io(ipurl, {
            auth: {
              userID:userID,
              fetched_userName: name, // Send the device ID to the server
            },
          });

          socket.on("connect", () => {
            console.log("Connected to the server with ID:", socket.id);

            // Navigate to the Home screen and pass the user data
            navigation.navigate("Home", {
              userN: name,
              socket,
            });
          });

          socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
            alert("Failed to connect to the server. Please try again.");
          });

          return; // End the function here since the user is successfully logged in
        } else {
          // Device ID does not match, do not allow login
          Alert.alert("Login not allowed from this device.");
          return;
        }
      }
    } catch (error) {
      // User not found, proceed to add the new user
      if (error.response && error.response.status === 404) {
        try {
          const id = getDeviceId();
          // Call to add the new user with device ID
          const addUserRes = await axios.post(`${ipurl}/addnewuser`, {
            username: name.trim(),
            id, // Include the device ID
          });

          if (addUserRes.status === 201) {
            // Connect to the socket server with the device ID
            const socket = io(ipurl, {
              auth: {
                fetched_userName: name,
                deviceId, // Send the device ID to the server
              },
            });

            socket.on("connect", () => {
              console.log("Connected to the server with ID:", socket.id);

              // Navigate to the Home screen and pass the user data
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
        } catch (error) {
          console.error("Error adding new user:", error.message);
          alert("Failed to add new user. Please try again.");
        }
      } else {
        console.error("Error checking user existence:", error.message);
        alert("Failed to check user. Please try again.");
      }
    }
  };

  return (
    <View style={{ backgroundColor: "black", flex: 1, padding: 20 }}>
      <View style={{ justifyContent: "flex-end" }}>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 250,
              height: 150,
            }}
            source={require("../assets/messagelogo.png")}
          />
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 0,
          }}
        >
          <Text style={{ fontSize: 40, color: "white" }}>Talk anonymously</Text>
          <Text
            style={{
              fontSize: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              color: "white",
            }}
          >
            Discuss about diverse topics with anonymous people
          </Text>
        </View>
      </View>
      <View>
        <View>
          <TextInput
            style={{
              height: 40,
              borderColor: "white",
              backgroundColor: "white",
              borderWidth: 1,
              paddingHorizontal: 10,
              borderRadius: 20,
              marginTop: 35,
            }}
            placeholder="Enter your name"
            value={name}
            onChangeText={(text) => setName(text)} // Update state with the input value
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <TouchableOpacity
            style={{
              height: 40,
              width: "100%",
              backgroundColor: "rgb(254,44,120)",
              borderWidth: 1,
              paddingHorizontal: 10,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleSubmit} // Call handleSubmit on press
          >
            <Text style={{ color: "white" }}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
