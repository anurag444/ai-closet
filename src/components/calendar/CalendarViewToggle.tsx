import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";
import PressableFade from "../common/PressableFade";

export type CalendarViewMode = "week" | "month";

const VIEW_MODES: CalendarViewMode[] = ["week", "month"];

type Props = {
  viewMode: CalendarViewMode;
  onChange: (viewMode: CalendarViewMode) => void;
};

const CalendarViewToggle = ({ viewMode, onChange }: Props) => (
  <View style={styles.container}>
    {VIEW_MODES.map((mode) => {
      const isActive = mode === viewMode;

      return (
        <PressableFade
          key={mode}
          style={[styles.segment, isActive && styles.segmentActive]}
          onPress={() => onChange(mode)}
        >
          <Text style={[styles.label, isActive && styles.labelActive]}>
            {mode === "week" ? "Week" : "Month"}
          </Text>
        </PressableFade>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.tag_light,
    borderRadius: 16,
    padding: 2,
  },
  segment: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  segmentActive: {
    backgroundColor: colors.primary_yellow,
  },
  label: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.tag_light_text,
  },
  labelActive: {
    fontFamily: typography.semiBold,
    color: colors.text_primary,
  },
});

export default CalendarViewToggle;
