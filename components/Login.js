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



import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';
import { ipurl } from "../constants/constant";
const Login = () => {
  const [name, setName] = useState("");
  const navigation = useNavigation(); // Get navigation object
  const [connectedUsers,setConnectedUsers]=useState([]);
  const handleSubmit = async() => {
    if (name.trim()) {
      // Connect to the socket server with the username
      const socket = io(ipurl, {
        auth: {
          fetched_userName: name, // Send the username to the server in the auth payload
        },
      });

      // Listen for the 'connect' event to confirm connection
      await socket.on('connect', () => {
        console.log('Connected to the server with ID:', socket.id);
        socket.on("user connected", (user) => {
          setConnectedUsers([...connectedUsers, user]);
        });
        console.log("users in login,  ",connectedUsers);
        
        // Navigate to the Home screen and pass the user data
        navigation.navigate('Home', { userN: name, socket,userarr:connectedUsers }); // Pass the socket object to the Home screen if needed
      });

      // Handle connection error if needed
      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        alert("Failed to connect to the server. Please try again.");
      });
    } else {
      alert("Please enter your name.");
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

