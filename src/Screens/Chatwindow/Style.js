import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#22283F",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      },
      header: {
        flexDirection: "row",
        backgroundColor: "#333B56",
        alignItems: "center",
        padding: 10,
      },
      topicTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
      },
      topicDescription: {
        fontSize: 14,
        color: "#bbb",
      },
      messagesList: {
        flex: 1,
        marginBottom: 0,
        paddingBottom: 50,
      },
      messageContainer: {
        marginVertical: 7,
        maxWidth: "80%", // Limit message width
      },
      userMessageContainer: {
        alignSelf: "flex-end", // Align user messages to the right
      },
      otherMessageContainer: {
        alignSelf: "flex-start", // Align other messages to the left
      },
      itemImage: {
        marginLeft: 5,
        width: 50,
        height: 50,
        borderRadius: 25,
      },
      userName: {
        paddingLeft: 10,
        fontWeight: "bold",
        color: "#fff",
      },
      messageContent: {
        padding: 10,
        borderRadius: 25,
      },
      userMessageContent: {
        backgroundColor: "#4A90E2", // User message background color
      },
      otherMessageContent: {
        backgroundColor: "#333B56", // Other messages background color
      },
      inputContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
      input: {
        flex: 1,
        borderColor: "#bbb",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        color: "white",
        backgroundColor: "rgb(31,35,47)",
        maxHeight: 150,
        minHeight: 50,
      },
      sendButton: {
        backgroundColor: "rgb(254,44,120)",
        padding: 8,
        borderRadius: 10,
      },
      date: {
        justifyContent: "center",
        marginLeft: "34%",
        maxWidth: 100,
        minWidth: 100,
        borderRadius: 10,
        padding: 5,
        alignItems: "center",
        backgroundColor: "#333B56",
      },
})