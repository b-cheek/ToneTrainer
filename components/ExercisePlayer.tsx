import React, { useRef } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { WebView } from 'react-native-webview';

export function ExercisePlayer() {

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
            <WebView
                style={{ maxWidth: 0, maxHeight: 0 }}
                containerStyle={{ flex: 0 }}
                originWhitelist={['*']}
                ref={webview}
                source={{ html:
`
<script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.40/Tone.js"></script>
<script>
function playSound() {
    const synth = new Tone.Synth().toDestination();
    synth.detune.value = 200;
    synth.triggerAttackRelease("C4", "8n");
}
</script>
`
      }}
    />
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