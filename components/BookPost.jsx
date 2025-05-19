import { View, Text, Image } from "react-native";
import React from "react";

export default function BookPost() {
	return (
		<View className="flex flex-row p-2 border border-neutral-700 rounded-lg m-1">
			<View>
				<Image
					source={require("../assets/images/GLogo.png")}
					style={{ width: 120, height: 120, resizeMode: "contain" }}
				/>
			</View>
			<View className="flex flex-col" style={{ flex: 1 }}>
				<View className="px-2">
					<Text className="font-GilroySemiBold py-2 text-[18px] text-white">
						Oblicza geografii zakres podstawowy
					</Text>
				</View>
				<View style={{ flex: 1 }}></View>
				<View className="flex flex-row justify-between px-2">
					<View>
						<Text className="text-neutral-400 text-sm">Klasa</Text>
						<Text className="text-white text-lg">III, IV</Text>
					</View>
					<View>
						<Text className="text-neutral-400 text-sm">Zakres</Text>
						<Text className="text-white text-lg">Podstawa</Text>
					</View>
					<View>
						<Text className="font-GilroySemiBold text-neutral-400 text-sm">
							cena
						</Text>
						<Text className="font-GilroySemiBold text-xl text-white text-end">
							30zł
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
}
