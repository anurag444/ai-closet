import React, { createContext, useContext, useEffect, ReactNode, useMemo, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { CalendarEntry } from "../types/CalendarEntry";
import { OutfitContext } from "./OutfitContext";
import { usePersistedState, STORAGE_KEYS } from "../utils/AsyncStorage";

type CalendarContextType = {
  // Data
  entries: CalendarEntry[];
  entriesByDate: Record<string, CalendarEntry[]>;

  // CRUD operations
  getEntryForDate: (dateKey: string) => CalendarEntry | undefined;
  setOutfitForDate: (dateKey: string, outfitId: string) => void;
  removeEntryForDate: (dateKey: string) => void;
};

export const CalendarContext = createContext<CalendarContextType | null>(null);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries, isHydrated] = usePersistedState<CalendarEntry[]>(STORAGE_KEYS.calendarEntries, []);

  // Entries reference outfits, so this provider has to sit inside OutfitProvider
  const outfitContext = useContext(OutfitContext);
  const outfits = outfitContext?.outfits ?? [];
  const areOutfitsHydrated = outfitContext?.isHydrated ?? false;

  const outfitIds = useMemo(() => new Set(outfits.map((outfit) => outfit.id)), [outfits]);

  // Entries whose outfit still exists. Until outfits have loaded, every id would
  // look deleted, so hold off filtering rather than flashing an empty calendar.
  const validEntries = useMemo(
    () => (areOutfitsHydrated ? entries.filter((entry) => outfitIds.has(entry.outfitId)) : entries),
    [entries, outfitIds, areOutfitsHydrated]
  );

  const entriesByDate = useMemo(
    () =>
      validEntries.reduce((acc, entry) => {
        acc[entry.date] = [...(acc[entry.date] || []), entry];
        return acc;
      }, {} as Record<string, CalendarEntry[]>),
    [validEntries]
  );

  // Drop orphaned entries from storage once we can tell they're really orphaned
  useEffect(() => {
    if (!isHydrated || !areOutfitsHydrated) return;

    setEntries((prev) => {
      const next = prev.filter((entry) => outfitIds.has(entry.outfitId));
      // Returning the same reference when nothing changed keeps this from
      // re-triggering the persist effect on every render
      return next.length === prev.length ? prev : next;
    });
  }, [isHydrated, areOutfitsHydrated, outfitIds, setEntries]);

  const getEntryForDate = useCallback((dateKey: string) => entriesByDate[dateKey]?.[0], [entriesByDate]);

  // One outfit per date. The rule lives here rather than in the type, so allowing
  // several entries per day later is an added method, not a data migration.
  const setOutfitForDate = useCallback(
    (dateKey: string, outfitId: string) => {
      const now = new Date().toISOString();

      setEntries((prev) => {
        const existing = prev.find((entry) => entry.date === dateKey);
        const others = prev.filter((entry) => entry.date !== dateKey);

        return [
          ...others,
          {
            id: existing?.id ?? uuidv4(),
            date: dateKey,
            outfitId,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
          },
        ];
      });
    },
    [setEntries]
  );

  const removeEntryForDate = useCallback(
    (dateKey: string) => {
      setEntries((prev) => prev.filter((entry) => entry.date !== dateKey));
    },
    [setEntries]
  );

  const contextValue = {
    entries: validEntries,
    entriesByDate,
    getEntryForDate,
    setOutfitForDate,
    removeEntryForDate,
  };

  return <CalendarContext.Provider value={contextValue}>{children}</CalendarContext.Provider>;
};
