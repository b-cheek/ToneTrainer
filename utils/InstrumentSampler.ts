import { WebView } from "react-native-webview";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

export const createInstrumentUris = async (): Promise<Record<string, Record<string, string>>> => {
  const assets = [
    Asset.fromModule(require("../assets/trimmedSamples/bassoon/A3.mp3")),
    Asset.fromModule(require("../assets/trimmedSamples/cello/A3.mp3")),
    Asset.fromModule(require("../assets/trimmedSamples/clarinet/D4.mp3")),
    Asset.fromModule(require("../assets/trimmedSamples/contrabass/A2.mp3")),
    Asset.fromModule(require("../assets/trimmedSamples/flute/A5.mp3")),
    Asset.fromModule(require("../assets/trimmedSamples/french_horn/A3.mp3")),
    Asset.fromModule(require("../assets/trimmedSamples/piano/A4.mp3")),
    Asset.fromModule(require("../assets/trimmedSamples/saxophone/A4.mp3")),
    Asset.fromModule(require("../assets/trimmedSamples/trombone/C3.mp3")),
    Asset.fromModule(require("../assets/trimmedSamples/trumpet/C4.mp3")),
    Asset.fromModule(require("../assets/trimmedSamples/tuba/F2.mp3")),
    Asset.fromModule(require("../assets/trimmedSamples/violin/A4.mp3")),
  ];

  const instrumentUris: Record<string, Record<string, string>> = {};

  for (const asset of assets) {
    try {
      const uri = asset.uri;
      const note = uri.split("%2F").pop()?.split(".")[0] ?? "unknown";
      const instrument = uri.split("%2F")[uri.split("%2F").length - 2];

      await asset.downloadAsync(); // Ensure the asset is downloaded

      // Convert to Base64
      const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (!instrumentUris[instrument]) {
        instrumentUris[instrument] = {};
      }

      instrumentUris[instrument][note] = base64; // Store the Base64 string
    } catch (error) {
      console.error("Error loading audio asset:", error);
    }
  }

  return instrumentUris;
};

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