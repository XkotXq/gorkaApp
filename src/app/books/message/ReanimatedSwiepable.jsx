import React from "react";
import { StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS
} from "react-native-reanimated";

const MIN_SWIPE_DISTANCE = 20;
const ReanimatedSwipeable = ({ children, onSwipeLeft, onSwipeRight }) => {
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
        if (Math.abs(translateX.value) < 50) {
            if((onSwipeLeft && event.translationX < 0) || (onSwipeRight && event.translationX > 0))
            translateX.value = ctx.startX + event.translationX;
          }
    },
    onEnd: () => {
        if (onSwipeLeft && translateX.value < -40)
            runOnJS(onSwipeLeft)()
        if (onSwipeRight && translateX.value > 40)
            runOnJS(onSwipeRight)()
        translateX.value = withTiming(0)
    //   if (translateX.value < -SWIPE_THRESHOLD) {

    //     translateX.value = withSpring(-SCREEN_WIDTH);
    //     if (onSwipeLeft) onSwipeLeft();
    //   } else if (translateX.value > SWIPE_THRESHOLD) {

    //     translateX.value = withSpring(SCREEN_WIDTH);
    //     if (onSwipeRight) onSwipeRight();
    //   } else {
    //     translateX.value = withSpring(0);
    //   }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} activeOffsetX={[-MIN_SWIPE_DISTANCE, MIN_SWIPE_DISTANCE]}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  container: {
    maxWidth: "70%",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});


export default ReanimatedSwipeable;