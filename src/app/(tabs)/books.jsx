import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "@react-navigation/native";
import Ginf from "../../../components/ui/Ginf/Ginf";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import Swiper from "react-native-swiper";
import CreateBook from "../../../components/books/CreateBookScreen";
import BookScreen from "../../../components/books/BookScreen";
import { useNavigationContext } from "../../../src/app/context/NavigationContext";

export default function Books() {
	const { isOpen, setIsOpen, translateX } = useNavigationContext();

	const router = useRouter();
	const { authState } = useAuth();
	const { colors } = useTheme();
	const swiperRef = useRef(null);
	const topBarPosition = useSharedValue(-100);

	const animatedInfoBar = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: topBarPosition.value }],
		};
	});

	return (
		<View
			style={{
				flex: 1,
				position: "relative",
			}}>
			{authState.authenticated && (
				<Animated.View
					style={[
						{
							position: "absolute",
							top: 20,
							left: 0,
							right: 0,
							zIndex: 1,
							justifyContent: "center",
							alignItems: "center",
						},
						animatedInfoBar,
					]}>
					<View
						style={{
							backgroundColor: "black",
							height: 50,
							width: "90%",
							justifyContent: "center",
							alignItems: "center",
							borderRadius: 99,
							borderWidth: 1,
							borderColor: "#D0F601",
							display: "flex",
						}}>
						<Text className="text-[#D0F601] font-GilroyMedium ">
							Wysłano post do akceptacji
						</Text>
					</View>
				</Animated.View>
			)}
			<Swiper
				ref={swiperRef}
				showsPagination={false}
				loop={false}
				onIndexChanged={(index) => {
					if (index === 1) setIsOpen(true);
					else setIsOpen(false);
				}}>
				<View
					collapsable={false}
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "black",
					}}>
					<BookScreen
					// onClose={handleScrollToCreateScreen}
					// setSendedPostInfo={setSendedPostInfo}
					/>
				</View>
				{authState.authenticated && (
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "black",
						}}>
						<CreateBook />
					</View>
				)}
			</Swiper>
		</View>
	);
}
