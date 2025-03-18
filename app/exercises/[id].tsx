import React, { useState } from 'react';
import { Text, Button, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ExercisePlayer from '@/components/ExercisePlayer';
import { Exercises } from '@/constants/Exercises';
import { intervalDistances, difficultyLevelString, DifficultyLevel } from '@/constants/Values';

const Exercise = () => {
    
    const [exerciseNum, setExerciseNum] = useState(0);
    const [correctNum, setCorrectNum] = useState(0);

    const params = useLocalSearchParams();
    const { id } = params as { id: string };
    const exercise = Exercises.find(ex => ex.title == id);
    if (!exercise) {
        return <Text>Exercise not found</Text>;
    }

    const intervalDifficulties: { [key: string]: DifficultyLevel } = {
        // Why does IDE not understand that the properties of this can only be DifficultyLevel? that was the whole point :(
        // Also there surely is a less convoluted way to do this that ensures type safety and will actually error any typos
        rangeDifficulty: difficultyLevelString.easy,
        sizeDifficulty: difficultyLevelString.easy,
        outOfTuneDifficulty: difficultyLevelString.intermediate,
    }

    const [inTune, setInTune] = useState(Math.random() < 0.5); // Randomly set inTune to true or false
    const [audioDetails, setAudioDetails] = useState(exercise.generateNotes(inTune, intervalDifficulties));
    const [prevAudioDetails, setPrevAudioDetails] = useState(audioDetails);

    const prevExerciseString = () => {
        const { notes, centsOutOfTune } = prevAudioDetails;
        const base = `Previous Exercise: ${intervalDistances[Math.abs(notes[1].midi-notes[0].midi)%12]}, ` // Note adjustment for modulo instead of js remainder operator
        if (centsOutOfTune == 0) {
            return base + "In Tune";
        }
        const tuning = (centsOutOfTune < 0) ? "Too Narrow" : "Too Wide"; // Note that this makes perfect unison alwayes too wide
        return base + tuning + ` (${Math.abs(centsOutOfTune)} cents)`;
    }

    const handleAnswer = (answer: string) => {
        setExerciseNum(exerciseNum + 1);
        if (answer === exercise.getCorrectAnswer(inTune)) {
            setCorrectNum(correctNum + 1);
        }
        // Set up next exercise
        setPrevAudioDetails(audioDetails);
        setInTune(Math.random() < 0.5); 
        setAudioDetails(exercise.generateNotes(inTune, intervalDifficulties));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text0}>{id}</Text>
            <Text>Correct: {correctNum}/{exerciseNum}</Text>
            <ExercisePlayer soundScript={exercise.soundScript(audioDetails.notes) } />
            <Text>Sound Script (debug): {exercise.soundScript(audioDetails.notes)}</Text>
            <View style={styles.answersContainer}>
                {exercise.answerChoices.map((choice, index) => (
                    <Button key={index} title={choice} onPress={() => handleAnswer(choice)} />
                ))}
            </View>
            <View>
                {exerciseNum > 0 && <Text>{prevExerciseString()}</Text>}
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