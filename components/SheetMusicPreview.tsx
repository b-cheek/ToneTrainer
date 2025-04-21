import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";

const SheetMusicPreview = (props: {abcString: string, scale: number}) => {
  return (
    <WebView
      style={styles.container}
      originWhitelist={["*"]}
      injectedJavaScriptBeforeContentLoaded={`
        window.onerror = function(message, sourcefile, lineno, colno, error) {
            // Idk why all the parameters end up being undefined, but at least shows error
            alert("Error: " + message + " at " + sourcefile + ":" + lineno + ":" + colno);
            // window.ReactNativeWebView.postMessage("Error: " + message + " at " + sourcefile + ":" + lineno + ":" + colno);
            return true;
        };
        true;
      `}
      source={{
        html: `
        <script src="https://cdn.jsdelivr.net/npm/abcjs@6.4.4/dist/abcjs-basic-min.min.js"></script>
        <div id="abcjs-container"></div>
        <script>
            const ABCJS = window.ABCJS;
            // const abcString = "X:1\\nK:D\\nDD AA|BBA2|\\n"
            const visualObj = ABCJS.renderAbc("abcjs-container", "${props.abcString}", { scale: ${props.scale} });
        </script>
      `,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 15,
    borderColor: "black",
    borderWidth: 1,
    minHeight: 420,
    minWidth: 200,
  },
});

export default SheetMusicPreview;
