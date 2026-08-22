import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { ClothingContext } from "../contexts/ClothingContext";
import { OutfitContext } from "../contexts/OutfitContext";
import { CalendarContext } from "../contexts/CalendarContext";
import { VirtualTryOnContext } from "../contexts/VirtualTryOnContext";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import PressableFade from "../components/common/PressableFade";
import { categories } from "../data/categories";
import appConfig from "../../app.json";

const safeAreaEdges: Edge[] = ["top", "left", "right"];

type StatProps = {
  label: string;
  value: number;
};

const Stat = ({ label, value }: StatProps) => (
  <View style={styles.statTile}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ProfileScreen = () => {
  const clothingContext = useContext(ClothingContext);
  const outfitContext = useContext(OutfitContext);
  const calendarContext = useContext(CalendarContext);
  const tryOnContext = useContext(VirtualTryOnContext);

  if (!clothingContext || !outfitContext || !calendarContext || !tryOnContext) {
    return <Text>Loading...</Text>;
  }

  const { clothingItems, categoryData } = clothingContext;
  const { outfits } = outfitContext;
  const { entries } = calendarContext;
  const { recentTryOns, clearHistory } = tryOnContext;

  const handleClearHistory = () => {
    if (recentTryOns.length === 0) {
      return;
    }

    Alert.alert(
      "Clear Try-On History",
      `Delete all ${recentTryOns.length} try-on result${recentTryOns.length > 1 ? "s" : ""}? Your clothes and outfits are not affected.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: () => clearHistory() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.statGrid}>
          <Stat label="Items" value={clothingItems.length} />
          <Stat label="Outfits" value={outfits.length} />
          <Stat label="Days Planned" value={entries.length} />
          <Stat label="Try-Ons" value={recentTryOns.length} />
        </View>

        <Text style={styles.sectionTitle}>Closet Breakdown</Text>
        <View style={styles.card}>
          {Object.keys(categories).map((category, index) => (
            <View key={category} style={[styles.row, index > 0 && styles.rowDivided]}>
              <Text style={styles.rowLabel}>{category}</Text>
              <Text style={styles.rowValue}>{categoryData[category] ?? 0}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <PressableFade
            style={styles.row}
            onPress={handleClearHistory}
            disabled={recentTryOns.length === 0}
          >
            <Text style={[styles.rowLabel, recentTryOns.length === 0 && styles.rowLabelDisabled]}>
              Clear try-on history
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={recentTryOns.length === 0 ? colors.text_gray_light : colors.icon_stroke}
            />
          </PressableFade>
        </View>

        <Text style={styles.version}>Version {appConfig.expo.version}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screen_background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: typography.bold,
    color: colors.text_primary,
    marginBottom: 16,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statTile: {
    flexGrow: 1,
    flexBasis: "45%",
    backgroundColor: colors.thumbnail_background,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  statValue: {
    fontFamily: typography.bold,
    fontSize: 28,
    color: colors.text_primary,
  },
  statLabel: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.text_gray,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: typography.semiBold,
    fontSize: 16,
    color: colors.text_gray,
    marginTop: 24,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.thumbnail_background,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  rowDivided: {
    borderTopWidth: 1,
    borderTopColor: colors.border_gray_light,
  },
  rowLabel: {
    fontFamily: typography.medium,
    fontSize: 15,
    color: colors.text_primary,
  },
  rowLabelDisabled: {
    color: colors.text_gray_light,
  },
  rowValue: {
    fontFamily: typography.semiBold,
    fontSize: 15,
    color: colors.text_gray,
  },
  version: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: colors.text_gray_light,
    textAlign: "center",
    marginTop: 24,
  },
});

export default ProfileScreen;
