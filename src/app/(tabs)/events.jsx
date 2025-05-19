import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "@react-navigation/native";
import Ginf from "../../../components/ui/Ginf/Ginf";

// import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Events() {
	const router = useRouter();
	const { authState } = useAuth();
	const { colors } = useTheme();
	return (
		<View style={{
						flex: 1,
						position: "relative",
					}}>
			<View className="w-full bg-black border-b border-neutral-600 py-1">
				<View className="flex flex-row items-center justify-between px-3">
					<View>
						<Text
							style={{ color: colors.text }}
							className="font-GilroySemiBold py-2 text-2xl">
							Nadchodzące wydarzenia
						</Text>
					</View>
					{authState.role === "admin" && (
						<View>
							<TouchableOpacity
								// onPress={() => router.push("/(admin)/managePosts")}
								>
								<Ginf name="verif" size={38} color="white" />
							</TouchableOpacity>
						</View>
					)}
				</View>
			</View>
			<View>
				<ScrollView>
					<View>
						<View><Text>Tytuł</Text></View>
						<View><Text>Zdjęcia</Text></View>
						<View><Text>Opis</Text></View>
						<View><Text>data rozpoczęcia, data zakończenia, miejsce wydarzenia, zakres klas, koszt uczestnictwa</Text></View>
					</View>
					<Text className="font-GilroySemiBold text-3xl text-neutral-400 text-center mt-5">
						W przyszłości
					</Text>
				</ScrollView>
			</View>
		</View>
	);
}
