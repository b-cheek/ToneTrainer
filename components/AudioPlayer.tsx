import React, { useContext, forwardRef } from 'react';
import { WebView } from 'react-native-webview';
import { Instruments } from '@/constants/Instruments';
import { GlobalsContext, GlobalsDispatchContext } from "./GlobalsProvider";

const AudioPlayer = forwardRef<WebView>((_, ref) => {
    const globals = useContext(GlobalsContext);
    const dispatch = useContext(GlobalsDispatchContext);
    return (
        <WebView
            ref={ref}
            style={{ maxWidth: 0, maxHeight: 0 }}
            containerStyle={{ flex: 0 }}
            originWhitelist={['*']}
            webviewDebuggingEnabled={true}
            javaScriptEnabled={true}
            // produce useful error messages
            injectedJavaScriptBeforeContentLoaded={`
                window.onerror = function(message, sourcefile, lineno, colno, error) {
                    // Idk why all the parameters end up being undefined, but at least shows error
                    // alert("Error: " + message + " at " + sourcefile + ":" + lineno + ":" + colno);
                    window.ReactNativeWebView.postMessage("Error: " + message + " at " + sourcefile + ":" + lineno + ":" + colno);
                    return true;
                };
                true;
            `}
            onMessage={(event) => { // An onMessage event is required as well to inject the JavaScript code into the WebView.
                const message = event.nativeEvent.data;
                if (message == "Success") {
                    dispatch({
                        type: "update",
                        globals: {
                            webviewLoaded: true
                        }
                    })
                } else {
                    alert(message);
                }
            }}
            source={{
                html: `
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.40/Tone.js"></script>
                    <script>
                        try {
                        ${
                            Object.keys(Instruments).map((instrument) => `
                                ${instrument} = new Tone.Sampler({
                                    urls: ${JSON.stringify(globals.instrumentUris[instrument])},
                                    baseUrl: "data:audio/mp3;base64,"
                                }).toDestination();   
                            `).join("\n")
                        }
                        } catch (e) {
                            alert(e);
                        }
                        window.ReactNativeWebView.postMessage("Success");
                    </script>
                `,
            }}
        />
    );
});

export default AudioPlayer;