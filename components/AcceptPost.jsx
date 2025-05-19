import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../src/app/context/AuthContext";
import { likesDeclension } from "./functions/numberFormat";
import { formatDate } from "./functions/time";
import Ginf from "./ui/Ginf/Ginf";
import Pagination from "./Pagination"; // do poprawy bo błąd wyskakuje po odrzuceniu postu
import scaleImages from "./functions/scaleImages";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
	interpolateColor,
	runOnJS,
} from "react-native-reanimated";
import {
	Gesture,
	GestureDetector,
	FlatList,
} from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useEditPostContext } from "../src/app/context/EditPostContext";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const AcceptPost = ({ colors, post, resetOffset, handleRemovePost }) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL
	const { setActivePost, setPosts } = useEditPostContext();
	const { authState } = useAuth();
	const [showFullText, setShowFullText] = useState(false);
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [state, setState] = useState(1);
	const router = useRouter();

	const toggleText = () => setShowFullText(!showFullText);
	const shortText =
		post.description.slice(0, 100) +
		(post.description?.length > 100 ? "..." : "");

	const updateCurrentSlideIndex = (e) => {
		const contentOffsetX = e.nativeEvent.contentOffset.x;
		const currentIndex = Math.round(contentOffsetX / width);
		setCurrentSlideIndex(currentIndex);
	};
	const maxScaledImage = scaleImages(post.photos, width, 500);

	const offset = useSharedValue(0);
	const pan = Gesture.Pan()
		.onChange((event) => {
			offset.value =
				event.absoluteX - width / 2 <= width / 2 - 39 &&
				event.absoluteX - width / 2 >= -(width / 2 - 39)
					? event.absoluteX - width / 2
					: offset.value;
			if (offset.value > width / 4) {
				runOnJS(setState)(2);
			} else if (offset.value < -(width / 4)) {
				runOnJS(setState)(0);
			} else {
				runOnJS(setState)(1);
			}
		})
		.onEnd(() => {
			if (offset.value > width / 4) {
				offset.value = withSpring(width / 2 - 39);
			} else if (offset.value < -(width / 4)) {
				offset.value = withSpring(-(width / 2 - 39));
			} else {
				offset.value = withSpring(0);
			}
		});

	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: offset.value }],
		};
	});
	const animatedTY = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: withTiming(-(60 * state)) }],
		};
	});
	const animatedStroke = useAnimatedStyle(() => {
		const borderColor = interpolateColor(
			offset.value,
			[-width / 2, 0, width / 2],
			["#00A2FF", "gray", "#D0F601"]
		);
		return {
			stroke: borderColor,
		};
	});
	const animatedBorderColor = useAnimatedStyle(() => {
		const borderColor = interpolateColor(
			offset.value,
			[-width / 2, 0, width / 2],
			["#00A2FF", "gray", "#D0F601"]
		);
		return {
			borderColor,
		};
	});
	const animatedTextColor = useAnimatedStyle(() => {
		const color = interpolateColor(
			offset.value,
			[-width / 2, 0, width / 2],
			["#00A2FF", "gray", "#D0F601"]
		);
		return {
			color,
		};
	});

	const managePost = async (id, option) => {
		try {
			const res = await axios.post(
				`${apiUrl}/api/admin/posts?option=${option}`,
				{ id }
			);
			console.log("manage");
			if (res.status !== 200) {
				console.log("błąd podczas aktualizacji postu");
			}

			// offset.value = 0
			handleRemovePost(id);
			resetOffset(offset);
		} catch (error) {
			console.error("Error managing post:", error);
		}
	};

	const handleClickBtn = async () => {
		if (state === 0) {
			await managePost(post._id, "reject");
			console.log("rejected");
		} else if (state === 1) {
			setActivePost(post);
			router.push("/(admin)/editPost");
		} else if (state === 2) {
			await managePost(post._id, "accept");
		}
	};

	const AnimatedPath = Animated.createAnimatedComponent(Path);

	return (
		<View className="rounded-xl">
			<Animated.View>
				<View className="flex flex-row items-center p-2">
					<View
						className="h-12 w-12 rounded-full border border-neutral-700 overflow-hidden flex items-center justify-center"
						style={{ width: 48, height: 48 }}>
						<Image
							source={require("../assets/images/GLogo.png")}
							style={{ width: 26, height: 26, resizeMode: "contain" }}
						/>
					</View>
					<View className="flex flex-col">
						<Text
							style={{ color: colors.text }}
							className="p-2 pb-0 font-GilroyMedium text-xl">
							{post.authorName
								? post.authorName
								: post.authorNick
								? post.authorNick
								: "Anonim"}
						</Text>
						<View className=" px-2 w-full flex justify-end">
							<Text className="font-GilroyMedium text-neutral-400 text-end">
								{formatDate(post.sendedAt)}
							</Text>
						</View>
					</View>
				</View>
				<View
					className="flex flex-col relative border-y border-neutral-900"
					style={{
						position: "relative",
						display: "flex",
						flexDirection: "column",
						borderTopWidth: 1,
						borderBottomWidth: 1,
						borderColor: "#171717",
					}}>
					{post.photos?.length > 1 ? (
						<View>
							<FlatList
								onMomentumScrollEnd={updateCurrentSlideIndex}
								data={post.photos}
								renderItem={({ item, index }) => (
									<Slide key={index} item={item} maxHeight={maxScaledImage} />
								)}
								horizontal
								pagingEnabled
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={{
									height: maxScaledImage,
								}}
							/>
							{/* <Pagination
								photos={post.photos}
								currentSlideIndex={currentSlideIndex}
							/> */}
						</View>
					) : (
						<Slide item={post.photos[0]} maxHeight={maxScaledImage} />
					)}
					<View
						className="absolute z-10 bg-black/60 px-2 py-1"
						style={{
							backgroundColor: "rgba(0,0,0,0.6)",
							borderRadius: 20,
							padding: 8,
							fontWeight: 700,
							right: 12,
							top: 12,
						}}>
						{post.photos?.length > 1 ? (
							<Text className="text-white font-GilroySemiBold font-bold text-sm">
								{currentSlideIndex + 1}/{post.photos?.length}
							</Text>
						) : null}
					</View>
				</View>

				<View className="mt-2">
					<Text
						style={{ color: colors.text }}
						className="px-5 font-GilroyMedium"
						onPress={toggleText}>
						{showFullText ? post.description : shortText}
						{!showFullText && post.description?.length > 100 && (
							<Text style={{ color: colors.text, fontWeight: "bold" }}>
								{" Pokaż więcej"}
							</Text>
						)}
					</Text>
				</View>
			</Animated.View>
			<View
				className="relative flex justify-center items-center border-2 border-neutral-800 rounded-full"
				style={{ margin: 6 }}>
				<Image
					source={require("../assets/images/swipe.png")}
					style={{ width: width - 30, resizeMode: "contain", height: 70 }}
				/>
				<GestureDetector gesture={pan}>
					<Animated.View
						style={[
							{
								width: 80,
								height: 80,
								position: "absolute",
								borderRadius: 999,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							},
							animatedStyles,
						]}>
						<Svg
							width={80}
							height={80}
							viewBox="0 0 143 127"
							fillRule="evenodd"
							clipRule="evenodd"
							strokeLinejoin="round"
							strokeMiterlimit={2}>
							<AnimatedPath
								d="M3135.5 2234.9s3.84-2.12 8.16-4.51a23.99 23.99 0 0123.7.3c4.39 2.56 8.33 4.87 8.33 4.87"
								transform="translate(-1322.37 -3014.07) matrix(.87982 0 0 .87982 -1557.15 1152.3) rotate(-60 3176.11 2061.719)"
								fill="none"
								style={animatedStroke}
								strokeWidth="9.47px"
							/>
							<AnimatedPath
								d="M3135.5 2234.9s3.84-2.12 8.16-4.51a23.99 23.99 0 0123.7.3c4.39 2.56 8.33 4.87 8.33 4.87"
								transform="translate(-1322.37 -3014.07) matrix(.87982 0 0 .87982 -1557.15 1152.3) rotate(-120 3228.443 2176.052)"
								fill="none"
								style={animatedStroke}
								strokeWidth="9.47px"
							/>
							<AnimatedPath
								d="M3135.5 2234.9s3.84-2.12 8.16-4.51a23.99 23.99 0 0123.7.3c4.39 2.56 8.33 4.87 8.33 4.87"
								transform="translate(-1322.37 -3014.07) matrix(.87982 0 0 .87982 -1557.15 1152.3) rotate(-180 3254.605 2233.215)"
								fill="none"
								style={animatedStroke}
								strokeWidth="9.47px"
							/>
							<AnimatedPath
								d="M3135.5 2234.9s3.84-2.12 8.16-4.51a23.99 23.99 0 0123.7.3c4.39 2.56 8.33 4.87 8.33 4.87"
								transform="translate(-1322.37 -3014.07) matrix(.87982 0 0 .87982 -1557.15 1152.3) rotate(120 3280.774 2290.383)"
								fill="none"
								style={animatedStroke}
								strokeWidth="9.47px"
							/>
							<AnimatedPath
								d="M3135.5 2234.9s3.84-2.12 8.16-4.51a23.99 23.99 0 0123.7.3c4.39 2.56 8.33 4.87 8.33 4.87"
								transform="translate(-1322.37 -3014.07) matrix(.87982 0 0 .87982 -1557.15 1152.3) rotate(60 3333.098 2404.712)"
								fill="none"
								style={animatedStroke}
								strokeWidth="9.47px"
							/>
							<AnimatedPath
								d="M3135.5 2234.9s3.84-2.12 8.16-4.51a23.99 23.99 0 0123.7.3c4.39 2.56 8.33 4.87 8.33 4.87"
								transform="translate(-1322.37 -3014.07) matrix(.87982 0 0 .87982 -1557.15 1152.3) translate(198.028 -90.637)"
								fill="none"
								style={animatedStroke}
								strokeWidth="9.47px"
							/>
						</Svg>
					</Animated.View>
				</GestureDetector>
			</View>
			<View style={{ margin: 4 }}>
				<TouchableOpacity onPress={() => handleClickBtn()}>
					<Animated.View
						className="flex items-center overflow-hidden"
						style={[
							{ width: "100%", height: 60, borderWidth: 2, borderRadius: 999 },
							animatedBorderColor,
						]}>
						<Animated.View style={animatedTY}>
							<View
								style={{ height: 60 }}
								className="flex justify-center items-center">
								<Animated.Text
									className="font-GilroySemiBold text-xl"
									style={animatedTextColor}>
									Odrzuć
								</Animated.Text>
							</View>
							<View
								style={{ height: 60 }}
								className="flex justify-center items-center">
								<Animated.Text
									className="font-GilroySemiBold text-xl"
									style={animatedTextColor}>
									Edytuj
								</Animated.Text>
							</View>
							<View
								style={{ height: 60 }}
								className="flex justify-center items-center">
								<Animated.Text
									className="font-GilroySemiBold text-xl"
									style={animatedTextColor}>
									Akceptuj
								</Animated.Text>
							</View>
						</Animated.View>
					</Animated.View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const Slide = ({ item, maxHeight }) => {
	return (
		<View className="flex flex-col items-center justify-center">
			<Image
				source={{ uri: item.src }}
				style={{
					width: width,
					height: maxHeight,
					resizeMode: "contain",
					marginHorizontal: "auto",
				}}
			/>
		</View>
	);
};

export default AcceptPost;
