import { StatusBar } from "react-native";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        padding: 20,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
    },
    messageLogoView: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 250,
        height: 150,
    },
    textView: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
    },
    talkText: {
        fontSize: 40,
        color: "white"
    },
    discussText: {
        fontSize: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
    },
    textInput1: {
        height: 50,
        borderColor: "white",
        backgroundColor: "white",
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginTop: 35,
    },
    buttonView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
    opacity: {
        height: 50,
        width: "100%",
        backgroundColor: "rgb(254,44,120)",
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    continueText: {
        color: "white"
    }

})