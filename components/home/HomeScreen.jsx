import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Dimensions,
	Animated,
	// RefreshControl
} from "react-native";
import React, { useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
// import { useAuth } from "../context/AuthContext";
import Ginf from "../ui/Ginf/Ginf";
import Post from "../Post";
import {
	ScrollView,
	FlatList,
	RefreshControl,
} from "react-native-gesture-handler";
import axios from "axios";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/app/context/AuthContext";
import SkeletonPost from "../SkeletonPost";

const { width, height } = Dimensions.get("window");
const HomeScreen = () => {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL;
	const router = useRouter();
	const { authState } = useAuth();
	const { colors } = useTheme();
	const [posts, setPosts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [totalPages, setTotalPages] = useState(1);
	const [isDownloaded, setIsDownloaded] = useState(false);
	const scrollY = new Animated.Value(0);
	const diffClamp = Animated.diffClamp(scrollY, 0, 80);
	const translateY = diffClamp.interpolate({
		inputRange: [0, 80],
		outputRange: [0, -80],
	});

	const fetchNextPage = async (refreshing = false) => {
		setIsLoading(true);
		try {
			const response = await axios.get(
				`${apiUrl}/api/posts?currentPage=${currentPage}&amount=5`
			);
			setIsLoading(false);
			setTotalPages(response.data.totalPages);
			console.log(refreshing, "isRefreshing");
			if (refreshing) {
				setPosts(response.data.posts);
			} else {
				setPosts((prevState) => [...prevState, ...response.data.posts]);
			}
			setIsDownloaded(true);
		} catch (error) {
			setIsLoading(false);
			console.error("Error fetching posts:", error);
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
		// console.log("---------------------", posts, "----------------------------Refresh");
		setIsDownloaded(false);
		setIsRefreshing(true);
		if (currentPage === 1) {
			await fetchNextPage(true);
		} else {
			setCurrentPage(1);
		}
	};
	return (
		<View className="bg-neutral-900 relative" style={{ width, height }}>
			<Animated.View
				className="w-full bg-black border-b border-neutral-600 py-1"
				style={{ transform: [{ translateY: translateY }], elevation: 4 }}>
				<View className="flex flex-row items-center justify-between px-3">
					<View>
						<Text
							style={{ color: colors.text }}
							className="font-GilroySemiBold py-2 text-2xl">
							Najnowsze posty
						</Text>
					</View>
					{authState.role === "admin" && (
						<View>
							<TouchableOpacity
								onPress={() => router.push("/(admin)/managePosts")}>
								<Ginf name="verif" size={38} color="white" />
							</TouchableOpacity>
						</View>
					)}
				</View>
			</Animated.View>
			{isDownloaded ? (
				<FlatList
					data={posts}
					renderItem={({ item }) => (
						<Post colors={colors} key={item.id + "aa"} post={item} />
					)}
					keyExtractor={(item, index) => item.id + index.toString()}
					contentContainerStyle={{ position: "relative" }}
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
							{posts.length > 0 ? null : (
								<Text
									style={{ color: "white" }}
									className="font-GilroyMedium text-2xl text-center">
									Brak postów
								</Text>
							)}
						</View>
					}
				/>
			) : (
				<View className="flex flex-col gap-2">
					<SkeletonPost />
					<SkeletonPost />
					<SkeletonPost />
					<SkeletonPost />
					<SkeletonPost />
				</View>
			)}
		</View>
	);
};

export default HomeScreen;
