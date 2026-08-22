import React, { useCallback, useContext } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { OutfitContext } from "../contexts/OutfitContext";
import { CalendarContext } from "../contexts/CalendarContext";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import OutfitThumbnail from "../components/outfit/OutfitThumbnail";
import PressableFade from "../components/common/PressableFade";
import TagFilterSection from "../components/common/TagFilterSection";
import { RootStackScreenProps } from "../types/navigation";
import { Outfit } from "../types/Outfit";
import { fromDateKey, formatMonthDay } from "../utils/dates";

type Props = RootStackScreenProps<"SelectOutfitModal">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const GRID_PADDING = 16;
const GRID_SPACING = 12;
const ITEM_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_SPACING * (COLUMN_COUNT - 1)) / COLUMN_COUNT;
const ITEM_HEIGHT = (ITEM_WIDTH * 4) / 3; // 3:4 aspect ratio

const safeAreaEdges: Edge[] = ["top", "left", "right"];

const SelectOutfitModalScreen = ({ navigation, route }: Props) => {
  const { dateKey } = route.params;

  const outfitContext = useContext(OutfitContext);
  const calendarContext = useContext(CalendarContext);

  if (!outfitContext || !calendarContext) {
    return <Text>Loading...</Text>;
  }

  const { tagData, filteredOutfits, activeFilters, setFilter } = outfitContext;
  const { setOutfitForDate } = calendarContext;

  const handleTagPress = useCallback(
    (tag: string) => {
      const currentTags = activeFilters.tags || [];
      const newTags = currentTags.includes(tag) ? currentTags.filter((t) => t !== tag) : [...currentTags, tag];
      setFilter("tags", newTags);
    },
    [activeFilters.tags, setFilter]
  );

  // Assign through the context rather than a callback param, which would put a
  // non-serializable function into navigation state
  const handleSelectOutfit = useCallback(
    (outfitId: string) => {
      setOutfitForDate(dateKey, outfitId);
      navigation.goBack();
    },
    [dateKey, setOutfitForDate, navigation]
  );

  const renderItem = ({ item, index }: { item: Outfit; index: number }) => {
    const isFirstInRow = index % COLUMN_COUNT === 0;
    const style = isFirstInRow
      ? { marginRight: GRID_SPACING / 2, marginBottom: GRID_SPACING }
      : { marginLeft: GRID_SPACING / 2, marginBottom: GRID_SPACING };

    return (
      <OutfitThumbnail
        outfit={item}
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
        style={style}
        onPress={() => handleSelectOutfit(item.id)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      <View style={styles.header}>
        <Text style={styles.title}>Plan {formatMonthDay(fromDateKey(dateKey))}</Text>
        <PressableFade onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color={colors.icon_stroke} />
        </PressableFade>
      </View>

      <TagFilterSection tagData={tagData} selectedTags={activeFilters.tags || []} onTagPress={handleTagPress} />

      <FlatList
        data={filteredOutfits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={styles.gridContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No outfits yet</Text>
            <Text style={styles.emptyHint}>Build one on the Outfits tab first.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screen_background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
  gridContent: {
    padding: GRID_PADDING,
  },
  empty: {
    alignItems: "center",
    paddingTop: 64,
    gap: 8,
  },
  emptyText: {
    fontFamily: typography.semiBold,
    fontSize: 16,
    color: colors.text_gray,
  },
  emptyHint: {
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.text_gray_light,
  },
});

export default SelectOutfitModalScreen;
