import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

import { jwtDecode } from "jwt-decode";

interface AuthProps {
	authState?: {
		token: string | null;
		authenticated: boolean | null;
		anonymous?: boolean | null;
		isAdmin?: boolean | null;
		info?: {
			nick: string;
			email: string;
			firstName: string;
			lastName: string;
			class: string;
			role: string;
		};
	};
	onRegister?: (
		login: string,
		email: string,
		password: string,
		nick: string
	) => Promise<any>;
	changeDetails?: (
		firstName: string,
		lastName: string,
		nick: string,
		class_: string,
		description: string,
		avatar: string
	) => Promise<any>;
	onLogin?: (email: string, password: string) => Promise<any>;
	onLogout?: () => Promise<any>;
	goAnonymous?: () => void;
	refreshAccessToken?: () => Promise<any>;
}

const TOKEN_KEY: string | undefined = process.env.EXPO_PUBLIC_TOKEN_KEY;
const REFRESH_TOKEN_KEY: string | undefined = process.env.EXPO_PUBLIC_REFRESH_TOKEN_KEY;
const AuthContext = createContext<AuthProps>({});
if (!TOKEN_KEY || !REFRESH_TOKEN_KEY) {
  throw new Error("TOKEN_KEY environment variable is not set");
}
const AuthContext = createContext<AuthProps>({});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};


export const useAuth = () => {
	return useContext(AuthContext);
};

