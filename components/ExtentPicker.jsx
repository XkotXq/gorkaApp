import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	runOnJS,
} from "react-native-reanimated";

export default function ExtentPicker({ onChange }) {
	const translateY = useSharedValue(0);
    const lastTranslateY = useSharedValue(0);

	const gesture = Gesture.Pan()
    .onEnd((e) => {
        const newTranslateY = lastTranslateY.value + e.translationY; // Oblicz końcową pozycję
        if (newTranslateY < -16) {
            translateY.value = withTiming(-34, { duration: 200 });
            runOnJS(onChange)("rozszerzenie");
        } else {
            translateY.value = withTiming(0, { duration: 200 });
            runOnJS(onChange)("podstawa");
        }
        lastTranslateY.value = translateY.value; // Zaktualizuj ostatnią pozycję
    });

	const styleTranslateY = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: translateY.value }],
		};
	});
	return (
		<View className="flex border-neutral-600 border rounded-full p-2 overflow-hidden relative flex-1">
			<GestureDetector gesture={gesture}>
				<View className="overflow-hidden flex-1 h-[26px] flex justify-center items-center">
					<Animated.View
						className="flex flex-col items-center relative w-full gap-2 h-[26px]"
						style={styleTranslateY}>
						<View className="h-[26px] w-full flex justify-center items-center  gap-2">
							<Text className="text-white font-GilroyMedium text-2xl text-center">
								Podstawa
							</Text>
						</View>
						<View className="flex flex-row items-center justify-center h-[26px] w-full">
							<Text className="text-white font-GilroyMedium text-2xl text-center">
								Rozszerzenie
							</Text>
						</View>
					</Animated.View>
				</View>
			</GestureDetector>
		</View>
	);
}

const styles = StyleSheet.create({});
