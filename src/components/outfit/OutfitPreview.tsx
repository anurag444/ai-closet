import React, { useContext, useMemo } from "react";
import { View, Image, StyleSheet } from "react-native";
import { ClothingContext } from "../../contexts/ClothingContext";
import { Outfit } from "../../types/Outfit";
import { DEFAULT_ITEM_SIZE } from "./DraggableClothingItem";

// Renders an outfit live from its stored item positions instead of a captured
// image. The canvas already replays these on edit, so the data is always intact
// even when a snapshot failed.
type Props = {
  outfit: Outfit;
  width: number;
  height: number;
};

const PADDING_RATIO = 0.06;

const OutfitPreview = ({ outfit, width, height }: Props) => {
  const clothingContext = useContext(ClothingContext);

  const placedItems = useMemo(() => {
    const items = outfit.clothingItems
      .map((item) => ({ item, clothing: clothingContext?.getClothingItem(item.id) }))
      .filter((entry) => !!entry.clothing);

    if (items.length === 0) return [];

    // transform.x/y is the top-left of an unscaled 260px box, and scale is
    // applied about the box's centre, so work out each item's real extent
    const boxes = items.map(({ item, clothing }) => {
      const half = (DEFAULT_ITEM_SIZE * item.transform.scale) / 2;
      const centerX = item.transform.x + DEFAULT_ITEM_SIZE / 2;
      const centerY = item.transform.y + DEFAULT_ITEM_SIZE / 2;

      return { item, clothing, centerX, centerY, half };
    });

    const minX = Math.min(...boxes.map((b) => b.centerX - b.half));
    const maxX = Math.max(...boxes.map((b) => b.centerX + b.half));
    const minY = Math.min(...boxes.map((b) => b.centerY - b.half));
    const maxY = Math.max(...boxes.map((b) => b.centerY + b.half));

    // Fit the whole arrangement into the box, never enlarging past 1:1
    const padding = Math.min(width, height) * PADDING_RATIO;
    const contentWidth = Math.max(maxX - minX, 1);
    const contentHeight = Math.max(maxY - minY, 1);
    const scale = Math.min((width - padding * 2) / contentWidth, (height - padding * 2) / contentHeight);

    // Centre whatever slack is left over
    const offsetX = (width - contentWidth * scale) / 2;
    const offsetY = (height - contentHeight * scale) / 2;

    return boxes.map(({ item, clothing, centerX, centerY, half }) => {
      const size = half * 2 * scale;

      return {
        key: item.id,
        uri: clothing!.backgroundRemovedImageUri || clothing!.imageUri,
        zIndex: item.zIndex || 0,
        left: (centerX - half - minX) * scale + offsetX,
        top: (centerY - half - minY) * scale + offsetY,
        size,
        rotation: item.transform.rotation,
      };
    });
  }, [outfit.clothingItems, clothingContext, width, height]);

  return (
    <View style={styles.container}>
      {placedItems.map((placed) => (
        <Image
          key={placed.key}
          source={{ uri: placed.uri }}
          resizeMode="contain"
          style={[
            styles.item,
            {
              left: placed.left,
              top: placed.top,
              width: placed.size,
              height: placed.size,
              zIndex: placed.zIndex,
              transform: [{ rotate: `${placed.rotation}deg` }],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  item: {
    position: "absolute",
  },
});

export default OutfitPreview;
