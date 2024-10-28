import React, { useRef } from "react";
import { SafeAreaView, Text, TouchableOpacity, View, Alert } from "react-native";
import { styles } from "./Style";
import QRCode from "react-native-qrcode-svg";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const QRScreen = ({ username,  }) => {
    const url = username;
    const qrCodeRef = useRef(null); // No type annotation needed in JS
    const navigation=useNavigation();

    const onShare = async () => {
        try {
            if (qrCodeRef.current) {
                const data = await new Promise((resolve) => {
                    qrCodeRef.current.toDataURL((data) => {
                        resolve(data);
                    });
                });

                if (data) {
                    const filePath = `${FileSystem.cacheDirectory}qr-code.png`;
                    await FileSystem.writeAsStringAsync(filePath, data, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    if (await Sharing.isAvailableAsync()) {
                        await Sharing.shareAsync(filePath);
                    } else {
                        Alert.alert(
                            "Sharing not available",
                            "The sharing feature is not supported on this platform."
                        );
                    }
                }
            }
        } catch (error) {
            console.error("Error sharing QR code:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <AntDesign name="close" size={24} color="black" style={styles.arrow} />
                <Text style={styles.qrText}>MY QR</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Scanner")}>
                    <MaterialIcons 
                        name="qr-code-scanner" 
                        size={24} 
                        color="white" 
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.qrContainer}>
                    <QRCode
                        value={url}
                        size={230}
                        color="#292f3f"
                        quietZone={30}
                        getRef={qrCodeRef}
                    />
                </View>
                <Text style={styles.transactionText}>Scan the QR to start chat</Text>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button} onPress={onShare}>
                        <Text style={styles.qrButtonText}>Share MY QR</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default QRScreen;
