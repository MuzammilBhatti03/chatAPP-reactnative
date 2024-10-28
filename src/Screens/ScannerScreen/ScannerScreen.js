import React, { useEffect, useRef, useState } from "react";
import { AppState, Button, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./Style";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";

const ScannerScreen = ({ navigation }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [image, setImage] = useState(null); // No need for `string | null`
    const [flashlight, setFlashLight] = useState(false);
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);

    const toggleFlashlight = () => {
        setFlashLight(!flashlight);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

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

        return () => {
            subscription.remove();
        };
    }, []);

    if (!permission) {
        return <View />;
    }

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
                onBarcodeScanned={({ data }) => {
                    if (data && !qrLock.current) {
                        qrLock.current = true;
                        setTimeout(async () => {
                            await Linking.openURL(data);
                        }, 500);
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
