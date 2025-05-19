import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing, interpolate } from "react-native-reanimated";

export default function SkeletonPost() {
	const shimmerValue = useSharedValue(0);

    useEffect(() => {
        shimmerValue.value = withRepeat(
            withTiming(1, {
                duration: 2000,
                easing: Easing.linear,
            }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(shimmerValue.value, [0, 1], [0.5, 0.8]);
        return {
            opacity,
        };
    });

    return (
        <View className="rounded-xl relative flex border-b border-neutral-700">
            <View className="flex flex-row items-center p-2 grow">
                <Animated.View className="h-12 w-12 rounded-full border-neutral-700 bg-neutral-600 " style={animatedStyle} />
                <View className="flex flex-col gap-2 pl-2 shrink grow">
                    <Animated.View className="h-5 w-1/2 bg-neutral-600 rounded-md" style={animatedStyle} />
                    <Animated.View className="h-4 w-1/4 bg-neutral-600 rounded-md" style={animatedStyle} />
                </View>
            </View>
            <Animated.View className="m-2 flex grow h-12 bg-neutral-600 rounded-lg" style={animatedStyle} />
            <View className="p-2 flex flex-row gap-2 grow items-center">
                <Animated.View className="w-9 h-9 rounded-lg bg-neutral-600" style={animatedStyle} />
                <Animated.View className="w-9 h-5 rounded-lg bg-neutral-600" style={animatedStyle} />
            </View>
        </View>
    );
}
