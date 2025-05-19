import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketProvider";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
	const [chats, setChats] = useState([]);
	const [activeChat, setActiveChat] = useState(null)
	const [isLoading, setIsLoading] = useState(true);

	const socket = useSocket();

	useEffect(() => {
		if (!socket) return;

		socket.on("getChats", (data) => {
			console.log(data, "getChats");
			setChats(data);
			setIsLoading(false);
		});
		socket.on("messageReceived", ({ message }) => {
			console.log(message, "messageReceived");
			console.log(chats, "test");
			setChats((prev) => {
				return prev.map((chat) => {
					if (chat._id == message.chatId) {
						return {
							...chat,
							lastMessage: message.messages,
							isSender: message.isSender,
							createdAt: message.createdAt,
							isRead: message.isSender,
						};
					}
					return chat;
				});
			});
		});
		socket.on("soldBook", ({bookId}) => {
			setChats((prev) => {
				return prev.map((chat) => {
					if(chat.adId._id == bookId) {
						return {
							...chat,
							sold: true,
						};
					}
					return chat;
				})
			})
			if(activeChat && activeChat.adId._id == bookId) {
				setActiveChat((prev) => {
					return {
						...prev,
						sold: true,
					}
				})
			}
		});


		socket.emit("getChats");
		return () => {
			socket.off("getChats");
		};
	}, [socket]);

	return (
		<ChatContext.Provider value={{ chats, setChats, isLoading, setIsLoading, activeChat, setActiveChat }}>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => useContext(ChatContext);
