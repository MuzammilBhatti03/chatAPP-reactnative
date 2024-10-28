import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#22283F",
        paddingHorizontal: 20,
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
})