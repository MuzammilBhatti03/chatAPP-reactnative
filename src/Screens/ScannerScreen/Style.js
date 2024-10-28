import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "flex-end",
        alignSelf: "center",
        bottom: 60,
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
        borderRadius: 15,
    },
})