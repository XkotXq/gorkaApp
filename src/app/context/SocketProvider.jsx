import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const SocketContext = createContext();

// Adres serwera Socket.IO
const SOCKET_SERVER_URL =
	process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.236:3001";

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const { authState, refreshAccessToken } = useAuth();
    useEffect(() => {
        if (!authState.token) return;

        // Funkcja do utworzenia nowego połączenia
        const connectSocket = (token) => {
            const newSocket = io(SOCKET_SERVER_URL, {
                auth: { token },
                transports: ["websocket"],
            });

            newSocket.on("connect", () => {
                console.log("Socket connected:", newSocket.id);
            });

            newSocket.on("tokenExpired", async () => {
                console.log("Token expired, odświeżanie tokenu...");
                try {
                    const newToken = await refreshAccessToken();
                    console.log("Token odświeżony:", newToken);

                    newSocket.disconnect();

                    connectSocket(newToken);
                } catch (error) {
                    console.error("Błąd podczas odświeżania tokenu:", error);
                }
            });

            newSocket.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            setSocket(newSocket);
        };

        connectSocket(authState.token);

        return () => {
            if (socket) socket.disconnect();
        };
    }, [authState.token]);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

export const useSocket = () => {
	return useContext(SocketContext);
};
