import { Button, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Exercise() {
    
    const params = useLocalSearchParams();
    const { id } = params as { id: string };

    return (
        <View style={styles.container}>
            <Button title={id}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});