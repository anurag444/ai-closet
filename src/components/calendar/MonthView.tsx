import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { CalendarContext } from "../../contexts/CalendarContext";
import { OutfitContext } from "../../contexts/OutfitContext";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";
import OutfitThumbnail from "../outfit/OutfitThumbnail";
import PressableFade from "../common/PressableFade";
import { getMonthGrid, toDateKey, isToday, WEEKDAY_ABBREVIATIONS } from "../../utils/dates";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_PADDING = 8;
const DAYS_IN_WEEK = 7;
const CELL_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2) / DAYS_IN_WEEK;
const CELL_SPACING = 3;
const THUMBNAIL_WIDTH = CELL_WIDTH - CELL_SPACING * 2;
const THUMBNAIL_HEIGHT = (THUMBNAIL_WIDTH * 4) / 3; // 3:4, matching the outfit grid

type Props = {
  anchorDate: Date;
  onSelectDate: (dateKey: string, outfitId?: string) => void;
};

const MonthView = ({ anchorDate, onSelectDate }: Props) => {
  const calendarContext = useContext(CalendarContext);
  const outfitContext = useContext(OutfitContext);

  const anchorMonth = anchorDate.getMonth();
  const weeks = getMonthGrid(anchorDate.getFullYear(), anchorMonth);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.weekdayRow}>
        {WEEKDAY_ABBREVIATIONS.map((weekday) => (
          <Text key={weekday} style={styles.weekdayLabel}>
            {weekday}
          </Text>
        ))}
      </View>

      {weeks.map((week) => (
        <View key={toDateKey(week[0])} style={styles.weekRow}>
          {week.map((day) => {
            const dateKey = toDateKey(day);
            const entry = calendarContext?.getEntryForDate(dateKey);
            const outfit = entry ? outfitContext?.getOutfit(entry.outfitId) : undefined;
            const isOutsideMonth = day.getMonth() !== anchorMonth;

            return (
              <View key={dateKey} style={styles.cell}>
                <Text
                  style={[
                    styles.dayNumber,
                    isOutsideMonth && styles.dayNumberOutside,
                    isToday(day) && styles.dayNumberToday,
                  ]}
                >
                  {day.getDate()}
                </Text>

                {outfit ? (
                  <OutfitThumbnail
                    outfit={outfit}
                    width={THUMBNAIL_WIDTH}
                    height={THUMBNAIL_HEIGHT}
                    style={isOutsideMonth ? styles.thumbnailOutside : undefined}
                    onPress={() => onSelectDate(dateKey, outfit.id)}
                  />
                ) : (
                  <PressableFade style={styles.emptySlot} onPress={() => onSelectDate(dateKey)}>
                    <View />
                  </PressableFade>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: GRID_PADDING,
    paddingBottom: 24,
  },
  weekdayRow: {
    flexDirection: "row",
    paddingBottom: 8,
  },
  weekdayLabel: {
    width: CELL_WIDTH,
    textAlign: "center",
    fontFamily: typography.medium,
    fontSize: 11,
    color: colors.text_gray_light,
  },
  weekRow: {
    flexDirection: "row",
  },
  cell: {
    width: CELL_WIDTH,
    alignItems: "center",
    paddingBottom: 6,
  },
  dayNumber: {
    fontFamily: typography.semiBold,
    fontSize: 12,
    color: colors.text_primary,
    marginBottom: 2,
  },
  dayNumberOutside: {
    color: colors.text_gray_light,
  },
  dayNumberToday: {
    color: colors.primary_red,
  },
  thumbnailOutside: {
    opacity: 0.4,
  },
  emptySlot: {
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border_gray_light,
  },
});

export default MonthView;
