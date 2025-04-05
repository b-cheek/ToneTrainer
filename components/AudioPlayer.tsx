import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import React, { forwardRef, useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';

const AudioPlayer = forwardRef<WebView, { soundScript: string} >((props, ref) => {

    const soundScript = props.soundScript;
    const [ instrumentUris, setInstrumentUris ] = useState<Record<string, Record<string, string>>>({});
    const [ urisLoaded, setUrisLoaded ] = useState(false);
    const [ sampleScript , setSampleScript ] = useState<string>("");

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

                    // console.log("Instrument URIs:", Object.keys(instrumentUris));

                    // Create a data URI
                    // instrumentUris[instrument] = { [note]: `data:audio/mp3;base64,${base64}` };
                    // setInstrumentUris((prev) => ({
                    //     ...prev,
                    //     [instrument]: {
                    //         ...prev[instrument],
                    //         [note]: base64,
                    //     },
                    // }));
                    curUris[instrument] = {
                        [note]: base64, // Store the base64 string directly
                    }
                }

                setInstrumentUris(curUris);

                setSampleScript(
                    Object.entries(curUris).map(([instrument, uris]) => `
                        ${instrument} = new Tone.Sampler({
                            urls: ${JSON.stringify(uris)},
                            baseUrl: "data:audio/mp3;base64,"
                        }).toDestination();
                    `).slice(0,5).join("\n")
                );

                console.log("Sample script loaded:", sampleScript);

                setUrisLoaded(true);

            } catch (error) {
                console.error("Error loading audio:", error);
            }
        };

        loadAudio();
    }, []);

    return urisLoaded ? (
        <WebView
            style={{ maxWidth: 0, maxHeight: 0 }}
            containerStyle={{ flex: 0 }}
            originWhitelist={['*']}
            ref={ref}
            //TODO: Make playback work when ringer on silent (iOS)
            webviewDebuggingEnabled={true}
            javaScriptEnabled={true}
            // produce useful error messages
            injectedJavaScriptBeforeContentLoaded={`
                window.onerror = function(message, sourcefile, lineno, colno, error) {
                    alert("Message: " + message + " - Source: " + sourcefile + " Line: " + lineno + ":" + colno);
                    return true;
                };
                true;
            `}
            onMessage={(event) => {}} // An onMessage event is required as well to inject the JavaScript code into the WebView.
            source={{
                html: `
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.40/Tone.js"></script>
                    <script>
                    try {
                        ${sampleScript} // Load the instrument samples
                    } catch (e) {
                        console.error("Error loading audio samples:", e);
                    }

                    function playSound() {
                        ${soundScript}
                    }
                    </script>
                    `,
            }}
        />
    ) : null;
});

export default AudioPlayer;
