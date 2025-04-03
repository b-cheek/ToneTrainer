import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import React, { forwardRef, useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';

const AudioPlayer = forwardRef<WebView, { soundScript: string} >((props, ref) => {

    const soundScript = props.soundScript;
    const [instrumentUris, setInstrumentUris] = useState<Record<string, Record<string, string>>>({});

    const instrumentSamplersScript = 
        Object.entries(instrumentUris).map(([instrument, uris]) => `
            const ${instrument} = new Tone.Sampler({
                urls: ${JSON.stringify(uris)},
                onload: () => {
                    ${instrument}.triggerAttack("A3", 0.5);
                }
            }).toDestination();
        `).join("\n");

    const samplerTest = `
        const sampler = new Tone.Sampler({
            urls: {
                A3: "${instrumentUris['bassoon']?.['A3']}",     
    `;

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

                    console.log("Instrument URIs:", Object.keys(instrumentUris));
                    console.log(instrumentUris['contrabass']?.['A2']); // Debugging line to check if the contrabass A2 is loaded correctly

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
            // injectedJavaScript={samplerTest}
            source={{
                html: `
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.40/Tone.js"></script>
                    <script>

                    try {
                        const sampler = new Tone.Sampler({
                            urls: ${JSON.stringify(instrumentUris['bassoon'])},
                            onload: () => {
                                console.log("Sampler loaded successfully!");
                                sampler.triggerAttack("A3", 0.5); // Test the sampler by playing a note
                            },
                            baseUrl: "data:audio/mp3;base64,"
                        }).toDestination();
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
