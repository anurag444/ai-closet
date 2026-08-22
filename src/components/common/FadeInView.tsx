import React, { ReactNode, useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing } from "react-native-reanimated";

// Reanimated 4 needs the New Architecture for its entering/exiting layout
// animations, and this app runs with newArchEnabled false. Those animations
// silently never run, leaving the view stuck at opacity 0. Driving a shared
// value on mount works on both architectures.
type Props = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  offsetY?: number;
  style?: StyleProp<ViewStyle>;
};

const FadeInView = ({ children, delay = 0, duration = 320, offsetY = 12, style }: Props) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * offsetY }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

export default FadeInView;
