import { StyleSheet } from "react-native";
import {} from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#22283F",
    paddingHorizontal: 20,
  },
  list: {
    flex: 1,
  },
  addButton: {
    position: "absolute",
    bottom: 20, // Adjust this value based on your preference
    right: 20, // Adjust this value based on your preference
    backgroundColor: "transparent",
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
    color: "white",
    fontSize: 16,
  },
  profileText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    backgroundColor: "green",
    padding: 10,
    marginRight: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "red",
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
