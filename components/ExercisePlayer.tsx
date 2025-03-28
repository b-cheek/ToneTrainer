import { useRef } from 'react';
import { View, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import AudioPlayer from './AudioPlayer';

const ExercisePlayer = (props: { soundScript: string }) => {
    // TODO: Note use of tonejs offline to save sound to a buffer passed to this player instead of directly playing it?
    const webview = useRef<WebView>(null);
    const playSoundInjection = `
    playSound();
    `;

    return (
        <View>
            <Button title="Play" onPress={() => {
                webview.current?.injectJavaScript(playSoundInjection);
            }} />
            <AudioPlayer ref={webview} soundScript={props.soundScript} />
        </View>
    )
}

export default ExercisePlayer;