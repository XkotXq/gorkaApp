import { View, Text, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/app/context/AuthContext";
import { useTheme } from "@react-navigation/native";
import Ginf from "../ui/Ginf/Ginf";
import {
	GestureDetector,
	ScrollView,
	TouchableOpacity,
	TouchableWithoutFeedback,
	FlatList,
	RefreshControl,
} from "react-native-gesture-handler";
import axios from "axios";
export default function BookScreen() {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL;

	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [totalPages, setTotalPages] = useState(1);
	const [isDownloaded, setIsDownloaded] = useState(false);
	const [books, setBooks] = useState([]);

	const router = useRouter();
	const { authState } = useAuth();
	const { colors } = useTheme();

	const fetchNextPage = async (refreshing) => {
		setIsLoading(true);
		try {
			const response = await axios.get(
				`${apiUrl}/api/books?status=published&currentPage=${currentPage}&amount=5`
			);
			setIsLoading(false);
			setTotalPages(response.data.totalPages);
			if (refreshing) {
				setBooks(response.data.books);
			} else {
				setBooks((prevState) => [...prevState, ...response.data.books]);
			}
			setIsDownloaded(true);
		} catch (error) {
			setIsLoading(false);
			console.error("Error fetching books:", error);
		}
		setIsRefreshing(false);
	};
	useEffect(() => {
		fetchNextPage(isRefreshing);
	}, [currentPage]);
	const reachedEnd = () => {
		if (!isLoading && currentPage < totalPages) {
			setCurrentPage((prevState) => prevState + 1);
			console.log(currentPage, "/", totalPages);
		}
	};
	const refresh = async () => {
		setIsDownloaded(false);
		setIsRefreshing(true);
		if (currentPage === 1) {
			await fetchNextPage(true);
		} else {
			setCurrentPage(1);
		}
	};
	return (
		<View
			style={{
				flex: 1,
				position: "relative",
				width: "100%",
			}}>
			<View className="w-full bg-black border-b border-neutral-600 py-1">
				<View className="flex flex-row items-center justify-between px-3">
					<View>
						<Text
							style={{ color: colors.text }}
							className="font-GilroySemiBold py-2 text-2xl">
							Odkup książkę
						</Text>
					</View>
					<View className="flex flex-row gap-4 items-center">
						{authState.role === "admin" && (
							<View>
								<TouchableOpacity
									onPress={() => router.push("/(admin)/manageBooks")}>
									<Ginf name="verif" size={38} color="white" />
								</TouchableOpacity>
							</View>
						)}
						<View>
							<TouchableOpacity onPress={() => router.push("/books/list")}>
								<Ginf name="bookStack" size={28} color="white" />
							</TouchableOpacity>
						</View>
						<View>
							<TouchableOpacity onPress={() => router.push("/books/message")}>
								<Ginf name="message" size={28} color="white" />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
			<View>
				<FlatList
					data={books}
					renderItem={({ item, index }) => (
						<BookBox
							colors={colors}
							key={item.id + "aa"}
							book={item}
							isLast={books.length === index + 1}
						/>
					)}
					keyExtractor={(item, index) => item.id + index.toString()}
					onEndReached={reachedEnd}
					onEndReachedThreshold={0}
					refreshControl={
						<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
					}
					ListFooterComponent={
						<View
							className="w-full"
							style={{
								height: currentPage === totalPages ? 100 : 200,
								paddingTop: currentPage === totalPages ? 10 : 40,
							}}>
							{books.length > 0 ? null : (
								<Text
									style={{ color: "white" }}
									className="font-GilroyMedium text-2xl text-center">
									Brak postów
								</Text>
							)}
						</View>
					}
				/>
			</View>
		</View>
	);
}

const BookBox = ({ book, isLast }) => {
	const router = useRouter();
	const { authState } = useAuth();
	const { colors } = useTheme();
	const bookPublished = new Date(book.publishedAt);
	const formattedDateTime = `${bookPublished.toLocaleTimeString("pl-PL", {
		hour: "2-digit",
		minute: "2-digit",
	})} ${bookPublished.toLocaleDateString("pl-PL", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})}`;
	return (
		<TouchableWithoutFeedback
			onPress={() => router.push(`/books/${book._id}`)}
			className="flex flex-col items-center justify-center p-4">
			<View
				className={`flex flex-row p-2 bg-black  ${!isLast && "border-b border-neutral-800"} flex-1`}>
				<View>
					<Image
						source={{ uri: book.photos[0].src }}
						style={{ width: 120, height: 120, resizeMode: "contain" }}
					/>
				</View>
				<View
					className="flex flex-col flex-1 justify-between"
					style={{ flex: 1 }}>
					<View className="px-2">
						<Text className="font-GilroySemiBold py-2 text-[18px] text-white">
							{book.title}
						</Text>
					</View>
					<View style={{ flex: 1 }}></View>
					<View className="flex flex-row justify-between px-2">
						<View>
							<Text className="text-neutral-400 text-sm">Klasa</Text>
							<Text className="text-white text-lg">
								{book.class.join(", ")}
							</Text>
						</View>
						<View>
							<Text className="text-neutral-400 text-sm">Zakres</Text>
							<Text className="text-white text-lg">{book.extent}</Text>
						</View>
						<View>
							<Text className="font-GilroySemiBold text-neutral-400 text-sm">
								cena
							</Text>
							<Text className="font-GilroySemiBold text-xl text-white text-end">
								{book.price.toString().slice(0, -2)} zł
							</Text>
						</View>
					</View>
					<View className="flex flex-row justify-end px-2">
						<Text className="text-neutral-400 text-sm font-GilroyRegular text-end">
							{formattedDateTime}
						</Text>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};
