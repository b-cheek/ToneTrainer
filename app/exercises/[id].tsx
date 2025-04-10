import { useState } from 'react';
import { Text, Button, StyleSheet, View, ScrollView, Modal } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import ExercisePlayer from '@/components/ExercisePlayer';
import ExerciseSettings from '@/components/ExerciseSettings';
import { soundScript, Exercises, ExerciseData } from '@/constants/Exercises';
import { globalStyles } from '@/constants/Styles';
import Storage from 'expo-sqlite/kv-store';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
    const [showSettings, setShowSettings] = useState(false);
    const [sliderValues, setSliderValues] = useState<Record<string, number>>({}); 

    // sliderValues is considered non-exercise related since it is purely visual
    // for the sliders to modify difficulty, not representative of the difficulty itself

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
            <FontAwesome.Button name="gear" size={24} color="black" onPress={() => setShowSettings(!showSettings)}/>
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
            <Modal
                animationType="slide"
                visible={showSettings}
                transparent={true}
                onRequestClose={() => setShowSettings(false)}
            >
                <View style={styles.modalContent}>
                    <FontAwesome.Button 
                        name="close" 
                        size={24} 
                        color="black" 
                        onPress={() => setShowSettings(false)} 
                    />
                    <ExerciseSettings
                        instrument={exerciseState.instrument}
                        difficultyRanges={exercise.difficultyRanges}
                        sliderValues={sliderValues}
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
                        onSliderChange={(key, value) => setSliderValues((prev) => ({ ...prev, [key]: value }))}
                    />
                </View>
            </Modal>
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

    modalContent: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Exercise;