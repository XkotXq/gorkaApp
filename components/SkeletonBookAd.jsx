import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withRepeat,
	Easing,
	interpolate,
} from "react-native-reanimated";

export default function SkeletonBookAd() {
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
		<View className="rounded-xl relative flex">
			<Animated.View
				className="h-12 w-12 border-neutral-700 bg-neutral-600 "
				style={[{ width: "100%", height: 350 }, animatedStyle]}
			/>
			<View className="flex flex-row px-4">
				<Animated.View
					className="m-2 flex grow h-12 bg-neutral-600 rounded-lg"
					style={animatedStyle}
				/>
				<Animated.View
					className="m-2 flex grow h-12 bg-neutral-600 rounded-lg"
					style={animatedStyle}
				/>
				<Animated.View
					className="m-2 flex grow h-12 bg-neutral-600 rounded-lg"
					style={animatedStyle}
				/>
			</View>
			<View className="px-4 py-2 flex flex-col gap-2 grow">
				<Animated.View
					className="w-1/2 h-9 rounded-lg bg-neutral-600"
					style={animatedStyle}
				/>
				<Animated.View
					className="w-full h-16 rounded-lg bg-neutral-600"
					style={[{ height: 64 }, animatedStyle]}
				/>
			</View>
		</View>
	);
}
