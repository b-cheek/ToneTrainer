import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <WebView
      style={styles.container}
      // source={{ uri: 'https://nbrosowsky.github.io/tonejs-instruments/demo.html' }}
      originWhitelist={['*']}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
