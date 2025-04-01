import { Asset } from 'expo-asset';
import React, { forwardRef, useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';

const AudioPlayer = forwardRef<WebView, { soundScript: string} >((props, ref) => {

    const soundScript = props.soundScript;

    const [audioFiles, setAudioFiles] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const loadAssets = async () => {
            const sampleFiles = {
                A2: require('../assets/trimmedSamples/bassoon/A2.mp3'),
            };

            const loadedFiles: { [key: string]: string } = {};
            for (const [note, asset] of Object.entries(sampleFiles)) {
                const loadedAsset = await Asset.loadAsync(asset);
                loadedFiles[note] = loadedAsset[0].localUri || '';
            }

            setAudioFiles(loadedFiles);
        };

        loadAssets();
    }, []);

    console.log('Audio files loaded:', audioFiles);

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
                        const audioFiles = ${JSON.stringify(audioFiles)};
                        alert("Audio files loaded: " + JSON.stringify(audioFiles));
                        if (audioFiles.A2) {
                            alert("A2: " + audioFiles.A2);
                            const audio = new Audio(audioFiles.A2);
                            audio.addEventListener('canplaythrough', () => {
                                audio.play().catch((e) => alert("Playback error: " + e.message));
                            });
                            audio.addEventListener('error', (e) => {
                                alert("Audio error: " + e.message);
                            });

                            const buffer = new Tone.ToneAudioBuffer(audioFiles.A2, () => {
                                alert("ToneAudioBuffer loaded");
                            }, (e) => {
                                alert("ToneAudioBuffer error: " + e.message);
                            });
                        } else {
                            alert("Error: A2 audio file not found.");
                        }
                        const sampler = new Tone.Sampler({
                            urls: {
                                A2: audioFiles.A2,
                            },
                            // baseUrl: "https://tonejs.github.io/audio/casio/",
                            onload: () => {
                                alert("Sampler loaded!");
                                // sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
                            }
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
