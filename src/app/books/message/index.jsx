import {
	View,
	Text,
	TouchableOpacity,
	Image,
	TouchableWithoutFeedback,
	FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import Ginf from "../../../../components/ui/Ginf/Ginf";
import { useSocket } from "../../context/SocketProvider";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import clsx from "clsx";
import { useChat } from "../../context/ChatProvider";

export default function Messages() {
	const router = useRouter();
	const { colors } = useTheme();
	const { chats, setChats, isLoading, setActiveChat } = useChat();
	const socket = useSocket();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const goChat = (chatId) => {
		setChats((prev) => {
			const updatedChats = prev.map((chat) => {
				return chat._id === chatId
					? {
							...chat,
							isRead: true,
						}
					: chat;
			});
			return updatedChats;
		});
		setActiveChat(chats.find((item) => item._id === chatId));
		router.push(`books/message/${chatId}`);
	};

	return (
		<View className="bg-black flex-1">
			<View
				className="w-full bg-black border-b border-neutral-600 py-2"
				style={{ elevation: 4 }}>
				<View className="flex flex-row items-center justify-between px-3">
					<View>
						<Text
							style={{ color: colors.text }}
							className="font-GilroySemiBold py-2 text-2xl">
							Wiadomości
						</Text>
					</View>
					<View>
						<TouchableOpacity onPress={() => router.back()}>
							<Ginf name="arrowBack" size={38} color="white" />
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<View className="bg-black flex-1 flex flex-col gap-1">
				{!isLoading ? (
					<FlatList
						data={chats}
						keyExtractor={(item) => item._id.toString()}
						initialNumToRender={20}
						maxToRenderPerBatch={10}
						contentContainerStyle={{
							display: "flex",
							gap: 1,
							backgroundColor: "#151515",
						}}
						renderItem={({ item, index }) => {
							const hours = new Date(item.updatedAt).getHours();
							const minutes = new Date(item.updatedAt).getMinutes();
							const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
								minutes < 10 ? "0" + minutes : minutes
							}`;
							console.log(item);
							return (
								<View className="relative">
									<TouchableWithoutFeedback
										key={item._id}
										onPress={() => goChat(item._id)}
										className="flex ">
										<View className="flex bg-black p-2 flex-row gap-4 flex-1 relative ">
											<View className="flex justify-center items-center">
												<View
													style={{ width: 56, height: 56, borderRadius: 99 }}
													className="w-14 h-14 rouded-full bg-neutral-800 flex items-center justify-center border border-neutral-500">
													<Image
														source={{ uri: item?.photo }}
														style={{ width: 56, height: 56, borderRadius: 99 }}
													/>
												</View>
											</View>
											<View className="flex justify-center flex-1">
												<Text className="text-neutral-400 font-GilroyMedium text-sm">
														{item?.sold && item.seller && "Sprzedano: "}
														{item?.sold && item.buyer && "Kupiłeś od: "}
													{item.participant.firstName
														? item.participant.firstName
														: item.participant.nick}
												</Text>
												<Text
													className={clsx("text-lg text-neutral-300", {
														"font-GilroyExtraBold": !item?.isRead,
														"font-GilroySemiBold": item?.isRead,
													})}>
													{item?.adId.title}
												</Text>
												<View className="flex flex-row justify-between grow-1">
													<Text
														numberOfLines={1}
														ellipsizeMode="tail"
														className={clsx("text-neutral-400 text-sm", {
															"font-GilroyExtraBold":
																!item?.isRead && !item?.isSender,
															"font-GilroyRegular": item?.isSender,
														})}>
														{item?.isSender ? "Ty: " : "Ktoś: "}
														{item?.lastMessage
															? item.lastMessage.replace(/\n/g, " ").trim()
															: "Brak wiadomości"}
													</Text>
													<Text className="text-neutral-400 font-GilroyMedium">
														{formattedTime}
													</Text>
												</View>
											</View>
										</View>
									</TouchableWithoutFeedback>
									{item?.sold && !item.seller && (
										<View className="absolute bg-neutral-900/70 w-full h-full flex justify-center items-center">
											<Text className="text-neutral-400 font-GilroyMedium">
												Książka sprzedana
											</Text>
										</View>
									)}
								</View>
							);
						}}
					/>
				) : (
					<Text className="font-GilroyMedium text-white">Loading...</Text>
				)}
			</View>
		</View>
	);
}
