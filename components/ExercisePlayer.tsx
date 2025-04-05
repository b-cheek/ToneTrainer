import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import React, { useRef } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import AudioPlayer from './AudioPlayer';

const ExercisePlayer = (props: {soundScript: string}) => {

    //TODO: Note use of tonejs offline to save sound to a buffer passed to this player instead of directly playing it?
    const webview = useRef<WebView>(null);
    const playSoundInjection = 'playSound(); true;'; // This will trigger the playSound function in the webview
    // true; helps prevent any silent failures

    const loadInstrument = async () => {
        const asset = Asset.fromModule(require('../assets/trimmedSamples/bassoon/A3.mp3'));

        await asset.downloadAsync(); // Ensure it's downloaded
        const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
            encoding: FileSystem.EncodingType.Base64
        });

        webview.current?.injectJavaScript(`
            bassoon = new Tone.Sampler({
                urls: {
                    "A3": "${base64}"
                },
                baseUrl: "data:audio/mp3;base64,"
            }).toDestination();
        `);
    };

    return (
        <View style={styles.playerContainer}>
            <Text>ExercisePlayer</Text>
            <Button title="Play" onPress={() => {
                webview.current?.injectJavaScript(playSoundInjection);
            }} />
            <Button title="Instrument" onPress={() => {
                if (webview.current) {
                    loadInstrument();
                }
            }} />
            <AudioPlayer ref={webview} soundScript={props.soundScript} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15,
        marginBottom: 20,
        backgroundColor: 'lightgray',
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
});

export default ExercisePlayer;