import "react-native-reanimated";
import "react-native-gesture-handler";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, SplashScreen } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "../../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import AuthProvider from "./context/AuthContext";
import { authState } from "./context/AuthContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationProvider } from "./context/NavigationContext";
import { ActivityIndicator } from "react-native";
import { SocketProvider } from "./context/SocketProvider";
import { ChatProvider } from "./context/ChatProvider";
import { MyStyleProvider } from "./context/MyStyleProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [fontsLoaded, error] = useFonts({
		"Gilroy-Regular": require("@/assets/fonts/Gilroy-Regular.ttf"),
		"Gilroy-Medium": require("@/assets/fonts/Gilroy-Medium.ttf"),
		"Gilroy-SemiBold": require("@/assets/fonts/Gilroy-SemiBold.ttf"),
		"Gilroy-ExtraBold": require("@/assets/fonts/Gilroy-ExtraBold.ttf"),
	});

	useEffect(() => {
		if (error) throw error;

		if (fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, error]);
	if (!fontsLoaded && !error) return null;

	if (!fontsLoaded && !error) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#000", // Tło ekranu ładowania
				}}>
				{/* <Image
                    source={require("@/assets/custom-loading.png")}
                    style={{ width: 150, height: 150, resizeMode: "contain" }}
                /> */}
				<Text style={{ color: "#fff", marginTop: 20, fontSize: 18 }}>
					Ładowanie aplikacji...
				</Text>
			</View>
		);
	}

	return (
		<NavigationProvider>
			<AuthProvider>
				<SocketProvider>
					<ChatProvider>
						<MyStyleProvider>
							<GestureHandlerRootView
								style={{
									flex: 1,
									backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
								}}>
								<BottomSheetModalProvider>
									<ThemeProvider
										value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
										<Stack screenOptions={{ headerShown: false }}>
											<Stack.Screen
												name="index"
												options={{ headerShown: false }}
											/>
											<Stack.Screen
												name="(tabs)"
												options={{ headerShown: false }}
											/>
											<Stack.Screen
												name="(auth)"
												options={{ headerShown: false }}
											/>
											<Stack.Screen
												name="(admin)"
												options={{ headerShown: false }}
											/>
										</Stack>
									</ThemeProvider>
								</BottomSheetModalProvider>
							</GestureHandlerRootView>
						</MyStyleProvider>
					</ChatProvider>
				</SocketProvider>
			</AuthProvider>
		</NavigationProvider>
	);
}
