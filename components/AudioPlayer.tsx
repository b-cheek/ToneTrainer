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
                        const A2url = audioFiles.A2;
                        let testBuf = new Tone.Buffer(A2url, function(){alert("successful load")}, function(e){alert("failed load: " + e)});
                        const sampler = new Tone.Sampler({urls: {A2: testBuf}}).toDestination();
                        alert(testBuf.loaded);
                        // const test = new Tone.Synth().toDestination();
                        // test.triggerAttackRelease("C4", 0.5);
                        // sampler.triggerAttackRelease("A2", 0.5);

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
