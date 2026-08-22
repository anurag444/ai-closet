import React, { useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { CalendarContext } from "../../contexts/CalendarContext";
import { OutfitContext } from "../../contexts/OutfitContext";
import DayCard from "./DayCard";
import { getWeekDays, toDateKey } from "../../utils/dates";

type Props = {
  anchorDate: Date;
};

const WeekView = ({ anchorDate }: Props) => {
  const calendarContext = useContext(CalendarContext);
  const outfitContext = useContext(OutfitContext);

  const days = getWeekDays(anchorDate);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {days.map((day) => {
        const entry = calendarContext?.getEntryForDate(toDateKey(day));
        const outfit = entry ? outfitContext?.getOutfit(entry.outfitId) : undefined;

        return <DayCard key={toDateKey(day)} date={day} outfit={outfit} />;
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
});

export default WeekView;
