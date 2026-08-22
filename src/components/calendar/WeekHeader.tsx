import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";
import PressableFade from "../common/PressableFade";
import { formatMonthYear } from "../../utils/dates";

type Props = {
  anchorDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  isTodayVisible: boolean;
};

const WeekHeader = ({ anchorDate, onPrevious, onNext, onToday, isTodayVisible }: Props) => (
  <View style={styles.container}>
    <Text style={styles.monthLabel}>{formatMonthYear(anchorDate)}</Text>

    <View style={styles.controls}>
      {/* Nothing to jump back to while the current week is already on screen */}
      {!isTodayVisible && (
        <PressableFade style={styles.todayButton} onPress={onToday}>
          <Text style={styles.todayLabel}>Today</Text>
        </PressableFade>
      )}

      <PressableFade style={styles.chevron} onPress={onPrevious}>
        <MaterialIcons name="chevron-left" size={28} color={colors.icon_stroke} />
      </PressableFade>

      <PressableFade style={styles.chevron} onPress={onNext}>
        <MaterialIcons name="chevron-right" size={28} color={colors.icon_stroke} />
      </PressableFade>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  monthLabel: {
    fontSize: 20,
    fontFamily: typography.semiBold,
    color: colors.text_primary,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.light_yellow,
    marginRight: 4,
  },
  todayLabel: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.text_primary,
  },
  chevron: {
    padding: 4,
  },
});

export default WeekHeader;
