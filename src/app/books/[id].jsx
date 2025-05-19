import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
	View,
	Text,
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	TouchableOpacity,
	Modal,
	TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import Pagination from "../../../components/Pagination";
import scaleImages from "../../../components/functions/scaleImages";
import { formatDate } from "../../../components/functions/time";
import Ginf from "../../../components/ui/Ginf/Ginf";
import SkeletonBookAd from "../../../components/SkeletonBookAd";
import Slide from "../../../components/Slide";
import { useSocket } from "../context/SocketProvider";
import { useChat } from "../context/ChatProvider";
import ImageViewer from "react-native-image-zoom-viewer";

const { width, height } = Dimensions.get("window");

export default function BookDetails() {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL;
	const router = useRouter();
	const socket = useSocket();

	const { id } = useLocalSearchParams();
	const [book, setBook] = useState(null);
	const [loading, setLoading] = useState(true);
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [modalIsVisible, setModalIsVisible] = useState(false);
	const { setActiveChat } = useChat();

	function replaceSrcWithUrl(array) {
		return array.map((item) => {
			const { src, ...rest } = item;
			return { ...rest, url: src };
		});
	}

	useEffect(() => {
		const fetchBook = async () => {
			try {
				const response = await axios.get(`${apiUrl}/api/book/${id}`);
				setBook(response.data);
				console.log("Book fetched:", response.data);
			} catch (error) {
				console.error("Error fetching book:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchBook();
	}, [id]);
	useEffect(() => {
		if (!socket) return;

		socket.on("goChatting", ({ adData }) => {
			console.log(adData, "hejo");
			setActiveChat(adData);
			router.push(`books/message/${adData._id.toString()}`);
		});

		return () => {
			socket.off("goChatting");
		};
	}, [socket]);

	const goOpenChat = () => {
		socket.emit("goChatting", { bookId: book._id });
	};

	const updateCurrentSlideIndex = (e) => {
		const contentOffsetX = e.nativeEvent.contentOffset.x;
		const currentIndex = Math.round(contentOffsetX / width);
		setCurrentSlideIndex(currentIndex);
	};

	return (
		<View style={{ flex: 1 }}>
			<View className="flex flex-row items-center justify-between px-3 bg-black border-b border-neutral-600 py-1 w-full fixed top-0 z-10">
				<View>
					<Text
						style={{ color: "white" }}
						className="font-GilroySemiBold py-2 text-2xl text-center">
						{book?.isOwner
							? "Twoje ogłoszenie"
							: `Ogłoszenie: ${book?.authorName}` || "Ładowanie..."}
					</Text>
				</View>
				<View>
					<TouchableOpacity onPress={() => router.back()}>
						<Ginf name="arrowBack" size={38} color="white" />
					</TouchableOpacity>
				</View>
			</View>
			{loading ? (
				<SkeletonBookAd />
			) : book ? (
				(() => {
					const maxScaledImage = scaleImages(book.photos, width, 300);
					console.log(book.photos);
					return (
						<>
							<ScrollView className="flex-1">
								{book.photos.length > 1 ? (
									<View>
										<FlatList
											onMomentumScrollEnd={updateCurrentSlideIndex}
											data={book.photos}
											renderItem={({ item, index }) => (
												<Slide
													key={index}
													item={item}
													maxHeight={maxScaledImage}
												/>
											)}
											horizontal
											pagingEnabled
											showsHorizontalScrollIndicator={false}
											contentContainerStyle={{
												height: maxScaledImage,
											}}
										/>
										<Pagination
											photos={book.photos}
											currentSlideIndex={currentSlideIndex}
										/>
									</View>
								) : (
									<Slide item={book.photos[0]} maxHeight={maxScaledImage} />
								)}
								<Modal visible={modalIsVisible} transparent={true}>
									<ImageViewer
										imageUrls={replaceSrcWithUrl(book.photos)}
										index={1}
									/>
								</Modal>
								<View className="bg-neutral-900 rounded-t-xl flex-1">
									<View className="px-4 flex">
										<Text className="text-white font-GilroySemiBold text-2xl mt-4">
											{book.title}
										</Text>
									</View>
									<View className="px-4">
										<Text className="text-neutral-200 font-GilroyExtraBold text-3xl">
											{book.price.toString().slice(0, -2)} zł
											{/* {book.description} */}
										</Text>
									</View>
									<View>
										<View className="px-8 flex flex-row justify-between">
											<View>
												<Text className="font-GilroyMedium text-neutral-300">
													Klasa
												</Text>

												<Text className="text-neutral-400 font-GilroySemiBold text-lg">
													{book.class.join(", ")}
												</Text>
											</View>
											<View>
												<Text className="font-GilroyMedium text-neutral-300">
													Zakres
												</Text>
												<Text className="text-neutral-400 font-GilroySemiBold text-lg">
													{book.extent}
												</Text>
											</View>
											{/* <View>
												<Text className="font-GilroyMedium text-neutral-300">
													Cena
												</Text>

												<Text className="text-neutral-400 font-GilroySemiBold text-lg">
													{book.price.toString().slice(0, -2)} zł
												</Text>
											</View> */}
										</View>
										{!book?.isOwner && (
											<View className="p-2">
												<TouchableOpacity
													onPress={goOpenChat}
													className="flex gap-2 flex-row items-center justify-center bg-neutral-800 rounded-full p-2 m-4">
													<Text className="font-GilroySemiBold text-lg text-white">
														Napisz wiadomość
													</Text>
													<Ginf name="message" size={18} color="white" />
												</TouchableOpacity>
											</View>
										)}
										<View className="px-4">
											<Text className="text-neutral-200 font-GilroyMedium text-xl">
												{book.description}
											</Text>
										</View>
									</View>
								</View>
							</ScrollView>
						</>
					);
				})()
			) : (
				<View
					className="flex justify-center items-center"
					style={{ paddingTop: 40 }}>
					<Text
						style={{ color: "white" }}
						className="font-GilroyMedium text-xl">
						Brak książki
					</Text>
				</View>
			)}
		</View>
	);
}
