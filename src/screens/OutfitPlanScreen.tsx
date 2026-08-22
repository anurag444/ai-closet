import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import WeekHeader from "../components/calendar/WeekHeader";
import WeekView from "../components/calendar/WeekView";
import { PlanStackScreenProps } from "../types/navigation";
import { addWeeks, getWeekDays, isToday, startOfDay } from "../utils/dates";

type Props = PlanStackScreenProps<"OutfitPlan">;

const safeAreaEdges: Edge[] = ["top", "left", "right"];

const OutfitPlanScreen = ({ navigation }: Props) => {
  const [anchorDate, setAnchorDate] = useState(() => startOfDay(new Date()));

  const handlePrevious = useCallback(() => setAnchorDate((prev) => addWeeks(prev, -1)), []);
  const handleNext = useCallback(() => setAnchorDate((prev) => addWeeks(prev, 1)), []);
  const handleToday = useCallback(() => setAnchorDate(startOfDay(new Date())), []);

  const handleSelectDate = useCallback(
    (dateKey: string) => navigation.navigate("SelectOutfitModal", { dateKey }),
    [navigation]
  );

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
