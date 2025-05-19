import { Tabs } from "expo-router";
import React, { useRef } from "react";
import { Platform, Dimensions, Image } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";
import TabBar from "@/components/TabBar";
import { useAuth } from "../context/AuthContext";
import { Redirect, useRouter } from "expo-router";
import Ginf from "../../../components/ui/Ginf/Ginf";
import { useNavigationContext } from "../context/NavigationContext";
import { withTiming } from "react-native-reanimated";
import { runOnJS } from "react-native-reanimated";

export default function TabsLayout() {
	const { authState } = useAuth();
	const colorScheme = useColorScheme();
	const { width, height } = Dimensions.get("window");

	const { isOpen, setIsOpen, translateX } = useNavigationContext();
	const handleOpenPress = () => {
		//setIsOpen(true)
		null;
	};
	const router = useRouter();
	const provide = () => router.push("/(auth)/sign-in");
	if (!authState.authenticated & !authState.anonymous) {
		return <Redirect href="/(auth)/sign-in" />;
	}
	const closeCreator = () => {
		translateX.value = withTiming(-width, { duration: 300 });
		runOnJS(setIsOpen)(true);
	};
	return (
		<>
			<SafeAreaView className="h-full">
				<Tabs
					tabBar={(props) => <TabBar {...props} />}
					screenOptions={{
						tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
						headerShown: false,
						tabBarButton: HapticTab,
						tabBarBackground: TabBarBackground,
						tabBarStyle: {
							...Platform.select({
								ios: {
									position: "absolute",
								},
								default: {},
							}),
						},
					}}>
					<Tabs.Screen
						name="home"
						options={{
							title: "Start",
							// onLongPress: closeCreator,
							tabBarIcon: ({ color }) => (
								<Ginf name="home" size={30} color={color} />
							),
						}}
					/>
					<Tabs.Screen
						name="books"
						options={{
							title: "Książki",
							tabBarIcon: ({ color }) => (
								<Ginf name="book" size={30} color={color} />
							),
						}}
					/>
					<Tabs.Screen
						name="search"
						options={{
							// onPress: authState.authenticated ? handleOpenPress : provide,
							title: "Wyszukaj",
							tabBarIcon: ({ color }) => (
								// <Ginf name="search" size={30} color={color} />
								<Ginf name="logoTws" size={30} color={color} />
							),
						}}
					/>
					<Tabs.Screen
						name="events"
						options={{
							title: "Wydarzenia",
							tabBarIcon: ({ color }) => (
								<Ginf name="event" size={30} color={color} />
							),
						}}
					/>
					<Tabs.Screen
						name="account"
						options={{
							title: "Konto",
							tabBarIcon: ({ color }) => (
								<Ginf name="account" size={30} color={color} />
							),
						}}
					/>
				</Tabs>
			</SafeAreaView>
		</>
	);
}
