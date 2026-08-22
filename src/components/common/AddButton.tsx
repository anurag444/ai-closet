import React from "react";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import PressableFade from "./PressableFade";

const AddButton = ({ onPress }: { onPress: () => void }) => (
  // The positioning has to sit on containerStyle: that is the Pressable, and so
  // the touch target. On style it lands on an inner view, leaving the Pressable
  // zero-sized and untappable.
  <PressableFade containerStyle={styles.container} style={styles.button} onPress={onPress}>
    <MaterialIcons name="add" size={24} color={colors.icon_stroke} />
  </PressableFade>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  button: {
    backgroundColor: colors.primary_yellow,
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AddButton;
