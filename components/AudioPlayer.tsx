import React, { forwardRef } from 'react';
import { WebView } from 'react-native-webview';

const AudioPlayer = forwardRef<WebView, { soundScript: string} >((props, ref) => {

    const soundScript = props.soundScript;

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
