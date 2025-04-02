import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import React, { forwardRef, useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';

const AudioPlayer = forwardRef<WebView, { soundScript: string} >((props, ref) => {

    const soundScript = props.soundScript;
    // const availableInstuments = ["bassoon", "cello", "clarinet", "contrabass", "flute", "french-horn", "piano", "saxophone", "trombone", "trumpet", "tuba", "violin"];
    // const instrumentUris: Record<string, Record<string, string>> = {};
    const [instrumentUris, setInstrumentUris] = useState<Record<string, Record<string, string>>>({});

    useEffect(() => {
        const loadAudio = async () => {
            try {
                // Load the asset
                const assets = [
                    Asset.fromModule(require('../assets/trimmedSamples/basson/A3.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/cello/A3.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/clarinet/As4.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/contrabass/A2.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/flute/A5.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/french-horn/A3.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/piano/A4.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/saxophone/A4.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/trombone/As2.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/trumpet/As4.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/tuba/As2.mp3')),
                    Asset.fromModule(require('../assets/trimmedSamples/violin/A4.mp3')),
                ];

                for (const asset of assets) {
                    const instrument = asset.uri?.split("/").pop()?.split(".")[0] ?? "unknown";
                    const note = asset.uri?.split("/").pop()?.split(".")[1] ?? "unknown";

                    await asset.downloadAsync(); // Ensure it's downloaded

                    // Convert to Base64
                    const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    // Create a data URI
                    // instrumentUris[instrument] = { [note]: `data:audio/mp3;base64,${base64}` };
                    setInstrumentUris((prev) => ({
                        ...prev,
                        [instrument]: {
                            ...prev[instrument],
                            [note]: `data:audio/mp3;base64,${base64}`,
                        },
                    }));
                }
                console.log("Instrument URIs:", instrumentUris);
            } catch (error) {
                console.error("Error loading audio:", error);
            }
        };

        loadAudio();
    }, []);

    return (
        <WebView
            style={{ maxWidth: 0, maxHeight: 0 }}
            containerStyle={{ flex: 0 }}
            originWhitelist={['*']}
            ref={ref}
            //TODO: Make playback work when ringer on silent (iOS)
            webviewDebuggingEnabled={true}
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
                        const sampler = new Tone.Sampler({
                            urls: {
                                // A2: "",
                            },
                            onload: () => {
                                sampler.triggerAttack("A2", 0.5);
                            }
                        }).toDestination();

                        ${Object.entries(instrumentUris).map(([instrument, notes]) => `
                            const ${instrument} = new Tone.Sampler({
                                urls: ${JSON.stringify(notes)},
                                onload: () => {
                                    ${instrument}.triggerAttack("A3", 0.5);
                                }
                            }).toDestination();
                        `).join("\n")}

                    } catch (e) {
                        alert("Error: " + e.message);
                    }

                    function playSound() {
                        ${soundScript}
                    }
                    </script>
                    `,
            }}
        />
    );
});

export default AudioPlayer;
