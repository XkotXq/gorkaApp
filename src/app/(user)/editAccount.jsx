import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import Ginf from "../../../components/ui/Ginf/Ginf";
import React, { useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import CustomBottomSheet from "../../../components/CustomBottomSheet";
import ButtonAnim from "../../../components/ui/ButtonAnim";
// import { TextInput } from "react-native-gesture-handler";
import axios from "axios";
import WheelChooser from "../../../components/wheelChooser";

export default function EditAccount() {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL;
	const { colors } = useTheme();
	const router = useRouter();
	const { authState, changeDetails } = useAuth();
	const bottomSheetRef = useRef(null);
	const [activePage, setActivePost] = useState(0);
	const [inputValue, setInputValue] = useState("");
	const [inputValue2, setInputValue2] = useState("");
	const [inputError, setInputError] = useState(null);
	const handleOpenPress = (numberOfPage) => {
		setInputError(null);
		setActivePost(numberOfPage);
		if (numberOfPage === 1) {
			setInputValue(authState.firstName);
			setInputValue2(authState.lastName);
		} else if (numberOfPage === 2) {
			setInputValue(authState.nick);
		} else if (numberOfPage === 3) {
			setInputValue(authState?.class ? authState.class : "");
		}
		bottomSheetRef.current.present();
	};
	useState(() => { console.log(inputValue, "valueinp")}, [inputValue, inputValue2]);
	// 1-imię i nazwisko
	// 2-Nazwa użytkowinka
	// 3-Klasa
	// 4-Opis
	// 5-Avatar
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

	async function sendProfileData(data) {
		const { nick, firstName, lastName, class_ } = data;
		setInputError(null);
		const returnedChangeDetails = await changeDetails(firstName, lastName, nick, class_);
		if (returnedChangeDetails?.msg) {
			setInputError(returnedChangeDetails.msg);
		} else {
			bottomSheetRef.current.close();
		}
		setInputValue("");
		setInputValue2("");
		// axios.post(`${apiUrl}/api/profile`, data).then(() => {
		// });
	}
	const bottomSheetPages = (number) => {
		switch (number) {
			case 1:
				return (
					<View
						style={{
							flex: 1,
							justifyContent: "space-between",
							position: "relative",
						}}>
						<View style={{ flex: 1, gap: 8 }}>
							<Text
								className="text-lg font-GilroySemiBold text-center"
								style={{ color: colors.text }}>
								Edytuj imię i nazwisko
							</Text>
							<TextInput
								style={{ color: colors.text }}
								value={inputValue}
								placeholder="imię"
								onChangeText={(text) => setInputValue(text)}
								className="bg-neutral-700 placeholder:text-neutral-500 rounded-full p-5 focus:bg-neutral-600 text-white"
							/>
							<TextInput
								style={{ color: colors.text, zIndex: 10 }}
								value={inputValue2}
								placeholder="nazwisko"
								onChangeText={(text) => setInputValue2(text)}
								className="bg-neutral-700 placeholder:text-neutral-500 rounded-full p-5 focus:bg-neutral-600 text-white"
							/>
						</View>
						<View style={{ marginBottom: 20 }}>
							<ButtonAnim
								onPress={() =>
									sendProfileData({
										firstName: inputValue.trim(),
										lastName: inputValue2.trim(),
									})
								}>
								<Text className="text-lg font-GilroySemiBold text-center">
									Zapisz
								</Text>
							</ButtonAnim>
						</View>
					</View>
				);
			case 2:
				return (
					<View style={{ flex: 1, justifyContent: "space-between" }}>
						<View style={{ flex: 1, gap: 8 }}>
							<Text
								className="text-lg font-GilroySemiBold text-center"
								style={{ color: colors.text }}>
								Edytuj nazwę użytkownika
							</Text>
							<TextInput
								style={{ color: colors.text }}
								value={inputValue}
								placeholder="nazwa użytkownika"
								onChangeText={(text) => setInputValue(text)}
								className="bg-neutral-700 placeholder:text-neutral-500 rounded-full p-5 focus:bg-neutral-600 text-white"
							/>
							{
								inputError ?
									<Text style={{ color: "red" }}>
										{inputError}
									</Text>
									: null
							}
							<Text>

							</Text>
						</View>

						<View style={{ marginBottom: 20 }}>
							<ButtonAnim
								onPress={() => sendProfileData({ nick: inputValue.trim() })}>
								<Text className="text-lg font-GilroySemiBold text-center">
									Zapisz
								</Text>
							</ButtonAnim>
						</View>
					</View>
				);
			case 3:
				return (
					<View style={{ flex: 1, justifyContent: "space-between" }}>
						<View style={{ flex: 1, gap: 8 }}>
							<Text
								className="text-lg font-GilroySemiBold text-center"
								style={{ color: colors.text }}>
								Wybierz klasę
							</Text>
							{/* <TextInput
								style={{ color: colors.text }}
								value={inputValue}
								placeholder="klasa"
								onChangeText={(text) => setInputValue(text)}
								className="bg-neutral-700 placeholder:text-neutral-500 rounded-full p-5 focus:bg-neutral-600 text-white"
							/> */}
							<WheelChooser setInputValue={setInputValue} defaultValue={authState?.class}/>
						</View>
						<View style={{ marginBottom: 20 }}>
							<ButtonAnim
								onPress={() => {sendProfileData({ class_: inputValue.trim() }); bottomSheetRef.current.close();}}>
								<Text className="text-lg font-GilroySemiBold text-center">
									Zapisz
								</Text>
							</ButtonAnim>
						</View>
					</View>
				);
			case 4:
				return (
					<View style={{ flex: 1, justifyContent: "space-between" }}>
						<Text
							className="text-lg font-GilroySemiBold text-center"
							style={{ color: colors.text }}>
							Edytuj opis
						</Text>
					</View>
				);
			case 5:
				return (
					<View style={{ flex: 1, justifyContent: "space-between" }}>
						<Text
							className="text-lg font-GilroySemiBold text-center"
							style={{ color: colors.text }}>
							Edytuj avatar
						</Text>
					</View>
				);
			default:
				return null;
		}
	};

	return (
		<View>
			<View
				className="w-full bg-black border-b border-neutral-600 py-2"
				style={{ elevation: 4 }}>
				<View className="flex flex-row items-center justify-between px-3">
					<View>
						<Text
							style={{ color: colors.text }}
							className="font-GilroySemiBold py-2 text-2xl">
							Edytowanie konta
						</Text>
					</View>
					<View>
						<TouchableOpacity onPress={() => router.back()}>
							<Ginf name="arrowBack" size={38} color="white" />
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<View className="flex justify-center items-center">
				<View className="flex flex-col gap-2 justify-center items-center">
					<View
						className="rounded-full border border-neutral-700 flex justify-center items-center"
						style={{
							width: 100,
							height: 100,
						}}>
						<Image source={defaultAvatar} style={{ height: 50, width: 50 }} />
					</View>
					<View className="flex justify-center">
						<Text
							className="font-GilroySemiBold text-2xl text-center"
							style={{ color: colors.text }}>
							{conName ? conName : "[Imię i nazwisko]"}
						</Text>
						<Text className="font-GilroyMedium text-lg text-neutral-400 text-center">
							{authState.nick ? authState.nick : "[Nazwa użytkownika]"}
						</Text>
						<Text className="font-GilroyMedium text-lg text-neutral-400 text-center">
							{authState.class ? authState.class : "[klasa]"}
						</Text>
					</View>
				</View>
				<View
					className="w-full flex justify-center items-center"
					style={{ paddingTop: 30 }}>
					<View
						className="border border-neutral-600 rounded-xl w-[80%]"
						style={{ borderWidth: 1, borderColor: "#525252", width: "80%" }}>
						<TouchableOpacity
							className="w-full"
							style={{ padding: 12 }}
							onPress={() => handleOpenPress(1)}>
							<View className="flex justify-between flex-row">
								<Text className="font-GilroyMedium text-xl text-neutral-400">
									Imię i nazwisko
								</Text>
								<Ginf name="arrowTop" size={20} color="#a3a3a3" />
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							className="w-full"
							style={{ padding: 12 }}
							onPress={() => handleOpenPress(2)}>
							<View className="flex justify-between flex-row">
								<Text className="font-GilroyMedium text-xl text-neutral-400">
									Nazwa użytkownika
								</Text>
								<Ginf name="arrowTop" size={20} color="#a3a3a3" />
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							className="w-full"
							style={{ padding: 12 }}
							onPress={() => handleOpenPress(3)}>
							<View className="flex justify-between flex-row">
								<Text className="font-GilroyMedium text-xl text-neutral-400">
									Klasa
								</Text>
								<Ginf name="arrowTop" size={20} color="#a3a3a3" />
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							className="w-full"
							style={{ padding: 12 }}
							onPress={() => handleOpenPress(4)}>
							<View className="flex justify-between flex-row">
								<Text className="font-GilroyMedium text-xl text-neutral-400">
									Opis
								</Text>
								<Ginf name="arrowTop" size={20} color="#a3a3a3" />
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							className="w-full"
							style={{ padding: 12 }}
							onPress={() => handleOpenPress(5)}>
							<View className="flex justify-between flex-row">
								<Text className="font-GilroyMedium text-xl text-neutral-400">
									Avatar
								</Text>
								<Ginf name="arrowTop" size={20} color="#a3a3a3" />
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<CustomBottomSheet
				ref={bottomSheetRef}
				snapPoints={["50%"]}
				scrollView={false}>
				{/* <View className="flex-grow">
					<Text className="text-lg font-GilroySemiBold text-center">
						Edytowanie konta
					</Text>
					<View style={{ paddingHorizontal: 10}}>
						<BottomSheetPages number={activePage} colors={colors} />
					</View>
				</View> */}
				{/* <BottomSheetPages number={activePage} colors={colors} />
				 */}
				<View style={{ paddingHorizontal: 10, flex: 1 }}>
					{bottomSheetPages(activePage)}
				</View>
			</CustomBottomSheet>
		</View>
	);
}
