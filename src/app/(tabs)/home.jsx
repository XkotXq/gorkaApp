import { View, ScrollView, Text } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import HomeScreen from "../../../components/home/HomeScreen";
import CreateScreen from "../../../components/home/CreateScreen";
import { useNavigationContext } from "../../../src/app/context/NavigationContext";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import Swiper from "react-native-swiper";

const Home = () => {
	const { isOpen, setIsOpen, translateX } = useNavigationContext();
	const { authState } = useAuth();
	const [sendedPostInfo, setSendedPostInfo] = useState(false);
	const swiperRef = useRef(null);
	const handleScrollToCreateScreen = () => {
		if (swiperRef.current) {
			swiperRef.current.scrollTo(0, true);
		}
	};
	const topBarPosition = useSharedValue(-100);
	useEffect(() => {
		if (sendedPostInfo) {
			topBarPosition.value = withTiming(0, { duration: 500 });
			setTimeout(() => {
				setSendedPostInfo(false);
			}, 4000);
		} else {
			topBarPosition.value = withTiming(-100, { duration: 500 });
		}
	}, [sendedPostInfo]);

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
					<HomeScreen />
				</View>
				{authState.authenticated && (
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "black",
						}}>
							<CreateScreen
								onClose={handleScrollToCreateScreen}
								setSendedPostInfo={setSendedPostInfo}
							/>
					</View>
				)}
			</Swiper>
		</View>
	);
};

export default Home;
