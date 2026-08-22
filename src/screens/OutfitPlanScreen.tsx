import React, { useState, useCallback, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import WeekHeader from "../components/calendar/WeekHeader";
import WeekView from "../components/calendar/WeekView";
import DayActionSheet from "../components/calendar/DayActionSheet";
import { CalendarContext } from "../contexts/CalendarContext";
import { PlanStackScreenProps } from "../types/navigation";
import { addWeeks, getWeekDays, isToday, startOfDay } from "../utils/dates";

type Props = PlanStackScreenProps<"OutfitPlan">;

type ActiveDay = {
  dateKey: string;
  outfitId: string;
};

const safeAreaEdges: Edge[] = ["top", "left", "right"];

const OutfitPlanScreen = ({ navigation }: Props) => {
  const [anchorDate, setAnchorDate] = useState(() => startOfDay(new Date()));
  const [activeDay, setActiveDay] = useState<ActiveDay | null>(null);

  const calendarContext = useContext(CalendarContext);

  const handlePrevious = useCallback(() => setAnchorDate((prev) => addWeeks(prev, -1)), []);
  const handleNext = useCallback(() => setAnchorDate((prev) => addWeeks(prev, 1)), []);
  const handleToday = useCallback(() => setAnchorDate(startOfDay(new Date())), []);

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

  const isTodayVisible = getWeekDays(anchorDate).some(isToday);

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Plan</Text>
      </View>

      <WeekHeader
        anchorDate={anchorDate}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        isTodayVisible={isTodayVisible}
      />

      <WeekView anchorDate={anchorDate} onSelectDate={handleSelectDate} />

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
