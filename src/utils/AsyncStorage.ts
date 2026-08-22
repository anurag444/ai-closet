import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  clothingItems: "@clothing_items",
  outfits: "@outfits",
  tryOnHistory: "@try_on_history",
  calendarEntries: "@calendar_entries",
} as const;

export const loadJSON = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? (JSON.parse(jsonValue) as T) : fallback;
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
    return fallback;
  }
};

export const saveJSON = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
};

// State backed by AsyncStorage: loads once on mount, saves on every change.
//
// The isHydrated flag is what keeps the save from racing the load. Both effects
// fire on mount, so without it the save would write the initial value before
// getItem resolves and could overwrite everything that was stored.
export const usePersistedState = <T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, boolean] => {
  const [value, setValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Held in a ref so a caller passing a fresh array/object literal each render
  // doesn't retrigger the load.
  const initialValueRef = useRef(initialValue);

  useEffect(() => {
    let isActive = true;

    const hydrate = async () => {
      const stored = await loadJSON(key, initialValueRef.current);
      if (isActive) {
        setValue(stored);
        setIsHydrated(true);
      }
    };
    hydrate();

    return () => {
      isActive = false;
    };
  }, [key]);

  useEffect(() => {
    if (!isHydrated) return;
    saveJSON(key, value);
  }, [key, value, isHydrated]);

  return [value, setValue, isHydrated];
};
