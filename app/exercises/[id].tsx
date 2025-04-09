import { useState } from 'react';
import { Text, Button, StyleSheet, View, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import ExercisePlayer from '@/components/ExercisePlayer';
import ExerciseSettings from '@/components/ExerciseSettings';
import { soundScript, Exercises, ExerciseData } from '@/constants/Exercises';
import { globalStyles } from '@/constants/Styles';
import Storage from 'expo-sqlite/kv-store';

export const Exercise = () => {

    // Routing and initialization
    const params = useLocalSearchParams();
    const { id } = params as { id: string };
    const exercise = Exercises[id];
    const serialized = Storage.getItemSync(id);
    if (exercise === undefined || serialized === null) {
        return <Text>Exercise not found</Text>;
    }
    const initialData: ExerciseData = JSON.parse(serialized);

    // non-exercise related state
    const [exerciseNum, setExerciseNum] = useState(initialData.completed);
    const [correctNum, setCorrectNum] = useState(initialData.correct);
    const [debug, setDebug] = useState(false); // Debug mode to show additional information

    // All exercise related state controlled by single exerciseState object
    const [exerciseState, setExerciseState] = useState(() => {
        const inTune = Math.random() < 0.5;
        const sliderDifficulties = Object.entries(exercise.difficultyRanges).reduce((acc, [key, value]) => {
            acc[key] = value[0];
            return acc;
        }, {} as Record<string, number>);
        return {
            instrument: "synthesizer", // Default instrument, can be changed later
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
            <ExercisePlayer soundScript={soundScript(exerciseState.audioDetails.notes)} instrument={exerciseState.instrument} />
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
                <Text>Exercise state: {JSON.stringify(exerciseState)}</Text>
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
            <ExerciseSettings
                instrument={exerciseState.instrument}
                difficultyRanges={exercise.difficultyRanges}
                onInstrumentChange={(instrument) =>
                    setExerciseState((prev) => ({ ...prev, instrument }))
                }
                onDifficultyChange={(key, value) =>
                    setExerciseState((prev) => ({
                    ...prev,
                    sliderDifficulties: {
                        ...prev.sliderDifficulties,
                        [key]: value,
                    },
                    }))
                }
        />
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