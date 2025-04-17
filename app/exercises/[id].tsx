import { useEffect, useRef, useState } from 'react';
import { Text, Button, StyleSheet, View, ScrollView, Modal } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import ExercisePlayer from '@/components/ExercisePlayer';
import ExerciseSettings from '@/components/ExerciseSettings';
import { soundScript, Exercises, ExerciseData } from '@/constants/Exercises';
import { globalStyles } from '@/constants/Styles';
import { createInstrumentUris, injectInstrumentSampler } from '@/utils/InstrumentSampler';
import Storage from 'expo-sqlite/kv-store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import WebView from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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
            activeInstruments: ["synthesizer"] as ("bassoon" | "cello" | "clarinet" | "contrabass" | "flute" | "french_horn" | "piano" | "saxophone" | "synthesizer" | "trombone" | "trumpet" | "tuba" | "violin")[],
            sliderDifficulties: sliderDifficulties,
            inTune: inTune,
            audioDetails: exercise.generateNotes(inTune, sliderDifficulties),
            prevExerciseString: "",
        }
    });

    const [instrumentUris, setInstrumentUris] = useState<Record<string, Record<string, string>> | null>(null);
    const webviewRef = useRef<WebView | null>(null);

    useEffect(() => {
        const loadAudio = async () => {
            const uris = await createInstrumentUris();
            setInstrumentUris(uris);
        };
        loadAudio();
    }, []);

    const handleWebViewLoad = () => {
        injectInstruments();
    };

    const injectInstruments = () => {
        for (const instrument of exerciseState.activeInstruments) {
            if (instrumentUris) {
                injectInstrumentSampler(webviewRef, instrument, instrumentUris);
            }
        }
    };

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
            <ExercisePlayer 
                ref={webviewRef}
                soundScript={soundScript(exerciseState.audioDetails.notes, exerciseState.activeInstruments)}
                onLoadEnd={handleWebViewLoad} // Call injectInstruments when WebView is loaded
            />
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
                <Text>Sound Script: {soundScript(exerciseState.audioDetails.notes, exerciseState.activeInstruments)}</Text>
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
                <SafeAreaProvider>
                    <SafeAreaView style={styles.modalContent}>
                        <FontAwesome.Button 
                            name="close" 
                            size={24} 
                            color="black" 
                            onPress={() => setShowSettings(false)} 
                        />
                        <ExerciseSettings
                            activeInstruments={exerciseState.activeInstruments}
                            difficultyRanges={exercise.difficultyRanges}
                            sliderValues={sliderValues}
                            onInstrumentsChange={(instruments) => {
                                setExerciseState((prev) => ({ ...prev, activeInstruments: instruments as typeof prev.activeInstruments }));
                                // TODO: eliminate redundant injections
                                for (const instrument of instruments) {
                                    if (instrumentUris) {
                                        injectInstrumentSampler(webviewRef, instrument, instrumentUris);
                                    }
                                }
                            }}
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
                    </SafeAreaView>
                </SafeAreaProvider>
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
        padding: 20,
    }
});

export default Exercise;