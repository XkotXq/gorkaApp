import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../src/app/context/AuthContext";
import { likesDeclension } from "./functions/numberFormat";
import { formatDate } from "./functions/time";
import Ginf from "./ui/Ginf/Ginf";
import Pagination from "./Pagination"; // do poprawy bo błąd wyskakuje po odrzuceniu booku
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
import Slide from "./Slide";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const AcceptBook = ({ colors, book, handleRemoveBook }) => {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL;
	const { setActiveBook, setBooks } = useEditPostContext();
	const { authState } = useAuth();
	const [showFullText, setShowFullText] = useState(false);
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [state, setState] = useState(1);
	const router = useRouter();

	const toggleText = () => setShowFullText(!showFullText);
	const shortText =
		book.description.slice(0, 100) +
		(book.description?.length > 100 ? "..." : "");

	const updateCurrentSlideIndex = (e) => {
		const contentOffsetX = e.nativeEvent.contentOffset.x;
		const currentIndex = Math.round(contentOffsetX / width);
		setCurrentSlideIndex(currentIndex);
	};
	const maxScaledImage = scaleImages(book.photos, width, 500);



	const manageBook = async (id, option) => {
		try {
			const res = await axios.put(
				`${apiUrl}/api/book/${id}/status`,
				{ status: option },
				{
					params: { id },
				}
			);
			console.log("manage");
			if (res.status !== 200) {
				console.log("błąd podczas aktualizacji booku");
				return;
			}

			handleRemoveBook(id);
		} catch (error) {
			console.error("Error managing book:", error);
		}
	};


	return (
		<View className="rounded-xl bg-black">
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
							{book.authorName
								? book.authorName
								: book.authorNick
									? book.authorNick
									: "Anonim"}
						</Text>
						<View className=" px-2 w-full flex justify-end">
							<Text className="font-GilroyMedium text-neutral-400 text-end">
								{formatDate(book.sendedAt)}
							</Text>
						</View>
					</View>
				</View>
				<View className="flex flex-row items-center justify-between px-5 mt-2">
					<Text className="font-GilroyMedium text-white text-lg">
						{book.title}
					</Text>
				</View>
				<View className="mt-2">
					<Text
						style={{ color: colors.text }}
						className="px-5 font-GilroyRegular"
						onPress={toggleText}>
						{showFullText ? book.description : shortText}
						{!showFullText && book.description?.length > 100 && (
							<Text style={{ color: colors.text, fontWeight: "bold" }}>
								{" Pokaż więcej"}
							</Text>
						)}
					</Text>
				</View>
				<View className="flex flex-row items-center justify-between px-5 mt-2">
					<View className="flex flex-col items-center">
						<Text className="font-GilroyMedium text-neutral-400">Cena</Text>
						<Text className="font-GilroyMedium text-neutral-300 text-lg">
							{book.price / 100}zł
						</Text>
					</View>
					<View className="flex flex-col items-center">
						<Text className="font-GilroyMedium text-neutral-400">Zakres</Text>
						<Text className="font-GilroyMedium text-neutral-300 text-lg">
							{book.extent}
						</Text>
					</View>
					<View className="flex flex-col items-center">
						<Text className="font-GilroyMedium text-neutral-400">Klasa</Text>
						<Text className="font-GilroyMedium text-neutral-300 text-lg">
							{book.class.join(", ")}
						</Text>
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
					{book.photos?.length > 1 ? (
						<View>
							<FlatList
								onMomentumScrollEnd={updateCurrentSlideIndex}
								data={book.photos}
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
								photos={book.photos}
								currentSlideIndex={currentSlideIndex}
							/> */}
						</View>
					) : (
						<Slide item={book.photos[0]} maxHeight={maxScaledImage} />
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
						{book.photos?.length > 1 ? (
							<Text className="text-white font-GilroySemiBold font-bold text-sm">
								{currentSlideIndex + 1}/{book.photos?.length}
							</Text>
						) : null}
					</View>
				</View>
			</Animated.View>
			<View className="flex flex-row gap-2 px-2 mt-2 mb-4">
				<TouchableOpacity onPress={() => manageBook(book._id, "archived")} style={{ borderColor: "#00A2FF" }} className="flex-1 border rounded-full border-[#00A2FF] p-4"><Text style={{color: "#00A2FF"}} className="text-[#00A2FF] text-center font-GilroyMedium">Odrzuć</Text></TouchableOpacity>
			<TouchableOpacity onPress={() => manageBook(book._id, "published")} className="flex-1 border rounded-full border-[#D0F601] bg-[#D0F601] p-4"><Text className="text-black text-center font-GilroyMedium">Akceptuj</Text></TouchableOpacity>
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

export default AcceptBook;
