// import { View, Text } from 'react-native'
import { View, Platform, TouchableOpacity, Alert } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect} from "react";
import clsx from "clsx";
import { MotiView } from "moti";
import { useNavigationContext } from "@/src/app/context/NavigationContext";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, useDerivedValue } from "react-native-reanimated";

const TabBar = ({ state, descriptors, navigation }) => {
	const { colors } = useTheme();
	const { buildHref } = useLinkBuilder();
	const { isOpen, translateX, setIsOpen } = useNavigationContext();
	
	const translateY = useDerivedValue(() => {
		return withTiming(isOpen ? 100 : 0, { duration: 200 });
	}, [isOpen]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

	return (
		<Animated.View
            className="absolute bottom-2 w-full px-3 flex justify-center items-center"
            style={animatedStyle}
        >
			<View
				className="relative rounded-full flex flex-row items-center gap-2 p-2 border border-neutral-600"
				style={{ backgroundColor: colors.background }}>
				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key];
					const label =
						options.tabBarLabel !== undefined
							? options.tabBarLabel
							: options.title !== undefined
							? options.title
							: route.name;

					const isFocused = state.index === index;

					const onPress = () => {
						if(options.onPress) {
							options.onPress();
						} else {

							const event = navigation.emit({
								type: "tabPress",
								target: route.key,
								canPreventDefault: true,
							});
							
							if (!isFocused && !event.defaultPrevented) {
								navigation.navigate(route.name, route.params);
							}
						}
					};

					const onLongPress = () => {
						if(options.onLongPress) {
							options.onLongPress();
							const event = navigation.emit({
								type: "tabPress",
								target: route.key,
								canPreventDefault: true,
							});
							
							if (!isFocused && !event.defaultPrevented) {
								navigation.navigate(route.name, route.params);
							}
							
							
						} else {
							navigation.emit({
								type: "tabLongPress",
								target: route.key,
							});
						}
					};

					return (
						<MotiView
							className="rounded-full"
							key={label}
							from={{ opacity: 0 }}
							animate={{
								opacity: 1,
								scale: isFocused ? 1.1 : 1,
								backgroundColor: isFocused
									? "rgb(186, 253, 82)"
									: colors.background,
							}}>
							<TouchableOpacity
								href={buildHref(route.name, route.params)}
								accessibilityState={isFocused ? { selected: true } : {}}
								accessibilityLabel={options.tabBarAccessibilityLabel}
								testID={options.tabBarButtonTestID}
								onPress={onPress}
								onLongPress={onLongPress}
								// style={{ flex: 1 }}
								className={"flex justify-center items-center p-2 relative"}
								// style={{
								// 	backgroundColor: isFocused
								// 		? "rgb(186, 253, 82)"
								// 		: colors.background,
								// }}
							>
								{/* <Text style={{ color: isFocused ? colors.primary : colors.text }}> */}
								{/* {label} */}
								{/* test */}
								{/* </Text> */}
								{options.tabBarIcon &&
									options.tabBarIcon({
										color: isFocused ? "black" : colors.text,
									})}
								{/* {isFocused && (
									<Text
										// className="absolute bottom-0"
										style={{
											color: isFocused ? "black" : colors.text,
											position: "absolute",
											bottom: 0,
										}}>
										{label}
									</Text>
								)} */}
							</TouchableOpacity>
						</MotiView>
					);
				})}
			</View>
		</Animated.View>
	);
};

export default TabBar;
