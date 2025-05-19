import { View, Text, ScrollView, Image, Dimensions, TextInput } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import ButtonAnim from "../../../components/ui/ButtonAnim";
import { Button } from "react-native-web";



const Add = () => {
  const { colors } = useTheme();
  const { authState } = useAuth();
  const { width, height } = Dimensions.get("window");



	return (
		<View className="min-h-screen flex justify-center items-center" style={{ height: height}}>
			<Text className="text-neutral-400 font-GilroyMedium text-2xl">TWS w przyszłości</Text>
		</View>
	);
};

export default Add;
