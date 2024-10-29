import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  Button,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { styles } from "./Style";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import axios from "axios"; // Fix Axios import
import { ipurl } from "../../../constants/constant";
import { useNavigation } from "@react-navigation/native";

const ScannerScreen = ({ route }) => {
    const {userN}=route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const [flashlight, setFlashLight] = useState(false);
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const navigation=useNavigation();

  const toggleFlashlight = () => setFlashLight(!flashlight);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={async ({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            if (data.startsWith("appname://user/")) {
              const username = data.split("appname://user/")[1];
              Alert.alert("Username", `Scanned username: ${username}`);
              try {
                const response = await axios.get(
                  `${ipurl}/getuser/${username.trim()}`
                );
                const userID = await response.data.user._id;
                const res = await axios.post(`${ipurl}/add-connected-user`, {
                  username:userN,
                  userIDToAdd: userID,
                });
                if (res.status === 200) {
                  //   navigation.navigate("Home");
                  try{
                    const response = await axios.get(
                      `${ipurl}/getuser/${userN.trim()}`
                    );
                    const userID = await response.data.user._id;
                    const res = await axios.post(`${ipurl}/add-connected-user`, {
                      username:username,
                      userIDToAdd: userID,
                    });
                    if(res.status===200){
                      Alert.alert("user added successfully");
                      navigation.navigate("Home", {
                        userN: userN,
                      });
                    }
                  }catch (error) {
                    console.error("Error adding user:", error);
                    Alert.alert(
                      "Error",
                      "An error occurred while adding the user."
                    );
                  }
                  
                } else {
                  Alert.alert("Error", "Failed to add user. Please try again.");
                }
              } catch (error) {
                console.error("Error adding user:", error);
                Alert.alert(
                  "Error",
                  "An error occurred while adding the user."
                );
              }
            } else {
              Alert.alert(
                "Invalid QR",
                "This QR code is not valid for this app."
              );
            }
          }
        }}
        enableTorch={flashlight}
      >
        <View style={styles.buttonContainer}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={pickImage}>
              <MaterialCommunityIcons name="image" size={40} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFlashlight}>
              <Entypo
                name="flashlight"
                size={30}
                color="white"
                style={{ marginLeft: 20 }}
              />
            </TouchableOpacity>
          </View>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
      </CameraView>
    </View>
  );
};

export default ScannerScreen;
