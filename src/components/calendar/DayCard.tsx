import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Outfit } from "../../types/Outfit";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";
import OutfitThumbnail from "../outfit/OutfitThumbnail";
import { WEEKDAY_ABBREVIATIONS, isToday } from "../../utils/dates";

const THUMBNAIL_HEIGHT = 104;
const THUMBNAIL_WIDTH = (THUMBNAIL_HEIGHT * 3) / 4; // 3:4, matching the outfit grid

type Props = {
  date: Date;
  outfit?: Outfit;
};

const DayCard = ({ date, outfit }: Props) => {
  const isCurrentDay = isToday(date);

  return (
    <View style={[styles.container, isCurrentDay && styles.containerToday]}>
      <View style={styles.dateColumn}>
        <Text style={[styles.weekday, isCurrentDay && styles.weekdayToday]}>
          {WEEKDAY_ABBREVIATIONS[date.getDay()]}
        </Text>
        <Text style={[styles.dayNumber, isCurrentDay && styles.dayNumberToday]}>{date.getDate()}</Text>
      </View>

      {outfit ? (
        <OutfitThumbnail outfit={outfit} width={THUMBNAIL_WIDTH} height={THUMBNAIL_HEIGHT} onPress={() => {}} />
      ) : (
        <View style={styles.emptySlot}>
          <MaterialIcons name="add" size={24} color={colors.text_gray_light} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider_light,
  },
  containerToday: {
    backgroundColor: colors.light_yellow,
  },
  dateColumn: {
    width: 44,
    alignItems: "center",
  },
  weekday: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.text_gray_light,
  },
  weekdayToday: {
    color: colors.text_gray,
  },
  dayNumber: {
    fontFamily: typography.bold,
    fontSize: 22,
    color: colors.text_primary,
  },
  dayNumberToday: {
    color: colors.text_primary,
  },
  emptySlot: {
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border_gray,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DayCard;
