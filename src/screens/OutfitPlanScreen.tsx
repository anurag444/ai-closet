import React, { useState, useCallback, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import CalendarHeader from "../components/calendar/CalendarHeader";
import CalendarViewToggle, { CalendarViewMode } from "../components/calendar/CalendarViewToggle";
import WeekView from "../components/calendar/WeekView";
import MonthView from "../components/calendar/MonthView";
import DayActionSheet from "../components/calendar/DayActionSheet";
import { CalendarContext } from "../contexts/CalendarContext";
import { PlanStackScreenProps } from "../types/navigation";
import { addMonths, addWeeks, fromMonthKey, getWeekDays, isToday, startOfDay } from "../utils/dates";

type Props = PlanStackScreenProps<"OutfitPlan">;

type ActiveDay = {
  dateKey: string;
  outfitId: string;
};

const safeAreaEdges: Edge[] = ["top", "left", "right"];

const OutfitPlanScreen = ({ navigation }: Props) => {
  const [anchorDate, setAnchorDate] = useState(() => startOfDay(new Date()));
  const [viewMode, setViewMode] = useState<CalendarViewMode>("week");
  const [activeDay, setActiveDay] = useState<ActiveDay | null>(null);

  const calendarContext = useContext(CalendarContext);

  const isMonthView = viewMode === "month";

  // Both views page the same anchor, so switching keeps your place
  const handlePrevious = useCallback(
    () => setAnchorDate((prev) => (isMonthView ? addMonths(prev, -1) : addWeeks(prev, -1))),
    [isMonthView]
  );

  const handleNext = useCallback(
    () => setAnchorDate((prev) => (isMonthView ? addMonths(prev, 1) : addWeeks(prev, 1))),
    [isMonthView]
  );

  const handleToday = useCallback(() => setAnchorDate(startOfDay(new Date())), []);

  const handleMonthChange = useCallback((monthKey: string) => setAnchorDate(fromMonthKey(monthKey)), []);

  const openOutfitPicker = useCallback(
    (dateKey: string) => navigation.navigate("SelectOutfitModal", { dateKey }),
    [navigation]
  );

  // An empty day goes straight to the picker; a filled one offers the actions first
  const handleSelectDate = useCallback(
    (dateKey: string, outfitId?: string) => {
      if (outfitId) {
        setActiveDay({ dateKey, outfitId });
      } else {
        openOutfitPicker(dateKey);
      }
    },
    [openOutfitPicker]
  );

  const handleCloseSheet = useCallback(() => setActiveDay(null), []);

  const handleView = useCallback(() => {
    if (!activeDay) return;
    const { outfitId } = activeDay;
    setActiveDay(null);
    navigation.navigate("OutfitDetailModal", { id: outfitId });
  }, [activeDay, navigation]);

  const handleReplace = useCallback(() => {
    if (!activeDay) return;
    const { dateKey } = activeDay;
    setActiveDay(null);
    openOutfitPicker(dateKey);
  }, [activeDay, openOutfitPicker]);

  const handleRemove = useCallback(() => {
    if (!activeDay) return;
    calendarContext?.removeEntryForDate(activeDay.dateKey);
    setActiveDay(null);
  }, [activeDay, calendarContext]);

  const today = new Date();
  const isTodayVisible = isMonthView
    ? anchorDate.getMonth() === today.getMonth() && anchorDate.getFullYear() === today.getFullYear()
    : getWeekDays(anchorDate).some(isToday);

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Plan</Text>
        <CalendarViewToggle viewMode={viewMode} onChange={setViewMode} />
      </View>

      <CalendarHeader
        anchorDate={anchorDate}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onMonthChange={handleMonthChange}
        isTodayVisible={isTodayVisible}
      />

      {isMonthView ? (
        <MonthView anchorDate={anchorDate} onSelectDate={handleSelectDate} />
      ) : (
        <WeekView anchorDate={anchorDate} onSelectDate={handleSelectDate} />
      )}

      <DayActionSheet
        dateKey={activeDay?.dateKey ?? null}
        onClose={handleCloseSheet}
        onView={handleView}
        onReplace={handleReplace}
        onRemove={handleRemove}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screen_background,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
});

export default OutfitPlanScreen;
