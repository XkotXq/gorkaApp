import { View, Text, TouchableOpacity } from "react-native";
import Ginf from "../../../components/ui/Ginf/Ginf";
import React from "react";
import { useRouter } from "expo-router";

export default function List() {
	const router = useRouter();
	return (
		<View>
			<View className="w-full bg-black border-b border-neutral-600 py-1">
				<View className="flex flex-row items-center justify-between px-3">
					<View>
						<Text
							style={{ color: "white" }}
							className="font-GilroySemiBold py-2 text-2xl">
							Twoje książki
						</Text>
					</View>
					<View className="flex flex-row gap-4 items-center">
						<View>
							<TouchableOpacity onPress={() => router.back()}>
								<Ginf name="arrowBack" size={38} color="white" />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
			<Text>List</Text>
		</View>
	);
}
