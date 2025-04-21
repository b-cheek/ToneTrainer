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
import SheetMusicPreview from '@/components/SheetMusicPreview';
import { midiToAbc, tuningSystems } from '@/constants/Values';

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
            activeInstruments: ["piano"] as ("bassoon" | "cello" | "clarinet" | "contrabass" | "flute" | "french_horn" | "piano" | "saxophone" | "synthesizer" | "trombone" | "trumpet" | "tuba" | "violin")[],
            sliderDifficulties: sliderDifficulties,
            inTune: inTune,
            tuningSystem: tuningSystem,
            staggered: false,
            showSheetMusic: true,
            audioDetails: exercise.generateNotes(inTune, tuningSystem, sliderDifficulties),
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
        for (const instrument of exerciseState.activeInstruments) {
            // Note that you have to re-inject the instrument sampler every time the WebView is loaded
            // this could be more efficient by keeping the same webview loaded (TODO)
            // but this is not a priority for now
            if (instrumentUris) {
                setInjectedInstruments((prev) => [...prev, instrument]);
                injectInstrumentSampler(webviewRef, instrument, instrumentUris);
            }
        }
    };

    const generateAbcString = (notes: { midi: number, detune?: number }[]) =>
        (exerciseState.staggered)
            ? `X: 1\\nL:1/4\\n${notes.map(note => midiToAbc[note.midi]).join("")}`
            : `X: 1\\nL:1/4\\n[${notes.map(note => midiToAbc[note.midi]).join("")}]`;

    const handleAnswer = async (answer: string) => {
        // Debugging
        // alert(`inTune: ${exerciseState.inTune}, Correct Answer: ${exercise.getCorrectAnswer(exerciseState.inTune)}, Your Answer: ${answer}`);
        const newCompleted = exerciseNum + 1;
        setExerciseNum(newCompleted);
        await Storage.mergeItem(id, JSON.stringify({ completed: newCompleted }));
        if (answer === (exerciseState.inTune ? "In Tune" : "Out of Tune")
        || answer === exerciseState.tuningSystem) {
            const newCorrect = correctNum + 1;
            setCorrectNum(newCorrect);
            await Storage.mergeItem(id, JSON.stringify({ correct: newCorrect }));
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
            <Text>Correct: {correctNum}/{exerciseNum}</Text>
            <ExercisePlayer 
                ref={webviewRef}
                soundScript={soundScript(exerciseState.audioDetails.notes, exerciseState.activeInstruments, exerciseState.staggered)}
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
                {exerciseNum > 0 && <Text>{exerciseState.prevExerciseString}</Text>}
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
                                    if (instrumentUris && !injectedInstruments.includes(instrument)) {
                                        setInjectedInstruments((prev) => [...prev, instrument]);
                                        injectInstrumentSampler(webviewRef, instrument, instrumentUris);
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