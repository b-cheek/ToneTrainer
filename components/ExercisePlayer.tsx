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
                style={styles.webContainer}
                // source={{ uri: 'https://nbrosowsky.github.io/tonejs-instruments/demo.html' }}
                originWhitelist={['*']}
                ref={webview}
                source={{ html:
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tone.js Example</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.40/Tone.js"></script>
</head>
<body>
  <button onclick="playSound()">Play Sound</button>
  <script>
    function playSound() {
      const synth = new Tone.Synth().toDestination();
      synth.detune.value = 200;
      synth.triggerAttackRelease("C4", "8n");
    }
  </script>
</body>
</html>`
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
    webContainer: {
        maxWidth: 100,
    }
});