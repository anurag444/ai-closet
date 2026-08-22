import * as FileSystem from "expo-file-system/legacy";

// react-native-view-shot captures to a temp file that only lives as long as the app
// run (and gets released once the next capture happens). Copy it somewhere permanent
// so the stored imageUri still resolves after a restart.
export const persistImage = async (sourceUri: string, prefix: string): Promise<string> => {
  const fileUri = `${FileSystem.documentDirectory}${prefix}-${Date.now()}.png`;

  await FileSystem.copyAsync({ from: sourceUri, to: fileUri });

  return fileUri;
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
