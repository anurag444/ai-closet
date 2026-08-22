import React, { useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { CalendarContext } from "../../contexts/CalendarContext";
import { OutfitContext } from "../../contexts/OutfitContext";
import DayCard from "./DayCard";
import { getWeekDays, toDateKey } from "../../utils/dates";

type Props = {
  anchorDate: Date;
  onSelectDate: (dateKey: string, outfitId?: string) => void;
};

const WeekView = ({ anchorDate, onSelectDate }: Props) => {
  const calendarContext = useContext(CalendarContext);
  const outfitContext = useContext(OutfitContext);

  const days = getWeekDays(anchorDate);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {days.map((day) => {
        const dateKey = toDateKey(day);
        const entry = calendarContext?.getEntryForDate(dateKey);
        const outfit = entry ? outfitContext?.getOutfit(entry.outfitId) : undefined;

        return <DayCard key={dateKey} date={day} outfit={outfit} onPress={() => onSelectDate(dateKey, outfit?.id)} />;
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
