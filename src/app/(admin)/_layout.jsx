import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { EditPostProvider } from "../context/EditPostContext";

const AdminLayout = () => {
	return (
		<EditPostProvider>
			<SafeAreaView className="h-full">
				<Stack>
					<Stack.Screen name="managePosts" options={{ headerShown: false }} />
					<Stack.Screen name="editPost" options={{ headerShown: false }} />
					<Stack.Screen name="manageBooks" options={{ headerShown: false }} />
					<Stack.Screen name="editBook" options={{ headerShown: false }} />
					{/* <Stack.Screen name="sign-up" options={{ headerShown: false }} /> */}
				</Stack>
			</SafeAreaView>
		</EditPostProvider>
	);
};

export default AdminLayout;
