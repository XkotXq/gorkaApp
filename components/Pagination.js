import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

export default function Pagination({ photos, currentSlideIndex }) {
    // return null;
    const translateX = useSharedValue(((Math.floor(photos.length) / 2) * 8) - (currentSlideIndex * 8));

    useEffect(() => {
        const targetTranslateX = ((Math.floor(photos.length) / 2) * 8) - (currentSlideIndex * 8);
        translateX.value = withTiming(targetTranslateX, { duration: 300 });
    }, [currentSlideIndex]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    // Przenieś hooki useSharedValue i useEffect poza pętlę map
    const scaleShValues = photos.map(() => useSharedValue(0));
    const animatedScales = scaleShValues.map((scaleSh, index) => {
        useEffect(() => {
            scaleSh.value = withTiming(
                (index >= currentSlideIndex - 2 && index <= currentSlideIndex + 2) ? 1 :
                (index >= currentSlideIndex - 3 && index <= currentSlideIndex + 3) ? 0.5 : 0,
                { duration: 300 }
            );
        }, [currentSlideIndex]);

        return useAnimatedStyle(() => ({
            transform: [{ scale: scaleSh.value }],
        }));
    });

    return (
        <View>
            <Animated.View
                className="flex flex-row items-center justify-center mt-2"
                style={animatedStyle}
            >
                {photos.map((_, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            {
                                height: currentSlideIndex === index ? 7 : 6,
                                width: currentSlideIndex === index ? 7 : 6,
                                marginHorizontal: 2,
                                borderRadius: 10,
                                backgroundColor: currentSlideIndex === index ? "#D0F601" : "gray",
                            },
                            animatedScales[index],
                        ]}
                    />
                ))}
            </Animated.View>
        </View>
    );
}