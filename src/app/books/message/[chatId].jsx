import { useRouter, useLocalSearchParams } from "expo-router";
import {
	View,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	TextInput,
	Image,
	Dimensions,
	FlatList,
} from "react-native";
import Ginf from "../../../../components/ui/Ginf/Ginf";
import { useTheme } from "@react-navigation/native";
import { useSocket } from "../../context/SocketProvider";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import TypingIndicator from "../../../../components/ui/TypingIndicator";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
	interpolateColor,
	interpolate,
	runOnJS,
	configureReanimatedLogger,
	ReanimatedLogLevel,
} from "react-native-reanimated";
import ReanimatedSwipeable from "./ReanimatedSwiepable";
// import { FlatList } from "react-native-gesture-handler";
import CustomBottomSheet from "../../../../components/CustomBottomSheet";
import axios from "axios";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useChat } from "../../context/ChatProvider";

export default function ChatDetails() {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL;
	const router = useRouter();
	const { chatId } = useLocalSearchParams();
	const { authState } = useAuth();
	const { activeChat } = useChat();
	const socket = useSocket();
	const typingTimeoutRef = useRef(null);
	const flatListRef = useRef(null);
	const bottomSheetRef = useRef(null);
	const adSheetRef = useRef(null);

	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
	const [replyTo, setReplyTo] = useState(null);
	const [personDetails, setPersonDetails] = useState(null);
	const [isTyping, setIsTyping] = useState(false);
	const [sheetFor, setSheetFor] = useState(null);
	const [page, setPage] = useState(0);
	const [selectedMessageId, setSelectedMessageId] = useState(null);
	const [usable, setUsable] = useState(
		!activeChat?.sold || activeChat?.buyer || activeChat?.seller
	);

	// const [isEnd, setIsEnd] = useState(false);

	useEffect(() => {
		setUsable(!activeChat.sold || activeChat.buyer || activeChat.seller);
	}, [activeChat]);
	console.log(activeChat, "activeChat");

	const defaultAvatar = require("../../../../assets/images/GLogo.png");
	useEffect(() => {
		if (!socket) return;

		socket.on("getChatMessages", ({ messages, person, page }) => {
			// console.log(messages, "mmmm?");
			setMessages((prev) => {
				const allMessages = [...prev, ...messages];
				const uniqueMessages = Array.from(
					new Map(allMessages.map((msg) => [msg._id, msg])).values()
				);
				return uniqueMessages;
			});
			setIsLoading(false);
			if (person) {
				setPersonDetails(person);
			}
			setIsRefreshing(false);
			setPage(page);
		});
		socket.on("messageReceived", ({ message }) => {
			console.log(message);
			setMessages((prev) => {
				return [message, ...prev];
			});
		});
		socket.on("readMessage", ({ messageIds }) => {
			console.log(messageIds, "messageIds");
			console.log("przeczytane");
			const messageIdSet = new Set(messageIds);
			console.log(
				messages.map((msg) =>
					messageIdSet.has(msg._id) ? { ...msg, isRead: true } : msg
				)
			);
			setMessages((prev) => {
				const updatedPrev = prev.map((msg) =>
					messageIdSet.has(msg._id) ? { ...msg, isRead: true } : msg
				);
				return updatedPrev;
			});
		});
		socket.on("isTyping", ({ chatId: lChatId, isTyping }) => {
			if (lChatId === chatId) {
				setIsTyping(isTyping);
			}
		});

		socket.on("deleteMessage", ({ messageId }) => {
			setMessages((prev) => {
				const copyPrev = prev.map((item) =>
					item._id == messageId
						? { ...item, deleted: true, content: null }
						: item?.replyTo?._id == messageId
							? {
									...item,
									replyTo: {
										...item.replyTo,
										deleted: true,
										content: null,
									},
								}
							: item
				);
				return copyPrev;
			});
		});
		socket.on("sendedMessage", ({ chatId, updatedId, temporaryId }) => {
			console.log("wysłano");
			setMessages((prev) =>
				prev.map((item) =>
					item._id === temporaryId
						? { ...item, sended: true, _id: updatedId }
						: item
				)
			);
		});
		// socket.on("soldBook", ({}) => {

		// });
		// socket.emit("getChatMessages", { chatId, page: 0 });

		return () => {
			socket.off("getChatMessages");
			socket.off("messageReceived");
			socket.off("readMessage");
			socket.off("isTyping");
			socket.off("soldBook");
			socket.off("deleteMessage");
			// socket.off("sendedMessage");
		};
	}, [socket, authState.userId]);
	useEffect(() => {
		handleSetIsReadedView();
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, []);
	const handleSetIsReadedView = () => {
		setMessages((prev) => {
			let isReadedViewSet = false;
			return prev.map((msg) => {
				if (msg.isSender && msg.isRead && !isReadedViewSet) {
					isReadedViewSet = true;
					return { ...msg, isReadedView: true, forView: false };
				}
				return { ...msg, isReadedView: false, forView: false };
			});
		});
	};

	// ustaw ogłoszenie na sprzedane
	const handleSetSold = async () => {
		try {
			if (!activeChat.seller) return;
			const response = await axios.put(
				`${apiUrl}/api/book/${activeChat.adId._id?.toString()}/sold`,
				{
					buyerId: activeChat.participant._id?.toString(),
				}
			);
			if (response.status === 200) console.log("ok");
		} catch (error) {
			console.log(error);
		}
	};

	const handleSendMessage = () => {
		if (!message) return;
		const temporaryId = Date.now();
		socket.emit("sendMessage", {
			chatId,
			temporaryId,
			message: message.trim(),
			addUser: messages.length > 0 ? false : true,
			...(replyTo?.id && { replyTo: replyTo.id }),
		});
		socket.emit("isTyping", { chatId, isTyping: false });
		setMessages((prev) => {
			return [
				{
					_id: temporaryId,
					messages: message.trim(),
					isSender: true,
					sended: false,
					chatId,
					createdAt: Date.now(),
					...(replyTo?.id && {
						replyTo: {
							content: replyTo.content,
							id: replyTo.id + Date.now(),
							isSender: replyTo.isSender,
							chatId,
							createdAt: Date.now(),
						},
					}),
				},
				...prev,
			];
		});
		flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
		setReplyTo(null);
		setMessage("");
	};
	const handleViewableItemsChanged = React.useCallback(
		({ viewableItems }) => {
			const readMessages = viewableItems
				.filter((item) => !item.item.isRead && !item.item.isSender) // Filtruj nieprzeczytane wiadomości
				.map((item) => item.item._id); // Pobierz ID wiadomości
			setMessages((prev) =>
				prev.map((msg) =>
					readMessages.includes(msg._id) ? { ...msg, isRead: true } : msg
				)
			);
			if (readMessages.length > 0) {
				socket.emit("readMessage", { chatId, messageIds: readMessages });
			}
		},
		[socket, chatId]
	);

	// const handleViewableItemsChanged = React.useCallback(
	// 	({ viewableItems }) => {
	// 		const readMessages = viewableItems
	// 			.filter((item) => !item.item.isRead && !item.item.isSender) // Filtruj nieprzeczytane wiadomości
	// 			.map((item) => item.item._id); // Pobierz ID wiadomości

	// 		setMessages((prev) =>
	// 			prev.map((msg, index, arr) => {
	// 				const isLastRead =
	// 					readMessages.includes(msg._id) &&
	// 					(index === arr.length - 1 || !arr[index + 1]?.isRead);
	// 				return {
	// 					...msg,
	// 					isRead: readMessages.includes(msg._id),
	// 					isLastRead,
	// 				};
	// 			})
	// 		);

	// 		if (readMessages.length > 0) {
	// 			socket.emit("readMessage", { chatId, messageIds: readMessages });
	// 		}
	// 	},
	// 	[socket, chatId]
	// );

	const handleTyping = (text) => {
		setMessage(text);

		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}
		if (text.length === 0) {
			socket.emit("isTyping", { chatId, isTyping: false });
			return;
		}

		socket.emit("isTyping", { chatId, isTyping: true });

		typingTimeoutRef.current = setTimeout(() => {
			socket.emit("isTyping", { chatId, isTyping: false });
		}, 3000);
	};

	const { colors } = useTheme();
	return (
		<View style={{ flex: 1 }}>
			<View
				className="w-full bg-black border-b border-neutral-600 py-2"
				style={{ elevation: 4 }}>
				<View className="flex flex-row items-center justify-between px-3">
					<View className="flex flex-row items-center gap-2">
						<View className="border border-neutral-500 rounded-full w-12 h-12 flex justify-center items-center bg-black">
							<Image source={defaultAvatar} style={{ height: 24, width: 24 }} />
						</View>
						<Text
							style={{ color: colors.text }}
							className="font-GilroySemiBold py-2 text-2xl">
							{personDetails
								? personDetails.firstName && personDetails.lastName
									? `${personDetails.firstName} ${personDetails.lastName}`
									: personDetails.nick || ""
								: ""}
						</Text>
					</View>
					<View>
						<TouchableOpacity onPress={() => router.back()}>
							<Ginf name="arrowBack" size={38} color="white" />
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<View className="w-full bg-black border-b border-neutral-600 py-2 flex flex-row justify-between px-3">
				<View className="flex flex-row gap-2">
					<View>
						<Image
							source={{ uri: activeChat.adId?.photos[0].src }}
							style={{ width: 42, height: 42, borderRadius: 99 }}
						/>
					</View>
					<View className="flex items-center justify-center">
						<Text className="text-white text-xl font-GilroySemiBold">
							{activeChat.adId.title}
						</Text>
					</View>
				</View>
				<View className="flex items-center justify-center flex-row gap-2">
					<Text className="text-white font-GilroyRegular text-xl ">
						{activeChat.adId.price ? activeChat.adId.price / 100 : 0} zł
					</Text>
					{activeChat.seller && (
						<View>
							<TouchableOpacity onPress={() => adSheetRef.current.present()}>
								<Ginf name="unevenCircle" size={24} />
							</TouchableOpacity>
						</View>
					)}
				</View>
			</View>
			<View className="flex-1 flex">
				<FlatList
					ref={flatListRef}
					data={messages}
					extraData={messages}
					contentContainerStyle={{ paddingHorizontal: 8 }}
					keyExtractor={(item) => item._id.toString()}
					onViewableItemsChanged={handleViewableItemsChanged}
					initialNumToRender={20}
					maxToRenderPerBatch={10}
					renderItem={({ item, index }) => (
						<Message
							id={item._id.toString()}
							setReplyTo={setReplyTo}
							replyToData={item?.replyTo}
							message={item.messages}
							isSender={item.isSender}
							isRead={item.isRead}
							deleted={item.deleted}
							isLastRead={item.isLastRead}
							time={item.createdAt}
							sended={item?.sended}
							usable={usable}
							selectedMessageId={selectedMessageId}
							setSelectedMessageId={setSelectedMessageId}
							nextTime={
								index + 1 < messages.length
									? messages[index + 1]?.createdAt
									: item.createdAt
							}
							personDetails={personDetails}
							scrollEnabled={true}
							prevIsSender={
								index - 1 >= 0
									? messages[index - 1]?.isSender
									: item.isSender
										? false
										: true
							}
							nextIsSender={
								index + 1 <= messages.length
									? messages[index + 1]?.isSender
									: item.isSender
										? false
										: true
							}
							setSheetFor={setSheetFor}
							sheetFor={sheetFor}
							bottomSheetRef={bottomSheetRef}
						/>
					)}
					onEndReached={() => {
						socket.emit("getChatMessages", {
							chatId,
							page: messages.length,
						});
						setPage((prev) => prev + 1);
					}}
					ListHeaderComponent={
						isTyping ? (
							<View className="flex justify-start items-start mb-1">
								<View
									className="flex flex-row p-4 border grow-0 gap-2 rounded-t-full  bg-neutral-800 border-neutral-800"
									style={{
										borderTopLeftRadius: 20,
										borderTopRightRadius: 20,
										borderBottomRightRadius: 20,
										borderBottomLeftRadius: 20,
										maxWidth: "70%",
									}}>
									<TypingIndicator />
								</View>
							</View>
						) : null
					}
					ListFooterComponent={
						!isLoading && messages?.length <= 0 ? (
							<View>
								<Text className="text-neutral-500 text-center font-GilroyRegular py-2">
									Brak wiadomości, wkrótce czat zostanie usunięty
								</Text>
							</View>
						) : isLoading ? (
							<View>
								<Text className="text-neutral-500 text-center font-GilroyRegular py-2">
									Ładowanie...
								</Text>
							</View>
						) : null
					}
					inverted
				/>
			</View>
			<View className="relative">
				{replyTo ? (
					<View className="border-b border-neutral-800 py-2 px-3 flex flex-row justify-between items-center rounded-t-lg bg-neutral-900">
						<View>
							<Text className="font-GilroyRegular text-sm text-neutral-600">
								{!replyTo.isSender
									? personDetails
										? personDetails.firstName && personDetails.lastName
											? personDetails.firstName
											: personDetails.nick || ""
										: ""
									: "Ty"}
							</Text>
							<Text className="font-GilroyMedium text-neutral-500">
								{replyTo.content}
							</Text>
						</View>
						<View>
							<TouchableOpacity onPress={() => setReplyTo(null)}>
								<Ginf name="x" size={24} color="#737373" />
							</TouchableOpacity>
						</View>
					</View>
				) : null}
				{usable ? (
					<View className="w-full bg-neutral-900 py-2 px-3  flex justify-between flex-row items-center">
						<View className="flex-1">
							<TextInput
								placeholder="wiadomość"
								className="placeholder:text-neutral-700 text-neutral-400"
								editable
								value={message}
								onChangeText={handleTyping}
								multiline
								maxLines={4}
								numberOfLines={4}
							/>
						</View>
						<View className="flex justify-center items-center">
							<TouchableOpacity
								className="p-2 rounded-full flex justify-center items-center"
								onPress={handleSendMessage}>
								<Ginf name="arrowTop" size={26} color="#D0F601" />
							</TouchableOpacity>
						</View>
					</View>
				) : (
					<View className="w-full bg-black border-t border-neutral-600 py-2 px-3">
						<Text className="text-neutral-400 text-center">
							Książka została już sprzedana (czat wkrótce pozostanie usunięty)
						</Text>
					</View>
				)}
			</View>
			<CustomBottomSheet
				ref={bottomSheetRef}
				snapPoints={["10%"]}
				scrollView={false}>
				<View style={{ paddingHorizontal: 10, flex: 1 }}>
					<TouchableOpacity
						onPress={() => {
							socket.emit("deleteMessage", { chatId, messageId: sheetFor });
							bottomSheetRef.current.close();
						}}
						className="py-3">
						<Text className="text-white font-GilroyMedium text-center">
							Usuń wiadomość
						</Text>
					</TouchableOpacity>
				</View>
			</CustomBottomSheet>
			<CustomBottomSheet
				ref={adSheetRef}
				snapPoints={["30%"]}
				scrollView={false}>
				<View style={{ paddingHorizontal: 10, flex: 1 }}>
					<TouchableOpacity
						className="w-full py-5 bg-[#252525]"
						onPress={() => {
							handleSetSold();
							adSheetRef.current.close();
						}}>
						<Text className="text-neutral-300 text-center font-GilroyMedium">
							Oznacz jako sprzedane
						</Text>
					</TouchableOpacity>
					<View className="w-full border-b border-neutral-700 " />
					{/* <View className="w-full border-b border-neutral-700" /> */}
					<TouchableOpacity className="w-full py-5 bg-[#252525]">
						<Text className="text-neutral-300 text-center font-GilroyMedium">
							Usuń ogłoszenie
						</Text>
					</TouchableOpacity>
				</View>
			</CustomBottomSheet>
		</View>
	);
}
const Message = ({
	message,
	isSender,
	isRead,
	deleted,
	isLastRead,
	time,
	nextTime,
	prevIsSender,
	nextIsSender,
	setReplyTo,
	id,
	replyToData,
	personDetails,
	setSheetFor,
	sheetFor,
	usable,
	bottomSheetRef,
	selectedMessageId,
	setSelectedMessageId,
	sended = true,
}) => {
	const getNextDay = nextTime
		? new Date(nextTime).getDate()
		: new Date.getDate();
	const getDay = new Date(time).getDate();
	const getMonth = new Date(time).getMonth();

	const hours = new Date(time).getHours();
	const minutes = new Date(time).getMinutes();
	const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
		minutes < 10 ? "0" + minutes : minutes
	}`;

	const onSwipeOpenAction = () => {
		setReplyTo({ isSender, content: message, isRead, time, id });
	};
	const months = [
		"Stycznia",
		"Lutego",
		"Marca",
		"Kwietnia",
		"Maja",
		"Czerwca",
		"Lipca",
		"Sierpnia",
		"Września",
		"Października",
		"Listopada",
		"Grudnia",
	];
	const formattedDate = `${getDay} ${months[getMonth]}`;
	return (
		<View>
			{getNextDay != getDay ? (
				<View>
					<Text className="text-neutral-500 text-center">{formattedDate}</Text>
				</View>
			) : null}

			<View
				className={`flex justify-end w-full ${isSender ? "items-end" : "items-start"} ${!replyToData && "my-[2px]"} `}>
				{replyToData && (
					<Text
						className="text-neutral-400 font-GilroyRegular text-sm -translate-x-3 relative"
						style={{ transform: [{ translateY: 4 }] }}>
						{replyToData.isSender
							? isSender
								? "Odpowiedziałeś(aś) sobie"
								: `${
										personDetails
											? personDetails.firstName && personDetails.lastName
												? personDetails.firstName
												: personDetails.nick || ""
											: ""
									} odpowiedział(a) Ci`
							: isSender
								? `Odpowiedziałeś(aś)  ${
										personDetails
											? personDetails.firstName && personDetails.lastName
												? personDetails.firstName
												: personDetails.nick || ""
											: ""
									}`
								: `${
										personDetails
											? personDetails.firstName && personDetails.lastName
												? personDetails.firstName
												: personDetails.nick || ""
											: ""
									} odpowiedział(a) sobie`}
					</Text>
				)}

				<ReanimatedSwipeable
					onSwipeLeft={
						isSender && !deleted && usable ? () => onSwipeOpenAction() : null
					}
					onSwipeRight={
						!isSender && !deleted && usable ? () => onSwipeOpenAction() : null
					}>
					<TouchableWithoutFeedback
						onPress={() => {
							if (selectedMessageId === id) {
								setSelectedMessageId(null);
							} else {
								setSelectedMessageId(id);
							}
						}}
						onLongPress={() => {
							if (!deleted && isSender && usable) {
								setReplyTo(null);
								bottomSheetRef.current.present();
								setSheetFor(id);
							}
						}}>
						<View
							className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}>
							{replyToData ? (
								<View
									className={`relative flex ${isSender ? "items-end" : "items-start"}`}>
									<View
										style={{
											paddingHorizontal: 8,
											paddingTop: 8,
											paddingBottom: 16,
											top: 8,
										}}
										className={`flex flex-col px-2 pt-2 pb-6 rounded-[20px] relative border grow-0 ${
											replyToData.isSender
												? "bg-neutral-900 border-neutral-800"
												: "bg-neutral-800 border-neutral-700"
										}`}>
										<View>
											<Text
												className={`${
													replyToData.isSender
														? "text-neutral-300"
														: "text-neutral-400"
												} font-GilroyRegular`}>
												{!replyToData.deleted
													? replyToData.content
													: "Wiadomość usunięta"}
											</Text>
										</View>
									</View>
								</View>
							) : null}

							<View
								className={`flex flex-col p-2 border rounded-t-full grow-0 ${
									isSender
										? !deleted
											? "bg-[#bbda10] border-[#bbda10]"
											: "border-neutral-700"
										: !deleted
											? "bg-neutral-800 border-neutral-800"
											: "border-neutral-800"
								}`}
								style={[
									{
										...(isSender
											? {
													borderTopLeftRadius: 20,
													borderTopRightRadius: nextIsSender ? 5 : 20,
													borderBottomRightRadius: prevIsSender ? 5 : 20,
													borderBottomLeftRadius: 20,
												}
											: {
													borderTopLeftRadius: !nextIsSender ? 5 : 20,
													borderTopRightRadius: 20,
													borderBottomRightRadius: 20,
													borderBottomLeftRadius: !prevIsSender ? 5 : 20,
												}),
									},
								]}>
								<View className="flex flex-row">
									<Text
										className={`${!deleted ? (isSender ? "text-neutral-900" : "text-neutral-400") : "text-neutral-500"} font-GilroyRegular grow-0 flex text-lg`}>
										{!deleted ? message : "Wiadomość usunięta"}
									</Text>
								</View>
							</View>
							{!deleted && (
								<View
									className="flex justify-end items-center absolute"
									style={{ right: 4, bottom: 4 }}>
									{isSender &&
										(!sended ? (
											<Ginf name="unevenCircle" size={8} color="black" />
										) : isRead ? (
											<Ginf name="doubleCheck" size={10} color="black" />
										) : (
											<Ginf name="check" size={8} color="black" />
										))}
								</View>
							)}
						</View>
					</TouchableWithoutFeedback>
				</ReanimatedSwipeable>
				{selectedMessageId === id && !deleted && (
					<View className="pb-1">
						<Text
							className={`text-[12px] font-GilroyRegular text-end ${isSender ? "text-neutral-400" : "text-neutral-500"}`}>
							Wysłano o {formattedTime}
						</Text>
					</View>
				)}
			</View>
		</View>
	);
};
