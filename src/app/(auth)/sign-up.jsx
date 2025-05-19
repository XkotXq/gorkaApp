import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonAnim from "../../../components/ui/ButtonAnim";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import Ginf from "../../../components/ui/Ginf/Ginf";
// import { useAuth } from "../context/AuthContext";

import Glogo from "../../../assets/images/GorkaLogo.png";

import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";

const SignUp = () => {
	const { onRegister, onLogin } = useAuth();
	const router = useRouter();

	const { colors } = useTheme();
	const [form, setForm] = useState({
		login: "",
		email: "",
		password: "",
		repeatPassword: ""
	});

	const handleCreateAccount = async () => {
		if(form.password !== form.repeatPassword) {
			alert("hasła nie są takie same")
			return
		}
		if(form.login.trim() === "" || form.email.trim() === "" || form.password.trim() === "") {
			alert("pole login lub email nie może być puste")
			return
		}
		const isRegistered = await onRegister(
			form.login,
			form.email,
			form.password,
			form.login
		);
		if (isRegistered.status === 200) {
			console.log(isRegistered);
			console.log(isRegistered.status);
			console.log(isRegistered.data);
			const isLogged = await onLogin(form.email, form.password);
			if (isLogged) {
				router.replace("/(tabs)/home");
			}
			console.log("Zarejestrowano");
		};
	};
	return (
		<KeyboardAvoidingWrapper>
			<SafeAreaView>
				{/* <ScrollView
					className="h-screen"
					contentContainerStyle={{
						paddingHorizontal: 20,
						paddingVertical: 10,
					}}> */}
				<View className="flex flex-col justify-between h-screen">
					<View>
						<View
							className="flex justify-center items-center w-full"
							// style={{ marginTop: 10 }}
						>
							<Image
								source={Glogo}
								style={{ width: 200, height: 80, resizeMode: "contain" }}
							/>
							<Text
								className="text-4xl font-GilroySemiBold my-2"
								style={{ color: colors.text }}>
								Rejestracja
							</Text>
						</View>
						<View className="flex flex-col gap-3 mt-6">
							<Text
								style={{ color: colors.text }}
								className="font-GilroyMedium ml-3">
								Login
							</Text>
							<TextInput
								title="login"
								value={form.login}
								style={{ color: colors.text }}
								onChange={(e) =>
									setForm({ ...form, login: e.nativeEvent.text })
								}
								placeholder="gorka123"
								className="bg-neutral-800 placeholder:text-neutral-500 rounded-full p-5 focus:bg-neutral-700 text-white"
							/>
							<Text
								style={{ color: colors.text }}
								className="font-GilroyMedium ml-3">
								Email
							</Text>
							<TextInput
								title="email"
								value={form.email}
								style={{ color: colors.text }}
								onChange={(e) =>
									setForm({ ...form, email: e.nativeEvent.text })
								}
								placeholder="gorka@email.com"
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
							<Text
								style={{ color: colors.text }}
								className="font-GilroyMedium ml-3">
								Powtórz hasło
							</Text>
							<PasswordInput
								title="hasło"
								style={{ color: colors.text }}
								value={form.repeatPassword}
								onChange={(e) =>
									setForm({ ...form, repeatPassword: e.nativeEvent.text })
								}
								placeholder="●●●●●●●●●●●●"
								secureTextEntry={true}
								className="bg-neutral-800 placeholder:text-neutral-500 rounded-full p-5 focus:bg-neutral-700 text-white"
							/>
						</View>
						<Text style={{ color: colors.text, marginLeft: 10, marginTop: 10 }}>
							Posiadasz już konto?{" "}
							<Text onPress={() => router.replace("/sign-in")} className="text-[#D0F601]">
								Zaloguj się
							</Text>
						</Text>

						{/* <Text style={{ color: colors.text, marginLeft: 10, marginTop: 10 }}>Nie posiadasz konta? <Link className="text-[#D0F601]" href="/sign-up">Zarejestruj się</Link></Text> */}
					</View>
					<View className="mb-5">
						<ButtonAnim onPress={handleCreateAccount} className="border border-[#D0F601] ">
							<Text className="text-lg font-GilroySemiBold text-[#D0F601]">Zarejestruj</Text>
						</ButtonAnim>
					</View>
				</View>
				{/* </ScrollView> */}
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


export default SignUp;
