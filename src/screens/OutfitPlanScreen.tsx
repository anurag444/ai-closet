import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import { CalendarContext } from "../contexts/CalendarContext";
import { PlanStackScreenProps } from "../types/navigation";
import { toDateKey } from "../utils/dates";

type Props = PlanStackScreenProps<"OutfitPlan">;

const safeAreaEdges: Edge[] = ["top", "left", "right"];

const OutfitPlanScreen = ({}: Props) => {
  const calendarContext = useContext(CalendarContext);

  if (!calendarContext) {
    return <Text>Loading...</Text>;
  }

  const { entries } = calendarContext;

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      <View style={styles.header}>
        <Text style={styles.title}>Plan</Text>
      </View>

      {/* Placeholder until the week view lands */}
      <View style={styles.content}>
        <Text style={styles.placeholder}>Today is {toDateKey(new Date())}</Text>
        <Text style={styles.placeholder}>
          {entries.length} outfit{entries.length === 1 ? "" : "s"} planned
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screen_background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  placeholder: {
    fontFamily: typography.regular,
    fontSize: 16,
    color: colors.text_gray,
  },
});

export default OutfitPlanScreen;
