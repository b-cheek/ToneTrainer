import React from 'react';
import { Text, Button, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ExercisePlayer from '@/components/ExercisePlayer';
import { Exercises } from '@/constants/Exercises';

const Exercise = () => {
    
    const params = useLocalSearchParams();
    const { id } = params as { id: string };
    const soundScript = Exercises.find(ex => ex.title == id)?.soundScript ?? 'alert("No sound script found for this exercise")';

    return (
        <View style={styles.container}>
            <Text style={styles.text0}>{id}</Text>
            <ExercisePlayer soundScript={soundScript} />
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