import React, { createContext, ReactNode } from "react";
import { VirtualTryOnItem } from "../types/VirtualTryOn";
import { v4 as uuidv4 } from "uuid";
import { usePersistedState, STORAGE_KEYS } from "../utils/AsyncStorage";

type VirtualTryOnContextType = {
  recentTryOns: VirtualTryOnItem[];
  addTryOn: (tryOn: Omit<VirtualTryOnItem, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  clearHistory: () => Promise<void>;
  deleteHistoryItems: (ids: Set<string>) => Promise<void>; // New method
};

export const VirtualTryOnContext = createContext<VirtualTryOnContextType | null>(null);

export const VirtualTryOnProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recentTryOns, setRecentTryOns] = usePersistedState<VirtualTryOnItem[]>(STORAGE_KEYS.tryOnHistory, []);

  const addTryOn = async (tryOn: Omit<VirtualTryOnItem, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newTryOn: VirtualTryOnItem = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      ...tryOn,
    };

    setRecentTryOns((prev) => [newTryOn, ...prev].slice(0, 100)); // Keep only the 100 most recent
  };

  const clearHistory = async () => {
    // The persisted state writes the empty list through to storage
    setRecentTryOns([]);
  };

  // New method to delete specific items
  const deleteHistoryItems = async (ids: Set<string>) => {
    try {
      const updatedTryOns = recentTryOns.filter((item) => !ids.has(item.id));
      setRecentTryOns(updatedTryOns);
    } catch (e) {
      console.error("Error deleting try-on history items:", e);
      throw e; // Re-throw to handle in the UI
    }
  };

  return (
    <VirtualTryOnContext.Provider value={{ recentTryOns, addTryOn, clearHistory, deleteHistoryItems }}>
      {children}
    </VirtualTryOnContext.Provider>
  );
};
