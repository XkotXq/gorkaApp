import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {
	GestureHandlerRootView,
	GestureDetector,
	Gesture,
} from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
	runOnJS,
} from "react-native-reanimated";
import Ginf from "./ui/Ginf/Ginf";

const { width } = Dimensions.get("window");
export default function WheelChooser({ setInputValue, defaultValue }) {
	const rotation = useSharedValue(0);
	const startRotation = useSharedValue(0);
	const [highlightedIndex, setHighlightedIndex] = useState(0);
	const texts = ["I Ti", "II Ti", "III Ti", "IV Ti", "V Ti"];
	const findedIndex = texts.findIndex((text) => text === defaultValue);
	useEffect(() => {
		if(findedIndex !== -1) {
			setHighlightedIndex(findedIndex);
			rotation.value = -findedIndex * 30;
		}
	}, []);
	useEffect(() => {
		setInputValue(texts[highlightedIndex]);
	}, [highlightedIndex]);
	const panGesture = Gesture.Pan()
		.onBegin(() => {
			startRotation.value = rotation.value;
		})
		.onUpdate((event) => {
			const newRotation = startRotation.value + event.translationX / 3;
			if (newRotation <= 0 && newRotation >= -120) {
				rotation.value = newRotation;
				runOnJS(setHighlightedIndex)(
					Math.abs(Math.round((rotation.value % 360) / 30) % 5)
				);
			}
		})
		.onEnd(() => {
			const snappedRotation = Math.round(rotation.value / 30) * 30;
			rotation.value = withSpring(snappedRotation, { duration: 500 });
			runOnJS(setInputValue)(texts[highlightedIndex]);
		});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${rotation.value}deg` }],
		};
	});
	const numbers = Array.from({ length: texts.length }, (_, i) => i * 30);

	return (
		<View
			style={{
                position: "absolute",
                bottom: "-70%",
                left: "50%",
                transform: [{ translateX: "-50%" }],
				flex: 1,
				justifyContent: "start",
				alignItems: "center",
				borderRadius: 999 ,
				backgroundColor: "#202020",
			}}>
			<GestureDetector gesture={panGesture}>
				<Animated.View
					style={[
						{
							width: "110%",
							aspectRatio: 1,
							borderRadius: 9999,
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "#202020",
						},
						animatedStyle,
					]}>
					{numbers.map((angle, index) => {
						const radian = ((angle - 90) * Math.PI) / 180;
						const x = (width / 2.4) * Math.cos(radian);
						const y = (width / 2.4) * Math.sin(radian);
						const isHighlighted = index === highlightedIndex;

						const animatedNumberStyle = useAnimatedStyle(() => {
							return {
								backgroundColor: withTiming(
									isHighlighted ? "#525252" : "#262626"
								),
								width: withTiming(isHighlighted ? 70 : 50),
								height: withTiming(isHighlighted ? 70 : 50),
							};
						});

						const animatedTextStyle = useAnimatedStyle(() => {
							return {
								fontSize: withTiming(isHighlighted ? 28 : 16),
								color: withTiming(isHighlighted ? "#FFFFFF" : "#525252"),
							};
						});

						return (
							<Animated.View
								className="flex justify-center items-center bg-neutral-800 rounded-full"
								key={index}
								style={[
									styles.numberContainer,
									{
										transform: [
											{ translateX: x },
											{ translateY: y },
											{ rotate: angle + "deg" },
										],
									},
									animatedNumberStyle,
								]}>
								<Animated.Text
									style={[styles.number, animatedTextStyle]}
									className="font-GilroySemiBold text-3xl">
									{texts[index]}
								</Animated.Text>
							</Animated.View>
						);
					})}
				</Animated.View>
			</GestureDetector>
            <View style={{ position: "absolute", top: "30%" }}>
            <Ginf name="arrowTop" size={38} color="#d0f601" />
            </View>
		</View>
	);
}
const styles = StyleSheet.create({
	numberContainer: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
	},
	number: {
		color: "white",
		fontSize: 16,
	},
	highlightedNumberContainer: {
		backgroundColor: "yellow",
	},
	highlightedNumber: {
		color: "black",
		fontWeight: "bold",
	},
});
