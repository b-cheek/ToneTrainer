import React, { useState } from 'react';
import { Text, Button, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ExercisePlayer from '@/components/ExercisePlayer';
import Slider from '@react-native-community/slider';
import { Exercises } from '@/constants/Exercises';

const Exercise = () => {
    
    const [exerciseNum, setExerciseNum] = useState(0);
    const [correctNum, setCorrectNum] = useState(0);

    const params = useLocalSearchParams();
    const { id } = params as { id: string };
    const exercise = Exercises.find(ex => ex.title == id);
    if (!exercise) {
        return <Text>Exercise not found</Text>;
    }

    const [exerciseState, setExerciseState] = useState(() => {
        const inTune = Math.random() < 0.5;
        const sliderDifficulties = Object.entries(exercise.difficultyRanges).reduce((acc, [key, value]) => {
            acc[key] = value[0];
            return acc;
        }, {} as Record<string, number>);
        return {
            sliderDifficulties: sliderDifficulties,
            inTune: inTune,
            audioDetails: exercise.generateNotes(inTune, sliderDifficulties),
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
        setExerciseState((prevState) => ({
            ...prevState, // Retain previous state (slider difficulties)
            inTune: inTune,
            // audioDetails: exercise.generateNotes(inTune, sliderDifficulties),
            audioDetails: exercise.generateNotes(inTune, exerciseState.sliderDifficulties),
            prevExerciseString: exerciseState.audioDetails.feedback,
        }));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text0}>{id}</Text>
            
            {/* <FontAwesome name="gear" size={24} color="black" /> */}
            <Text>Correct: {correctNum}/{exerciseNum}</Text>
            <ExercisePlayer soundScript={exercise.soundScript(exerciseState.audioDetails.notes) } />
            <Text>Debug</Text>
            <Text>Intune: {exerciseState.inTune ? "in tune" : "out of tune"}</Text>
            <Text>Difficulties: {JSON.stringify(exerciseState.sliderDifficulties)}</Text>
            <Text>Sound Script: {exercise.soundScript(exerciseState.audioDetails.notes)}</Text>
            <View style={styles.answersContainer}>
                {exercise.answerChoices.map((choice, index) => (
                    <Button key={index} title={choice} onPress={() => handleAnswer(choice)} />
                ))}
            </View>
            <View>
                {exerciseNum > 0 && <Text>{exerciseState.prevExerciseString}</Text>}
            </View>
            <Text>Settings</Text>
            <View>
                {Object.keys(exercise.difficultyRanges).map((key) => (
                    <View key={key}>
                        <Text>{key}</Text>
                        <Slider
                            style={{ width: 200, height: 40 }}
                            minimumValue={0}
                            maximumValue={1}
                            onValueChange={(value) => {
                                // Update the difficulty level
                                setExerciseState((prevState) => ({
                                    ...prevState,
                                    sliderDifficulties: {
                                        ...prevState.sliderDifficulties,
                                        [key]: value*exercise.difficultyRanges[key][1] + (1-value)*exercise.difficultyRanges[key][0],
                                    },
                                }));
                            }}
                        />
                    </View>
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