import React, { forwardRef } from 'react';
import { WebView } from 'react-native-webview';

const AudioPlayer = forwardRef<WebView>((_, ref) => {
    return (
        <WebView
            style={{ maxWidth: 0, maxHeight: 0 }}
            containerStyle={{ flex: 0 }}
            originWhitelist={['*']}
            ref={ref}
            //TODO: Make playback work when ringer on silent (iOS)
            source={{
                html: `
                <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.40/Tone.js"></script>
                <script>
                function playSound() {
                    const synth = new Tone.Synth().toDestination();
                    synth.detune.value = 200;
                    synth.triggerAttackRelease("C4", "8n");
                }
                </script>
                `,
            }}
        />
    );
});

export default AudioPlayer;
