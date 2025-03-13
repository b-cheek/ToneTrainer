import React, { forwardRef } from 'react';
import { WebView } from 'react-native-webview';

const AudioPlayer = forwardRef<WebView, { soundScript: string} >((props, ref) => {

    const soundScript = props.soundScript;

    const objectInjection = {
        customValue: 50,
    }

    const jsInjection = `
    // Try catch for debugging
    try {
        window.getRndInt = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        window.getRndSign = () => {
            return Math.random() < 0.5 ? -1 : 1;
        }
    } catch (e) {
        alert("Error: " + e.message);
    }
    true; // note: this is required, or you'll sometimes get silent failures
    `

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
            injectedJavaScript={ jsInjection }
            injectedJavaScriptForMainFrameOnly={false}
            injectedJavaScriptObject={ objectInjection } // Leaving this so I remember that it's possible, may be useful
            source={{
                html: `
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.40/Tone.js"></script>
                    <script>
                    window.onload = (event) => {
                        if (window.ReactNativeWebView.injectedObjectJson()) {
                            const customValue = JSON.parse(window.ReactNativeWebView.injectedObjectJson()).customValue;
                        }
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
