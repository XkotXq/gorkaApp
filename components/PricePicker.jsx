import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	runOnJS,
} from "react-native-reanimated";

const { height } = Dimensions.get("window");

const PricePicker = ({onChange}) => {
	const [price, setPrice] = useState([0, 0, 0, 0, 0]);
	const digitHeight = 28;
 	useEffect(() => {
		const formattedPrice = price.join("").replace(/^0+(?!$)/, ""); // Usuwa wiodące zera
		onChange(formattedPrice);
	}, [price]);
	const translateY = price.map(() => useSharedValue(0));

	const handleGesture = (index) => {
		return Gesture.Pan()
			.onUpdate((event) => {
				if (
					event.translationY - price[index] * digitHeight < 0 &&
					event.translationY - price[index] * digitHeight > -(digitHeight * 9)
				)
					translateY[index].value =
						event.translationY - price[index] * digitHeight;
			})
			.onEnd(() => {
				const digitIndex = Math.round(-translateY[index].value / digitHeight);
				const clampedIndex = Math.max(0, Math.min(9, digitIndex));
				translateY[index].value = withTiming(-clampedIndex * digitHeight, {
					duration: 300,
				});

				const newPrice = [...price];
				newPrice[index] = clampedIndex;
				runOnJS(setPrice)(newPrice);
			});
	};

	const animatedStyles = translateY.map((value) =>
		useAnimatedStyle(() => ({
			transform: [{ translateY: value.value }],
		}))
	);

	const formatPrice = () => {
		const [hundreds, tens, units, cents, centsUnit] = price;
		return `${hundreds > 0 ? hundreds : ""}${tens > 0 ? tens : ""}${units}`;
	};

	return (
		<View className="flex">
			<View style={styles.container}>
				<View style={styles.pricePicker}>
					{price.slice(0, 3).map((_, index) => (
						<GestureDetector key={index} gesture={handleGesture(index)}>
							<View style={styles.digitWrapper}>
								<Animated.View
									style={[styles.digitColumn, animatedStyles[index]]}>
									{[...Array(10).keys()].map((digit) => (
										<Text
											key={digit}
											style={styles.digit}
											className="font-GilroyMedium">
											{digit}
										</Text>
									))}
								</Animated.View>
							</View>
						</GestureDetector>
					))}
					{/* <Text style={styles.separator}>,</Text> */}
					{/* <GestureDetector gesture={handleGesture(3)}>
					<View style={styles.digitWrapper}>
						<Animated.View style={[styles.digitColumn, animatedStyles[3]]}>
							{[...Array(10).keys()].map((digit) => (
								<Text key={digit} style={styles.digit}>
									{digit}
								</Text>
							))}
						</Animated.View>
					</View>
				</GestureDetector>
				<GestureDetector gesture={handleGesture(4)}>
					<View style={styles.digitWrapper}>
						<Animated.View style={[styles.digitColumn, animatedStyles[4]]}>
							{[...Array(10).keys()].map((digit) => (
								<Text key={digit} style={styles.digit}>
									{digit}
								</Text>
							))}
						</Animated.View>
					</View>
				</GestureDetector> */}
					<Text style={styles.currency} className="font-GilroyMedium">
						zł
					</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flex: 0,
		// alignItems: "center",
	},
	pricePicker: {
		flexDirection: "row",
		display: "flex",
		// backgroundColor: "#525252",
		borderWidth: 1,
		borderColor: "#525252",
		flex: 0,
		borderRadius: 999,
		padding: 12,
	},
	digitWrapper: {
		height: 26,
		width: 28,
		overflow: "hidden",
		alignItems: "center",
	},
	digitColumn: {
		alignItems: "center",
		display: "flex",
	},
	digit: {
		fontSize: 22,
		color: "white",
		textAlign: "center",
		height: 28,
	},
	separator: {
		fontSize: 22,
		color: "white",
		marginHorizontal: 5,
	},
	currency: {
		fontSize: 22,
		color: "white",
		marginLeft: 5,
	},
	priceText: {
		marginTop: 20,
		fontSize: 22,
		color: "white",
	},
});

export default PricePicker;
