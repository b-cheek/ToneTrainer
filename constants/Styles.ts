import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text0: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
    },
    text1: {
        fontSize: 20,
        textDecorationLine: 'underline',
        marginTop: 20,
        marginBottom: 20,
    },
    column: {
        display: 'flex',
        flexDirection: 'column'
    },
    row: {
        display: 'flex',
        flexDirection: 'row'
    },
    icon: {
        marginRight: 0
    },
    maxHeight: {
        height: '100%'
    },
    maxWidth: {
        width: '100%'
    }
});