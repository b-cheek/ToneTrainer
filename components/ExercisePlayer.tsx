import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { useRef, useEffect, forwardRef } from 'react';
import { View, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import AudioPlayer from './AudioPlayer';
import React from 'react';

const ExercisePlayer = forwardRef<WebView, { soundScript: string; onLoadStart: () => void; onLoadEnd: () => void }>((props, ref) => {

    //TODO: Note use of tonejs offline to save sound to a buffer passed to this player instead of directly playing it?
    const webview = ref as React.MutableRefObject<WebView | null>;
    const playSoundInjection = 'playSound(); true;'; // This will trigger the playSound function in the webview
    // true; helps prevent any silent failures

    return (
        <View>
            <Button title="Play" onPress={() => {
                webview.current?.injectJavaScript(playSoundInjection);
            }} />
            <AudioPlayer ref={webview} soundScript={props.soundScript} onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd} />
        </View>
    )
});

export default ExercisePlayer;