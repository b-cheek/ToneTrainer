import { useEffect, useRef, useState, useContext } from 'react';
import { Text, Button, StyleSheet, View, ScrollView, Modal } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import ExercisePlayer from '@/components/ExercisePlayer';
import ExerciseSettings from '@/components/ExerciseSettings';
import { soundScript, Exercises } from '@/constants/Exercises';
import { globalStyles } from '@/constants/Styles';
import { createInstrumentUris, injectInstrumentSampler } from '@/utils/InstrumentSampler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import WebView from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SheetMusicPreview from '@/components/SheetMusicPreview';
import { midiToAbc, tuningSystems } from '@/constants/Values';
import { updateExercise, DatabaseContext, DatabaseDispatchContext } from '@/components/DatabaseProvider';

export const Exercise = () => {
    // Routing and initialization
    const params = useLocalSearchParams();
    const { id } = params as { id: string };
    const exercise = Exercises[id];
    const database = useContext(DatabaseContext);
    const dispatch = useContext(DatabaseDispatchContext);
    if (exercise === undefined) {
        return <Text>Exercise not found</Text>;
    }

    // non-exercise related state
    const [debug, setDebug] = useState(false); // Debug mode to show additional information
    const [showSettings, setShowSettings] = useState(false);
    const [sliderValues, setSliderValues] = useState<Record<string, number>>({}); 
    const [injectedInstruments, setInjectedInstruments] = useState<string[]>([]);

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
            audioDetails: exercise.generateNotes(inTune, tuningSystem, sliderDifficulties),
            prevExerciseString: "",
        }
    });

    const [instrumentUris, setInstrumentUris] = useState<Record<string, Record<string, string>> | null>(null);
    const [instrumentUrisSet, setInstrumentUrisSet] = useState<boolean>(false);
    const [webviewLoaded, setWebviewLoaded] = useState<boolean>(false);
    const webviewRef = useRef<WebView | null>(null);

    useEffect(() => {
        const loadAudio = async () => {
            const uris = await createInstrumentUris();
            setInstrumentUris(uris);
            setInstrumentUrisSet(true);
        };
        loadAudio();
    }, []);

    useEffect(() => {
        if (instrumentUrisSet && webviewLoaded) {
            for (const instrument of exerciseState.activeInstruments) {
                // Note that you have to re-inject the instrument sampler every time the WebView is loaded
                // this could be more efficient by keeping the same webview loaded (TODO)
                // but this is not a priority for now
                if (instrumentUris) {
                    setInjectedInstruments((prev) => [...prev, instrument]);
                    injectInstrumentSampler(webviewRef, instrument, instrumentUris);
                }
            }
        }
    }, [instrumentUrisSet, webviewLoaded]);

    const prepareForWebViewLoad = () => {
        setWebviewLoaded(false);
    }

    const handleWebViewLoad = () => {
        setWebviewLoaded(true);
    };

    const generateAbcString = (notes: { midi: number, detune?: number }[]) => {
        return `X: 1\\nL:1/4\\n[${notes.map(note => midiToAbc[note.midi]).join("")}]`;
        // return "X:1\\nK:D\\nDD AA|BBA2|\\n";
    }

    const handleAnswer = async (answer: string) => {
        // Debugging
        // alert(`inTune: ${exerciseState.inTune}, Correct Answer: ${exercise.getCorrectAnswer(exerciseState.inTune)}, Your Answer: ${answer}`);
        await updateExercise(id, { completed: database.exercises[id].completed + 1 }, dispatch);
        if (answer === (exerciseState.inTune ? "In Tune" : "Out of Tune")
        || answer === exerciseState.tuningSystem) {
            await updateExercise(id, { correct: database.exercises[id].correct + 1 }, dispatch);
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
            <Stack.Screen options={{ title: exercise.title }}/>
            <FontAwesome.Button name="gear" size={24} color="black" onPress={() => setShowSettings(!showSettings)}/>
            <Text>Correct: {database.exercises[id].correct}/{database.exercises[id].completed}</Text>
            {
                instrumentUrisSet
                ? <ExercisePlayer
                    ref={webviewRef}
                    soundScript={soundScript(exerciseState.audioDetails.notes, exerciseState.activeInstruments)}
                    onLoadStart={prepareForWebViewLoad}
                    onLoadEnd={handleWebViewLoad} // Call injectInstruments when WebView is loaded
                />
                : <Text>Loading instruments...</Text>
            }
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
                <Text>ABC String: {generateAbcString(exerciseState.audioDetails.notes)} </Text>
            </View>
            )}
            <View style={styles.answersContainer}>
                {exercise.answerChoices.map((choice, index) => (
                    <Button key={index} title={choice} onPress={() => handleAnswer(choice)} />
                ))}
            </View>
            <View>
                {database.exercises[id].completed > 0 && <Text>{exerciseState.prevExerciseString}</Text>}
            </View>
            <SheetMusicPreview
                // TODO: make this toggleable in exercise settings
                abcString={generateAbcString(exerciseState.audioDetails.notes)}
            />
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
                                for (const instrument of instruments) {
                                    // Eliminate redundant injections while changing settings
                                    if (instrumentUris && !injectedInstruments.includes(instrument)) {
                                        setInjectedInstruments((prev) => [...prev, instrument]);
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