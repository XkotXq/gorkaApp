import { View, Text, TextInput, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonAnim from "../../../components/ui/ButtonAnim";
import { useAuth } from "../context/AuthContext";
import Ginf from "../../../components/ui/Ginf/Ginf";

import Glogo from "../../../assets/images/GorkaLogo.png";
import { Link, useRouter } from "expo-router";

import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";

const SignIn = () => {
	const { colors } = useTheme();
	const { onLogin, onAnonymous } = useAuth();
	const router = useRouter();
	const [error, setError] = useState(null);

	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	const handleLogin = async () => {
		const isLogged = await onLogin(form.email, form.password);
		console.log(isLogged.msg);
		if ((isLogged.msg = "User not found")) {
			setError("Niepoprawny login/ email");
		} else if ((isLogged.msg = "Invalid credentials")) {
			setError("Niepoprawne hasło");
		}
		if (isLogged.status === 200) {
			router.replace("/(tabs)/home");
		}
	};
	return (
		<KeyboardAvoidingWrapper>
			<SafeAreaView className="h-screen">
				<View className="flex flex-col justify-between h-screen">
					<View>
						<View
							className="flex justify-center items-center w-full"
							style={{ marginTop: 10 }}>
							<Image
								source={Glogo}
								style={{ width: 200, height: 60, resizeMode: "contain" }}
							/>
							<Text
								className="text-4xl font-GilroySemiBold my-5"
								style={{ color: colors.text }}>
								Logowanie
							</Text>
						</View>
						<View className="flex flex-col gap-3 mt-6">
							<Text
								style={{ color: colors.text }}
								className="font-GilroyMedium ml-3">
								Login lub email
							</Text>
							<TextInput
								title="login/ email"
								value={form.email}
								style={{ color: colors.text }}
								onChange={(e) =>
									setForm({ ...form, email: e.nativeEvent.text })
								}
								placeholder="gorka123"
								className="bg-neutral-800 placeholder:text-neutral-500 rounded-full p-5 focus:bg-neutral-700 text-white"
							/>
							<Text
								style={{ color: colors.text }}
								className="font-GilroyMedium ml-3">
								Hasło
							</Text>
							<PasswordInput
								title="hasło"
								style={{ color: colors.text }}
								value={form.password}
								onChange={(e) =>
									setForm({ ...form, password: e.nativeEvent.text })
								}
								placeholder="●●●●●●●●●●●●"
								secureTextEntry={true}
								className="bg-neutral-800 placeholder:text-neutral-500 rounded-full p-5 focus:bg-neutral-700 text-white"
							/>
						</View>
						<Text style={{ color: colors.text, marginLeft: 10, marginTop: 10 }}>
							Nie posiadasz konta?{" "}
							<Text
								className="text-[#D0F601]"
								onPress={() => router.push("/sign-up")}>
								Zarejestruj się
							</Text>
						</Text>
					</View>
					<View className="flex flex-col gap-4">
						<ButtonAnim
							className="border border-[#D0F601]"
							onPress={handleLogin}>
							<Text className="text-lg font-GilroySemiBold text-[#D0F601]">
								Zaloguj
							</Text>
						</ButtonAnim>
						<ButtonAnim
							className="border border-neutral-400"
							style={{ borderColor: "#a3a3a3" }}
							onPress={() => {
								onAnonymous();
								router.replace("/(tabs)/home");
							}}>
							<Text className="text-lg font-GilroySemiBold text-neutral-400">
								Pomiń logowanie
							</Text>
						</ButtonAnim>
					</View>
				</View>
			</SafeAreaView>
		</KeyboardAvoidingWrapper>
	);
};

const PasswordInput = ({ value, onChange }) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	return (
		<View>
			<TextInput
				title="hasło"
				value={value}
				onChange={onChange}
				placeholder={!isPasswordVisible ? "●●●●●●●●●●●●" : "Górk@Górą128"}
				secureTextEntry={!isPasswordVisible}
				className="bg-neutral-800 placeholder:text-neutral-500 rounded-full p-5 focus:bg-neutral-700 text-white"
			/>
			<TouchableOpacity
				onPress={() => setIsPasswordVisible(!isPasswordVisible)}
				style={{
					position: "absolute",
					right: 15,
					top: "50%",
					transform: [{ translateY: -12 }],
				}}>
				<Ginf
					name={!isPasswordVisible ? "eye" : "eyeClosed"}
					size={24}
					color="#a3a3a3"
				/>
			</TouchableOpacity>
		</View>
	);
};

export default SignIn;
