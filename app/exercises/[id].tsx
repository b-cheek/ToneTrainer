import React, { useState } from 'react';
import { Text, Button, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ExercisePlayer from '@/components/ExercisePlayer';
import { Exercises } from '@/constants/Exercises';

const Exercise = () => {
    
    const [exerciseNum, setExerciseNum] = useState(0);
    const [correctNum, setCorrectNum] = useState(0);
    const [exerciseAnswer, setExerciseAnswer] = useState('');

    const params = useLocalSearchParams();
    const { id } = params as { id: string };
    const exercise = Exercises.find(ex => ex.title == id);
    if (!exercise) {
        return <Text>Exercise not found</Text>;
    }

    const inTune = Math.random() < 0.5;
    const notes = exercise.generateNotes(inTune);

    const handleAnswer = (answer: string) => {
        setExerciseAnswer(answer);
        setExerciseNum(exerciseNum + 1);
        if (answer === exercise.getCorrectAnswer(inTune)) {
            setCorrectNum(correctNum + 1);
        }
        // alert(exercise.soundScript(notes)); // Debugging
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text0}>{id}</Text>
            <Text>Correct: {correctNum}/{exerciseNum}</Text>
            <ExercisePlayer soundScript={exercise.soundScript(notes) } />
            <View style={styles.answersContainer}>
                {exercise.answerChoices.map((choice, index) => (
                    <Button key={index} title={choice} onPress={() => handleAnswer(choice)} />
                ))}
            </View>
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
    answersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15,
        backgroundColor: 'lightgray',
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
});

export default Exercise;