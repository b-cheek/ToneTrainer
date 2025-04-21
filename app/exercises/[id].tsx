import { useEffect, useRef, useState, useContext } from 'react';
import { Text, Button, StyleSheet, View, ScrollView, Modal } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import ExercisePlayer from '@/components/ExercisePlayer';
import ExerciseSettings from '@/components/ExerciseSettings';
import { soundScript, Exercises } from '@/constants/Exercises';
import { globalStyles } from '@/constants/Styles';
import { injectInstrumentSampler } from '@/utils/InstrumentSampler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import WebView from 'react-native-webview';
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
            staggered: false,
            showSheetMusic: true,
            audioDetails: exercise.generateNotes(inTune, tuningSystem, sliderDifficulties),
            prevExerciseString: "",
        }
    });

    const [webviewLoaded, setWebviewLoaded] = useState<boolean>(false);
    const webviewRef = useRef<WebView | null>(null);

    useEffect(() => {
        if (webviewLoaded) {
            for (const instrument of exerciseState.activeInstruments) {
                // Note that you have to re-inject the instrument sampler every time the WebView is loaded
                // this could be more efficient by keeping the same webview loaded (TODO)
                // but this is not a priority for now
                setInjectedInstruments((prev) => [...prev, instrument]);
                injectInstrumentSampler(webviewRef, instrument, globals.instrumentUris);
            }
        }
    }, [webviewLoaded]);

    const prepareForWebViewLoad = () => {
        setWebviewLoaded(false);
    }

    const handleWebViewLoad = () => {
        setWebviewLoaded(true);
    };

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
        <ScrollView contentContainerStyle={{...globalStyles.container, paddingBottom: 20, paddingTop: 20}}>
            <Stack.Screen options={{ title: exercise.title }}/>
            <FontAwesome.Button name="gear" size={24} color="black" iconStyle={globalStyles.icon} onPress={() => setShowSettings(!showSettings)}/>
            <Text>Correct: {globals.db.exercises[id].correct}/{globals.db.exercises[id].completed}</Text>
            {
                <ExercisePlayer
                    ref={webviewRef}
                    soundScript={soundScript(exerciseState.audioDetails.notes, exerciseState.activeInstruments, exerciseState.staggered)}
                    onLoadStart={prepareForWebViewLoad}
                    onLoadEnd={handleWebViewLoad} // Call injectInstruments when WebView is loaded
                />
            }
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
            <View>
                {globals.db.exercises[id].completed > 0 && <Text>{exerciseState.prevExerciseString}</Text>}
            </View>
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
                    <SafeAreaView style={styles.modalContent}>
                        <FontAwesome.Button 
                            name="close" 
                            size={24} 
                            color="black" 
                            iconStyle={globalStyles.icon}
                            onPress={() => setShowSettings(false)} 
                        />
                        <ExerciseSettings
                            activeInstruments={exerciseState.activeInstruments}
                            difficultyRanges={exercise.difficultyRanges}
                            sliderValues={sliderValues}
                            staggered={exerciseState.staggered}
                            showSheetMusic={exerciseState.showSheetMusic}
                            onInstrumentsChange={(instruments: string[]) => {
                                const typedInstruments = instruments as ("bassoon" | "cello" | "clarinet" | "contrabass" | "flute" | "french_horn" | "piano" | "saxophone" | "synthesizer" | "trombone" | "trumpet" | "tuba" | "violin")[];
                                setExerciseState((prev) => ({ ...prev, activeInstruments: typedInstruments }));
                                for (const instrument of typedInstruments) {
                                    // Eliminate redundant injections while changing settings
                                    if (!injectedInstruments.includes(instrument)) {
                                        setInjectedInstruments((prev) => [...prev, instrument]);
                                        injectInstrumentSampler(webviewRef, instrument, globals.instrumentUris);
                                    }
                                }
                            }}
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