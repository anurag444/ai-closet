import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { palette, spacing, radius, fontFamily, fontSize, shadow } from "../../styles/theme";

const CABINET = {
  width: 176,
  height: 204,
  border: 2,
  padding: 12,
};

const RAIL_TOP = 26;

const GARMENTS = [
  { color: palette.rose, shoulder: 36, body: 28, length: 92 },
  { color: palette.gold, shoulder: 32, body: 25, length: 76 },
  { color: palette.rose_deep, shoulder: 36, body: 28, length: 100 },
];

// Timeline, in ms from mount
const CABINET_IN = { delay: 100, duration: 350 };
const DOORS_OPEN = { delay: 500, duration: 600 };
const GARMENT_IN = { delay: 800, stagger: 100, duration: 300 };
const NAME_IN = { delay: 1250, duration: 400 };
const EXIT = { delay: 1850, duration: 400 };

const EASE_OUT = Easing.out(Easing.cubic);

type Props = {
  onFinish: () => void;
};

type GarmentProps = {
  garment: (typeof GARMENTS)[number];
  index: number;
};

// A shirt on a hanger: hook, shoulder bar, body
const Garment = ({ garment, index }: GarmentProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      GARMENT_IN.delay + index * GARMENT_IN.stagger,
      withTiming(1, { duration: GARMENT_IN.duration, easing: EASE_OUT })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * -12 }],
  }));

  return (
    <Animated.View style={[styles.garment, animatedStyle]}>
      <View style={styles.hook} />
      <View style={[styles.shoulder, { width: garment.shoulder, backgroundColor: garment.color }]} />
      <View
        style={[styles.body, { width: garment.body, height: garment.length, backgroundColor: garment.color }]}
      />
    </Animated.View>
  );
};

type DoorProps = {
  side: "left" | "right";
};

const Door = ({ side }: DoorProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      DOORS_OPEN.delay,
      withTiming(1, { duration: DOORS_OPEN.duration, easing: EASE_OUT })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const angle = progress.value * (side === "left" ? -105 : 105);
    return {
      transform: [{ perspective: 700 }, { rotateY: `${angle}deg` }],
      // Fade out the last stretch so a door swung nearly edge-on doesn't linger
      opacity: 1 - Math.max(0, (progress.value - 0.75) / 0.25),
    };
  });

  return (
    <Animated.View
      style={[
        styles.door,
        side === "left" ? styles.doorLeft : styles.doorRight,
        animatedStyle,
      ]}
    >
      <View style={[styles.handle, side === "left" ? styles.handleLeft : styles.handleRight]} />
    </Animated.View>
  );
};

const AnimatedSplash = ({ onFinish }: Props) => {
  const cabinetProgress = useSharedValue(0);
  const nameProgress = useSharedValue(0);
  const exitProgress = useSharedValue(0);

  useEffect(() => {
    cabinetProgress.value = withDelay(
      CABINET_IN.delay,
      withTiming(1, { duration: CABINET_IN.duration, easing: EASE_OUT })
    );

    nameProgress.value = withDelay(NAME_IN.delay, withTiming(1, { duration: NAME_IN.duration, easing: EASE_OUT }));

    exitProgress.value = withDelay(
      EXIT.delay,
      withTiming(1, { duration: EXIT.duration, easing: EASE_OUT }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      })
    );
  }, []);

  const cabinetStyle = useAnimatedStyle(() => ({
    opacity: cabinetProgress.value,
    transform: [{ scale: 0.92 + cabinetProgress.value * 0.08 }],
  }));

  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameProgress.value,
    transform: [{ translateY: (1 - nameProgress.value) * 14 }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: 1 - exitProgress.value,
    transform: [{ scale: 1 + exitProgress.value * 0.04 }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]} pointerEvents="none">
      <Animated.View style={[styles.cabinet, cabinetStyle]}>
        {/* Interior: rail with clothes hanging from it */}
        <View style={styles.interior}>
          <View style={styles.rail} />
          <View style={styles.garments}>
            {GARMENTS.map((garment, index) => (
              <Garment key={garment.color} garment={garment} index={index} />
            ))}
          </View>
        </View>

        <Door side="left" />
        <Door side="right" />
      </Animated.View>

      <Animated.View style={nameStyle}>
        <Text style={styles.name}>Closette</Text>
        <Text style={styles.tagline}>everything, in its place</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.cream,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  cabinet: {
    width: CABINET.width,
    height: CABINET.height,
    borderRadius: radius.lg,
    borderWidth: CABINET.border,
    borderColor: palette.ink,
    backgroundColor: palette.blush,
    overflow: "hidden",
    marginBottom: spacing.xxl,
    ...shadow.lifted,
  },
  interior: {
    flex: 1,
    padding: CABINET.padding,
  },
  rail: {
    position: "absolute",
    left: CABINET.padding,
    right: CABINET.padding,
    top: RAIL_TOP,
    height: 2,
    borderRadius: 1,
    backgroundColor: palette.ink_faint,
  },
  garments: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    paddingTop: RAIL_TOP - CABINET.padding - 6,
  },
  garment: {
    alignItems: "center",
  },
  hook: {
    width: 2,
    height: 8,
    borderRadius: 1,
    backgroundColor: palette.ink_faint,
  },
  shoulder: {
    height: 9,
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
  },
  body: {
    borderBottomLeftRadius: radius.sm,
    borderBottomRightRadius: radius.sm,
  },
  door: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "50%",
    backgroundColor: palette.blush_deep,
    borderColor: palette.ink,
    justifyContent: "center",
  },
  doorLeft: {
    left: 0,
    borderRightWidth: 1,
    transformOrigin: "left center",
  },
  doorRight: {
    right: 0,
    borderLeftWidth: 1,
    transformOrigin: "right center",
  },
  handle: {
    position: "absolute",
    width: 3,
    height: 22,
    borderRadius: 2,
    backgroundColor: palette.ink,
  },
  handleLeft: {
    right: 8,
  },
  handleRight: {
    left: 8,
  },
  name: {
    fontFamily: fontFamily.display,
    fontSize: 38,
    color: palette.ink,
    textAlign: "center",
  },
  tagline: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.label,
    color: palette.rose_deep,
    textAlign: "center",
    marginTop: spacing.sm,
    letterSpacing: 0.4,
  },
});

export default AnimatedSplash;
