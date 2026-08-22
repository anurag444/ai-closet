import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { palette, spacing, radius, fontFamily, fontSize } from "../../styles/theme";

type Props = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  message: string;
};

const EmptyState = ({ icon, title, message }: Props) => (
  <Animated.View entering={FadeInDown.duration(400)} style={styles.container}>
    <View style={styles.iconCircle}>
      <MaterialCommunityIcons name={icon} size={34} color={palette.rose} />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 2,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    backgroundColor: palette.rose_soft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.title,
    color: palette.ink,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  message: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.body,
    lineHeight: 22,
    color: palette.ink_muted,
    textAlign: "center",
  },
});

export default EmptyState;
