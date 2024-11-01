import { Platform, StatusBar, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingHorizontal: 16,
        backgroundColor: '#292f3f'
    },
    topContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    qrText: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        flex: 1,
        color: 'white',
        paddingLeft:11
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    qrContainer: {
        borderRadius: 40,
        overflow: 'hidden',
    },
    transactionText: {
        fontSize: 18,
        marginTop: 20,
        textAlign: 'center',
        color: 'white'
    },
    buttonView: {
        marginTop: 50
    },
    button: {
        backgroundColor: '#9370DB',
        borderRadius: 25
    },
    qrButtonText: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        fontWeight: 'bold',
        color: 'white'
    }
})