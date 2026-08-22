# Implementation Plan — Outfit Calendar + Remaining Feature Set

> **Working doc.** Update the Status table and the Decisions log as milestones land.
> Work lands on `main` at `github.com/anurag444/ai-closet`, one commit per milestone, after device verification.

## Status

| # | Milestone | State |
|---|-----------|-------|
| M0 | Try-on credentials (`EXPO_PUBLIC_KWAI_*`) | ⬜ Not started — needs Kling AI keys from you |
| M1 | Fix outfit image storage | ✅ Done, verified on device |
| M2 | Persistence helper + context refactor | ✅ Done, verified on device |
| M3 | Calendar model, context, empty 5th tab | ✅ Done, verified on device |
| M4 | Week view (read-only) | ✅ Done, verified on device |
| M5 | Assign an outfit to a date | ✅ Done, verified on device |
| M6 | Day actions: view / replace / remove | ✅ Done — awaiting your device verification (uncommitted) |
| M7 | Month view + toggle | ⬜ Not started |
| M8 | Profile tab | ⬜ Not started |
| M9 | Cleanup (`FilterButton.tsx`, README) | ⬜ Not started |

**Next up:** M7.

**Process:** nothing gets committed until Anurag has verified it on a device.

**Open item:** outfits saved before M1 have unrecoverable thumbnails (see Decisions #2). Fix by opening each → Edit → Save, or ask for a one-time cleanup pass.

---

## Context

Expo SDK 54 wardrobe app. Three feature areas already work (Closet, Outfit Canvas, Virtual Try-On), built on React Context + AsyncStorage. Outstanding:

1. **Outfit calendar** — assign saved outfits to dates, week/month view. Zero code at the start of this work.
2. **Outfit images were never persisted correctly** — see Decisions #1.
3. **Dead scaffolding** — `src/utils/AsyncStorage.ts` and `src/components/common/FilterButton.tsx` are 0 bytes; `SelectOutfitModal` is declared in `RootStackParamList` but never registered; `ProfileScreen` is a `() => <></>` stub in `navigation/index.tsx:29`.
4. **Try-on broken at runtime** — `services/VirtualTryOn.ts` reads `EXPO_PUBLIC_KWAI_ACCESS_KEY` / `EXPO_PUBLIC_KWAI_SECRET_KEY`, neither present in `.env`.

Target: a 5-tab app where the Plan tab opens on a week view (toggleable to month), each day holds one outfit, all local.

## Constraints — do not deviate

- Contexts only. No Redux/Zustand/react-query.
- No new npm dependencies. Date math hand-rolled (~50 lines), not `date-fns`.
- `colors.*` tokens and `typography.*` families only — never literal hex or font names.
- `PressableFade` over raw `Pressable`. `StyleSheet.create` at file bottom.
- Named exports for types/services; default export for components.

---

## Decisions log

**1. `ViewShot.capture()` ignores its arguments.** `node_modules/react-native-view-shot/src/index.js:212` defines `capture = (): Promise<string>` with no parameters — it uses `this.props.options`. `OutfitCanvasScreen` was passing `{ result: "base64" }` to the call, which was silently dropped, so `result` fell back to its `"tmpfile"` default. Outfit `imageUri` was therefore a **temp file path**: renders during the session, dead after a restart (and `ViewShot.onCapture` actively releases the previous capture after 500ms). Fix: capture to tmpfile, then `copyAsync` into `documentDirectory` via `persistImage()`. Format/quality are configured on the `<ViewShot options={...}>` prop, which is where they always took effect.

**2. No image migration.** An earlier read of this bug assumed the stored value was base64 and added a migration. It wasn't, so the migration was removed. Pre-existing outfits point at temp files that no longer exist and cannot be recovered — but `Outfit.clothingItems` holds the full canvas layout, so opening an outfit → Edit → Save regenerates the thumbnail.

**3. One outfit per date, stored as a flat array.** `CalendarEntry[]`, not `Record<date, outfitId>`. The one-per-date rule lives in the context API (`setOutfitForDate` replaces), not the schema — so supporting multiple entries per day later is a new method, not a data migration.

**4. Calendar is a 5th tab**, between Try-On and Profile. Week view is the default; month is a toggle.

**5. The load/save effects were racing.** Each context ran its load effect and its save effect on the same mount. The save fired immediately with the initial `[]`, and because both hit the same native AsyncStorage queue, that write could land before `getItem` resolved — reading back `[]` and wiping stored data. Rare, and more likely on a cold start with a large closet, but it was real. `usePersistedState` gates the save on `isHydrated`.

**6. `OutfitContext` exposes `isHydrated`.** `CalendarContext` prunes entries whose outfit was deleted, but on a cold start `outfits` is `[]` until storage resolves — so every entry would look orphaned and get wiped. Both the display filter and the prune effect are gated on outfits having actually loaded. `usePersistedState` already returned the flag; it was just being discarded.

**7. Assignment goes through the context, not a navigation callback.** `SelectOutfitModal` calls `setOutfitForDate` itself and then `goBack()`. Passing an `onSelect` function through route params would put a non-serializable value into navigation state, which React Navigation warns about and which breaks state persistence.

---

## Milestones

### M0 — Try-on credentials *(optional, independent)*
- Add `EXPO_PUBLIC_KWAI_ACCESS_KEY` and `EXPO_PUBLIC_KWAI_SECRET_KEY` to `.env` (values from Kling AI).
- Add a committed `.env.example` with all four key names empty; reference it from `README.md`.

**Verify:** Try-On tab → outfit + photo → run completes instead of throwing at `generateToken()`.

### M1 — Fix outfit image storage ✅
- `src/utils/ImageUtils.ts` (was empty): `persistImage(sourceUri, prefix)` copies a capture into `documentDirectory`, returns the `file://` URI; `deleteImage(uri)` no-ops on non-file URIs.
- `OutfitCanvasScreen.handleSave` runs the capture through `persistImage`, and deletes the previous file when editing.
- `OutfitContext.deleteOutfit` deletes the image file.

**Verify:** Save a new outfit → thumbnail renders in the grid *and* on the detail screen → force-quit and relaunch → still there. Edit + re-save updates it.

### M2 — Persistence helper + context refactor ✅
- `src/utils/AsyncStorage.ts` (was empty): `STORAGE_KEYS`, `loadJSON<T>`, `saveJSON<T>`, `usePersistedState<T>(key, initial) → [value, setValue, isHydrated]`.
- The `isHydrated` flag fixes a real race (see Decisions #5), not just tidiness.
- All three contexts refactored onto it; ~25 lines of duplicated load/save effect removed from each. `AsyncStorage` is now imported in exactly one file.
- `VirtualTryOnContext.clearHistory` no longer calls `removeItem` — setting `[]` persists through the hook.

**Verify:** Relaunch — clothing, outfits, try-on history all load. Add one of each, force-quit, relaunch, both present.

### M3 — Calendar model, context, empty 5th tab ✅
- `src/types/CalendarEntry.ts`: `{ id, date /* 'YYYY-MM-DD' local */, outfitId, createdAt, updatedAt }`.
- `src/utils/dates.ts` (~50 lines, no dependency): `toDateKey`, `fromDateKey`, `startOfWeek` (Sunday), `addDays`, `addWeeks`, `addMonths`, `getWeekDays`, `getMonthGrid(year, month)` (6×7 padded), `isToday`. Lift the `months` / `monthAbbreviations` arrays out of `components/common/YearMonthPicker.tsx:38` and import them back there.
- `src/contexts/CalendarContext.tsx`, shaped like `OutfitContext`: `entries` under `@calendar_entries`; memoized `entriesByDate` that filters out entries whose outfit was deleted (reads `OutfitContext`, so it must nest **inside** `OutfitProvider`); `getEntryForDate`, `setOutfitForDate`, `removeEntryForDate`; a prune effect for orphans.
- `App.tsx`: `<CalendarProvider>` between `OutfitProvider` and `VirtualTryOnProvider`.
- `types/navigation.ts`: `Plan` in `MainTabParamList`, `PlanStackParamList = { OutfitPlan: undefined }`, matching `PlanStackScreenProps`.
- `navigation/index.tsx`: `PlanStackNavigator` + 5th tab between TryOn and Profile, icon `MaterialCommunityIcons "calendar-month-outline"`.
- `src/screens/OutfitPlanScreen.tsx`: placeholder.

**Verify:** Five tabs, all legible at phone width. Plan tab opens without crashing. Other four unaffected.

### M4 — Week view (read-only) ✅
- New `src/components/calendar/`: `WeekHeader.tsx` (month/year label, chevrons, Today button), `DayCard.tsx` (weekday abbr + day number + `OutfitThumbnail` or an empty dashed "+" slot; today gets a `light_yellow` row), `WeekView.tsx` (7 stacked `DayCard` rows).
- `OutfitPlanScreen` owns `anchorDate`, wires chevrons through `addWeeks`.
- **Deviation from plan:** the week/month toggle was left out rather than shipped inert — dead controls are worse to test than absent ones. It arrives in M7 with `MonthView`.
- The Today button hides itself when the current week is already on screen.

**Verify:** Current week shown, today highlighted. Chevrons cross a month boundary and Dec→Jan correctly. Today jumps back.

### M5 — Assign an outfit to a date ✅
- `src/screens/SelectOutfitModalScreen.tsx`: the grid from `OutfitManagementScreen` (same `COLUMN_COUNT`/`ITEM_WIDTH`, same `TagFilterSection` + `OutfitThumbnail`) minus selection/delete. Single tap picks.
- `types/navigation.ts`: `SelectOutfitModal: { dateKey: string }`.
- `navigation/index.tsx`: register in the existing `RootStack.Group` modal group.
- Return path: modal calls `setOutfitForDate` directly then `goBack()`. No function params through navigation state.

**Verify:** Empty day → modal → pick → thumbnail appears. Relaunch, still assigned. Re-pick on the same day replaces rather than duplicates.

### M6 — Day actions ✅
- Filled `DayCard` opens a bottom sheet (`Modal` + `transparent` + `colors.background_dim`, per `components/virtualTryOn/TryOnOptionSheet.tsx`): View outfit → existing `OutfitDetailModal` route; Replace → M5 flow; Remove → `removeEntryForDate`.

**Verify:** All three actions. Then delete that outfit from the Outfits tab — the day goes empty rather than showing a broken thumbnail (exercises the M3 orphan prune).

### M7 — Month view + toggle
- `src/components/calendar/MonthView.tsx`: 6×7 grid from `getMonthGrid`, small square thumbnails, adjacent-month days dimmed with `colors.text_gray_light`.
- Toggle goes live; chevrons dispatch to `addWeeks` or `addMonths` on the same `anchorDate` so switching keeps your place.
- Month cells reuse `DayCard`'s handlers — no duplicated navigation logic.
- Tapping the header label opens the existing `YearMonthPicker` (already takes `'YYYY-MM'` + `onValueChange`) to jump months.

**Verify:** Toggle both ways, dates line up. Scroll several months. Assign/remove from month view. ~15 assigned days scrolls smoothly.

### M8 — Profile tab
- `src/screens/ProfileScreen.tsx` + stack, mirroring `TryOnStackNavigator`, replacing the stub.
- Counts of items / outfits / planned days / try-ons; category breakdown from `ClothingContext.categoryData`; "Clear try-on history" wired to the existing `VirtualTryOnContext.clearHistory`; version from `app.json`.

**Verify:** Counts match the other tabs. Clear-history empties Recently Tried.

### M9 — Cleanup
- Delete `src/components/common/FilterButton.tsx` — 0 bytes, no importers; `TagFilterSection` and `CategoryPicker` already cover filtering.
- `README.md`: move "Outfit Calendar" out of Future Features.

**Verify:** `npx tsc --noEmit` clean; all five tabs exercised end to end.

---

## Files at a glance

**New:** `src/types/CalendarEntry.ts`, `src/contexts/CalendarContext.tsx`, `src/utils/dates.ts`, `src/screens/{OutfitPlanScreen,SelectOutfitModalScreen,ProfileScreen}.tsx`, `src/components/calendar/{WeekHeader,DayCard,WeekView,MonthView,DayActionSheet}.tsx`, `.env.example`

**Filled (were empty):** `src/utils/ImageUtils.ts` ✅, `src/utils/AsyncStorage.ts`

**Modified:** `App.tsx`, `src/navigation/index.tsx`, `src/types/navigation.ts`, `src/screens/OutfitCanvasScreen.tsx` ✅, `src/contexts/{Clothing,Outfit,VirtualTryOn}Context.tsx`, `src/components/common/YearMonthPicker.tsx`, `README.md`

**Deleted:** `src/components/common/FilterButton.tsx`

**Reused, not rebuilt:** `OutfitThumbnail`, `TagFilterSection`, `YearMonthPicker`, `PressableFade`, `AddButton`, the `OutfitManagementScreen` grid constants, the `TryOnOptionSheet` sheet pattern, the `RootStack` modal group.

## Verification

No test runner is configured, so verification is manual per milestone, plus at every step:

```
npx tsc --noEmit     # must stay clean
npx expo start -c    # -c after M1 and M2 to clear the Metro cache
```

Run on a device or simulator, not web — `react-native-view-shot`, `expo-file-system`, and gesture-handler all behave differently there.

Repeat after M2 and M7, since these regress silently:
- Force-quit and relaunch; clothing, outfits, and calendar entries all survive.
- Watch Metro for `Error saving outfits` — that's the AsyncStorage size limit talking.
