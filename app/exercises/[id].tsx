import { useState, useContext } from 'react';
import { Text, Button, StyleSheet, View, ScrollView, Modal, Pressable } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import ExerciseSettings from '@/components/ExerciseSettings';
import { soundScript, Exercises } from '@/constants/Exercises';
import { globalStyles } from '@/constants/Styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SheetMusicPreview from '@/components/SheetMusicPreview';
import { development, midiToAbc, tuningSystems } from '@/constants/Values';
import { updateExercise, GlobalsContext, GlobalsDispatchContext } from '@/components/GlobalsProvider';

export const Exercise = () => {
    // Routing and initialization
    const params = useLocalSearchParams();
    const { id } = params as { id: string };
    const exercise = Exercises[id];
    const globals = useContext(GlobalsContext);
    const dispatch = useContext(GlobalsDispatchContext);
    if (exercise === undefined) {
        return <Text>Exercise not found</Text>;
    }

    // non-exercise related state
    const [debug, setDebug] = useState(false); // Debug mode to show additional information
    const [showSettings, setShowSettings] = useState(false);
    const [sliderValues, setSliderValues] = useState<Record<string, number>>({}); 

    // sliderValues is considered non-exercise related since it is purely visual
    // for the sliders to modify difficulty, not representative of the difficulty itself

    // All exercise related state controlled by single exerciseState object
    const [exerciseState, setExerciseState] = useState(() => {
        const inTune = Math.random() < 0.5;
        const tuningSystem = tuningSystems[Math.floor(Math.random() * tuningSystems.length)];
        const sliderDifficulties = Object.entries(exercise.difficultyRanges).reduce((acc, [key, value]) => {
            acc[key] = value[0];
            return acc;
        }, {} as Record<string, number>);
        return {
            activeInstruments: ["piano"],
            sliderDifficulties: sliderDifficulties,
            inTune: inTune,
            tuningSystem: tuningSystem,
            staggered: false,
            showSheetMusic: true,
            audioDetails: exercise.generateNotes(inTune, tuningSystem, sliderDifficulties),
            prevExerciseString: "",
        }
    });

    const generateAbcString = (notes: { midi: number, detune?: number }[]) =>
        (exerciseState.staggered)
            ? `X: 1\\nL:1/4\\n${notes.map(note => midiToAbc[note.midi]).join("")}`
            : `X: 1\\nL:1/4\\n[${notes.map(note => midiToAbc[note.midi]).join("")}]`;

    const handleAnswer = async (answer: string) => {
        // Debugging
        // alert(`inTune: ${exerciseState.inTune}, Correct Answer: ${exercise.getCorrectAnswer(exerciseState.inTune)}, Your Answer: ${answer}`);
        await updateExercise(id, { completed: globals.db.exercises[id].completed + 1 }, dispatch);
        if (answer === (exerciseState.inTune ? "In Tune" : "Out of Tune")
        || answer === exerciseState.tuningSystem) {
            await updateExercise(id, { correct: globals.db.exercises[id].correct + 1 }, dispatch);
        }

        // Set up next exercise
        const inTune = Math.random() < 0.5;
        const tuningSystem = tuningSystems[Math.floor(Math.random() * tuningSystems.length)];
        setExerciseState((prevState) => ({
            ...prevState, // Retain previous state (slider difficulties)
            inTune: inTune,
            tuningSystem: tuningSystem,
            audioDetails: exercise.generateNotes(inTune, tuningSystem, exerciseState.sliderDifficulties),
            prevExerciseString: exerciseState.audioDetails.feedback,
        }));
    }

    return (
        <ScrollView contentContainerStyle={{...globalStyles.container, paddingBottom: 20}}>
            <Stack.Screen options={{
                title: "Exercise",
                headerRight: () => (
                    <Pressable onPressOut={() => setShowSettings(!showSettings)} style={styles.icon}>
                        <FontAwesome
                            name="gear"
                            size={24}
                            color="black"
                        />
                    </Pressable>
                )
            }} />
            <Text style={globalStyles.text0}>{exercise.title}</Text>
            <Text>Correct: {globals.db.exercises[id].correct}/{globals.db.exercises[id].completed}</Text>
            <View style={{ marginTop: 15 }}>
                <Button title="Play" onPress={() => {
                    globals.webviewRef.current!.injectJavaScript(
                        soundScript(exerciseState.audioDetails.notes, exerciseState.activeInstruments, exerciseState.staggered)
                    );
                }} />
            </View>
            {development && <Button
                title="toggle debug"
                onPress={() => {
                    // Toggle debug mode
                    setDebug(!debug);
                }}
            />}
            { debug && (
            <View>
                <Text>Debug</Text>
                <Text>Exercise state: {JSON.stringify(exerciseState)}</Text>
                <Text>Sound Script: {soundScript(exerciseState.audioDetails.notes, exerciseState.activeInstruments, exerciseState.staggered)}</Text>
                <Text>ABC String: {generateAbcString(exerciseState.audioDetails.notes)} </Text>
            </View>
            )}
            <View style={styles.answersContainer}>
                {exercise.answerChoices.map((choice, index) => (
                    <Button key={index} title={choice} onPress={() => handleAnswer(choice)} />
                ))}
            </View>
            {globals.db.exercises[id].completed > 0 && <Text style={{ textAlign: 'center' }}>{exerciseState.prevExerciseString}</Text>}
            {exerciseState.showSheetMusic && <SheetMusicPreview
                // TODO: make this toggleable in exercise settings
                abcString={generateAbcString(exerciseState.audioDetails.notes)}
                scale={(exerciseState.staggered)
                    ? -0.5 * exerciseState.sliderDifficulties.complexity + 8 || 8
                    : 8
                }
            />}
            <Modal
                animationType="slide"
                visible={showSettings}
                transparent={true}
                onRequestClose={() => setShowSettings(false)}
            >
                <SafeAreaProvider>
                    <SafeAreaView style={styles.modal}>
                        <Pressable onPress={() => setShowSettings(false)} style={styles.close}>
                            <FontAwesome
                                name="close"
                                size={24}
                                color="black"
                            />
                        </Pressable>
                        <ExerciseSettings
                            activeInstruments={exerciseState.activeInstruments}
                            difficultyRanges={exercise.difficultyRanges}
                            sliderValues={sliderValues}
                            staggered={exerciseState.staggered}
                            showSheetMusic={exerciseState.showSheetMusic}
                            onInstrumentsChange={(instruments: string[]) => setExerciseState((prev) => ({ ...prev, activeInstruments: instruments }))}
                            onDifficultyChange={(key: string, value: number) =>
                                setExerciseState((prev) => ({
                                ...prev,
                                sliderDifficulties: {
                                    ...prev.sliderDifficulties,
                                    [key]: value,
                                },
                                }))
                            }
                            onSliderChange={(key: string, value: number) => setSliderValues((prev) => ({ ...prev, [key]: value }))}
                            onStaggeredChange={(staggered: boolean) => setExerciseState((prev) => ({ ...prev, staggered }))}
                            onShowSheetMusicChange={(showSheetMusic: boolean) => setExerciseState((prev) => ({ ...prev, showSheetMusic }))}
                        />
                    </SafeAreaView>
                </SafeAreaProvider>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    answersContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15,
        backgroundColor: 'lightgray',
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        margin: 15
    },

    modal: {
        backgroundColor: 'white',
        padding: 20,
        paddingTop: 0,
        flex: 1
    },
    
    icon: {
        padding: 15
    },

    close: {
        padding: 15,
        marginLeft: "auto"
    },
});

export default Exercise;