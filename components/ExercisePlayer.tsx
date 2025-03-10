import React, { useRef } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import AudioPlayer from './AudioPlayer';

const ExercisePlayer = (props: {soundScript: string}) => {

    //TODO: Note use of tonejs offline to save sound to a buffer passed to this player instead of directly playing it?

    const webview = useRef<WebView>(null);
    const playSoundInjection = `
    playSound();
    `;

    return (
        <View style={styles.exerciseContainer}>
            <Text>ExercisePlayer</Text>
            <Button title="Play" onPress={() => {
                webview.current?.injectJavaScript(playSoundInjection);
            }} />
            <AudioPlayer ref={webview} soundScript={props.soundScript} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text0: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
    },
    exerciseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15,
        backgroundColor: 'lightgray',
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
});

export default ExercisePlayer;