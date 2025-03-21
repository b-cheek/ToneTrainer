import React, { useState } from 'react';
import { Text, Button, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ExercisePlayer from '@/components/ExercisePlayer';
import { Exercises } from '@/constants/Exercises';
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
        size: difficultyLevelString.easy,
        outOfTune: difficultyLevelString.easy,
    }

    const [inTune, setInTune] = useState(Math.random() < 0.5); // Randomly set inTune to true or false
    const [audioDetails, setAudioDetails] = useState(exercise.generateNotes(inTune, intervalDifficulties));
    const [prevExerciseString, setPrevExerciseString] = useState("");

    const handleAnswer = (answer: string) => {
        // Debugging
        alert(`inTune: ${inTune}, Correct Answer: ${exercise.getCorrectAnswer(inTune)}, Your Answer: ${answer}`);
        setExerciseNum(exerciseNum + 1);
        if (answer === exercise.getCorrectAnswer(inTune)) {
            setCorrectNum(correctNum + 1);
        }
        // Set up next exercise
        setPrevExerciseString(audioDetails.feedback);
        setInTune(Math.random() < 0.5); 
        setAudioDetails(exercise.generateNotes(inTune, intervalDifficulties));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text0}>{id}</Text>
            <Text>Correct: {correctNum}/{exerciseNum}</Text>
            <ExercisePlayer soundScript={exercise.soundScript(audioDetails.notes) } />
            <Text>Debug</Text>
            <Text>Intune: {inTune ? "in tune" : "out of tune"}</Text>
            <Text>Sound Script: {exercise.soundScript(audioDetails.notes)}</Text>
            <View style={styles.answersContainer}>
                {exercise.answerChoices.map((choice, index) => (
                    <Button key={index} title={choice} onPress={() => handleAnswer(choice)} />
                ))}
            </View>
            <View>
                {exerciseNum > 0 && <Text>{prevExerciseString}</Text>}
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