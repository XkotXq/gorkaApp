import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from "react-native-reanimated";

const TypingIndicator = () => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot1.value }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot2.value }],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot3.value }],
  }));

  useEffect(() => {
    dot1.value = withRepeat(
      withTiming(-5, { duration: 600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    dot2.value = withDelay(
      150,
      withRepeat(
        withTiming(-5, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
    dot3.value = withDelay(
      300,
      withRepeat(
        withTiming(-5, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  return (
    <View style={{ flexDirection: "row", gap: 4, display: "flex", transform: [{ translateY: 2 }] }}>
      <Animated.View
        style={[
          {
            width: 8,
            height: 8,
            backgroundColor: "#404040",
            borderRadius: 4,
          },
          animatedStyle1,
        ]}
      />
      <Animated.View
        style={[
          {
            width: 8,
            height: 8,
            backgroundColor: "#404040",
            borderRadius: 4,
          },
          animatedStyle2,
        ]}
      />
      <Animated.View
        style={[
          {
            width: 8,
            height: 8,
            backgroundColor: "#404040",
            borderRadius: 4,
          },
          animatedStyle3,
        ]}
      />
    </View>
  );
};

export default TypingIndicator;