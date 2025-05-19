import {
	View,
	Text,
	Image,
	Dimensions,
	Touchable,
	TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "../src/app/context/AuthContext";
import { likesDeclension } from "./functions/numberFormat";
import { formatDate } from "./functions/time";
import Ginf from "./ui/Ginf/Ginf";
import Pagination from "./Pagination";
import {
	FlatList,
	GestureDetector,
	Gesture,
} from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withSequence,
	withTiming,
	withDelay,
} from "react-native-reanimated";
import scaleImages from "./functions/scaleImages";
import axios from "axios";
import Slide from "./Slide";

const { width, height } = Dimensions.get("window");

const Post = ({ colors, post }) => {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL;
	const { authState, onLogout } = useAuth();
	const [showFullText, setShowFullText] = useState(false);
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [likes, setLikes] = useState(post.likes);
	const [liked, setLiked] = useState(post.likedByUser);

	const toggleText = () => setShowFullText(!showFullText);
	const shortText =
		post.description.slice(0, 100) +
		(post.description.length > 100 ? "..." : "");

	const updateCurrentSlideIndex = (e) => {
		const contentOffsetX = e.nativeEvent.contentOffset.x;
		const currentIndex = Math.round(contentOffsetX / width);
		setCurrentSlideIndex(currentIndex);
	};
	const maxScaledImage = scaleImages(post.photos, width, 500);

	const handleLike = async () => {
		setLiked(!liked);
		setLikes(liked ? likes - 1 : likes + 1);
		try {
			const likeRes = await axios.post(`${apiUrl}/api/like`, {
				postId: post._id,
			});
			if (likeRes.status !== 200) {
				setLiked(!liked);
				setLikes(liked ? likes - 1 : likes + 1);
			}
		} catch (error) {
			console.error("Error liking post:", error);
			setLiked(!liked);
			setLikes(liked ? likes - 1 : likes + 1);
		}
	};
	const scale = useSharedValue(0);
	const rotate = useSharedValue(0);
	const triggerAnimation = () => {
		if (!liked) handleLike();
		if (scale.value === 0) {
			if (rotate.value !== 45) {
				rotate.value = 45;
			}
			scale.value = withSequence(
				withSpring(1),
				withDelay(300, withSpring(0, { damping: 20 }))
			);
			rotate.value = withSequence(withSpring(90));
		}
	};
	const doubleTap = Gesture.Tap()
		.maxDuration(250)
		.numberOfTaps(2)
		.onStart(() => {
			if (authState.authenticated) {
				runOnJS(triggerAnimation)();
			}
		});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
		};
	});
	return (
		<View className="rounded-xl relative bg-neutral-950 my-1">
			<View className="flex flex-row items-center justify-between">
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
								{formatDate(post.publishedAt)}
							</Text>
						</View>
					</View>
				</View>
				<View className="p-2 mr-1">
					<Ginf name="doubleCircle" size={12} />
				</View>
			</View>
			<View className="mb-2">
				<Text
					// style={{ color: colors.text }}
					className="px-3 font-GilroyMedium text-neutral-300"
					onPress={toggleText}>
					{showFullText ? post.description : shortText}
					{!showFullText && post.description.length > 100 && (
						<Text
							style={{ color: colors.text, fontWeight: "bold", fontSize: 12 }}>
							{" Pokaż więcej"}
						</Text>
					)}
				</Text>
			</View>
			<GestureDetector gesture={doubleTap} style={{ position: "relative" }}>
				<View
					className="flex flex-col relative overflow-hidden"
					style={{
						position: "relative",
						display: "flex",
						flexDirection: "column",
					}}>
					{post.photos.length > 1 ? (
						<View>
							<FlatList
								onMomentumScrollEnd={updateCurrentSlideIndex}
								data={post.photos}
								renderItem={({ item }, index) => (
									<Slide key={index} item={item} maxHeight={maxScaledImage} />
								)}
								horizontal
								pagingEnabled
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={{
									height: maxScaledImage,
								}}></FlatList>
							<Pagination
								photos={post.photos}
								currentSlideIndex={currentSlideIndex}
							/>
						</View>
					) : (
						<Slide item={post.photos[0]} maxHeight={maxScaledImage} />
					)}
					{post.photos.length > 1 ? (
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
							<Text className="text-white font-GilroySemiBold font-bold text-sm">
								{currentSlideIndex + 1}/{post.photos.length}
							</Text>
						</View>
					) : null}
					<View
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: [{ translateX: -40 }, { translateY: -40 }],
						}}>
						<Animated.View style={animatedStyle}>
							<Ginf name="starFill" size={80} color="#d0f601" />
						</Animated.View>
					</View>
				</View>
			</GestureDetector>
			<View className="flex flex-row items-center justify-between px-2">
				{/* <View className="flex flex-row gap-2"> */}
				{authState.authenticated ? (
					<View className="flex flex-row items-center p-2 gap-1">
						<TouchableOpacity onPress={handleLike}>
							{liked ? (
								<Ginf name="starFill" size={28} color="#d0f601" />
							) : (
								<Ginf name="star" size={28} color="#d0f601" />
							)}
						</TouchableOpacity>
						<Text className="font-GilroyMedium text-xl ml-1 text-neutral-300">
							{likesDeclension(likes)}
						</Text>
					</View>
				) : (
					<View className="flex flex-row items-center p-2 gap-1">
						<Ginf name="star" size={28} color="#d0f601" />
						<Text className="font-GilroyMedium text-xl ml-1 text-neutral-300">
							{likesDeclension(likes)}
						</Text>
					</View>
				)}
				{/* <View className="flex flex-row items-center p-2 gap-1">
					<Ginf name="share" size={28} color="white" />
				</View> */}
				{/* </View> */}
			</View>
		</View>
	);
};
// const Slide = ({ item, maxHeight }) => {
// 	return (
// 		<View className="flex flex-col items-center justify-center">
// 			<Image
// 				source={{ uri: item.src }}
// 				style={{
// 					width: width,
// 					height: maxHeight,
// 					resizeMode: "contain",
// 					marginHorizontal: "auto",
// 				}}
// 			/>
// 		</View>
// 	);
// };
export default Post;
