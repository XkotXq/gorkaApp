import { View, Text, ScrollView, Image } from "react-native";
import React, { useRef, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import ButtonAnim from "../../../components/ui/ButtonAnim";
import CustomBottomSheet from "../../../components/CustomBottomSheet";
import { useRouter } from "expo-router";

const Account = () => {
	const { colors } = useTheme();
	const { authState, onLogout } = useAuth();
	const bottomSheetRef = useRef(null);
	const router = useRouter();
	// console.log(authState);
	function name(firstName, lastName) {
		if (firstName && lastName) {
			return firstName + " " + lastName;
		} else if (firstName) {
			return firstName;
		} else if (lastName) {
			return lastName;
		} else {
			return null;
		}
	}
	const conName = name(authState.firstName, authState.lastName);
	const defaultAvatar = require("../../../assets/images/GLogo.png");
	const defaultBanner = require("../../img/defaultBaner.png");


	
	return (
		<>
			<ScrollView>
				{/* {!authState.anonymous && !conName ? (
        <View className="flex justify-center items-center py-5 bg-[#badf52]">
          <Text>Dodaj imię, nazwisko i klasę</Text>
        </View>
      ) : null} */}
				<View className="border-b border-neutral-600 pb-5">
					<View className="w-full h-40 bg-neutral-400">
						<Image
							source={defaultBanner}
							style={{ width: "100%", height: "100%", resizeMode: "cover" }}
						/>
					</View>
					<View className="flex justify-center items-center bg-black rounded-full w-[128px] h-[128px] mx-auto -translate-y-[50px]">
						<View
							className="rounded-full border border-neutral-700 flex justify-center items-center"
							style={{
								width: 120,
								height: 120,
							}}>
							<Image source={defaultAvatar} style={{ height: 60, width: 60 }} />
						</View>
					</View>
					<View className="-translate-y-[30px]">
						<View>
							<Text className="font-GilroyMedium text-neutral-400 text-center">
								Imię i nazwisko
							</Text>
							<Text
								style={{ color: colors.text }}
								className="text-center font-GilroySemiBold text-2xl">
								{!authState.authenticated
									? "Anonim"
									: conName
									? conName
									: "Brak danych"}
							</Text>
						</View>
						{authState.authenticated && (
							<>
								<View>
									<Text className="font-GilroyMedium text-neutral-400 text-center">
										klasa
									</Text>
									<Text
										style={{ color: colors.text }}
										className="text-center font-GilroySemiBold text-2xl">
										{authState.class ? authState.class : "Brak danych"}
									</Text>
								</View>
								<View>
									<Text className="font-GilroyMedium text-neutral-400 text-center">
										nick
									</Text>
									<Text
										style={{ color: colors.text }}
										className="text-center font-GilroySemiBold text-2xl">
										{authState.nick}
									</Text>
								</View>
							</>
						)}
					</View>
					<View className="px-5 flex flex-col gap-3">
						{authState.authenticated && (
							<ButtonAnim
								className="bg-[#D0F601]"
								onPress={() => router.push("/(user)/editAccount")}>
								<Text className="text-lg font-GilroySemiBold">
									Edytuj konto
								</Text>
							</ButtonAnim>
						)}
						<ButtonAnim
							className="border border-[#D0F601]"
							onPress={() => onLogout()}>
							<Text className="text-lg font-GilroySemiBold text-[#D0F601]">
								{authState.authenticated ? "Wyloguj" : "Opuść anonimowe konto"}
							</Text>
						</ButtonAnim>
					</View>
				</View>
			</ScrollView>
			<CustomBottomSheet ref={bottomSheetRef} snapPoints={["40%"]}>
				<View>
					<Text className="text-lg font-GilroySemiBold text-center">
						Edytowanie konta
					</Text>
				</View>
			</CustomBottomSheet>
		</>
	);
};

export default Account;
