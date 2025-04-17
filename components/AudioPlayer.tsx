import { forwardRef } from 'react';
import { WebView } from 'react-native-webview';

const AudioPlayer = forwardRef<WebView, { soundScript: string, onLoadEnd: () => void }>((props, ref) => {
    const soundScript = props.soundScript;

    return (
        <WebView
            style={{ maxWidth: 0, maxHeight: 0 }}
            containerStyle={{ flex: 0 }}
            originWhitelist={['*']}
            ref={ref}
            webviewDebuggingEnabled={true}
            javaScriptEnabled={true}
            // produce useful error messages
            injectedJavaScriptBeforeContentLoaded={`
                window.onerror = function(message, sourcefile, lineno, colno, error) {
                    // Idk why all the parameters end up being undefined, but at least shows error
                    alert("Error: " + message + " at " + sourcefile + ":" + lineno + ":" + colno);
                    // window.ReactNativeWebView.postMessage("Error: " + message + " at " + sourcefile + ":" + lineno + ":" + colno);
                    return true;
                };
                true;
            `}
            onLoadEnd={props.onLoadEnd} // Call the onLoadEnd prop when the WebView finishes loading to load initial instrument sounds
            onMessage={(event) => { // An onMessage event is required as well to inject the JavaScript code into the WebView.
                alert(event.nativeEvent.data);
            }}
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