import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { useRef, useEffect } from 'react';
import { View, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import AudioPlayer from './AudioPlayer';
import React from 'react';

const ExercisePlayer = (props: {soundScript: string, instrument: string}) => {

    //TODO: Note use of tonejs offline to save sound to a buffer passed to this player instead of directly playing it?
    const webview = useRef<WebView>(null);
    const playSoundInjection = 'playSound(); true;'; // This will trigger the playSound function in the webview
    // true; helps prevent any silent failures

    const [instrumentUris, setInstrumentUris] = React.useState<Record<string, Record<string, string>>>({});

    useEffect(() => {
        const loadAudio = async () => {
            try {
                // Load the asset
                const assets = [
                    Asset.fromModule(require('../assets/trimmedSamples/bassoon/A3.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/cello/A3.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/clarinet/D4.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/contrabass/A2.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/flute/A5.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/french-horn/A3.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/piano/A4.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/saxophone/A4.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/trombone/C3.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/trumpet/C4.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/tuba/F2.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/violin/A4.mp3')),
                ];

                let curUris: Record<string, Record<string, string>> = {};

                for (const asset of assets) {
                    // console.log(asset.uri);
                    const uri = asset.uri;
                    const note = uri.split("%2F").pop()?.split(".")[0] ?? "unknown";
                    const instrument = uri.split("%2F")[uri.split("%2F").length - 2];

                    await asset.downloadAsync(); // Ensure it's downloaded
                    // console.log(`${instrument} - ${note} downloaded`);

                    // Convert to Base64
                    const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    curUris[instrument] = {
                        [note]: base64, // Store the base64 string directly
                    }
                }

                setInstrumentUris(curUris);

            } catch (error) {
                console.error("Error loading audio:", error);
            }
        };

        loadAudio();
    }, []);

    useEffect(() => {
        if (props.instrument.toLowerCase() == 'synthesizer') {
            webview.current?.injectJavaScript(`
                synthesizer = new Tone.Synth().toDestination();
                true;
            `);
            return;
        }

        webview.current?.injectJavaScript(`
            ${props.instrument.toLowerCase()} = new Tone.Sampler({
                urls: ${JSON.stringify(instrumentUris[props.instrument.toLowerCase()])},
                baseUrl: "data:audio/mp3;base64,"
            }).toDestination();
            true;
        `);
    }
    , [props.instrument]);

    return (
        <View>
            <Button title="Play" onPress={() => {
                webview.current?.injectJavaScript(playSoundInjection);
            }} />
            <AudioPlayer ref={webview} soundScript={props.soundScript} />
        </View>
    )
}

export default ExercisePlayer;