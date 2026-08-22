import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { palette, spacing, fontFamily, fontSize } from "../../styles/theme";

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

const ScreenHeader = ({ title, subtitle, action }: Props) => (
  <View style={styles.container}>
    <View style={styles.text}>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
    {action}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  text: {
    flexShrink: 1,
  },
  title: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.display,
    color: palette.ink,
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.label,
    color: palette.rose_deep,
    marginTop: spacing.xs,
  },
});

export default ScreenHeader;
