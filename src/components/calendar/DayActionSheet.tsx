import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";
import PressableFade from "../common/PressableFade";
import { fromDateKey, formatShortDate } from "../../utils/dates";

type Props = {
  dateKey: string | null;
  onClose: () => void;
  onView: () => void;
  onReplace: () => void;
  onRemove: () => void;
};

const DayActionSheet = ({ dateKey, onClose, onView, onReplace, onRemove }: Props) => {
  if (!dateKey) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>{formatShortDate(fromDateKey(dateKey))}</Text>
          <PressableFade onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={colors.icon_stroke} />
          </PressableFade>
        </View>

        <View style={styles.actionsList}>
          <PressableFade style={styles.actionItem} onPress={onView}>
            <MaterialIcons name="visibility" size={22} color={colors.icon_stroke} />
            <Text style={styles.actionLabel}>View outfit</Text>
          </PressableFade>

          <PressableFade style={styles.actionItem} onPress={onReplace}>
            <MaterialIcons name="swap-horiz" size={22} color={colors.icon_stroke} />
            <Text style={styles.actionLabel}>Replace outfit</Text>
          </PressableFade>

          <PressableFade style={styles.actionItem} onPress={onRemove}>
            <MaterialIcons name="event-busy" size={22} color={colors.primary_red} />
            <Text style={[styles.actionLabel, styles.actionLabelDestructive]}>Remove from this day</Text>
          </PressableFade>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background_dim,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.screen_background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: typography.bold,
    fontSize: 20,
    color: colors.text_primary,
  },
  closeButton: {
    padding: 4,
  },
  actionsList: {
    gap: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: colors.thumbnail_background,
    borderRadius: 12,
  },
  actionLabel: {
    fontFamily: typography.semiBold,
    fontSize: 16,
    color: colors.text_primary,
  },
  actionLabelDestructive: {
    color: colors.primary_red,
  },
});

export default DayActionSheet;
