import * as FileSystem from "expo-file-system/legacy";

// Android's view-shot sometimes hands back a bare path with no scheme, which
// copyAsync and <Image> both reject.
const withFileScheme = (uri: string): string => (uri.startsWith("/") ? `file://${uri}` : uri);

// react-native-view-shot captures to a temp file that only lives as long as the app
// run (and gets released once the next capture happens). Copy it somewhere permanent
// so the stored imageUri still resolves after a restart.
export const persistImage = async (sourceUri: string, prefix: string): Promise<string> => {
  const from = withFileScheme(sourceUri);
  const to = `${FileSystem.documentDirectory}${prefix}-${Date.now()}.png`;

  console.debug("[persistImage] copying", { from, to });

  await FileSystem.copyAsync({ from, to });

  // A copy can "succeed" and still leave nothing useful behind if the capture
  // itself produced an empty file, so confirm before handing back the URI.
  const info = await FileSystem.getInfoAsync(to);
  console.debug("[persistImage] result", { exists: info.exists, size: info.exists ? info.size : 0 });

  if (!info.exists || info.size === 0) {
    throw new Error(`Captured image is empty (${to})`);
  }

  return to;
};

// Deletes a locally stored image. No-op for anything that isn't a local file URI.
export const deleteImage = async (uri: string): Promise<void> => {
  if (!uri || !uri.startsWith("file://")) {
    return;
  }

  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