export default function AuthProvider({ children }: any) {
	const router = useRouter();
	const apiUrl = process.env.EXPO_PUBLIC_API_URL;
	const [authState, setAuthState] = useState<{
		token: string | null;
		authenticated: boolean | null;
		anonymous?: boolean | null;
		isAdmin?: boolean | null;
		nick: string | null;
		email: string | null;
		firstName: string | null;
		lastName: string | null;
		class: string | null;
		role: string | null;
	}>({
		token: null,
		authenticated: null,
		anonymous: null,
		isAdmin: null,
		nick: null,
		email: null,
		firstName: null,
		lastName: null,
		class: null,
		role: null,
	});
	// dodać odświeżanie tokena
	useEffect(() => {
		const loadToken = async () => {
			const token = await SecureStore.getItemAsync(TOKEN_KEY);
			console.log("stored:", token);

			if (token) {
				axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

				try {
					const decodedToken: any = jwtDecode(token);
					setAuthState({
						token: token,
						authenticated: true,
						anonymous: false,
						isAdmin: decodedToken.isAdmin,
						nick: decodedToken.nick,
						email: decodedToken.email,
						firstName: decodedToken.firstName,
						lastName: decodedToken.lastName,
						class: decodedToken.class,
						role: decodedToken.role,
					});
				} catch (error) {
					console.error("Failed to decode token:", error);
					// Opcjonalnie możesz wyczyścić token, jeśli jest nieprawidłowy
					await SecureStore.deleteItemAsync(TOKEN_KEY);
				}
			} else {
				const isAnonymous = await SecureStore.getItemAsync("anonymous");
				if (isAnonymous) {
					setAuthState({
						token: token,
						authenticated: false,
						anonymous: true,
						isAdmin: null,
						nick: null,
						email: null,
						firstName: null,
						lastName: null,
						class: null,
						role: null,
					});
				} else {
					setAuthState({
						token: token,
						authenticated: false,
						anonymous: false,
						isAdmin: null,
						nick: null,
						email: null,
						firstName: null,
						lastName: null,
						class: null,
						role: null,
					});
				}
			}
		};
		loadToken();
	}, []);

	const goAnonymous = async () => {
		await SecureStore.setItemAsync("anonymous", "true");
		setAuthState({
			token: null,
			authenticated: false,
			anonymous: true,
			nick: null,
			email: null,
			firstName: null,
			lastName: null,
			class: null,
			role: null,
		});
		router.replace("/(tabs)/home");
	};

	const register = async (
		login: string,
		email: string,
		password: string,
		nick: string
	) => {
		try {
			return await axios.post(`${apiUrl}/register`, {
				login,
				email,
				password,
				nick,
			});
		} catch (e) {
			console.log("err", e);
			return { error: true, msg: (e as any).response.data.msg };
		}
	};

	const login = async (email: string, password: string) => {
		try {
			const result = await axios.post(`${apiUrl}/auth`, { email, password });
			const restultData = result.data;
			setAuthState({
				token: restultData.token,
				authenticated: true,
				anonymous: false,
				nick: restultData.nick,
				email: restultData.email,
				firstName: restultData.firstName,
				lastName: restultData.lastName,
				class: restultData.class,
				role: restultData.role,
			});

			axios.defaults.headers.common["Authorization"] =
				`Bearer ${result.data.token}`;
			await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
			await SecureStore.setItemAsync(
				REFRESH_TOKEN_KEY,
				result.data.refreshToken
			);
			return result;
		} catch (e) {
			return { error: true, msg: (e as any).response.data.msg };
		}
	};

	const changeDetails = async (
		firstName: string,
		lastName: string,
		nick: string,
		class_: string,
		description: string,
		avatar: string
	) => {
		try {
			const res = await axios.post(`${apiUrl}/api/profile`, {
				firstName: firstName ? firstName : null,
				lastName: lastName ? lastName : null,
				nick: nick ? nick : null,
				class: class_ ? class_ : null,
				description: description ? description : null,
				avatar: avatar ? avatar : null,
			});
			// console.log("test", res.data, "------------- nie zapomnij ----------------");
			axios.defaults.headers.common["Authorization"] =
				`Bearer ${res.data.token}`;
			const updated = {
				...authState,
				...res.data.updatedObj,
				token: res.data.token,
			};
			console.log(
				updated,
				"updated -------------------- ",
				authState,
				"authState"
			);
			setAuthState(updated);
			// console.log(authState, "Jak to tam?");
			await SecureStore.setItemAsync(TOKEN_KEY, res.data.token);
			4;
			return res.data;
		} catch (e) {
			console.log("err", e);
			return { error: true, msg: (e as any).response.data.msg };
		}
	};

	const logout = async () => {
		await SecureStore.deleteItemAsync(TOKEN_KEY);
		await SecureStore.deleteItemAsync("anonymous");
		axios.defaults.headers.common["Authorization"] = "";

		setAuthState({
			token: null,
			authenticated: false,
			anonymous: false,
			nick: null,
			email: null,
			firstName: null,
			lastName: null,
			class: null,
			role: null,
		});
	};
	const refreshAccessToken = async () => {
		try {
			const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
			const response = await axios.post(`${apiUrl}/refresh-token`, {
				refreshToken,
			});
			const { token } = response.data;
			await SecureStore.setItemAsync(TOKEN_KEY, token);
			// await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
			setAuthState((prevState) => ({
				...prevState,
				token: token,
			}));
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			return token;
		} catch (error: any) {
			console.error("Error refreshing access token:", error);
			if (
				error?.response &&
				error.response.data.msg === "Refresh token expired"
			) {
				await logout();
			}
			throw error;
		}
	};

	axios.interceptors.request.use(
		async (config) => {
			const token = await SecureStore.getItemAsync(TOKEN_KEY);
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);
	axios.interceptors.response.use(
		(response) => {
			return response;
		},
		async (error) => {
			const originalRequest = error.config;
	
			if (error.response?.status === 401 && !originalRequest._retry) {
				if (isRefreshing) {
					// Jeśli token jest odświeżany, dodaj żądanie do kolejki
					return new Promise((resolve, reject) => {
						failedQueue.push({ resolve, reject });
					})
						.then((token) => {
							originalRequest.headers["Authorization"] = `Bearer ${token}`;
							return axios(originalRequest);
						})
						.catch((err) => {
							return Promise.reject(err);
						});
				}
	
				originalRequest._retry = true;
				isRefreshing = true;
	
				try {
					const newAccessToken = await refreshAccessToken();
					axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
					processQueue(null, newAccessToken);
					return axios(originalRequest);
				} catch (err) {
					processQueue(err, null);
					await logout();
					return Promise.reject(err);
				} finally {
					isRefreshing = false;
				}
			}
	
			return Promise.reject(error);
		}
	);

	const value = {
		onRegister: register,
		onLogin: login,
		onLogout: logout,
		onAnonymous: goAnonymous,
		changeDetails: changeDetails,
		refreshAccessToken: refreshAccessToken,
		authState,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
