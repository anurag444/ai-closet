import React, { useCallback, useContext, useState } from "react";
import { Text, StyleSheet, FlatList, ScrollView, Pressable, Alert, Dimensions } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { ClothingContext } from "../contexts/ClothingContext";
import { ClothingItem } from "../types/ClothingItem";
import { ClosetStackScreenProps } from "../types/navigation";
import ClothingItemThumbnail from "../components/clothing/ClothingItemThumbnail";
import AnimatedAddButton from "../components/common/AnimatedAddButton";
import TagFilterSection from "../components/common/TagFilterSection";
import DeleteModeHeader from "../components/common/DeleteModeHeader";
import DeleteButton from "../components/common/DeleteButton";
import { categories } from "../data/categories";
import ScreenHeader from "../components/common/ScreenHeader";
import EmptyState from "../components/common/EmptyState";
import FadeInView from "../components/common/FadeInView";
import { palette, spacing, radius, fontFamily, fontSize } from "../styles/theme";

type Props = ClosetStackScreenProps<"ClothingManagement">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_COUNT = 3;
const GRID_PADDING = 10;
// Fixed pixel cells rather than flex: Reanimated's entering animation measures
// flex children unreliably on Android and can render them at zero width
const CELL_SIZE = (SCREEN_WIDTH - GRID_PADDING * 2) / COLUMN_COUNT;

interface CategoryTabProps {
  name: string;
  isSelected: boolean;
  onPress: () => void;
  count: number;
}

// CategoryTab Subcomponent
const CategoryTab = ({ name, isSelected, onPress, count }: CategoryTabProps) => (
  <Pressable style={[styles.categoryTab, isSelected && styles.categoryTabSelected]} onPress={onPress}>
    <Text style={[styles.categoryTabText, isSelected && styles.categoryTabTextSelected]}>{name}</Text>
    <Text style={[styles.categoryCount, isSelected && styles.categoryCountSelected]}>{count}</Text>
  </Pressable>
);

// Main Component
const ClothingManagementScreen = ({ navigation }: Props) => {
  const context = useContext(ClothingContext);

  // Selection state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const {
    clothingItems,
    categoryData,
    tagData,
    filteredItems,
    activeFilters,
    setFilter,
    addClothingItemFromImage,
    deleteClothingItem,
  } = context;

  // Selection handlers
  const handleLongPress = useCallback((itemId: string) => {
    setIsSelectionMode(true);
    setSelectedItems(new Set([itemId]));
  }, []);

  const handleItemPress = useCallback(
    (itemId: string) => {
      if (isSelectionMode) {
        setSelectedItems((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(itemId)) {
            newSet.delete(itemId);
            // If no items are selected, exit selection mode
            if (newSet.size === 0) {
              setIsSelectionMode(false);
            }
          } else {
            newSet.add(itemId);
          }
          return newSet;
        });
      } else {
        navigation.navigate("ClothingDetail", { id: itemId });
      }
    },
    [isSelectionMode, navigation]
  );

  const handleCancelSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedItems(new Set());
  }, []);

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete Items",
      `Are you sure you want to delete ${selectedItems.size} item${selectedItems.size > 1 ? "s" : ""}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            selectedItems.forEach((id) => {
              deleteClothingItem(id);
            });
            setIsSelectionMode(false);
            setSelectedItems(new Set());
          },
        },
      ]
    );
  }, [selectedItems, deleteClothingItem]);

  const handleAddClothingItem = async (imageUri: string) => {
    try {
      // Add the item immediately and get its ID
      const newItemId = await addClothingItemFromImage(imageUri);

      // Navigate to the detail screen right away
      navigation.navigate("ClothingDetail", { id: newItemId });
    } catch (error) {
      console.error("Error adding clothing item:", error);
      Alert.alert("Error", "Failed to add clothing item. Please try again.");
    }
  };

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      handleAddClothingItem(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      handleAddClothingItem(result.assets[0].uri);
    }
  };

  const handleTagPress = (tag: string) => {
    const currentTags = activeFilters.tags || [];
    const newTags = currentTags.includes(tag) ? currentTags.filter((t) => t !== tag) : [...currentTags, tag];
    setFilter("tags", newTags);
  };

  const renderItem = ({ item, index }: { item: ClothingItem; index: number }) => (
    // The wrapper owns the grid cell; the thumbnail just fills it. Without the
    // sizing here its own flex: 1/3 resolves against a zero-width parent.
    <FadeInView style={styles.gridItem} delay={Math.min(index, 11) * 40}>
      <ClothingItemThumbnail
        containerStyle={styles.gridItemFill}
        item={item}
        onPress={() => handleItemPress(item.id)}
        onLongPress={() => handleLongPress(item.id)}
        isSelectable={isSelectionMode}
        isSelected={selectedItems.has(item.id)}
      />
    </FadeInView>
  );

  const safeAreaEdges: Edge[] = ["top", "left", "right"];

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      {/* Header */}
      {isSelectionMode ? (
        <DeleteModeHeader selectedCount={selectedItems.size} onCancel={handleCancelSelection} />
      ) : (
        <ScreenHeader
          title="My Closet"
          subtitle={`${clothingItems.length} ${clothingItems.length === 1 ? "piece" : "pieces"}`}
        />
      )}

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabsContainer}
        contentContainerStyle={styles.categoryTabsContent}
      >
        <CategoryTab
          name="All"
          isSelected={activeFilters.category === "All"}
          onPress={() => setFilter("category", "All")}
          count={categoryData.All}
        />
        {Object.keys(categories).map((category) => (
          <CategoryTab
            key={category}
            name={category}
            isSelected={activeFilters.category === category}
            onPress={() => setFilter("category", category)}
            count={categoryData[category]}
          />
        ))}
      </ScrollView>

      {/* Tag Filter Section */}
      <TagFilterSection tagData={tagData} selectedTags={activeFilters.tags || []} onTagPress={handleTagPress} />

      {/* Clothing Grid */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={[styles.gridContent, isSelectionMode && styles.gridContentWithDelete]}
        ListEmptyComponent={
          clothingItems.length === 0 ? (
            <EmptyState
              icon="hanger"
              title="Your closet is waiting"
              message="Add your first piece and I'll remove the background and tag it for you."
            />
          ) : (
            <EmptyState
              icon="magnify"
              title="Nothing here yet"
              message="No pieces match these filters. Try clearing one."
            />
          )
        }
      />

      {/* Add Button or Delete Button */}
      {isSelectionMode ? (
        <DeleteButton onDelete={handleDelete} selectedCount={selectedItems.size} />
      ) : (
        <AnimatedAddButton onChoosePhoto={handleChoosePhoto} onTakePhoto={handleTakePhoto} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  categoryTabsContainer: {
    maxHeight: 48,
  },
  categoryTabsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: palette.blush,
  },
  categoryTabSelected: {
    backgroundColor: palette.rose,
  },
  categoryTabText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.label,
    color: palette.ink_muted,
  },
  categoryTabTextSelected: {
    fontFamily: fontFamily.semiBold,
    color: palette.shell,
  },
  categoryCount: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.caption,
    color: palette.ink_faint,
  },
  categoryCountSelected: {
    color: palette.shell,
  },
  gridItem: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  gridItemFill: {
    width: "100%",
    height: "100%",
    flex: 0,
  },
  gridContent: {
    paddingTop: spacing.sm,
    paddingHorizontal: GRID_PADDING,
    paddingBottom: spacing.xxl,
  },
  gridContentWithDelete: {
    paddingBottom: 80,
  },
});

export default ClothingManagementScreen;
