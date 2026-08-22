import "react-native-get-random-values";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { PlayfairDisplay_500Medium, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import AppNavigator from "./src/navigation";
import { ClothingProvider } from "./src/contexts/ClothingContext";
import { VirtualTryOnProvider } from "./src/contexts/VirtualTryOnContext";
import { OutfitProvider } from "./src/contexts/OutfitContext";
import { CalendarProvider } from "./src/contexts/CalendarContext";
import AnimatedSplash from "./src/components/common/AnimatedSplash";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

// Hold the native splash until the fonts are ready, so the animated one can
// take over without a flash of unstyled screen
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isSplashDone, setIsSplashDone] = useState(false);

  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Regular": PlusJakartaSans_400Regular,
    "PlusJakartaSans-Medium": PlusJakartaSans_500Medium,
    "PlusJakartaSans-SemiBold": PlusJakartaSans_600SemiBold,
    "PlusJakartaSans-Bold": PlusJakartaSans_700Bold,
    "PlayfairDisplay-Medium": PlayfairDisplay_500Medium,
    "PlayfairDisplay-Bold": PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ClothingProvider>
        <OutfitProvider>
          <CalendarProvider>
            <VirtualTryOnProvider>
              <AppNavigator />
            </VirtualTryOnProvider>
          </CalendarProvider>
        </OutfitProvider>
      </ClothingProvider>

      {!isSplashDone && <AnimatedSplash onFinish={() => setIsSplashDone(true)} />}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
