import { Text, Button, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ExercisePlayer from '@/components/ExercisePlayer';

const Exercise = () => {
    
    const params = useLocalSearchParams();
    const { id } = params as { id: string };

    return (
        <View style={styles.container}>
            <Text style={styles.text0}>{id}</Text>
            <ExercisePlayer />
        </View>
    );
}

const styles = StyleSheet.create({
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
});

export default Exercise;