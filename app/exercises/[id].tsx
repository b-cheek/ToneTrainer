import React, { useState } from 'react';
import { Text, Button, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ExercisePlayer from '@/components/ExercisePlayer';
import { soundScript, Exercises } from '@/constants/Exercises';
import { difficultyLevelString, DifficultyLevel } from '@/constants/Values';

const Exercise = () => {
    
    const [exerciseNum, setExerciseNum] = useState(0);
    const [correctNum, setCorrectNum] = useState(0);

    const params = useLocalSearchParams();
    const { id } = params as { id: string };
    const exercise = Exercises.find(ex => ex.title == id);
    if (!exercise) {
        return <Text>Exercise not found</Text>;
    }

    const intervalDifficulties: Record<string, DifficultyLevel> = {
        range: difficultyLevelString.easy,
        size: difficultyLevelString.advanced,
        complexity: difficultyLevelString.advanced,
        outOfTune: difficultyLevelString.easy,
    }

    const [exerciseState, setExerciseState] = useState(() => {
        const inTune = Math.random() < 0.5;
        return {
            inTune: inTune,
            audioDetails: exercise.generateNotes(inTune, intervalDifficulties),
            prevExerciseString: "",
        }
    });

    const handleAnswer = (answer: string) => {
        // Debugging
        // alert(`inTune: ${exerciseState.inTune}, Correct Answer: ${exercise.getCorrectAnswer(exerciseState.inTune)}, Your Answer: ${answer}`);
        setExerciseNum(exerciseNum + 1);
        if (answer === exercise.getCorrectAnswer(exerciseState.inTune)) {
            setCorrectNum(correctNum + 1);
        }
        // Set up next exercise
        const inTune = Math.random() < 0.5;
        setExerciseState({
            inTune: inTune,
            audioDetails: exercise.generateNotes(inTune, intervalDifficulties),
            prevExerciseString: exerciseState.audioDetails.feedback,
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text0}>{id}</Text>
            <Text>Correct: {correctNum}/{exerciseNum}</Text>
            <ExercisePlayer soundScript={soundScript(exerciseState.audioDetails.notes) } />
            <Text>Debug</Text>
            <Text>Intune: {exerciseState.inTune ? "in tune" : "out of tune"}</Text>
            <Text>Sound Script: {soundScript(exerciseState.audioDetails.notes)}</Text>
            <View style={styles.answersContainer}>
                {exercise.answerChoices.map((choice, index) => (
                    <Button key={index} title={choice} onPress={() => handleAnswer(choice)} />
                ))}
            </View>
            <View>
                {exerciseNum > 0 && <Text>{exerciseState.prevExerciseString}</Text>}
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