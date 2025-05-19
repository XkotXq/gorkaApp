import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import React from "react";

export default function SellectCreator() {
    const router = useRouter();
	return (
		<View
			className="flex flex-col gap-4"
			style={{ gap: 12, padding: 24, paddingTop: 0 }}>
			<TouchableOpacity
                onPress={() => router.push("/")}
				className="flex flex-row justify-between items-center w-full py-2 px-3 border border-[#D0F601] rounded-lg"
				style={{ borderRadius: 12 }}>
				<Text
					className="font-GilroySemiBold text-xl color-white"
					style={{ color: "white" }}>
					Stwórz post
				</Text>
				<Image
					source={require("../assets/images/postIcon.png")}
					style={{ width: 50, height: 50, resizeMode: "contain" }}
				/>
			</TouchableOpacity>
			<TouchableOpacity
                onPress={() => router.push("/books")}
				className="flex flex-row justify-between items-center w-full py-2 px-3 border border-[#D0F601] rounded-lg"
				style={{ borderRadius: 12 }}>
				<Text
					className="font-GilroySemiBold text-xl color-white"
					style={{ color: "white" }}>
					Wystaw książkę
				</Text>
				<Image
					source={require("../assets/images/bookIcon.png")}
					style={{ width: 50, height: 50, resizeMode: "contain" }}
				/>
			</TouchableOpacity>
			<TouchableOpacity
                onPress={() => router.push("/events")}
				className="flex flex-row justify-between items-center w-full py-2 px-3 border border-[#D0F601] rounded-lg"
				style={{ borderRadius: 12 }}>
				<Text
					className="font-GilroySemiBold text-xl color-white"
					style={{ color: "white" }}>
					Stwórz wydarzenie
				</Text>
				<Image
					source={require("../assets/images/eventIcon.png")}
					style={{ width: 50, height: 50, resizeMode: "contain" }}
				/>
			</TouchableOpacity>
		</View>
	);
}
