import React, { useState, useEffect } from 'react';
import { Text, Button, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ExercisePlayer from '@/components/ExercisePlayer';
import { Exercises } from '@/constants/Exercises';
import { Note } from '@/constants/Exercises';
import { intervalDistances } from '@/constants/Values';

const Exercise = () => {
    
    const [exerciseNum, setExerciseNum] = useState(0);
    const [correctNum, setCorrectNum] = useState(0);

    const params = useLocalSearchParams();
    const { id } = params as { id: string };
    const exercise = Exercises.find(ex => ex.title == id);
    if (!exercise) {
        return <Text>Exercise not found</Text>;
    }

    const [inTune, setInTune] = useState(Math.random() < 0.5); // Randomly set inTune to true or false
    const [notes, setNotes] = useState<Note[]>([]);
    const [centsOutOfTune, setCentsOutOfTune] = useState(0);
    const [prevNotes, setPrevNotes] = useState<Note[]>([]);
    const [prevTuning, setPrevTuning] = useState(0);

    // Generate initial notes on component mount
    useEffect(() => {
        const initialNotes = exercise.generateNotes(inTune);
        setNotes(initialNotes.notes);
        setCentsOutOfTune(initialNotes.centsOutOfTune);
    }, []);

    const prevExerciseString = () => {
        const base = `Previous Exercise: ${intervalDistances[(prevNotes[1].midi-prevNotes[0].midi+12)%12]}, ` // Note adjustment for modulo instead of js remainder operator
        if (prevTuning == 0) {
            return base + "In Tune";
        }
        const tuning = (prevTuning < 0) ? "Too Narrow" : "Too Wide"; // Note that this makes perfect unison alwayes too wide
        return base + tuning + ` (${Math.abs(prevTuning)} cents)`;
    }

    const handleAnswer = (answer: string) => {
        setExerciseNum(exerciseNum + 1);
        if (answer === exercise.getCorrectAnswer(inTune)) {
            setCorrectNum(correctNum + 1);
        }
        // Set up next exercise
        setPrevNotes(notes);
        setPrevTuning(centsOutOfTune);
        setInTune(Math.random() < 0.5); 
        const newNotes = exercise.generateNotes(inTune);
        setNotes(newNotes.notes);
        setCentsOutOfTune(newNotes.centsOutOfTune);
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