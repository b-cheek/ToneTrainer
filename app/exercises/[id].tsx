import { useState } from 'react';
import { Text, Button, StyleSheet, View, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import ExercisePlayer from '@/components/ExercisePlayer';
import Slider from '@react-native-community/slider';
import { soundScript, Exercises, ExerciseData } from '@/constants/Exercises';
import { Picker } from '@react-native-picker/picker';
import { instrumentNames } from '@/constants/Values';
import { globalStyles } from '@/constants/Styles';
import Storage from 'expo-sqlite/kv-store';

export const Exercise = () => {
    const [debug, setDebug] = useState(false); // Debug mode to show additional information
    const params = useLocalSearchParams();
    const { id } = params as { id: string };
    const exercise = Exercises[id];
    const serialized = Storage.getItemSync(id);
    if (exercise === undefined || serialized === null) {
        return <Text>Exercise not found</Text>;
    }
    const initialData: ExerciseData = JSON.parse(serialized);
    const [exerciseNum, setExerciseNum] = useState(initialData.completed);
    const [correctNum, setCorrectNum] = useState(initialData.correct);

    const [exerciseState, setExerciseState] = useState(() => {
        const inTune = Math.random() < 0.5;
        const sliderDifficulties = Object.entries(exercise.difficultyRanges).reduce((acc, [key, value]) => {
            acc[key] = value[0];
            return acc;
        }, {} as Record<string, number>);
        return {
            instrument: "Synthesizer", // Default instrument, can be changed later
            sliderDifficulties: sliderDifficulties,
            inTune: inTune,
            audioDetails: exercise.generateNotes(inTune, sliderDifficulties),
            prevExerciseString: "",
        }
    });

    const handleAnswer = async (answer: string) => {
        // Debugging
        // alert(`inTune: ${exerciseState.inTune}, Correct Answer: ${exercise.getCorrectAnswer(exerciseState.inTune)}, Your Answer: ${answer}`);
        const newCompleted = exerciseNum + 1;
        setExerciseNum(newCompleted);
        await Storage.mergeItem(id, JSON.stringify({ completed: newCompleted }));
        if (answer === exercise.getCorrectAnswer(exerciseState.inTune)) {
            const newCorrect = correctNum + 1;
            setCorrectNum(newCorrect);
            await Storage.mergeItem(id, JSON.stringify({ correct: newCorrect }));
        }
        // Set up next exercise
        const inTune = Math.random() < 0.5;
        setExerciseState((prevState) => ({
            ...prevState, // Retain previous state (slider difficulties)
            inTune: inTune,
            audioDetails: exercise.generateNotes(inTune, exerciseState.sliderDifficulties),
            prevExerciseString: exerciseState.audioDetails.feedback,
        }));
    }

    return (
        <ScrollView contentContainerStyle={{...globalStyles.container, paddingBottom: 20}}>
            <Stack.Screen options={{ title: exercise.title }}/>
            <Text>Correct: {correctNum}/{exerciseNum}</Text>
            <ExercisePlayer soundScript={soundScript(exerciseState.audioDetails.notes) } />
            <Button
                title="toggle debug"
                onPress={() => {
                    // Toggle debug mode
                    setDebug(!debug);
                }}
            />

            { debug && (
            <View>
                <Text>Debug</Text>
                <Text>Intune: {exerciseState.inTune ? "in tune" : "out of tune"}</Text>
                <Text>Difficulties: {JSON.stringify(exerciseState.sliderDifficulties)}</Text>
                <Text>Sound Script: {soundScript(exerciseState.audioDetails.notes)}</Text>
            </View>
            )}
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
                <Picker
                    selectedValue={exerciseState.instrument}
                    onValueChange={(itemValue) => {
                        setExerciseState((prevState) => ({
                            ...prevState,
                            instrument: itemValue as string,
                        }));
                    }}
                >
                    {instrumentNames.map((instrument) => (
                        <Picker.Item key={instrument} label={instrument} value={instrument} color='black' />
                    ))}
                </Picker>
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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