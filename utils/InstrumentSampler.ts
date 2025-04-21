import { WebView } from "react-native-webview";

export const injectInstrumentSampler = (
  webview: React.RefObject<WebView>,
  instrument: string,
  instrumentUris: Record<string, Record<string, string>>
) => {
  if (!webview.current) {
    console.warn("WebView reference is not available.");
    return;
  }

  console.log(`Injecting instrument sampler for: ${instrument}`);

  if (!instrumentUris[instrument]) {
    console.warn(`No audio URIs found for instrument: ${instrument}`);
    return;
  }

  webview.current.injectJavaScript(`
    ${instrument} = new Tone.Sampler({
      urls: ${JSON.stringify(instrumentUris[instrument])},
      baseUrl: "data:audio/mp3;base64,"
    }).toDestination();
    true;
  `);
};